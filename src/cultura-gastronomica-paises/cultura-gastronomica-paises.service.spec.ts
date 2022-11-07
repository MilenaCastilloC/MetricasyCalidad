import { Test, TestingModule } from '@nestjs/testing';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { PaisEntity } from '../pais/pais.entity';
import { Repository } from 'typeorm';
import { CulturaGastronomicaPaisesService } from './cultura-gastronomica-paises.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { ConsoleLogger } from '@nestjs/common';

describe('CulturaGastronomicaPaisesService', () => {
  let service: CulturaGastronomicaPaisesService;
  let paisRepository: Repository<PaisEntity>;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let paisesLista: PaisEntity[];
  let culturaGastronomica: CulturaGastronomicaEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaGastronomicaPaisesService],
    }).compile();

    service = module.get<CulturaGastronomicaPaisesService>(CulturaGastronomicaPaisesService);
    paisRepository = module.get<Repository<PaisEntity>>(getRepositoryToken(PaisEntity));
    culturaGastronomicaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    culturaGastronomicaRepository.clear();
    paisRepository.clear();
    paisesLista = [];
    for (let i = 0; i < 5; i++) {
      const pais: PaisEntity = await paisRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.company.catchPhraseDescriptor(),
      })
      paisesLista.push(pais);
    }

    culturaGastronomica = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
      paises: paisesLista
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


});
