import { Module, CacheModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestauranteModule } from './restaurante/restaurante.module';
import { CulturaGastronomicaModule } from './cultura-gastronomica/cultura-gastronomica.module';
import { PaisModule } from './pais/pais.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetaModule } from './receta/receta.module';
import { RestauranteEntity } from './restaurante/restaurante.entity';
import { CulturaGastronomicaEntity } from './cultura-gastronomica/cultura-gastronomica.entity';
import { CulturaGastronomicaPaisesModule } from './cultura-gastronomica-paises/cultura-gastronomica-paises.module';
import { PaisEntity } from './pais/pais.entity';
import { RestauranteCulturaGastronomicaModule } from './restaurante-cultura-gastronomica/restaurante-cultura-gastronomica.module';
import { ProductoCaracteristicoModule } from './producto-caracteristico/producto-caracteristico.module';
import { ProductoCaracteristicoEntity } from './producto-caracteristico/producto-caracteristico.entity';
import { ProductoCaracteristicoCulturaGastronomicaModule } from './producto-caracteristico-cultura-gastronomica/producto-caracteristico-cultura-gastronomica.module';
import { CulturaGastronomicaProductoCaracteristicoModule } from './cultura-gastronomica-producto-caracteristico/cultura-gastronomica-producto-caracteristico.module';
import { RecetaCulturaGastronomicaModule } from './receta-cultura-gastronomica/receta-cultura-gastronomica.module';
import { RecetaEntity } from './receta/receta.entity';
import { RestaurantePaisModule } from './restaurante-pais/restaurante-pais.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'gastronomia',
      entities: [
        RestauranteEntity,
        CulturaGastronomicaEntity,
        PaisEntity,
        ProductoCaracteristicoEntity,
        RecetaEntity
      ],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    RestauranteModule,
    CulturaGastronomicaModule,
    CulturaGastronomicaPaisesModule,
    PaisModule,
    ProductoCaracteristicoModule,
    ProductoCaracteristicoCulturaGastronomicaModule,
    CulturaGastronomicaProductoCaracteristicoModule,
    RecetaModule,
    RestauranteCulturaGastronomicaModule,
    RecetaCulturaGastronomicaModule,
    RestaurantePaisModule,
    UserModule,
    AuthModule,
    CacheModule.register({
      isGlobal:true,
      store: sqliteStore,
      path: ':memory:',
      options: {
        ttl: 5
      }
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }