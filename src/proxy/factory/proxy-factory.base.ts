import { HttpService } from '@nestjs/axios';
import { Proxy as ProxyEntity } from '../proxy.entity';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';
import { GeonodeResponseType } from '../types';

@Injectable()
export abstract class ProxyFactory {
  abstract getProxy(url: string): Promise<Array<Partial<ProxyEntity>>>;
}

@Injectable()
export class ProxyDidsoft extends ProxyFactory {
  constructor(private readonly httpService: HttpService) {
    super();
  }
  async getProxy(url: string): Promise<Array<Partial<ProxyEntity>>> {
    const { data: html } = await firstValueFrom(this.httpService.get(url));
    const proxies: Array<Partial<ProxyEntity>> = [];
    const cher = cheerio.load(html);
    cher('table.table.table-striped.table-bordered tbody tr').each((_, row) => {
      const cells = cher(row).find('td');

      // Достаем значения
      const ip = cher(cells[0]).text().trim();
      const port = parseInt(cher(cells[1]).text().trim(), 10);
      const region = cher(cells[2]).text().trim();
      const isHttps = cher(cells[6]).text().trim() === 'Yes';
      const protocol = isHttps ? 'HTTPS' : 'HTTP';

      // Добавляем объект в массив
      proxies.push({
        ip,
        port,
        region,
        protocol,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isSecure: false,
        password: null,
        source: url,
      });
    });
    return proxies;
  }
}

@Injectable()
export class ProxyGeonode extends ProxyFactory {
  private page: number = 1;
  private limit: number = 500;
  private isDataExists = true;
  private proxies: Array<GeonodeResponseType> = [];
  constructor(private readonly httpService: HttpService) {
    super();
  }

  formatToProxyType(
    proxies: Array<GeonodeResponseType>,
    url: string,
  ): Array<Partial<ProxyEntity>> {
    return proxies.map((proxy) => ({
      ip: proxy.ip,
      source: url,
      password: null,
      updatedAt: new Date(),
      createdAt: new Date(),
      isActive: true,
      isSecure: false,
      port: Number(proxy.port),
      region: proxy.country,
      protocol: proxy.protocols.join(' '),
    }));
  }

  async getProxy(url: string): Promise<any> {
    do {
      const { data } = await firstValueFrom(
        this.httpService.get(url, {
          params: {
            limit: this.limit,
            page: this.page,
          },
        }),
      );
      this.proxies.push(...data.data);
      this.isDataExists = Boolean(data.data.length);
      this.page = this.page + 1;
    } while (this.isDataExists);
    return this.formatToProxyType(this.proxies, url);
  }
}
