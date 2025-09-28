-- Script để tạo database và user cho PBL6 project
-- Chạy script này với quyền admin PostgreSQL

-- Tạo database
CREATE DATABASE ql_htqt
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Cấp quyền cho user postgres
GRANT ALL PRIVILEGES ON DATABASE ql_htqt TO postgres;

-- Kết nối đến database vừa tạo
\c ql_htqt;

-- Tạo extension uuid-ossp nếu chưa có
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hiển thị thông báo thành công
SELECT 'Database ql_htqt created successfully!' as message;