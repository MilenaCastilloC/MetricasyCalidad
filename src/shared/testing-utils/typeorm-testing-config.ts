import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoCaracteristicoEntity } from '../../producto-caracteristico/producto-caracteristico.entity';
import { CulturaGastronomicaEntity } from '../../cultura-gastronomica/cultura-gastronomica.entity';
import { PaisEntity } from '../../pais/pais.entity';
import { RestauranteEntity } from '../../restaurante/restaurante.entity';
import { RecetaEntity } from '../../receta/receta.entity';

export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [RestauranteEntity, CulturaGastronomicaEntity, PaisEntity, ProductoCaracteristicoEntity, RecetaEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([RestauranteEntity, CulturaGastronomicaEntity, PaisEntity, ProductoCaracteristicoEntity, RecetaEntity]),
];