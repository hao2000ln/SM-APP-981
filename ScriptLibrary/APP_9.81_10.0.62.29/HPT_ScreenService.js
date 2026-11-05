/**
 * ScriptLibrary name: HPT_ScreenService
 * Generic Common API facade. The client provides only a registered screenId.
 * Đây là facade duy nhất để HTTP layer gọi các engine theo screenId/actionId.
 */

// Nạp dependency tại runtime để an toàn sau publish/cache reload ScriptLibrary.
function screenServiceDependencies() {
  var utils = lib.HPT_CommonApiUtils;
  var registry = lib.HPT_ScreenRegistry;
  var engine = lib.HPT_CatalogEngine;
  if (!utils || !registry || !engine) {
    throw new Error("HPT Screen API dependencies are not available");
  }
  return { utils: utils, registry: registry, engine: engine };
}

// Chuẩn hóa request, resolve screenId và kiểm tra metadata trước khi xử lý.
function resolveScreenRequest(request, operation) {
  var dependencies = screenServiceDependencies();
  request = dependencies.utils.normalizeRequest(request);
  var context = dependencies.utils.createContext(
    "HPT_ScreenService",
    operation,
    request,
    "SCREEN"
  );
  /* Reuse one correlation id across the service, registry and engine layers. */
  if (!request.headers || typeof request.headers !== "object") request.headers = {};
  request.headers["x-request-id"] = context.requestId;
  var screenId = dependencies.utils.cleanString(
    request.query.screenId || (request.body && request.body.screenId)
  );
  if (!screenId) {
    return {
      error: dependencies.utils.validationError(
        "MISSING_SCREEN_ID",
        "screenId không được để trống",
        "screenId",
        context
      )
    };
  }

  var resolved = dependencies.registry.resolveScreen(screenId);
  if (!resolved || !resolved.success) {
    var resolutionCode = resolved && resolved.code
      ? resolved.code
      : "SCREEN_CONFIG_UNAVAILABLE";
    var resolutionMessages = {
      SCREEN_NOT_FOUND: "Màn hình không tồn tại hoặc chưa được công bố",
      SCREEN_CONFIG_UNAVAILABLE: "Cấu hình màn hình chưa sẵn sàng",
      SCREEN_DEFINITION_UNAVAILABLE: "Bộ kiểm tra cấu hình màn hình chưa sẵn sàng",
      INVALID_SCREEN_DEFINITION: "Cấu hình màn hình không hợp lệ"
    };
    if (!Object.prototype.hasOwnProperty.call(resolutionMessages, resolutionCode)) {
      resolutionCode = "SCREEN_CONFIG_UNAVAILABLE";
    }
    dependencies.utils.log("WARN", context, "resolve-screen", "Screen resolution failed", {
      screenId: screenId,
      code: resolutionCode,
      errorCount: resolved && resolved.errors ? resolved.errors.length : 0
    });
    return {
      error: dependencies.utils.serviceError(
        resolutionCode,
        resolutionMessages[resolutionCode],
        context
      )
    };
  }
  return {
    request: request,
    config: resolved.config,
    engine: dependencies.engine,
    context: context,
    utils: dependencies.utils,
    screenId: screenId
  };
}

function completeScreenOperation(resolved, operation, callback) {
  var startedAt = new Date().getTime();
  var result;
  try {
    result = callback();
    if (!result || typeof result !== "object" || typeof result.success !== "boolean") {
      resolved.utils.log("ERROR", resolved.context, "invalid-response", "Engine returned an invalid response", {
        screenId: resolved.screenId,
        operation: operation
      });
      result = resolved.utils.serviceError(
        "INVALID_SERVICE_RESPONSE",
        "Dịch vụ trả về dữ liệu không hợp lệ",
        resolved.context
      );
    }
  } catch (error) {
    resolved.utils.log("ERROR", resolved.context, "unexpected", "Unhandled screen operation error", {
      screenId: resolved.screenId,
      operation: operation,
      detail: error.toString()
    });
    result = resolved.utils.serviceError(
      "INTERNAL_SERVICE_ERROR",
      "Không thể thực hiện yêu cầu",
      resolved.context
    );
  }

  resolved.utils.log(result.success ? "INFO" : "WARN", resolved.context, "complete", "Screen operation completed", {
    screenId: resolved.screenId,
    operation: operation,
    success: result.success,
    code: result.code || "OK",
    durationMs: new Date().getTime() - startedAt
  });
  return result;
}

// Điều phối CRUD/list/detail generic tới Catalog Engine.
function runScreenOperation(operation, request) {
  var resolved = resolveScreenRequest(request, operation);
  if (resolved.error) return resolved.error;
  if (typeof resolved.engine[operation] !== "function") {
    resolved.utils.log("ERROR", resolved.context, "operation", "Catalog engine operation is unavailable", {
      screenId: resolved.screenId,
      operation: operation
    });
    return resolved.utils.serviceError(
      "OPERATION_UNAVAILABLE",
      "Chức năng chưa sẵn sàng",
      resolved.context
    );
  }
  return completeScreenOperation(resolved, operation, function () {
    return resolved.engine[operation](resolved.config, resolved.request);
  });
}

// Trả metadata public để WebTier dựng màn hình.
function getUiConfig(request) {
  return runScreenOperation("getUiConfig", request);
}

// Trả danh sách có search/filter/sort/paging theo metadata.
function list(request) {
  return runScreenOperation("list", request);
}

function detail(request) {
  return runScreenOperation("detail", request);
}

function create(request) {
  return runScreenOperation("create", request);
}

function update(request) {
  return runScreenOperation("update", request);
}

function remove(request) {
  return runScreenOperation("remove", request);
}

// Trả option của filter/lookup đã được đăng ký backend.
function getFilterOptions(request) {
  var resolved = resolveScreenRequest(request, "getFilterOptions");
  if (resolved.error) return resolved.error;
  var optionName = lib.HPT_CommonApiUtils.cleanString(resolved.request.query.option);
  if (!optionName) {
    var context = lib.HPT_CommonApiUtils.createContext(
      "HPT_ScreenService",
      "getFilterOptions",
      resolved.request,
      "SCREEN"
    );
    return lib.HPT_CommonApiUtils.validationError(
      "MISSING_OPTION",
      "option không được để trống",
      "option",
      context
    );
  }
  if (typeof resolved.engine.getFilterOptions !== "function") {
    return resolved.utils.serviceError(
      "OPERATION_UNAVAILABLE", "Chức năng chưa sẵn sàng", resolved.context
    );
  }
  return completeScreenOperation(resolved, "getFilterOptions", function () {
    return resolved.engine.getFilterOptions(
      resolved.config,
      optionName,
      resolved.request
    );
  });
}

// Thực thi action trên một/nhiều bản ghi qua Batch Action Engine.
function batchAction(request) {
  var resolved = resolveScreenRequest(request, "batchAction");
  if (resolved.error) return resolved.error;
  var batchEngine = lib.HPT_BatchActionEngine;
  if (!batchEngine || typeof batchEngine.execute !== "function") {
    var utils = lib.HPT_CommonApiUtils;
    var context = utils.createContext(
      "HPT_ScreenService", "batchAction", resolved.request, "SCREEN"
    );
    return utils.serviceError(
      "BATCH_ENGINE_UNAVAILABLE", "Batch engine chưa sẵn sàng", context
    );
  }
  return completeScreenOperation(resolved, "batchAction", function () {
    return batchEngine.execute(resolved.config, resolved.request);
  });
}

// Thực thi action cấp màn hình như tạo từ selector liên quan.
function screenAction(request) {
  var resolved = resolveScreenRequest(request, "screenAction");
  if (resolved.error) return resolved.error;
  var actionEngine = lib.HPT_BatchActionEngine;
  if (!actionEngine || typeof actionEngine.executeScreenAction !== "function") {
    return resolved.utils.serviceError(
      "ACTION_ENGINE_UNAVAILABLE", "Action engine chưa sẵn sàng", resolved.context
    );
  }
  return completeScreenOperation(resolved, "screenAction", function () {
    return actionEngine.executeScreenAction(resolved.config, resolved.request);
  });
}

// Đưa action đã bật async vào hàng đợi bền vững.
function enqueueJob(request) {
  var resolved = resolveScreenRequest(request, "enqueueJob");
  if (resolved.error) return resolved.error;
  var jobs = lib.HPT_BackgroundJobEngine;
  if (!jobs || typeof jobs.enqueue !== "function") {
    return resolved.utils.serviceError("JOB_ENGINE_UNAVAILABLE", "Job engine chưa sẵn sàng", resolved.context);
  }
  return completeScreenOperation(resolved, "enqueueJob", function () {
    var type = resolved.utils.cleanString(resolved.request.body.actionType);
    return jobs.enqueue(resolved.config, resolved.request, type === "screen" ? "screen" : "batch");
  });
}

// Trả tiến độ job nhưng không trả payload nội bộ.
function getJobStatus(request) {
  var resolved = resolveScreenRequest(request, "getJobStatus");
  if (resolved.error) return resolved.error;
  var jobs = lib.HPT_BackgroundJobEngine;
  var id = resolved.utils.cleanString(resolved.request.query.jobId);
  if (!id) return resolved.utils.validationError("MISSING_JOB_ID", "jobId không được để trống", "jobId", resolved.context);
  return completeScreenOperation(resolved, "getJobStatus", function () { return jobs.getStatus(id); });
}

// Chỉ cho chủ sở hữu hủy job còn ở QUEUED.
function cancelJob(request) {
  var resolved = resolveScreenRequest(request, "cancelJob");
  if (resolved.error) return resolved.error;
  var jobs = lib.HPT_BackgroundJobEngine;
  var id = resolved.utils.cleanString(resolved.request.body.jobId);
  if (!id) return resolved.utils.validationError("MISSING_JOB_ID", "jobId không được để trống", "jobId", resolved.context);
  return completeScreenOperation(resolved, "cancelJob", function () { return jobs.cancel(id); });
}
