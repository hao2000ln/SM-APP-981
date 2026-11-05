function render() {
    /* Dữ liệu mẫu khai báo trực tiếp trong hàm. Thay bằng dữ liệu nghiệp vụ khi triển khai. */
    var data = {
        metrics: [
            { label: "Cần bạn xử lý", value: 8, note: "Theo vai trò hiện tại", tone: "blue" },
            { label: "Đang theo dõi", value: 21, note: "Hồ sơ chưa kết thúc", tone: "purple" },
            { label: "Đã kết thúc", value: 13, note: "Hoàn thành hoặc đóng hợp lệ", tone: "green" },
            { label: "SLA quá hạn", value: 2, note: "Cần kiểm tra thời hạn", tone: "red" }
        ],
        tasksUrl: "#inbox",
        tasks: [
            { id: "RE-2026-0008", title: "Rà soát sự cố thiết bị tại quầy giao dịch", typeLabel: "RE", owner: "Chi nhánh Hà Nội", status: "Chờ phê duyệt", statusTone: "amber", priority: "Cao", priorityTone: "amber", due: "Còn 4 giờ", url: "#event/RE-2026-0008" },
            { id: "MA-2026-0012", title: "Cập nhật phương án khắc phục máy in", typeLabel: "MA", owner: "Đỗ Việt Nam", status: "Cần làm lại", statusTone: "red", priority: "Cao", priorityTone: "red", due: "Quá hạn 2 giờ", url: "#action/MA-2026-0012" },
            { id: "MA-2026-0015", title: "Kiểm tra bằng chứng khắc phục", typeLabel: "MA", owner: "QLRRHĐ", status: "Chờ xác nhận", statusTone: "blue", priority: "Bình thường", priorityTone: "neutral", due: "Còn 1 ngày", url: "#action/MA-2026-0015" }
        ],
        alerts: [
            { title: "2 hồ sơ quá hạn SLA", detail: "Kiểm tra thời hạn và cập nhật tiến độ xử lý.", tone: "red", url: "#sla", linkLabel: "Xem SLA" },
            { title: "1 đề nghị hủy Action", detail: "Cần người phụ trách xem xét lý do và quyết định.", tone: "amber", url: "#inbox", linkLabel: "Xem đề nghị" },
            { title: "1 hồ sơ cần bổ sung", detail: "Sau khi gửi lại, hồ sơ quay về QLRRHĐ.", tone: "blue", url: "#inbox", linkLabel: "Xem hồ sơ" }
        ],
        distribution: [
            { label: "Cần bạn xử lý", value: 8, total: 42, tone: "blue" },
            { label: "Đang chờ / theo dõi", value: 21, total: 42, tone: "amber" },
            { label: "Đã kết thúc", value: 13, total: 42, tone: "green" }
        ],
        workflow: [
            { number: "01", title: "Gửi & phê duyệt", owner: "Chi nhánh" },
            { number: "02", title: "Rà soát sự kiện", owner: "QLRRHĐ" },
            { number: "03", title: "Khắc phục", owner: "CNTT" },
            { number: "04", title: "Xác nhận kết quả", owner: "QLRRHĐ" }
        ]
    };

    function esc(value) {
        return String(value === null || value === undefined ? "" : value)
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }
    function arr(value) { return Object.prototype.toString.call(value) === "[object Array]" ? value : []; }
    function tone(value) {
        var allowed = { neutral: 1, blue: 1, green: 1, amber: 1, red: 1, purple: 1 };
        return allowed[value] ? value : "neutral";
    }
    function link(url, label, css) {
        return url ? '<a class="smp-db-link ' + (css || "") + '" href="' + esc(url) + '">' + esc(label) + '</a>' : "";
    }
    function metricCard(item) {
        return '<article class="smp-db-metric smp-db-tone-' + tone(item.tone) + '"><div class="smp-db-metric-label">' + esc(item.label) + '</div><div class="smp-db-metric-value">' + esc(item.value) + '</div><div class="smp-db-metric-note">' + esc(item.note) + '</div></article>';
    }
    function taskRow(item) {
        return '<article class="smp-db-task"><div class="smp-db-task-mark">' + esc(item.typeLabel || "CV") + '</div><div class="smp-db-task-main"><a class="smp-db-task-title" href="' + esc(item.url || "#") + '">' + esc(item.title || "Chưa có tiêu đề") + '</a><div class="smp-db-task-meta"><span>' + esc(item.id) + '</span><span>' + esc(item.owner) + '</span></div></div><div class="smp-db-task-side"><span class="smp-db-chip smp-db-tone-' + tone(item.statusTone) + '">' + esc(item.status) + '</span><span class="smp-db-priority smp-db-priority-' + tone(item.priorityTone) + '">' + esc(item.priority) + '</span><span class="smp-db-due">' + esc(item.due) + '</span></div></article>';
    }
    function alertItem(item) {
        return '<article class="smp-db-alert smp-db-alert-' + tone(item.tone) + '"><span class="smp-db-alert-dot" aria-hidden="true"></span><div class="smp-db-alert-main"><div class="smp-db-alert-title">' + esc(item.title) + '</div><div class="smp-db-alert-detail">' + esc(item.detail) + '</div>' + link(item.url, item.linkLabel || "Xem chi tiết", "smp-db-alert-link") + '</div></article>';
    }
    function barItem(item) {
        var value = parseFloat(item.value) || 0, total = parseFloat(item.total) || 0;
        var percent = total > 0 ? Math.max(0, Math.min(100, value / total * 100)) : 0;
        return '<div class="smp-db-bar-row"><div class="smp-db-bar-label"><span>' + esc(item.label) + '</span><strong>' + esc(item.value) + '<small> / ' + esc(item.total) + '</small></strong></div><div class="smp-db-bar-track"><div class="smp-db-bar-fill smp-db-tone-' + tone(item.tone) + '" style="width:' + percent + '%"></div></div></div>';
    }
    function workflowItem(item) {
        return '<div class="smp-db-step"><span class="smp-db-step-number">' + esc(item.number) + '</span><div><strong>' + esc(item.title) + '</strong><small>' + esc(item.owner) + '</small></div></div>';
    }

    var metrics = arr(data.metrics), tasks = arr(data.tasks), alerts = arr(data.alerts);
    var distribution = arr(data.distribution), workflow = arr(data.workflow);
    var metricHtml = metrics.map(metricCard).join("");
    var taskHtml = tasks.map(taskRow).join("") || '<div class="smp-db-empty">Hiện không có công việc cần xử lý.</div>';
    var alertHtml = alerts.map(alertItem).join("") || '<div class="smp-db-empty">Không có cảnh báo trong phạm vi của bạn.</div>';
    var distributionHtml = distribution.map(barItem).join("") || '<div class="smp-db-empty">Chưa có dữ liệu phân bố.</div>';
    var workflowHtml = workflow.map(workflowItem).join("");

    return [
        '<style>',
        '.smp-dashboard{--ink:#172839;--muted:#607184;--line:#e3e9ef;--blue:#245fda;color:var(--ink);font:14px/1.55 Inter,"Segoe UI",Arial,sans-serif;width:100%;box-sizing:border-box}',
        '.smp-dashboard *{box-sizing:border-box}.smp-dashboard a{color:var(--blue);text-decoration:none}.smp-dashboard a:focus-visible{outline:3px solid #7ca8ff;outline-offset:3px}',
        '.smp-db-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:22px}.smp-db-metric{padding:17px 19px;border:1px solid var(--line);border-radius:12px;background:#fff;min-width:0}.smp-db-metric-label{font-size:12px;color:var(--muted)}.smp-db-metric-value{font-size:30px;line-height:1.3;font-weight:750;margin:10px 0 5px}.smp-db-metric-note{font-size:11px;color:var(--muted)}',
        '.smp-db-tone-neutral{color:#5d6c7c}.smp-db-tone-blue{color:#245fda}.smp-db-tone-green{color:#157553}.smp-db-tone-amber{color:#925600}.smp-db-tone-red{color:#b63838}.smp-db-tone-purple{color:#7253a2}',
        '.smp-db-columns{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:20px;align-items:start}.smp-db-main-column,.smp-db-side-column{display:grid;gap:20px;min-width:0}.smp-db-panel{border:1px solid var(--line);border-radius:13px;background:#fff;overflow:hidden;min-width:0}.smp-db-panel-header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 20px 15px}.smp-db-panel-header h2{font-size:15px;margin:0}.smp-db-panel-header p{font-size:11px;color:var(--muted);margin:5px 0 0}.smp-db-panel-action{font-size:11px;white-space:nowrap}',
        '.smp-db-task-list{padding:0 20px}.smp-db-task{display:flex;align-items:center;gap:12px;padding:14px 0;border-top:1px solid #edf0f4;min-width:0}.smp-db-task:first-child{border-top:0}.smp-db-task-mark{width:34px;height:34px;display:flex;align-items:center;justify-content:center;flex:none;border-radius:9px;background:#f0f5fd;font-size:10px;font-weight:750;color:#245fda}.smp-db-task-main{flex:1;min-width:0}.smp-db-task-title{display:block;font-size:12px;line-height:1.5;font-weight:700;color:var(--ink)!important;overflow-wrap:anywhere}.smp-db-task-meta{display:flex;gap:10px;flex-wrap:wrap;color:var(--muted);font-size:10px;margin-top:5px}.smp-db-task-side{display:grid;justify-items:end;gap:5px;flex:none}.smp-db-chip{display:inline-block;border-radius:5px;padding:4px 7px;font-size:10px;font-weight:650;background:#f0f3f7}.smp-db-chip.smp-db-tone-blue{background:#edf3ff}.smp-db-chip.smp-db-tone-green{background:#eaf6f0}.smp-db-chip.smp-db-tone-amber{background:#fff5df}.smp-db-chip.smp-db-tone-red{background:#fff0ee}.smp-db-chip.smp-db-tone-purple{background:#f1edfa}.smp-db-priority,.smp-db-due{font-size:10px;color:var(--muted)}.smp-db-priority-red{color:#b63838}.smp-db-priority-amber{color:#925600}.smp-db-panel-footer{padding:11px 18px;border-top:1px solid var(--line);background:#fbfcfe;text-align:center;color:var(--muted);font-size:10px}.smp-db-empty{padding:24px 18px;text-align:center;color:var(--muted);font-size:12px}',
        '.smp-db-alert-list,.smp-db-distribution{padding:0 19px 19px}.smp-db-alert{display:flex;gap:10px;padding:14px 0;border-top:1px solid var(--line)}.smp-db-alert:first-child{border-top:0}.smp-db-alert-dot{width:8px;height:8px;border-radius:50%;background:#9aa9ba;margin-top:6px;flex:none}.smp-db-alert-amber .smp-db-alert-dot{background:#d8a04e}.smp-db-alert-red .smp-db-alert-dot{background:#c95750}.smp-db-alert-main{min-width:0}.smp-db-alert-title{font-size:12px;font-weight:700}.smp-db-alert-detail{font-size:11px;color:var(--muted);margin-top:4px;line-height:1.6}.smp-db-alert-link{font-size:11px;margin-top:6px}.smp-db-bar-row+.smp-db-bar-row{margin-top:17px}.smp-db-bar-label{display:flex;justify-content:space-between;gap:8px;font-size:11px;margin-bottom:7px}.smp-db-bar-label strong{white-space:nowrap}.smp-db-bar-label small{font-size:10px;color:var(--muted);font-weight:400}.smp-db-bar-track{height:7px;background:#edf1f7;border-radius:5px;overflow:hidden}.smp-db-bar-fill{height:100%;border-radius:5px;background:#86a7e7}.smp-db-bar-fill.smp-db-tone-green{background:#73b499}.smp-db-bar-fill.smp-db-tone-amber{background:#d8b16e}.smp-db-bar-fill.smp-db-tone-purple{background:#a18acb}.smp-db-bar-fill.smp-db-tone-red{background:#d77973}',
        '.smp-db-workflow{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;padding:4px 20px 20px}.smp-db-step{display:flex;gap:9px;align-items:center;min-width:0}.smp-db-step-number{width:26px;height:26px;display:flex;align-items:center;justify-content:center;flex:none;border-radius:50%;background:#eef3fa;color:#6080a5;font-size:10px;font-weight:700}.smp-db-step strong{display:block;font-size:10px;line-height:1.5}.smp-db-step small{display:block;font-size:10px;color:var(--muted);margin-top:2px}.smp-db-disclaimer{font-size:10px;color:#758292;margin-top:18px;line-height:1.7}',
        '@media(max-width:1100px){.smp-db-columns{grid-template-columns:minmax(0,1fr)}.smp-db-side-column{grid-template-columns:repeat(2,minmax(0,1fr))}.smp-db-workflow{grid-template-columns:repeat(2,minmax(0,1fr))}}',
        '@media(max-width:700px){.smp-db-metrics{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.smp-db-metric{padding:14px}.smp-db-metric-value{font-size:26px}.smp-db-side-column{grid-template-columns:minmax(0,1fr)}.smp-db-task{flex-wrap:wrap}.smp-db-task-side{width:100%;display:flex;justify-content:flex-start;align-items:center;padding-left:46px;flex-wrap:wrap}.smp-db-panel-header{padding:16px}.smp-db-task-list{padding:0 16px}.smp-db-workflow{grid-template-columns:repeat(2,minmax(0,1fr));padding:4px 16px 18px;gap:14px}}',
        '</style>',
        '<section class="smp-dashboard" aria-label="Tổng quan công việc">',
        '<div class="smp-db-metrics">' + metricHtml + '</div>',
        '<div class="smp-db-columns"><div class="smp-db-main-column">',
        '<section class="smp-db-panel"><header class="smp-db-panel-header"><div><h2>Việc cần bạn xử lý</h2><p>Sắp xếp theo mức độ ưu tiên và thời hạn.</p></div>' + link(data.tasksUrl, "Tất cả công việc →", "smp-db-panel-action") + '</header>',
        '<div class="smp-db-task-list">' + taskHtml + '</div><footer class="smp-db-panel-footer">Chỉ hiển thị công việc thuộc phạm vi được phân quyền.</footer></section>',
        workflowHtml ? '<section class="smp-db-panel"><header class="smp-db-panel-header"><div><h2>Luồng phối hợp</h2><p>Các bước chính của quy trình Risk Event và Mitigation Action.</p></div></header><div class="smp-db-workflow">' + workflowHtml + '</div></section>' : '',
        '</div><aside class="smp-db-side-column">',
        '<section class="smp-db-panel"><header class="smp-db-panel-header"><h2>Cần chú ý</h2></header><div class="smp-db-alert-list">' + alertHtml + '</div></section>',
        '<section class="smp-db-panel"><header class="smp-db-panel-header"><div><h2>Phân bố công việc</h2><p>Số liệu theo phạm vi hiện tại.</p></div></header><div class="smp-db-distribution">' + distributionHtml + '</div></section>',
        '</aside></div>',
        '</section>'
    ].join("\n");
}