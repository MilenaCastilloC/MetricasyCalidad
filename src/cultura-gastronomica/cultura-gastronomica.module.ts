import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaController } from './cultura-gastronomica.controller';
import { CulturaGastronomicaEntity } from './cultura-gastronomica.entity';
import { CulturaGastronomicaService } from './cultura-gastronomica.service';
import { CulturaGastronomicaResolver } from './cultura-gastronomica.resolver';

@Module({
  controllers: [CulturaGastronomicaController],
  providers: [CulturaGastronomicaService, CulturaGastronomicaResolver],
  imports: [
    TypeOrmModule.forFeature([CulturaGastronomicaEntity]), 
  ],
})
export class CulturaGastronomicaModule {}
