/*
  Warnings:

  - You are about to drop the column `shiftId` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_shiftId_fkey`;

-- DropIndex
DROP INDEX `User_shiftId_fkey` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `shiftId`;

-- CreateTable
CREATE TABLE `_UserShifts` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserShifts_AB_unique`(`A`, `B`),
    INDEX `_UserShifts_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_UserShifts` ADD CONSTRAINT `_UserShifts_A_fkey` FOREIGN KEY (`A`) REFERENCES `Shift`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserShifts` ADD CONSTRAINT `_UserShifts_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
