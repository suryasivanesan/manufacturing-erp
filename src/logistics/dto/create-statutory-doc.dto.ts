import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateStatutoryDocDto {
  @IsString()
  @IsNotEmpty()
  consignorOrConsignee!: string;

  @IsString()
  @IsNotEmpty()
  documentType!: string; // "E_WAY_BILL", "DELIVERY_CHALLAN", "WEIGHBRIDGE_OUTWARD_SLIP", "TRANSPORTER_CONSIGNMENT_NOTE", "TAX_INVOICE_TRANSIT_PASS"

  @IsString()
  @IsNotEmpty()
  documentReferenceNumber!: string;

  @IsString()
  @IsOptional()
  invoiceReferenceNumber?: string;

  @IsString()
  @IsOptional()
  weighbridgeSlipNumber?: string;

  @IsString()
  @IsNotEmpty()
  vehicleNumber!: string;

  @IsDateString()
  @IsNotEmpty()
  validFrom!: string;

  @IsDateString()
  @IsNotEmpty()
  validTill!: string;

  @IsBoolean()
  @IsOptional()
  interstatePermit?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class VerifyStatutoryDocDto {
  @IsString()
  @IsNotEmpty()
  complianceVerificationStatus!: string; // "VALID_VERIFIED", "EXPIRED_ALERT", "UNDER_SCRUTINY", "GATE_CLEARED"

  @IsBoolean()
  @IsOptional()
  digitalQrcodeVerified?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}
