-- AlterTable
ALTER TABLE "ShiftTemplate" ADD COLUMN     "type" "PreferenceContrainteType" NOT NULL DEFAULT 'RECURING',
ALTER COLUMN "day" DROP NOT NULL;
