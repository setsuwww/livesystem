/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `Shift` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Shift_type_key` ON `Shift`(`type`);
