-- AlterTable
ALTER TABLE `drivers` ADD COLUMN `gender` VARCHAR(191) NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `students` ADD COLUMN `address` VARCHAR(191) NULL,
    MODIFY `birth_date` VARCHAR(191) NOT NULL;
