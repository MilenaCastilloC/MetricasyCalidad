import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoCaracteristicoEntity } from './producto-caracteristico.entity';
import { ProductoCaracteristicoService } from './producto-caracteristico.service';
import { ProductoCaracteristicoController } from './producto-caracteristico.controller';
import { ProductoCaracteristicoResolver } from './producto-caracteristico.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoCaracteristicoEntity])],
  providers: [ProductoCaracteristicoService, ProductoCaracteristicoResolver],
  controllers: [ProductoCaracteristicoController]
})
export class ProductoCaracteristicoModule {}
