import { CulturaGastronomicaEntity } from "../cultura-gastronomica/cultura-gastronomica.entity";
import { PaisEntity } from "../pais/pais.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, JoinTable } from "typeorm";
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()

@Entity()
export class RestauranteEntity {

    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    nombre: string;

    @Field()
    @Column()
    ciudad: string;

    @Field()
    @Column()
    numeroEstrellasMichellin: number;

    @Field()
    @Column()
    fechaConsecucionMichellin: Date;

    @ManyToMany(() => CulturaGastronomicaEntity, culturaGastronomica => culturaGastronomica.restaurantes)
    @JoinTable()
    culturasGastronomicas: CulturaGastronomicaEntity[];

    @Field(type => PaisEntity)
    @ManyToOne(() => PaisEntity, pais => pais.restaurantes)
    pais: PaisEntity;

}