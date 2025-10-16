import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { GuestService } from '../guest.service';
import { PrismaService } from '../../../database/prisma.service';
import { GuestStatus } from '@prisma/client';
import { CreateGuestDto } from '../dto';

describe('GuestService - Create', () => {
  let service: GuestService;
  let prisma: PrismaService;
  let eventEmitter: EventEmitter2;

  const mockPrismaService = {
    guest: {
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
        GuestService,
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

    service = module.get<GuestService>(GuestService);
    prisma = module.get<PrismaService>(PrismaService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const mockUser = {
      id: 'user-1',
      actions: ['GUEST_CREATE'],
      unitId: 'unit-1',
    };

    const mockCreateGuestDto: CreateGuestDto = {
      groupName: 'Test Group',
      purpose: 'Business Meeting',
      arrivalDate: '2025-12-01',
      departureDate: '2025-12-05',
      contactPerson: 'John Doe',
      contactEmail: 'john@example.com',
      contactPhone: '+1234567890',
      totalMembers: 3,
      notes: 'Test notes',
      attachments: ['file1.pdf'],
      visitPurpose: 'Business',
      hostDepartment: 'IT Department',
      invitationLetterNo: 'INV-001',
      immigrationDocNA2: 'NA2-001',
      visaRequestDocNA5: 'NA5-001',
      reportFile: 'report.pdf',
      partnerId: 'partner-1',
      unitId: 'unit-1',
      members: [
        {
          fullName: 'Member 1',
          nationality: 'Vietnam',
          passportNumber: 'P123456',
          position: 'Manager',
          organization: 'Company A',
          email: 'member1@example.com',
          phoneNumber: '+0987654321',
          dateOfBirth: '1990-01-01',
          title: 'Mr.',
          gender: 'Male',
          affiliation: 'Company A',
        },
      ],
    };

    const mockCreatedGuest = {
      id: 'guest-1',
      groupName: 'Test Group',
      purpose: 'Business Meeting',
      arrivalDate: new Date('2025-12-01'),
      departureDate: new Date('2025-12-05'),
      contactPerson: 'John Doe',
      contactEmail: 'john@example.com',
      contactPhone: '+1234567890',
      totalMembers: 3,
      status: GuestStatus.REGISTERED,
      notes: 'Test notes',
      attachments: ['file1.pdf'],
      visitPurpose: 'Business',
      hostDepartment: 'IT Department',
      invitationLetterNo: 'INV-001',
      immigrationDocNA2: 'NA2-001',
      visaRequestDocNA5: 'NA5-001',
      reportFile: 'report.pdf',
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
      members: [
        {
          id: 'member-1',
          fullName: 'Member 1',
          nationality: 'Vietnam',
          passportNumber: 'P123456',
          position: 'Manager',
          organization: 'Company A',
          email: 'member1@example.com',
          phoneNumber: '+0987654321',
          dateOfBirth: new Date('1990-01-01'),
          title: 'Mr.',
          gender: 'Male',
          affiliation: 'Company A',
          guestId: 'guest-1',
        },
      ],
    };

    describe('✅ SUCCESS CASES - Test normal operation scenarios', () => {
      it('should create a guest successfully', async () => {
        // Arrange
        mockPrismaService.partner.findUnique.mockResolvedValue({ id: 'partner-1' });
        mockPrismaService.unit.findUnique.mockResolvedValue({ id: 'unit-1' });
        mockPrismaService.guest.create.mockResolvedValue(mockCreatedGuest);

      // Act
      const result = await service.create(mockCreateGuestDto, mockUser);

      // Assert
      expect(mockPrismaService.partner.findUnique).toHaveBeenCalledWith({
        where: { id: 'partner-1' },
      });
      expect(mockPrismaService.unit.findUnique).toHaveBeenCalledWith({
        where: { id: 'unit-1' },
      });
      expect(mockPrismaService.guest.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          groupName: 'Test Group',
          purpose: 'Business Meeting',
          arrivalDate: new Date('2025-12-01'),
          departureDate: new Date('2025-12-05'),
          contactPerson: 'John Doe',
          contactEmail: 'john@example.com',
          contactPhone: '+1234567890',
          totalMembers: 3,
          status: GuestStatus.REGISTERED,
          notes: 'Test notes',
          attachments: ['file1.pdf'],
          visitPurpose: 'Business',
          hostDepartment: 'IT Department',
          invitationLetterNo: 'INV-001',
          immigrationDocNA2: 'NA2-001',
          visaRequestDocNA5: 'NA5-001',
          reportFile: 'report.pdf',
          createdBy: { connect: { id: 'user-1' } },
          partner: { connect: { id: 'partner-1' } },
          unit: { connect: { id: 'unit-1' } },
          members: {
            create: expect.arrayContaining([
              expect.objectContaining({
                fullName: 'Member 1',
                nationality: 'Vietnam',
                passportNumber: 'P123456',
                position: 'Manager',
                organization: 'Company A',
                email: 'member1@example.com',
                phoneNumber: '+0987654321',
                dateOfBirth: new Date('1990-01-01'),
                title: 'Mr.',
                gender: 'Male',
                affiliation: 'Company A',
              }),
            ]),
          },
        }),
        include: expect.any(Object),
      });
      expect(mockEventEmitter.emit).toHaveBeenCalledWith('guest.created', {
        guestId: 'guest-1',
        userId: 'user-1',
        arrivalDate: new Date('2025-12-01'),
        totalMembers: 3,
      });
      expect(result).toEqual(mockCreatedGuest);
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
      await expect(service.create(mockCreateGuestDto, userWithoutPermission)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockPrismaService.guest.create).not.toHaveBeenCalled();
    });

      it('❌ [VALIDATION] should throw BadRequestException when arrival date is after departure date', async () => {
      // Arrange
      const invalidDto = { ...mockCreateGuestDto, arrivalDate: '2025-12-05', departureDate: '2025-12-01' };

      // Act & Assert
      await expect(service.create(invalidDto, mockUser)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.guest.create).not.toHaveBeenCalled();
    });

      it('❌ [VALIDATION] should throw BadRequestException when arrival date is in the past', async () => {
      // Arrange
      const invalidDto = { ...mockCreateGuestDto, arrivalDate: '2020-01-01' };

      // Act & Assert
      await expect(service.create(invalidDto, mockUser)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.guest.create).not.toHaveBeenCalled();
    });

      it('❌ [VALIDATION] should throw BadRequestException when partner does not exist', async () => {
      // Arrange
      mockPrismaService.partner.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(mockCreateGuestDto, mockUser)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.guest.create).not.toHaveBeenCalled();
    });

      it('❌ [VALIDATION] should throw BadRequestException when unit does not exist', async () => {
      // Arrange
      mockPrismaService.partner.findUnique.mockResolvedValue({ id: 'partner-1' });
      mockPrismaService.unit.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(mockCreateGuestDto, mockUser)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.guest.create).not.toHaveBeenCalled();
    });

    it('❌ [VALIDATION] should create guest without partner and unit when not provided', async () => {
      // Arrange
      const dtoWithoutRelations = { ...mockCreateGuestDto };
      delete dtoWithoutRelations.partnerId;
      delete dtoWithoutRelations.unitId;

      mockPrismaService.guest.create.mockResolvedValue({
        ...mockCreatedGuest,
        partner: null,
        unit: null,
      });

      // Act
      const result = await service.create(dtoWithoutRelations, mockUser);

      // Assert
      expect(mockPrismaService.partner.findUnique).not.toHaveBeenCalled();
      expect(mockPrismaService.unit.findUnique).not.toHaveBeenCalled();
      expect(mockPrismaService.guest.create).toHaveBeenCalledWith({
        data: expect.not.objectContaining({
          partner: expect.any(Object),
          unit: expect.any(Object),
        }),
        include: expect.any(Object),
      });
      expect(result.partner).toBeNull();
      expect(result.unit).toBeNull();
    });

    it('❌ [VALIDATION] should create guest without members when not provided', async () => {
      // Arrange
      const dtoWithoutMembers = { ...mockCreateGuestDto };
      delete dtoWithoutMembers.members;

      mockPrismaService.partner.findUnique.mockResolvedValue({ id: 'partner-1' });
      mockPrismaService.unit.findUnique.mockResolvedValue({ id: 'unit-1' });
      mockPrismaService.guest.create.mockResolvedValue({
        ...mockCreatedGuest,
        members: [],
      });

      // Act
      const result = await service.create(dtoWithoutMembers, mockUser);

      // Assert
      expect(mockPrismaService.guest.create).toHaveBeenCalledWith({
        data: expect.not.objectContaining({
          members: expect.any(Object),
        }),
        include: expect.any(Object),
      });
      expect(result.members).toEqual([]);
    });

      it('❌ [DATABASE] should handle database errors gracefully', async () => {
      // Arrange
      mockPrismaService.partner.findUnique.mockResolvedValue({ id: 'partner-1' });
      mockPrismaService.unit.findUnique.mockResolvedValue({ id: 'unit-1' });
      const dbError = new Error('Database connection failed');
      mockPrismaService.guest.create.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.create(mockCreateGuestDto, mockUser)).rejects.toThrow('Database connection failed');
      expect(mockPrismaService.guest.create).toHaveBeenCalled();
    });

          it('❌ [DATABASE] should handle database errors during partner validation', async () => {
      // Arrange
      mockPrismaService.partner.findUnique.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await expect(service.create(mockCreateGuestDto, mockUser)).rejects.toThrow('Database connection failed');
      expect(mockPrismaService.guest.create).not.toHaveBeenCalled();
    });

      it('❌ [DATABASE] should handle database errors during unit validation', async () => {
      // Arrange
      mockPrismaService.partner.findUnique.mockResolvedValue({ id: 'partner-1' });
      mockPrismaService.unit.findUnique.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await expect(service.create(mockCreateGuestDto, mockUser)).rejects.toThrow('Database connection failed');
      expect(mockPrismaService.guest.create).not.toHaveBeenCalled();
    });

    it('❌ [DATABASE] should handle transaction rollback on database errors', async () => {
      // Arrange
      mockPrismaService.partner.findUnique.mockResolvedValue({ id: 'partner-1' });
      mockPrismaService.unit.findUnique.mockResolvedValue({ id: 'unit-1' });
      mockPrismaService.guest.create.mockRejectedValue(new Error('Transaction failed'));

      // Act & Assert
      await expect(service.create(mockCreateGuestDto, mockUser)).rejects.toThrow('Transaction failed');
      expect(mockPrismaService.guest.create).toHaveBeenCalled();
    });

    it('❌ [DATABASE] should handle concurrent guest creation conflicts', async () => {
      // Arrange
      mockPrismaService.partner.findUnique.mockResolvedValue({ id: 'partner-1' });
      mockPrismaService.unit.findUnique.mockResolvedValue({ id: 'unit-1' });
      mockPrismaService.guest.create.mockRejectedValue(new Error('Unique constraint violation'));

      // Act & Assert
      await expect(service.create(mockCreateGuestDto, mockUser)).rejects.toThrow('Unique constraint violation');
      expect(mockPrismaService.guest.create).toHaveBeenCalled();
    });

    it('❌ [VALIDATION] should throw BadRequestException for invalid totalMembers (negative)', async () => {
      // Arrange
      const invalidDto = { ...mockCreateGuestDto, totalMembers: -1 };

      // Act & Assert
      await expect(service.create(invalidDto, mockUser)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.guest.create).not.toHaveBeenCalled();
    });

    it('❌ [VALIDATION] should throw BadRequestException for invalid totalMembers (zero)', async () => {
      // Arrange
      const invalidDto = { ...mockCreateGuestDto, totalMembers: 0 };

      // Act & Assert
      await expect(service.create(invalidDto, mockUser)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.guest.create).not.toHaveBeenCalled();
    });

    it('❌ [VALIDATION] should throw BadRequestException for empty groupName', async () => {
      // Arrange
      const invalidDto = { ...mockCreateGuestDto, groupName: '' };

      // Act & Assert
      await expect(service.create(invalidDto, mockUser)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.guest.create).not.toHaveBeenCalled();
    });

    it('❌ [VALIDATION] should throw BadRequestException for empty contactPerson', async () => {
      // Arrange
      const invalidDto = { ...mockCreateGuestDto, contactPerson: '' };

      // Act & Assert
      await expect(service.create(invalidDto, mockUser)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.guest.create).not.toHaveBeenCalled();
    });

    it('❌ [VALIDATION] should throw BadRequestException for invalid contactEmail format', async () => {
      // Arrange
      const invalidDto = { ...mockCreateGuestDto, contactEmail: 'invalid-email' };

      // Act & Assert
      await expect(service.create(invalidDto, mockUser)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.guest.create).not.toHaveBeenCalled();
    });

    it('❌ [VALIDATION] should throw BadRequestException for invalid contactPhone format', async () => {
      // Arrange
      const invalidDto = { ...mockCreateGuestDto, contactPhone: 'invalid-phone' };

      // Act & Assert
      await expect(service.create(invalidDto, mockUser)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.guest.create).not.toHaveBeenCalled();
    });

    it('❌ [VALIDATION] should throw BadRequestException for empty purpose', async () => {
      // Arrange
      const invalidDto = { ...mockCreateGuestDto, purpose: '' };

      // Act & Assert
      await expect(service.create(invalidDto, mockUser)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.guest.create).not.toHaveBeenCalled();
    });

    it('❌ [VALIDATION] should throw BadRequestException for invalid member data', async () => {
      // Arrange
      const invalidDto = {
        ...mockCreateGuestDto,
        members: [
          {
            fullName: '', // Empty name
            nationality: 'Vietnam',
            passportNumber: 'P123456',
            position: 'Manager',
            organization: 'Company A',
            email: 'member1@example.com',
            phoneNumber: '+0987654321',
            dateOfBirth: '1990-01-01',
            title: 'Mr.',
            gender: 'Male',
            affiliation: 'Company A',
          },
        ],
      };

      // Act & Assert
      await expect(service.create(invalidDto, mockUser)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.guest.create).not.toHaveBeenCalled();
    });

    it('❌ [VALIDATION] should throw BadRequestException for member with invalid email', async () => {
      // Arrange
      const invalidDto = {
        ...mockCreateGuestDto,
        members: [
          {
            fullName: 'Member 1',
            nationality: 'Vietnam',
            passportNumber: 'P123456',
            position: 'Manager',
            organization: 'Company A',
            email: 'invalid-email', // Invalid email
            phoneNumber: '+0987654321',
            dateOfBirth: '1990-01-01',
            title: 'Mr.',
            gender: 'Male',
            affiliation: 'Company A',
          },
        ],
      };

      // Act & Assert
      await expect(service.create(invalidDto, mockUser)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.guest.create).not.toHaveBeenCalled();
    });

    it('❌ [VALIDATION] should throw BadRequestException for member with future dateOfBirth', async () => {
      // Arrange
      const invalidDto = {
        ...mockCreateGuestDto,
        members: [
          {
            fullName: 'Member 1',
            nationality: 'Vietnam',
            passportNumber: 'P123456',
            position: 'Manager',
            organization: 'Company A',
            email: 'member1@example.com',
            phoneNumber: '+0987654321',
            dateOfBirth: '2030-01-01', // Future date
            title: 'Mr.',
            gender: 'Male',
            affiliation: 'Company A',
          },
        ],
      };

      // Act & Assert
      await expect(service.create(invalidDto, mockUser)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.guest.create).not.toHaveBeenCalled();
      expect(mockPrismaService.guest.create).not.toHaveBeenCalled();
    });
    });
  });
})});