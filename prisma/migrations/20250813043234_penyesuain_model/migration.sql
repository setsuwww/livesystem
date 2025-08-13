/*
  Warnings:

  - You are about to drop the column `name` on the `shift` table. All the data in the column will be lost.
  - Added the required column `type` to the `Shift` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `shift` DROP COLUMN `name`,
    ADD COLUMN `type` ENUM('MORNING', 'AFTERNOON', 'NIGHT') NOT NULL;
