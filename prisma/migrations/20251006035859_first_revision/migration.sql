/*
  Warnings:

  - You are about to drop the column `shiftName` on the `shift` table. All the data in the column will be lost.
  - You are about to drop the `_usertoworklocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `worklocation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Shift` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_usertoworklocation` DROP FOREIGN KEY `_UserToWorkLocation_A_fkey`;

-- DropForeignKey
ALTER TABLE `_usertoworklocation` DROP FOREIGN KEY `_UserToWorkLocation_B_fkey`;

-- AlterTable
ALTER TABLE `office` ADD COLUMN `parentId` INTEGER NULL,
    MODIFY `type` ENUM('WFO', 'WFA') NOT NULL DEFAULT 'WFO';

-- AlterTable
ALTER TABLE `shift` DROP COLUMN `shiftName`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `_usertoworklocation`;

-- DropTable
DROP TABLE `worklocation`;

-- AddForeignKey
ALTER TABLE `Office` ADD CONSTRAINT `Office_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Office`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
