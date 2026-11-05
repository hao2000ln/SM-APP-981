/**
 * ScriptLibrary name: HPT_ContractListDefinition
 * Reference metadata definition for a production-style list screen.
 *
 * Khi sao chép cho màn hình mới, phải thay toàn bộ giá trị thuộc domain:
 * table/key, fields, permissions, dataPermission, action handler và version token.
 * Không coi các giá trị allow/disabled trong file mẫu là mặc định an toàn.
 */

// Trả toàn bộ metadata public UI và cấu hình backend của màn hình hợp đồng.
function getDefinition() {
  var presets = lib.HPT_ScreenPresets;
  if (!presets) throw new Error("HPT_ScreenPresets is not available");
  return {
    // ===== 1. IDENTITY: version và định danh nguồn dữ liệu =====
    schemaVersion: "1",
    definitionVersion: "2026.10.16.2",
    // Định danh service, bảng SM và các field khóa dùng chung cho toàn màn hình.
    module: "HPT_ContractList",
    requestIdPrefix: "HD",
    table: "esdHDcontract",
    keyField: "id",
    versionField: "sysmodtime",
    keyQueryParam: "id",
    // ===== 2. DATA CONTRACT: field API, DBDict và lookup =====
    // Allowlist ánh xạ tên field API sang field DBDict; client không được tự truyền field DB.
    fields: [
      { 
        api: "id", db: "id", type: "string",  //Số hợp đồng
      },
      {
        api: "name",db: "name", type: "string", //Tên hợp đồng
      },
      {
        api: "executor_id", db: "executor.id", type: "string", //Người thực hiện
      },
      {
        api: "contract_group", db: "contract.group", type: "string", //Nhóm hợp đồng
        includeInList: false
      },
      {
        api: "category", db: "category", type: "string", //Phân loại
        includeInList: false //field chỉ dùng cho detail/search nên đặt ở false
      },
      {
        api: "signed_date",
        db: "signed.date",
        type: "datetime", //Ngày ký hợp đồng
        includeInList: false
      },
      {
        api: "contract_type",
        db: "contract.type",
        type: "string", //Loại hợp đồng
        includeInList: false
      },
      {
        api: "status",
        db: "status",
        type: "string", //Trạng thái
      },
      {
        api: "is_budgeted",
        db: "is.budgeted",
        type: "boolean",
        includeInList: false
      },
      {
        api: "start_date",
        db: "start.date",
        type: "datetime",
        includeInList: false,
        readTransform: function (value) { return funcs.str(value); }
      },
      {
        api: "contract_no",
        db: "contract.no",
        type: "string",
        includeInList: false
      },
      {
        api: "contract_value_total",
        db: "contract.value.total",
        type: "number",
        includeInList: false
      },
      {
        api: "unit_lv1",
        db: "unit.lv1",
        type: "string", //Đơn vị cấp 1 (Khối/Chi nhánh)
      },
      {
        api: "unit_lv2",
        db: "unit.lv2",
        type: "string", //Đơn vị cấp 2 (Phòng ban/Trung tâm)
      },
      {
        api: "unit_lv3",
        db: "unit.lv3",
        type: "string", //Đơn vị cấp 3 (Tổ/Bộ phận)
      },
      {
        api: "reason",
        db: "reason",
        // DBDict là array<character>; API list chỉ trả lý do mới nhất cho grid.
        type: "string",
        readTransform: function (value) {
          return lib.HPT_SmFieldAdapter.readValue(value, {
            smType: "array",
            elementType: "character",
            arrayReadMode: "last"
          });
        },
      },
      // Chỉ khai báo field nghiệp vụ cần bảo vệ; preset đảm nhiệm thuật toán và wiring.
      presets.optimisticLockField([
        "sysmoduser", "status", "is.budgeted", "start.date", "reason",
        "contract.no", "contract.value.total", "contract.status.id"
      ]),
      {
        // Field hiển thị riêng cho người dùng: thời điểm cập nhật của SM.
        api: "updated_at",
        db: "sysmodtime",
        type: "datetime",
        allowDuplicateDb: true,
        readTransform: function (value) {
          return funcs.str(value);
        },
      },
    ],
    // Bổ sung dữ liệu hiển thị từ bảng tham chiếu theo lô, tránh query từng dòng.
    // sourceField  = fields[].api của bảng chính
    // targetField  = field mới được bổ sung vào response
    // keyField     = field DBDict của bảng tham chiếu
    // displayField = field DBDict cần lấy
    lookups: [
      {
        // Giữ executor_id là mã gốc; bổ sung executor_name để hiển thị.
        sourceField: "executor_id",
        targetField: "executor_id_view",
        table: "contacts",
        keyField: "contact.name",
        displayField: "full.name",
        fallback: "source",
        required: false,
      },
      {
        // Một query lấy đồng thời tên tiếng Việt và màu hiển thị của trạng thái.
        sourceField: "status",
        table: "esdDMstatus",
        keyField: "status.en",
        outputs: [
          {
            targetField: "status_view",
            displayField: "status.vi",
            fallback: "source",
          },
          {
            targetField: "status_color",
            displayField: "color",
            fallback: "empty",
          },
          {
            targetField: "status_bgcolor",
            displayField: "bgcolor",
            fallback: "empty",
          },
        ],
        required: false,
      },
      {
        // Đơn vị cấp 1: unit.lv1 -> esdQTorgUnit.unit.id -> unit.name.
        sourceField: "unit_lv1",
        targetField: "unit_lv1_view",
        table: "esdQTorgUnit",
        keyField: "unit.id",
        displayField: "unit.name",
        fallback: "source",
        required: false,
      },
      {
        // Đơn vị cấp 2 dùng cùng bảng danh mục đơn vị.
        sourceField: "unit_lv2",
        targetField: "unit_lv2_view",
        table: "esdQTorgUnit",
        keyField: "unit.id",
        displayField: "unit.name",
        fallback: "source",
        required: false,
      },
      {
        // Đơn vị cấp 3 dùng cùng bảng danh mục đơn vị.
        sourceField: "unit_lv3",
        targetField: "unit_lv3_view",
        table: "esdQTorgUnit",
        keyField: "unit.id",
        displayField: "unit.name",
        fallback: "source",
        required: false,
      },
    ],
    // ===== 3. QUERY CONTRACT: filter, search, sort và paging =====
    // Ánh xạ parameter filter từ client sang field DB và giới hạn giá trị đầu vào.
    filters: {
      // UI gửi JSON array vào statusValues; field database vẫn do backend quyết định.
      statusValues: { db: "status", maxValues: 5, maxLength: 160 },
      unitLv1Values: { db: "unit.lv1", maxValues: 5, maxLength: 160 },
      unitLv2Values: { db: "unit.lv2", maxValues: 5, maxLength: 160 },
      unitLv3Values: { db: "unit.lv3", maxValues: 5, maxLength: 160 },
    },
    // Nguồn option đã đăng ký cho filter/lookup; client chỉ được gọi theo key như "status".
    filterOptions: {
      status: {
        // Chỉ đưa vào filter các trạng thái thực tế có trong bảng hợp đồng.
        source: "distinct",
        distinct: {
          table: "esdHDcontract",
          field: "status",
          maxItems: 100,
        },
        // Mapping toàn bộ mã distinct bằng một batch query sang bảng danh mục.
        lookup: {
          table: "esdDMstatus",
          keyField: "status.en",
          labelField: "status.vi",
          extraFields: { color: "color", bgcolor: "bgcolor" },
        },
      },
    },
    // Các field được phép tìm kiếm và cơ chế so khớp tương ứng.
    search: [
      { db: "id", mode: "prefix" },
      { db: "name", mode: "contains" },
      { db: "status", mode: "contains" },
      { db: "unit.lv1", mode: "contains" },
      { db: "unit.lv2", mode: "contains" },
      { db: "unit.lv3", mode: "contains" },
      { db: "category", mode: "contains" },
    ],
    // Allowlist cột được sort; key là tên API, value là field DBDict.
    sortable: {
      id: "id",
      name: "name",
      unit_lv1: "unit.lv1",
      unit_lv2: "unit.lv2",
      unit_lv3: "unit.lv3",
      category: "category",
      sysmodtime: "sysmodtime",
    },
    // Giá trị mặc định và giới hạn hiệu năng cho paging/search/count cache.
    defaults: presets.listDefaults({
      sortBy: "id",
      sortDir: "asc",
      pageSize: 10,
      maxPageSize: 100,
      maxPage: 1000000,
      minKeywordLength: 2,
      maxKeywordLength: 100,
      // UI không hiển thị "lọc từ tổng số"; tránh count thứ hai khi search.
      includeUnfilteredTotal: false,
      // Tái sử dụng count trong cùng tab khi chỉ đổi trang/sort.
      countCacheTtl: 30000,
    }),
    // ===== 4. SECURITY: quyền thao tác và phạm vi dữ liệu =====
    /* Allowlist quyền theo endpoint/action; backend luôn kiểm tra lại, không tin UI.
     * Khi tạo màn hình mới, bắt đầu bằng allow:false và chỉ mở đúng use case đã kiểm thử. */
    actionPermissions: {
      uiConfig: { allow: true },
      list: { allow: true },
      filterOptions: { allow: true },
      detail: { allow: true },
      create: { allow: false },
      update: { allow: false },
      delete: { allow: false },
      "batch:updateContract": { allow: true },
      "batch:deleteContracts": { allow: true },
      "screen:addContract": { allow: true },
      "screen:importContracts": { allow: true },
    },
    // Định nghĩa xử lý thật phía App Server cho từng bulkActions.id.
    /* Phạm vi dữ liệu theo đơn vị/chủ sở hữu; đang tắt trong giai đoạn pilot.
     * Không đưa màn hình mới lên production trước khi chốt và bật data scope phù hợp. */
    dataPermission: {
      enabled: false,
      subModule: "00401",
      unitFields: ["unit.lv1", "unit.lv2", "unit.lv3"],
      ownerField: "created.by",
      includeOwner: true,
      maxUnits: 500,
    },
    // ===== 5. PUBLIC UI: metadata dựng màn hình =====
    // Metadata public điều khiển cách runtime dựng màn hình danh sách trên WebTier.
    screen: {
      id: "contracts",
      version: "1",
      kind: "list",
      title: "Danh sách hợp đồng",
      // Khóa lưu trạng thái UI; tăng version khi muốn reset cấu hình đã lưu của người dùng.
      state: { key: "DanhSachHopDong", version: "3" },
      // Khai báo các cột hiển thị, renderer và khả năng ẩn/hiện trên grid.
      columns: [
        {
          field: "id", name: "id", title: "Số hợp đồng",
          renderer: "recordLink", resource: "contract", hideable: false
        },
        {
          field: "name", name: "name", title: "Tên hợp đồng",
          renderer: "text", visible: false
        },
        {
          field: "executor_id_view", name: "executor_id", title: "Người thực hiện",
          renderer: "lookup", sourceField: "executor_id"
        },
        {
          field: "status_view", name: "status", title: "Trạng thái",
          renderer: "status", sourceField: "status",
          colorField: "status_color", backgroundField: "status_bgcolor",
          hideable: false
        },
        {
          field: "unit_lv1_view", name: "unit_lv1", title: "Đơn vị cấp 1",
          renderer: "lookup", sourceField: "unit_lv1"
        },
        {
          field: "unit_lv2_view", name: "unit_lv2", title: "Đơn vị cấp 2",
          renderer: "lookup", sourceField: "unit_lv2"
        },
        {
          field: "unit_lv3_view", name: "unit_lv3", title: "Đơn vị cấp 3",
          renderer: "lookup", sourceField: "unit_lv3"
        },
        {
          field: "updated_at", name: "sysmodtime", title: "Thời gian cập nhật",
          renderer: "datetime", visible: false
        },
        {
          field: "reason", name: "reason", title: "Lý do",
          renderer: "text", visible: true
        }
      ],
      // Các bộ lọc phía trên grid; parameter phải được allowlist tại filters backend.
      filters: [
        {
          id: "status", type: "multiSelect", label: "Trạng thái",
          parameter: "statusValues", option: "status",
          placeholder: "Tất cả trạng thái", multiple: true,
          cacheTtl: 300000
        },
        presets.organizationCascadeFilter()
      ],
      // Cho phép giữ tối đa 10 lựa chọn; giới hạn từng action vẫn do backend quyết định.
      selection: presets.selection("multiple", {
        maxItems: 10,
        retainAcrossPages: true,
        clearOnQueryChange: true,
        // Chỉ bật debug tạm thời khi điều tra selection trên môi trường phát triển.
        debug: false
      }),
      // Nút nghiệp vụ áp dụng cho các dòng đã chọn; backend tương ứng nằm tại batchActions.
      bulkActions: [
        {
          id: "updateContract",
          label: "Cập nhật",
          confirm: false,
          style: "primary",
          // Dynamic Form sinh popup nhập liệu từ metadata, không cần viết HTML riêng.
          popup: {
            title: "Cập nhật hợp đồng",
            width: 640,
            minWidth: 420,
            maxWidth: 840,
            maxHeight: 760,
            submitLabel: "Xác nhận",
            cancelLabel: "Hủy",
            // Grid 2 cột; từng field có thể chiếm 1 hoặc toàn bộ 2 cột.
            prefill: { source: "detail", requireSingle: true },
            layout: { columns: 2, columnGap: 14, rowGap: 14 },
            fields: [
              {
                name: "status",
                bind: "input",
                type: "lookup",
                valueFrom: "status",
                option: "status",
                label: "Trạng thái",
                placeholder: "Không thay đổi trạng thái",
                required: false,
                colSpan: 1
              },
              {
                // Select ba trạng thái để phân biệt giữ nguyên với ghi false.
                name: "isBudgeted",
                bind: "input",
                type: "select",
                valueFrom: "is_budgeted",
                label: "Có dự chi",
                placeholder: "Không thay đổi",
                required: false,
                colSpan: 1,
                options: [
                  { value: "true", label: "Có" },
                  { value: "false", label: "Không" }
                ]
              },
              {
                name: "startDate",
                bind: "input",
                type: "date",
                valueFrom: "start_date",
                label: "Ngày bắt đầu",
                required: false,
                colSpan: 2
              },
              {
                name: "reason",
                bind: "reason",
                type: "textarea",
                label: "Lý do",
                placeholder: "Bỏ trống nếu không cập nhật lý do",
                required: false,
                minLength: 0,
                maxLength: 1000,
                rows: 4,
                minHeight: 96,
                maxHeight: 180,
                resize: "vertical",
                showCounter: true,
                colSpan: 2
              },
              {
                name: "contractNo",
                bind: "input",
                type: "text",
                valueFrom: "contract_no",
                label: "Số hợp đồng",
                placeholder: "Nhập số hợp đồng",
                helpText: "Action cập nhật này chỉ cho phép chọn một hợp đồng.",
                required: false,
                pattern: "^[^\\r\\n]+$",
                patternMessage: "Số hợp đồng không được chứa ký tự xuống dòng",
                maxLength: 500,
                colSpan: 1
              },
              {
                name: "contractValueTotal",
                bind: "input",
                type: "money",
                valueFrom: "contract_value_total",
                label: "Tổng giá trị hợp đồng",
                placeholder: "Bỏ trống nếu không thay đổi",
                required: false,
                min: 0,
                precision: 0,
                currency: "VND",
                thousandSeparator: ",",
                colSpan: 1
              },
            ]
          },
          // Khóa giao diện SM trong lúc gọi API và ngăn submit trùng/đóng trang.
          execution: {
            maskScope: "framework",
            maskMessage: "Đang cập nhật hợp đồng...",
            preventClose: true,
            preventDuplicate: true
          },
          // Form chứa field chỉ áp dụng cho một hợp đồng nên khóa khi chọn nhiều dòng.
          enableIf: { minSelected: 1, maxSelected: 1 },
          order: 10
        },
        {
          id: "deleteContracts",
          label: "Xóa",
          confirm: true,
          confirmMessage: "Bạn có chắc chắn muốn xóa các hợp đồng đã chọn?",
          style: "danger",
          enabled: true,
          execution: {
            maskScope: "framework",
            maskMessage: "Đang xóa hợp đồng...",
            preventClose: true,
            preventDuplicate: true
          },
          enableIf: { minSelected: 1, maxSelected: 10 },
          order: 30
        }
      ],
      // Action cấp màn hình, không phụ thuộc selection: thêm, làm mới, xuất file.
      actions: [
        {
          id: "addContract", type: "custom", label: "Thêm HĐ",
          enabled: true,
          confirm: true,
          confirmMessage: "Tạo hợp đồng mới với các trạng thái đã chọn?",
          selector: {
            screenId: "status_catalog",
            mode: "multiple",
            // Mỗi trạng thái được chọn tạo một hợp đồng; giới hạn để bảo vệ App Server.
            maxItems: 20,
            title: "Chọn trạng thái cho hợp đồng mới",
            submitLabel: "Tạo hợp đồng",
            cancelLabel: "Hủy",
            width: 1100,
            maxHeight: 820
          },
          execution: {
            maskScope: "framework",
            maskMessage: "Đang tạo hợp đồng...",
            preventClose: true,
            preventDuplicate: true
          },
          order: 20
        },
        {
          id: "refresh", type: "refresh", label: "Làm mới",
          enabled: true, order: 40
        },
        {
          id: "importContracts", type: "import", label: "Nhập Excel",
          enabled: true,
          confirm: true,
          confirmMessage: "Bạn có chắc chắn muốn nhập các hợp đồng hợp lệ trong file Excel vào hệ thống?",
          execution: {
            maskScope: "framework",
            maskMessage: "Đang nhập dữ liệu hợp đồng...",
            preventClose: true,
            preventDuplicate: true
          },
          import: {
            title: "Nhập dữ liệu Hợp đồng (Import Excel)",
            // Chiều cao tối đa; runtime vẫn tự co theo viewport của frame ngoài cùng.
            maxHeight: 760,
            templateName: "mau-import-hop-dong.xlsx",
            sheetName: "Contracts",
            maxRows: 500,
            maxFileSize: 10485760,
              // Chặn XLSX zip-bomb / XML phình lớn sau giải nén ở trình duyệt.
              maxExpandedFileSize: 26214400,
              maxZipEntries: 100,
            chunkSize: 50,
            invalidRowPolicy: "skip",
            precheck: true,
            resultFile: true,
            columns: [
              { field: "contract_no", header: "Số hợp đồng", type: "string", required: true, unique: true, maxLength: 500, example: "HD-2026-001" },
              { field: "status", header: "Trạng thái", type: "string", required: true, maxLength: 255, example: "inprogress" },
              { field: "start_date", header: "Ngày bắt đầu", type: "date", required: false, example: "15/10/2026" },
              { field: "contract_value_total", header: "Tổng giá trị hợp đồng", type: "number", required: false, min: 0, example: "150000000" }
            ]
          },
          order: 45
        },
        {
          id: "export", type: "export", label: "Xuất dữ liệu",
          filename: "danh-sach-hop-dong", enabled: true, order: 50,
          execution: {
            maskScope: "framework",
            maskMessage: "Đang xuất dữ liệu hợp đồng...",
            preventClose: true,
            preventDuplicate: true
          },
        }
      ]
    },
    // ===== 6. BACKEND ACTIONS: thực thi nghiệp vụ =====
    batchActions: {
      updateContract: {
        enabled: true,
        enforceEnableIf: true,
        maxItems: 1,
        chunkSize: 1,
        transactionMode: "perItem",
        // Chỉ backend đọc sysmoduser; client không được chọn tùy ý field này.
        conflictMetadata: {
          exposeUpdatedBy: true,
          updatedByField: "sysmoduser",
          updatedAtField: "updated_at"
        },
        requireReason: false,
        reasonMaxLength: 1000,
        operation: "custom",
        // Registry backend ánh xạ handlerId sang HPT_ContractActions.
        handlerId: "contracts.updateContract"
      },
      deleteContracts: {
        enabled: true,
        enforceEnableIf: true,
        maxItems: 10,
        chunkSize: 10,
        transactionMode: "perItem",
        conflictMetadata: {
          exposeUpdatedBy: true,
          updatedByField: "sysmoduser",
          updatedAtField: "updated_at"
        },
        operation: "custom",
        // Xóa qua domain handler để tập trung business rule và ESD_Utils.deleteTicket.
        handlerId: "contracts.deleteContract",
        successMessage: "Xóa hợp đồng thành công"
      }
    },
    // Action cấp màn hình không cần chọn bản ghi hợp đồng hiện hữu.
    screenActions: {
      addContract: {
        enabled: true,
        operation: "custom",
        handlerId: "contracts.createFromStatuses",
        relatedSelection: {
          screenId: "status_catalog",
          // Backend enforcement: tối đa 20 hợp đồng mới trong một request.
          maxItems: 20,
          verificationChunkSize: 20,
          valueFields: ["status_en"]
        }
      },
      importContracts: {
        enabled: true,
        operation: "custom",
        handlerId: "contracts.importContracts",
        execution: {
          asyncEnabled: true,
          asyncThreshold: 200,
          maxAsyncItems: 500,
          maxRetry: 1,
          executorId: "contracts.importContractsJob"
        }
      }
    },
    // ===== 7. LEGACY INTEGRATION: chỉ giữ khi thật sự cần =====
    // Escape hatch cho endpoint legacy; bỏ cả khối nếu màn hình chỉ dùng generic service.
    endpoints: {
      list: "getContractList",
    },
    // ===== 8. RESPONSE MESSAGES =====
    // Thông báo nghiệp vụ mặc định do backend trả về cho client.
    messages: {
      listSuccess: "Lấy danh sách hợp đồng thành công",
      listError: "Không thể tải danh sách hợp đồng",
      notFound: "Không tìm thấy hợp đồng",
      duplicate: "Mã hợp đồng đã tồn tại trong hệ thống",
    },
  };
}
