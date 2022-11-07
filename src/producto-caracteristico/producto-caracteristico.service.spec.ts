import { Test, TestingModule } from '@nestjs/testing';
import { ProductoCaracteristicoEntity } from './producto-caracteristico.entity';
import { ProductoCaracteristicoService } from './producto-caracteristico.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { Categoria } from '../shared/enums/Categoria';
import { CacheModule } from '@nestjs/common';

describe('ProductoCaracteristicoService', () => {
  let service: ProductoCaracteristicoService;
  let repository: Repository<ProductoCaracteristicoEntity>;
  let productoCaracteristicoLista: ProductoCaracteristicoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register({isGlobal:true})],
      providers: [ProductoCaracteristicoService],
    }).compile();

    service = module.get<ProductoCaracteristicoService>(ProductoCaracteristicoService);
    repository = module.get<Repository<ProductoCaracteristicoEntity>>(getRepositoryToken(ProductoCaracteristicoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productoCaracteristicoLista = [];
    for (let i = 0; i < 5; i++) {
      const productoCaracteristico: ProductoCaracteristicoEntity = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.company.catchPhraseDescriptor(),
        historia: faker.commerce.productDescription(),
        categoria: Categoria.CONDIMENTO,
        culturasGastronomicas: [],
      })
      productoCaracteristicoLista.push(productoCaracteristico);
    }
  }

  it('findAll deberia retornar todos los productosCaracteristicos', async () => {
    const ProductosCaracteristicos: ProductoCaracteristicoEntity[] = await service.findAll();
    expect(ProductosCaracteristicos).not.toBeNull();
    expect(ProductosCaracteristicos).toHaveLength(productoCaracteristicoLista.length);
  });

  it('findOne deberia retornar un productosCaracteristico por Id', async () => {
    const productoCaracteristicoAlmacenado: ProductoCaracteristicoEntity = productoCaracteristicoLista[0];
    const productoCaracteristico: ProductoCaracteristicoEntity = await service.findOne(productoCaracteristicoAlmacenado.id);
    expect(productoCaracteristico).not.toBeNull();
    expect(productoCaracteristico.nombre).toEqual(productoCaracteristicoAlmacenado.nombre)
    expect(productoCaracteristico.descripcion).toEqual(productoCaracteristicoAlmacenado.descripcion)
    expect(productoCaracteristico.historia).toEqual(productoCaracteristicoAlmacenado.historia)
  });

  it('findOne debería lanzar una excepción para un productoCaracteristico inválido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "No se encontró el productoCaracteristico con la identificación proporcionada.")
  });

  it('create deberia retornar un nuevo productoCaracteristico', async () => {
    const productoCaracteristico: ProductoCaracteristicoEntity = {
      id: "",
      nombre: faker.company.name(),
      descripcion: faker.company.catchPhraseDescriptor(),
      historia: faker.commerce.productDescription(),
      categoria: Categoria.CONDIMENTO,
      culturasGastronomicas: [],
    }

    const nuevoProductoCaracteristico: ProductoCaracteristicoEntity = await service.create(productoCaracteristico);
    expect(nuevoProductoCaracteristico).not.toBeNull();

    const ProductoCaracteristicoAlmacenado: ProductoCaracteristicoEntity = await repository.findOne({ where: { id: `${nuevoProductoCaracteristico.id}` } })
    expect(ProductoCaracteristicoAlmacenado).not.toBeNull();
    expect(ProductoCaracteristicoAlmacenado.nombre).toEqual(nuevoProductoCaracteristico.nombre)
    expect(ProductoCaracteristicoAlmacenado.descripcion).toEqual(nuevoProductoCaracteristico.descripcion)
    expect(ProductoCaracteristicoAlmacenado.categoria).toEqual(nuevoProductoCaracteristico.categoria)
  });

  it('update debería modificar un productoCaracteristico', async () => {
    const productoCaracteristico: ProductoCaracteristicoEntity = productoCaracteristicoLista[0];
    productoCaracteristico.nombre = "Lok Lak";
    productoCaracteristico.descripcion = "Lomo de carne de res con salsa camboyana";
    const productoCaracteristicoActualizado: ProductoCaracteristicoEntity = await service.update(productoCaracteristico.id, productoCaracteristico);
    expect(productoCaracteristicoActualizado).not.toBeNull();
    const productoCaracteristicoAlmacenado: ProductoCaracteristicoEntity = await repository.findOne({ where: { id: `${productoCaracteristico.id}` } })
    expect(productoCaracteristicoAlmacenado).not.toBeNull();
    expect(productoCaracteristicoAlmacenado.nombre).toEqual(productoCaracteristico.nombre)
    expect(productoCaracteristicoAlmacenado.descripcion).toEqual(productoCaracteristico.descripcion)
  });

  it('update debería lanzar una excepción para un productoCaracteristico inválido', async () => {
    let productoCaracteristico: ProductoCaracteristicoEntity = productoCaracteristicoLista[0];
    productoCaracteristico = {
      ...productoCaracteristico, nombre: "Nuevo nombre", descripcion: "Nueva descripcion"
    }
    await expect(() => service.update("0", productoCaracteristico)).rejects.toHaveProperty("message", "No se encontró el productoCaracteristico con la identificación proporcionada.")
  });

  it('delete debería eliminar un productoCaracteristico', async () => {
    const productoCaracteristico: ProductoCaracteristicoEntity = productoCaracteristicoLista[0];
    await service.delete(productoCaracteristico.id);
    const productoCaracteristicoEliminado: ProductoCaracteristicoEntity = await repository.findOne({ where: { id: `${productoCaracteristico.id}` } })
    expect(productoCaracteristicoEliminado).toBeNull();
  });

  it('delete debería lanzar una excepción para un productoCaracteristico inválido', async () => {
    const productoCaracteristico: ProductoCaracteristicoEntity = productoCaracteristicoLista[0];
    await service.delete(productoCaracteristico.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "No se encontró el productoCaracteristico con la identificación proporcionada.")
  });
});