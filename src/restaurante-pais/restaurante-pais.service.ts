import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaisEntity } from '../pais/pais.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class RestaurantePaisService {
    constructor(
        @InjectRepository(RestauranteEntity)
        private readonly restauranteRepository: Repository<RestauranteEntity>,
    
        @InjectRepository(PaisEntity)
        private readonly paisRepository: Repository<PaisEntity>
    ) {}

    async addPaisRestaurante(restauranteId: string, paisId: string): Promise<RestauranteEntity> {
        const pais: PaisEntity = await this.paisRepository.findOne({where: {id: paisId}});
        if (!pais)
          throw new BusinessLogicException("No se encontró el país con la identificación dada", BusinessError.NOT_FOUND);
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["culturasGastronomicas", "pais"]})
        if (!restaurante)
          throw new BusinessLogicException("No se encontró el restaurante con la identificación proporcionada.", BusinessError.NOT_FOUND);
        restaurante.pais = pais;
        return await this.restauranteRepository.save(restaurante);
    }

    async findPaisByRestauranteIdPaisId(restauranteId: string, paisId: string): Promise<PaisEntity> {
        const pais: PaisEntity = await this.paisRepository.findOne({where: {id: paisId}});
        if (!pais)
          throw new BusinessLogicException("No se encontró el país con la identificación dada", BusinessError.NOT_FOUND)
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["pais"]});
        if (!restaurante)
          throw new BusinessLogicException("No se encontró el restaurante con la identificación proporcionada.", BusinessError.NOT_FOUND)
        let resturantePais: PaisEntity;
        if (restaurante.pais.id === pais.id)
            resturantePais = pais;
        if (!resturantePais)
          throw new BusinessLogicException("El país con el id proporcionado no está asociado al restaurante.", BusinessError.PRECONDITION_FAILED)
        return resturantePais;
    }

    async findPaisByResturanteId(restauranteId: string): Promise<PaisEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["pais"]});
        if (!restaurante)
          throw new BusinessLogicException("No se encontró el restaurante con la identificación proporcionada.", BusinessError.NOT_FOUND)
        return restaurante.pais;
    }

    async associatePaisRestaurante(restauranteId: string, pais: PaisEntity): Promise<RestauranteEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["pais"]});
        if (!restaurante)
            throw new BusinessLogicException("No se encontró el restaurante con la identificación proporcionada.", BusinessError.NOT_FOUND)
        const paisAsociar: PaisEntity = await this.paisRepository.findOne({where: {id: `${pais.id}`}});
        if (!paisAsociar)
            throw new BusinessLogicException("No se encontró el país con la identificación dada", BusinessError.NOT_FOUND)
        restaurante.pais = pais;
        return await this.restauranteRepository.save(restaurante);
    }

    async deletePaisRestaurante(restauranteId: string, paisId: string){
        const pais: PaisEntity = await this.paisRepository.findOne({where: {id: paisId}});
        if (!pais)
          throw new BusinessLogicException("No se encontró el país con la identificación dada", BusinessError.NOT_FOUND)
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["pais"]});
        if (!restaurante)
          throw new BusinessLogicException("No se encontró el restaurante con la identificación proporcionada.", BusinessError.NOT_FOUND)
          let resturantePais: PaisEntity;
        if (restaurante.pais.id === pais.id)
              resturantePais = pais;
        if (!resturantePais)
            throw new BusinessLogicException("El país con el id proporcionado no está asociado al restaurante.", BusinessError.PRECONDITION_FAILED)
        if (restaurante.pais.id !== paisId)
          restaurante.pais= pais;
        else
          restaurante.pais = null;
        await this.restauranteRepository.save(restaurante);
    }  
}
