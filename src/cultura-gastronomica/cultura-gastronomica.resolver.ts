import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CulturaGastronomicaDto } from './cultura-gastronomica.dto';
import { CulturaGastronomicaEntity } from './cultura-gastronomica.entity';
import { CulturaGastronomicaService } from './cultura-gastronomica.service';

@Resolver()
export class CulturaGastronomicaResolver {

  constructor(private culturaGastronomicaService: CulturaGastronomicaService) { }

  @Query(() => [CulturaGastronomicaEntity])
  culturas(): Promise<CulturaGastronomicaEntity[]> {
    return this.culturaGastronomicaService.findAll();
  }

  @Query(() => CulturaGastronomicaEntity)
  cultura(@Args('id') id: string): Promise<CulturaGastronomicaEntity> {
    return this.culturaGastronomicaService.findOne(id);
  }

  @Mutation(() => CulturaGastronomicaEntity)
  createCulturaGastronomica(@Args('culturaGastronomica') culturaGastronomicaDto: CulturaGastronomicaDto): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica = plainToInstance(CulturaGastronomicaEntity, culturaGastronomicaDto);
    return this.culturaGastronomicaService.create(culturaGastronomica);
  }

  @Mutation(() => CulturaGastronomicaEntity)
  updateCulturaGastronomica(@Args('id') id: string, @Args('culturaGastronomica') culturaGastronomicaDto: CulturaGastronomicaDto): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica = plainToInstance(CulturaGastronomicaEntity, culturaGastronomicaDto);
    return this.culturaGastronomicaService.update(id, culturaGastronomica);
  }

  @Mutation(() => String)
  deleteCulturaGastronomica(@Args('id') id: string) {
    this.culturaGastronomicaService.delete(id);
    return id;
  }
}