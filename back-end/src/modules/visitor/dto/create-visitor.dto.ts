import { IsString, IsDateString, IsOptional, IsEnum, IsArray, IsNumber, IsEmail } from 'class-validator';
import { VisitorStatus } from '../entities/visitor.entity';

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
}
