/*
  Warnings:

  - The values [ACCEPTED_BY_TARGET,REJECTED_BY_TARGET,APPROVED_BY_ADMIN,REJECTED_BY_ADMIN] on the enum `ShiftChangeRequest_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `shiftchangerequest` ADD COLUMN `targetShiftId` INTEGER NULL,
    ADD COLUMN `targetUserId` INTEGER NULL,
    ADD COLUMN `verifiedByAdmin` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `verifiedByTarget` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `status` ENUM('PENDING', 'PENDING_TARGET', 'PENDING_ADMIN', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE `ShiftChangeRequest` ADD CONSTRAINT `ShiftChangeRequest_targetUserId_fkey` FOREIGN KEY (`targetUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShiftChangeRequest` ADD CONSTRAINT `ShiftChangeRequest_targetShiftId_fkey` FOREIGN KEY (`targetShiftId`) REFERENCES `Shift`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
