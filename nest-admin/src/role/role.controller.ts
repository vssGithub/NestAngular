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
        @Body('name') name: string,
        @Body('permissions') ids: number[]
    ) {
        return this.roleService.create({
            name,
            permissions: ids.map((id) => ({id}))
        });
    }

    @Get(':id')
    async get(@Param('id') id: number) {
        //return await this.roleService.findOne({where: {id: id}});

        //https://wanago.io/2022/07/11/api-with-nestjs-migrating-to-typeorm-0-3/
        //https://orkhan.gitbook.io/typeorm/docs/find-options#advanced-options
        // needed to change to this format HERE and not in the service!
        return await this.roleService.findOne({
            where: {
              id: id
            },
            relations: ['permissions']
          });
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body('name') name: string,
        @Body('permissions') ids: number[]
    ) {
        await this.roleService.update(id, {name});
        const role = await this.roleService.findOne({where: {id: id}});

        // if we await here
        return this.roleService.create({
            ...role,
            permissions: ids.map((id) => ({id}))
        })

        //and return the same as 'get' above, packet response from update will 
        //be similar/consistent with 'get'
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.roleService.delete(id);
    }
}
