import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { VisaService } from '../visa.service';
import { PrismaService } from '../../../database/prisma.service';
import { VisaStatus } from '@prisma/client';
import { CreateVisaDto, ExtendVisaDto, ApproveVisaDto, ApprovalAction } from '../dto';

describe('VisaService', () => {
  let service: VisaService;
  let prisma: PrismaService;
  let eventEmitter: EventEmitter2;

  const mockPrismaService = {
    visa: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    visaExtension: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VisaService,
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

    service = module.get<VisaService>(VisaService);
    prisma = module.get<PrismaService>(PrismaService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createVisaDto: CreateVisaDto = {
      holderName: 'John Doe',
      holderCountry: 'United States',
      passportNumber: 'A12345678',
      visaNumber: 'VN2024001234',
      issueDate: '2024-01-15',
      expirationDate: '2024-12-31',
      purpose: 'Academic research collaboration',
      sponsorUnit: 'University of Technology Ho Chi Minh City',
      createdBy: 'user_123',
    };

    it('should create a visa successfully with visa.create action', async () => {
      const mockVisa = {
        id: 'visa_123',
        ...createVisaDto,
        issueDate: new Date('2024-01-15'),
        expirationDate: new Date('2024-12-31'),
        status: VisaStatus.ACTIVE,
        attachments: [],
        reminderSent: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        approvedById: null,
        approvedAt: null,
        createdBy: {
          id: 'user_123',
          fullName: 'Jane Smith',
          email: 'jane@example.com',
        },
        approvedBy: null,
        extensions: [],
      };

      const mockUser = {
        id: 'user_123',
        actions: ['visa.create'],
      };

      mockPrismaService.visa.findUnique.mockResolvedValue(null);
      mockPrismaService.visa.create.mockResolvedValue(mockVisa);

      const result = await service.create(createVisaDto, mockUser);

      expect(result).toEqual(mockVisa);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith('visa.created', {
        visaId: mockVisa.id,
        holderName: mockVisa.holderName,
        visaNumber: mockVisa.visaNumber,
        createdById: mockVisa.createdBy.id,
        expirationDate: mockVisa.expirationDate,
      });
    });

    it('should throw ForbiddenException for users without visa.create action', async () => {
      const mockUser = {
        id: 'student_123',
        actions: ['visa.view_own'], // No visa.create action
      };

      await expect(
        service.create(createVisaDto, mockUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ConflictException if visa number exists', async () => {
      const mockUser = {
        id: 'user_123',
        actions: ['visa.create'],
      };
      
      mockPrismaService.visa.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(
        service.create(createVisaDto, mockUser),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException for invalid dates', async () => {
      const invalidDto = {
        ...createVisaDto,
        issueDate: '2024-12-31',
        expirationDate: '2024-01-15', // Expiration before issue
      };

      const mockUser = {
        id: 'user_123',
        actions: ['visa.create'],
      };

      mockPrismaService.visa.findUnique.mockResolvedValue(null);

      await expect(
        service.create(invalidDto, mockUser),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // Note: checkExpiringVisas method is not available in current service implementation
  // This test would need to be updated based on the actual available methods

  describe('createExtension (UC005)', () => {
    const extendVisaDto: ExtendVisaDto = {
      visaId: 'visa_123',
      newExpirationDate: '2025-06-30',
      reason: 'Continuation of academic research project requiring additional 6 months',
    };

    it('should create visa extension with visa.extend action', async () => {
      const mockUser = {
        id: 'officer_123',
        actions: ['visa.extend', 'visa.view'],
      };

      const mockVisa = {
        id: 'visa_123',
        status: VisaStatus.ACTIVE,
        expirationDate: new Date('2024-12-31'),
        createdBy: { id: 'user_123', fullName: 'Jane Smith', email: 'jane@example.com' },
        approvedBy: null,
        extensions: [],
      };

      const mockExtension = {
        id: 'extension_123',
        visaId: 'visa_123',
        newExpirationDate: new Date('2025-06-30'),
        reason: extendVisaDto.reason,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the findOne method which is called internally
      jest.spyOn(service, 'findOne').mockResolvedValue(mockVisa as any);
      mockPrismaService.visaExtension.findFirst.mockResolvedValue(null); // No pending extension
      mockPrismaService.visaExtension.create.mockResolvedValue(mockExtension);

      const result = await service.createExtension('visa_123', extendVisaDto, mockUser);

      expect(result).toEqual(mockExtension);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith('visa.extension.created', expect.any(Object));
    });

    it('should throw ForbiddenException for users without visa.extend action', async () => {
      const mockUser = {
        id: 'staff_123',
        actions: ['visa.view_own'], // No visa.extend action
      };

      await expect(
        service.createExtension('visa_123', extendVisaDto, mockUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ConflictException if pending extension exists', async () => {
      const mockUser = {
        id: 'officer_123',
        actions: ['visa.extend', 'visa.view'],
      };

      const mockVisa = {
        id: 'visa_123',
        status: VisaStatus.ACTIVE,
        expirationDate: new Date('2024-12-31'),
        createdBy: { id: 'user_123', fullName: 'Jane Smith', email: 'jane@example.com' },
        approvedBy: null,
        extensions: [],
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockVisa as any);
      mockPrismaService.visaExtension.findFirst.mockResolvedValue({ id: 'pending_extension' }); // Pending extension exists

      await expect(
        service.createExtension('visa_123', extendVisaDto, mockUser),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('approveExtension', () => {
    const approveDto: ApproveVisaDto = {
      action: ApprovalAction.APPROVE,
      comments: 'All documentation verified. Approved for extension.',
      approvedBy: 'user_456',
    };

    it('should approve extension with visa.approve action', async () => {
      const mockUser = {
        id: 'leader_123',
        actions: ['visa.approve', 'visa.reject'],
      };

      const mockExtension = {
        id: 'extension_123',
        visaId: 'visa_123',
        status: 'PENDING',
        newExpirationDate: new Date('2025-06-30'),
        visa: {
          id: 'visa_123',
          holderName: 'John Doe',
          visaNumber: 'VN2024001234',
          createdBy: { id: 'user_123', fullName: 'Jane Smith', email: 'jane@example.com' },
          approvedBy: null,
          extensions: [],
        },
      };

      const mockUpdatedExtension = {
        ...mockExtension,
        status: 'APPROVED',
      };

      mockPrismaService.visaExtension.findUnique.mockResolvedValue(mockExtension);
      mockPrismaService.visaExtension.update.mockResolvedValue(mockUpdatedExtension);
      mockPrismaService.visa.update.mockResolvedValue({});

      const result = await service.approveExtension('extension_123', approveDto, mockUser);

      expect(result).toEqual(mockUpdatedExtension);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith('visa.extension.approved', expect.any(Object));
    });

    it('should throw ForbiddenException for users without visa.approve action', async () => {
      const mockUser = {
        id: 'officer_123',
        actions: ['visa.extend'], // No visa.approve action
      };

      await expect(
        service.approveExtension('extension_123', approveDto, mockUser),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // Note: getStatistics method is not available in current service implementation
  // This test would need to be updated based on the actual available methods
});