import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RecetaCulturaGastronomicaService } from './receta-cultura-gastronomica.service';
import { RecetaEntity } from '../receta/receta.entity';
import { RecetaCulturaGastronomicaController } from './receta-cultura-gastronomica.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RecetaEntity, CulturaGastronomicaEntity])],
  providers: [RecetaCulturaGastronomicaService],
  controllers: [RecetaCulturaGastronomicaController]
})
export class RecetaCulturaGastronomicaModule {}