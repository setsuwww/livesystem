/*
  Warnings:

  - You are about to drop the column `date` on the `shiftchangerequest` table. All the data in the column will be lost.
  - Added the required column `startDate` to the `ShiftChangeRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `shiftchangerequest` DROP COLUMN `date`,
    ADD COLUMN `endDate` DATETIME(3) NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL;
