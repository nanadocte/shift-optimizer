-- AlterTable
ALTER TABLE "Contrainte" ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "Preference" ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 1;
