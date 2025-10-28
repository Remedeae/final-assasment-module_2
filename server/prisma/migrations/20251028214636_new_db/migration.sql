/*
  Warnings:

  - You are about to drop the column `minutes` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "minutes",
ADD COLUMN     "timePlayed" INTEGER NOT NULL DEFAULT 0;
