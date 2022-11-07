import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PaisDto } from './pais.dto';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';
import { HasRoles } from '../user/has-roles.decorator';
import { Role } from '../user/role.enum';

@Controller('pais')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard,RolesGuard)
export class PaisController {
    constructor(private readonly paisService: PaisService){}

    @Get()
    @HasRoles(Role.UserCountry)
    async findAll() {
        return await this.paisService.findAll();
    }

    @Get(':paisId')
    @HasRoles(Role.UserCountry)
    async findOne(@Param('paisId') paisId: string) {
        return await this.paisService.findOne(paisId);
    }

    @Post()
    @HasRoles(Role.UserWrite)
    async create(@Body() paisDto: PaisDto) {
        const pais: PaisEntity = plainToInstance(PaisEntity, paisDto);
        return await this.paisService.create(pais);
    }

    @Put(':paisId')
    @HasRoles(Role.UserWrite)
    async update(@Param('paisId') paisId: string, @Body() paisDto: PaisDto) {
        const pais: PaisEntity = plainToInstance(PaisEntity, paisDto);
        return await this.paisService.update(paisId, pais);
    }

    @Delete(':paisId')
    @HttpCode(204)
    @HasRoles(Role.UserDelete)
    async delete(@Param('paisId') paisId: string) {
        return await this.paisService.delete(paisId);
    }

}
