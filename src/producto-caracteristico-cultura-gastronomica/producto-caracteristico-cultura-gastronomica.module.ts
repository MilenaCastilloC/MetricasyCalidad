import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { ProductoCaracteristicoEntity } from '../producto-caracteristico/producto-caracteristico.entity';
import { ProductoCaracteristicoCulturaGastronomicaService } from './producto-caracteristico-cultura-gastronomica.service';
import { ProductoCaracteristicoCulturaGastronomicaController } from './producto-caracteristico-cultura-gastronomica.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoCaracteristicoEntity, CulturaGastronomicaEntity])],
  providers: [ProductoCaracteristicoCulturaGastronomicaService],
  controllers: [ProductoCaracteristicoCulturaGastronomicaController]
})
export class ProductoCaracteristicoCulturaGastronomicaModule {}
