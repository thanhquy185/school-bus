-- ====================================================
-- TẠO 3 TUYẾN ĐƯỜNG VỚI CÁC TRẠM
-- ====================================================

-- ----------------------------------------------------
-- 1. TẠO CÁC TRẠM DỪNG (PICKUPS)
-- ----------------------------------------------------

-- Trạm cho tuyến 1
INSERT INTO pickups (name, category, lat, lng, status) VALUES
('Trạm A - Cổng trường', 'SCHOOL', 10.8231, 106.6297, 'ACTIVE'),
('Trạm A1 - Bến xe miền Đông', 'PICKUP', 10.8142, 106.7096, 'ACTIVE'),
('Trạm A2 - Công viên Lê Văn Tám', 'PICKUP', 10.7885, 106.6971, 'ACTIVE'),
('Trạm A3 - Chợ Bến Thành', 'PICKUP', 10.7726, 106.6980, 'ACTIVE');

-- Trạm cho tuyến 2
INSERT INTO pickups (name, category, lat, lng, status) VALUES
('Trạm B - Trường học', 'SCHOOL', 10.7769, 106.7009, 'ACTIVE'),
('Trạm B1 - Khu dân cư Phú Mỹ Hưng', 'PICKUP', 10.7295, 106.7217, 'ACTIVE'),
('Trạm B2 - Siêu thị BigC', 'PICKUP', 10.7380, 106.7100, 'ACTIVE'),
('Trạm B3 - Công viên Gia Định', 'PICKUP', 10.7960, 106.6788, 'ACTIVE');

-- Trạm cho tuyến 3
INSERT INTO pickups (name, category, lat, lng, status) VALUES
('Trạm C - Cổng trường THCS', 'SCHOOL', 10.8020, 106.7150, 'ACTIVE'),
('Trạm C1 - Bệnh viện Chợ Rẫy', 'PICKUP', 10.7556, 106.6657, 'ACTIVE'),
('Trạm C2 - Công viên Tao Đàn', 'PICKUP', 10.7788, 106.6917, 'ACTIVE'),
('Trạm C3 - Trung tâm Q1', 'PICKUP', 10.7756, 106.7004, 'ACTIVE');

-- ----------------------------------------------------
-- 2. TẠO 3 TUYẾN ĐƯỜNG (ROUTES)
-- ----------------------------------------------------

INSERT INTO routes (name, start_pickup, end_pickup, total_distance, total_time, status) VALUES
('Tuyến 1 - Miền Đông - Trường học', 'Trạm A1 - Bến xe miền Đông', 'Trạm A - Cổng trường', 15000, 45, 'ACTIVE'),
('Tuyến 2 - Phú Mỹ Hưng - Trường học', 'Trạm B1 - Khu dân cư Phú Mỹ Hưng', 'Trạm B - Trường học', 12000, 35, 'ACTIVE'),
('Tuyến 3 - Chợ Rẫy - Trường THCS', 'Trạm C1 - Bệnh viện Chợ Rẫy', 'Trạm C - Cổng trường THCS', 10000, 30, 'ACTIVE');

-- ----------------------------------------------------
-- 3. LIÊN KẾT TRẠM VỚI TUYẾN ĐƯỜNG (ROUTE_PICKUPS)
-- ----------------------------------------------------

-- Tuyến 1: 4 trạm (thứ tự: A1 -> A2 -> A3 -> A)
-- Giả sử route_id = 1, pickup_id tương ứng với thứ tự insert
INSERT INTO route_pickups (route_id, pickup_id, `order`) VALUES
(1, 2, 1),  -- Trạm A1 - Bến xe miền Đông (điểm bắt đầu)
(1, 3, 2),  -- Trạm A2 - Công viên Lê Văn Tám
(1, 4, 3),  -- Trạm A3 - Chợ Bến Thành
(1, 1, 4);  -- Trạm A - Cổng trường (điểm kết thúc)

-- Tuyến 2: 4 trạm (thứ tự: B1 -> B2 -> B3 -> B)
INSERT INTO route_pickups (route_id, pickup_id, `order`) VALUES
(2, 6, 1),  -- Trạm B1 - Khu dân cư Phú Mỹ Hưng (điểm bắt đầu)
(2, 7, 2),  -- Trạm B2 - Siêu thị BigC
(2, 8, 3),  -- Trạm B3 - Công viên Gia Định
(2, 5, 4);  -- Trạm B - Trường học (điểm kết thúc)

-- Tuyến 3: 4 trạm (thứ tự: C1 -> C2 -> C3 -> C)
INSERT INTO route_pickups (route_id, pickup_id, `order`) VALUES
(3, 10, 1), -- Trạm C1 - Bệnh viện Chợ Rẫy (điểm bắt đầu)
(3, 11, 2), -- Trạm C2 - Công viên Tao Đàn
(3, 12, 3), -- Trạm C3 - Trung tâm Q1
(3, 9, 4);  -- Trạm C - Cổng trường THCS (điểm kết thúc)

-- ====================================================
-- HOÀN TẤT - Đã tạo 3 tuyến đường với tổng 12 trạm
-- ====================================================

-- KẾT QUẢ:
-- - Tuyến 1: 4 trạm (15km, 45 phút)
-- - Tuyến 2: 4 trạm (12km, 35 phút)
-- - Tuyến 3: 4 trạm (10km, 30 phút)

-- ----------------------------------------------------
-- 4. TẠO LỚP HỌC (CLASS)
-- ----------------------------------------------------

INSERT INTO classes (name) VALUES
('Lớp 10A');

-- ----------------------------------------------------
-- 5. TẠO XE BUS (BUSES)
-- ----------------------------------------------------

INSERT INTO buses (license_plate, capacity, status) VALUES
('51A-12345', 45, 'ACTIVE');
