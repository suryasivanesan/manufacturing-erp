import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SteelOperationsModule } from './steel-operations/steel-operations.module';
import { GlassOperationsModule } from './glass-operations/glass-operations.module';
import { ChemicalOperationsModule } from './chemical-operations/chemical-operations.module';
import { PaintOperationsModule } from './paint-operations/paint-operations.module';
import { RubberOperationsModule } from './rubber-operations/rubber-operations.module';
import { PipesOperationsModule } from './pipes-operations/pipes-operations.module';
import { AutomobileOperationsModule } from './automobile-operations/automobile-operations.module';
import { ElectronicalOperationsModule } from './electronical-operations/electronical-operations.module';
import { ElectricEquipmentOperationsModule } from './electric-equipment-operations/electric-equipment-operations.module';
import { CableWireOperationsModule } from './cable-wire-operations/cable-wire-operations.module';
import { TextilesOperationsModule } from './textiles-operations/textiles-operations.module';
import { JewelleryOperationsModule } from './jewellery-operations/jewellery-operations.module';
import { LeatherOperationsModule } from './leather-operations/leather-operations.module';
import { FurnitureOperationsModule } from './furniture-operations/furniture-operations.module';
import { DairyOperationsModule } from './dairy-operations/dairy-operations.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { ExecutiveModule } from './executive/executive.module';
import { QualityModule } from './quality/quality.module';
import { InventoryModule } from './inventory/inventory.module';
import { FinanceModule } from './finance/finance.module';
import { HrModule } from './hr/hr.module';
import { ProcurementModule } from './procurement/procurement.module';
import { SalesModule } from './sales/sales.module';
import { LogisticsModule } from './logistics/logistics.module';
import { GateSecurityModule } from './gate-security/gate-security.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    SuperAdminModule,
    ApprovalsModule,
    ExecutiveModule,
    QualityModule,
    InventoryModule,
    FinanceModule,
    HrModule,
    ProcurementModule,
    SalesModule,
    LogisticsModule,
    GateSecurityModule,
    SteelOperationsModule,
    GlassOperationsModule,
    ChemicalOperationsModule,
    PaintOperationsModule,
    RubberOperationsModule,
    PipesOperationsModule,
    AutomobileOperationsModule,
    ElectronicalOperationsModule,
    ElectricEquipmentOperationsModule,
    CableWireOperationsModule,
    TextilesOperationsModule,
    JewelleryOperationsModule,
    LeatherOperationsModule,
    FurnitureOperationsModule,
    DairyOperationsModule,
  ],
})
export class AppModule {}
