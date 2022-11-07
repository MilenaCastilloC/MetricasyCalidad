import { Categoria } from '../shared/enums/Categoria';
import { IsNotEmpty, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ProductoCaracteristicoDto {

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly historia: string;

  @Field()
  @IsNotEmpty()
  readonly categoria: Categoria;
}