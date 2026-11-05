# Kế hoạch thực hiện dự án SM 9.81

File này mô tả hướng làm việc giữa tôi và bạn (Claude Code). Đọc cùng
CLAUDE.md trước khi bắt đầu. Làm từng giai đoạn, báo kết quả, chờ tôi
duyệt rồi mới sang giai đoạn kế tiếp.

## Mục tiêu
1. Tạo tài liệu bàn giao kỹ thuật (hiện chưa có tài liệu nào) cho phần
   quản lý tài sản.
2. Phát triển/sửa script theo đúng quy ước hiện có.
3. Nắm rõ phần tùy biến (ESD_/HPT_ và mọi chỗ khác baseline) để đánh giá tác
   động khi nâng cấp.

## Nguyên tắc tiết kiệm token (bắt buộc)
- Tốn token một lần để tạo chỉ mục dạng file trong docs/, các phiên sau
  chỉ đọc chỉ mục rồi mở đúng file cần.
- Dùng grep, diff và script để tìm, rồi mới đọc phần liên quan.
- Việc lặp lại thì viết script rồi chạy, không tự đọc từng file.
- Mỗi phiên một nhiệm vụ. Cuối nhiệm vụ nhắc tôi /clear.
- Không tự mở Document/pdf/ bằng công cụ Read. Script chuyển đổi được
  đọc thư mục này.

## Giai đoạn 0: Chuẩn bị (tôi tự làm)
- Đặt tên thư mục: ScriptLibrary/BASELINE_9.81/ và
  ScriptLibrary/Personal/ (script ESD_/HPT_); sửa tên file có dấu cách.
- Tạo docs/, tools/, Custom/new/, Custom/modified/.
- git init và commit trạng thái ban đầu.
- Cấu hình .claude/settings.json (chặn Read Document/pdf/, chặn Edit
  ScriptLibrary/ và Document/pdf/).
- Báo tôi nếu chưa làm xong trước khi bắt đầu Giai đoạn 1.

## Giai đoạn 1: Chuyển docs sang markdown
Model gợi ý: Sonnet / Low.
- Kiểm tra máy có pdftotext hoặc markitdown chưa; nếu chưa, đề xuất cách
  cài và chờ tôi đồng ý.
- Viết script (đặt trong tools/) chuyển Document/pdf/ sang
  Document/md/, chia nhỏ theo chương. Ưu tiên: Develop, Integrate, Upgrade, Release_notes,
  Administer. Các file còn lại để sau; khi tôi yêu cầu chuyển thêm thì
  được ghi lại vào Document/md/ và cập nhật INDEX.md.
- Sinh Document/md/INDEX.md (đường dẫn + một câu mô tả).
- Báo file nào chuyển lỗi hoặc bảng/code bị vỡ.

## Giai đoạn 2: Khám phá một lần
Model gợi ý: Opus / High, plan mode (riêng 2a có thể Sonnet vì chủ yếu
là script). Mỗi mục là một phiên riêng.

- 2a. DIFF BASELINE (rẻ nhất, làm trước). Script tools/diff_baseline.py
  ghi docs/DIFF_BASELINE.md. Hiện tại (chưa có export 9.81 sạch):
  liệt kê BASELINE_9.81 (script SM) và Personal/ (ESD_/HPT_), kiểm tra
  prefix nằm sai thư mục, trùng tên. Chỗ sửa trực tiếp script gốc CHƯA
  phát hiện được. Khi có export 9.81 sạch: chạy với --clean <thư mục>
  để phân loại thêm mới / đã sửa / thiếu. Lưu ý: nếu bản sạch và bản
  đang chạy khác patch/build, diff sẽ lẫn khác biệt của hãng; hãy nêu
  nghi ngờ này nếu thấy nhiều khác biệt không giống code của tôi.
- 2b. docs/ScriptLibrary_INDEX.md. Tầng nông cho toàn bộ (script liệt kê
  tên file, hàm, comment đầu file); tầng sâu chỉ cho script liên quan
  quản lý tài sản/CI và các file có trong DIFF_BASELINE.md.
- 2c. docs/ESD_INVENTORY.md: từng thứ mang prefix ESD_/HPT_ (ở đâu, làm gì,
  phụ thuộc gì), đối chiếu với DIFF_BASELINE.md. Báo chỗ đã sửa gốc
  mà không có ESD_/HPT_ (cần export 9.81 sạch).
- 2d. docs/CONVENTIONS.md: quy ước và cú pháp thực tế, rút từ BASELINE
  (ưu tiên) và docs 9.81.
Giới hạn phạm vi: diff và ESD_INVENTORY chỉ bao phủ ScriptLibrary. Tùy
biến ở Format, Process, Trigger, dbdict, Display, Link... chưa được
export nên chưa có trong phân tích. Ghi rõ giới hạn này ở đầu mỗi file
trong docs/ và trong tài liệu bàn giao. Khi tôi export thêm (baseline
và bản đang chạy, ưu tiên phần liên quan tài sản/CI), mở rộng diff.
Mọi kết luận dẫn nguồn (file, dòng); chỗ chưa chắc ghi "chưa xác nhận".
Sau mỗi phiên dừng lại để tôi kiểm tra.

## Giai đoạn 3: Xác nhận cú pháp của tôi
Model gợi ý: Opus / Medium. Từng nhóm nhỏ, bắt đầu từ MySyntax/pending/Utils/.
- Đối chiếu với CONVENTIONS.md, BASELINE_9.81 và docs 9.81. Báo cáo
  đúng / sai / chưa chắc kèm nguồn, đề xuất sửa.
- Với phần không có mẫu trong baseline (ví dụ cú pháp system language
  dùng trong Process/Format/Trigger), chỉ đối chiếu với docs 9.81 và
  ghi rõ "không có mẫu baseline".
- Không tự chuyển sang verified/.

## Giai đoạn 4: Tài liệu bàn giao
Model gợi ý: Sonnet / Low–Medium.
- Đầu vào: các file trong docs/ và MySyntax/verified/.
- Viết cho đội vận hành nội bộ. Phần nghiệp vụ tôi bổ sung; thiếu
  thông tin thì hỏi, không suy đoán.

## Giai đoạn 5: Làm việc hằng ngày
Model gợi ý: Sonnet / Medium.
1. Plan mode: đọc chỉ mục liên quan trong docs/, đề xuất cách làm,
   liệt kê file bị ảnh hưởng.
2. Tôi duyệt, bạn làm từng bước nhỏ; code mới đặt trong Custom/.
3. Việc rủi ro: một lượt review riêng (Opus / Medium).
4. Cập nhật CHANGELOG.md và các chỉ mục bị ảnh hưởng.

Nâng cấp: Opus / High lập kế hoạch (đối chiếu DIFF_BASELINE.md và
ESD_INVENTORY.md với release notes bản đích: mọi chỗ khác baseline là
chỗ cần kiểm tra lại), sau đó Sonnet thực thi.

## Quy tắc chung
- Không đổi model giữa chừng một nhiệm vụ.
- Khi làm sai một kiểu lặp lại, đề xuất một dòng quy tắc để tôi thêm
  vào CLAUDE.md (giữ file đó ngắn).