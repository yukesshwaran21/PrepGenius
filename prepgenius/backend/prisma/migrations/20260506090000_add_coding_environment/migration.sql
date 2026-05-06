-- Create coding problems
CREATE TABLE "coding_problems" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "difficulty" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timeLimitMs" INTEGER NOT NULL DEFAULT 2000,
    "memoryLimitMb" INTEGER NOT NULL DEFAULT 256,
    "supportedLanguages" JSONB NOT NULL,
    "starterCode" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create coding test cases
CREATE TABLE "coding_test_cases" (
    "id" SERIAL PRIMARY KEY,
    "problemId" INTEGER NOT NULL,
    "input" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT FALSE,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "coding_test_cases_problemId_fkey" FOREIGN KEY ("problemId")
        REFERENCES "coding_problems"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create coding submissions
CREATE TABLE "coding_submissions" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "problemId" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "sourceCode" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "runtimeMs" INTEGER,
    "memoryMb" INTEGER,
    "totalTests" INTEGER NOT NULL,
    "passedTests" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "similarityScore" DOUBLE PRECISION,
    "complexityEstimate" TEXT,
    "executionLog" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "coding_submissions_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "coding_submissions_problemId_fkey" FOREIGN KEY ("problemId")
        REFERENCES "coding_problems"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Seed a starter problem
INSERT INTO "coding_problems" (
    "title",
    "slug",
    "difficulty",
    "description",
    "timeLimitMs",
    "memoryLimitMb",
    "supportedLanguages",
    "starterCode",
    "createdAt",
    "updatedAt"
) VALUES (
    'Sum of Two Numbers',
    'sum-two-numbers',
    'beginner',
    'Given two integers on one line, return their sum.\n\nInput: Two integers separated by space.\nOutput: A single integer representing their sum.',
    2000,
    256,
    '["c", "java", "python"]',
    '{
      "c": "#include <stdio.h>\n\nint main() {\n    long long a, b;\n    if (scanf(\"%lld %lld\", &a, &b) != 2) {\n        return 0;\n    }\n    printf(\"%lld\", a + b);\n    return 0;\n}\n",
      "java": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) {\n            return;\n        }\n        long a = sc.nextLong();\n        long b = sc.nextLong();\n        System.out.print(a + b);\n    }\n}\n",
      "python": "def main():\n    import sys\n    data = sys.stdin.read().strip().split()\n    if len(data) < 2:\n        return\n    a = int(data[0])\n    b = int(data[1])\n    print(a + b)\n\nif __name__ == \"__main__\":\n    main()\n"
    }',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO "coding_test_cases" ("problemId", "input", "expectedOutput", "isHidden", "weight")
VALUES
  ((SELECT "id" FROM "coding_problems" WHERE "slug" = 'sum-two-numbers'), '2 5', '7', FALSE, 1),
  ((SELECT "id" FROM "coding_problems" WHERE "slug" = 'sum-two-numbers'), '100 250', '350', FALSE, 1);
