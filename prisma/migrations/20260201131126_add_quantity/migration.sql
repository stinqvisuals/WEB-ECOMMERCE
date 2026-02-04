/*
  Warnings:

  - You are about to drop the column `capacity` on the `Clothes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Clothes" DROP COLUMN "capacity",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;
