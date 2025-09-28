import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { MouMigrationService } from './mou-migration.service';
import { MigrationOptionsDto } from './dto/migration.dto';

describe('MouMigrationService', () => {
  let service: MouMigrationService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    query: jest.fn(),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn(() => mockQueryRunner),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MouMigrationService,
        {
          provide: getDataSourceToken(),
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<MouMigrationService>(MouMigrationService);
    dataSource = module.get<DataSource>(getDataSourceToken());
    queryRunner = mockQueryRunner as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fixMouEnumIssue', () => {
    it('should successfully fix enum issues in dry run mode', async () => {
      const options: MigrationOptionsDto = { dryRun: true };
      
      mockQueryRunner.query
        .mockResolvedValueOnce([{ count: '5' }]) // activeToSigned count
        .mockResolvedValueOnce([{ count: '2' }]); // invalidStatuses count

      const result = await service.fixMouEnumIssue(options);

      expect(result.success).toBe(true);
      expect(result.affectedRows).toBe(7); // 5 + 2
      expect(result.message).toContain('preview');
      expect(mockQueryRunner.startTransaction).not.toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
    });

    it('should successfully fix enum issues in normal mode', async () => {
      const options: MigrationOptionsDto = { dryRun: false };
      
      mockQueryRunner.query
        .mockResolvedValueOnce({ affectedRows: 3 }) // activeToSigned
        .mockResolvedValueOnce({ affectedRows: 1 }); // invalidStatuses

      const result = await service.fixMouEnumIssue(options);

      expect(result.success).toBe(true);
      expect(result.affectedRows).toBe(4); // 3 + 1
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should handle errors and rollback transaction', async () => {
      const options: MigrationOptionsDto = { dryRun: false };
      const error = new Error('Database error');
      
      mockQueryRunner.query.mockRejectedValueOnce(error);

      const result = await service.fixMouEnumIssue(options);

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Database error');
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('dropAndRecreateMouTable', () => {
    it('should successfully drop and recreate MOU table', async () => {
      await service.dropAndRecreateMouTable();

      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.query).toHaveBeenCalledWith('DROP TABLE IF EXISTS mous CASCADE');
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should handle errors and rollback', async () => {
      const error = new Error('Drop table error');
      mockQueryRunner.query.mockRejectedValueOnce(error);

      await expect(service.dropAndRecreateMouTable()).rejects.toThrow('Drop table error');
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });
});
