import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RecetaDto {

 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsString()
 @IsNotEmpty()
 readonly descripcion: string;
 
 @IsString()
 @IsNotEmpty()
 readonly foto: string;
 
 @IsString()
 @IsNotEmpty()
 readonly proceso: string;
 
 @IsUrl()
 @IsNotEmpty()
 readonly video: string;

  @Field()
  @IsUrl()
  @IsNotEmpty()
  readonly image: string;
}