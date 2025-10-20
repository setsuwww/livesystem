/*
  Warnings:

  - The values [APPROVED,REJECTED] on the enum `ShiftChangeRequest_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `shiftchangerequest` MODIFY `status` ENUM('PENDING', 'ACCEPTED_BY_TARGET', 'REJECTED_BY_TARGET', 'APPROVED_BY_ADMIN', 'REJECTED_BY_ADMIN') NOT NULL DEFAULT 'PENDING';
