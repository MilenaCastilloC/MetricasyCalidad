import { RestauranteEntity } from "../restaurante/restaurante.entity";
import { Entity, OneToMany, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { CulturaGastronomicaEntity } from "../cultura-gastronomica/cultura-gastronomica.entity";
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class PaisEntity {

    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    nombre: string;

    @Field(type => [RestauranteEntity])
    @OneToMany(() => RestauranteEntity, restaurante => restaurante.pais)
    restaurantes: RestauranteEntity[];

    @ManyToMany(() => CulturaGastronomicaEntity, culturaGastronomica => culturaGastronomica.paises)
    @JoinTable()
    culturasGastronomicas: CulturaGastronomicaEntity[];
    
}