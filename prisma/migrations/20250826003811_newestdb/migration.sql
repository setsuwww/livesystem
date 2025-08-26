/*
  Warnings:

  - You are about to drop the `ticket` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ticket` DROP FOREIGN KEY `Ticket_userId_fkey`;

-- DropTable
DROP TABLE `ticket`;
