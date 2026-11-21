import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max, IsBoolean } from 'class-validator';

export class CreateBullionVaultLedgerDto {
  @IsString()
  @IsNotEmpty({ message: 'Transaction code is required' })
  transactionCode!: string;

  @IsString()
  @IsNotEmpty({ message: 'Metal type is required' })
  metalType!: string; // GOLD_24K, GOLD_22K, SILVER_999, PLATINUM_950

  @IsString()
  @IsNotEmpty({ message: 'Movement type is required' })
  movementType!: string; // INWARD_PURCHASE, OUTWARD_CASTING, RECOVERY_RETURN, AUDIT_ADJUSTMENT

  @IsNumber()
  @Min(0.001, { message: 'Gross weight must be greater than 0' })
  grossWeightGrams!: number;

  @IsNumber()
  @Min(1, { message: 'Purity percentage must be at least 1%' })
  @Max(100, { message: 'Purity percentage cannot exceed 100%' })
  purityPercentage!: number;

  @IsNumber()
  @Min(0.001, { message: 'Net pure weight must be greater than 0' })
  netPureWeightGrams!: number;

  @IsString()
  @IsNotEmpty({ message: 'Vault locker ID is required' })
  vaultLockerId!: string;

  @IsNumber()
  @Min(1, { message: 'Live metal market rate must be greater than 0' })
  liveMetalMarketRatePerGram!: number;

  @IsNumber()
  @IsOptional()
  totalValuationInr?: number;

  @IsString()
  @IsNotEmpty({ message: 'Security custodian user is required' })
  securityCustodianUser!: string;

  @IsBoolean()
  @IsOptional()
  dailyBalanceVerified?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}
