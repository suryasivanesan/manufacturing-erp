import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ExecutiveService } from './executive.service';
import { UserContext } from '../approvals/approvals.service';
import { DraftRawMaterialEditDto, DraftProductEditDto } from './dto/draft-edit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/rbac.constants';

@Controller('executive')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.CEO, Role.MD, Role.OWNER, Role.EXECUTIVE)
export class ExecutiveController {
  constructor(private readonly executiveService: ExecutiveService) {}

  private extractUser(req: any): UserContext {
    return {
      id: req?.user?.id || 'usr-exec-01',
      email: req?.user?.email || 'executive@company.com',
      role: req?.user?.role || 'EXECUTIVE',
      companyId: req?.user?.companyId || 'company_isolated_01',
      firstName: req?.user?.firstName || 'Chief Executive',
    };
  }

  // =========================================================================
  // 1. EXECUTIVE MOVEMENT OVERVIEW & ENTERPRISE KPIs
  // =========================================================================

  @Get('overview')
  async getOverview(@Request() req: any) {
    const user = this.extractUser(req);
    return this.executiveService.getExecutiveOverview(user);
  }

  // =========================================================================
  // 2. GET SUBMITTED DRAFT REQUESTS & STATUSES
  // =========================================================================

  @Get('drafts')
  async getDrafts(@Request() req: any) {
    const user = this.extractUser(req);
    return this.executiveService.getExecutiveDrafts(user);
  }

  // =========================================================================
  // 3. SUBMIT DRAFT EDIT: RAW MATERIAL (TRIGGERS APPROVAL PIPELINE)
  // =========================================================================

  @Post('draft/raw-material/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  async submitDraftRawMaterial(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: DraftRawMaterialEditDto,
  ) {
    const user = this.extractUser(req);
    return this.executiveService.submitDraftRawMaterialEdit(user, id, dto);
  }

  // =========================================================================
  // 4. SUBMIT DRAFT EDIT: FINISHED PRODUCT (TRIGGERS APPROVAL PIPELINE)
  // =========================================================================

  @Post('draft/product/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  async submitDraftProduct(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: DraftProductEditDto,
  ) {
    const user = this.extractUser(req);
    return this.executiveService.submitDraftProductEdit(user, id, dto);
  }
}
