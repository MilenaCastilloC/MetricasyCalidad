import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { Categoria } from '../shared/enums/Categoria';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CulturaGastronomicaProductoCaracteristicoService } from './cultura-gastronomica-producto-caracteristico.service';
import { ProductoCaracteristicoEntity } from '../producto-caracteristico/producto-caracteristico.entity';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PaisEntity } from '../pais/pais.entity';

describe('CulturaGastronomicaProductoCaracteristicoService', () => {
  let service: CulturaGastronomicaProductoCaracteristicoService;
  let productoCaracteristicoRepository: Repository<ProductoCaracteristicoEntity>;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let paisRepository: Repository<PaisEntity>;
  let productosCaracteristicosLista: ProductoCaracteristicoEntity[];
  let paisesLista: PaisEntity[];
  let culturaGastronomica: CulturaGastronomicaEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaGastronomicaProductoCaracteristicoService],
    }).compile();

    service = module.get<CulturaGastronomicaProductoCaracteristicoService>(CulturaGastronomicaProductoCaracteristicoService);
    productoCaracteristicoRepository = module.get<Repository<ProductoCaracteristicoEntity>>(getRepositoryToken(ProductoCaracteristicoEntity));
    culturaGastronomicaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
    paisRepository = module.get<Repository<PaisEntity>>(getRepositoryToken(PaisEntity));
    
    await seedDatabase();
  });

  const seedDatabase = async () => {
    culturaGastronomicaRepository.clear();
    productoCaracteristicoRepository.clear();
    paisRepository.clear();

    productosCaracteristicosLista = [];
    for (let i = 0; i < 5; i++) {
      const productoCaracteristico: ProductoCaracteristicoEntity = await productoCaracteristicoRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.company.catchPhraseDescriptor(),
        historia: faker.commerce.productDescription(),
        categoria: Categoria.CONDIMENTO
      })
      productosCaracteristicosLista.push(productoCaracteristico);
    }

    culturaGastronomica = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
      productosCaracteristicos: productosCaracteristicosLista,
      paises:paisesLista,
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addProductoCaracteristicoToCulturaGastronomica debería agregar un productoCaracteristico a una cultura gastronomica', async () => {
    const nuevoProductoCaracteristico: ProductoCaracteristicoEntity = await productoCaracteristicoRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
      historia: faker.commerce.productDescription(),
      categoria: Categoria.CONDIMENTO
    });
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
      productosCaracteristicos: productosCaracteristicosLista,
      paises: paisesLista,
    })
    const result: CulturaGastronomicaEntity = await service.addProductoCaracteristicoToCulturaGastronomica(nuevaCulturaGastronomica.id, nuevoProductoCaracteristico.id);
    expect(result.productosCaracteristicos);
  });

  it('addProductoCaracteristicoToCulturaGastronomica deberia mostrar una excepción de productoCaracteristico invalida', async () => {
    const nuevaCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
      productosCaracteristicos: productosCaracteristicosLista,
      paises: paisesLista,
    })
    await expect(() => service.addProductoCaracteristicoToCulturaGastronomica(nuevaCulturaGastronomica.id, "0")).rejects.toHaveProperty("message", "No se encontró el productoCaracteristico con la identificación dada");
  });

  it('findProductoCaracteristicoPorProductoCaracteristicoIdCulturaGastronomicaId deberia retornar ProductoCaracteristico por CulturaGastronomicaId', async () => {
    const productoCaracteristico: ProductoCaracteristicoEntity = productosCaracteristicosLista[0];
    const productoCaracteristicoAlmacenado: ProductoCaracteristicoEntity = await service.findProductoCaracteristicoPorProductoCaracteristicoIdCulturaGastronomicaId(culturaGastronomica.id, productoCaracteristico.id)
    expect(productoCaracteristicoAlmacenado).not.toBeNull();
  });

  it('findProductoCaracteristicoPorProductoCaracteristicoIdCulturaGastronomicaId deberia mostrar una excepción de ProductoCaracteristico invalido', async () => {
    await expect(() => service.findProductoCaracteristicoPorProductoCaracteristicoIdCulturaGastronomicaId(culturaGastronomica.id, "0")).rejects.toHaveProperty("message", "No se encontró el productoCaracteristico con la identificación dada");
  });

  it('findProductoCaracteristicoPorProductoCaracteristicoIdCulturaGastronomicaId deberia mostrar una excepción de culturaGastronomica invalida', async () => {
    const productoCaracteristico: ProductoCaracteristicoEntity = productosCaracteristicosLista[0];
    await expect(() => service.findProductoCaracteristicoPorProductoCaracteristicoIdCulturaGastronomicaId("0", productoCaracteristico.id)).rejects.toHaveProperty("message", "No se encontró la culturaGastronomica con la identificación proporcionada.");
  });

  it('findProductoCaracteristicoPorProductoCaracteristicoIdCulturaGastronomicaId deberia mostrar una excepción para un productoCaracteristico que no esta asociado a una cultura gastronomica', async () => {
    const nuevaProductoCaracteristico: ProductoCaracteristicoEntity = await productoCaracteristicoRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
      historia: faker.commerce.productDescription(),
      categoria: Categoria.CONDIMENTO,
    });
    await expect(() => service.findProductoCaracteristicoPorProductoCaracteristicoIdCulturaGastronomicaId(culturaGastronomica.id, nuevaProductoCaracteristico.id)).rejects.toHaveProperty("message", "La cultura gastronomica con el id proporcionado no está asociada al productoCaracteristico.");
  });

  it('findProductosCaracteristicosPorCulturaGastronomicaId deberia retornar productosCaracteristicos por culturaCastronomica', async () => {
    const productosCaracteristicos: ProductoCaracteristicoEntity[] = await service.findProductosCaracteristicosPorCulturaGastronomicaId(culturaGastronomica.id);
    expect(productosCaracteristicos.length).toBe(5)
  });

  it('findProductosCaracteristicosPorCulturaGastronomicaId deberia mostrar una excepción para una culturaGastronomica invalida', async () => {
    await expect(() => service.findProductosCaracteristicosPorCulturaGastronomicaId("0")).rejects.toHaveProperty("message", "No se encontró la culturaGastronomica con la identificación proporcionada.");
  });

  it('associateProductosCaracteristicosToCulturaGastronomica deberia actualizar los Producto Caracteristicos para una CulturaGastronomica', async () => {
    const nuevoProductoCaracteristico: ProductoCaracteristicoEntity = await productoCaracteristicoRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
      historia: faker.commerce.productDescription(),
      categoria: Categoria.CONDIMENTO,
    });
    const culturaGastronomicaActualizada: CulturaGastronomicaEntity = await service.associateProductosCaracteristicosToCulturaGastronomica(culturaGastronomica.id, [nuevoProductoCaracteristico]);
    expect(culturaGastronomicaActualizada.productosCaracteristicos.length).toBe(1);
  });

  it('associateProductosCaracteristicosToCulturaGastronomica deberia mostrar una excepción por cultura gastronomica invalida', async () => {
    const nuevoProductoCaracteristico: ProductoCaracteristicoEntity = await productoCaracteristicoRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
      historia: faker.commerce.productDescription(),
      categoria: Categoria.CONDIMENTO,
    });
    await expect(() => service.associateProductosCaracteristicosToCulturaGastronomica("0", [nuevoProductoCaracteristico])).rejects.toHaveProperty("message", "No se encontró la culturaGastronomica con la identificación proporcionada.");
  });

  it('associateProductosCaracteristicosToCulturaGastronomica deberia mostrar una excepción por productoCaracteristico invalido', async () => {
    const nuevoProductoCaracteristicoEntity: ProductoCaracteristicoEntity = productosCaracteristicosLista[0];
    nuevoProductoCaracteristicoEntity.id = "0";
    await expect(() => service.associateProductosCaracteristicosToCulturaGastronomica(culturaGastronomica.id, [nuevoProductoCaracteristicoEntity])).rejects.toHaveProperty("message", "No se encontró el productoCaracteristico con la identificación dada");
  });

  it('deleteProductoCaracteristicoCulturaGastronomica deberia mostrar excepción por producto caracteristico invalido', async () => {
    await expect(() => service.deleteProductoCaracteristicoCulturaGastronomica(culturaGastronomica.id, "0")).rejects.toHaveProperty("message", "No se encontró la cultura gastronomica con la identificación dada");
  });

  it('deleteProductoCaracteristicoCulturaGastronomica deberia mostrar excepción por CulturaGastronomica invalida', async () => {
    const productoCaracteristico: ProductoCaracteristicoEntity = productosCaracteristicosLista[0];
    await expect(() => service.deleteProductoCaracteristicoCulturaGastronomica(productoCaracteristico.id, "0")).rejects.toHaveProperty("message", "No se encontró la cultura gastronomica con la identificación dada");
  });

  it('deleteProductoCaracteristicoCulturaGastronomica deberia mostrar excepción por productoCaracteristico sin asociacion', async () => {
    const nuevoProductoCaracteristico: ProductoCaracteristicoEntity = await productoCaracteristicoRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
      historia: faker.commerce.productDescription(),
      categoria: Categoria.CONDIMENTO,
    });
    await expect(() => service.deleteProductoCaracteristicoCulturaGastronomica(nuevoProductoCaracteristico.id, culturaGastronomica.id)).rejects.toHaveProperty("message", "No se encontró la cultura gastronomica con la identificación dada");
  });

});