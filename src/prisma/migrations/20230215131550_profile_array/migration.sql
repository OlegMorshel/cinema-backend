-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "subscribedProfileIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
