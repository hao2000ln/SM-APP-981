/**
 * ScriptLibrary name: HPT_StatusListDefinition
 * Pilot selector screen backed by esdDMstatus.
 */

// Trả metadata danh mục trạng thái dùng độc lập hoặc nhúng làm selector.
function getDefinition() {
  var presets = lib.HPT_ScreenPresets;
  if (!presets) throw new Error("HPT_ScreenPresets is not available");
  return {
    schemaVersion: "1",
    definitionVersion: "2026.10.09.1",
    // Khai báo nguồn dữ liệu và các field hệ thống dùng để định danh/version bản ghi.
    module: "HPT_StatusList",
    requestIdPrefix: "STS",
    table: "esdDMstatus",
    keyField: "id",
    versionField: "sysmodtime",

    // Metadata public để runtime dựng giao diện danh sách trạng thái.
    screen: {
      id: "status_catalog",
      version: "1",
      kind: "list",
      title: "Danh sách trạng thái",
      state: { key: "StatusCatalogSelector", version: "1" },
      // Các cột hiển thị trên grid; sysmodtime được tải nhưng mặc định ẩn.
      columns: [
        { field: "id", name: "id", title: "ID", renderer: "text", hideable: false },
        { field: "status_vi", name: "status_vi", title: "Trạng thái VI", renderer: "text" },
        { field: "status_en", name: "status_en", title: "Trạng thái EN", renderer: "text" },
        { field: "module", name: "module", title: "Module", renderer: "text" },
        { field: "feature", name: "feature", title: "Feature", renderer: "text" },
        { field: "description", name: "description", title: "Mô tả", renderer: "text" },
        { field: "sysmodtime", name: "sysmodtime", title: "Cập nhật", renderer: "datetime", visible: false }
      ],
      filters: [],
      // Mở độc lập không có checkbox; khi nhúng làm selector, runtime ghi đè thành multiple.
      selection: presets.selection("none"),
      bulkActions: [],
      actions: []
    },

    // Allowlist endpoint: màn hình này chỉ được đọc cấu hình và danh sách.
    actionPermissions: {
      uiConfig: { allow: true },
      list: { allow: true },
      filterOptions: { allow: false },
      detail: { allow: false },
      create: { allow: false },
      update: { allow: false },
      delete: { allow: false }
    },
    // Không có nghiệp vụ cập nhật hàng loạt trực tiếp trên danh mục trạng thái.
    batchActions: {},
    // Pilot chưa giới hạn dữ liệu theo đơn vị/người dùng.
    dataPermission: { enabled: false },

    // Kiểm tra một lần bằng `isin`: status đã dùng vẫn hiện nhưng không thể chọn lại.
    selectionAvailability: {
      mode: "disable",
      queryOperator: "isin",
      sourceField: "status_en",
      targetTable: "esdHDcontract",
      targetField: "contract.status.id",
      unavailableReason: "Trạng thái đã được thêm vào hợp đồng",
      missingReason: "Trạng thái không có mã status.en",
      errorReason: "Không thể kiểm tra trạng thái đã sử dụng"
    },

    // Allowlist ánh xạ tên field API sang field thật trong DBDict.
    fields: [
      { api: "id", db: "id", type: "string" },
      { api: "status_en", db: "status.en", type: "string" },
      { api: "status_vi", db: "status.vi", type: "string" },
      { api: "description", db: "des", type: "string" },
      { api: "module", db: "module", type: "string" },
      { api: "feature", db: "feature", type: "string" },
      { api: "color", db: "color", type: "string" },
      { api: "bgcolor", db: "bgcolor", type: "string" },
      {
        api: "sysmodtime", db: "sysmodtime", type: "datetime",
        readTransform: function (value) { return funcs.str(value); }
      }
    ],

    // Các field backend cho phép tìm kiếm và kiểu so khớp tương ứng.
    search: [
      { db: "id", mode: "prefix" },
      { db: "status.en", mode: "contains" },
      { db: "status.vi", mode: "contains" },
      { db: "des", mode: "contains" },
      { db: "module", mode: "contains" },
      { db: "feature", mode: "contains" }
    ],
    // Allowlist cột được phép sort; client không được truyền field DB tùy ý.
    sortable: {
      id: "id",
      status_en: "status.en",
      status_vi: "status.vi",
      module: "module",
      feature: "feature",
      sysmodtime: "sysmodtime"
    },
    // Giá trị mặc định và giới hạn bảo vệ paging, search và count query.
    defaults: presets.listDefaults({
      sortBy: "id",
      sortDir: "asc",
      pageSize: 10,
      maxPageSize: 100,
      maxPage: 100000,
      minKeywordLength: 2,
      maxKeywordLength: 100,
      includeUnfilteredTotal: false,
      countCacheTtl: 30000
    }),
    // Thông báo mặc định dùng cho kết quả đọc danh sách.
    messages: {
      listSuccess: "Lấy danh sách trạng thái thành công",
      listError: "Không thể tải danh sách trạng thái",
      notFound: "Không tìm thấy trạng thái"
    }
  };
}
