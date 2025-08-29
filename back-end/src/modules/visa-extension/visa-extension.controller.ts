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
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user.enum';
import { VisaExtensionService } from './visa-extension.service';
import { VisaExtensionDocumentService } from './visa-extension-document.service';
import { CreateVisaExtensionDto } from './dto/create-visa-extension.dto';
import { UpdateVisaExtensionDto } from './dto/update-visa-extension.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { VisaExtensionFilterDto } from './dto/visa-extension-filter.dto';

@Controller('visa-extension')
@UseGuards(JwtAuthGuard)
export class VisaExtensionController {
  constructor(
    private readonly visaExtensionService: VisaExtensionService,
    private readonly documentService: VisaExtensionDocumentService,
  ) {}

  @Post()
  async create(
    @Body() createVisaExtensionDto: CreateVisaExtensionDto,
    @Request() req,
  ) {
    return await this.visaExtensionService.create(createVisaExtensionDto, req.user);
  }

  @Get()
  async findAll(@Query() filterDto: VisaExtensionFilterDto, @Request() req) {
    return await this.visaExtensionService.findAll(filterDto, req.user);
  }

  @Get('statistics')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PHONG)
  async getStatistics(@Request() req) {
    return await this.visaExtensionService.getStatistics(req.user);
  }

  @Get('expiring-soon')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PHONG)
  async getExpiringSoon(@Query('days') days?: string) {
    const daysNumber = days ? parseInt(days, 10) : 30;
    return await this.visaExtensionService.getExpiringSoon(daysNumber);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return await this.visaExtensionService.findOne(id, req.user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVisaExtensionDto: UpdateVisaExtensionDto,
    @Request() req,
  ) {
    return await this.visaExtensionService.update(id, updateVisaExtensionDto, req.user);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PHONG)
  async changeStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeStatusDto,
    @Request() req,
  ) {
    return await this.visaExtensionService.changeStatus(id, changeStatusDto, req.user);
  }

  @Post(':id/submit')
  async submit(@Param('id') id: string, @Request() req) {
    return await this.visaExtensionService.submit(id, req.user);
  }

  @Post(':id/documents')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/visa-extensions',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Allow images and PDFs only
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|pdf)$/)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Only image and PDF files are allowed'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
      },
    }),
  )
  async uploadDocuments(
    @Param('id') id: string,
    @UploadedFiles() files: any[],
    @Body() documentData: any,
    @Request() req,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const documents = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const documentType = Array.isArray(documentData.documentTypes) 
        ? documentData.documentTypes[i] 
        : documentData.documentType;
      
      if (!documentType) {
        throw new BadRequestException(`Document type is required for file: ${file.originalname}`);
      }

      const document = await this.documentService.create({
        visaExtensionId: id,
        fileName: file.filename,
        originalName: file.originalname,
        filePath: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        documentType,
        isRequired: documentData.isRequired || true,
      }, req.user);

      documents.push(document);
    }

    return { documents };
  }

  @Get(':id/documents')
  async getDocuments(@Param('id') id: string, @Request() req) {
    return await this.documentService.findByVisaExtension(id, req.user);
  }

  @Delete(':id/documents/:documentId')
  async deleteDocument(
    @Param('id') id: string,
    @Param('documentId') documentId: string,
    @Request() req,
  ) {
    return await this.documentService.delete(documentId, req.user);
  }

  @Patch(':id/documents/:documentId/verify')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PHONG)
  async verifyDocument(
    @Param('id') id: string,
    @Param('documentId') documentId: string,
    @Body() verifyData: { isVerified: boolean; verificationNotes?: string },
    @Request() req,
  ) {
    return await this.documentService.verify(documentId, verifyData, req.user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    await this.visaExtensionService.remove(id, req.user);
    return { message: 'Visa extension application deleted successfully' };
  }
}
