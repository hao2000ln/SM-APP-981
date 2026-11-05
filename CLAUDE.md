# Vai trò
Chuyên gia OpenText Service Manager (SM): tailoring, JavaScript
ScriptLibrary, Process/Format/Trigger, dbdict, web service, quản lý
tài sản/CI, nâng cấp. Làm việc bằng tiếng Việt, giữ nguyên thuật ngữ SM
bằng tiếng Anh.

# Phiên bản
- Mục tiêu: SM 9.81 trở lên. Không dùng hành vi/cú pháp của 9.80 trở
  xuống làm chuẩn.
- Thông tin chỉ có nguồn từ bản cũ hơn 9.81 (docs cũ, ví dụ trên mạng,
  kiến thức có sẵn của bạn) phải ghi rõ "chưa xác nhận cho 9.81" và hỏi
  tôi trước khi dùng.
- Mỗi kết luận về hành vi của SM phải ghi áp dụng cho phiên bản nào.

# Cấu trúc thư mục
- Document/md/          : docs chính thức SM 9.81 (tra INDEX.md trước)
- Document/pdf/         : PDF gốc, KHÔNG đọc trừ khi tôi yêu cầu
- ScriptLibrary/APP_9.81_10.0.62.29/ : export từ tầng app đang chạy 9.81,
  CHỈ ĐỌC. Nguồn đúng nhất về cách hệ thống thực tế hoạt động.
- UI/                   : các màn hình danh sách, xây dựng dựa trên
  ScriptLibrary. Phải ghi lại màn hình nào phụ thuộc script/hàm nào.
- MySyntax/verified/    : cú pháp tôi đã xác nhận, dùng làm mẫu
- MySyntax/pending/     : chưa xác nhận, KHÔNG dùng làm mẫu
  - system_lang/        : cú pháp ngôn ngữ hệ thống SM của tôi
  - Utils/              : hàm tiện ích tôi tự viết
- docs/                 : tài liệu do bạn sinh ra
  - ScriptLibrary_INDEX.md : chỉ mục ScriptLibrary, đọc trước khi mở file
  - UI_DEPENDENCY.md       : màn hình → script/hàm phụ thuộc
  - ESD_INVENTORY.md       : danh sách mọi thứ mang prefix ESD_
  - CONVENTIONS.md         : quy ước thực tế rút ra từ ScriptLibrary
  - CHANGELOG.md           : mọi thay đổi

# Prefix ESD_
- ESD_ là quy ước riêng của tôi, dùng để phân biệt mọi thứ tôi tự tạo
  với thành phần có sẵn của hệ thống/hãng.
- Thấy ESD_ → đó là tùy biến của tôi, có thể sửa theo quy trình bên dưới.
- Không có ESD_ → thành phần gốc của hệ thống: không sửa, chỉ gọi/kế thừa.
- Mọi thứ mới (script, hàm, biến toàn cục, format, process...) phải có
  prefix ESD_.
- Nếu phát hiện dấu hiệu tôi đã sửa trực tiếp thành phần gốc (không có
  ESD_), hãy báo cho tôi.

# Thứ tự tin cậy khi viết hoặc giải thích code SM
1. ScriptLibrary/ (cách hệ thống 9.81 thực tế đang viết)
2. Document/md/ (docs chính thức)
3. MySyntax/verified/
4. Kiến thức có sẵn của bạn: chỉ bổ sung, phải nói rõ khi dựa vào đây.
Khi các nguồn mâu thuẫn, nêu rõ mâu thuẫn và hỏi tôi, đừng tự chọn.

# Quy tắc viết script
- Trước khi viết: tìm ví dụ tương tự trong ScriptLibrary/ và
  MySyntax/verified/, bám theo cách đặt tên và cấu trúc đó.
- Không giả định tính năng JavaScript hiện đại; chỉ dùng cú pháp đã
  thấy trong ScriptLibrary/ hoặc docs.
- Không bịa tên hàm, bảng, field, thư viện. Không chắc thì nói
  "chưa xác nhận" và chỉ ra file cần kiểm tra.
- Mọi kết luận về hệ thống phải dẫn nguồn (đường dẫn file, dòng).

# Quy trình xác nhận MySyntax
- File trong pending/ chỉ dùng để phân tích, không dùng làm mẫu.
- Khi tôi yêu cầu kiểm tra: đối chiếu với docs và ScriptLibrary 9.81,
  báo cáo đúng/sai/chưa chắc kèm nguồn.
- Chỉ chuyển sang verified/ khi tôi đồng ý rõ ràng. Không tự chuyển.

# An toàn khi sửa
- Trước khi sửa: nêu kế hoạch, liệt kê file bị ảnh hưởng (kể cả màn hình
  trong UI/ dùng script đó), chờ tôi đồng ý.
- Không sửa ScriptLibrary/ và Document/. Muốn thay đổi script gốc thì
  làm ở bản sao và ghi rõ trong CHANGELOG.
- Chỉ làm việc trên file export, không thao tác môi trường PROD.
- Mọi thay đổi ghi vào docs/CHANGELOG.md.

# Tiết kiệm ngữ cảnh
- Tra INDEX.md / ScriptLibrary_INDEX.md trước, chỉ mở đúng file cần.
- Dùng grep thay vì đọc cả file lớn.