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
CREATE TABLE `buses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `licensePlate` VARCHAR(191) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'MAINTENANCE') NOT NULL DEFAULT 'ACTIVE',

    UNIQUE INDEX `buses_licensePlate_key`(`licensePlate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `routes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `start_pickup` VARCHAR(191) NOT NULL,
    `end_pickup` VARCHAR(191) NOT NULL,
    `start_time` VARCHAR(191) NOT NULL,
    `end_time` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `avatar` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `account_id` INTEGER NOT NULL,

    UNIQUE INDEX `parents_phone_key`(`phone`),
    UNIQUE INDEX `parents_email_key`(`email`),
    UNIQUE INDEX `parents_account_id_key`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `avatar` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `birth_date` DATETIME(3) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `status` ENUM('STUDYING', 'DROPPED_OUT', 'UNKNOWN') NOT NULL DEFAULT 'UNKNOWN',
    `parent_id` INTEGER NOT NULL,
    `class_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `drivers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `avatar` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `birth_date` DATETIME(3) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `account_id` INTEGER NOT NULL,

    UNIQUE INDEX `drivers_phone_key`(`phone`),
    UNIQUE INDEX `drivers_email_key`(`email`),
    UNIQUE INDEX `drivers_account_id_key`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schedules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `work_schedule` VARCHAR(191) NOT NULL,
    `driver_id` INTEGER NOT NULL,
    `bus_id` INTEGER NOT NULL,
    `route_id` INTEGER NOT NULL,

    UNIQUE INDEX `schedules_driver_id_key`(`driver_id`),
    UNIQUE INDEX `schedules_bus_id_key`(`bus_id`),
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
CREATE TABLE `pickupToRoute` (
    `route_id` INTEGER NOT NULL,
    `pickup_id` INTEGER NOT NULL,
    `order` INTEGER NOT NULL,

    PRIMARY KEY (`route_id`, `pickup_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `parents` ADD CONSTRAINT `parents_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `parents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `drivers` ADD CONSTRAINT `drivers_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_driver_id_fkey` FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_bus_id_fkey` FOREIGN KEY (`bus_id`) REFERENCES `buses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_route_id_fkey` FOREIGN KEY (`route_id`) REFERENCES `routes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pickupToRoute` ADD CONSTRAINT `pickupToRoute_route_id_fkey` FOREIGN KEY (`route_id`) REFERENCES `routes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pickupToRoute` ADD CONSTRAINT `pickupToRoute_pickup_id_fkey` FOREIGN KEY (`pickup_id`) REFERENCES `pickups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- ------------------------------------------------------------
-- 🌱 SAMPLE DATA SEED
-- ------------------------------------------------------------

-- Accounts
INSERT INTO `accounts` (`username`, `password`, `role`, `status`) VALUES
('admin', '123456', 'ADMIN', 'ACTIVE'),
('parent1', '123456', 'PARENT', 'ACTIVE'),
('parent2', '123456', 'PARENT', 'ACTIVE'),
('driver1', '123456', 'DRIVER', 'ACTIVE'),
('driver2', '123456', 'DRIVER', 'ACTIVE');

-- Parents
INSERT INTO `parents` (`avatar`, `full_name`, `phone`, `email`, `address`, `account_id`) VALUES
('/images/parent1.jpg', 'Nguyen Van A', '0901234567', 'parent1@example.com', '123 Le Loi, HCM', 2),
('/images/parent2.jpg', 'Tran Thi B', '0909876543', 'parent2@example.com', '456 Nguyen Trai, HCM', 3);

-- Classes
INSERT INTO `classes` (`name`) VALUES
('1A'),
('2B'),
('3C');

-- Students
INSERT INTO `students` (`avatar`, `full_name`, `birth_date`, `gender`, `status`, `parent_id`, `class_id`) VALUES
('/images/student1.jpg', 'Nguyen Thi C', '2015-06-10 00:00:00', 'FEMALE', 'STUDYING', 1, 1),
('/images/student2.jpg', 'Tran Van D', '2014-09-21 00:00:00', 'MALE', 'STUDYING', 1, 2),
('/images/student3.jpg', 'Le Thi E', '2013-11-01 00:00:00', 'FEMALE', 'UNKNOWN', 2, 3),
('/images/student4.jpg', 'Phan Van F', '2012-02-18 00:00:00', 'MALE', 'DROPPED_OUT', 2, 1),
('/images/student5.jpg', 'Do Thi G', '2015-08-05 00:00:00', 'FEMALE', 'STUDYING', 2, 2);

-- Drivers
INSERT INTO `drivers` (`avatar`, `full_name`, `birth_date`, `phone`, `email`, `address`, `account_id`) VALUES
('/images/driver1.jpg', 'Nguyen Van Tai', '1985-04-10 00:00:00', '0912345678', 'driver1@example.com', '789 Cach Mang Thang 8, HCM', 4),
('/images/driver2.jpg', 'Tran Quoc Huy', '1978-12-22 00:00:00', '0923456789', 'driver2@example.com', '321 Hai Ba Trung, HCM', 5);

-- Buses
INSERT INTO `buses` (`licensePlate`, `capacity`, `status`) VALUES
('51A-12345', 40, 'ACTIVE'),
('51B-67890', 35, 'ACTIVE'),
('51C-88888', 50, 'INACTIVE');

-- Pickups
INSERT INTO `pickups` (`name`, `category`, `lat`, `lng`, `status`) VALUES
('Truong Tieu Hoc Hoa Sen', 'SCHOOL', 10.7760, 106.6950, 'ACTIVE'),
('Truong Tieu Hoc Le Loi', 'SCHOOL', 10.7790, 106.7000, 'ACTIVE'),
('Nha Nguyen Van A', 'PICKUP', 10.7720, 106.6930, 'ACTIVE'),
('Nha Tran Thi B', 'PICKUP', 10.7740, 106.6970, 'ACTIVE'),
('Cong vien Tao Dan', 'PICKUP', 10.7770, 106.6920, 'INACTIVE');

-- Routes
INSERT INTO `routes` (`name`, `start_pickup`, `end_pickup`, `start_time`, `end_time`, `status`) VALUES
('Tuyen 1 - Nha A -> Hoa Sen', 'Nha Nguyen Van A', 'Truong Tieu Hoc Hoa Sen', '07:00', '07:40', 'ACTIVE'),
('Tuyen 2 - Nha B -> Le Loi', 'Nha Tran Thi B', 'Truong Tieu Hoc Le Loi', '07:15', '07:55', 'ACTIVE');

-- pickupToRoute (kết nối điểm đón với tuyến)
INSERT INTO `pickupToRoute` (`route_id`, `pickup_id`, `order`) VALUES
(1, 3, 1),
(1, 1, 2),
(2, 4, 1),
(2, 2, 2);

-- Schedules
INSERT INTO `schedules` (`work_schedule`, `driver_id`, `bus_id`, `route_id`) VALUES
('Thứ 2 - Thứ 6, 6h30 - 17h00', 1, 1, 1),
('Thứ 2 - Thứ 7, 7h00 - 16h00', 2, 2, 2);