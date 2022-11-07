import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/common';

describe('RestauranteService', () => {
  let service: RestauranteService;
  let repository: Repository<RestauranteEntity>;
  let restuaranteLista: RestauranteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register({isGlobal:true})],
      providers: [RestauranteService],
    }).compile();

    service = module.get<RestauranteService>(RestauranteService);
    repository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    restuaranteLista = [];
    for(let i = 0; i < 5; i++){
        const restaurante: RestauranteEntity = await repository.save({
        nombre: faker.company.name(),
        ciudad: faker.address.city(),
        numeroEstrellasMichellin: faker.mersenne.rand(5, 0),
        fechaConsecucionMichellin: faker.date.between('2000-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z')})
        restuaranteLista.push(restaurante);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todos los restaurantes', async () => {
    const restaurantes: RestauranteEntity[] = await service.findAll();
    expect(restaurantes).not.toBeNull();
    expect(restaurantes).toHaveLength(restuaranteLista.length);
  });

  it('findOne deberia retornar un restaurante por Id', async () => {
    const almacenadoRestaurante: RestauranteEntity = restuaranteLista[0];
    const restaurante: RestauranteEntity = await service.findOne(almacenadoRestaurante.id);
    expect(restaurante).not.toBeNull();
    expect(restaurante.nombre).toEqual(almacenadoRestaurante.nombre)
    expect(restaurante.ciudad).toEqual(almacenadoRestaurante.ciudad)
    expect(restaurante.numeroEstrellasMichellin).toEqual(almacenadoRestaurante.numeroEstrellasMichellin)
    expect(restaurante.fechaConsecucionMichellin).toEqual(almacenadoRestaurante.fechaConsecucionMichellin)
  });

  it('findOne debería lanzar una excepción para un restaurante inválido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "No se encontró el restaurante con la identificación proporcionada.")
  });

  it('create deberia retornar un nuevo restaurante', async () => {
    const restaurante: RestauranteEntity = {
      id: "",
      nombre: faker.company.name(),
      ciudad: faker.address.city(),
      numeroEstrellasMichellin: faker.mersenne.rand(5, 0),
      fechaConsecucionMichellin: faker.date.between('2000-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z'),
      culturasGastronomicas: [],
      pais: null
    }
 
    const nuevoRestaurante: RestauranteEntity = await service.create(restaurante);
    expect(nuevoRestaurante).not.toBeNull();
 
    const almacenadoRestaurante: RestauranteEntity = await repository.findOne({where: {id: `${nuevoRestaurante.id}` }})
    expect(almacenadoRestaurante).not.toBeNull();
    expect(almacenadoRestaurante.nombre).toEqual(nuevoRestaurante.nombre)
    expect(almacenadoRestaurante.ciudad).toEqual(nuevoRestaurante.ciudad)
    expect(almacenadoRestaurante.numeroEstrellasMichellin).toEqual(nuevoRestaurante.numeroEstrellasMichellin)
    expect(almacenadoRestaurante.fechaConsecucionMichellin).toEqual(nuevoRestaurante.fechaConsecucionMichellin)
  });

  it('update debería modificar un restaurante', async () => {
    const restaurante: RestauranteEntity = restuaranteLista[0];
    restaurante.nombre = "Nuevo nombre";
    restaurante.ciudad = "Nueva ciudad";
     const restauranteActualizado: RestauranteEntity = await service.update(restaurante.id, restaurante);
    expect(restauranteActualizado).not.toBeNull();
     const resturanteAlmacenado: RestauranteEntity = await repository.findOne({ where: { id: `${restaurante.id}` } })
    expect(resturanteAlmacenado).not.toBeNull();
    expect(resturanteAlmacenado.nombre).toEqual(restaurante.nombre)
    expect(resturanteAlmacenado.ciudad).toEqual(restaurante.ciudad)
  });

  it('update debería lanzar una excepción para un restaurante inválido', async () => {
    let restaurante: RestauranteEntity = restuaranteLista[0];
    restaurante = {
      ...restaurante, nombre: "Nuevo nombre", ciudad: "Nueva ciudad"
    }
    await expect(() => service.update("0", restaurante)).rejects.toHaveProperty("message", "No se encontró el restaurante con la identificación proporcionada.")
  });

  it('delete debería eliminar un restaurante', async () => {
    const restaurante: RestauranteEntity = restuaranteLista[0];
    await service.delete(restaurante.id);
     const restauranteEliminado: RestauranteEntity = await repository.findOne({ where: { id: `${restaurante.id}` } })
    expect(restauranteEliminado).toBeNull();
  });

  it('delete debería lanzar una excepción para un restaurante inválido', async () => {
    const restaurante: RestauranteEntity = restuaranteLista[0];
    await service.delete(restaurante.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "No se encontró el restaurante con la identificación proporcionada.")
  });
});
