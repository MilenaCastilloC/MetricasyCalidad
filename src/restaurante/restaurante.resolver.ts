import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { RestauranteDto } from './restaurante.dto';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';

@Resolver()
export class RestauranteResolver {
  constructor(private restauranteService: RestauranteService) { }

  @Query(() => [RestauranteEntity])
  restaurantes(): Promise<RestauranteEntity[]> {
    return this.restauranteService.findAll();
  }

  @Query(() => RestauranteEntity)
  restaurante(@Args('id') id: string): Promise<RestauranteEntity> {
    return this.restauranteService.findOne(id);

  }

  @Mutation(() => RestauranteEntity)
  createRestaurante(@Args('restaurante') restauranteDto: RestauranteDto): Promise<RestauranteEntity> {
    const restaurante = plainToInstance(RestauranteEntity, restauranteDto);
    return this.restauranteService.create(restaurante);
  }

  @Mutation(() => RestauranteEntity)
  updateRestaurante(@Args('id') id: string, @Args('restaurante') restauranteDto: RestauranteDto): Promise<RestauranteEntity> {
    const restaurante = plainToInstance(RestauranteEntity, restauranteDto);
    return this.restauranteService.update(id, restaurante);
  }

  @Mutation(() => String)
  deleteRestaurante(@Args('id') id: string) {
    this.restauranteService.delete(id);
    return id;
  }
}