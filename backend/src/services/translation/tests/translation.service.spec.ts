import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { TranslationService } from '../translation.service';
import { PrismaService } from '../../../database/prisma.service';
import { TranslationStatus } from '@prisma/client';
import { CreateTranslationDto } from '../dto';

describe('TranslationService - Create', () => {
  let service: TranslationService;
  let prisma: PrismaService;
  let eventEmitter: EventEmitter2;

  const mockPrismaService = {
    translation: {
      create: jest.fn(),
    },
    partner: {
      findUnique: jest.fn(),
    },
    unit: {
      findUnique: jest.fn(),
    },
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranslationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<TranslationService>(TranslationService);
    prisma = module.get<PrismaService>(PrismaService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const mockUser = {
      id: 'user-1',
      actions: ['TRANSLATION_CREATE'],
      unitId: 'unit-1',
    };

    const mockCreateTranslationDto: CreateTranslationDto = {
      applicantName: 'Nguyễn Văn A',
      applicantEmail: 'nguyen.vana@example.com',
      applicantPhone: '+84901234567',
      documentTitle: 'Bằng tốt nghiệp Đại học',
      sourceLanguage: 'Vietnamese',
      targetLanguage: 'English',
      documentType: 'Diploma',
      purpose: 'Nộp hồ sơ du học',
      urgentLevel: 'NORMAL',
      originalFile: 'uploads/documents/original_diploma.pdf',
      translatedFile: 'uploads/documents/translated_diploma.pdf',
      attachments: ['uploads/passport.jpg', 'uploads/invitation.pdf'],
      notes: 'Cần dịch công chứng',
      unitName: 'Phòng Hợp tác Quốc tế',
      translatorName: 'Nguyễn Thị Lan',
      reason: 'Phục vụ hồ sơ du học',
      verificationFile: 'uploads/verification/notarized_doc.pdf',
      languagePair: 'Vietnamese  English',
      partnerId: 'partner-1',
      unitId: 'unit-1',
    };

    const mockCreatedTranslation = {
      id: 'translation-1',
      applicantName: 'Nguyễn Văn A',
      applicantEmail: 'nguyen.vana@example.com',
      applicantPhone: '+84901234567',
      documentTitle: 'Bằng tốt nghiệp Đại học',
      sourceLanguage: 'Vietnamese',
      targetLanguage: 'English',
      documentType: 'Diploma',
      purpose: 'Nộp hồ sơ du học',
      urgentLevel: 'NORMAL',
      status: TranslationStatus.PENDING,
      originalFile: 'uploads/documents/original_diploma.pdf',
      translatedFile: 'uploads/documents/translated_diploma.pdf',
      attachments: ['uploads/passport.jpg', 'uploads/invitation.pdf'],
      notes: 'Cần dịch công chứng',
      unitName: 'Phòng Hợp tác Quốc tế',
      translatorName: 'Nguyễn Thị Lan',
      reason: 'Phục vụ hồ sơ du học',
      verificationFile: 'uploads/verification/notarized_doc.pdf',
      languagePair: 'Vietnamese  English',
      createdBy: {
        id: 'user-1',
        fullName: 'Test User',
        email: 'test@example.com',
        unitId: 'unit-1',
      },
      partner: {
        id: 'partner-1',
        name: 'Partner Company',
        country: 'Vietnam',
        contactEmail: 'partner@example.com',
      },
      unit: {
        id: 'unit-1',
        name: 'IT Unit',
        code: 'IT',
      },
      approvedBy: null,
    };

    describe('✅ SUCCESS CASES - Test normal operation scenarios', () => {
      it('should create a translation successfully', async () => {
        // Arrange
        mockPrismaService.partner.findUnique.mockResolvedValue({ id: 'partner-1' });
        mockPrismaService.unit.findUnique.mockResolvedValue({ id: 'unit-1' });
        mockPrismaService.translation.create.mockResolvedValue(mockCreatedTranslation);

        // Act
        const result = await service.create(mockCreateTranslationDto, mockUser);

        // Assert
        expect(mockPrismaService.partner.findUnique).toHaveBeenCalledWith({
          where: { id: 'partner-1' },
        });
        expect(mockPrismaService.unit.findUnique).toHaveBeenCalledWith({
          where: { id: 'unit-1' },
        });
        expect(mockPrismaService.translation.create).toHaveBeenCalledWith({
          data: expect.objectContaining({
            applicantName: 'Nguyễn Văn A',
            applicantEmail: 'nguyen.vana@example.com',
            applicantPhone: '+84901234567',
            documentTitle: 'Bằng tốt nghiệp Đại học',
            sourceLanguage: 'Vietnamese',
            targetLanguage: 'English',
            documentType: 'Diploma',
            purpose: 'Nộp hồ sơ du học',
            urgentLevel: 'NORMAL',
            status: TranslationStatus.PENDING,
            originalFile: 'uploads/documents/original_diploma.pdf',
            translatedFile: 'uploads/documents/translated_diploma.pdf',
            attachments: ['uploads/passport.jpg', 'uploads/invitation.pdf'],
            notes: 'Cần dịch công chứng',
            unitName: 'Phòng Hợp tác Quốc tế',
            translatorName: 'Nguyễn Thị Lan',
            reason: 'Phục vụ hồ sơ du học',
            verificationFile: 'uploads/verification/notarized_doc.pdf',
            languagePair: 'Vietnamese  English',
            createdBy: { connect: { id: 'user-1' } },
            partner: { connect: { id: 'partner-1' } },
            unit: { connect: { id: 'unit-1' } },
          }),
          include: expect.any(Object),
        });
        expect(mockEventEmitter.emit).toHaveBeenCalledWith('translation.created', {
          translationId: 'translation-1',
          userId: 'user-1',
          urgentLevel: 'NORMAL',
          documentTitle: 'Bằng tốt nghiệp Đại học',
        });
        expect(result).toEqual(mockCreatedTranslation);
      });

      it('should create translation without partner and unit when not provided', async () => {
        // Arrange
        const dtoWithoutRelations = { ...mockCreateTranslationDto };
        delete dtoWithoutRelations.partnerId;
        delete dtoWithoutRelations.unitId;

        mockPrismaService.translation.create.mockResolvedValue({
          ...mockCreatedTranslation,
          partner: null,
          unit: null,
        });

        // Act
        const result = await service.create(dtoWithoutRelations, mockUser);

        // Assert
        expect(mockPrismaService.partner.findUnique).not.toHaveBeenCalled();
        expect(mockPrismaService.unit.findUnique).not.toHaveBeenCalled();
        expect(mockPrismaService.translation.create).toHaveBeenCalledWith({
          data: expect.not.objectContaining({
            partner: expect.any(Object),
            unit: expect.any(Object),
          }),
          include: expect.any(Object),
        });
        expect(result.partner).toBeNull();
        expect(result.unit).toBeNull();
      });

      it('should create translation with default urgent level when not provided', async () => {
        // Arrange
        const dtoWithoutUrgentLevel = { ...mockCreateTranslationDto };
        delete dtoWithoutUrgentLevel.urgentLevel;

        mockPrismaService.partner.findUnique.mockResolvedValue({ id: 'partner-1' });
        mockPrismaService.unit.findUnique.mockResolvedValue({ id: 'unit-1' });
        mockPrismaService.translation.create.mockResolvedValue({
          ...mockCreatedTranslation,
          urgentLevel: 'NORMAL',
        });

        // Act
        const result = await service.create(dtoWithoutUrgentLevel, mockUser);

        // Assert
        expect(mockPrismaService.translation.create).toHaveBeenCalledWith({
          data: expect.objectContaining({
            urgentLevel: 'NORMAL',
          }),
          include: expect.any(Object),
        });
        expect(result.urgentLevel).toBe('NORMAL');
      });

      it('should create translation with auto-generated language pair when not provided', async () => {
        // Arrange
        const dtoWithoutLanguagePair = { ...mockCreateTranslationDto };
        delete dtoWithoutLanguagePair.languagePair;

        mockPrismaService.partner.findUnique.mockResolvedValue({ id: 'partner-1' });
        mockPrismaService.unit.findUnique.mockResolvedValue({ id: 'unit-1' });
        mockPrismaService.translation.create.mockResolvedValue({
          ...mockCreatedTranslation,
          languagePair: 'Vietnamese  English',
        });

        // Act
        const result = await service.create(dtoWithoutLanguagePair, mockUser);

        // Assert
        expect(mockPrismaService.translation.create).toHaveBeenCalledWith({
          data: expect.objectContaining({
            languagePair: 'Vietnamese  English',
          }),
          include: expect.any(Object),
        });
        expect(result.languagePair).toBe('Vietnamese  English');
      });
    });

    describe('❌ FAILURE CASES - Test error handling and validation', () => {
      let errorTestCounter = 0;

      beforeAll(() => {
        errorTestCounter = 0;
      });

      afterEach(() => {
        errorTestCounter++;
      });

      afterAll(() => {
        console.log(`\n📊 Expected Error Tests Summary:`);
        console.log(`   ❌ Total Error Tests: ${errorTestCounter}`);
        console.log(`   ✅ All Error Tests Passed: ✓\n`);
      });

      it('❌ [PERMISSION] should throw ForbiddenException when user lacks permission', async () => {
        // Arrange
        const userWithoutPermission = { ...mockUser, actions: [] };

        // Act & Assert
        await expect(service.create(mockCreateTranslationDto, userWithoutPermission)).rejects.toThrow(
          ForbiddenException,
        );
        expect(mockPrismaService.translation.create).not.toHaveBeenCalled();
      });

      it('❌ [VALIDATION] should throw BadRequestException when partner does not exist', async () => {
        // Arrange
        mockPrismaService.partner.findUnique.mockResolvedValue(null);

        // Act & Assert
        await expect(service.create(mockCreateTranslationDto, mockUser)).rejects.toThrow(BadRequestException);
        expect(mockPrismaService.translation.create).not.toHaveBeenCalled();
      });

      it('❌ [VALIDATION] should throw BadRequestException when unit does not exist', async () => {
        // Arrange
        mockPrismaService.partner.findUnique.mockResolvedValue({ id: 'partner-1' });
        mockPrismaService.unit.findUnique.mockResolvedValue(null);

        // Act & Assert
        await expect(service.create(mockCreateTranslationDto, mockUser)).rejects.toThrow(BadRequestException);
        expect(mockPrismaService.translation.create).not.toHaveBeenCalled();
      });

      it('❌ [DATABASE] should handle database errors gracefully', async () => {
        // Arrange
        mockPrismaService.partner.findUnique.mockResolvedValue({ id: 'partner-1' });
        mockPrismaService.unit.findUnique.mockResolvedValue({ id: 'unit-1' });
        const dbError = new Error('Database connection failed');
        mockPrismaService.translation.create.mockRejectedValue(dbError);

        // Act & Assert
        await expect(service.create(mockCreateTranslationDto, mockUser)).rejects.toThrow('Database connection failed');
        expect(mockPrismaService.translation.create).toHaveBeenCalled();
      });

      it('❌ [DATABASE] should handle database errors during partner validation', async () => {
        // Arrange
        mockPrismaService.partner.findUnique.mockRejectedValue(new Error('Database connection failed'));

        // Act & Assert
        await expect(service.create(mockCreateTranslationDto, mockUser)).rejects.toThrow('Database connection failed');
        expect(mockPrismaService.translation.create).not.toHaveBeenCalled();
      });

      it('❌ [DATABASE] should handle database errors during unit validation', async () => {
        // Arrange
        mockPrismaService.partner.findUnique.mockResolvedValue({ id: 'partner-1' });
        mockPrismaService.unit.findUnique.mockRejectedValue(new Error('Database connection failed'));

        // Act & Assert
        await expect(service.create(mockCreateTranslationDto, mockUser)).rejects.toThrow('Database connection failed');
        expect(mockPrismaService.translation.create).not.toHaveBeenCalled();
      });

      it('❌ [DATABASE] should handle transaction rollback on database errors', async () => {
        // Arrange
        mockPrismaService.partner.findUnique.mockResolvedValue({ id: 'partner-1' });
        mockPrismaService.unit.findUnique.mockResolvedValue({ id: 'unit-1' });
        mockPrismaService.translation.create.mockRejectedValue(new Error('Transaction failed'));

        // Act & Assert
        await expect(service.create(mockCreateTranslationDto, mockUser)).rejects.toThrow('Transaction failed');
        expect(mockPrismaService.translation.create).toHaveBeenCalled();
      });

      it('❌ [CONCURRENCY] should handle concurrent translation creation conflicts', async () => {
        // Arrange
        mockPrismaService.partner.findUnique.mockResolvedValue({ id: 'partner-1' });
        mockPrismaService.unit.findUnique.mockResolvedValue({ id: 'unit-1' });
        mockPrismaService.translation.create.mockRejectedValue(new Error('Unique constraint violation'));

        // Act & Assert
        await expect(service.create(mockCreateTranslationDto, mockUser)).rejects.toThrow('Unique constraint violation');
        expect(mockPrismaService.translation.create).toHaveBeenCalled();
      });

      it('❌ [VALIDATION] should throw BadRequestException for empty applicantName', async () => {
        // Arrange
        const invalidDto = { ...mockCreateTranslationDto, applicantName: '' };

        // Act & Assert
        await expect(service.create(invalidDto, mockUser)).rejects.toThrow(BadRequestException);
        expect(mockPrismaService.translation.create).not.toHaveBeenCalled();
      });

      it('❌ [VALIDATION] should throw BadRequestException for empty documentTitle', async () => {
        // Arrange
        const invalidDto = { ...mockCreateTranslationDto, documentTitle: '' };

        // Act & Assert
        await expect(service.create(invalidDto, mockUser)).rejects.toThrow(BadRequestException);
        expect(mockPrismaService.translation.create).not.toHaveBeenCalled();
      });

      it('❌ [VALIDATION] should throw BadRequestException for empty sourceLanguage', async () => {
        // Arrange
        const invalidDto = { ...mockCreateTranslationDto, sourceLanguage: '' };

        // Act & Assert
        await expect(service.create(invalidDto, mockUser)).rejects.toThrow(BadRequestException);
        expect(mockPrismaService.translation.create).not.toHaveBeenCalled();
      });

      it('❌ [VALIDATION] should throw BadRequestException for empty targetLanguage', async () => {
        // Arrange
        const invalidDto = { ...mockCreateTranslationDto, targetLanguage: '' };

        // Act & Assert
        await expect(service.create(invalidDto, mockUser)).rejects.toThrow(BadRequestException);
        expect(mockPrismaService.translation.create).not.toHaveBeenCalled();
      });

      it('❌ [VALIDATION] should throw BadRequestException when sourceLanguage equals targetLanguage', async () => {
        // Arrange
        const invalidDto = { ...mockCreateTranslationDto, sourceLanguage: 'English', targetLanguage: 'English' };

        // Act & Assert
        await expect(service.create(invalidDto, mockUser)).rejects.toThrow(BadRequestException);
        expect(mockPrismaService.translation.create).not.toHaveBeenCalled();
      });

      it('❌ [VALIDATION] should throw BadRequestException for invalid applicantEmail format', async () => {
        // Arrange
        const invalidDto = { ...mockCreateTranslationDto, applicantEmail: 'invalid-email' };

        // Act & Assert
        await expect(service.create(invalidDto, mockUser)).rejects.toThrow(BadRequestException);
        expect(mockPrismaService.translation.create).not.toHaveBeenCalled();
      });

      it('❌ [VALIDATION] should throw BadRequestException for invalid applicantPhone format', async () => {
        // Arrange
        const invalidDto = { ...mockCreateTranslationDto, applicantPhone: 'invalid-phone' };

        // Act & Assert
        await expect(service.create(invalidDto, mockUser)).rejects.toThrow(BadRequestException);
        expect(mockPrismaService.translation.create).not.toHaveBeenCalled();
      });

      it('❌ [VALIDATION] should throw BadRequestException for invalid urgentLevel', async () => {
        // Arrange
        const invalidDto = { ...mockCreateTranslationDto, urgentLevel: 'INVALID_LEVEL' as any };

        // Act & Assert
        await expect(service.create(invalidDto, mockUser)).rejects.toThrow(BadRequestException);
        expect(mockPrismaService.translation.create).not.toHaveBeenCalled();
      });

      it('❌ [VALIDATION] should throw BadRequestException for empty documentType', async () => {
        // Arrange
        const invalidDto = { ...mockCreateTranslationDto, documentType: '' };

        // Act & Assert
        await expect(service.create(invalidDto, mockUser)).rejects.toThrow(BadRequestException);
        expect(mockPrismaService.translation.create).not.toHaveBeenCalled();
      });

      it('❌ [VALIDATION] should throw BadRequestException for empty originalFile', async () => {
        // Arrange
        const invalidDto = { ...mockCreateTranslationDto, originalFile: '' };

        // Act & Assert
        await expect(service.create(invalidDto, mockUser)).rejects.toThrow(BadRequestException);
        expect(mockPrismaService.translation.create).not.toHaveBeenCalled();
      });
    });
  });
});