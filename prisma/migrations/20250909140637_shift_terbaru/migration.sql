-- DropIndex
DROP INDEX `Shift_type_key` ON `shift`;

-- AlterTable
ALTER TABLE `shift` ADD COLUMN `shiftName` VARCHAR(191) NULL;
