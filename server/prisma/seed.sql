-- ============================================
-- SEED DATA FOR SCHOOL BUS MANAGEMENT SYSTEM
-- ============================================

-- Xóa dữ liệu cũ (nếu có) theo thứ tự phụ thuộc
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE students;
TRUNCATE TABLE schedules;
TRUNCATE TABLE routePickups;
TRUNCATE TABLE pickups;
TRUNCATE TABLE routes;
TRUNCATE TABLE buses;
TRUNCATE TABLE drivers;
TRUNCATE TABLE parents;
TRUNCATE TABLE classes;
TRUNCATE TABLE accounts;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 1. TẠO TÀI KHOẢN (accounts)
-- ============================================
-- 2 tài khoản cho tài xế
INSERT INTO accounts (id, username, password, role, status) VALUES
(1, 'driver1', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'DRIVER', 'ACTIVE'),
(2, 'driver2', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'DRIVER', 'ACTIVE'),
-- 2 tài khoản cho phụ huynh
(3, 'parent1', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'PARENT', 'ACTIVE'),
(4, 'parent2', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'PARENT', 'ACTIVE');

-- ============================================
-- 2. TẠO TÀI XẾ (drivers)
-- ============================================
INSERT INTO drivers (id, avatar, full_name, birth_date, gender, phone, email, address, account_id) VALUES
(1, NULL, 'Nguyễn Văn An', '1985-03-15', 'MALE', '0901234567', 'nguyenvanan@gmail.com', '123 Đường Lê Lợi, Quận 1, TP.HCM', 1),
(2, NULL, 'Trần Thị Bình', '1990-07-20', 'FEMALE', '0912345678', 'tranthibinh@gmail.com', '456 Đường Nguyễn Huệ, Quận 3, TP.HCM', 2);

-- ============================================
-- 3. TẠO PHỤ HUYNH (parents)
-- ============================================
INSERT INTO parents (id, avatar, full_name, phone, email, address, account_id) VALUES
(1, NULL, 'Lê Văn Cường', '0923456789', 'levancuong@gmail.com', '789 Đường Trần Hưng Đạo, Quận 5, TP.HCM', 3),
(2, NULL, 'Phạm Thị Dung', '0934567890', 'phamthidung@gmail.com', '321 Đường Võ Văn Tần, Quận 10, TP.HCM', 4);

-- ============================================
-- 4. TẠO LỚP HỌC (classes)
-- ============================================
INSERT INTO classes (id, name) VALUES
(1, 'Lớp 1A'),
(2, 'Lớp 2B'),
(3, 'Lớp 3C');

-- ============================================
-- 5. TẠO TRẠM XE BUÝT (pickups) - 8 trạm
-- ============================================
INSERT INTO pickups (id, name, category, lat, lng, status) VALUES
-- Trạm trường học
(1, 'Trường Tiểu học ABC', 'SCHOOL', 10.7769, 106.7009, 'ACTIVE'),
-- 7 trạm đón học sinh
(2, 'Trạm Ngã Tư Bình Phước', 'PICKUP', 10.7850, 106.7100, 'ACTIVE'),
(3, 'Trạm Chợ Tân Bình', 'PICKUP', 10.8000, 106.6500, 'ACTIVE'),
(4, 'Trạm Công Viên Gia Định', 'PICKUP', 10.7920, 106.6850, 'ACTIVE'),
(5, 'Trạm Siêu Thị Big C', 'PICKUP', 10.7700, 106.6950, 'ACTIVE'),
(6, 'Trạm Bệnh Viện Quận 1', 'PICKUP', 10.7680, 106.7050, 'ACTIVE'),
(7, 'Trạm Nhà Văn Hóa', 'PICKUP', 10.7950, 106.7150, 'ACTIVE'),
(8, 'Trạm Khu Dân Cư Phú Mỹ Hưng', 'PICKUP', 10.7300, 106.7200, 'ACTIVE');

-- ============================================
-- 6. TẠO TUYẾN ĐƯỜNG (routes) - 3 tuyến
-- ============================================
INSERT INTO routes (id, name, start_pickup, end_pickup, total_distance, total_time, status) VALUES
(1, 'Tuyến 1 - Khu Bình Phước', 'Trạm Ngã Tư Bình Phước', 'Trường Tiểu học ABC', 8500, 25, 'ACTIVE'),
(2, 'Tuyến 2 - Khu Tân Bình', 'Trạm Chợ Tân Bình', 'Trường Tiểu học ABC', 10000, 30, 'ACTIVE'),
(3, 'Tuyến 3 - Khu Phú Mỹ Hưng', 'Trạm Khu Dân Cư Phú Mỹ Hưng', 'Trường Tiểu học ABC', 12000, 35, 'ACTIVE');

-- ============================================
-- 7. GẮN TRẠM VÀO TUYẾN ĐƯỜNG (routePickups)
-- ============================================
-- Tuyến 1: Trạm 2 -> Trạm 4 -> Trạm 6 -> Trường (Trạm 1)
INSERT INTO routePickups (route_id, pickup_id, `order`) VALUES
(1, 2, 1),  -- Trạm Ngã Tư Bình Phước
(1, 4, 2),  -- Trạm Công Viên Gia Định
(1, 6, 3),  -- Trạm Bệnh Viện Quận 1
(1, 1, 4);  -- Trường Tiểu học ABC

-- Tuyến 2: Trạm 3 -> Trạm 5 -> Trạm 7 -> Trường (Trạm 1)
INSERT INTO routePickups (route_id, pickup_id, `order`) VALUES
(2, 3, 1),  -- Trạm Chợ Tân Bình
(2, 5, 2),  -- Trạm Siêu Thị Big C
(2, 7, 3),  -- Trạm Nhà Văn Hóa
(2, 1, 4);  -- Trường Tiểu học ABC

-- Tuyến 3: Trạm 8 -> Trạm 5 -> Trường (Trạm 1)
INSERT INTO routePickups (route_id, pickup_id, `order`) VALUES
(3, 8, 1),  -- Trạm Khu Dân Cư Phú Mỹ Hưng
(3, 5, 2),  -- Trạm Siêu Thị Big C
(3, 1, 3);  -- Trường Tiểu học ABC

-- ============================================
-- 8. TẠO HỌC SINH (students) - 5 học sinh
-- ============================================
INSERT INTO students (id, avatar, full_name, birth_date, gender, address, status, parent_id, class_id, pickup_id, route_id) VALUES
-- Học sinh của phụ huynh 1
(1, NULL, 'Lê Minh Đức', '2015-05-10', 'MALE', '789 Đường Trần Hưng Đạo, Quận 5, TP.HCM', 'STUDYING', 1, 1, 2, 1),
(2, NULL, 'Lê Thị Hương', '2014-08-22', 'FEMALE', '789 Đường Trần Hưng Đạo, Quận 5, TP.HCM', 'STUDYING', 1, 2, 4, 1),
-- Học sinh của phụ huynh 2
(3, NULL, 'Phạm Văn Khoa', '2016-01-15', 'MALE', '321 Đường Võ Văn Tần, Quận 10, TP.HCM', 'STUDYING', 2, 1, 3, 2),
(4, NULL, 'Phạm Thị Lan', '2015-11-30', 'FEMALE', '321 Đường Võ Văn Tần, Quận 10, TP.HCM', 'STUDYING', 2, 3, 7, 2),
(5, NULL, 'Phạm Minh Nam', '2017-03-18', 'MALE', '321 Đường Võ Văn Tần, Quận 10, TP.HCM', 'STUDYING', 2, 1, 8, 3);

-- ============================================
-- 9. TẠO XE BUÝT (buses) - 2 xe
-- ============================================
INSERT INTO buses (id, license_plate, capacity, status) VALUES
(1, '51B-12345', 30, 'ACTIVE'),
(2, '51B-67890', 35, 'ACTIVE');

-- ============================================
-- 10. TẠO LỊCH TRÌNH (schedules) - 3 lịch trình
-- ============================================
INSERT INTO schedules (id, start_date, end_date, start_time, end_time, status, driver_id, bus_id, route_id) VALUES
-- Tài xế 1 phụ trách tuyến 1 và 3
(1, '2025-01-01', '2025-06-30', '06:30:00', '07:30:00', 'ACTIVE', 1, 1, 1),
(2, '2025-01-01', '2025-06-30', '14:00:00', '15:00:00', 'ACTIVE', 1, 1, 3),
-- Tài xế 2 phụ trách tuyến 2
(3, '2025-01-01', '2025-06-30', '06:30:00', '07:30:00', 'ACTIVE', 2, 2, 2);

-- ============================================
-- HOÀN THÀNH!
-- ============================================
-- Kiểm tra dữ liệu đã tạo
SELECT 'Accounts created:' as Info, COUNT(*) as Count FROM accounts;
SELECT 'Drivers created:' as Info, COUNT(*) as Count FROM drivers;
SELECT 'Parents created:' as Info, COUNT(*) as Count FROM parents;
SELECT 'Students created:' as Info, COUNT(*) as Count FROM students;
SELECT 'Pickups created:' as Info, COUNT(*) as Count FROM pickups;
SELECT 'Routes created:' as Info, COUNT(*) as Count FROM routes;
SELECT 'Route-Pickup relations:' as Info, COUNT(*) as Count FROM routePickups;
SELECT 'Buses created:' as Info, COUNT(*) as Count FROM buses;
SELECT 'Schedules created:' as Info, COUNT(*) as Count FROM schedules;
