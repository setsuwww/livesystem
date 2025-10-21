/*
  Warnings:

  - The values [NIGHT] on the enum `Shift_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `shift` MODIFY `type` ENUM('OFF', 'MORNING', 'AFTERNOON', 'EVENING') NOT NULL;
