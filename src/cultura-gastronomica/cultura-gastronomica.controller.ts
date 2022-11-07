import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaGastronomicaDto } from './cultura-gastronomica.dto';
import { CulturaGastronomicaEntity } from './cultura-gastronomica.entity';
import { CulturaGastronomicaService } from './cultura-gastronomica.service';
import { HasRoles } from '../user/has-roles.decorator';
import { Role } from 'src/user/role.enum';

@Controller('cultura-gastronomica')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard,RolesGuard)
export class CulturaGastronomicaController {

    constructor(private readonly culturaGastronomicaService: CulturaGastronomicaService){}

    @Get()
    @HasRoles(Role.UserGastronomy)
    async findAll() {
        return await this.culturaGastronomicaService.findAll();
    }

    @Get(':culturaGastronomicaId')
    @HasRoles(Role.UserGastronomy)
    async findOne(@Param('culturaGastronomicaId') culturaGastronomicaId: string) {
        return await this.culturaGastronomicaService.findOne(culturaGastronomicaId);
    }

    @Post()
    @HasRoles(Role.UserWrite)
    async create(@Body() culturaGastronomicaDto: CulturaGastronomicaDto) {
        const culturaGastronomica: CulturaGastronomicaEntity = plainToInstance(CulturaGastronomicaEntity, culturaGastronomicaDto);
        return await this.culturaGastronomicaService.create(culturaGastronomica);
    }

    @Put(':culturaGastronomicaId')
    @HasRoles(Role.UserWrite)
    async update(@Param('culturaGastronomicaId') culturaGastronomicaId: string, @Body() culturaGastronomicaDto: CulturaGastronomicaDto) {
        const culturaGastronomica: CulturaGastronomicaEntity = plainToInstance(CulturaGastronomicaEntity, culturaGastronomicaDto);
        return await this.culturaGastronomicaService.update(culturaGastronomicaId, culturaGastronomica);
    }

    @Delete(':culturaGastronomicaId')
    @HasRoles(Role.UserDelete)
    @HttpCode(204)
    async delete(@Param('culturaGastronomicaId') culturaGastronomicaId: string) {
        return await this.culturaGastronomicaService.delete(culturaGastronomicaId);
    }

}
