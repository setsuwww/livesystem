/*
  Warnings:

  - You are about to drop the column `officeId` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `officeId` on the `shift` table. All the data in the column will be lost.
  - You are about to drop the column `officeId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `office` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `office` DROP FOREIGN KEY `Office_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_officeId_fkey`;

-- DropForeignKey
ALTER TABLE `shift` DROP FOREIGN KEY `Shift_officeId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_officeId_fkey`;

-- DropIndex
DROP INDEX `Schedule_officeId_fkey` ON `schedule`;

-- DropIndex
DROP INDEX `Shift_officeId_fkey` ON `shift`;

-- DropIndex
DROP INDEX `User_officeId_fkey` ON `user`;

-- AlterTable
ALTER TABLE `schedule` DROP COLUMN `officeId`,
    ADD COLUMN `divisionId` INTEGER NULL;

-- AlterTable
ALTER TABLE `shift` DROP COLUMN `officeId`,
    ADD COLUMN `divisionId` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `officeId`,
    ADD COLUMN `divisionId` INTEGER NULL;

-- DropTable
DROP TABLE `office`;

-- CreateTable
CREATE TABLE `Division` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NULL,
    `longitude` DOUBLE NULL,
    `latitude` DOUBLE NULL,
    `radius` DOUBLE NULL,
    `type` ENUM('WFO', 'WFA') NOT NULL DEFAULT 'WFO',
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'INACTIVE',
    `startTime` INTEGER NULL,
    `endTime` INTEGER NULL,
    `parentId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Division` ADD CONSTRAINT `Division_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Division`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_divisionId_fkey` FOREIGN KEY (`divisionId`) REFERENCES `Division`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shift` ADD CONSTRAINT `Shift_divisionId_fkey` FOREIGN KEY (`divisionId`) REFERENCES `Division`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_divisionId_fkey` FOREIGN KEY (`divisionId`) REFERENCES `Division`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
