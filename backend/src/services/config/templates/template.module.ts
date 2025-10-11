import { Module } from "@nestjs/common";
import { AuthModule } from "../../identity/auth/auth.module";
import { TemplateService } from "./template.service";
import { TemplateController } from "./template.controller";
import { PrismaService } from "../../../database/prisma.service";

@Module({
  imports: [AuthModule],
  controllers: [TemplateController],
  providers: [TemplateService, PrismaService],
  exports: [TemplateService],
})
export class TemplateModule {}
