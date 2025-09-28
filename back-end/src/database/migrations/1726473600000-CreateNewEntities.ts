import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNewEntities1726473600000 implements MigrationInterface {
    name = 'CreateNewEntities1726473600000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create MOUs table
        await queryRunner.query(`
            CREATE TABLE "mous" (
                "id" SERIAL NOT NULL,
                "donViDeXuat" character varying NOT NULL,
                "tenDoiTac" character varying NOT NULL,
                "quocGia" character varying NOT NULL,
                "diaChi" character varying NOT NULL,
                "namThanhLap" integer NOT NULL,
                "linhVucHoatDong" character varying NOT NULL,
                "congNgheThongTin" character varying NOT NULL,
                "capKi" character varying NOT NULL,
                "loaiVanBanKyKet" character varying NOT NULL,
                "lyDoVaMucDichKyKet" text NOT NULL,
                "nguoiLienHePhuTrachHopTac" character varying NOT NULL,
                "cacTepDinhKem" text,
                "trangThai" character varying NOT NULL DEFAULT 'draft',
                "ghiChu" text,
                "createdBy" integer NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_mous" PRIMARY KEY ("id")
            )
        `);

        // Create System Activity Logs table
        await queryRunner.query(`
            CREATE TABLE "system_activity_logs" (
                "id" SERIAL NOT NULL,
                "tenDoiTac" character varying NOT NULL,
                "quocGia" character varying NOT NULL,
                "email" character varying NOT NULL,
                "soDienThoai" character varying NOT NULL,
                "tinhTrang" character varying NOT NULL,
                "ngayXuLy" TIMESTAMP NOT NULL,
                "ghiChu" text,
                "userId" integer NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_system_activity_logs" PRIMARY KEY ("id")
            )
        `);

        // Create International Guests table
        await queryRunner.query(`
            CREATE TABLE "international_guests" (
                "id" SERIAL NOT NULL,
                "title" character varying NOT NULL,
                "fullName" character varying NOT NULL,
                "dateOfBirth" TIMESTAMP NOT NULL,
                "quocGia" character varying NOT NULL,
                "gender" character varying NOT NULL,
                "passportNumber" character varying NOT NULL,
                "jobPosition" character varying NOT NULL,
                "affiliation" character varying NOT NULL,
                "email" character varying NOT NULL,
                "phoneNumber" character varying NOT NULL,
                "thoiGianDen" TIMESTAMP NOT NULL,
                "thoiGianVe" TIMESTAMP NOT NULL,
                "mucDichLamViec" text NOT NULL,
                "khoaDonViMoi" character varying NOT NULL,
                "passportFile" character varying,
                "trangThai" character varying NOT NULL DEFAULT 'pending',
                "ghiChu" text,
                "createdBy" integer NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_international_guests" PRIMARY KEY ("id")
            )
        `);

        // Create Translation Certificates table
        await queryRunner.query(`
            CREATE TABLE "translation_certificates" (
                "id" SERIAL NOT NULL,
                "donViDeXuat" character varying NOT NULL,
                "tenTaiLieuGoc" character varying NOT NULL,
                "ngonNguNguon" character varying NOT NULL,
                "ngonNguDich" character varying NOT NULL,
                "lyDoXacNhan" text NOT NULL,
                "fileTaiLieuGoc" character varying,
                "fileBanDich" character varying,
                "nguoiDich" character varying NOT NULL,
                "ghiChuKhac" text NOT NULL,
                "trangThai" character varying NOT NULL DEFAULT 'pending',
                "ghiChu" text,
                "createdBy" integer NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_translation_certificates" PRIMARY KEY ("id")
            )
        `);

        // Add foreign key constraints
        await queryRunner.query(`
            ALTER TABLE "mous" ADD CONSTRAINT "FK_mous_createdBy" 
            FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "system_activity_logs" ADD CONSTRAINT "FK_system_activity_logs_userId" 
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "international_guests" ADD CONSTRAINT "FK_international_guests_createdBy" 
            FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "translation_certificates" ADD CONSTRAINT "FK_translation_certificates_createdBy" 
            FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "translation_certificates" DROP CONSTRAINT "FK_translation_certificates_createdBy"`);
        await queryRunner.query(`ALTER TABLE "international_guests" DROP CONSTRAINT "FK_international_guests_createdBy"`);
        await queryRunner.query(`ALTER TABLE "system_activity_logs" DROP CONSTRAINT "FK_system_activity_logs_userId"`);
        await queryRunner.query(`ALTER TABLE "mous" DROP CONSTRAINT "FK_mous_createdBy"`);
        await queryRunner.query(`DROP TABLE "translation_certificates"`);
        await queryRunner.query(`DROP TABLE "international_guests"`);
        await queryRunner.query(`DROP TABLE "system_activity_logs"`);
        await queryRunner.query(`DROP TABLE "mous"`);
    }
}