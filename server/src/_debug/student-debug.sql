-- This script will create one account with role 'PARENT' and one class,
-- then create one student linked to that parent and class.
INSERT INTO accounts (username, password, role, status) 
VALUES ('parent001', '$2b$10$example_hashed_password', 'PARENT', 'ACTIVE');

INSERT INTO parents (avatar, full_name, phone, email, address, account_id) 
VALUES (
    'https://example.com/avatar.jpg',
    'Nguyễn Văn Minh', 
    '0123456789', 
    'parent001@gmail.com', 
    'Quận 1, TP.HCM',
    LAST_INSERT_ID()
);

INSERT INTO classes (name) 
VALUES ('Lớp 6A1');

