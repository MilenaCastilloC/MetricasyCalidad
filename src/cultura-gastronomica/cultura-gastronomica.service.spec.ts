import { Test, TestingModule } from '@nestjs/testing';
import { CulturaGastronomicaService } from './cultura-gastronomica.service';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from './cultura-gastronomica.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/common';

describe('CulturaGastronomicaService', () => {
  let service: CulturaGastronomicaService;
  let repository: Repository<CulturaGastronomicaEntity>;
  let culturaGastronomicaLista: CulturaGastronomicaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register({isGlobal:true})],
      providers: [CulturaGastronomicaService],
    }).compile();

    service = module.get<CulturaGastronomicaService>(CulturaGastronomicaService);
    repository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    culturaGastronomicaLista = [];
    for(let i = 0; i < 5; i++){
        const culturaGastronomica: CulturaGastronomicaEntity = await repository.save({
          nombre: faker.company.name(),
          descripcion: faker.company.catchPhraseDescriptor(),
          restaurantes: [],
          productosCaracteristicos: [],
          recetas: [],
        })
      culturaGastronomicaLista.push(culturaGastronomica);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todas las culturas gastronomica', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity[] = await service.findAll();
    expect(culturaGastronomica).not.toBeNull();
    expect(culturaGastronomica).toHaveLength(culturaGastronomicaLista.length);
  });

  it('findOne deberia retornar una cultura gastronomica por Id', async () => {
    const almacenadoCulturaGastronomica: CulturaGastronomicaEntity = culturaGastronomicaLista[0];
    const culturaGastronomica: CulturaGastronomicaEntity = await service.findOne(almacenadoCulturaGastronomica.id);
    expect(culturaGastronomica).not.toBeNull();
    expect(culturaGastronomica.nombre).toEqual(almacenadoCulturaGastronomica.nombre)
  });

  it('findOne debería lanzar una excepción para una cultura gastronomica inválida', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "No se encontró la cultura gastronómica con la identificación proporcionada.")
  });

  it('create deberia retornar una cultura gastronomica', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity = {
      id: "",
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
      restaurantes: [],
      productosCaracteristicos: [],
      recetas: [],
      paises: []
    }
 
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = await service.create(culturaGastronomica);
    expect(nuevaCulturaGastronomica).not.toBeNull();
 
    const almacenadoCulturaGastronomica: CulturaGastronomicaEntity = await repository.findOne({where: {id: `${nuevaCulturaGastronomica.id}` }})
    expect(almacenadoCulturaGastronomica).not.toBeNull();
    expect(almacenadoCulturaGastronomica.nombre).toEqual(nuevaCulturaGastronomica.nombre)
  });

  it('update debería modificar una cultura gastronomica', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity = culturaGastronomicaLista[0];
    culturaGastronomica.nombre = "Nuevo nombre";
    const culturaGastronomicaActualizado: CulturaGastronomicaEntity = await service.update(culturaGastronomica.id, culturaGastronomica);
    expect(culturaGastronomicaActualizado).not.toBeNull();
    const culturaGastronomicaAlmacenado: CulturaGastronomicaEntity = await repository.findOne({ where: { id: `${culturaGastronomica.id}` } })
    expect(culturaGastronomicaAlmacenado).not.toBeNull();
    expect(culturaGastronomicaAlmacenado.nombre).toEqual(culturaGastronomica.nombre)
  });

  it('delete debería eliminar una cultura gastronomica', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity = culturaGastronomicaLista[0];
    await service.delete(culturaGastronomica.id);
     const culturaGastronomicaEliminado: CulturaGastronomicaEntity = await repository.findOne({ where: { id: `${culturaGastronomica.id}` } })
    expect(culturaGastronomicaEliminado).toBeNull();
  });

  it('delete debería lanzar una excepción para una cultura gastronomica inválida', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity = culturaGastronomicaLista[0];
    await service.delete(culturaGastronomica.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "No se encontró la cultura gastronómica con la identificación proporcionada.")
  });
});