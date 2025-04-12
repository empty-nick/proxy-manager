import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Proxy as ProxyEntity } from './proxy.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ProxyFactoryService } from './factory/proxy-factory.service';

@Injectable()
export class ProxyService {
  constructor(
    @InjectRepository(ProxyEntity)
    private proxyRepo: Repository<ProxyEntity>,
    private readonly httpService: HttpService,
    private readonly proxyFactory: ProxyFactoryService,
  ) {}

  async fetchProxyData(url: string): Promise<Partial<ProxyEntity>> {
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      console.log('response', response, response.data);
      return response.data;
    } catch (err) {
      throw new Error(`Error fetchProxyData by url :${url}`);
    }
  }

  async fetchProxy(url: string | string[]): Promise<void> {
    if (Array.isArray(url)) {
      for (const urlPath of url) {
        const proxy = this.proxyFactory.getService(urlPath);
        const proxyArray = await proxy.getProxy(urlPath);
        proxyArray.forEach((proxy) => {
          this.addProxyData(proxy);
        });
      }
    } else {
      const proxy = this.proxyFactory.getService(url);
      const proxyArray = await proxy.getProxy(url);
      proxyArray.forEach((proxy) => {
        this.addProxyData(proxy);
      });
    }
  }

  async getAllProxies(): Promise<ProxyEntity[]> {
    return this.proxyRepo.find();
  }

  async clearDatabase(): Promise<void> {
    return this.proxyRepo.clear();
  }

  async addProxyData(proxyData: Partial<ProxyEntity>): Promise<ProxyEntity> {
    const newProxy = this.proxyRepo.create(proxyData);
    return this.proxyRepo.save(newProxy);
  }
}
