/*
  Warnings:

  - You are about to drop the `usershift` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `usershift` DROP FOREIGN KEY `UserShift_shiftId_fkey`;

-- DropForeignKey
ALTER TABLE `usershift` DROP FOREIGN KEY `UserShift_userId_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `shiftId` INTEGER NULL;

-- DropTable
DROP TABLE `usershift`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_shiftId_fkey` FOREIGN KEY (`shiftId`) REFERENCES `Shift`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
