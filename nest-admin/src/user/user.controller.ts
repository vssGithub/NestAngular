import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, forwardRef, Get, Inject, Param, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { HasPermission } from 'src/permission/has-permission.decorator';
import { UserCreateDto } from './models/user-create.dto';
import { UserUpdateDto } from './models/user-update.dto';
import { User } from './models/user.entity';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
    //https://www.youtube.com/watch?v=gWMPGDG42SA   ...circular dependency
    constructor(
        @Inject(forwardRef(() => UserService)) private userService: UserService,
        private authService: AuthService
    ) {
        
    }

    @Get()
    @HasPermission('users')
    async all(@Query('page') page = 1) {
        return await this.userService.paginate(page, ['role']);
    }

    @Post()
    @HasPermission('users')
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
    @HasPermission('users')
    async get(@Param('id') id: number) {
        return await this.userService.findOne({
            where: {
              id: id
            },
            relations: ['role']
          });
    }

    @Put('info')
    async updateInfo(
        @Req() request: Request,
        @Body() body: UserUpdateDto
    ) {
        const id = await this.authService.userId(request);
        await this.userService.update(id, body);
        
        return await this.userService.findOne({where: {id: id}});
    }

    @Put('password')
    async updatePassword(
        @Req() request: Request,
        @Body('password') password: string,
        @Body('password_confirm') password_confirm: string
    ) {
        if (password !== password_confirm) {
            throw new BadRequestException('Passwords do not match');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const id = await this.authService.userId(request);

        await this.userService.update(id, {
            password: hashedPassword
        });
        
        return await this.userService.findOne({where: {id: id}});
    }


    @Put(':id')
    @HasPermission('users')
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
    @HasPermission('users')
    async delete(@Param('id') id: number) {
        return await this.userService.delete(id);
    }
}
