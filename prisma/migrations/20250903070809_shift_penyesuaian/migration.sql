/*
  Warnings:

  - Changed the type of `startTime` on the `shift` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endTime` on the `shift` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `shift` DROP COLUMN `startTime`,
    ADD COLUMN `startTime` INTEGER NOT NULL,
    DROP COLUMN `endTime`,
    ADD COLUMN `endTime` INTEGER NOT NULL;
