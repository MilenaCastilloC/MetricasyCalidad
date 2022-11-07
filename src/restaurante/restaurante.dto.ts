import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RestauranteDto {

    @Field()
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    readonly ciudad: string;

    @Field()
    @IsNumber()
    @IsNotEmpty()
    readonly numeroEstrellasMichellin: number;

    @Field()
    @IsDateString()
    @IsNotEmpty()
    readonly fechaConsecucionMichellin: Date;
}