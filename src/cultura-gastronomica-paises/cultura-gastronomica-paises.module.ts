import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { PaisEntity } from '../pais/pais.entity';
import { CulturaGastronomicaPaisesService } from './cultura-gastronomica-paises.service';
import { CulturaGastronomicaPaisesController } from './cultura-gastronomica-paises.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PaisEntity, CulturaGastronomicaEntity])],
    providers: [CulturaGastronomicaPaisesService],
    controllers: [CulturaGastronomicaPaisesController],
})
export class CulturaGastronomicaPaisesModule {}
