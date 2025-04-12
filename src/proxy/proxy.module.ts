import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';
import { Proxy as ProxyEntity } from './proxy.entity';
import { ProxyFactoryService } from './factory/proxy-factory.service';
import { ProxyDidsoft, ProxyGeonode } from './factory/proxy-factory.base';

@Module({
  imports: [TypeOrmModule.forFeature([ProxyEntity]), HttpModule],
  controllers: [ProxyController],
  providers: [ProxyService, ProxyFactoryService, ProxyGeonode, ProxyDidsoft],
})
export class ProxyModule {}
