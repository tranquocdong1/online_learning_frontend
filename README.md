🌐 HỆ THỐNG HỌC TẬP TRỰC TUYẾN
Online Learning Platform
📌 Tóm Tắt Dự Án (Project Overview)

Hệ thống học tập trực tuyến (Online Learning Platform) được xây dựng nhằm cung cấp một môi trường E-Learning hiện đại và hiệu quả, cho phép người dùng:

Khám phá khóa học

Đăng ký và tham gia học tập

Theo dõi tiến độ học tập theo từng bài học

Hệ thống được quản lý tập trung bởi Admin, đảm bảo chất lượng nội dung và quản lý người dùng chặt chẽ.

✨ Phạm Vi Chức Năng (Scope & Features)

Dự án được chia thành hai phân hệ chính:

🔐 Admin (Quản trị viên)

👩‍🎓 User (Người dùng)

🔐 1. Chức Năng Cho Admin (Quản Trị Viên)
1.1 Đăng Nhập Quản Trị

Giao diện đăng nhập riêng biệt cho Admin

Xác thực bằng username/password

Áp dụng Session Timeout để tăng cường bảo mật

1.2 Quản Lý Người Dùng

Xem danh sách học viên

Khoá / Mở khoá tài khoản

Reset mật khẩu

Xoá tài khoản người dùng

1.3 Quản Lý Danh Mục (Category)

Tạo / Sửa / Xoá danh mục môn học

Danh mục được hiển thị cho người dùng lọc khóa học

1.4 Quản Lý Khoá Học

Tạo / Sửa / Xoá khóa học

Mỗi khóa học bao gồm:

Tên môn học

Mô tả ngắn

Ảnh đại diện

Danh mục

Trạng thái (Hoạt động / Ẩn)

1.5 Quản Lý Nội Dung Khoá Học

Xây dựng cấu trúc học tập phân cấp:

Course
 └── Chapter
      └── Video Lesson

👩‍🎓 2. Chức Năng Cho Người Dùng (User)
2.1 Xác Thực Tài Khoản

Đăng ký

Đăng nhập

Quên mật khẩu (qua Email)

Đăng xuất

2.2 Quản Lý Thông Tin Cá Nhân

Xem thông tin cá nhân

Cập nhật hồ sơ

Thay đổi mật khẩu

2.3 Khám Phá Khoá Học

Hiển thị danh sách khóa học

Lọc theo danh mục

Tìm kiếm theo từ khoá

2.4 Xem & Học Khoá Học

Giao diện phòng học tích hợp video bài giảng

Hiển thị danh sách chương và bài học

Theo dõi trạng thái:

✅ Đã học

⏳ Chưa học

2.5 Tương Tác

Đánh giá sao (Rating) cho bài học

Bình luận (Comment) dưới mỗi bài học

🛠️ Công Nghệ Sử Dụng (Tech Stack)
Front-end

ReactJS / Next.js

Xây dựng giao diện SPA / SSR

Back-end

Node.js (Express) / Django

RESTful API cho Admin & User

Database

PostgreSQL / MySQL

Lưu trữ dữ liệu người dùng, khóa học và tiến độ học

Media / Storage

AWS S3 / Cloudinary

Lưu trữ video bài học và ảnh đại diện

Authentication

JWT (JSON Web Token)

Bảo mật xác thực và phiên làm việc

🚀 Hướng Dẫn Cài Đặt & Vận Hành (Getting Started)
📋 Điều Kiện Tiên Quyết

Node.js v16+

npm hoặc yarn

PostgreSQL / MySQL đang hoạt động

⚙️ Thiết Lập Dự Án
1. Clone Repository
git clone <repository-url>
cd <project-folder>

2. Cài Đặt Dependencies
# Front-end
cd client
npm install

# Back-end
cd ../server
npm install

3. Cấu Hình Biến Môi Trường (.env)
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE_CONFIG=your_smtp_config

▶️ Chạy Ứng Dụng
Chạy Back-end
cd server
npm run dev


Server chạy tại:

http://localhost:5000

Chạy Front-end
cd client
npm run dev


Client chạy tại:

http://localhost:3000

🔗 Liên Kết Trực Tiếp (Live Links)

🌍 Demo Website (User): [Live Demo]

🛠️ Admin Panel: [Admin Demo]

🤝 Tác Giả & Đóng Góp (Author & Contribution)

Tác giả: [Tên của bạn]

GitHub: @username

Email: your-email@example.com
