import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  BadRequestException,
  ParseBoolPipe,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { diskStorage } from "multer";
import { extname } from "path";
import { Request } from "express";
import { TemplateService } from "./template.service";
import { CreateTemplateDto, UpdateTemplateDto } from "./dto";
import { JwtAuthGuard } from "../../../common/guards/jwt-auth.guard";
import { ActionGuard } from "../../../common/guards/action.guard";
import { RequireAction } from "../../../decorators/require-action.decorator";

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    actions: string[];
  };
}

@ApiTags("Templates")
@ApiBearerAuth()
@Controller("api/v1/templates")
@UseGuards(JwtAuthGuard, ActionGuard)
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  /**
   * Upload a new template
   */
  @Post("upload")
  @RequireAction("TEMPLATE_UPLOAD")
  @ApiOperation({ summary: "Tải lên biểu mẫu mới" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        category: { type: "string" },
        fileType: { type: "string" },
        isMandatory: { type: "boolean" },
        description: { type: "string" },
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads/templates",
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `template-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Allow only specific file types
        const allowedTypes = /pdf|doc|docx|xls|xlsx/;
        const ext = extname(file.originalname).toLowerCase();
        const mimeType = file.mimetype;

        if (
          allowedTypes.test(ext) &&
          (mimeType.includes("pdf") ||
            mimeType.includes("word") ||
            mimeType.includes("document") ||
            mimeType.includes("excel") ||
            mimeType.includes("spreadsheet"))
        ) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              "Invalid file type. Only PDF, DOC, DOCX, XLS, XLSX files are allowed."
            ),
            false
          );
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
      },
    })
  )
  async uploadTemplate(
    @Body() dto: CreateTemplateDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthenticatedRequest
  ) {
    const template = await this.templateService.create(
      dto,
      file,
      req.user.userId
    );
    return {
      message: "Template uploaded successfully",
      data: template,
    };
  }

  /**
   * Get all templates
   */
  @Get()
  @RequireAction("TEMPLATE_VIEW")
  @ApiOperation({ summary: "Lấy danh sách tất cả biểu mẫu" })
  async findAll(
    @Query("activeOnly", new ParseBoolPipe({ optional: true }))
    activeOnly?: boolean,
    @Query("category") category?: string
  ) {
    const templates = await this.templateService.findAll(activeOnly, category);
    return {
      message: "Templates retrieved successfully",
      data: templates,
    };
  }

  /**
   * Get templates by category
   */
  @Get("category/:category")
  @RequireAction("TEMPLATE_VIEW")
  @ApiOperation({ summary: "Lấy biểu mẫu theo danh mục" })
  async findByCategory(@Param("category") category: string) {
    const templates = await this.templateService.findByCategory(category);
    return {
      message: "Templates retrieved successfully",
      data: templates,
    };
  }

  /**
   * Get mandatory templates
   */
  @Get("mandatory")
  @RequireAction("TEMPLATE_VIEW")
  @ApiOperation({ summary: "Lấy danh sách biểu mẫu bắt buộc" })
  async getMandatory(@Query("category") category?: string) {
    const templates =
      await this.templateService.getMandatoryTemplates(category);
    return {
      message: "Mandatory templates retrieved successfully",
      data: templates,
    };
  }

  /**
   * Get template by ID
   */
  @Get(":id")
  @RequireAction("TEMPLATE_VIEW")
  @ApiOperation({ summary: "Lấy chi tiết biểu mẫu theo ID" })
  async findOne(@Param("id") id: string) {
    const template = await this.templateService.findOne(id);
    return {
      message: "Template retrieved successfully",
      data: template,
    };
  }

  /**
   * Update template metadata
   */
  @Patch(":id")
  @RequireAction("TEMPLATE_MANAGE")
  @ApiOperation({ summary: "Cập nhật thông tin biểu mẫu" })
  async update(@Param("id") id: string, @Body() dto: UpdateTemplateDto) {
    const template = await this.templateService.update(id, dto);
    return {
      message: "Template updated successfully",
      data: template,
    };
  }

  /**
   * Toggle template active status
   */
  @Patch(":id/active")
  @RequireAction("TEMPLATE_MANAGE")
  @ApiOperation({ summary: "Bật/tắt trạng thái kích hoạt biểu mẫu" })
  async toggleActive(
    @Param("id") id: string,
    @Body("isActive", ParseBoolPipe) isActive: boolean
  ) {
    const template = await this.templateService.toggleActive(id, isActive);
    return {
      message: "Template status updated successfully",
      data: template,
    };
  }

  /**
   * Delete template
   */
  @Delete(":id")
  @RequireAction("TEMPLATE_MANAGE")
  @ApiOperation({ summary: "Xóa biểu mẫu" })
  async delete(@Param("id") id: string) {
    await this.templateService.delete(id);
    return {
      message: "Template deleted successfully",
    };
  }
}
