-- CreateTable
CREATE TABLE "mou_feedbacks" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "attachments" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mou_feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mou_feedbacks_documentId_idx" ON "mou_feedbacks"("documentId");

-- CreateIndex
CREATE INDEX "mou_feedbacks_authorId_idx" ON "mou_feedbacks"("authorId");

-- AddForeignKey
ALTER TABLE "mou_feedbacks" ADD CONSTRAINT "mou_feedbacks_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mou_feedbacks" ADD CONSTRAINT "mou_feedbacks_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
