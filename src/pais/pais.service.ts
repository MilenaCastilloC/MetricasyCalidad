import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { PaisEntity } from './pais.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class PaisService {

  cacheKey = "pais";

  constructor(
    @InjectRepository(PaisEntity)
    private readonly paisRepository: Repository<PaisEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}
    
  async findAll(): Promise<PaisEntity[]> {
    const cached: PaisEntity[] = await this.cacheManager.get<PaisEntity[]>(this.cacheKey);
      
    if(!cached){
        const pais: PaisEntity[] = await this.paisRepository.find();
        await this.cacheManager.set(this.cacheKey, pais);
        return pais;
    }

    return cached;
  }
  
  async findOne(id: string): Promise<PaisEntity> {
    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id }
    });
    if (!pais)
    throw new BusinessLogicException(
      'No se encontró el pais con la identificación proporcionada.',
      BusinessError.NOT_FOUND,
      );
      return pais;
  }
    
  async create(pais: PaisEntity): Promise<PaisEntity> {
    return await this.paisRepository.save(pais);
  }
    
  async update(id: string, pais: PaisEntity): Promise<PaisEntity> {
    const persistepais: PaisEntity = await this.paisRepository.findOne({
      where: { id },
    });
    if (!persistepais)
    throw new BusinessLogicException(
      'No se encontró el pais con la identificación proporcionada.',
      BusinessError.NOT_FOUND,
      );
      pais.id = id;
      return await this.paisRepository.save(pais);
  }
      
  async delete(id: string) {
    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id },
    });
    if (!pais)
    throw new BusinessLogicException(
      'No se encontró el pais con la identificación proporcionada.',
      BusinessError.NOT_FOUND,
      );
      await this.paisRepository.remove(pais);
  }
}