import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { Proxy as ProxyEntity } from './proxy.entity';
import type { ParseProxiesBody, ResponseStatus } from './types';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('/get_all')
  getAllProxies() {
    return this.proxyService.getAllProxies();
  }

  @Post('/add')
  async addProxy(
    @Body() proxyData: Partial<ProxyEntity>,
  ): Promise<{ status: string }> {
    let addProxyStatus: string = '';
    try {
      await this.proxyService.addProxyData(proxyData);
      addProxyStatus = 'sucsex';
    } catch (e) {
      addProxyStatus = 'failed';
    }
    return { status: addProxyStatus };
  }

  @Delete('/clear_db')
  clearDatabase(): { status: string } {
    this.proxyService.clearDatabase();
    return { status: 'succsex' };
  }

  @Post('/parse_proxies')
  async add_db(@Body() { address }: ParseProxiesBody): Promise<ResponseStatus> {
    const status: ResponseStatus = { status: 'sucsex', done: true };
    const [url] = address;
    try {
      const response = await this.proxyService.fetchProxyData(url);
      console.log('response', response);
    } catch (e) {
      status.status = 'failed';
      status.done = false;
    }

    return status;
  }

  @Post('/fetch_data')
  async fetch_data(
    @Body() { url }: { url: string | string[] },
  ): Promise<ResponseStatus> {
    const status: ResponseStatus = { status: 'sucsex', done: true };
    try {
      this.proxyService.fetchProxy(url);
    } catch (e) {
      status.status = 'failed';
      status.done = false;
    }
    return status;
  }
}
