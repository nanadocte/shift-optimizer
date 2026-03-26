/*
  Warnings:

  - The `type` column on the `Preference` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `day` column on the `Preference` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date` column on the `Preference` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `day` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `jobNeeded` on the `Shift` table. All the data in the column will be lost.
  - Added the required column `ShiftTemplateId` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `job` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shiftTemplateId` to the `Shift` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PreferenceContrainteType" AS ENUM ('PONCTUAL', 'RECURING');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche');

-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_userId_fkey";

-- AlterTable
ALTER TABLE "Preference" DROP COLUMN "type",
ADD COLUMN     "type" "PreferenceContrainteType" NOT NULL DEFAULT 'PONCTUAL',
DROP COLUMN "day",
ADD COLUMN     "day" "DayOfWeek",
DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "day",
DROP COLUMN "jobNeeded",
ADD COLUMN     "ShiftTemplateId" INTEGER NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "job" TEXT NOT NULL,
ADD COLUMN     "shiftTemplateId" INTEGER NOT NULL,
ALTER COLUMN "startTime" SET DATA TYPE TEXT,
ALTER COLUMN "endTime" SET DATA TYPE TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- DropEnum
DROP TYPE "PreferenceType";

-- CreateTable
CREATE TABLE "Contrainte" (
    "id" SERIAL NOT NULL,
    "type" "PreferenceContrainteType" NOT NULL DEFAULT 'PONCTUAL',
    "day" "DayOfWeek",
    "date" TIMESTAMP(3),
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Contrainte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShiftTemplate" (
    "id" SERIAL NOT NULL,
    "day" "DayOfWeek" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "quantityJob" INTEGER NOT NULL,

    CONSTRAINT "ShiftTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Contrainte" ADD CONSTRAINT "Contrainte_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_shiftTemplateId_fkey" FOREIGN KEY ("shiftTemplateId") REFERENCES "ShiftTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
