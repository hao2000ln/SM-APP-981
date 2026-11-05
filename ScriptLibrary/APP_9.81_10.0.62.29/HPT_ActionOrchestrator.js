/**
 * ScriptLibrary name: HPT_ActionOrchestrator
 * Lifecycle runner for registered custom actions.
 * Điều phối prepare -> validateItem -> executeItem -> afterItem -> finalize -> cleanup.
 */

function actionOrchestratorRegistry() {
  var registry = lib.HPT_ActionRegistry;
  if (!registry || typeof registry.resolve !== "function") {
    throw new Error("HPT_ActionRegistry is not available");
  }
  return registry;
}

function actionOrchestratorFailure(code, message) {
  return { success: false, code: code, message: message };
}

function actionOrchestratorCleanupHandler(handler, batchContext, state) {
  if (!handler || typeof handler.cleanup !== "function") return;
  try {
    handler.cleanup({ batch: batchContext, shared: state || {} });
  } catch (ignored) {
    // Cleanup must never replace the business result.
  }
}

// Resolve handler và chạy prepare một lần để tạo execution context dùng chung.
function start(handlerId, batchContext) {
  var resolved = actionOrchestratorRegistry().resolve(handlerId);
  if (!resolved || !resolved.success) {
    return actionOrchestratorFailure(
      resolved && resolved.code || "ACTION_HANDLER_NOT_FOUND",
      "Không thể khởi tạo action nghiệp vụ"
    );
  }
  var execution = {
    success: true,
    handlerId: handlerId,
    handler: resolved.handler,
    state: {},
    batchContext: batchContext
  };
  if (typeof execution.handler.prepare !== "function") return execution;
  try {
    var prepared = execution.handler.prepare(batchContext) || { success: true };
    if (prepared.success === false) {
      actionOrchestratorCleanupHandler(execution.handler, batchContext, prepared.state);
      return actionOrchestratorFailure(
        prepared.code || "ACTION_PREPARE_FAILED",
        prepared.message || "Không thể chuẩn bị action nghiệp vụ"
      );
    }
    execution.state = prepared.state || {};
    return execution;
  } catch (error) {
    actionOrchestratorCleanupHandler(execution.handler, batchContext, execution.state);
    return actionOrchestratorFailure("ACTION_PREPARE_FAILED", "Không thể chuẩn bị action nghiệp vụ");
  }
}

/* Chạy validation nghiệp vụ không được phép ghi dữ liệu. Hook này đặc biệt
 * hữu ích cho transactionMode=allValidated trước khi engine bắt đầu phase ghi. */
function validateItem(execution, itemContext) {
  if (!execution || execution.success !== true || !execution.handler) {
    return actionOrchestratorFailure("ACTION_HANDLER_INVALID", "Action nghiệp vụ không hợp lệ");
  }
  if (typeof execution.handler.validateItem !== "function") return { success: true };
  itemContext.shared = execution.state;
  itemContext.batch = execution.batchContext;
  try {
    return execution.handler.validateItem(itemContext) || { success: true };
  } catch (error) {
    return actionOrchestratorFailure(
      "ACTION_VALIDATION_FAILED", "Không thể kiểm tra điều kiện nghiệp vụ"
    );
  }
}

// Chạy handler cho một bản ghi, đồng thời truyền shared state từ prepare.
function executeItem(execution, itemContext) {
  if (!execution || execution.success !== true ||
      !execution.handler || typeof execution.handler.executeItem !== "function") {
    return actionOrchestratorFailure("ACTION_HANDLER_INVALID", "Action nghiệp vụ không hợp lệ");
  }
  itemContext.shared = execution.state;
  itemContext.batch = execution.batchContext;
  try {
    return execution.handler.executeItem(itemContext) ||
      actionOrchestratorFailure("ACTION_FAILED", "Action nghiệp vụ không trả về kết quả");
  } catch (error) {
    return actionOrchestratorFailure("ACTION_FAILED", "Không thể thực hiện action nghiệp vụ");
  }
}

/* Hook hậu xử lý từng dòng. Lỗi hook được trả về như warning vì thao tác ghi
 * có thể đã commit; không được đổi một kết quả đã thành công thành thất bại giả. */
function afterItem(execution, itemContext, itemResult) {
  if (!execution || !execution.handler ||
      typeof execution.handler.afterItem !== "function") return { success: true };
  itemContext.shared = execution.state;
  itemContext.batch = execution.batchContext;
  try {
    return execution.handler.afterItem({
      item: itemContext,
      result: itemResult,
      batch: execution.batchContext,
      shared: execution.state
    }) || { success: true };
  } catch (error) {
    return actionOrchestratorFailure(
      "ACTION_AFTER_ITEM_FAILED", "Hậu xử lý bản ghi chưa hoàn tất"
    );
  }
}

// Tổng kết một lần sau khi toàn bộ item đã được xử lý.
function finalize(execution, results) {
  if (!execution || !execution.handler || typeof execution.handler.finalize !== "function") {
    return { success: true };
  }
  try {
    return execution.handler.finalize({
      batch: execution.batchContext,
      shared: execution.state,
      results: results
    }) || { success: true };
  } catch (error) {
    return actionOrchestratorFailure("ACTION_FINALIZE_FAILED", "Không thể hoàn tất hậu xử lý action");
  }
}

// Giải phóng resource của custom handler kể cả khi action phát sinh lỗi.
function cleanup(execution) {
  if (!execution) return;
  actionOrchestratorCleanupHandler(
    execution.handler, execution.batchContext, execution.state
  );
}
