import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, NotFoundException, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './models/register.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {

    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}
    
    @Post('register')
    async register(@Body() body: RegisterDto) {
        if (body.password !== body.password_confirm) {
            throw new BadRequestException('Passwords do not match');
        }

        const hashedPassword = await bcrypt.hash(body.password, 12);
        
        return await this.userService.create({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password: hashedPassword
        });
    }

    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @Res({passthrough: true}) response: Response
    ) {
        //https://github.com/nextauthjs/next-auth/discussions/4322
        const user = await this.userService.findOne({where: {email: email}});
        
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!await bcrypt.compare(password, user.password)) {
            throw new BadRequestException('Invalid credentials');
        }

        const jwt = await this.jwtService.signAsync({id: user.id});
        response.cookie('jwt', jwt, {httpOnly: true});

        return user;
    }

    @Get('user')
    async user(@Req() request: Request) {
        const cookie = request.cookies['jwt'];
        const data = await this.jwtService.verifyAsync(cookie);
        
        return this.userService.findOne({where: {id: data['id']}});
    }

    @Post('logout')
    async logout(@Res({passthrough: true}) response: Response) {
        response.clearCookie('jwt');

        return {
            message: 'Success'
        }
    }
    
}
