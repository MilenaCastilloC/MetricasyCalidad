import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { RestauranteCulturaGastronomicaService } from './restaurante-cultura-gastronomica.service';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('RestauranteCulturaGastronomicaService', () => {
  let service: RestauranteCulturaGastronomicaService;
  let restauranteRepository: Repository<RestauranteEntity>;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let restaurante: RestauranteEntity;
  let culturaGastronomicasLista: CulturaGastronomicaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestauranteCulturaGastronomicaService],
    }).compile();

    service = module.get<RestauranteCulturaGastronomicaService>(RestauranteCulturaGastronomicaService);
    restauranteRepository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
    culturaGastronomicaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    culturaGastronomicaRepository.clear();
    restauranteRepository.clear();

    culturaGastronomicasLista = [];
    for (let i = 0; i < 5; i++) {
      const culturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.company.catchPhraseDescriptor(),
      })
      culturaGastronomicasLista.push(culturaGastronomica);
    }

    restaurante = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.city(),
      numeroEstrellasMichellin: faker.mersenne.rand(5, 0),
      fechaConsecucionMichellin: faker.date.between('2000-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z'),
      culturasGastronomicas: culturaGastronomicasLista
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addCulturaGastronomicaRestaurante deber??a agregar una cultura gastronomica a un restaurante', async () => {
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
    });
    const nuevoRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.city(),
      numeroEstrellasMichellin: faker.mersenne.rand(5, 0),
      fechaConsecucionMichellin: faker.date.between('2000-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z')
    })
    const result: RestauranteEntity = await service.addCulturaGastronomicaRestaurante(nuevoRestaurante.id, nuevaCulturaGastronomica.id);
    expect(result.culturasGastronomicas.length).toBe(1);
    expect(result.culturasGastronomicas[0]).not.toBeNull();
  });

  it('addCulturaGastronomicaRestaurante deberia mostrar una excepci??n de cultura gastronomica invalida', async () => {
    const nuevoRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.city(),
      numeroEstrellasMichellin: faker.mersenne.rand(5, 0),
      fechaConsecucionMichellin: faker.date.between('2000-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z')
    })
    await expect(() => service.addCulturaGastronomicaRestaurante(nuevoRestaurante.id, "0")).rejects.toHaveProperty("message", "No se encontr?? la cultura gastronomica con la identificaci??n dada");
  });

  it('addCulturaGastronomicaRestaurante deberia mostrar una excepci??n de restaurante invalido', async () => {
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
    });
    await expect(() => service.addCulturaGastronomicaRestaurante("0", nuevaCulturaGastronomica.id)).rejects.toHaveProperty("message", "No se encontr?? el restaurante con la identificaci??n proporcionada.");
  });

  it('findCulturaGastronomicaPorRestauranteIdCulturaGastronomicaId deberia retornar cultura gastronomica por restaurante', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity = culturaGastronomicasLista[0];
    const culturaGastronomicaAlmacenada: CulturaGastronomicaEntity = await service.findCulturaGastronomicaPorRestauranteIdCulturaGastronomicaId(restaurante.id, culturaGastronomica.id,)
    expect(culturaGastronomicaAlmacenada).not.toBeNull();
  });

  it('findCulturaGastronomicaPorRestauranteIdCulturaGastronomicaId deberia mostrar una excepci??n de cultura gastronomica invalida', async () => {
    await expect(() => service.findCulturaGastronomicaPorRestauranteIdCulturaGastronomicaId(restaurante.id, "0")).rejects.toHaveProperty("message", "No se encontr?? la cultura gastronomica con la identificaci??n dada");
  });

  it('findCulturaGastronomicaPorRestauranteIdCulturaGastronomicaId deberia mostrar una excepci??n de restaurante invalido', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity = culturaGastronomicasLista[0];
    await expect(() => service.findCulturaGastronomicaPorRestauranteIdCulturaGastronomicaId("0", culturaGastronomica.id)).rejects.toHaveProperty("message", "No se encontr?? el restaurante con la identificaci??n proporcionada.");
  });

  it('findCulturaGastronomicaPorRestauranteIdCulturaGastronomicaId deberia mostrar una excepci??n para una cultura gastronomica que no esta asociada a un restaurante', async () => {
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
    });
    await expect(() => service.findCulturaGastronomicaPorRestauranteIdCulturaGastronomicaId(restaurante.id, nuevaCulturaGastronomica.id)).rejects.toHaveProperty("message", "La cultura gastronomica con el id proporcionado no est?? asociada al restaurante.");
  });

  it('findCulturasGastronomicasPorRestauranteId deberia retornar culturas gastronomicas por restaurante', async () => {
    const culturaGastronomicas: CulturaGastronomicaEntity[] = await service.findCulturasGastronomicasPorRestauranteId(restaurante.id);
    expect(culturaGastronomicas.length).toBe(5)
  });

  it('findCulturasGastronomicasPorRestauranteId deberia mostrar una excepci??n para un restaurante invalido', async () => {
    await expect(() => service.findCulturasGastronomicasPorRestauranteId("0")).rejects.toHaveProperty("message", "No se encontr?? el restaurante con la identificaci??n proporcionada.");
  });

  it('associateCulturasGastronomicasRestaurante deberia actualizar las culturas gastronomicas para un restaurante', async () => {
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
    });
    const culturaGastronomicaActualizada: RestauranteEntity = await service.associateCulturasGastronomicasRestaurante(restaurante.id, [nuevaCulturaGastronomica]);
    expect(culturaGastronomicaActualizada.culturasGastronomicas.length).toBe(1);
  });

  it('associateCulturasGastronomicasRestaurante deberia mostrar una excepci??n por restaurante invalido', async () => {
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
    });
    await expect(() => service.associateCulturasGastronomicasRestaurante("0", [nuevaCulturaGastronomica])).rejects.toHaveProperty("message", "No se encontr?? el restaurante con la identificaci??n proporcionada.");
  });

  it('associateCulturasGastronomicasRestaurante deberia mostrar una excepci??n por cultura gastronomica invalida', async () => {
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = culturaGastronomicasLista[0];
    nuevaCulturaGastronomica.id = "0";
    await expect(() => service.associateCulturasGastronomicasRestaurante(restaurante.id, [nuevaCulturaGastronomica])).rejects.toHaveProperty("message", "No se encontr?? la cultura gastronomica con la identificaci??n dada");
  });

  it('deleteCulturaGastronomicARestaurante deberia eliminar una cultura gastronomica de un restaurante', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity = culturaGastronomicasLista[0];
    await service.deleteCulturaGastronomicaRestaurante(restaurante.id, culturaGastronomica.id);
    const restauranteAlmacenado: RestauranteEntity = await restauranteRepository.findOne({ where: { id: `${restaurante.id}` }, relations: ["culturasGastronomicas"] });
    const culturaGastronomicaEliminada: CulturaGastronomicaEntity = restauranteAlmacenado.culturasGastronomicas.find(a => a.id === culturaGastronomica.id);
    expect(culturaGastronomicaEliminada).toBeUndefined();
  });

  it('deleteCulturaGastronomicARestaurante deberia mostrar excepci??n por cultura gastronomica invalida', async () => {
    await expect(() => service.deleteCulturaGastronomicaRestaurante(restaurante.id, "0")).rejects.toHaveProperty("message", "No se encontr?? la cultura gastronomica con la identificaci??n dada");
  });

  it('deleteCulturaGastronomicARestaurante deberia mostrar excepci??n por restaurante invalido', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity = culturaGastronomicasLista[0];
    await expect(() => service.deleteCulturaGastronomicaRestaurante("0", culturaGastronomica.id)).rejects.toHaveProperty("message", "No se encontr?? el restaurante con la identificaci??n proporcionada.");
  });

  it('deleteCulturaGastronomicARestaurante deberia mostrar excepci??n por cultura gastronomica sin asociacion', async () => {
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
    });
    await expect(() => service.deleteCulturaGastronomicaRestaurante(restaurante.id, nuevaCulturaGastronomica.id)).rejects.toHaveProperty("message", "La cultura gastronomica con el id proporcionado no est?? asociada al restaurante.");
  });
});