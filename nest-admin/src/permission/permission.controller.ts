import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionService } from './permission.service';

@UseGuards(AuthGuard)
@Controller('permissions')
export class PermissionController {
    constructor(private persmissionService: PermissionService) {

    }

    @Get()
    async all() {
        return this.persmissionService.all();
    }
}
