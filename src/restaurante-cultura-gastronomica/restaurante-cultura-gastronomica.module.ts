import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { RestauranteCulturaGastronomicaService } from './restaurante-cultura-gastronomica.service';
import { RestauranteCulturaGastronomicaController } from './restaurante-cultura-gastronomica.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RestauranteEntity, CulturaGastronomicaEntity])],
  providers: [RestauranteCulturaGastronomicaService],
  controllers: [RestauranteCulturaGastronomicaController]
})
export class RestauranteCulturaGastronomicaModule {}
