-- AlterTable
ALTER TABLE "interviews" ADD COLUMN     "mode" TEXT NOT NULL DEFAULT 'standard',
ADD COLUMN     "totalTimeLimitSec" INTEGER;

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "isFollowUp" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parentQuestionId" INTEGER;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_parentQuestionId_fkey" FOREIGN KEY ("parentQuestionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
