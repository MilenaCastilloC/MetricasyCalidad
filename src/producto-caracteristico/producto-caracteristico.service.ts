import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoCaracteristicoEntity } from './producto-caracteristico.entity'
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductoCaracteristicoService {

  cacheKey = "productoCaracteristico";

  constructor(
    @InjectRepository(ProductoCaracteristicoEntity)
    private readonly productoCaracteristicoEntityRepository: Repository<ProductoCaracteristicoEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) { }

  async findAll(): Promise<ProductoCaracteristicoEntity[]> {
    const cached: ProductoCaracteristicoEntity[] = await this.cacheManager.get<ProductoCaracteristicoEntity[]>(this.cacheKey);
      
    if(!cached){
        const productoCaracteristico: ProductoCaracteristicoEntity[] = await this.productoCaracteristicoEntityRepository.find({ relations: ['culturasGastronomicas'] });
        await this.cacheManager.set(this.cacheKey, productoCaracteristico);
        return productoCaracteristico;
    }

    return cached;
  }

  async findOne(id: string): Promise<ProductoCaracteristicoEntity> {
    const productoCaracteristico: ProductoCaracteristicoEntity = await this.productoCaracteristicoEntityRepository.findOne({ where: { id }, relations: ["culturasGastronomicas"] });
    if (!productoCaracteristico)
      throw new BusinessLogicException("No se encontró el productoCaracteristico con la identificación proporcionada.", BusinessError.NOT_FOUND);
    return productoCaracteristico;
  }

  async create(productoCaracteristico: ProductoCaracteristicoEntity): Promise<ProductoCaracteristicoEntity> {
    return await this.productoCaracteristicoEntityRepository.save(productoCaracteristico);
  }

  async update(id: string, productoCaracteristico: ProductoCaracteristicoEntity): Promise<ProductoCaracteristicoEntity> {
    const persisteProductoCaracteristico: ProductoCaracteristicoEntity = await this.productoCaracteristicoEntityRepository.findOne({ where: { id } });
    if (!persisteProductoCaracteristico)
      throw new BusinessLogicException("No se encontró el productoCaracteristico con la identificación proporcionada.", BusinessError.NOT_FOUND);
    productoCaracteristico.id = id;
    return await this.productoCaracteristicoEntityRepository.save(productoCaracteristico);
  }

  async delete(id: string) {
    const productoCaracteristico: ProductoCaracteristicoEntity = await this.productoCaracteristicoEntityRepository.findOne({ where: { id } });
    if (!productoCaracteristico)
      throw new BusinessLogicException("No se encontró el productoCaracteristico con la identificación proporcionada.", BusinessError.NOT_FOUND);
    await this.productoCaracteristicoEntityRepository.remove(productoCaracteristico);
  }
}