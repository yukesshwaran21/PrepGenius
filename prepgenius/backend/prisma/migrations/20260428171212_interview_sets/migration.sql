-- AlterTable
ALTER TABLE "interviews" ADD COLUMN     "adaptiveEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "requestedDifficulty" TEXT,
ADD COLUMN     "setCount" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "setIndex" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "shuffleEnabled" BOOLEAN NOT NULL DEFAULT true;
