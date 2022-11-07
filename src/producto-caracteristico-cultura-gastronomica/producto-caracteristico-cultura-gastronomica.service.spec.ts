import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { Categoria } from '../shared/enums/Categoria';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductoCaracteristicoCulturaGastronomicaService } from './producto-caracteristico-cultura-gastronomica.service';
import { ProductoCaracteristicoEntity } from '../producto-caracteristico/producto-caracteristico.entity';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('ProductoCaracteristicoCulturaGastronomicaService', () => {
  let service: ProductoCaracteristicoCulturaGastronomicaService;
  let productoCaracteristicoRepository: Repository<ProductoCaracteristicoEntity>;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let productoCaracteristico: ProductoCaracteristicoEntity;
  let culturaGastronomicasLista: CulturaGastronomicaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoCaracteristicoCulturaGastronomicaService],
    }).compile();

    service = module.get<ProductoCaracteristicoCulturaGastronomicaService>(ProductoCaracteristicoCulturaGastronomicaService);
    productoCaracteristicoRepository = module.get<Repository<ProductoCaracteristicoEntity>>(getRepositoryToken(ProductoCaracteristicoEntity));
    culturaGastronomicaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    culturaGastronomicaRepository.clear();
    productoCaracteristicoRepository.clear();

    culturaGastronomicasLista = [];
    for (let i = 0; i < 5; i++) {
      const culturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.company.catchPhraseDescriptor(),
      })
      culturaGastronomicasLista.push(culturaGastronomica);
    }

    productoCaracteristico = await productoCaracteristicoRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
      historia: faker.commerce.productDescription(),
      categoria: Categoria.CONDIMENTO,
      culturasGastronomicas: culturaGastronomicasLista,
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addCulturaGastronomicaProductoCaracteristico debería agregar una cultura gastronomica a un productoCaracteristico', async () => {
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
    });
    const nuevoProductoCaracteristico: ProductoCaracteristicoEntity = await productoCaracteristicoRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
      historia: faker.commerce.productDescription(),
      categoria: Categoria.CONDIMENTO,
    })
    const result: ProductoCaracteristicoEntity = await service.addCulturaGastronomicaProductoCaracteristico(nuevoProductoCaracteristico.id, nuevaCulturaGastronomica.id);
    expect(result.culturasGastronomicas.length).toBe(1);
    expect(result.culturasGastronomicas[0]).not.toBeNull();
  });

  it('addCulturaGastronomicaProductoCaracteristico deberia mostrar una excepción de cultura gastronomica invalida', async () => {
    const nuevoProductoCaracteristico: ProductoCaracteristicoEntity = await productoCaracteristicoRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
      historia: faker.commerce.productDescription(),
      categoria: Categoria.CONDIMENTO,
    })
    await expect(() => service.addCulturaGastronomicaProductoCaracteristico(nuevoProductoCaracteristico.id, "0")).rejects.toHaveProperty("message", "No se encontró la cultura gastronomica con la identificación dada");
  });

  it('addCulturaGastronomicaProductoCaracteristico deberia mostrar una excepción de productoCaracteristico invalido', async () => {
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
    });
    await expect(() => service.addCulturaGastronomicaProductoCaracteristico("0", nuevaCulturaGastronomica.id)).rejects.toHaveProperty("message", "No se encontró el productoCaracteristico con la identificación proporcionada.");
  });

  it('findCulturaGastronomicaPorProductoCaracteristicoIdCulturaGastronomicaId deberia retornar cultura gastronomica por productoCaracteristico', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity = culturaGastronomicasLista[0];
    const culturaGastronomicaAlmacenada: CulturaGastronomicaEntity = await service.findCulturaGastronomicaPorProductoCaracteristicoIdCulturaGastronomicaId(productoCaracteristico.id, culturaGastronomica.id,)
    expect(culturaGastronomicaAlmacenada).not.toBeNull();
  });

  it('findCulturaGastronomicaPorProductoCaracteristicoIdCulturaGastronomicaId deberia mostrar una excepción de cultura gastronomica invalida', async () => {
    await expect(() => service.findCulturaGastronomicaPorProductoCaracteristicoIdCulturaGastronomicaId(productoCaracteristico.id, "0")).rejects.toHaveProperty("message", "No se encontró la cultura gastronomica con la identificación dada");
  });

  it('findCulturaGastronomicaPorProductoCaracteristicoIdCulturaGastronomicaId deberia mostrar una excepción de productoCaracteristico invalido', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity = culturaGastronomicasLista[0];
    await expect(() => service.findCulturaGastronomicaPorProductoCaracteristicoIdCulturaGastronomicaId("0", culturaGastronomica.id)).rejects.toHaveProperty("message", "No se encontró el productoCaracteristico con la identificación proporcionada.");
  });

  it('findCulturaGastronomicaPorProductoCaracteristicoIdCulturaGastronomicaId deberia mostrar una excepción para una cultura gastronomica que no esta asociada a un productoCaracteristico', async () => {
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
    });
    await expect(() => service.findCulturaGastronomicaPorProductoCaracteristicoIdCulturaGastronomicaId(productoCaracteristico.id, nuevaCulturaGastronomica.id)).rejects.toHaveProperty("message", "La cultura gastronomica con el id proporcionado no está asociada al productoCaracteristico.");
  });

  it('findCulturasGastronomicasPorProductoCaracteristicoId deberia retornar culturas gastronomicas por productoCaracteristico', async () => {
    const culturaGastronomicas: CulturaGastronomicaEntity[] = await service.findCulturasGastronomicasPorProductoCaracteristicoId(productoCaracteristico.id);
    expect(culturaGastronomicas.length).toBe(5)
  });

  it('findCulturasGastronomicasPorProductoCaracteristicoId deberia mostrar una excepción para un productoCaracteristico invalido', async () => {
    await expect(() => service.findCulturasGastronomicasPorProductoCaracteristicoId("0")).rejects.toHaveProperty("message", "No se encontró el productoCaracteristico con la identificación proporcionada.");
  });

  it('associateCulturasGastronomicasProductoCaracteristico deberia actualizar las culturas gastronomicas para un ProductoCaracteristico', async () => {
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
    });
    const culturaGastronomicaActualizada: ProductoCaracteristicoEntity = await service.associateCulturasGastronomicasProductoCaracteristico(productoCaracteristico.id, [nuevaCulturaGastronomica]);
    expect(culturaGastronomicaActualizada.culturasGastronomicas.length).toBe(1);
  });

  it('associateCulturasGastronomicasProductoCaracteristico deberia mostrar una excepción por productoCaracteristico invalido', async () => {
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
    });
    await expect(() => service.associateCulturasGastronomicasProductoCaracteristico("0", [nuevaCulturaGastronomica])).rejects.toHaveProperty("message", "No se encontró el productoCaracteristico con la identificación proporcionada.");
  });

  it('associateCulturasGastronomicasProductoCaracteristico deberia mostrar una excepción por cultura gastronomica invalida', async () => {
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = culturaGastronomicasLista[0];
    nuevaCulturaGastronomica.id = "0";
    await expect(() => service.associateCulturasGastronomicasProductoCaracteristico(productoCaracteristico.id, [nuevaCulturaGastronomica])).rejects.toHaveProperty("message", "No se encontró la cultura gastronomica con la identificación dada");
  });

  it('deleteCulturaGastronomicaProductoCaracteristico deberia eliminar una cultura gastronomica de un productoCaracteristico', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity = culturaGastronomicasLista[0];
    await service.deleteCulturaGastronomicaProductoCaracteristico(productoCaracteristico.id, culturaGastronomica.id);
    const productoCaracteristicoAlmacenado: ProductoCaracteristicoEntity = await productoCaracteristicoRepository.findOne({ where: { id: `${productoCaracteristico.id}` }, relations: ["culturasGastronomicas"] });
    const culturaGastronomicaEliminada: CulturaGastronomicaEntity = productoCaracteristicoAlmacenado.culturasGastronomicas.find(a => a.id === culturaGastronomica.id);
    expect(culturaGastronomicaEliminada).toBeUndefined();
  });

  it('deleteCulturaGastronomicaProductoCaracteristico deberia mostrar excepción por cultura gastronomica invalida', async () => {
    await expect(() => service.deleteCulturaGastronomicaProductoCaracteristico(productoCaracteristico.id, "0")).rejects.toHaveProperty("message", "No se encontró la cultura gastronomica con la identificación dada");
  });

  it('deleteCulturaGastronomicaProductoCaracteristico deberia mostrar excepción por productoCaracteristico invalido', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity = culturaGastronomicasLista[0];
    await expect(() => service.deleteCulturaGastronomicaProductoCaracteristico("0", culturaGastronomica.id)).rejects.toHaveProperty("message", "No se encontró el productoCaracteristico con la identificación proporcionada.");
  });

  it('deleteCulturaGastronomicaProductoCaracteristico deberia mostrar excepción por cultura gastronomica sin asociacion', async () => {
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
    });
    await expect(() => service.deleteCulturaGastronomicaProductoCaracteristico(productoCaracteristico.id, nuevaCulturaGastronomica.id)).rejects.toHaveProperty("message", "La cultura gastronomica con el id proporcionado no está asociada al productoCaracteristico.");
  });
});


