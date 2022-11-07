import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from './cultura-gastronomica.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class CulturaGastronomicaService {

  cacheKey = "culturaGastronomica";

  constructor(
    @InjectRepository(CulturaGastronomicaEntity)
    private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  async findAll(): Promise<CulturaGastronomicaEntity[]> {
    const cached: CulturaGastronomicaEntity[] = await this.cacheManager.get<CulturaGastronomicaEntity[]>(this.cacheKey);
      
    if(!cached){
        const culturaGastronomica: CulturaGastronomicaEntity[] = await this.culturaGastronomicaRepository.find({ relations: ['restaurantes', 'recetas', 'productosCaracteristicos'] });
        await this.cacheManager.set(this.cacheKey, culturaGastronomica);
        return culturaGastronomica;
    }

    return cached;
  }

  async findOne(id: string): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id },
        relations: ['restaurantes', 'recetas', 'productosCaracteristicos'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con la identificación proporcionada.',
        BusinessError.NOT_FOUND,
      );
    return culturaGastronomica;
  }

  async create(
    culturaGastronomica: CulturaGastronomicaEntity,
  ): Promise<CulturaGastronomicaEntity> {
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async update(
    id: string,
    culturaGastronomica: CulturaGastronomicaEntity,
  ): Promise<CulturaGastronomicaEntity> {
    const persisteCulturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id },
      });
    if (!persisteCulturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con la identificación proporcionada.',
        BusinessError.NOT_FOUND,
      );
      culturaGastronomica.id = id;
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async delete(id: string) {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id },
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'No se encontró la cultura gastronómica con la identificación proporcionada.',
        BusinessError.NOT_FOUND,
      );
    await this.culturaGastronomicaRepository.remove(culturaGastronomica);
  }
}