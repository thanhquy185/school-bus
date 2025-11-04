-- This script will create one account with role 'PARENT' and one class,
-- then create one student linked to that parent and class.

-- Sample data for accounts (for parents)
INSERT INTO accounts (username, password, role, status) VALUES
('parent001', '$2b$10$example_hashed_password', 'PARENT', 'ACTIVE'),
('parent002', '$2b$10$example_hashed_password', 'PARENT', 'ACTIVE'),
('parent003', '$2b$10$example_hashed_password', 'PARENT', 'ACTIVE'),
('parent004', '$2b$10$example_hashed_password', 'PARENT', 'ACTIVE'),
('parent005', '$2b$10$example_hashed_password', 'PARENT', 'ACTIVE'),
('parent006', '$2b$10$example_hashed_password', 'PARENT', 'ACTIVE'),
('parent007', '$2b$10$example_hashed_password', 'PARENT', 'ACTIVE'),
('parent008', '$2b$10$example_hashed_password', 'PARENT', 'ACTIVE'),
('parent009', '$2b$10$example_hashed_password', 'PARENT', 'ACTIVE'),
('parent010', '$2b$10$example_hashed_password', 'PARENT', 'ACTIVE');

-- Sample data for parents (assume account_id from 1 to 10)
INSERT INTO parents (avatar, full_name, phone, email, address, account_id) VALUES
('https://example.com/avatar1.jpg', 'Nguyễn Văn Minh', '0123456781', 'parent001@gmail.com', 'Quận 1, TP.HCM', 1),
('https://example.com/avatar2.jpg', 'Trần Thị Hoa', '0123456782', 'parent002@gmail.com', 'Quận 2, TP.HCM', 2),
('https://example.com/avatar3.jpg', 'Lê Văn An', '0123456783', 'parent003@gmail.com', 'Quận 3, TP.HCM', 3),
('https://example.com/avatar4.jpg', 'Phạm Thị Bích', '0123456784', 'parent004@gmail.com', 'Quận 4, TP.HCM', 4),
('https://example.com/avatar5.jpg', 'Võ Minh Tuấn', '0123456785', 'parent005@gmail.com', 'Quận 5, TP.HCM', 5),
('https://example.com/avatar6.jpg', 'Đỗ Thị Hạnh', '0123456786', 'parent006@gmail.com', 'Quận 6, TP.HCM', 6),
('https://example.com/avatar7.jpg', 'Ngô Văn Bình', '0123456787', 'parent007@gmail.com', 'Quận 7, TP.HCM', 7),
('https://example.com/avatar8.jpg', 'Bùi Thị Lan', '0123456788', 'parent008@gmail.com', 'Quận 8, TP.HCM', 8),
('https://example.com/avatar9.jpg', 'Hoàng Văn Cường', '0123456789', 'parent009@gmail.com', 'Quận 9, TP.HCM', 9),
('https://example.com/avatar10.jpg', 'Phan Thị Mai', '0123456790', 'parent010@gmail.com', 'Quận 10, TP.HCM', 10);

-- Sample data for classes
INSERT INTO classes (name) VALUES
('Lớp 6A1'),
('Lớp 6A2'),
('Lớp 7A1'),
('Lớp 7A2'),
('Lớp 8A1'),
('Lớp 8A2'),
('Lớp 9A1'),
('Lớp 9A2'),
('Lớp 10A1'),
('Lớp 10A2');

-- Sample data for pickups
INSERT INTO pickups (name, category, lat, lng, status) VALUES
('Trường THCS Nguyễn Du', 'SCHOOL', 10.7769, 106.7009, 'ACTIVE'),
('Trường THCS Lê Lợi', 'SCHOOL', 10.7760, 106.7010, 'ACTIVE'),
('Điểm đón Công viên 23/9', 'PICKUP', 10.7650, 106.6820, 'ACTIVE'),
('Điểm đón Nhà Văn Hóa', 'PICKUP', 10.7800, 106.6900, 'ACTIVE'),
('Điểm đón Bến Thành', 'PICKUP', 10.7720, 106.6980, 'ACTIVE'),
('Điểm đón Chợ Lớn', 'PICKUP', 10.7540, 106.6350, 'ACTIVE'),
('Điểm đón Công viên Gia Định', 'PICKUP', 10.8160, 106.6780, 'ACTIVE'),
('Điểm đón Sân bay Tân Sơn Nhất', 'PICKUP', 10.8180, 106.6518, 'ACTIVE'),
('Trường THCS Trần Hưng Đạo', 'SCHOOL', 10.7750, 106.6980, 'ACTIVE'),
('Điểm đón Nhà thiếu nhi', 'PICKUP', 10.7805, 106.7005, 'ACTIVE');

