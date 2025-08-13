/*
  Warnings:

  - You are about to drop the column `userId` on the `shift` table. All the data in the column will be lost.
  - You are about to drop the `_scheduletoshift` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_scheduletoshift` DROP FOREIGN KEY `_ScheduleToShift_A_fkey`;

-- DropForeignKey
ALTER TABLE `_scheduletoshift` DROP FOREIGN KEY `_ScheduleToShift_B_fkey`;

-- DropForeignKey
ALTER TABLE `shift` DROP FOREIGN KEY `Shift_userId_fkey`;

-- DropIndex
DROP INDEX `Shift_userId_fkey` ON `shift`;

-- AlterTable
ALTER TABLE `shift` DROP COLUMN `userId`;

-- DropTable
DROP TABLE `_scheduletoshift`;

-- CreateTable
CREATE TABLE `UserShift` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `shiftId` INTEGER NOT NULL,
    `date` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserShift` ADD CONSTRAINT `UserShift_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserShift` ADD CONSTRAINT `UserShift_shiftId_fkey` FOREIGN KEY (`shiftId`) REFERENCES `Shift`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
