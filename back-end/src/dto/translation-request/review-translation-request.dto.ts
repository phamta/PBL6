import { IsString, IsNotEmpty } from 'class-validator';

export class ReviewTranslationRequestDto {
  @IsString()
  @IsNotEmpty()
  reviewComments: string;
}
