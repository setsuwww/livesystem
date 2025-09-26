/*
  Warnings:

  - You are about to drop the column `userId` on the `schedule` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_userId_fkey`;

-- DropIndex
DROP INDEX `Schedule_userId_fkey` ON `schedule`;

-- AlterTable
ALTER TABLE `schedule` DROP COLUMN `userId`;

-- CreateTable
CREATE TABLE `SchedulesOnUsers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scheduleId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `SchedulesOnUsers_scheduleId_userId_key`(`scheduleId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ScheduleDate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scheduleId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `shiftId` INTEGER NULL,
    `secondShiftId` INTEGER NULL,

    UNIQUE INDEX `ScheduleDate_scheduleId_date_key`(`scheduleId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SchedulesOnUsers` ADD CONSTRAINT `SchedulesOnUsers_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `Schedule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SchedulesOnUsers` ADD CONSTRAINT `SchedulesOnUsers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScheduleDate` ADD CONSTRAINT `ScheduleDate_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `Schedule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScheduleDate` ADD CONSTRAINT `ScheduleDate_shiftId_fkey` FOREIGN KEY (`shiftId`) REFERENCES `Shift`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScheduleDate` ADD CONSTRAINT `ScheduleDate_secondShiftId_fkey` FOREIGN KEY (`secondShiftId`) REFERENCES `Shift`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
