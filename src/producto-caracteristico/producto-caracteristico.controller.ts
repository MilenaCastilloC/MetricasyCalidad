import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductoCaracteristicoDto } from './producto-caracteristico.dto';
import { ProductoCaracteristicoEntity } from './producto-caracteristico.entity';
import { ProductoCaracteristicoService } from './producto-caracteristico.service';
import { HasRoles } from '../user/has-roles.decorator';
import { Role } from '../user/role.enum';

@Controller('productosCaracteristicos')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard,RolesGuard)
export class ProductoCaracteristicoController {

  constructor(private readonly productoCaracteristicoService: ProductoCaracteristicoService) { }

  @Get()
  @HasRoles(Role.UserProduct)
  async findAll() {
    return await this.productoCaracteristicoService.findAll();
  }

  @Get(':productoCaracteristicoId')
  @HasRoles(Role.UserProduct)
  async findOne(@Param('productoCaracteristicoId') productoCaracteristicoId: string) {
    return await this.productoCaracteristicoService.findOne(productoCaracteristicoId);
  }

  @Post()
  @HasRoles(Role.UserWrite)
  async create(@Body() productoCaracteristicoDto: ProductoCaracteristicoDto) {
    const productoCaracteristico: ProductoCaracteristicoEntity = plainToInstance(ProductoCaracteristicoEntity, productoCaracteristicoDto);
    return await this.productoCaracteristicoService.create(productoCaracteristico);
  }

  @Put(':productoCaracteristicoId')
  @HasRoles(Role.UserWrite)
  async update(@Param('productoCaracteristicoId') productoCaracteristicoId: string, @Body() productoCaracteristicoDto: ProductoCaracteristicoDto) {
    const productoCaracteristico: ProductoCaracteristicoEntity = plainToInstance(ProductoCaracteristicoEntity, productoCaracteristicoDto);
    return await this.productoCaracteristicoService.update(productoCaracteristicoId, productoCaracteristico);
  }

  @Delete(':productoCaracteristicoId')
  @HttpCode(204)
  @HasRoles(Role.UserDelete)
  async delete(@Param('productoCaracteristicoId') productoCaracteristicoId: string) {
    return await this.productoCaracteristicoService.delete(productoCaracteristicoId);
  }
}