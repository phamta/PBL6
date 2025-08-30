import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserService } from '../modules/user/user.service';
import { CreateUserDto } from '../modules/user/dto/create-user.dto';
import { ConflictException } from '@nestjs/common';
import { UserRole } from '../common/enums/user.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { Mou, MouStatus } from '../modules/mou/entities/mou.entity';
// import { VisaApplication, VisaStatus } from '../modules/visa/entities/visa-application.entity';
// import { Visitor, VisitorStatus } from '../modules/visitor/entities/visitor.entity';
// import { Translation, TranslationStatus, DocumentType } from '../modules/translation/entities/translation.entity';
import { User } from '../modules/user/entities/user.entity';
import { TranslationRequest } from '../entities/translation-request.entity';

@Injectable()
export class DatabaseSeederService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeederService.name);

  constructor(
    private readonly userService: UserService,
    // @InjectRepository(Mou)
    // private readonly mouRepository: Repository<Mou>,
    // @InjectRepository(VisaApplication)
    // private readonly visaRepository: Repository<VisaApplication>,
    // @InjectRepository(Visitor)
    // private readonly visitorRepository: Repository<Visitor>,
    // @InjectRepository(Translation)
    // private readonly translationRepository: Repository<Translation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TranslationRequest)
    private readonly translationRequestRepository: Repository<TranslationRequest>,
  ) {}

  async onModuleInit() {
    // SEEDER DISABLED - Uncomment below lines to enable automatic data seeding
    
    // // Delay để đảm bảo tất cả bảng đã được tạo
    // setTimeout(async () => {
    //   await this.seedDefaultAdmin();
    //   await this.seedSampleData();
    // }, 3000);
    
    this.logger.log('Database seeder is disabled. No automatic data seeding will occur.');
  }

  private async seedDefaultAdmin() {
    try {
      const adminEmail = 'admin@university.edu.vn';
      
      // Kiểm tra xem admin đã tồn tại chưa
      const existingAdmin = await this.userService.findByEmail(adminEmail);
      
      if (!existingAdmin) {
        const createAdminDto: CreateUserDto = {
          username: 'admin',
          email: adminEmail,
          fullName: 'Administrator',
          password: 'admin123',
          role: UserRole.ADMIN,
          department: 'IT Department'
        };

        await this.userService.create(createAdminDto);
        this.logger.log('Default admin user created successfully');
        this.logger.log(`Email: ${adminEmail}`);
        this.logger.log('Password: admin123');
      } else {
        this.logger.log('Default admin user already exists');
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        this.logger.log('Default admin user already exists');
      } else {
        this.logger.error('Failed to create default admin user', error.stack);
      }
    }
  }

  private async seedSampleData() {
    try {
      await this.seedUsers();
      await this.seedTranslationRequests();
      // await this.seedMOUs();
      // await this.seedVisaApplications();
      // await this.seedVisitors();
      // await this.seedTranslations();
      this.logger.log('Sample data seeded successfully');
    } catch (error) {
      this.logger.error('Failed to seed sample data', error.stack);
    }
  }

  private async seedUsers() {
    const existingUsers = await this.userRepository.count();
    if (existingUsers > 1) { // Chỉ có admin
      this.logger.log('Users already exist, skipping user seeding');
      return;
    }

    const sampleUsers = [
      {
        username: 'nguyenvana',
        email: 'nguyenvana@university.edu.vn',
        fullName: 'Nguyễn Văn A',
        password: 'password123',
        phone: '0901234567'
      },
      {
        username: 'tranthib',
        email: 'tranthib@university.edu.vn',
        fullName: 'Trần Thị B',
        password: 'password123',
        phone: '0901234568'
      },
      {
        username: 'levankien',
        email: 'levankien@university.edu.vn',
        fullName: 'Lê Văn Kiên',
        password: 'password123',
        phone: '0901234569'
      }
    ];

    for (const userData of sampleUsers) {
      await this.userService.create(userData);
    }
    this.logger.log('Sample users created');
  }

  private async seedTranslationRequests() {
    const existingRequests = await this.translationRequestRepository.count();
    if (existingRequests > 0) {
      this.logger.log('Translation requests already exist, skipping seeding');
      return;
    }

    // Get admin user for seeding
    const adminUser = await this.userRepository.findOne({ where: { email: 'admin@university.edu.vn' } });
    if (!adminUser) {
      this.logger.log('Admin user not found, skipping translation request seeding');
      return;
    }

    const { TranslationStatus, DocumentType, LanguagePair } = await import('../entities/translation-request.entity');

    const sampleRequests = [
      {
        requestCode: 'TR-2025-001',
        originalDocumentTitle: 'Bằng tốt nghiệp Đại học Kinh tế',
        documentType: DocumentType.DIPLOMA,
        languagePair: LanguagePair.VI_EN,
        purpose: 'Nộp hồ sơ du học tại Mỹ',
        submittingUnit: 'Khoa Kinh tế',
        status: TranslationStatus.PENDING,
        submittedById: adminUser.id,
        submittedBy: adminUser
      },
      {
        requestCode: 'TR-2025-002',
        originalDocumentTitle: 'Hợp đồng hợp tác nghiên cứu với MIT',
        documentType: DocumentType.CONTRACT,
        languagePair: LanguagePair.EN_VI,
        purpose: 'Hợp tác nghiên cứu quốc tế',
        submittingUnit: 'Phòng Hợp tác Quốc tế',
        status: TranslationStatus.APPROVED,
        submittedById: adminUser.id,
        submittedBy: adminUser,
        approvedAt: new Date()
      },
      {
        requestCode: 'TR-2025-003',
        originalDocumentTitle: 'Bài báo khoa học về AI',
        documentType: DocumentType.ACADEMIC_PAPER,
        languagePair: LanguagePair.EN_VI,
        purpose: 'Xuất bản tạp chí trong nước',
        submittingUnit: 'Khoa Công nghệ Thông tin',
        status: TranslationStatus.UNDER_REVIEW,
        submittedById: adminUser.id,
        submittedBy: adminUser
      }
    ];

    await this.translationRequestRepository.save(sampleRequests);
    this.logger.log('Sample translation requests created');
  }

  /*
  // Commented out unused seeding methods
  private async seedMOUs() {
    const existingMous = await this.mouRepository.count();
    if (existingMous > 0) {
      this.logger.log('MOUs already exist, skipping MOU seeding');
      return;
    }

    const sampleMous = [
      {
        title: 'Thỏa thuận hợp tác với Đại học Tokyo',
        partnerOrganization: 'University of Tokyo',
        partnerCountry: 'Japan',
        description: 'Hợp tác trong lĩnh vực nghiên cứu khoa học và trao đổi sinh viên',
        signedDate: new Date('2024-01-15'),
        expiryDate: new Date('2027-01-15'),
        status: MouStatus.SIGNED,
        terms: 'Trao đổi sinh viên, giảng viên và hợp tác nghiên cứu'
      },
      {
        title: 'MOU với Đại học Harvard',
        partnerOrganization: 'Harvard University',
        partnerCountry: 'United States',
        description: 'Chương trình trao đổi học thuật và nghiên cứu chung',
        signedDate: new Date('2023-09-20'),
        expiryDate: new Date('2026-09-20'),
        status: MouStatus.SIGNED,
        terms: 'Hợp tác nghiên cứu, trao đổi giảng viên và sinh viên'
      },
      {
        title: 'Thỏa thuận với Đại học Quốc gia Singapore',
        partnerOrganization: 'National University of Singapore',
        partnerCountry: 'Singapore',
        description: 'Hợp tác đào tạo và nghiên cứu trong lĩnh vực công nghệ',
        signedDate: new Date('2024-03-10'),
        expiryDate: new Date('2029-03-10'),
        status: MouStatus.SIGNED,
        terms: 'Chương trình học bổng, trao đổi sinh viên và hợp tác nghiên cứu'
      }
    ];

    await this.mouRepository.save(sampleMous);
    this.logger.log('Sample MOUs created');
  }

  private async seedVisaApplications() {
    const existingApplications = await this.visaRepository.count();
    if (existingApplications > 0) {
      this.logger.log('Visa applications already exist, skipping seeding');
      return;
    }

    // Lấy user admin để làm userId
    const adminUser = await this.userRepository.findOne({ where: { email: 'admin@university.edu.vn' } });
    if (!adminUser) return;

    const sampleApplications = [
      {
        applicantName: 'John Smith',
        nationality: 'American',
        passportNumber: 'US12345678',
        currentVisaExpiry: new Date('2025-12-31'),
        requestedExtensionDate: new Date('2026-12-31'),
        purpose: 'Nghiên cứu khoa học tại trường',
        status: VisaStatus.PENDING,
        notes: 'Giáo sư khách mời từ Harvard University',
        user: adminUser
      },
      {
        applicantName: 'Tanaka Hiroshi',
        nationality: 'Japanese',
        passportNumber: 'JP87654321',
        currentVisaExpiry: new Date('2025-10-15'),
        requestedExtensionDate: new Date('2026-10-15'),
        purpose: 'Trao đổi học thuật',
        status: VisaStatus.APPROVED,
        notes: 'Sinh viên trao đổi từ University of Tokyo',
        user: adminUser
      },
      {
        applicantName: 'Emma Wilson',
        nationality: 'British',
        passportNumber: 'GB11223344',
        currentVisaExpiry: new Date('2025-11-30'),
        requestedExtensionDate: new Date('2026-11-30'),
        purpose: 'Thực tập nghiên cứu',
        status: VisaStatus.PROCESSING,
        notes: 'Nghiên cứu sinh từ Oxford University',
        user: adminUser
      }
    ];

    await this.visaRepository.save(sampleApplications);
    this.logger.log('Sample visa applications created');
  }

  private async seedVisitors() {
    const existingVisitors = await this.visitorRepository.count();
    if (existingVisitors > 0) {
      this.logger.log('Visitors already exist, skipping seeding');
      return;
    }

    const sampleVisitors = [
      {
        groupName: 'Đoàn đại biểu Đại học Seoul',
        organizationName: 'Seoul National University',
        country: 'South Korea',
        numberOfMembers: 5,
        contactPerson: 'Park Min Jae',
        contactEmail: 'park.minjae@snu.ac.kr',
        contactPhone: '+82-2-880-5114',
        arrivalDate: new Date('2025-09-15'),
        departureDate: new Date('2025-09-20'),
        purpose: 'Khảo sát hợp tác giáo dục và trao đổi sinh viên',
        status: VisitorStatus.SCHEDULED,
        itinerary: 'Thăm các khoa, gặp gỡ lãnh đạo trường, thảo luận hợp tác',
        notes: 'Cần chuẩn bị phiên dịch tiếng Hàn',
        membersList: [
          'Park Min Jae - Vice Rector',
          'Kim So Young - Dean of Engineering', 
          'Lee Joon Ho - International Relations Officer'
        ]
      },
      {
        groupName: 'Đoàn công tác MIT',
        organizationName: 'Massachusetts Institute of Technology',
        country: 'United States',
        numberOfMembers: 3,
        contactPerson: 'Dr. Sarah Johnson',
        contactEmail: 'sarah.johnson@mit.edu',
        contactPhone: '+1-617-253-1000',
        arrivalDate: new Date('2025-10-05'),
        departureDate: new Date('2025-10-10'),
        purpose: 'Hội thảo nghiên cứu AI và Machine Learning',
        status: VisitorStatus.SCHEDULED,
        itinerary: 'Thuyết trình, workshop, gặp gỡ nghiên cứu sinh',
        notes: 'Cần thiết bị hỗ trợ kỹ thuật cho presentation',
        membersList: [
          'Dr. Sarah Johnson - Professor of AI',
          'Dr. Michael Chen - Research Scientist',
          'Alex Rodriguez - PhD Student'
        ]
      }
    ];

    await this.visitorRepository.save(sampleVisitors);
    this.logger.log('Sample visitors created');
  }

  private async seedTranslations() {
    const existingTranslations = await this.translationRepository.count();
    if (existingTranslations > 0) {
      this.logger.log('Translations already exist, skipping seeding');
      return;
    }

    const sampleTranslations = [
      {
        documentTitle: 'Bằng tốt nghiệp Đại học Kinh tế',
        documentType: DocumentType.CERTIFICATE,
        originalLanguage: 'Vietnamese',
        targetLanguage: 'English',
        translatedBy: 'Trần Thị Minh',
        translationDate: new Date('2024-08-15'),
        status: TranslationStatus.VERIFIED,
        notes: 'Dịch thuật công chứng cho du học',
        verifiedBy: 'Nguyễn Văn Dũng',
        verificationDate: new Date('2024-08-16')
      },
      {
        documentTitle: 'Hợp đồng hợp tác nghiên cứu',
        documentType: DocumentType.CONTRACT,
        originalLanguage: 'English',
        targetLanguage: 'Vietnamese',
        translatedBy: 'Lê Hoàng Nam',
        translationDate: new Date('2024-08-20'),
        status: TranslationStatus.PENDING,
        notes: 'Hợp đồng với đại học đối tác tại Nhật Bản'
      },
      {
        documentTitle: 'Bảng điểm sinh viên trao đổi',
        documentType: DocumentType.TRANSCRIPT,
        originalLanguage: 'Japanese',
        targetLanguage: 'Vietnamese',
        translatedBy: 'Phạm Thị Lan',
        translationDate: new Date('2024-08-22'),
        status: TranslationStatus.VERIFIED,
        notes: 'Bảng điểm của sinh viên từ University of Tokyo',
        verifiedBy: 'Đỗ Văn Hùng',
        verificationDate: new Date('2024-08-23')
      }
    ];

    await this.translationRepository.save(sampleTranslations);
    this.logger.log('Sample translations created');
  }
  */
}
