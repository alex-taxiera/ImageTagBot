-- AlterTable
ALTER TABLE "tag" ADD COLUMN     "imgurSrc" VARCHAR(255);
UPDATE "tag" SET "imgurSrc" = "src";
