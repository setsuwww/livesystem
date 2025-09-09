-- AlterTable
ALTER TABLE `attendance` ADD COLUMN `checkInTime` DATETIME(3) NULL,
    ADD COLUMN `checkOutTime` DATETIME(3) NULL;
