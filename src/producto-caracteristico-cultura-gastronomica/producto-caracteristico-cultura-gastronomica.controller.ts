import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { HasRoles } from '../user/has-roles.decorator';
import { Role } from '../user/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CulturaGastronomicaDto } from '../cultura-gastronomica/cultura-gastronomica.dto';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductoCaracteristicoCulturaGastronomicaService } from './producto-caracteristico-cultura-gastronomica.service';

@Controller('producto-caracteristico-cultura-gastronomica')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard,RolesGuard)
export class ProductoCaracteristicoCulturaGastronomicaController {

  constructor(private readonly productoCaracteristicoCulturaGastronomicaService: ProductoCaracteristicoCulturaGastronomicaService) { }

  @Post(':productoCaracteristicoId/culturasGastronomicas/:culturaGastronomicaId')
  @HasRoles(Role.UserWrite)
  async addCulturaGastronomicaProductoCaracteristico(@Param('productoCaracteristicoId') productoCaracteristicoId: string, @Param('culturaGastronomicaId') culturaGastronomicaId: string) {
    return await this.productoCaracteristicoCulturaGastronomicaService.addCulturaGastronomicaProductoCaracteristico(productoCaracteristicoId, culturaGastronomicaId);
  }

  @Get(':productoCaracteristicoId/culturasGastronomicas/:culturaGastronomicaId')
  @HasRoles(Role.UserProduct)
  async findCulturaGastronomicaByProductoCaracteristicoIdCulturaGastronomicaId(@Param('productoCaracteristicoId') productoCaracteristicoId: string, @Param('culturaGastronomicaId') culturaGastronomicaId: string) {
    return await this.productoCaracteristicoCulturaGastronomicaService.findCulturaGastronomicaPorProductoCaracteristicoIdCulturaGastronomicaId(productoCaracteristicoId, culturaGastronomicaId);
  }

  @Get(':productoCaracteristicoId/culturasGastronomicas')
  @HasRoles(Role.UserProduct)
  async findCulturasGastronomicasByProductoCaracteristicoId(@Param('productoCaracteristicoId') productoCaracteristicoId: string) {
    return await this.productoCaracteristicoCulturaGastronomicaService.findCulturasGastronomicasPorProductoCaracteristicoId(productoCaracteristicoId);
  }

  @Put(':productoCaracteristicoId/culturasGastronomicas')
  @HasRoles(Role.UserWrite)
  async associateCulturasGastronomicasProductoCaracteristicoId(@Body() culturasGastronomicasDto: CulturaGastronomicaDto[], @Param('productoCaracteristicoId') productoCaracteristicoId: string) {
    const culturasGastronomicas = plainToInstance(CulturaGastronomicaEntity, culturasGastronomicasDto)
    return await this.productoCaracteristicoCulturaGastronomicaService.associateCulturasGastronomicasProductoCaracteristico(productoCaracteristicoId, culturasGastronomicas);
  }

  @Delete(':productoCaracteristicoId/culturasGastronomicas/:culturaGastronomicaId')
  @HttpCode(204)
  @HasRoles(Role.UserDelete)
  async deleteCulturaGastronomicaProductoCaracteristico(@Param('productoCaracteristicoId') productoCaracteristicoId: string, @Param('culturaGastronomicaId') culturaGastronomicaId: string) {
    return await this.productoCaracteristicoCulturaGastronomicaService.deleteCulturaGastronomicaProductoCaracteristico(productoCaracteristicoId, culturaGastronomicaId);
  }
}