/**
 * ScriptLibrary name: HPT_ContractActions
 * Custom action lifecycle factories for the contract domain.
 * Mỗi factory cung cấp lifecycle để Action Orchestrator điều phối.
 */

// Nạp Contract Service tại runtime và fail sớm nếu chưa được publish.
function contractService() {
  var service = lib.HPT_ContractService;
  if (!service) throw new Error("HPT_ContractService is not available");
  return service;
}

// Lifecycle cập nhật: validate chung một lần rồi xử lý từng hợp đồng.
function getUpdateContractHandler() {
  return {
    /* Validate shared input once per HTTP batch to avoid per-record catalog
     * queries. The returned state is passed to every executeItem call. */
    prepare: function (batchContext) {
      var prepared = contractService().prepareUpdate(batchContext);
      if (prepared && prepared.success === true) return prepared;
      /* Business validation belongs in per-item results, not in framework
       * initialization errors. Keep the validated error in shared state. */
      return { success: true, state: { validationError: prepared } };
    },
    executeItem: function (itemContext) {
      if (itemContext.shared && itemContext.shared.validationError) {
        return itemContext.shared.validationError;
      }
      return contractService().updateContract(itemContext);
    },
    /* finalize runs once after all records. Use it for an outbox/job request,
     * never for repeating the per-record database update. */
    finalize: function () {
      return { success: true };
    }
  };
}

// Lifecycle tạo mới: mỗi trạng thái nguồn tạo một hợp đồng.
function getCreateFromStatusesHandler() {
  return {
    executeItem: function (itemContext) {
      return contractService().createFromStatuses(itemContext);
    },
    finalize: function () {
      return { success: true };
    }
  };
}

// Lifecycle xóa sau khi framework đã kiểm tra quyền và concurrency.
function getDeleteContractHandler() {
  return {
    /* Batch engine has already checked data scope and sysmodtime before this
     * handler is called. The domain receives only the verified record id. */
    executeItem: function (itemContext) {
      return contractService().deleteContract(itemContext);
    },
    finalize: function () {
      return { success: true };
    }
  };
}

// Import basic processes one browser chunk (maximum 100 rows) per request.
function getImportContractsHandler() {
  return {
    executeItem: function (itemContext) {
      return contractService().executeImport(itemContext);
    },
    finalize: function () {
      return { success: true };
    }
  };
}
