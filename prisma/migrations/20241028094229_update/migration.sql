/*
  Warnings:

  - You are about to drop the column `AutoClickerPower` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "AutoClickerPower",
ADD COLUMN     "autoClickerPower" INTEGER NOT NULL DEFAULT 0;
