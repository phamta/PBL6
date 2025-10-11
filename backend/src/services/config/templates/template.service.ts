import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../../database/prisma.service";
import { CreateTemplateDto, UpdateTemplateDto } from "./dto";
import { Template } from "@prisma/client";
import * as fs from "fs/promises";
import * as path from "path";

export interface TemplateUser {
  id: string;
  actions: string[];
}

@Injectable()
export class TemplateService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new template
   */
  async create(
    dto: CreateTemplateDto,
    file: Express.Multer.File,
    userId: string
  ): Promise<Template> {
    if (!file) {
      throw new BadRequestException("Template file is required");
    }

    // Store file path relative to uploads directory
    const filePath = `/uploads/templates/${file.filename}`;

    const template = await this.prisma.template.create({
      data: {
        name: dto.name,
        category: dto.category,
        filePath,
        fileType:
          dto.fileType ||
          path.extname(file.originalname).toUpperCase().replace(".", ""),
        isMandatory: dto.isMandatory || false,
        description: dto.description,
        uploadedById: userId,
      },
    });

    return template;
  }

  /**
   * Find all templates with optional filtering
   */
  async findAll(activeOnly?: boolean, category?: string): Promise<Template[]> {
    const where: any = {};

    if (activeOnly !== undefined) {
      where.isActive = activeOnly;
    }

    if (category) {
      where.category = category;
    }

    return this.prisma.template.findMany({
      where,
      include: {
        uploadedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Find templates by category
   */
  async findByCategory(category: string): Promise<Template[]> {
    return this.prisma.template.findMany({
      where: {
        category,
        isActive: true,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Find one template by ID
   */
  async findOne(id: string): Promise<Template> {
    const template = await this.prisma.template.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    return template;
  }

  /**
   * Update a template
   */
  async update(id: string, dto: UpdateTemplateDto): Promise<Template> {
    const template = await this.findOne(id);

    return this.prisma.template.update({
      where: { id },
      data: {
        name: dto.name,
        category: dto.category,
        isMandatory: dto.isMandatory,
        isActive: dto.isActive,
        description: dto.description,
      },
    });
  }

  /**
   * Toggle template active status
   */
  async toggleActive(id: string, isActive: boolean): Promise<Template> {
    await this.findOne(id);

    return this.prisma.template.update({
      where: { id },
      data: { isActive },
    });
  }

  /**
   * Delete a template
   */
  async delete(id: string): Promise<void> {
    const template = await this.findOne(id);

    // Delete the physical file
    try {
      const fullPath = path.join(
        process.cwd(),
        "uploads",
        "templates",
        path.basename(template.filePath)
      );
      await fs.unlink(fullPath);
    } catch (error) {
      // Log error but continue with database deletion
      console.error(`Error deleting file: ${error.message}`);
    }

    await this.prisma.template.delete({
      where: { id },
    });
  }

  /**
   * Get mandatory templates for a specific category
   */
  async getMandatoryTemplates(category?: string): Promise<Template[]> {
    const where: any = {
      isMandatory: true,
      isActive: true,
    };

    if (category) {
      where.category = category;
    }

    return this.prisma.template.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
