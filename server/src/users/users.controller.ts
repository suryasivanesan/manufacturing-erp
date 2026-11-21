import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Department, Role } from '../auth/constants/rbac.constants';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('hierarchy')
  getHierarchy() {
    return this.usersService.getHierarchyMetadata();
  }

  @Get()
  @Roles(
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.HR_MANAGER,
    Role.HR_ASSISTANT_MANAGER,
    Role.HR_ASSOCIATE_MANAGER,
  )
  findAll(
    @Request() req: any,
    @Query('department') department?: Department,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAllByCompany(req.user.companyId, {
      department,
      search,
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.HR_MANAGER,
    Role.HR_ASSISTANT_MANAGER,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Request() req: any, @Body() createUserDto: CreateUserDto) {
    return this.usersService.createEmployee(req.user, createUserDto);
  }

  @Patch(':id/role')
  @Roles(Role.CEO, Role.MD, Role.OWNER, Role.HR_MANAGER)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateRole(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateEmployeeRole(req.user, id, updateUserRoleDto);
  }

  @Patch(':id/status')
  @Roles(Role.CEO, Role.MD, Role.OWNER, Role.HR_MANAGER)
  toggleStatus(@Request() req: any, @Param('id') id: string) {
    return this.usersService.toggleStatus(req.user, id);
  }

  @Delete(':id')
  @Roles(Role.CEO, Role.MD, Role.OWNER, Role.HR_MANAGER)
  remove(@Request() req: any, @Param('id') id: string) {
    return this.usersService.removeEmployee(req.user, id);
  }

  @Post('rbac/approve-production-order')
  @Roles(Role.CEO, Role.MD, Role.OWNER, Role.PRODUCTION_MANAGER)
  approveProductionOrder(@Request() req: any, @Body('orderNumber') orderNumber?: string) {
    return {
      approved: true,
      orderNumber: orderNumber || 'PO-MFG-2026-001',
      companyId: req.user.companyId,
      approvedBy: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        department: req.user.department,
        companyId: req.user.companyId,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
