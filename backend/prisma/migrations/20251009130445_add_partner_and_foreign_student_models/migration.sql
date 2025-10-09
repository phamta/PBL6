-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "cooperationField" TEXT,
ADD COLUMN     "handlingStatus" TEXT,
ADD COLUMN     "isHighLevelDelegation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "partnerAddress" TEXT,
ADD COLUMN     "partnerField" TEXT,
ADD COLUMN     "partnerId" TEXT,
ADD COLUMN     "proposalReason" TEXT,
ADD COLUMN     "proposingUnit" TEXT,
ADD COLUMN     "signedBy" TEXT,
ADD COLUMN     "signingLevel" TEXT,
ADD COLUMN     "unitId" TEXT;

-- AlterTable
ALTER TABLE "guest_members" ADD COLUMN     "affiliation" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "guests" ADD COLUMN     "hostDepartment" TEXT,
ADD COLUMN     "immigrationDocNA2" TEXT,
ADD COLUMN     "invitationLetterNo" TEXT,
ADD COLUMN     "partnerId" TEXT,
ADD COLUMN     "reportFile" TEXT,
ADD COLUMN     "unitId" TEXT,
ADD COLUMN     "visaRequestDocNA5" TEXT,
ADD COLUMN     "visitPurpose" TEXT;

-- AlterTable
ALTER TABLE "report_logs" ADD COLUMN     "partnerName" TEXT,
ADD COLUMN     "unitName" TEXT,
ADD COLUMN     "year" INTEGER;

-- AlterTable
ALTER TABLE "translations" ADD COLUMN     "languagePair" TEXT,
ADD COLUMN     "partnerId" TEXT,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "translatorName" TEXT,
ADD COLUMN     "unitId" TEXT,
ADD COLUMN     "unitName" TEXT,
ADD COLUMN     "verificationFile" TEXT;

-- AlterTable
ALTER TABLE "visas" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "department" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "entryDate" TIMESTAMP(3),
ADD COLUMN     "extensionReason" TEXT,
ADD COLUMN     "extensionRequestDate" TIMESTAMP(3),
ADD COLUMN     "na5Request" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "partnerId" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "program" TEXT,
ADD COLUMN     "reminderSentDate" TIMESTAMP(3),
ADD COLUMN     "supervisorName" TEXT,
ADD COLUMN     "unitId" TEXT,
ADD COLUMN     "visaType" TEXT;

-- CreateTable
CREATE TABLE "partners" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "address" TEXT,
    "establishedYear" INTEGER,
    "field" TEXT,
    "contactPerson" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "website" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foreign_students" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "nationality" TEXT NOT NULL,
    "passportNumber" TEXT NOT NULL,
    "visaId" TEXT,
    "program" TEXT,
    "departmentId" TEXT,
    "supervisor" TEXT,
    "startDate" TIMESTAMP(3),
    "expectedEndDate" TIMESTAMP(3),
    "scholarshipType" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "foreign_students_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "partners_name_key" ON "partners"("name");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visas" ADD CONSTRAINT "visas_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visas" ADD CONSTRAINT "visas_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guests" ADD CONSTRAINT "guests_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guests" ADD CONSTRAINT "guests_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foreign_students" ADD CONSTRAINT "foreign_students_visaId_fkey" FOREIGN KEY ("visaId") REFERENCES "visas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foreign_students" ADD CONSTRAINT "foreign_students_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE CASCADE;
