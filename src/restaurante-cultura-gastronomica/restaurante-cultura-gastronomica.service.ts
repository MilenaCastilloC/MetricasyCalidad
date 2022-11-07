import { Injectable } from '@nestjs/common';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class RestauranteCulturaGastronomicaService {
    constructor(
        @InjectRepository(RestauranteEntity)
        private readonly restauranteRepository: Repository<RestauranteEntity>,
    
        @InjectRepository(CulturaGastronomicaEntity)
        private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>
    ) {}

    async addCulturaGastronomicaRestaurante(resturanteId: string, culturaGastronomicaId: string): Promise<RestauranteEntity> {
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaGastronomicaId}});
        if (!culturaGastronomica)
          throw new BusinessLogicException("No se encontró la cultura gastronomica con la identificación dada", BusinessError.NOT_FOUND);
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: resturanteId}, relations: ["culturasGastronomicas", "pais"]}) 
        if (!restaurante)
          throw new BusinessLogicException("No se encontró el restaurante con la identificación proporcionada.", BusinessError.NOT_FOUND);
        restaurante.culturasGastronomicas = [...restaurante.culturasGastronomicas, culturaGastronomica];
        return await this.restauranteRepository.save(restaurante);
      }

    async findCulturaGastronomicaPorRestauranteIdCulturaGastronomicaId(restauranteId: string, culturaGastronomicaId: string): Promise<CulturaGastronomicaEntity> {
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaGastronomicaId}});
        if (!culturaGastronomica)
          throw new BusinessLogicException("No se encontró la cultura gastronomica con la identificación dada", BusinessError.NOT_FOUND)
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["culturasGastronomicas"]}); 
        if (!restaurante)
          throw new BusinessLogicException("No se encontró el restaurante con la identificación proporcionada.", BusinessError.NOT_FOUND)
        const restauranteCulturaGastronomica: CulturaGastronomicaEntity = restaurante.culturasGastronomicas.find(e => e.id === culturaGastronomica.id);
        if (!restauranteCulturaGastronomica)
          throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no está asociada al restaurante.", BusinessError.PRECONDITION_FAILED)
        return restauranteCulturaGastronomica;
    }

    async findCulturasGastronomicasPorRestauranteId(restauranteId: string): Promise<CulturaGastronomicaEntity[]> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["culturasGastronomicas"]});
        if (!restaurante)
          throw new BusinessLogicException("No se encontró el restaurante con la identificación proporcionada.", BusinessError.NOT_FOUND)
        return restaurante.culturasGastronomicas;
    }

    async associateCulturasGastronomicasRestaurante(restauranteId: string, culturasGastronomicas: CulturaGastronomicaEntity[]): Promise<RestauranteEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["culturasGastronomicas"]});
        if (!restaurante)
          throw new BusinessLogicException("No se encontró el restaurante con la identificación proporcionada.", BusinessError.NOT_FOUND)
        for (let i = 0; i < culturasGastronomicas.length; i++) {
          const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: `${culturasGastronomicas[i].id}` }});
          if (!culturaGastronomica)
            throw new BusinessLogicException("No se encontró la cultura gastronomica con la identificación dada", BusinessError.NOT_FOUND)
        }
        restaurante.culturasGastronomicas = culturasGastronomicas;
        return await this.restauranteRepository.save(restaurante);
    }

    async deleteCulturaGastronomicaRestaurante(restauranteId: string, culturaGastronomicaId: string){
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaGastronomicaId}});
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["culturasGastronomicas"]});
        if (!restaurante)
          throw new BusinessLogicException("No se encontró el restaurante con la identificación proporcionada.", BusinessError.NOT_FOUND)
        if (!culturaGastronomica)
          throw new BusinessLogicException("No se encontró la cultura gastronomica con la identificación dada", BusinessError.NOT_FOUND)
        const restauranteCulturaGastronomica: CulturaGastronomicaEntity = restaurante.culturasGastronomicas.find(e => e.id === culturaGastronomica.id);
        if (!restauranteCulturaGastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no está asociada al restaurante.", BusinessError.PRECONDITION_FAILED)
        restaurante.culturasGastronomicas = restaurante.culturasGastronomicas.filter(e => e.id !== culturaGastronomicaId);
        await this.restauranteRepository.save(restaurante);
    }   
}
