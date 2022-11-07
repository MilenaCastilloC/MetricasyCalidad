import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { Module } from '@nestjs/common';
import { ProductoCaracteristicoEntity } from '../producto-caracteristico/producto-caracteristico.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaProductoCaracteristicoService } from './cultura-gastronomica-producto-caracteristico.service';
import { CulturaGastronomicaProductoCaracteristicoController } from './cultura-gastronomica-producto-caracteristico.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoCaracteristicoEntity, CulturaGastronomicaEntity])],
  providers: [CulturaGastronomicaProductoCaracteristicoService],
  controllers: [CulturaGastronomicaProductoCaracteristicoController],
})
export class CulturaGastronomicaProductoCaracteristicoModule {}
