/*
  Warnings:

  - You are about to drop the column `createdAt` on the `shift` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `shift` table. All the data in the column will be lost.
  - You are about to drop the `shiftassignment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `shiftassignment` DROP FOREIGN KEY `ShiftAssignment_shiftId_fkey`;

-- DropForeignKey
ALTER TABLE `shiftassignment` DROP FOREIGN KEY `ShiftAssignment_userId_fkey`;

-- AlterTable
ALTER TABLE `attendance` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `permissionrequest` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `schedule` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `shift` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `shiftId` INTEGER NULL,
    ALTER COLUMN `updatedAt` DROP DEFAULT;

-- DropTable
DROP TABLE `shiftassignment`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_shiftId_fkey` FOREIGN KEY (`shiftId`) REFERENCES `Shift`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
