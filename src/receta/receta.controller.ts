import { Controller, UseGuards } from '@nestjs/common';
import { RecetaService } from './receta.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { Get, UseInterceptors, Param, Post, Body, Put, Delete, HttpCode } from '@nestjs/common';
import { RecetaEntity } from './receta.entity';
import { RecetaDto } from './receta.dto';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { HasRoles } from '../user/has-roles.decorator';
import { Role } from '../user/role.enum';

@Controller('recetas')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard,RolesGuard)
export class RecetaController {
    constructor(private readonly recetaService: RecetaService) {}

    @Get()
    @HasRoles(Role.UserReceipt)
    async findAll() {
      return await this.recetaService.findAll();
    }

    @Get(':recetaId')
    @HasRoles(Role.UserReceipt)
    async findOne(@Param('recetaId') recetaId: string) {
      return await this.recetaService.findOne(recetaId);
    }

    @Post()
    @HasRoles(Role.UserWrite)
    async create(@Body() recetaDto: RecetaDto) {
      const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDto);
      return await this.recetaService.create(receta);
    }

    @Put(':recetaId')
    @HasRoles(Role.UserWrite)
    async update(@Param('recetaId') recetaId: string, @Body() recetaDto: RecetaDto) {
      const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDto);
      return await this.recetaService.update(recetaId, receta);
    }

    @Delete(':recetaId')
    @HttpCode(204)
    @HasRoles(Role.UserDelete)
    async delete(@Param('recetaId') recetaId: string) {
      return await this.recetaService.delete(recetaId);
    }
}




