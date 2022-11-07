import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';
import { faker } from '@faker-js/faker';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { CacheModule } from '@nestjs/common';

describe('PaisService', () => {
  let service: PaisService;
  let repository: Repository<PaisEntity>;
  let paisLista: PaisEntity[];
  let restaurantesLista: RestauranteEntity[];
  let culturaGastronomicaLista: CulturaGastronomicaEntity[];
  let pais: PaisEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register({isGlobal:true})],
      providers: [PaisService],
    }).compile();

    service = module.get<PaisService>(PaisService);
    repository = module.get<Repository<PaisEntity>>(getRepositoryToken(PaisEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    paisLista = [];
    for(let i = 0; i < 5; i++){
        pais = await repository.save({
          nombre: faker.company.name(),
      })
      paisLista.push(pais);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todos los paises', async () => {
    const paises: PaisEntity[] = await service.findAll();
    expect(paises).not.toBeNull();
    expect(paises).toHaveLength(paisLista.length);
  });

  it('findOne deberia retornar un pais por Id', async () => {
    const almacenadoPaises: PaisEntity = paisLista[0];
    const pais: PaisEntity = await service.findOne(almacenadoPaises.id);
    expect(pais).not.toBeNull();
    expect(pais.nombre).toEqual(almacenadoPaises.nombre)
  });

  it('findOne debería lanzar una excepción para un pais inválido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "No se encontró el pais con la identificación proporcionada.")
  });

  it('create deberia retornar un nuevo pais', async () => {
    const pais: PaisEntity = {
      id: "",
      nombre: faker.company.name(),
      restaurantes: restaurantesLista,
      culturasGastronomicas: culturaGastronomicaLista,
    }
 
    const nuevoPais: PaisEntity = await service.create(pais);
    expect(nuevoPais).not.toBeNull();
 
    const almacenadoPais: PaisEntity = await repository.findOne({where: {id: `${nuevoPais.id}` }})
    expect(almacenadoPais).not.toBeNull();
    expect(almacenadoPais.nombre).toEqual(nuevoPais.nombre)
  });

  it('update debería modificar un pais', async () => {
    const pais: PaisEntity = paisLista[0];
    pais.nombre = "Nuevo nombre";
    const paisActualizado: PaisEntity = await service.update(pais.id, pais);
    expect(paisActualizado).not.toBeNull();
    const paisAlmacenado: PaisEntity = await repository.findOne({ where: { id: `${pais.id}` } })
    expect(paisAlmacenado).not.toBeNull();
    expect(paisAlmacenado.nombre).toEqual(pais.nombre)
  });

  it('update debería lanzar una excepción para un pais inválido', async () => {
    let pais: PaisEntity = paisLista[0];
    pais = {
      ...pais, nombre: "Nuevo nombre"
    }
    await expect(() => service.update("0", pais)).rejects.toHaveProperty("message", "No se encontró el pais con la identificación proporcionada.")
  });

  it('delete debería eliminar un pais', async () => {
    const pais: PaisEntity = paisLista[0];
    await service.delete(pais.id);
     const paisEliminado: PaisEntity = await repository.findOne({ where: { id: `${pais.id}` } })
    expect(paisEliminado).toBeNull();
  });

  it('delete debería lanzar una excepción para un pais inválido', async () => {
    const pais: PaisEntity = paisLista[0];
    await service.delete(pais.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "No se encontró el pais con la identificación proporcionada.")
  });
});