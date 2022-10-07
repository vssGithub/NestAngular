import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
    constructor(private roleService: RoleService) {

    }

    @Get()
    async all() {
        return this.roleService.all();
    }

    @Post()
    async create(
        @Body('name') name: string
    ) {
        return this.roleService.create({name});
    }

    @Get(':id')
    async get(@Param('id') id: number) {
        return await this.roleService.findOne({where: {id: id}});
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body('name') name: string
    ) {
        await this.roleService.update(id, {name});
        return await this.roleService.findOne({where: {id: id}});
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.roleService.delete(id);
    }
}
