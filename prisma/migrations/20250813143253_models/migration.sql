/*
  Warnings:

  - You are about to drop the `_usershifts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_usershifts` DROP FOREIGN KEY `_UserShifts_A_fkey`;

-- DropForeignKey
ALTER TABLE `_usershifts` DROP FOREIGN KEY `_UserShifts_B_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `shiftId` INTEGER NULL;

-- DropTable
DROP TABLE `_usershifts`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_shiftId_fkey` FOREIGN KEY (`shiftId`) REFERENCES `Shift`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
