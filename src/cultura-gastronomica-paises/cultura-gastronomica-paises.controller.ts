import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { HasRoles } from '../user/has-roles.decorator';
import { Role } from '../user/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PaisDto } from '../pais/pais.dto';
import { PaisEntity } from '../pais/pais.entity';
import { CulturaGastronomicaPaisesService } from './cultura-gastronomica-paises.service';

@Controller('cultura-gastronomica')
@UseGuards(JwtAuthGuard,RolesGuard)
export class CulturaGastronomicaPaisesController {

    constructor(private readonly culturaGastronomicaPaisesService: CulturaGastronomicaPaisesService) { }
  
    @Post(':culturaGastronomicaId/pais/:paisId')
    @HasRoles(Role.UserWrite)
    async addProductoCaracteristicoCulturaGastronomica(@Param('culturaGastronomicaId') culturaGastronomicaId: string, @Param('paisId') paisId: string) {
      return await this.culturaGastronomicaPaisesService.addPaisToCulturaGastronomica(culturaGastronomicaId, paisId);
    }

    @Get(':culturaGastronomicaId/pais/:paisId')
    @HasRoles(Role.UserGastronomy)
    async findPaisByPaisIdCulturaGastronomicaId(@Param('culturaGastronomicaId') culturaGastronomicaId: string, @Param('paisId') paisId: string) {
      return await this.culturaGastronomicaPaisesService.findPaisPorPaisIdCulturaGastronomicaId(culturaGastronomicaId, paisId);
    }

    @Get(':culturaGastronomicaId/pais')
    @HasRoles(Role.UserGastronomy)
    async findPaisesByCulturaGastronomicaId(@Param('culturaGastronomicaId') culturaGastronomicaId: string) {
      return await this.culturaGastronomicaPaisesService.findPaisesPorCulturaGastronomicaId(culturaGastronomicaId);
    }

    @Put(':culturaGastronomicaId/pais')
    @HasRoles(Role.UserWrite)
    async associatePaisesCulturaGastronomicaId(@Body() paisDto: PaisDto[], @Param('culturaGastronomicaId') culturaGastronomicaId: string) {
      const paises = plainToInstance(PaisEntity, paisDto)
      return await this.culturaGastronomicaPaisesService.associatePaisesToCulturaGastronomica(culturaGastronomicaId, paises);
    }

    @Delete(':culturaGastronomicaId/pais/:paisId')
    @HttpCode(204)
    @HasRoles(Role.UserDelete)
    async deletePaisCulturaGastronomica(@Param('culturaGastronomicaId') culturaGastronomicaId: string, @Param('paisId') paisId: string) {
      return await this.culturaGastronomicaPaisesService.deletePaisCulturaGastronomica(culturaGastronomicaId, paisId);
    }

}
