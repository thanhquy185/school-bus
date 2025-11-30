-- CreateTable
CREATE TABLE `accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'PARENT', 'DRIVER') NOT NULL DEFAULT 'PARENT',
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',

    UNIQUE INDEX `accounts_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `actives` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_at` VARCHAR(191) NOT NULL,
    `end_at` VARCHAR(191) NULL,
    `bus_lat` DOUBLE NULL,
    `bus_lng` DOUBLE NULL,
    `bus_speed` INTEGER NULL,
    `bus_status` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'CANCELED', 'ACTIVE', 'SUCCESS') NOT NULL DEFAULT 'PENDING',
    `schedule_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `active_pickups` (
    `active_id` INTEGER NOT NULL,
    `pickup_id` INTEGER NOT NULL,
    `order` INTEGER NOT NULL,
    `at` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'CANCELED', 'DRIVING', 'CONFIRMED') NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (`active_id`, `pickup_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `active_students` (
    `active_id` INTEGER NOT NULL,
    `student_id` INTEGER NOT NULL,
    `at` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'ABSENT', 'LEAVE', 'CHECKED') NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (`active_id`, `student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `informs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `at` VARCHAR(191) NOT NULL,
    `type` ENUM('INFO', 'SUCCESS', 'WARNING', 'ERROR') NOT NULL DEFAULT 'INFO',
    `message` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `active_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schedules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start_date` VARCHAR(191) NOT NULL,
    `end_date` VARCHAR(191) NOT NULL,
    `start_time` VARCHAR(191) NOT NULL,
    `end_time` VARCHAR(191) NOT NULL,
    `days_of_week` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `driver_id` INTEGER NOT NULL,
    `bus_id` INTEGER NOT NULL,
    `route_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `routes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `start_pickup` VARCHAR(191) NOT NULL,
    `end_pickup` VARCHAR(191) NOT NULL,
    `total_distance` INTEGER NOT NULL,
    `total_time` INTEGER NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pickups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `category` ENUM('SCHOOL', 'PICKUP') NOT NULL,
    `lat` DOUBLE NOT NULL,
    `lng` DOUBLE NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `route_pickups` (
    `route_id` INTEGER NOT NULL,
    `pickup_id` INTEGER NOT NULL,
    `order` INTEGER NOT NULL,

    PRIMARY KEY (`route_id`, `pickup_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `license_plate` VARCHAR(191) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',

    UNIQUE INDEX `buses_license_plate_key`(`license_plate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `drivers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `avatar` VARCHAR(191) NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `birth_date` VARCHAR(191) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NOT NULL DEFAULT 'MALE',
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `account_id` INTEGER NOT NULL,

    UNIQUE INDEX `drivers_phone_key`(`phone`),
    UNIQUE INDEX `drivers_email_key`(`email`),
    UNIQUE INDEX `drivers_account_id_key`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `avatar` VARCHAR(191) NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `account_id` INTEGER NOT NULL,

    UNIQUE INDEX `parents_phone_key`(`phone`),
    UNIQUE INDEX `parents_email_key`(`email`),
    UNIQUE INDEX `parents_account_id_key`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `avatar` VARCHAR(191) NULL,
    `card_id` VARCHAR(191) NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `birth_date` VARCHAR(191) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NOT NULL DEFAULT 'MALE',
    `address` VARCHAR(191) NOT NULL,
    `status` ENUM('STUDYING', 'DROPPED_OUT') NOT NULL DEFAULT 'STUDYING',
    `parent_id` INTEGER NOT NULL,
    `class_id` INTEGER NOT NULL,
    `pickup_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `actives` ADD CONSTRAINT `actives_schedule_id_fkey` FOREIGN KEY (`schedule_id`) REFERENCES `schedules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `active_pickups` ADD CONSTRAINT `active_pickups_active_id_fkey` FOREIGN KEY (`active_id`) REFERENCES `actives`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `active_pickups` ADD CONSTRAINT `active_pickups_pickup_id_fkey` FOREIGN KEY (`pickup_id`) REFERENCES `pickups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `active_students` ADD CONSTRAINT `active_students_active_id_fkey` FOREIGN KEY (`active_id`) REFERENCES `actives`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `active_students` ADD CONSTRAINT `active_students_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `informs` ADD CONSTRAINT `informs_active_id_fkey` FOREIGN KEY (`active_id`) REFERENCES `actives`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_driver_id_fkey` FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_bus_id_fkey` FOREIGN KEY (`bus_id`) REFERENCES `buses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_route_id_fkey` FOREIGN KEY (`route_id`) REFERENCES `routes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `route_pickups` ADD CONSTRAINT `route_pickups_route_id_fkey` FOREIGN KEY (`route_id`) REFERENCES `routes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `route_pickups` ADD CONSTRAINT `route_pickups_pickup_id_fkey` FOREIGN KEY (`pickup_id`) REFERENCES `pickups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `drivers` ADD CONSTRAINT `drivers_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parents` ADD CONSTRAINT `parents_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `parents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_pickup_id_fkey` FOREIGN KEY (`pickup_id`) REFERENCES `pickups`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
