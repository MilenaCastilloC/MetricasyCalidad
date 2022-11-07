import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { HasRoles } from '../user/has-roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CulturaGastronomicaDto } from '../cultura-gastronomica/cultura-gastronomica.dto';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestauranteCulturaGastronomicaService } from './restaurante-cultura-gastronomica.service';
import { Role } from '../user/role.enum';

@Controller('restaurantes')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard,RolesGuard)
export class RestauranteCulturaGastronomicaController {
    constructor(private readonly restauranteCulturaGastronomicaService: RestauranteCulturaGastronomicaService){}

    @Post(':restauranteId/culturasGastronomicas/:culturaGastronomicaId')
    @HasRoles(Role.UserWrite)
    async addCulturaGastronomicaRestaurante(@Param('restauranteId') restauranteId: string, @Param('culturaGastronomicaId') culturaGastronomicaId: string){
        return await this.restauranteCulturaGastronomicaService.addCulturaGastronomicaRestaurante(restauranteId, culturaGastronomicaId);
    }

    @Get(':restauranteId/culturasGastronomicas/:culturaGastronomicaId')
    @HasRoles(Role.UserRestaurant)
    async findCulturaGastronomicaByRestauranteIdCulturaGastronomicaId(@Param('restauranteId') restauranteId: string, @Param('culturaGastronomicaId') culturaGastronomicaId: string){
        return await this.restauranteCulturaGastronomicaService.findCulturaGastronomicaPorRestauranteIdCulturaGastronomicaId(restauranteId, culturaGastronomicaId);
    }

    @Get(':restauranteId/culturasGastronomicas')
    @HasRoles(Role.UserRestaurant)
    async findCulturasGastronomicasByRestauranteId(@Param('restauranteId') restauranteId: string){
        return await this.restauranteCulturaGastronomicaService.findCulturasGastronomicasPorRestauranteId(restauranteId);
    }

    @Put(':restauranteId/culturasGastronomicas')
    @HasRoles(Role.UserWrite)
    async associateCulturasGastronomicasRestaurante(@Body() culturasGastronomicasDto: CulturaGastronomicaDto[], @Param('resturanteId') restauranteId: string){
        const culturasGastronomicas = plainToInstance(CulturaGastronomicaEntity, culturasGastronomicasDto)
        return await this.restauranteCulturaGastronomicaService.associateCulturasGastronomicasRestaurante(restauranteId, culturasGastronomicas);
    }

    @Delete(':restauranteId/culturasGastronomicas/:culturaGastronomicaId')
    @HttpCode(204)
    @HasRoles(Role.UserDelete)
    async deleteCulturaGastronomicaRestaurante(@Param('restauranteId') restauranteId: string, @Param('culturaGastronomicaId') culturaGastronomicaId: string){
        return await this.restauranteCulturaGastronomicaService.deleteCulturaGastronomicaRestaurante(restauranteId, culturaGastronomicaId);
    }
}
