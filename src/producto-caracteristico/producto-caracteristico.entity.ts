import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Categoria } from "../shared/enums/Categoria";
import { CulturaGastronomicaEntity } from "../cultura-gastronomica/cultura-gastronomica.entity";
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class ProductoCaracteristicoEntity {

    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    nombre: string;

    @Field()
    @Column()
    descripcion: string;

    @Field()
    @Column()
    historia: string;

    @Field()
    @Column()
    categoria: Categoria;

    @Field(type => [CulturaGastronomicaEntity])
    @ManyToMany(() => CulturaGastronomicaEntity, culturaGastronomica => culturaGastronomica.productosCaracteristicos)
    @JoinTable()
    culturasGastronomicas: CulturaGastronomicaEntity[];
}