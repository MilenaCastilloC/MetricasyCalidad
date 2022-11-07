import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoCaracteristicoEntity } from '../producto-caracteristico/producto-caracteristico.entity';
import { Repository } from 'typeorm/repository/Repository';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';

@Injectable()
export class CulturaGastronomicaProductoCaracteristicoService {

  constructor(
    @InjectRepository(ProductoCaracteristicoEntity)
    private readonly productoCaracteristicoRepository: Repository<ProductoCaracteristicoEntity>,

    @InjectRepository(CulturaGastronomicaEntity)
    private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>
  ) { }

  async addProductoCaracteristicoToCulturaGastronomica(culturaGastronomicaId: string, productoCaracteristicoId: string): Promise<CulturaGastronomicaEntity> {
    const productoCaracteristico: ProductoCaracteristicoEntity = await this.productoCaracteristicoRepository.findOne({ where: { id: productoCaracteristicoId } });
    if (!productoCaracteristico)
      throw new BusinessLogicException("No se encontró el productoCaracteristico con la identificación dada", BusinessError.NOT_FOUND);
    const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: culturaGastronomicaId }, relations: ["productosCaracteristicos"] })
    if (!culturaGastronomica)
      throw new BusinessLogicException("No se encontró la culturaGastronomica con la identificación proporcionada.", BusinessError.NOT_FOUND);
    culturaGastronomica.productosCaracteristicos = [...culturaGastronomica.productosCaracteristicos, productoCaracteristico];
    return await this.culturaGastronomicaRepository.save(productoCaracteristico);
  }

  async findProductoCaracteristicoPorProductoCaracteristicoIdCulturaGastronomicaId(culturaGastronomicaId: string, productoCaracteristicoId: string): Promise<ProductoCaracteristicoEntity> {
    const productoCaracteristico: ProductoCaracteristicoEntity = await this.productoCaracteristicoRepository.findOne({ where: { id: productoCaracteristicoId } });
    if (!productoCaracteristico)
      throw new BusinessLogicException("No se encontró el productoCaracteristico con la identificación dada", BusinessError.NOT_FOUND)
    const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: culturaGastronomicaId }, relations: ["productosCaracteristicos"] });
    if (!culturaGastronomica)
      throw new BusinessLogicException("No se encontró la culturaGastronomica con la identificación proporcionada.", BusinessError.NOT_FOUND)
    const culturaGastronomicaProductoCaracteristico: ProductoCaracteristicoEntity = culturaGastronomica.productosCaracteristicos.find(e => e.id === productoCaracteristico.id);
    if (!culturaGastronomicaProductoCaracteristico)
      throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no está asociada al productoCaracteristico.", BusinessError.PRECONDITION_FAILED)
    return culturaGastronomicaProductoCaracteristico;
  }

  async findProductosCaracteristicosPorCulturaGastronomicaId(culturaGastronomicaId: string): Promise<ProductoCaracteristicoEntity[]> {
    const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: culturaGastronomicaId }, relations: ["productosCaracteristicos"] });
    if (!culturaGastronomica)
      throw new BusinessLogicException("No se encontró la culturaGastronomica con la identificación proporcionada.", BusinessError.NOT_FOUND)
    return culturaGastronomica.productosCaracteristicos;
  }

  async associateProductosCaracteristicosToCulturaGastronomica(culturaGastronomicaId: string, productosCaracteristicos: ProductoCaracteristicoEntity[]): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: culturaGastronomicaId }, relations: ["productosCaracteristicos"] });
    if (!culturaGastronomica)
      throw new BusinessLogicException("No se encontró la culturaGastronomica con la identificación proporcionada.", BusinessError.NOT_FOUND)
    for (let i = 0; i < productosCaracteristicos.length; i++) {
      const productoCaracteristico: ProductoCaracteristicoEntity = await this.productoCaracteristicoRepository.findOne({ where: { id: `${productosCaracteristicos[i].id}` } });
      if (!productoCaracteristico)
        throw new BusinessLogicException("No se encontró el productoCaracteristico con la identificación dada", BusinessError.NOT_FOUND)
    }
    culturaGastronomica.productosCaracteristicos = productosCaracteristicos;
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async deleteProductoCaracteristicoCulturaGastronomica(culturaGastronomicaId: string, productoCaracteristicoId: string) {
    const productoCaracteristico: ProductoCaracteristicoEntity = await this.productoCaracteristicoRepository.findOne({ where: { id: productoCaracteristicoId } });
    if (!productoCaracteristico)
      throw new BusinessLogicException("No se encontró la cultura gastronomica con la identificación dada", BusinessError.NOT_FOUND)
    const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: culturaGastronomicaId }, relations: ["productosCaracteristicos"] });
    if (!culturaGastronomica)
      throw new BusinessLogicException("No se encontró el productoCaracteristico con la identificación proporcionada.", BusinessError.NOT_FOUND)
    const culturaGastronomicaProductoCaracteristico: ProductoCaracteristicoEntity = culturaGastronomica.productosCaracteristicos.find(e => e.id === productoCaracteristico.id);

    if (!culturaGastronomicaProductoCaracteristico)
      throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no está asociada al productoCaracteristico.", BusinessError.PRECONDITION_FAILED)

    culturaGastronomica.productosCaracteristicos = culturaGastronomica.productosCaracteristicos.filter(e => e.id !== productoCaracteristicoId);
    await this.culturaGastronomicaRepository.delete(culturaGastronomica);
  }
}