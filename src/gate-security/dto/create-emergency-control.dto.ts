import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateEmergencyControlDto {
  @IsString()
  @IsNotEmpty()
  incidentType!: string; // "FIRE_ALARM_EVACUATION", "CHEMICAL_LEAK_HAZMAT", "MEDICAL_AMBULANCE_CALL", "POLICE_SECURITY_BREACH", "SEVERE_WEATHER_ALERT", "SAFETY_MOCK_DRILL"

  @IsString()
  @IsNotEmpty()
  gateOperationsMode!: string; // "NORMAL_SECURITY_CHECK", "EMERGENCY_ALL_GATES_OPEN", "RESTRICTED_LOCKDOWN", "EVACUATION_CLEARANCE"

  @IsString()
  @IsNotEmpty()
  emergencyAgencyNotified!: string; // "FIRE_BRIGADE_101", "POLICE_CONTROL_100", "AMBULANCE_DISPATCH_108", "INTERNAL_EHS_TEAM", "ALL_SERVICES_DISPATCHED"

  @IsString()
  @IsOptional()
  emergencyContactPhone?: string;

  @IsString()
  @IsOptional()
  cctvSurveillanceStatus?: string; // "ALL_CAMERAS_OPERATIONAL", "BLINDSPOT_ALERT", "PERIMETER_ALARM_TRIGGERED"

  @IsString()
  @IsNotEmpty()
  gateStationNumber!: string; // "GATE-01-MAIN", "GATE-02-LOGISTICS", "GATE-03-EMERGENCY-EXIT"

  @IsString()
  @IsNotEmpty()
  incidentSeverity!: string; // "LOW_MOCK_DRILL", "MEDIUM_CONTROLLED", "HIGH_ACTIVE_EMERGENCY", "CRITICAL_EVACUATE"

  @IsString()
  @IsNotEmpty()
  commandingOfficerName!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ResolveEmergencyControlDto {
  @IsString()
  @IsNotEmpty()
  gateOperationsMode!: string; // "NORMAL_SECURITY_CHECK", "RESTRICTED_LOCKDOWN"

  @IsDateString()
  @IsOptional()
  incidentResolvedTime?: string;

  @IsString()
  @IsNotEmpty()
  resolutionSummary!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
