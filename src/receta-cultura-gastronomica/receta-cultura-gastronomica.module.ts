import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RecetaCulturaGastronomicaService } from './receta-cultura-gastronomica.service';
import { RecetaEntity } from '../receta/receta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecetaEntity, CulturaGastronomicaEntity])],
  providers: [RecetaCulturaGastronomicaService]
})
export class RecetaCulturaGastronomicaModule {}