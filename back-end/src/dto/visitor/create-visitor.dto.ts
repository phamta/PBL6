import { IsString, IsDateString, IsOptional, IsEnum, IsArray, IsNumber, IsEmail } from 'class-validator';
import { VisitorStatus } from '../../entities/visitor.entity';

export class CreateVisitorDto {
  @IsString()
  groupName: string;

  @IsString()
  organizationName: string;

  @IsString()
  country: string;

  @IsNumber()
  numberOfMembers: number;

  @IsString()
  contactPerson: string;

  @IsEmail()
  contactEmail: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsDateString()
  arrivalDate: string;

  @IsDateString()
  departureDate: string;

  @IsString()
  purpose: string;

  @IsOptional()
  @IsEnum(VisitorStatus)
  status?: VisitorStatus;

  @IsOptional()
  @IsString()
  itinerary?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  membersList?: string[];

  // Additional fields for individual visitor tracking
  @IsOptional()
  @IsString()
  visitorCode?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  passportNumber?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  invitingUnit?: string;

  @IsOptional()
  @IsString()
  passportScanPath?: string;

  @IsOptional()
  @IsString()
  documentPath?: string;
}
