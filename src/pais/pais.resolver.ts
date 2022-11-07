import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { PaisDto } from './pais.dto';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';

@Resolver()
export class PaisResolver {
  constructor(private paisService: PaisService) { }

  @Query(() => [PaisEntity])
  paises(): Promise<PaisEntity[]> {
    return this.paisService.findAll();
  }

  @Query(() => PaisEntity)
  pais(@Args('id') id: string): Promise<PaisEntity> {
    return this.paisService.findOne(id);
  }

  @Mutation(() => PaisEntity)
  createPais(@Args('pais') paisDto: PaisDto): Promise<PaisEntity> {
    const pais = plainToInstance(PaisEntity, paisDto);
    return this.paisService.create(pais);
  }

  @Mutation(() => PaisEntity)
  updatePais(@Args('id') id: string, @Args('pais') paisDto: PaisDto): Promise<PaisEntity> {
    const pais = plainToInstance(PaisEntity, paisDto);
    return this.paisService.update(id, pais);
  }

  @Mutation(() => String)
  deletePais(@Args('id') id: string) {
    this.paisService.delete(id);
    return id;
  }
}