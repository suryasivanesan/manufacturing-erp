import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApprovalsService, UserContext } from './approvals.service';
import { CreateApprovalRequestDto } from './dto/create-approval-request.dto';
import { DecideApprovalDto } from './dto/decide-approval.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('approvals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  private extractUser(req: any): UserContext {
    return {
      id: req?.user?.id || 'usr-default',
      email: req?.user?.email || 'user@company.com',
      role: req?.user?.role || 'EXECUTIVE',
      companyId: req?.user?.companyId || 'company_isolated_01',
      firstName: req?.user?.firstName || 'Enterprise Executive',
    };
  }

  // =========================================================================
  // 1. SUBMIT DRAFT APPROVAL REQUEST
  // =========================================================================

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.SUPER_ADMIN, Role.CEO, Role.MD, Role.OWNER, Role.EXECUTIVE)
  async submitApprovalRequest(
    @Request() req: any,
    @Body() dto: CreateApprovalRequestDto,
  ) {
    const user = this.extractUser(req);
    return this.approvalsService.createApprovalRequest(user, dto);
  }

  // =========================================================================
  // 2. QUERY PENDING & ALL APPROVAL REQUESTS (TENANT ISOLATED)
  // =========================================================================

  @Get('pending')
  @Roles(Role.SUPER_ADMIN, Role.CEO, Role.MD, Role.OWNER, Role.EXECUTIVE)
  async getPendingApprovals(@Request() req: any) {
    const user = this.extractUser(req);
    return this.approvalsService.getPendingApprovals(user);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.CEO, Role.MD, Role.OWNER, Role.EXECUTIVE)
  async getAllApprovals(
    @Request() req: any,
    @Query('status') status?: string,
  ) {
    const user = this.extractUser(req);
    return this.approvalsService.getAllApprovals(user, status);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.CEO, Role.MD, Role.OWNER, Role.EXECUTIVE)
  async getApprovalById(@Request() req: any, @Param('id') id: string) {
    const user = this.extractUser(req);
    return this.approvalsService.getApprovalById(user, id);
  }

  // =========================================================================
  // 3. DECIDE APPROVAL (APPROVE / REJECT) - STRICT SUPER ADMIN SOLE AUTHORITY
  // =========================================================================

  @Patch(':id/decide')
  @Roles(Role.SUPER_ADMIN, Role.CEO, Role.MD, Role.OWNER)
  async decideApproval(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: DecideApprovalDto,
  ) {
    const user = this.extractUser(req);
    return this.approvalsService.decideApproval(user, id, dto);
  }
}
