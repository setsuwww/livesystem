/*
  Warnings:

  - You are about to drop the column `customType` on the `shift` table. All the data in the column will be lost.
  - The values [CUSTOM] on the enum `Shift_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `shift` DROP COLUMN `customType`,
    MODIFY `type` ENUM('OFF', 'MORNING', 'AFTERNOON', 'NIGHT') NOT NULL;
