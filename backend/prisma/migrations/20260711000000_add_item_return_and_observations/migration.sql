-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "observations" TEXT,
ADD COLUMN     "returnedAt" TIMESTAMP(3),
ADD COLUMN     "returnNote" TEXT;
