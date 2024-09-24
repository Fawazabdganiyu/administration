/*
  Warnings:

  - You are about to drop the column `numberOfproducts` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "numberOfproducts",
ADD COLUMN     "numberOfProducts" INTEGER;
