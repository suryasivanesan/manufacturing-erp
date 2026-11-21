import { IsString, IsNotEmpty, IsNumber, IsOptional, IsIn, Min } from 'class-validator';

export class CreateCashBankLedgerDto {
  @IsString()
  @IsOptional()
  accountCode?: string;

  @IsString()
  @IsNotEmpty({ message: 'Account name is required' })
  accountName!: string;

  @IsString()
  @IsOptional()
  @IsIn(['BANK', 'CASH', 'ESCROW'])
  accountType?: string;

  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  accountNumber?: string;

  @IsString()
  @IsOptional()
  ifscCode?: string;

  @IsString()
  @IsOptional()
  branchName?: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsNumber()
  @Min(0, { message: 'Bank balance cannot be negative' })
  bankBalance!: number;

  @IsNumber()
  @Min(0, { message: 'Hand cash reserve cannot be negative' })
  handCash!: number;
}

export class UpdateCashBankBalanceDto {
  @IsString()
  @IsNotEmpty({ message: 'Transaction type is required' })
  @IsIn(['DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'ADJUSTMENT'])
  transactionType!: string;

  @IsString()
  @IsNotEmpty({ message: 'Target account medium is required' })
  @IsIn(['BANK', 'CASH'])
  targetType!: string;

  @IsNumber()
  @Min(0.01, { message: 'Transaction amount must be greater than zero' })
  amount!: number;

  @IsString()
  @IsNotEmpty({ message: 'Transaction reference is required' })
  reference!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
