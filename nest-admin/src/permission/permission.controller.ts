import { Controller, Get } from '@nestjs/common';
import { HasPermission } from './has-permission.decorator';
import { PermissionService } from './permission.service';

@Controller('permissions')
export class PermissionController {
    constructor(private persmissionService: PermissionService) {

    }

    @Get()
    @HasPermission('view_permissions')
    async all() {
        return this.persmissionService.all();
    }
}
