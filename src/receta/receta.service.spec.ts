import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/common';

describe('RecetaService', () => {
  let service: RecetaService;
  let repository: Repository<RecetaEntity>;
  let recetaLista: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register({isGlobal:true})],
      providers: [RecetaService],
    }).compile();

    service = module.get<RecetaService>(RecetaService);
    repository = module.get<Repository<RecetaEntity>>(getRepositoryToken(RecetaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    recetaLista = [];
    for(let i = 0; i < 5; i++){
        const receta: RecetaEntity = await repository.save({
        nombre: faker.random.words(),
        descripcion: faker.lorem.sentence(),
        foto: faker.image.imageUrl(),
        proceso: faker.lorem.sentence(),
        video: faker.internet.url()})
        recetaLista.push(receta);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todos las recetas', async () => {
    const recetas: RecetaEntity[] = await service.findAll();
    expect(recetas).not.toBeNull();
    expect(recetas).toHaveLength(recetaLista.length);
  });

  it('findOne deberia retornar una receta por Id', async () => {
    const almacenadoReceta: RecetaEntity = recetaLista[0];
    const receta: RecetaEntity = await service.findOne(almacenadoReceta.id);
    expect(receta).not.toBeNull();
    expect(receta.nombre).toEqual(almacenadoReceta.nombre)
    expect(receta.descripcion).toEqual(almacenadoReceta.descripcion)
    expect(receta.foto).toEqual(almacenadoReceta.foto)
    expect(receta.proceso).toEqual(almacenadoReceta.proceso)
    expect(receta.video).toEqual(almacenadoReceta.video)
  });

  it('findOne debería lanzar una excepción para una receta inválida', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "No se encontró la receta con la identificación proporcionada.")
  }); 

  it('create deberia retornar una nueva receta', async () => {
    const receta: RecetaEntity = {
      id: "",
      nombre: faker.random.words(),
      descripcion: faker.lorem.sentence(),
      foto: faker.image.imageUrl(),
      proceso: faker.lorem.sentence(),
      video: faker.internet.url(),
      culturasGastronomicas: [],
    }
 
    const nuevaReceta: RecetaEntity = await service.create(receta);
    expect(nuevaReceta).not.toBeNull();
 
    const almacenadoReceta: RecetaEntity = await repository.findOne({where: {id: `${nuevaReceta.id}` }})
    expect(almacenadoReceta).not.toBeNull();
    expect(almacenadoReceta.nombre).toEqual(nuevaReceta.nombre)
    expect(almacenadoReceta.descripcion).toEqual(nuevaReceta.descripcion)
    expect(almacenadoReceta.foto).toEqual(nuevaReceta.foto)
    expect(almacenadoReceta.proceso).toEqual(nuevaReceta.proceso)
    expect(almacenadoReceta.video).toEqual(nuevaReceta.video)
  });

  it('update debería modificar una receta', async () => {
    const receta: RecetaEntity = recetaLista[0];
    receta.nombre = "Nuevo nombre";
    receta.descripcion = "Nueva descripcion";
     const recetaActualizada: RecetaEntity = await service.update(receta.id, receta);
    expect(recetaActualizada).not.toBeNull();
     const recetaAlmacenada: RecetaEntity = await repository.findOne({ where: { id: `${receta.id}` } })
    expect(recetaAlmacenada).not.toBeNull();
    expect(recetaAlmacenada.nombre).toEqual(receta.nombre)
    expect(recetaAlmacenada.descripcion).toEqual(receta.descripcion)
  });

  it('update debería lanzar una excepción para una receta inválida', async () => {
    let receta: RecetaEntity = recetaLista[0];
    receta = {
      ...receta, nombre: "Nuevo nombre", descripcion: "Nueva descripcion"
    }
    await expect(() => service.update("0", receta)).rejects.toHaveProperty("message", "No se encontró la receta con la identificación proporcionada.")
  });

  it('delete debería eliminar una receta', async () => {
    const receta: RecetaEntity = recetaLista[0];
    await service.delete(receta.id);
     const recetaEliminada: RecetaEntity = await repository.findOne({ where: { id: `${receta.id}` } })
    expect(recetaEliminada).toBeNull();
  });

  it('delete debería lanzar una excepción para una receta inválida', async () => {
    const receta: RecetaEntity = recetaLista[0];
    await service.delete(receta.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "No se encontró la receta con la identificación proporcionada.")
  });
});
