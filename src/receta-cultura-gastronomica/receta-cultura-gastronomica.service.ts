import { Injectable } from '@nestjs/common';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class RecetaCulturaGastronomicaService {
    constructor(
        @InjectRepository(RecetaEntity)
        private readonly recetaRepository: Repository<RecetaEntity>,
    
        @InjectRepository(CulturaGastronomicaEntity)
        private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>
    ) {}

    async addCulturaGastronomicaReceta(recetaId: string, culturaGastronomicaId: string): Promise<RecetaEntity> {
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaGastronomicaId}});
        if (!culturaGastronomica)
          throw new BusinessLogicException("No se encontró la cultura gastronomica con la identificación dada", BusinessError.NOT_FOUND);
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}, relations: ["culturasGastronomicas"]}) 
        if (!receta)
          throw new BusinessLogicException("No se encontró el receta con la identificación proporcionada.", BusinessError.NOT_FOUND);
        receta.culturasGastronomicas = [...receta.culturasGastronomicas, culturaGastronomica];
        return await this.recetaRepository.save(receta);
      }

    async findCulturaGastronomicaPorRecetaIdCulturaGastronomicaId(recetaId: string, culturaGastronomicaId: string): Promise<CulturaGastronomicaEntity> {
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaGastronomicaId}});
        if (!culturaGastronomica)
          throw new BusinessLogicException("No se encontró la cultura gastronomica con la identificación dada", BusinessError.NOT_FOUND)
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}, relations: ["culturasGastronomicas"]}); 
        if (!receta)
          throw new BusinessLogicException("No se encontró la receta con la identificación proporcionada.", BusinessError.NOT_FOUND)
        const recetaCulturaGastronomica: CulturaGastronomicaEntity = receta.culturasGastronomicas.find(e => e.id === culturaGastronomica.id);
        if (!recetaCulturaGastronomica)
          throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no está asociada a la receta.", BusinessError.PRECONDITION_FAILED)
        return recetaCulturaGastronomica;
    }

    async findCulturasGastronomicasPorRecetaId(recetaId: string): Promise<CulturaGastronomicaEntity[]> {
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}, relations: ["culturasGastronomicas"]});
        if (!receta)
          throw new BusinessLogicException("No se encontró la receta con la identificación proporcionada.", BusinessError.NOT_FOUND)
        return receta.culturasGastronomicas;
    }

    async associateCulturasGastronomicasReceta(recetaId: string, culturasGastronomicas: CulturaGastronomicaEntity[]): Promise<RecetaEntity> {
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}, relations: ["culturasGastronomicas"]});
        if (!receta)
          throw new BusinessLogicException("No se encontró la receta con la identificación proporcionada.", BusinessError.NOT_FOUND)
        for (let i = 0; i < culturasGastronomicas.length; i++) {
          const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: `${culturasGastronomicas[i].id}` }});
          if (!culturaGastronomica)
            throw new BusinessLogicException("No se encontró la cultura gastronomica con la identificación dada", BusinessError.NOT_FOUND)
        }
        receta.culturasGastronomicas = culturasGastronomicas;
        return await this.recetaRepository.save(receta);
    }

    async deleteCulturaGastronomicaReceta(recetaId: string, culturaGastronomicaId: string){
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaGastronomicaId}});
        if (!culturaGastronomica)
          throw new BusinessLogicException("No se encontró la cultura gastronomica con la identificación dada", BusinessError.NOT_FOUND)
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetaId}, relations: ["culturasGastronomicas"]});
        if (!receta)
          throw new BusinessLogicException("No se encontró la receta con la identificación proporcionada.", BusinessError.NOT_FOUND)
        const recetaCulturaGastronomica: CulturaGastronomicaEntity = receta.culturasGastronomicas.find(e => e.id === culturaGastronomica.id);
     
        if (!recetaCulturaGastronomica)
            throw new BusinessLogicException("La cultura gastronomica con el id proporcionado no está asociada a la receta.", BusinessError.PRECONDITION_FAILED)

        receta.culturasGastronomicas = receta.culturasGastronomicas.filter(e => e.id !== culturaGastronomicaId);
        await this.recetaRepository.save(receta);
    }   
}
