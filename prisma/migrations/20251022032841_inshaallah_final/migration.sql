/*
  Warnings:

  - You are about to drop the `permissionrequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `permissionrequest` DROP FOREIGN KEY `PermissionRequest_shiftId_fkey`;

-- DropForeignKey
ALTER TABLE `permissionrequest` DROP FOREIGN KEY `PermissionRequest_userId_fkey`;

-- AlterTable
ALTER TABLE `attendance` ADD COLUMN `adminReason` VARCHAR(191) NULL,
    ADD COLUMN `approval` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NULL;

-- DropTable
DROP TABLE `permissionrequest`;
