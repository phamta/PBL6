# Flutter Mobile App

## Giới thiệu

Đây là dự án ứng dụng di động Flutter hỗ trợ nhiều vai trò người dùng (sinh viên, nhân viên, khách, v.v.), sử dụng Bloc cho quản lý trạng thái, tích hợp API xác thực và điều hướng động dựa trên vai trò.

## Tính năng chính

- Đăng nhập với xác thực API
- Điều hướng động theo vai trò (sinh viên, nhân viên, khách...)
- Hiển thị thông tin người dùng sau đăng nhập
- Giao diện hiện đại, dễ tùy biến
- Quản lý trạng thái với Bloc pattern

## Cấu trúc thư mục

```
lib/
	main.dart                  # Điểm khởi động ứng dụng
	src/
		blocs/                   # Bloc quản lý trạng thái
			login/                 # Bloc đăng nhập
		models/                  # Định nghĩa model (UserModel...)
		repositories/            # Giao tiếp API, xử lý dữ liệu
		ui/
			screens/               # Các màn hình giao diện
				homesv_page.dart     # Trang chủ sinh viên
				staff/homestaff_page.dart # Trang chủ nhân viên
				homeguest_page.dart  # Trang khách
				login_page.dart      # Màn hình đăng nhập
				visa_manage_page.dart# Quản lý visa
			styles/                # Định nghĩa style
			widgets/               # Widget dùng chung
		valisators/              # Hàm kiểm tra dữ liệu
```

## Hướng dẫn cài đặt & chạy

1. **Clone dự án:**
   ```sh
   git clone https://github.com/phamta/PBL6.git
   cd flutter_mobile
   ```
2. **Cài đặt dependencies:**
   ```sh
   flutter pub get
   ```
3. **Chạy ứng dụng:**
   ```sh
   flutter run
   ```

## Team

Developer: Nhóm PBL6
Institution: Trường ĐH Bách Khoa Đà Nẵng
Contact: admin@htqt.edu.vn

## License

MIT License
