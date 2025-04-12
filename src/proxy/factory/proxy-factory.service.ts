import { Injectable } from '@nestjs/common';
import { ProxyDidsoft, ProxyFactory, ProxyGeonode } from './proxy-factory.base';
import { DidsoftAvailableProxies } from '../constants';

@Injectable()
export class ProxyFactoryService {
  constructor(
    private readonly proxyDidsoft: ProxyDidsoft,
    private readonly proxyGeonode: ProxyGeonode,
  ) {}

  getService(url: string): ProxyFactory {
    if (DidsoftAvailableProxies[url]) {
      return this.proxyDidsoft;
    } else if (url.includes('geonode')) {
      return this.proxyGeonode;
    }
  }
}
