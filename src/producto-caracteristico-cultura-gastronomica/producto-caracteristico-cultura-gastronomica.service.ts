import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoCaracteristicoEntity } from '../producto-caracteristico/producto-caracteristico.entity';
import { Repository } from 'typeorm/repository/Repository';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';

@Injectable()
export class ProductoCaracteristicoCulturaGastronomicaService {

  constructor(
    @InjectRepository(ProductoCaracteristicoEntity)
    private readonly productoCaracteristicoRepository: Repository<ProductoCaracteristicoEntity>,

    @InjectRepository(CulturaGastronomicaEntity)
    private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>
  ) { }

  async addCulturaGastronomicaProductoCaracteristico(productoCaracteristicoId: string, culturaGastronomicaId: string): Promise<ProductoCaracteristicoEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: culturaGastronomicaId } });
    if (!culturaGastronomica)
      throw new BusinessLogicException("No se encontró la cultura gastronomica con la identificación dada", BusinessError.NOT_FOUND);
    const productoCaracteristico: ProductoCaracteristicoEntity = await this.productoCaracteristicoRepository.findOne({ where: { id: productoCaracteristicoId }, relations: ["culturasGastronomicas"] })
    if (!productoCaracteristico)
      throw new BusinessLogicException("No se encontró el productoCaracteristico con la identificación proporcionada.", BusinessError.NOT_FOUND);
    productoCaracteristico.culturasGastronomicas = [...productoCaracteristico.culturasGastronomicas, culturaGastronomica];
    return await this.productoCaracteristicoRepository.save(productoCaracteristico);
  }

  async findCulturaGastronomicaPorProductoCaracteristicoIdCulturaGastronomicaId(ProductoCaracteristicoId: string, culturaGastronomicaId: string): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: culturaGastronomicaId } });
    if (!culturaGastronomica)
      throw new BusinessLogicException("No se encontró la cultura gastronomica con la identificación dada", BusinessError.NOT_FOUND)
    const productoCaracteristico: ProductoCaracteristicoEntity = await this.productoCaracteristicoRepository.findOne({ where: { id: ProductoCaracteristicoId }, relations: ["culturasGastronomicas"] });
    if (!productoCaracteristico)
      throw new BusinessLogicException("No se encontró el productoCaracteristico con la identificación proporcionada.", BusinessError.NOT_FOUND)
    const productoCaracteristicoCulturaGastronomica: CulturaGastronomicaEntity = productoCaracteristico.culturasGastronomicas.find(e => e.id === culturaGastronomica.id);
    if (!productoCaracteristicoCulturaGastronomica)
      throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no está asociada al productoCaracteristico.", BusinessError.PRECONDITION_FAILED)
    return productoCaracteristicoCulturaGastronomica;
  }

  async findCulturasGastronomicasPorProductoCaracteristicoId(productoCaracteristicoIdId: string): Promise<CulturaGastronomicaEntity[]> {
    const productoCaracteristico: ProductoCaracteristicoEntity = await this.productoCaracteristicoRepository.findOne({ where: { id: productoCaracteristicoIdId }, relations: ["culturasGastronomicas"] });
    if (!productoCaracteristico)
      throw new BusinessLogicException("No se encontró el productoCaracteristico con la identificación proporcionada.", BusinessError.NOT_FOUND)
    return productoCaracteristico.culturasGastronomicas;
  }

  async associateCulturasGastronomicasProductoCaracteristico(productoCaracteristicoId: string, culturasGastronomicas: CulturaGastronomicaEntity[]): Promise<ProductoCaracteristicoEntity> {
    const productoCaracteristico: ProductoCaracteristicoEntity = await this.productoCaracteristicoRepository.findOne({ where: { id: productoCaracteristicoId }, relations: ["culturasGastronomicas"] });
    if (!productoCaracteristico)
      throw new BusinessLogicException("No se encontró el productoCaracteristico con la identificación proporcionada.", BusinessError.NOT_FOUND)
    for (let i = 0; i < culturasGastronomicas.length; i++) {
      const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: `${culturasGastronomicas[i].id}` } });
      if (!culturaGastronomica)
        throw new BusinessLogicException("No se encontró la cultura gastronomica con la identificación dada", BusinessError.NOT_FOUND)
    }
    productoCaracteristico.culturasGastronomicas = culturasGastronomicas;
    return await this.productoCaracteristicoRepository.save(productoCaracteristico);
  }

  async deleteCulturaGastronomicaProductoCaracteristico(productoCaracteristicoId: string, culturaGastronomicaId: string) {
    const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: culturaGastronomicaId } });
    if (!culturaGastronomica)
      throw new BusinessLogicException("No se encontró la cultura gastronomica con la identificación dada", BusinessError.NOT_FOUND)
    const productoCaracteristico: ProductoCaracteristicoEntity = await this.productoCaracteristicoRepository.findOne({ where: { id: productoCaracteristicoId }, relations: ["culturasGastronomicas"] });
    if (!productoCaracteristico)
      throw new BusinessLogicException("No se encontró el productoCaracteristico con la identificación proporcionada.", BusinessError.NOT_FOUND)
    const productoCaracteristicoCulturaGastronomica: CulturaGastronomicaEntity = productoCaracteristico.culturasGastronomicas.find(e => e.id === culturaGastronomica.id);

    if (!productoCaracteristicoCulturaGastronomica)
      throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no está asociada al productoCaracteristico.", BusinessError.PRECONDITION_FAILED)

    productoCaracteristico.culturasGastronomicas = productoCaracteristico.culturasGastronomicas.filter(e => e.id !== culturaGastronomicaId);
    await this.productoCaracteristicoRepository.save(productoCaracteristico);
  }
}