/*
  Warnings:

  - You are about to drop the column `shiftId` on the `schedule` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_shiftId_fkey`;

-- DropForeignKey
ALTER TABLE `scheduledate` DROP FOREIGN KEY `ScheduleDate_scheduleId_fkey`;

-- DropIndex
DROP INDEX `Schedule_shiftId_fkey` ON `schedule`;

-- AlterTable
ALTER TABLE `schedule` DROP COLUMN `shiftId`;
