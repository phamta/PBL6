export enum UserRole {
  // 1. Admin CNTT - Quản lý tài khoản & phân quyền, cấu hình hệ thống
  ADMIN = 'admin',
  
  // 2. Người dùng cơ sở (Cán bộ Khoa/Phòng/Viện) - Nộp hồ sơ, theo dõi trạng thái
  USER = 'user',
  
  // 3. Sinh viên/Học viên quốc tế - Đăng ký gia hạn visa, upload hồ sơ
  STUDENT = 'student',
  
  // 4. Phòng HTQT / KHCN&ĐN (chuyên viên) - Tiếp nhận, kiểm tra hồ sơ
  SPECIALIST = 'specialist',
  
  // 5. Lãnh đạo Phòng HTQT/KHCN - Phê duyệt chính thức
  MANAGER = 'manager',
  
  // 6. Người dùng tra cứu (Viewer) - Chỉ xem dữ liệu công khai
  VIEWER = 'viewer',
  
  // 7. Hệ thống thông báo (System Bot) - Gửi email, thông báo
  SYSTEM = 'system',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}
