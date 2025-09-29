import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { VisaModule } from '../visa.module';
import { PrismaService } from '../../../database/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ActionGuard } from '../../../common/guards/action.guard';

describe('Visa Integration (UC004 & UC005)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  // Mock guards to bypass authentication for testing with RBAC actions
  const mockGuard = {
    canActivate: (context) => {
      const request = context.switchToHttp().getRequest();
      request.user = {
        id: 'test_user_123',
        email: 'test@example.com',
        actions: ['visa.create', 'visa.view'],
      };
      return true;
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [VisaModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockGuard)
      .overrideGuard(ActionGuard)
      .useValue(mockGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('UC004: Auto-reminder system', () => {
    it('should check for expiring visas and send reminders', async () => {
      const response = await request(app.getHttpServer())
        .get('/visas/expiring?days=30')
        .expect(200);

      expect(response.body).toHaveProperty('statusCode', 200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('count');
      expect(response.body.data).toHaveProperty('visas');
      expect(response.body.data).toHaveProperty('daysBeforeExpiration', 30);
    });
  });

  describe('UC005: Visa extension workflow', () => {
    let createdVisaId: string;
    let extensionId: string;

    it('should create a visa (prerequisite)', async () => {
      const createVisaDto = {
        holderName: 'Test User',
        holderCountry: 'United States',
        passportNumber: 'T12345678',
        visaNumber: 'VN2024TEST001',
        issueDate: '2024-01-15',
        expirationDate: '2024-12-31',
        purpose: 'Integration test visa',
        sponsorUnit: 'Test University',
      };

      const response = await request(app.getHttpServer())
        .post('/visas')
        .send(createVisaDto)
        .expect(201);

      expect(response.body).toHaveProperty('statusCode', 201);
      expect(response.body.data).toHaveProperty('id');
      createdVisaId = response.body.data.id;
    });

    it('should create visa extension request with extension actions', async () => {
      // Override guard for visa extension actions
      const extensionGuard = {
        canActivate: (context) => {
          const request = context.switchToHttp().getRequest();
          request.user = {
            id: 'officer_123',
            email: 'officer@example.com',
            actions: ['visa.extend', 'visa.view'],
          };
          return true;
        },
      };

      app.get(ActionGuard).canActivate = extensionGuard.canActivate;

      const extendVisaDto = {
        newExpirationDate: '2025-06-30',
        reason: 'Integration test extension for continued research',
      };

      const response = await request(app.getHttpServer())
        .post(`/visas/${createdVisaId}/extend`)
        .send(extendVisaDto)
        .expect(201);

      expect(response.body).toHaveProperty('statusCode', 201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('status', 'PENDING');
      extensionId = response.body.data.id;
    });

    it('should approve visa extension with approval actions', async () => {
      // Override guard for visa approval actions
      const approvalGuard = {
        canActivate: (context) => {
          const request = context.switchToHttp().getRequest();
          request.user = {
            id: 'leader_123',
            email: 'leader@example.com',
            actions: ['visa.approve', 'visa.reject', 'visa.sign'],
          };
          return true;
        },
      };

      app.get(ActionGuard).canActivate = approvalGuard.canActivate;

      const approveDto = {
        action: 'APPROVE',
        comments: 'Integration test approval - all requirements met',
      };

      const response = await request(app.getHttpServer())
        .post(`/visas/extensions/${extensionId}/approve`)
        .send(approveDto)
        .expect(200);

      expect(response.body).toHaveProperty('statusCode', 200);
      expect(response.body.data).toHaveProperty('status', 'APPROVED');
      expect(response.body.data.visa).toHaveProperty('status', 'EXTENDED');
    });

    it('should retrieve visa with extension history', async () => {
      const response = await request(app.getHttpServer())
        .get(`/visas/${createdVisaId}`)
        .expect(200);

      expect(response.body).toHaveProperty('statusCode', 200);
      expect(response.body.data).toHaveProperty('extensions');
      expect(response.body.data.extensions).toHaveLength(1);
      expect(response.body.data.extensions[0]).toHaveProperty('status', 'APPROVED');
    });
  });

  describe('Visa Statistics and Reporting', () => {
    it('should retrieve visa statistics with admin actions', async () => {
      // Override guard for admin statistics access
      const adminGuard = {
        canActivate: (context) => {
          const request = context.switchToHttp().getRequest();
          request.user = {
            id: 'admin_123',
            email: 'admin@example.com',
            actions: ['visa.view_statistics', 'visa.view_all', 'visa.manage'],
          };
          return true;
        },
      };

      app.get(ActionGuard).canActivate = adminGuard.canActivate;

      const response = await request(app.getHttpServer())
        .get('/visas/statistics')
        .expect(200);

      expect(response.body).toHaveProperty('statusCode', 200);
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data).toHaveProperty('byStatus');
      expect(response.body.data).toHaveProperty('expiringSoon');
      expect(response.body.data).toHaveProperty('recentExtensions');
    });

    it('should retrieve all visa extensions', async () => {
      const response = await request(app.getHttpServer())
        .get('/visas/extensions')
        .expect(200);

      expect(response.body).toHaveProperty('statusCode', 200);
      expect(response.body.data).toHaveProperty('count');
      expect(response.body.data).toHaveProperty('extensions');
      expect(Array.isArray(response.body.data.extensions)).toBe(true);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle invalid visa ID gracefully', async () => {
      const response = await request(app.getHttpServer())
        .get('/visas/invalid-uuid')
        .expect(400); // Bad Request for invalid UUID format

      expect(response.body).toHaveProperty('statusCode', 400);
    });

    it('should handle non-existent visa ID', async () => {
      const nonExistentId = '12345678-1234-1234-1234-123456789012';
      const response = await request(app.getHttpServer())
        .get(`/visas/${nonExistentId}`)
        .expect(404);

      expect(response.body).toHaveProperty('statusCode', 404);
    });

    it('should validate visa creation data', async () => {
      const invalidVisaDto = {
        holderName: '', // Invalid: empty name
        holderCountry: 'US',
        passportNumber: '123', // Invalid: too short
        visaNumber: 'VN', // Invalid: too short
        issueDate: 'invalid-date', // Invalid: bad date format
        expirationDate: '2024-12-31',
        purpose: 'Test', // Invalid: too short
        sponsorUnit: 'Test University',
      };

      const response = await request(app.getHttpServer())
        .post('/visas')
        .send(invalidVisaDto)
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
    });
  });
});