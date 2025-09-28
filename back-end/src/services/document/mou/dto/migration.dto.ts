import { IsOptional, IsBoolean } from 'class-validator';

export class MigrationOptionsDto {
  @IsOptional()
  @IsBoolean()
  dryRun?: boolean = false;

  @IsOptional()
  @IsBoolean()
  force?: boolean = false;
}

export interface MigrationResult {
  success: boolean;
  affectedRows: number;
  message: string;
  errors?: string[];
  warnings?: string[];
  details?: {
    activeToSigned?: number;
    invalidStatuses?: number;
    enumValuesAdded?: string[];
  };
}

export interface EnumCheckResult {
  exists: boolean;
  values: string[];
  missingValues: string[];
}
