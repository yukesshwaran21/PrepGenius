-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "correctOptionId" TEXT,
ADD COLUMN     "options" JSONB;
