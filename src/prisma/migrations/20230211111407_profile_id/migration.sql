-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");
