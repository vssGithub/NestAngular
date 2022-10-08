import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserCreateDto } from './models/user-create.dto';
import { UserUpdateDto } from './models/user-update.dto';
import { User } from './models/user.entity';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {
        
    }

    @Get()
    async all(@Query('page') page = 1) {
        return await this.userService.paginate(page, ['role']);
    }

    @Post()
    async create(@Body() body: UserCreateDto): Promise<User> {
        const password = await bcrypt.hash('1234', 12);

        const {role_id, ...data} = body;
        
        return await this.userService.create({
            ...data,
            password,
            role: {id: role_id}
        });
    }

    @Get(':id')
    async get(@Param('id') id: number) {
        return await this.userService.findOne({
            where: {
              id: id
            },
            relations: ['role']
          });
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() body: UserUpdateDto
    ) {
        const {role_id, ...data} = body;

        await this.userService.update(id, {
            ...data,
            role: {id: role_id}
        });
        return await this.userService.findOne({where: {id: id}});
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.userService.delete(id);
    }
}
