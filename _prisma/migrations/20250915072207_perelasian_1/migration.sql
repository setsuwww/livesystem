-- DropForeignKey
ALTER TABLE `attendance` DROP FOREIGN KEY `Attendance_shiftId_fkey`;

-- DropForeignKey
ALTER TABLE `permissionrequest` DROP FOREIGN KEY `PermissionRequest_shiftId_fkey`;

-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_shiftId_fkey`;

-- DropIndex
DROP INDEX `Attendance_shiftId_fkey` ON `attendance`;

-- DropIndex
DROP INDEX `PermissionRequest_shiftId_fkey` ON `permissionrequest`;

-- DropIndex
DROP INDEX `Schedule_shiftId_fkey` ON `schedule`;

-- DropIndex
DROP INDEX `Shift_type_key` ON `shift`;

-- CreateTable
CREATE TABLE `UserShiftAssignment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `shiftId` INTEGER NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `UserShiftAssignment_userId_shiftId_key`(`userId`, `shiftId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_shiftId_fkey` FOREIGN KEY (`shiftId`) REFERENCES `Shift`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserShiftAssignment` ADD CONSTRAINT `UserShiftAssignment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserShiftAssignment` ADD CONSTRAINT `UserShiftAssignment_shiftId_fkey` FOREIGN KEY (`shiftId`) REFERENCES `Shift`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_shiftId_fkey` FOREIGN KEY (`shiftId`) REFERENCES `Shift`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PermissionRequest` ADD CONSTRAINT `PermissionRequest_shiftId_fkey` FOREIGN KEY (`shiftId`) REFERENCES `Shift`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
