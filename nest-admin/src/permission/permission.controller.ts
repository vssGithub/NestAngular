import { Controller, Get } from '@nestjs/common';
import { PermissionService } from './permission.service';

@Controller('permissions')
export class PermissionController {
    constructor(private persmissionService: PermissionService) {

    }

    @Get()
    async all() {
        return this.persmissionService.all();
    }
}
