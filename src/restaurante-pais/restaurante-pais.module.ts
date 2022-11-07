import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisEntity } from '../pais/pais.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { RestaurantePaisService } from './restaurante-pais.service';
import { RestaurantePaisController } from './restaurante-pais.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RestauranteEntity, PaisEntity])],
  providers: [RestaurantePaisService],
  controllers: [RestaurantePaisController]
})
export class RestaurantePaisModule {}
