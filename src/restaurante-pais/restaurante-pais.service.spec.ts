import { Test, TestingModule } from '@nestjs/testing';
import { PaisEntity } from '../pais/pais.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Repository } from 'typeorm';
import { RestaurantePaisService } from './restaurante-pais.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('RestaurantePaisService', () => {
  let service: RestaurantePaisService;
  let restauranteRepository: Repository<RestauranteEntity>;
  let paisRepository: Repository<PaisEntity>;
  let restaurante: RestauranteEntity;
  let pais : PaisEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestaurantePaisService],
    }).compile();
    service = module.get<RestaurantePaisService>(RestaurantePaisService);
    restauranteRepository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
    paisRepository = module.get<Repository<PaisEntity>>(getRepositoryToken(PaisEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    paisRepository.clear();
    restauranteRepository.clear();
    pais = await paisRepository.save({
      nombre: faker.company.name()
    })
    restaurante = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.city(),
      numeroEstrellasMichellin: faker.mersenne.rand(5, 0),
      fechaConsecucionMichellin: faker.date.between('2000-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z'),
      pais: pais
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPaisRestaurante deberia agregar el pais a un restaurante', async () => {
    const paisNuevo: PaisEntity = await paisRepository.save({
      nombre: faker.company.name()
    });
    const nuevoRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.city(),
      numeroEstrellasMichellin: faker.mersenne.rand(5, 0),
      fechaConsecucionMichellin: faker.date.between('2000-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z')
    })
    const result: RestauranteEntity = await service.addPaisRestaurante(nuevoRestaurante.id, paisNuevo.id);
    expect(result.pais).not.toBeNull();
    expect(result.pais.nombre).toBe(paisNuevo.nombre)
  });

  it('addPaisResturante deberia mostrar una excepción para un pais invalido', async () => {
    const nuevoRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.city(),
      numeroEstrellasMichellin: faker.mersenne.rand(5, 0),
      fechaConsecucionMichellin: faker.date.between('2000-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z')
    })
    await expect(() => service.addPaisRestaurante(nuevoRestaurante.id, "0")).rejects.toHaveProperty("message", "No se encontró el país con la identificación dada");
  });

  it('addPaisRestaurante deberia mostrar una excepción para un restaurante invalido', async () => {
    const paisNuevo: PaisEntity = await paisRepository.save({
      nombre: faker.company.name()
    });
    await expect(() => service.addPaisRestaurante("0", paisNuevo.id)).rejects.toHaveProperty("message", "No se encontró el restaurante con la identificación proporcionada.");
  });

  it('findPaisByRestauranteIdPaisId deberia retornar el pais por restaurante', async () => {
    const paisABuscar: PaisEntity = pais;
    const PaisGuardado: PaisEntity = await service.findPaisByRestauranteIdPaisId(restaurante.id, paisABuscar.id, )
    expect(PaisGuardado).not.toBeNull();
    expect(PaisGuardado.nombre).toBe(paisABuscar.nombre);
  });

  it('findPaisByRestauranteIdPaisId deberia mostrar una excepción para un país invalido', async () => {
    await expect(()=> service.findPaisByRestauranteIdPaisId(restaurante.id, "0")).rejects.toHaveProperty("message", "No se encontró el país con la identificación dada"); 
  });

  it('findPaisByRestauranteIdPaisId deberia mostrar una excepción para un restaurante invalido', async () => {
    const paisABuscar: PaisEntity = pais; 
    await expect(()=> service.findPaisByRestauranteIdPaisId("0", paisABuscar.id)).rejects.toHaveProperty("message", "No se encontró el restaurante con la identificación proporcionada."); 
  });

  it('findPaisByRestauranteIdPaisId deberia mostrar una excepcion para un pais que no esta asociado a un restaurante', async () => {
    const paisNuevo: PaisEntity = await paisRepository.save({
      nombre: faker.company.name()
    });
    await expect(()=> service.findPaisByRestauranteIdPaisId(restaurante.id, paisNuevo.id)).rejects.toHaveProperty("message", "El país con el id proporcionado no está asociado al restaurante."); 
  });

  it('findPaisByRestauranteId deberia retornar el pais por restaurante', async ()=>{
    const paisABuscar: PaisEntity = await service.findPaisByResturanteId(restaurante.id);
    expect(paisABuscar.nombre).toBe(pais.nombre)
  });

  it('findPaisByRestauranteId deberia mostrar una excepción para un restaurante invalido', async () => {
    await expect(()=> service.findPaisByResturanteId("0")).rejects.toHaveProperty("message", "No se encontró el restaurante con la identificación proporcionada."); 
  });

  it('associatePaisRestaurante deberia actualizar el pais de un restaurante', async () => {
    const paisNuevo: PaisEntity = await paisRepository.save({
      nombre: faker.company.name()
    });
    const restauranteActualizado: RestauranteEntity = await service.associatePaisRestaurante(restaurante.id, paisNuevo);
    expect(restauranteActualizado.pais.nombre).toBe(paisNuevo.nombre);
  });

  it('associatePaisRestaurante deberia mostrar una excepción para un restaurante invalido', async () => {
    const paisNuevo: PaisEntity = await paisRepository.save({
      nombre: faker.company.name()
    });
    await expect(()=> service.associatePaisRestaurante("0", paisNuevo)).rejects.toHaveProperty("message", "No se encontró el restaurante con la identificación proporcionada."); 
  });

  it('associatePaisRestaurante deberia mostrar una excepción para un país invalido', async () => {
    const paisNuevo: PaisEntity = pais;
    paisNuevo.id = "0";
    await expect(()=> service.associatePaisRestaurante(restaurante.id, paisNuevo)).rejects.toHaveProperty("message", "No se encontró el país con la identificación dada"); 
  });

  it('deletePaisARestaurante deberia remover el pais de un restaurante', async () => {
    const paisARemover: PaisEntity = pais;
    await service.deletePaisRestaurante(restaurante.id, paisARemover.id);
    const restauranteGuardado: RestauranteEntity = await restauranteRepository.findOne({where: {id: `${restaurante.id}`}, relations: ["pais"]});
    expect(restauranteGuardado.pais).toBeNull();
  });

  it('deletePaisARestaurante deberia mostrar una excepción para un país invalido', async () => {
    await expect(()=> service.deletePaisRestaurante(restaurante.id, "0")).rejects.toHaveProperty("message", "No se encontró el país con la identificación dada"); 
  });

  it('deletePaisARestaurante deberia mostrar una excepción para un restaurante invalido', async () => {
    const paisARemover: PaisEntity = pais;
    await expect(()=> service.deletePaisRestaurante("0", paisARemover.id)).rejects.toHaveProperty("message", "No se encontró el restaurante con la identificación proporcionada."); 
  });

  it('deleteArtworkToMuseum should thrown an exception for an non asocciated artwork', async () => {
    const paisNuevo: PaisEntity = await paisRepository.save({
      nombre: faker.company.name()
    });
    await expect(()=> service.deletePaisRestaurante(restaurante.id, paisNuevo.id)).rejects.toHaveProperty("message", "El país con el id proporcionado no está asociado al restaurante."); 
  }); 

});
