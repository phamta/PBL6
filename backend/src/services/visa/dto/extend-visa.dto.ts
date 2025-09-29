import { IsNotEmpty, IsString, IsDateString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExtendVisaDto {
  @ApiProperty({
    description: 'ID of the visa to extend',
    example: 'visa_123',
  })
  @IsNotEmpty({ message: 'Visa ID is required' })
  @IsString({ message: 'Visa ID must be a string' })
  visaId: string;

  @ApiProperty({
    description: 'New expiration date for the visa extension',
    example: '2025-06-30',
  })
  @IsNotEmpty({ message: 'New expiration date is required' })
  @IsDateString({}, { message: 'New expiration date must be a valid date string' })
  newExpirationDate: string;

  @ApiProperty({
    description: 'Reason for visa extension',
    example: 'Continuation of academic research project requiring additional 6 months',
  })
  @IsNotEmpty({ message: 'Reason is required' })
  @IsString({ message: 'Reason must be a string' })
  @Length(10, 500, { message: 'Reason must be between 10 and 500 characters' })
  reason: string;
}