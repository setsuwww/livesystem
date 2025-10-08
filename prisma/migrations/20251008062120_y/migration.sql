-- CreateTable
CREATE TABLE `SystemConfig` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `allWfaActive` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
