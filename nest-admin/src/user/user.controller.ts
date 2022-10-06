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
    async all(@Query('page') page = 1): Promise<User[]> {
        return await this.userService.paginate(page);
    }

    @Post()
    async create(@Body() body: UserCreateDto): Promise<User> {
        const password = await bcrypt.hash('1234', 12);
        
        return await this.userService.create({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password

        });
    }

    @Get(':id')
    async get(@Param('id') id: number) {
        return await this.userService.findOne({where: {id: id}});
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() body: UserUpdateDto
    ) {
        await this.userService.update(id, body);
        return await this.userService.findOne({where: {id: id}});
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.userService.delete(id);
    }
}
