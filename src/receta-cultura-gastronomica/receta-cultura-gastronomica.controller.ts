import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { HasRoles } from '../user/has-roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CulturaGastronomicaDto } from '../cultura-gastronomica/cultura-gastronomica.dto';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RecetaCulturaGastronomicaService } from './receta-cultura-gastronomica.service';
import { Role } from '../user/role.enum';

@Controller('recetas')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard,RolesGuard)

export class RecetaCulturaGastronomicaController {
    constructor(private readonly restauranteCulturaGastronomicaService: RecetaCulturaGastronomicaService){}

    @Post(':recetaId/culturasGastronomicas/:culturaGastronomicaId')
    @HasRoles(Role.UserWrite)
    async addCulturaGastronomicaReceta(@Param('recetaId') recetaId: string, @Param('culturaGastronomicaId') culturaGastronomicaId: string){
        return await this.recetaCulturaGastronomicaService.addCulturaGastronomicaReceta(recetaId, culturaGastronomicaId);
    }
}


