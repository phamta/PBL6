import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error for properties not in DTO
      transform: true, // Automatically transform payloads to DTO instances
      disableErrorMessages: false,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errors = this.extractErrorMessages(validationErrors);
        return new BadRequestException({
          message: 'Validation failed',
          errors,
        });
      },
    });
  }

  private extractErrorMessages(validationErrors: ValidationError[]): string[] {
    const errors: string[] = [];

    for (const error of validationErrors) {
      if (error.constraints) {
        errors.push(...Object.values(error.constraints));
      }
      if (error.children && error.children.length > 0) {
        errors.push(...this.extractErrorMessages(error.children));
      }
    }

    return errors;
  }
}
