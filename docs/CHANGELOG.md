
## 2026-11-05 - Giai doan 1: chuyen docs 9.81 sang markdown
- Them tools/pdf_extract.py, tools/pdf_to_md.py (doc Document/pdf/v981/, ghi tools/_tmp/ va Document/md/).
- Sinh Document/md/v981/{Develop,Integrate,Upgrade,Release_notes,Administer}/ (316 file md) va Document/md/INDEX.md.
- Gioi han: bang nhieu dong bi xen ke cot; chua chuyen Get_Started, Home, Install, Troubleshoot, Use.

## 2026-11-05 - Đồng bộ CLAUDE.md theo cấu trúc ScriptLibrary mới
- Bỏ prefix HPT_ khỏi quy ước: chỉ còn ESD_ là prefix tùy biến.
- Thay mọi tham chiếu `APP_9.81_10.0.62.29` bằng `BASELINE_9.81/` + `Personal/`.
- Ghi rõ giới hạn: BASELINE_9.81 lấy từ hệ thống đang chạy, không phải 9.81
  sạch; chỗ sửa trực tiếp script gốc không phát hiện được.
- Personal/: chỉ đọc, mức tin cậy 4.
- Chưa đổi tên 33 file HPT_ trong ScriptLibrary/Personal/ (chờ quyết định).

## 2026-11-05 - Chốt prefix: ESD_ và HPT_ dùng song song
- CLAUDE.md: cả ESD_ và HPT_ là tùy biến của người dùng; không có hai prefix
  này = thành phần gốc của hệ thống. Không đổi tên file HPT_ nào.

## 2026-11-05 - Giai đoạn 2a: DIFF_BASELINE
- tools/diff_baseline.py viết lại: đọc ScriptLibrary/BASELINE_9.81/ + Personal/
  (+ --clean <dir> khi có export 9.81 sạch), chỉ ghi docs/DIFF_BASELINE.md.
- Sinh docs/DIFF_BASELINE.md: 1316 script hệ thống, 47 tùy biến (14 ESD_, 33 HPT_).
- docs/PLAN.md: cập nhật 2a/2c theo cấu trúc mới và prefix ESD_/HPT_.
