import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RestauranteEntity } from './restaurante.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class RestauranteService {

    cacheKey = "restaurante";

    constructor(
        @InjectRepository(RestauranteEntity)
        private readonly restauranteRepository: Repository<RestauranteEntity>,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async findAll(): Promise<RestauranteEntity[]> {
        const cached: RestauranteEntity[] = await this.cacheManager.get<RestauranteEntity[]>(this.cacheKey);
          
        if(!cached){
            const restaurante: RestauranteEntity[] = await this.restauranteRepository.find({ relations: ['culturasGastronomicas', 'pais'] });
            await this.cacheManager.set(this.cacheKey, restaurante);
            return restaurante;
        }
    
        return cached;
    }

    async findOne(id: string): Promise<RestauranteEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {id}, relations: ["culturasGastronomicas", "pais"]});
        if (!restaurante)
            throw new BusinessLogicException("No se encontró el restaurante con la identificación proporcionada.", BusinessError.NOT_FOUND);
        return restaurante;
    }

    async create(restaurante: RestauranteEntity): Promise<RestauranteEntity> {
        return await this.restauranteRepository.save(restaurante);
    }

    async update(id: string, restaurante: RestauranteEntity): Promise<RestauranteEntity> {
        const persisteRestaurante: RestauranteEntity = await this.restauranteRepository.findOne({where:{id}});
        if (!persisteRestaurante)
          throw new BusinessLogicException("No se encontró el restaurante con la identificación proporcionada.", BusinessError.NOT_FOUND);
        restaurante.id = id; 
        return await this.restauranteRepository.save(restaurante);
    }

    async delete(id: string) {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where:{id}});
        if (!restaurante)
          throw new BusinessLogicException("No se encontró el restaurante con la identificación proporcionada.", BusinessError.NOT_FOUND);
        await this.restauranteRepository.remove(restaurante);
    }
}
