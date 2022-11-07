import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { HasRoles } from 'src/user/has-roles.decorator';
import { Role } from 'src/user/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PaisDto } from '../pais/pais.dto';
import { PaisEntity } from '../pais/pais.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestaurantePaisService } from './restaurante-pais.service';

@Controller('restaurantes')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard,RolesGuard)
export class RestaurantePaisController {
    constructor(private readonly restaurantePaisService: RestaurantePaisService){}

    @Post(':restauranteId/pais/:paisId')
    @HasRoles(Role.UserWrite)
    async addPaisRestaurante(@Param('restauranteId') restauranteId: string, @Param('paisId') paisId: string){
        return await this.restaurantePaisService.addPaisRestaurante(restauranteId, paisId);
    }

    @Get(':restauranteId/pais/:paisId')
    @HasRoles(Role.UserRestaurant)
    async findPaisByRestaurantIdPaisId(@Param('restauranteId') restauranteId: string, @Param('paisId') paisId: string){
        return await this.restaurantePaisService.findPaisByRestauranteIdPaisId(restauranteId, paisId);
    }

    @Get(':restauranteId/pais')
    @HasRoles(Role.UserRestaurant)
    async findPaisByRestauranteId(@Param('restauranteId') restauranteId: string){
        return await this.restaurantePaisService.findPaisByResturanteId(restauranteId);
    }

    @Put(':restauranteId/pais')
    @HasRoles(Role.UserWrite)
    async associatePaisRestaurante(@Body() paisDto: PaisDto, @Param('restauranteId') restauranteId: string){
        const pais = plainToInstance(PaisEntity, paisDto)
        return await this.restaurantePaisService.associatePaisRestaurante(restauranteId, pais);
    }

    @Delete(':restauranteId/pais/:paisId')
    @HttpCode(204)
    @HasRoles(Role.UserDelete)
    async deletePaisRestaurante(@Param('restauranteId') restauranteId: string, @Param('paisId') paisId: string){
        return await this.restaurantePaisService.deletePaisRestaurante(restauranteId, paisId);
    }
}
