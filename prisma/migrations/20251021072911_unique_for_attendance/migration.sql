/*
  Warnings:

  - A unique constraint covering the columns `[userId,date]` on the table `PermissionRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `shiftchangerequest` MODIFY `status` ENUM('PENDING', 'PENDING_TARGET', 'PENDING_ADMIN', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING_TARGET';

-- CreateIndex
CREATE UNIQUE INDEX `PermissionRequest_userId_date_key` ON `PermissionRequest`(`userId`, `date`);
