-- AlterTable
ALTER TABLE `office` ADD COLUMN `endTime` INTEGER NULL,
    ADD COLUMN `latitude` DOUBLE NULL,
    ADD COLUMN `longitude` DOUBLE NULL,
    ADD COLUMN `radius` DOUBLE NULL,
    ADD COLUMN `startTime` INTEGER NULL,
    ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'INACTIVE',
    ADD COLUMN `type` ENUM('WFA', 'WFO') NOT NULL DEFAULT 'WFO';

-- CreateTable
CREATE TABLE `WorkLocation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('WFA', 'WFO') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `longitude` DOUBLE NULL,
    `latitude` DOUBLE NULL,
    `radius` DOUBLE NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'INACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserToWorkLocation` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserToWorkLocation_AB_unique`(`A`, `B`),
    INDEX `_UserToWorkLocation_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_UserToWorkLocation` ADD CONSTRAINT `_UserToWorkLocation_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserToWorkLocation` ADD CONSTRAINT `_UserToWorkLocation_B_fkey` FOREIGN KEY (`B`) REFERENCES `WorkLocation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
