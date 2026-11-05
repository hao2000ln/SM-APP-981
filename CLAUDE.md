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
- Bản MỚI hơn 9.81 (9.82, 10.x...): chỉ coi là bản đích khi tôi nói rõ.
  Khi đó đối chiếu theo docs/release notes của đúng bản đó, không suy
  diễn từ 9.81.
- Bản đích nâng cấp: <TÔI SẼ ĐIỀN khi bắt đầu việc nâng cấp>.
- Mỗi kết luận về hành vi của SM phải ghi áp dụng cho phiên bản nào.

# Cấu trúc thư mục
- Document/pdf/         : PDF gốc docs 9.81. CHỈ ĐỌC. Bạn KHÔNG tự mở
  bằng công cụ Read; chỉ script chuyển đổi mới đọc thư mục này.
- Document/md/          : docs đã chuyển sang markdown. Chỉ ghi khi tôi
  yêu cầu chuyển đổi docs (Giai đoạn 1 hoặc chuyển thêm PDF về sau, kể
  cả cập nhật INDEX.md); còn lại coi như chỉ đọc. Tra INDEX.md trước.
- tools/                : script công cụ do bạn viết (chuyển PDF, diff,
  quét/lập chỉ mục...), không phải code SM. Được ghi và commit vào git.
- ScriptLibrary/BASELINE_9.81/ : bản ScriptLibrary CHUẨN của 9.81 (chưa
  tùy biến). CHỈ ĐỌC. Là thước đo "thành phần gốc của hãng".
- ScriptLibrary/APP_9.81_10.0.62.29/ : export từ tầng app đang chạy 9.81
  (10.0.62.29 là IP máy chủ tầng app). CHỈ ĐỌC. Là hệ thống thực tế.
- Custom/               : nơi duy nhất để đặt code mới/bản sao do bạn viết
  - Custom/new/         : script, hàm mới (bắt buộc prefix ESD_)
  - Custom/modified/    : bản sao của script gốc có chỉnh sửa, kèm header
    ghi file gốc, lý do, nội dung thay đổi
- MySyntax/verified/    : cú pháp tôi đã xác nhận, dùng làm mẫu
- MySyntax/pending/     : chưa xác nhận, KHÔNG dùng làm mẫu
  - system_lang/        : cú pháp ngôn ngữ hệ thống SM của tôi
  - Utils/              : hàm tiện ích tôi tự viết
- docs/                 : tài liệu do bạn sinh ra
  - ScriptLibrary_INDEX.md : chỉ mục ScriptLibrary, đọc trước khi mở file
  - DIFF_BASELINE.md       : kết quả diff BASELINE_9.81 vs APP_9.81 (mọi
    chỗ khác biệt = tùy biến của tôi, trừ khác biệt do khác build/patch)
  - ESD_INVENTORY.md       : danh sách mọi thứ mang prefix ESD_
  - CONVENTIONS.md         : quy ước rút ra từ BASELINE_9.81 (ưu tiên)
    và docs 9.81, không lấy code APP làm quy ước
  - CHANGELOG.md           : mọi thay đổi
  - PLAN.md                : kế hoạch làm việc theo giai đoạn (đọc khi bắt
    đầu dự án hoặc khi tôi hỏi về hướng làm; không nạp mặc định)

# Phạm vi dữ liệu hiện có (giới hạn phải ghi rõ trong docs)
- Hiện chỉ có export ScriptLibrary (baseline và bản đang chạy).
- Các phần tùy biến khác (Format, Process, Trigger, dbdict, Display
  option, Link, wizard, ...) CHƯA được export: diff và ESD_INVENTORY
  không bao phủ chúng. Mọi file trong docs/ phải ghi rõ giới hạn này.
  Khi thông tin phụ thuộc vào phần chưa export, nói "chưa có dữ liệu",
  không suy đoán.
- Khi tôi export thêm, cập nhật mục này và thư mục tương ứng.

# Quyền ghi/đọc (tóm tắt, để không mâu thuẫn)
- KHÔNG được sửa: ScriptLibrary/ (cả hai thư mục con), Document/pdf/.
  Không tự mở Document/pdf/.
- Được ghi: Document/md/ (chỉ khi tôi yêu cầu chuyển đổi docs), docs/,
  Custom/, tools/.
- MySyntax/: chỉ di chuyển pending → verified khi tôi đồng ý.

# Prefix ESD_ và baseline
- ESD_ là quy ước riêng của tôi, dùng để phân biệt mọi thứ tôi tự tạo
  với thành phần có sẵn của hệ thống/hãng.
- Thấy ESD_ → tùy biến của tôi. Không có ESD_ → thành phần gốc của
  hệ thống: không sửa, chỉ gọi/kế thừa.
- Mọi thứ mới (script, hàm, biến toàn cục, format, process...) phải có
  prefix ESD_.
- Tùy biến được xác định CHÍNH XÁC bằng diff giữa BASELINE_9.81 và
  APP_9.81_10.0.62.29, không chỉ dựa vào prefix. Chỗ khác biệt mà không
  có ESD_ = sửa trực tiếp thành phần gốc: báo cho tôi.
- Ưu tiên tạo script ESD_ mới gọi lại script gốc thay vì sửa script gốc.
  Chỉ tạo bản sao ở Custom/modified/ khi bắt buộc, và hỏi tôi trước.

# Thứ tự tin cậy khi viết hoặc giải thích code SM
1. BASELINE_9.81 và phần ScriptLibrary gốc không đổi: cách hãng viết
   ở 9.81.
2. Document/md/ (docs chính thức).
3. MySyntax/verified/ (tôi đã xác nhận).
4. Code đã khác baseline hoặc mang ESD_ trong APP_9.81: là code đang
   chạy thật nhưng chưa qua quy trình xác nhận. Dùng để HIỂU hệ thống,
   KHÔNG dùng làm mẫu chuẩn cho code mới cho đến khi tôi xác nhận.
5. Kiến thức có sẵn của bạn: chỉ bổ sung, phải nói rõ khi dựa vào đây.
Khi các nguồn mâu thuẫn, nêu rõ mâu thuẫn và hỏi tôi, đừng tự chọn.

# Quy tắc viết script
- Trước khi viết: tìm ví dụ tương tự trong BASELINE_9.81 và
  MySyntax/verified/, bám theo cách đặt tên và cấu trúc đó.
- Không giả định tính năng JavaScript hiện đại; chỉ dùng cú pháp đã
  thấy trong BASELINE_9.81, docs 9.81 hoặc MySyntax/verified/. Cú pháp
  chỉ xuất hiện trong APP_9.81 (code đang chạy) thì chưa coi là chuẩn:
  nêu rõ và hỏi tôi.
- Không bịa tên hàm, bảng, field, thư viện. Không chắc thì nói
  "chưa xác nhận" và chỉ ra file cần kiểm tra.
- Mọi kết luận về hệ thống phải dẫn nguồn (đường dẫn file, dòng).

# Quy trình xác nhận MySyntax
- File trong pending/ chỉ dùng để phân tích, không dùng làm mẫu.
- Khi tôi yêu cầu kiểm tra: đối chiếu với docs và BASELINE_9.81,
  báo cáo đúng/sai/chưa chắc kèm nguồn.
- Chỉ chuyển sang verified/ khi tôi đồng ý rõ ràng. Không tự chuyển.

# An toàn khi sửa
- Trước khi sửa: nêu kế hoạch, liệt kê file bị ảnh hưởng (dùng
  ScriptLibrary_INDEX.md để tìm script nào gọi script đó), chờ tôi
  đồng ý.
- Chỉ làm việc trên file export, không thao tác môi trường PROD.
- Mọi thay đổi ghi vào docs/CHANGELOG.md, và cập nhật ESD_INVENTORY.md
  nếu có thay đổi liên quan ESD_.

# Script trong tools/
- Chỉ được ghi vào docs/ hoặc Document/md/ (và thư mục tạm của tools/).
  Không bao giờ ghi/xóa/di chuyển file trong ScriptLibrary/ hay
  Document/pdf/, vì quy tắc chặn trong settings không chặn được lệnh
  shell. Script diff và script quét chỉ ĐỌC ScriptLibrary/.
- Chạy script nào cũng phải ghi rõ nó đọc từ đâu và ghi ra đâu.

# Tiết kiệm ngữ cảnh
- Tra INDEX.md / ScriptLibrary_INDEX.md trước, chỉ mở đúng file cần.
- Dùng grep và diff thay vì đọc cả file lớn.
- Việc lặp lại: viết script rồi chạy, không làm thủ công.