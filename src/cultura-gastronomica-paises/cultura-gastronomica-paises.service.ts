import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { PaisEntity } from '../pais/pais.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class CulturaGastronomicaPaisesService {

    constructor(
      @InjectRepository(PaisEntity)
      private readonly paisRepository: Repository<PaisEntity>,
  
      @InjectRepository(CulturaGastronomicaEntity)
      private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>
    ) { }

    async addPaisToCulturaGastronomica(culturaGastronomicaId: string, paisId: string): Promise<CulturaGastronomicaEntity> {
      const pais: PaisEntity = await this.paisRepository.findOne({ where: { id: paisId } });
      if (!pais)
        throw new BusinessLogicException("No se encontró el pais con la identificación dada", BusinessError.NOT_FOUND);
      const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: culturaGastronomicaId }, relations: ["paises"] })
      if (!culturaGastronomica)
        throw new BusinessLogicException("No se encontró la culturaGastronomica con la identificación proporcionada.", BusinessError.NOT_FOUND);
      console.log(culturaGastronomica)
      culturaGastronomica.paises = [...culturaGastronomica.paises, pais];
      return await this.culturaGastronomicaRepository.save(pais);
    }

    async findPaisPorPaisIdCulturaGastronomicaId(culturaGastronomicaId: string, paisId: string): Promise<PaisEntity> {
      const pais: PaisEntity = await this.paisRepository.findOne({ where: { id: paisId } });
      if (!pais)
        throw new BusinessLogicException("No se encontró el pais con la identificación dada", BusinessError.NOT_FOUND)
      const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: culturaGastronomicaId }, relations: ["paises"] });
      if (!culturaGastronomica)
        throw new BusinessLogicException("No se encontró la culturaGastronomica con la identificación proporcionada.", BusinessError.NOT_FOUND)
      const culturaGastronomicaPais: PaisEntity = culturaGastronomica.paises.find(e => e.id === pais.id);
      if (!culturaGastronomicaPais)
        throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no está asociada al pais.", BusinessError.PRECONDITION_FAILED)
      return culturaGastronomicaPais;
    }

    async findPaisesPorCulturaGastronomicaId(culturaGastronomicaId: string): Promise<PaisEntity[]> {
      const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: culturaGastronomicaId }, relations: ["paises"] });
      if (!culturaGastronomica)
        throw new BusinessLogicException("No se encontró la culturaGastronomica con la identificación proporcionada.", BusinessError.NOT_FOUND)
      return culturaGastronomica.paises;
    }

    async associatePaisesToCulturaGastronomica(culturaGastronomicaId: string, paises: PaisEntity[]): Promise<CulturaGastronomicaEntity> {
      const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: culturaGastronomicaId }, relations: ["paises"] });
      if (!culturaGastronomica)
        throw new BusinessLogicException("No se encontró la culturaGastronomica con la identificación proporcionada.", BusinessError.NOT_FOUND)
      for (let i = 0; i < paises.length; i++) {
        const pais: PaisEntity = await this.paisRepository.findOne({ where: { id: `${paises[i].id}` } });
        if (!pais)
          throw new BusinessLogicException("No se encontró el pais con la identificación dada", BusinessError.NOT_FOUND)
      }
      culturaGastronomica.paises = paises;
      return await this.culturaGastronomicaRepository.save(culturaGastronomica);
    }

    async deletePaisCulturaGastronomica(culturaGastronomicaId: string, paisId: string) {
      const pais: PaisEntity = await this.paisRepository.findOne({ where: { id: paisId } });
      if (!pais)
        throw new BusinessLogicException("No se encontró la cultura gastronomica con la identificación dada", BusinessError.NOT_FOUND)
      const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: culturaGastronomicaId }, relations: ["paises"] });
      if (!culturaGastronomica)
        throw new BusinessLogicException("No se encontró el pais con la identificación proporcionada.", BusinessError.NOT_FOUND)
      const culturaGastronomicaPais: PaisEntity = culturaGastronomica.paises.find(e => e.id === pais.id);
  
      if (!culturaGastronomicaPais)
        throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no está asociada al pais.", BusinessError.PRECONDITION_FAILED)
  
      culturaGastronomica.paises = culturaGastronomica.paises.filter(e => e.id !== paisId);
      await this.culturaGastronomicaRepository.delete(culturaGastronomica);
    }

}
