import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisController } from './pais.controller';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';
import { PaisResolver } from './pais.resolver';

@Module({
  controllers: [PaisController],
  providers: [PaisService, PaisResolver],
  imports: [TypeOrmModule.forFeature([PaisEntity])],

})
export class PaisModule {}
