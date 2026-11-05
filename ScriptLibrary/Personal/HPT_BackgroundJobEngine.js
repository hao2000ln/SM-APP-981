/**
 * ScriptLibrary name: HPT_BackgroundJobEngine
 * Validates, queues and controls persistent background jobs.
 */

function backgroundJobDependencies() {
  var repository = lib.HPT_JobRepository;
  var utils = lib.HPT_CommonApiUtils;
  var security = lib.HPT_ApiSecurity;
  if (!repository || !utils || !security) throw new Error("Background job dependencies are unavailable");
  return { repository: repository, utils: utils, security: security };
}

function backgroundJobOwner() {
  var dependencies = backgroundJobDependencies();
  return typeof dependencies.security.currentContact === "function"
    ? dependencies.utils.cleanString(dependencies.security.currentContact()) : "";
}

function serializeJobPayload(payload) {
  var text = JSON.stringify(payload || {});
  if (text.length > 200000) {
    return { success: false, code: "JOB_PAYLOAD_TOO_LARGE", message: "Dữ liệu tác vụ vượt quá giới hạn" };
  }
  return { success: true, value: text };
}

function enqueue(config, request, actionType) {
  var dependencies = backgroundJobDependencies();
  var body = request.body || {};
  var actionId = dependencies.utils.cleanString(body.actionId);
  var collection = actionType === "screen" ? config.screenActions : config.batchActions;
  var action = collection && collection[actionId];
  var execution = action && action.execution;
  if (!action || !execution || execution.asyncEnabled !== true) {
    return { success: false, code: "ASYNC_ACTION_NOT_ALLOWED", message: "Action không cho phép chạy nền" };
  }
  if (typeof execution.executorId !== "string" ||
      !/^[a-z][a-z0-9_-]*(?:\.[A-Za-z][A-Za-z0-9_-]*)+$/.test(execution.executorId)) {
    return { success: false, code: "JOB_EXECUTOR_NOT_CONFIGURED", message: "Action chưa cấu hình executor chạy nền" };
  }
  var context = dependencies.utils.createContext(
    config.module || "HPT_ScreenService", "enqueueJob", request, config.requestIdPrefix || "JOB"
  );
  var permissionKey = actionType === "screen" ? "screen:" + actionId : "batch:" + actionId;
  var authorization = dependencies.security.authorizeAction(
    config.actionPermissions, permissionKey, request, context
  );
  if (!authorization || authorization.error) {
    return authorization && authorization.error
      ? authorization.error
      : dependencies.utils.serviceError("FORBIDDEN", "Không có quyền tạo tác vụ", context);
  }
  var owner = backgroundJobOwner();
  if (!owner) return { success: false, code: "JOB_OWNER_UNAVAILABLE", message: "Không xác định được người tạo tác vụ" };
  var items = Array.isArray(body.items) ? body.items : [];
  var importRows = actionType === "screen" && body.input && Array.isArray(body.input.rowNumbers)
    ? body.input.rowNumbers : [];
  var itemCount = importRows.length || items.length;
  var maximum = Math.min(Number(execution.maxAsyncItems) || 10000, 50000);
  if (itemCount > maximum) {
    return { success: false, code: "ASYNC_ITEM_LIMIT_EXCEEDED", message: "Số bản ghi vượt quá giới hạn tác vụ nền" };
  }
  var serialized = serializeJobPayload({
    actionType: actionType,
    executorId: execution.executorId,
    request: { body: body, query: request.query || {}, headers: { "x-request-id": request.headers && request.headers["x-request-id"] } }
  });
  if (!serialized.success) return serialized;
  var created = dependencies.repository.createJob({
    screenId: config.screenPublic && config.screenPublic.id,
    actionId: actionId,
    actionType: actionType,
    executorId: execution.executorId,
    requestedBy: owner,
    totalItems: itemCount,
    maxRetry: Math.max(0, Math.min(Number(execution.maxRetry) || 3, 10)),
    payload: serialized.value
  });
  if (!created.success) return created;
  return { success: true, queued: true, job: created.job, message: "Đã đưa tác vụ vào hàng đợi" };
}

function getStatus(jobId) {
  var dependencies = backgroundJobDependencies();
  var found = dependencies.repository.getJob(jobId);
  if (!found.success) return found;
  if (!backgroundJobOwner() || found.job.requestedBy !== backgroundJobOwner()) {
    return { success: false, code: "JOB_FORBIDDEN", message: "Bạn không có quyền xem tác vụ này" };
  }
  delete found.job.payload;
  return found;
}

function cancel(jobId) {
  var dependencies = backgroundJobDependencies();
  var found = dependencies.repository.getJob(jobId);
  if (!found.success) return found;
  if (!backgroundJobOwner() || found.job.requestedBy !== backgroundJobOwner()) {
    return { success: false, code: "JOB_FORBIDDEN", message: "Bạn không có quyền hủy tác vụ này" };
  }
  var cancelled = dependencies.repository.requestCancellation(jobId, backgroundJobOwner());
  if (!cancelled.success) return cancelled;
  delete cancelled.job.payload;
  return cancelled;
}

function backgroundWorkerId(value) {
  var clean = String(value || "").replace(/[^A-Za-z0-9_.-]/g, "").substring(0, 80);
  return clean || ("worker-" + new Date().getTime() + "-" + Math.floor(Math.random() * 100000));
}

/* Executes at most one queued job. The scheduler supplies an allowlisted
 * executor function; this engine never evaluates a library/function name from payload. */
function runNext(executor, workerName) {
  var dependencies = backgroundJobDependencies();
  if (typeof executor !== "function") {
    return { success: false, code: "JOB_EXECUTOR_INVALID", message: "Executor tác vụ không hợp lệ" };
  }
  var queued = dependencies.repository.findQueued(1);
  if (!queued.success || !queued.jobs.length) {
    return queued.success ? { success: true, idle: true } : queued;
  }
  var workerId = backgroundWorkerId(workerName);
  var claimed = dependencies.repository.claimJob(queued.jobs[0].id, workerId);
  if (!claimed.success) return claimed;
  var job = claimed.job;
  var payload;
  try {
    payload = JSON.parse(job.payload || "{}");
  } catch (error) {
    dependencies.repository.finishJob(job.id, workerId, {
      status: "FAILED", errorCode: "JOB_PAYLOAD_INVALID",
      errorMessage: "Payload tác vụ không hợp lệ"
    });
    return { success: false, code: "JOB_PAYLOAD_INVALID", jobId: job.id };
  }
  function progress(value) {
    return dependencies.repository.reportProgress(job.id, workerId, value || {});
  }
  function isCancellationRequested() {
    var current = dependencies.repository.getJob(job.id);
    return current.success && (current.job.cancelRequested === true ||
      current.job.status === "CANCEL_REQUESTED" || current.job.status === "CANCELLED");
  }
  function heartbeat() {
    return dependencies.repository.heartbeat(job.id, workerId);
  }
  var result;
  try {
    result = executor({
      job: job,
      payload: payload,
      reportProgress: progress,
      heartbeat: heartbeat,
      isCancellationRequested: isCancellationRequested
    }) || {};
  } catch (error) {
    result = { success: false, errorCode: "JOB_EXECUTION_FAILED", errorMessage: "Không thể thực thi tác vụ" };
  }
  var completed = dependencies.repository.finishJob(job.id, workerId, {
    status: result.status,
    successItems: result.successItems,
    failedItems: result.failedItems,
    resultFile: result.resultFile,
    resultSummary: result.resultSummary,
    errorCode: result.success === false ? (result.errorCode || "JOB_EXECUTION_FAILED") : result.errorCode,
    errorMessage: result.success === false ? (result.errorMessage || "Không thể thực thi tác vụ") : result.errorMessage
  });
  return completed.success
    ? { success: result.success !== false, job: completed.job }
    : completed;
}

// Phục hồi các job RUNNING không còn heartbeat; repository kiểm tra lại
// heartbeat trước khi ghi để tránh tranh chấp với worker đang hoạt động.
function recoverStale(timeoutMs, limit) {
  var dependencies = backgroundJobDependencies();
  var timeout = Math.max(60000, Math.min(Number(timeoutMs) || 300000, 86400000));
  var running = dependencies.repository.findRunning(limit || 100);
  if (!running.success) return running;
  var cutoff = new Date().getTime() - timeout;
  var recovered = 0;
  var skipped = 0;
  for (var i = 0; i < running.jobs.length; i++) {
    var job = running.jobs[i];
    var heartbeatTime = new Date(job.heartbeatAt || job.startedAt || job.requestedAt).getTime();
    if (!isFinite(heartbeatTime) || heartbeatTime > cutoff) continue;
    var result = dependencies.repository.recoverJob(job.id, job.heartbeatAt);
    if (result.success) recovered += 1;
    else skipped += 1;
  }
  return { success: true, scanned: running.jobs.length, recovered: recovered, skipped: skipped };
}
