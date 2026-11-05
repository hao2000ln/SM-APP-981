/**
 * ScriptLibrary name: HPT_EmailLogListDefinition
 * Màn hình chỉ đọc để tra cứu các yêu cầu email đã phát sinh trong eventout.
 */

// Trả metadata danh sách; mail.body chỉ được đọc qua API detail.
function getDefinition() {
  var presets = lib.HPT_ScreenPresets;
  if (!presets) throw new Error("HPT_ScreenPresets is not available");
  return {
    schemaVersion: "1",
    definitionVersion: "2026.10.14.1",
    module: "HPT_EmailLog",
    requestIdPrefix: "EML",
    table: "esdEmailLog",
    keyField: "log_id",
    versionField: "sysmodtime",
    keyQueryParam: "logId",
    screen: {
      id: "email_logs",
      version: "1",
      kind: "list",
      title: "Nhật ký Email",
      state: { key: "EmailLogMonitor", version: "1" },
      dashboard: {
        serviceName: "HPT_EmailLogReportService",
        functionName: "getDashboard",
        topItems: 10,
        cards: [
          { field: "totalEmails", label: "Tổng email phát sinh" },
          { field: "todayEmails", label: "Email hôm nay" },
          { field: "totalTickets", label: "Ticket có email" },
          { field: "averageEmailsPerTicket", label: "Email/Ticket" }
        ],
        charts: [
          { field: "trend", label: "Email phát sinh trong 3 ngày gần nhất" },
          { field: "bySender", label: "Theo người gửi" },
          { field: "topTickets", label: "Top ticket gửi nhiều nhất" },
          { field: "topRecipients", label: "Top người nhận" }
        ]
      },
      detail: {
        title: "Chi tiết Email",
        keyField: "log_id",
        bodyField: "mail_body",
        bodyFormatField: "mail_body_format"
      },
      columns: [
        { field: "log_id", name: "log_id", title: "Log ID", renderer: "detailLink", hideable: false },
        { field: "mail_queue_time", name: "mail_queue_time", title: "Thời gian", renderer: "datetime" },
        { field: "ticket_id", name: "ticket_id", title: "Ticket ID", renderer: "text" },
        { field: "mail_event_id", name: "mail_event_id", title: "Event ID", renderer: "text" },
        { field: "mail_from", name: "mail_from", title: "Người gửi", renderer: "text" },
        { field: "mail_to", name: "mail_to", title: "Người nhận", renderer: "text" },
        { field: "mail_subject", name: "mail_subject", title: "Tiêu đề", renderer: "text" },
        { field: "mail_source", name: "mail_source", title: "Nguồn", renderer: "text", visible: false },
        { field: "template_name", name: "template_name", title: "Template", renderer: "text", visible: false }
      ],
      filters: [
        { id: "fromDate", type: "date", label: "Từ ngày", parameter: "fromDate" },
        { id: "toDate", type: "date", label: "Đến ngày", parameter: "toDate" }
      ],
      selection: presets.selection("none"),
      bulkActions: [],
      actions: [
        { id: "refresh", type: "refresh", label: "Làm mới", enabled: true, order: 10 },
        { id: "export", type: "export", label: "Xuất Excel", filename: "nhat-ky-email", enabled: true, order: 20 }
      ]
    },
    actionPermissions: {
      uiConfig: { allow: true }, list: { allow: true }, detail: { allow: true },
      filterOptions: { allow: false }, create: { allow: false }, update: { allow: false }, delete: { allow: false }
    },
    batchActions: {},
    dataPermission: { enabled: false },
    fields: [
      { api: "log_id", db: "log.id", type: "string" },
      { api: "ticket_id", db: "ticket.id", type: "string" },
      { api: "source_table", db: "source.table", type: "string", includeInList: false },
      { api: "ruleset_name", db: "ruleset.name", type: "string", includeInList: false },
      { api: "template_name", db: "template.name", type: "string" },
      { api: "correlation_id", db: "correlation.id", type: "string", includeInList: false },
      { api: "mail_event_id", db: "mail.event.id", type: "string" },
      { api: "mail_message_id", db: "mail.message.id", type: "string", includeInList: false },
      { api: "mail_from", db: "mail.from", type: "string" },
      { api: "mail_to", db: "mail.to", type: "string" },
      { api: "mail_cc", db: "mail.cc", type: "string", includeInList: false },
      { api: "mail_bcc", db: "mail.bcc", type: "string", includeInList: false },
      { api: "mail_subject", db: "mail.subject", type: "string" },
      { api: "mail_body", db: "mail.body", type: "string", includeInList: false },
      { api: "mail_body_format", db: "mail.body.format", type: "string", includeInList: false },
      { api: "mail_queue_time", db: "mail.queue.time", type: "datetime", readTransform: function (value) { return funcs.str(value); } },
      { api: "mail_source", db: "mail.source", type: "string" },
      { api: "sysmodtime", db: "sysmodtime", type: "datetime", readTransform: function (value) { return funcs.str(value); } }
    ],
    filters: {
      fromDate: { db: "mail.queue.time", operator: "gte", maxLength: 10 },
      toDate: { db: "mail.queue.time", operator: "lte", maxLength: 10 }
    },
    filterOptions: {},
    search: [
      { db: "log.id", mode: "contains" }, { db: "ticket.id", mode: "contains" },
      { db: "mail.event.id", mode: "contains" }, { db: "mail.from", mode: "contains" },
      { db: "mail.to", mode: "contains" }, { db: "mail.subject", mode: "contains" },
      { db: "mail.source", mode: "contains" }, { db: "source.table", mode: "contains" },
      { db: "ruleset.name", mode: "contains" }, { db: "template.name", mode: "contains" }
    ],
    sortable: {
      log_id: "log.id", ticket_id: "ticket.id", mail_event_id: "mail.event.id",
      mail_from: "mail.from", mail_to: "mail.to", mail_subject: "mail.subject",
      mail_queue_time: "mail.queue.time", sysmodtime: "sysmodtime"
    },
    defaults: presets.listDefaults({
      sortBy: "mail_queue_time", sortDir: "desc", pageSize: 10, maxPageSize: 100,
      maxPage: 100000, minKeywordLength: 2, maxKeywordLength: 100,
      includeUnfilteredTotal: false, countCacheTtl: 30000
    }),
    messages: {
      listSuccess: "Lấy nhật ký email thành công",
      listError: "Không thể tải nhật ký email",
      notFound: "Không tìm thấy nhật ký email"
    }
  };
}
