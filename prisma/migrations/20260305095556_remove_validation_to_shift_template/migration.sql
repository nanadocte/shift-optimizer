/*
  Warnings:

  - You are about to drop the column `ShiftTemplateId` on the `Shift` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_shiftTemplateId_fkey";

-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "ShiftTemplateId",
ALTER COLUMN "shiftTemplateId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_shiftTemplateId_fkey" FOREIGN KEY ("shiftTemplateId") REFERENCES "ShiftTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
