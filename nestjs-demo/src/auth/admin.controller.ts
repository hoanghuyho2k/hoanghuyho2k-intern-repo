import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {
  @Get()
  @Roles('admin')
  getAdminData() {
    return {
      message: 'Admin access granted',
    };
  }
}