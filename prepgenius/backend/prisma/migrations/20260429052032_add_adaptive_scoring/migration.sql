-- AlterTable
ALTER TABLE "answers" ADD COLUMN     "adaptiveScore" DOUBLE PRECISION,
ADD COLUMN     "scoreBreakdown" JSONB,
ADD COLUMN     "streakCount" INTEGER DEFAULT 0;
