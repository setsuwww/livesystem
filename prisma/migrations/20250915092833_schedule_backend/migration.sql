/*
  Warnings:

  - You are about to drop the column `eventId` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the `event` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_officeId_fkey`;

-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_eventId_fkey`;

-- DropIndex
DROP INDEX `Schedule_eventId_fkey` ON `schedule`;

-- AlterTable
ALTER TABLE `schedule` DROP COLUMN `eventId`,
    ADD COLUMN `endDate` DATETIME(3) NULL,
    ADD COLUMN `startDate` DATETIME(3) NULL;

-- DropTable
DROP TABLE `event`;
