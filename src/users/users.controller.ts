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

  /**
   * Retrieve manufacturing departments & hierarchy structure strictly scoped
   * to the authenticated company's registered sub-category.
   * Cross-category specialized roles from unrelated industries are excluded.
   * GET /users/hierarchy
   */
  @Get('hierarchy')
  getHierarchy(@Request() req: any, @Query('subCategory') subCategoryQuery?: string) {
    const companyId = req?.user?.companyId;
    const subCategory = subCategoryQuery || req?.user?.company?.subCategory;
    return this.usersService.getHierarchyMetadata(companyId, subCategory);
  }

  /**
   * List employees for the company directory (SUPER_ADMIN, CEO, MD, Owner & HR Department)
   * Strictly isolated to the authenticated tenant's companyId.
   * GET /users
   */
  @Get()
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.EXECUTIVE,
    Role.HR_MANAGER,
    Role.HR_ASSISTANT_MANAGER,
    Role.HR_ASSOCIATE_MANAGER,
    Role.HR,
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

  /**
   * Get single employee by ID strictly within the authenticated company.
   * GET /users/:id
   */
  @Get(':id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.EXECUTIVE,
    Role.HR_MANAGER,
    Role.HR_ASSISTANT_MANAGER,
    Role.HR_ASSOCIATE_MANAGER,
    Role.HR,
  )
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.usersService.findOneByCompany(req.user.companyId, id);
  }

  /**
   * Onboard a new employee and assign department + management level
   * POST /users
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.EXECUTIVE,
    Role.HR_MANAGER,
    Role.HR_ASSISTANT_MANAGER,
    Role.HR,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Request() req: any, @Body() createUserDto: CreateUserDto) {
    return this.usersService.createEmployee(req.user, createUserDto);
  }

  /**
   * Assign or update an employee's department, designation, and RBAC role
   * PATCH /users/:id/role
   */
  @Patch(':id/role')
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.EXECUTIVE,
    Role.HR_MANAGER,
    Role.HR,
  )
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateRole(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateEmployeeRole(req.user, id, updateUserRoleDto);
  }

  /**
   * Activate or deactivate an employee account
   * PATCH /users/:id/status
   */
  @Patch(':id/status')
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.EXECUTIVE,
    Role.HR_MANAGER,
    Role.HR,
  )
  toggleStatus(@Request() req: any, @Param('id') id: string) {
    return this.usersService.toggleStatus(req.user, id);
  }

  /**
   * Remove an employee from the company directory
   * DELETE /users/:id
   */
  @Delete(':id')
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.EXECUTIVE,
    Role.HR_MANAGER,
    Role.HR,
  )
  remove(@Request() req: any, @Param('id') id: string) {
    return this.usersService.removeEmployee(req.user, id);
  }

  /**
   * RBAC Policy Guard Example: Production Order Approval
   * Restricted strictly to Executive Leadership (SUPER_ADMIN/CEO/MD/Owner) or Production Manager
   * POST /users/rbac/approve-production-order
   */
  @Post('rbac/approve-production-order')
  @Roles(
    Role.SUPER_ADMIN,
    Role.CEO,
    Role.MD,
    Role.OWNER,
    Role.EXECUTIVE,
    Role.PRODUCTION_MANAGER,
    Role.PRODUCTION,
  )
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
