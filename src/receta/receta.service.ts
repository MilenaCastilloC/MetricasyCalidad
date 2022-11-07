import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RecetaEntity } from './receta.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class RecetaService {

    cacheKey = "receta";

    constructor(
        @InjectRepository(RecetaEntity)
        private readonly recetaRepository: Repository<RecetaEntity>,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async findAll(): Promise<RecetaEntity[]> {
        const cached: RecetaEntity[] = await this.cacheManager.get<RecetaEntity[]>(this.cacheKey);
          
        if(!cached){
            const receta: RecetaEntity[] = await this.recetaRepository.find({ relations: ['culturasGastronomicas'] });
            await this.cacheManager.set(this.cacheKey, receta);
            return receta;
        }
    
        return cached;
    }

    async findOne(id: string): Promise<RecetaEntity> {
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id}, relations: ["culturasGastronomicas"]});
        if (!receta)
            throw new BusinessLogicException("No se encontró la receta con la identificación proporcionada.", BusinessError.NOT_FOUND);
        return receta;
    }

    async create(receta: RecetaEntity): Promise<RecetaEntity> {
        return await this.recetaRepository.save(receta);
    }

    async update(id: string, receta: RecetaEntity): Promise<RecetaEntity> {
        const persisteReceta: RecetaEntity = await this.recetaRepository.findOne({where:{id}});
        if (!persisteReceta)
          throw new BusinessLogicException("No se encontró la receta con la identificación proporcionada.", BusinessError.NOT_FOUND);
        receta.id = id; 
        return await this.recetaRepository.save(receta);
    }
    
    async delete(id: string) {
        const receta: RecetaEntity = await this.recetaRepository.findOne({where:{id}});
        if (!receta)
          throw new BusinessLogicException("No se encontró la receta con la identificación proporcionada.", BusinessError.NOT_FOUND);
        await this.recetaRepository.remove(receta);
    }
}