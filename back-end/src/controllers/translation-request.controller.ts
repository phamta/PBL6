import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { TranslationRequestService } from '../services/translation-request.service';
import { CreateTranslationRequestDto } from '../dto/translation-request/create-translation-request.dto';
import { UpdateTranslationRequestDto } from '../dto/translation-request/update-translation-request.dto';
import { ReviewTranslationRequestDto } from '../dto/translation-request/review-translation-request.dto';
import { TranslationReportDto } from '../dto/translation-request/translation-report.dto';
import { Request, Response } from 'express';
import { TranslationStatus } from '../entities/translation-request.entity';

// Multer configuration for file uploads
// const storage = diskStorage({
//   destination: (req, file, cb) => {
//     let uploadPath = './uploads/';
//     
//     if (file.fieldname === 'originalDocument') {
//       uploadPath += 'original-documents/';
//     } else if (file.fieldname === 'translatedDocument') {
//       uploadPath += 'translated-documents/';
//     } else if (file.fieldname === 'additionalDocuments') {
//       uploadPath += 'additional-documents/';
//     }
//     
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = uuidv4();
//     const ext = extname(file.originalname);
//     cb(null, `${uniqueSuffix}${ext}`);
//   },
// });

// const fileFilter = (req: any, file: any, cb: any) => {
//   const allowedTypes = [
//     'application/pdf',
//     'application/msword',
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     'application/vnd.ms-excel',
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     'application/vnd.ms-powerpoint',
//     'application/vnd.openxmlformats-officedocument.presentationml.presentation',
//     'image/jpeg',
//     'image/png',
//     'text/plain',
//   ];

//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new BadRequestException('Invalid file type'), false);
//   }
// };

@Controller('translation-requests')
// @UseGuards(JwtAuthGuard, RolesGuard) // Temporarily disabled
export class TranslationRequestController {
  constructor(
    private readonly translationRequestService: TranslationRequestService,
  ) {}

  @Post()
  async create(
    @Body() createTranslationRequestDto: CreateTranslationRequestDto,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.translationRequestService.create(
      createTranslationRequestDto,
      user?.id || 'temp-user-id',
    );
  }

  @Get()
  async findAll(
    @Query('submittingUnit') submittingUnit?: string,
    @Query('status') status?: TranslationStatus,
    @Query('documentType') documentType?: string,
    @Query('languagePair') languagePair?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: Request,
  ) {
    const user = req?.user as any;

    return this.translationRequestService.findAll(
      user?.id || 'temp-user-id',
      user?.unit || 'temp-unit',
      user?.role || 'USER',
      {
        submittingUnit,
        status,
        documentType,
        languagePair,
        startDate,
        endDate,
        search,
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
      },
    );
  }

  @Get('statistics')
  async getStatistics(@Req() req: Request) {
    const user = req.user as any;
    
    // Get basic statistics for dashboard
    const allRequests = await this.translationRequestService.findAll(
      user?.id || 'temp-user-id',
      user?.unit || 'temp-unit',
      user?.role || 'USER',
    );

    const stats = {
      total: allRequests.total,
      pending: 0,
      underReview: 0,
      approved: 0,
      rejected: 0,
      needsRevision: 0,
    };

    return stats;
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    return this.translationRequestService.findOne(
      id,
      user?.id || 'temp-user-id',
      user?.unit || 'temp-unit',
      user?.role || 'USER',
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTranslationRequestDto: UpdateTranslationRequestDto,
    @Req() req: Request,
  ) {
    const user = req.user as any;

    return this.translationRequestService.update(
      id,
      updateTranslationRequestDto,
      user?.id || 'temp-user-id',
      user?.unit || 'temp-unit',
      user?.role || 'USER',
    );
  }

  // Admin actions for KHCN_DN role
  @Post(':id/start-review')
  async startReview(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    return this.translationRequestService.startReview(
      id, 
      user?.id || 'temp-user-id', 
      user?.role || 'KHCN_DN'
    );
  }

  @Post(':id/approve')
  async approve(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    return this.translationRequestService.approve(
      id, 
      user?.id || 'temp-user-id', 
      user?.role || 'KHCN_DN'
    );
  }

  @Post(':id/reject')
  async reject(
    @Param('id') id: string,
    @Body() reviewDto: ReviewTranslationRequestDto,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.translationRequestService.reject(
      id, 
      reviewDto, 
      user?.id || 'temp-user-id', 
      user?.role || 'KHCN_DN'
    );
  }

  @Post(':id/request-revision')
  async requestRevision(
    @Param('id') id: string,
    @Body() reviewDto: ReviewTranslationRequestDto,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.translationRequestService.requestRevision(
      id, 
      reviewDto, 
      user?.id || 'temp-user-id', 
      user?.role || 'KHCN_DN'
    );
  }

  // Report generation
  @Post('reports/generate')
  async generateReport(
    @Body() reportDto: TranslationReportDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.user as any;
    return this.translationRequestService.generateReport(
      reportDto,
      user?.role || 'USER',
      user?.unit || 'temp-unit',
      res,
    );
  }

  // Simplified file download endpoints
  @Get(':id/download/original')
  async downloadOriginalDocument(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.user as any;
    const request = await this.translationRequestService.findOne(
      id,
      user?.id || 'temp-user-id',
      user?.unit || 'temp-unit',
      user?.role || 'USER',
    );

    if (!request.originalFilePath) {
      throw new BadRequestException('No original document found');
    }

    return res.download(request.originalFilePath);
  }

  @Get(':id/download/translated')
  async downloadTranslatedDocument(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.user as any;
    const request = await this.translationRequestService.findOne(
      id,
      user?.id || 'temp-user-id',
      user?.unit || 'temp-unit',
      user?.role || 'USER',
    );

    if (!request.translatedFilePath) {
      throw new BadRequestException('No translated document found');
    }

    return res.download(request.translatedFilePath);
  }

  @Get(':id/download/confirmation')
  async downloadConfirmationDocument(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.user as any;
    const request = await this.translationRequestService.findOne(
      id,
      user?.id || 'temp-user-id',
      user?.unit || 'temp-unit',
      user?.role || 'USER',
    );

    if (!request.confirmationDocumentPath) {
      throw new BadRequestException('No confirmation document found');
    }

    return res.download(request.confirmationDocumentPath);
  }
}
