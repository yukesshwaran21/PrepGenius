-- Add configurable timer per interview
ALTER TABLE "interviews"
ADD COLUMN "questionTimeLimitSec" INTEGER NOT NULL DEFAULT 60;

-- Persist per-answer timing and simulation metadata
ALTER TABLE "answers"
ADD COLUMN "answerStartedAt" TIMESTAMP(3),
ADD COLUMN "answerSubmittedAt" TIMESTAMP(3),
ADD COLUMN "timeSpentSeconds" INTEGER,
ADD COLUMN "timedOut" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "autoSubmitted" BOOLEAN NOT NULL DEFAULT false;
