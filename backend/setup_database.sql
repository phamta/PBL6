-- Tạo user pbl6_user với password pbl6_password
CREATE USER pbl6_user WITH PASSWORD 'pbl6_password';

-- Tạo database pbl6_ql_htqt
CREATE DATABASE pbl6_ql_htqt OWNER pbl6_user;

-- Cấp quyền cho user
GRANT ALL PRIVILEGES ON DATABASE pbl6_ql_htqt TO pbl6_user;

-- Kết nối đến database mới
\c pbl6_ql_htqt

-- Cấp quyền schema public cho user
GRANT ALL PRIVILEGES ON SCHEMA public TO pbl6_user;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO pbl6_user;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO pbl6_user;

GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO pbl6_user;

-- Đặt quyền mặc định cho các bảng tạo trong tương lai
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON TABLES TO pbl6_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON SEQUENCES TO pbl6_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON FUNCTIONS TO pbl6_user;

-- Hiển thị thông tin database đã tạo
\l pbl6_ql_htqt