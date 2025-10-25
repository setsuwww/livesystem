/*
  Warnings:

  - The values [ACCEPTED] on the enum `Attendance_approval` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `attendance` MODIFY `approval` ENUM('PENDING', 'APPROVED', 'REJECTED') NULL;
