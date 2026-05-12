-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "industry" TEXT,
    "location" TEXT,
    "website" TEXT,
    "logoUrl" TEXT,
    "brandColors" TEXT[],
    "socialLinks" JSONB,
    "services" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedContent" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneratedContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIMemory" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "preferredTone" TEXT NOT NULL DEFAULT 'Professional',
    "bannedWords" TEXT[],
    "frequentlyUsed" TEXT[],
    "avgSentenceLength" TEXT NOT NULL DEFAULT 'Medium',
    "humorScore" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "emojiDensity" DOUBLE PRECISION NOT NULL DEFAULT 0.3,
    "learnedStyle" JSONB,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerInsight" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "rawContent" TEXT NOT NULL,
    "painPoints" TEXT[],
    "sentiment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'PENDING',
    "platform" TEXT NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Business_userId_key" ON "Business"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AIMemory_businessId_key" ON "AIMemory"("businessId");

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedContent" ADD CONSTRAINT "GeneratedContent_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIMemory" ADD CONSTRAINT "AIMemory_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerInsight" ADD CONSTRAINT "CustomerInsight_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "GeneratedContent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
