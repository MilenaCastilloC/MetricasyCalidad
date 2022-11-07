import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { HasRoles } from 'src/user/has-roles.decorator';
import { Role } from 'src/user/role.enum';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestauranteDto } from './restaurante.dto';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';


@Controller('restaurantes')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard,RolesGuard)
export class RestauranteController {
    constructor(private readonly restauranteService: RestauranteService){}

    @Get()
    @HasRoles(Role.UserRestaurant)
    async findAll() {
        return await this.restauranteService.findAll();
    }

    @Get(':restauranteId')
    @HasRoles(Role.UserRestaurant)
    async findOne(@Param('restauranteId') restauranteId: string) {
        return await this.restauranteService.findOne(restauranteId);
    }

    @Post()
    @HasRoles(Role.UserWrite)
    async create(@Body() restauranteDto: RestauranteDto) {
        const restaurante: RestauranteEntity = plainToInstance(RestauranteEntity, restauranteDto);
        return await this.restauranteService.create(restaurante);
    }

    @Put(':restauranteId')
    @HasRoles(Role.UserWrite)
    async update(@Param('restauranteId') restauranteId: string, @Body() restauranteDto: RestauranteDto) {
        const restaurante: RestauranteEntity = plainToInstance(RestauranteEntity, restauranteDto);
        return await this.restauranteService.update(restauranteId, restaurante);
    }

    @Delete(':restauranteId')
    @HttpCode(204)
    @HasRoles(Role.UserDelete)
    async delete(@Param('restauranteId') restauranteId: string) {
        return await this.restauranteService.delete(restauranteId);
    }
}
