-- create database `school-bus`;

-- create table roles
create table `roles` (
    id int auto_increment,
    name enum('ADMIN', 'DRIVER', 'PARENT') not null,
    
    primary key(id)
);

insert into `roles` (name) values 
('ADMIN'),
('DRIVER'),
('PARENT');

-- create tables users
create table `users` (
    id int auto_increment,
    username varchar(255) unique,
    password varchar(255),
    status enum('ACTIVE', 'INACTIVE') default 'ACTIVE',
    role_id int not null,
    
    primary key(id),
    foreign key(role_id) references roles(id)
);

insert into `users` (username, password, status, role_id) values
('admin01', '123456', 'ACTIVE', 1),

('driver01', '123456', 'ACTIVE', 2),
('driver02', '123456', 'ACTIVE', 2),

('parent01', '123456', 'ACTIVE', 3),
('parent02', '123456', 'ACTIVE', 3),
('parent03', '123456', 'ACTIVE', 3);


-- create table drivers
create table `drivers` (
  id int auto_increment,
  avatar varchar(255),
  full_name varchar(255),
  birth_date date,
  gender enum('FEMALE', 'MALE') default null,
  phone varchar(10),
  email varchar(255),
  address varchar(255),
  status enum('ACTIVE', 'INACTIVE') default 'ACTIVE',
  user_id int not null,
  
  primary key(id),
  foreign key(user_id) references users(id)
);

insert into `drivers` (avatar, full_name, birth_date, gender, phone, email, address, status, user_id) values
('avatar1.png', 'Tai Xe Dep Trai', '1985-06-15', 'MALE', '0912345678', 'driver01@gmail.com', 'Hanoi, Vietnam', 'ACTIVE', 2),
('avatar2.png', 'Tai Xe Ngau Loi', '1985-06-15', 'MALE', '0912345679', 'driver02@gmail.com', 'Hanoi, Vietnam', 'ACTIVE', 3);


-- create table parents
create table `parents` (
  id int auto_increment,
  avatar varchar(255),
  full_name varchar(255),
  phone varchar(10),
  email varchar(255),
  address varchar(255),
  status enum('ACTIVE', 'INACTIVE') default 'ACTIVE',
  user_id int not null,
  
  primary key(id),
  foreign key(user_id) references users(id)
);

insert into `parents` (avatar, full_name, phone, email, address, status, user_id) values
('avatar_parent1.png', 'Phu Huynh Dep Gai', '0987654321', 'parent01@gmail.com', 'Ho Chi Minh City, Vietnam', 'ACTIVE', 4),
('avatar_parent2.png', 'Phu Huynh Dep Trai', '0987654322', 'parent02@gmail.com', 'Ho Chi Minh City, Vietnam', 'ACTIVE', 5),
('avatar_parent3.png', 'Phu Huynh Ngau Loi', '0987654323', 'parent03@gmail.com', 'Ho Chi Minh City, Vietnam', 'ACTIVE', 6);


-- create table classes
create table `classes` (
  id int auto_increment,
  name varchar(255),
  
  primary key(id)
);

insert into `classes` (name) values
('Class 1A'),
('Class 1B'),
('Class 2A'),
('Class 2B');

-- create table students
create table `students` (
  id int auto_increment,
  avatar varchar(255),
  full_name varchar(255),
  birth_date date,
  gender enum('FEMALE', 'MALE') default null,
  status enum('ACTIVE', 'INACTIVE') default 'ACTIVE',
  parent_id int not null,
  class_id int not null,
  
  primary key(id),
  foreign key(parent_id) references parents(id),
  foreign key(class_id) references classes(id)
);

insert into `students` (avatar, full_name, birth_date, gender, status, parent_id, class_id) values
('student_avatar1.png', 'Hoc Sinh Thanh Quy', '2005-03-10', 'MALE', 'ACTIVE', 1, 1),
('student_avatar2.png', 'Hoc Sinh Tien Luan', '2005-01-15', 'MALE', 'ACTIVE', 1, 2),
('student_avatar3.png', 'Hoc Sinh Nam Duong', '2005-08-21', 'MALE', 'ACTIVE', 2, 2),
('student_avatar4.png', 'Hoc Sinh Minh Duc', '2005-08-25', 'MALE', 'ACTIVE', 3, 3),
('student_avatar5.png', 'Hoc Sinh Nhi', '2005-03-25', 'FEMALE', 'ACTIVE', 3, 4),
('student_avatar6.png', 'Hoc Sinh Kim Ngan', '2005-04-08', 'FEMALE', 'ACTIVE', 3, 4);

select student.avatar, student.full_name, student.birth_date, student.gender, student.status, parent.full_name as 'parent_name', class.name as 'class_name'
from students student
join parents parent on student.parent_id = parent.id
join classes class on student.class_id = class.id;