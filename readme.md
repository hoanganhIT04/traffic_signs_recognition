
🚦 traffic-signs-recognition (MobileNetV2)
💡 Giới thiệu

Dự án này tập trung vào việc nhận diện và phân loại biển báo giao thông bằng mô hình học sâu Convolutional Neural Network (CNN).
Để tối ưu hiệu năng và giảm kích thước mô hình cho ứng dụng thực tế, dự án sử dụng kiến trúc MobileNetV2 – một mô hình CNN nhẹ nhưng vẫn đạt độ chính xác cao, phù hợp cho thiết bị di động hoặc hệ thống nhúng.

🎯 Mục tiêu chính

Xây dựng mô hình phân loại biển báo giao thông nhanh – nhẹ – chính xác.

Tối ưu cho triển khai vào hệ thống hỗ trợ lái, IoT, camera giao thông hoặc ứng dụng mobile.

📂 Dataset

Dataset được lưu trữ trên Google Drive để dễ dàng tải về:

👉 Link tải Dataset:
https://drive.google.com/file/d/1ZuxnxBbECAU9_oETvfBv0zxOwqOirmIB/view?usp=drive_link

Hướng dẫn sử dụng Dataset

Truy cập link trên và tải dataset.

Giải nén toàn bộ.

Đặt vào thư mục của project theo cấu trúc:

/data
   /train
   /test
   /valid

⚙️ Cài đặt môi trường (Installation)

Dự án yêu cầu Python 3.x và các thư viện sau:

Thư viện	Phiên bản
tensorflow	2.15.0
numpy	1.26.4
scikit-learn	1.7.2
opencv-python	4.8.1.78
Pillow	12.0.0
matplotlib	3.10.7

Cài đặt nhanh toàn bộ dependencies:

pip install -r requirements.txt

🛠️ Chạy ứng dụng (Running the Application)
Bước 1 — Khởi động API phân loại (Backend)

Chạy file:

python app.py


API sẽ khởi động tại:

http://127.0.0.1:5000

Bước 2 — Khởi chạy giao diện (Frontend)

Mở file giao diện:

index.html


Khuyến nghị:
Sử dụng Live Server (VS Code) hoặc một local web server để đảm bảo giao diện gọi được API backend.