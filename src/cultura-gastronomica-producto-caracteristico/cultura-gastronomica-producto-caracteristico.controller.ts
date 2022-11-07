import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { HasRoles } from 'src/user/has-roles.decorator';
import { Role } from 'src/user/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ProductoCaracteristicoDto } from '../producto-caracteristico/producto-caracteristico.dto';
import { ProductoCaracteristicoEntity } from '../producto-caracteristico/producto-caracteristico.entity';
import { CulturaGastronomicaProductoCaracteristicoService } from './cultura-gastronomica-producto-caracteristico.service';

@Controller('cultura-gastronomica-producto-caracteristico')
@UseGuards(JwtAuthGuard,RolesGuard)
export class CulturaGastronomicaProductoCaracteristicoController {

  constructor(private readonly culturaGastronomicaProductoCaracteristicoService: CulturaGastronomicaProductoCaracteristicoService) { }

  @Post(':culturaGastronomicaId/productosCaracteristicos/:productoCaracteristicoId')
  @HasRoles(Role.UserWrite)
  async addProductoCaracteristicoCulturaGastronomica(@Param('culturaGastronomicaId') culturaGastronomicaId: string, @Param('productoCaracteristicoId') productoCaracteristicoId: string) {
    return await this.culturaGastronomicaProductoCaracteristicoService.addProductoCaracteristicoToCulturaGastronomica(culturaGastronomicaId, productoCaracteristicoId);
  }

  @Get(':culturaGastronomicaId/productosCaracteristicos/:productoCaracteristicoId')
  @HasRoles(Role.UserGastronomy)
  async findProductoCaracteristicoByProductoCaracteristicoIdCulturaGastronomicaId(@Param('culturaGastronomicaId') culturaGastronomicaId: string, @Param('productoCaracteristicoId') productoCaracteristicoId: string) {
    return await this.culturaGastronomicaProductoCaracteristicoService.findProductoCaracteristicoPorProductoCaracteristicoIdCulturaGastronomicaId(culturaGastronomicaId, productoCaracteristicoId);
  }

  @Get(':culturaGastronomicaId/productosCaracteristicos')
  @HasRoles(Role.UserGastronomy)
  async findProductosCaracteristicosByCulturaGastronomicaId(@Param('culturaGastronomicaId') culturaGastronomicaId: string) {
    return await this.culturaGastronomicaProductoCaracteristicoService.findProductosCaracteristicosPorCulturaGastronomicaId(culturaGastronomicaId);
  }

  @Put(':culturaGastronomicaId/productosCaracteristicos')
  @HasRoles(Role.UserWrite)
  async associateProductosCaracteristicosCulturaGastronomicaId(@Body() productosCaracteristicosDto: ProductoCaracteristicoDto[], @Param('culturaGastronomicaId') culturaGastronomicaId: string) {
    const productosCaracteristicos = plainToInstance(ProductoCaracteristicoEntity, productosCaracteristicosDto)
    return await this.culturaGastronomicaProductoCaracteristicoService.associateProductosCaracteristicosToCulturaGastronomica(culturaGastronomicaId, productosCaracteristicos);
  }

  @Delete(':culturaGastronomicaId/productosCaracteristicos/:productoCaracteristicoId')
  @HttpCode(204)
  @HasRoles(Role.UserDelete)
  async deleteProductoCaracteristicoCulturaGastronomica(@Param('culturaGastronomicaId') culturaGastronomicaId: string, @Param('productoCaracteristicoId') productoCaracteristicoId: string) {
    return await this.culturaGastronomicaProductoCaracteristicoService.deleteProductoCaracteristicoCulturaGastronomica(culturaGastronomicaId, productoCaracteristicoId);
  }
}