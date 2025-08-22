/*
  Warnings:

  - You are about to alter the column `status` on the `attendance` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(4))`.
  - You are about to drop the column `date` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `customType` on the `shift` table. All the data in the column will be lost.
  - The values [CUSTOM] on the enum `Schedule_shiftType` will be removed. If these variants are still used in the database, this will fail.
  - The values [MANAGER] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `ticket` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,shiftId,date]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[type]` on the table `Shift` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `ticket` DROP FOREIGN KEY `Ticket_userId_fkey`;

-- AlterTable
ALTER TABLE `attendance` ADD COLUMN `approved` BOOLEAN NULL,
    ADD COLUMN `checkInAt` DATETIME(3) NULL,
    ADD COLUMN `checkOutAt` DATETIME(3) NULL,
    MODIFY `status` ENUM('ON_TIME', 'LATE', 'ABSENT', 'PERMISSION') NOT NULL DEFAULT 'ABSENT';

-- AlterTable
ALTER TABLE `schedule` DROP COLUMN `date`,
    ADD COLUMN `agenda` VARCHAR(191) NULL,
    ADD COLUMN `createdById` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `dueDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `frequency` ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'ONCE') NOT NULL DEFAULT 'ONCE',
    ADD COLUMN `shiftType` ENUM('MORNING', 'AFTERNOON', 'NIGHT', 'OFF') NULL,
    MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `shift` DROP COLUMN `customType`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `type` ENUM('MORNING', 'AFTERNOON', 'NIGHT', 'OFF') NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('ADMIN', 'COORDINATOR', 'EMPLOYEE', 'OPERATOR', 'USER') NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE `ticket`;

-- CreateTable
CREATE TABLE `Todo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `done` BOOLEAN NOT NULL DEFAULT false,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Todo_userId_done_idx`(`userId`, `done`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Attendance_date_idx` ON `Attendance`(`date`);

-- CreateIndex
CREATE INDEX `Attendance_status_idx` ON `Attendance`(`status`);

-- CreateIndex
CREATE UNIQUE INDEX `Attendance_userId_shiftId_date_key` ON `Attendance`(`userId`, `shiftId`, `date`);

-- CreateIndex
CREATE INDEX `Schedule_dueDate_idx` ON `Schedule`(`dueDate`);

-- CreateIndex
CREATE INDEX `Schedule_frequency_idx` ON `Schedule`(`frequency`);

-- CreateIndex
CREATE INDEX `Schedule_userId_shiftId_idx` ON `Schedule`(`userId`, `shiftId`);

-- CreateIndex
CREATE UNIQUE INDEX `Shift_type_key` ON `Shift`(`type`);

-- CreateIndex
CREATE INDEX `Shift_type_idx` ON `Shift`(`type`);

-- CreateIndex
CREATE INDEX `User_role_idx` ON `User`(`role`);

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Todo` ADD CONSTRAINT `Todo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_shiftId_fkey` TO `User_shiftId_idx`;
