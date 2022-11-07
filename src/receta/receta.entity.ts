import { CulturaGastronomicaEntity } from "../cultura-gastronomica/cultura-gastronomica.entity";
import { Column, Entity, PrimaryGeneratedColumn, JoinTable, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class RecetaEntity {

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
   foto: string;

   @Field()
   @Column()
   proceso: string;

   @Field()
   @Column()
   video: string;

   @Field(type => CulturaGastronomicaEntity)
   @ManyToOne(() => CulturaGastronomicaEntity, culturaGastronomica => culturaGastronomica.recetas)
   @JoinTable()
   culturasGastronomicas: CulturaGastronomicaEntity[];

}