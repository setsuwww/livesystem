/*
  Warnings:

  - You are about to alter the column `startTime` on the `shift` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `endTime` on the `shift` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - A unique constraint covering the columns `[type]` on the table `Shift` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `shift` MODIFY `startTime` INTEGER NOT NULL,
    MODIFY `endTime` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Shift_type_key` ON `Shift`(`type`);
