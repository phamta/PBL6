import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  Response,
  UploadedFiles,
  UseInterceptors,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { VisitorService } from '../services/visitor.service';
import { CreateVisitorDto } from '../dto/visitor/create-visitor.dto';
import { UpdateVisitorDto } from '../dto/visitor/update-visitor.dto';
import { VisitorReportDto } from '../dto/visitor/visitor-report.dto';
import { Response as ExpressResponse } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('visitor')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'passportScan', maxCount: 1 },
        { name: 'document', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/visitors',
          filename: (req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
        fileFilter: (req, file, cb) => {
          if (file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
            cb(null, true);
          } else {
            cb(new Error('Only image and PDF files are allowed!'), false);
          }
        },
        limits: {
          fileSize: 10 * 1024 * 1024, // 10MB
        },
      },
    ),
  )
  async create(
    @Body() createVisitorDto: CreateVisitorDto,
    @UploadedFiles()
    files: {
      passportScan?: any[];
      document?: any[];
    },
    @Request() req: any,
  ) {
    // Mock user data - replace with actual auth data
    const userId = req.user?.id || 'mock-user-id';
    const userUnit = req.user?.unit || 'IT Department';

    if (files.passportScan) {
      createVisitorDto.passportScanPath = files.passportScan[0].path;
    }

    if (files.document) {
      createVisitorDto.documentPath = files.document[0].path;
    }

    return this.visitorService.create(createVisitorDto, userId, userUnit);
  }

  @Get()
  async findAll(
    @Request() req: any,
    @Query('invitingUnit') invitingUnit?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    // Mock user data - replace with actual auth data
    const userId = req.user?.id || 'mock-user-id';
    const userUnit = req.user?.unit || 'IT Department';
    const userRole = req.user?.role || 'USER'; // 'KHCN_DN' for admin

    const query = {
      invitingUnit,
      startDate,
      endDate,
      search,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    };

    return this.visitorService.findAll(userId, userUnit, userRole, query);
  }

  @Get('report')
  async generateReport(
    @Query() reportDto: VisitorReportDto,
    @Response() res: ExpressResponse,
    @Request() req: any,
  ) {
    // Mock user data - replace with actual auth data
    const userId = req.user?.id || 'mock-user-id';
    const userUnit = req.user?.unit || 'IT Department';
    const userRole = req.user?.role || 'USER';

    return this.visitorService.generateReport(
      reportDto,
      userId,
      userUnit,
      userRole,
      res,
    );
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ) {
    // Mock user data - replace with actual auth data
    const userId = req.user?.id || 'mock-user-id';
    const userUnit = req.user?.unit || 'IT Department';
    const userRole = req.user?.role || 'USER';

    return this.visitorService.findOne(id, userId, userUnit, userRole);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'passportScan', maxCount: 1 },
        { name: 'document', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/visitors',
          filename: (req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
        fileFilter: (req, file, cb) => {
          if (file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
            cb(null, true);
          } else {
            cb(new Error('Only image and PDF files are allowed!'), false);
          }
        },
        limits: {
          fileSize: 10 * 1024 * 1024, // 10MB
        },
      },
    ),
  )
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVisitorDto: UpdateVisitorDto,
    @UploadedFiles()
    files: {
      passportScan?: any[];
      document?: any[];
    },
    @Request() req: any,
  ) {
    // Mock user data - replace with actual auth data
    const userId = req.user?.id || 'mock-user-id';
    const userUnit = req.user?.unit || 'IT Department';
    const userRole = req.user?.role || 'USER';

    if (files.passportScan) {
      updateVisitorDto.passportScanPath = files.passportScan[0].path;
    }

    if (files.document) {
      updateVisitorDto.documentPath = files.document[0].path;
    }

    return this.visitorService.update(id, updateVisitorDto, userId, userUnit, userRole);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ) {
    // Mock user data - replace with actual auth data
    const userId = req.user?.id || 'mock-user-id';
    const userUnit = req.user?.unit || 'IT Department';
    const userRole = req.user?.role || 'USER';

    await this.visitorService.remove(id, userId, userUnit, userRole);
    return { message: 'Visitor deleted successfully' };
  }
}
