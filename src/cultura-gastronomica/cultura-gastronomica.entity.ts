import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { Entity, ManyToMany, OneToMany, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ProductoCaracteristicoEntity } from '../producto-caracteristico/producto-caracteristico.entity';
import { PaisEntity } from '../pais/pais.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CulturaGastronomicaEntity {

  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  descripcion: string;

  @ManyToMany(() => RestauranteEntity, restaurante => restaurante.culturasGastronomicas)
  restaurantes: RestauranteEntity[];

  @Field(type => [ProductoCaracteristicoEntity])
  @ManyToMany(() => ProductoCaracteristicoEntity, productoCaracteristico => productoCaracteristico.culturasGastronomicas)
  productosCaracteristicos: ProductoCaracteristicoEntity[];
  
  @Field(type => [RecetaEntity])
  @OneToMany(() => RecetaEntity, receta => receta.culturasGastronomicas)
  recetas: RecetaEntity[];

  @ManyToMany(() => PaisEntity, pais => pais.culturasGastronomicas)
  paises: PaisEntity[];

}