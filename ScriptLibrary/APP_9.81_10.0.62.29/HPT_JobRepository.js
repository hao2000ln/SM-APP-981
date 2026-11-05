/**
 * ScriptLibrary name: HPT_JobRepository
 * Persistent SCFile repository for background jobs.
 */

// Tên DBDict thực tế đã được tạo trên Service Manager.
function jobTable() { return "esdbackgroundJob"; }

function jobUtils() {
  var utils = lib.HPT_CommonApiUtils;
  if (!utils) throw new Error("HPT_CommonApiUtils is not available");
  return utils;
}

function jobText(value) {
  return value === undefined || value === null ? "" : String(value);
}

function jobRecord(file) {
  return {
    id: jobText(file["id"]),
    screenId: jobText(file["screen.id"]),
    actionId: jobText(file["action.id"]),
    actionType: jobText(file["action.type"]),
    executorId: jobText(file["executor.id"]),
    requestedBy: jobText(file["requested.by"]),
    status: jobText(file["status"]),
    totalItems: Number(file["total.items"] || 0),
    processedItems: Number(file["processed.items"] || 0),
    successItems: Number(file["success.items"] || 0),
    failedItems: Number(file["failed.items"] || 0),
    progressPercent: Number(file["progress.percent"] || 0),
    resultFile: jobText(file["result.file"]),
    errorMessage: jobText(file["error.message"]),
    requestedAt: jobText(file["requested.at"]),
    startedAt: jobText(file["started.at"]),
    completedAt: jobText(file["completed.at"]),
    heartbeatAt: jobText(file["heartbeat.at"]),
    workerId: jobText(file["worker.id"]),
    retryCount: Number(file["retry.count"] || 0),
    maxRetry: Number(file["max.retry"] || 0),
    cancelRequested: file["cancel.requested"] === true || jobText(file["cancel.requested"]) === "true",
    payload: jobText(file["payload"])
  };
}

function createJob(fields) {
  var esdUtils = lib.ESD_Utils;
  if (!esdUtils || typeof esdUtils.generateNextNumber !== "function" ||
      typeof esdUtils.CreateTicket !== "function") {
    return { success: false, code: "JOB_REPOSITORY_UNAVAILABLE", message: "Kho tác vụ nền chưa sẵn sàng" };
  }
  var id = esdUtils.generateNextNumber(jobTable());
  if (!id) return { success: false, code: "JOB_ID_FAILED", message: "Không thể sinh mã tác vụ" };
  var now = new Date();
  var created = esdUtils.CreateTicket(jobTable(), {
    id: id,
    "screen.id": fields.screenId,
    "action.id": fields.actionId,
    "action.type": fields.actionType,
    "executor.id": fields.executorId,
    "requested.by": fields.requestedBy,
    "requested.at": now,
    status: "QUEUED",
    "total.items": fields.totalItems,
    "processed.items": 0,
    "success.items": 0,
    "failed.items": 0,
    "progress.percent": 0,
    "retry.count": 0,
    "max.retry": fields.maxRetry === undefined ? 3 : fields.maxRetry,
    "cancel.requested": false,
    payload: fields.payload
  });
  return created
    ? { success: true, job: { id: String(id), status: "QUEUED", progressPercent: 0 } }
    : { success: false, code: "JOB_CREATE_FAILED", message: "Không thể tạo tác vụ nền" };
}

function findJob(id) {
  var file = null;
  var utils = jobUtils();
  try {
    file = new SCFile(jobTable());
    var rc = file.doSelect(utils.buildEqualFilter("id", id));
    if (rc !== RC_SUCCESS) {
      var failure = utils.isNotFoundRc(rc)
        ? { success: false, code: "JOB_NOT_FOUND", message: "Không tìm thấy tác vụ" }
        : { success: false, code: "JOB_READ_FAILED", message: "Không thể đọc tác vụ" };
      utils.closeFile(file);
      return failure;
    }
    return { success: true, job: jobRecord(file), file: file };
  } catch (error) {
    utils.closeFile(file);
    return { success: false, code: "JOB_READ_FAILED", message: "Không thể đọc tác vụ" };
  }
}

function getJob(id) {
  var found = findJob(id);
  if (found.file) jobUtils().closeFile(found.file);
  delete found.file;
  return found;
}

function updateJob(id, expectedStatuses, changes) {
  var found = findJob(id);
  if (!found.success) return found;
  var file = found.file;
  try {
    if (expectedStatuses && expectedStatuses.indexOf(jobText(file["status"])) === -1) {
      return { success: false, code: "JOB_STATE_CONFLICT", message: "Trạng thái tác vụ đã thay đổi" };
    }
    var field;
    for (field in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, field)) file[field] = changes[field];
    }
    return file.doUpdate() === RC_SUCCESS
      ? { success: true, job: jobRecord(file) }
      : { success: false, code: "JOB_UPDATE_FAILED", message: "Không thể cập nhật tác vụ" };
  } finally {
    jobUtils().closeFile(file);
  }
}

function findQueued(limit) {
  var file = null;
  var utils = jobUtils();
  var jobs = [];
  try {
    file = new SCFile(jobTable(), SCFILE_READONLY);
    var rc = file.doSelect(utils.buildEqualFilter("status", "QUEUED"));
    while (rc === RC_SUCCESS && jobs.length < Math.max(1, Math.min(Number(limit) || 10, 100))) {
      jobs.push(jobRecord(file));
      rc = file.getNext();
    }
    return { success: true, jobs: jobs };
  } catch (error) {
    return { success: false, code: "JOB_READ_FAILED", message: "Không thể đọc hàng đợi" };
  } finally {
    utils.closeFile(file);
  }
}

function findRunning(limit) {
  var file = null;
  var utils = jobUtils();
  var jobs = [];
  try {
    file = new SCFile(jobTable(), SCFILE_READONLY);
    var rc = file.doSelect(utils.buildEqualFilter("status", "RUNNING"));
    while (rc === RC_SUCCESS && jobs.length < Math.max(1, Math.min(Number(limit) || 100, 500))) {
      jobs.push(jobRecord(file));
      rc = file.getNext();
    }
    return { success: true, jobs: jobs };
  } catch (error) {
    return { success: false, code: "JOB_READ_FAILED", message: "Không thể đọc job đang chạy" };
  } finally {
    utils.closeFile(file);
  }
}

function recoverJob(id, observedHeartbeat) {
  var found = findJob(id);
  if (!found.success) return found;
  var file = found.file;
  try {
    if (jobText(file["status"]) !== "RUNNING" ||
        jobText(file["heartbeat.at"]) !== jobText(observedHeartbeat)) {
      return { success: false, code: "JOB_RECOVERY_SKIPPED", message: "Job đã thay đổi sau khi kiểm tra" };
    }
    var retryCount = Number(file["retry.count"] || 0) + 1;
    var maxRetry = Number(file["max.retry"] || 3);
    file["retry.count"] = retryCount;
    file["worker.id"] = "";
    file["heartbeat.at"] = new Date();
    if (retryCount <= maxRetry) {
      file["status"] = "QUEUED";
      file["error.code"] = "JOB_HEARTBEAT_TIMEOUT";
      file["error.message"] = "Worker mất heartbeat; job đã được đưa lại vào hàng đợi";
    } else {
      file["status"] = "FAILED";
      file["error.code"] = "JOB_RETRY_EXHAUSTED";
      file["error.message"] = "Job vượt quá số lần phục hồi cho phép";
      file["completed.at"] = new Date();
    }
    return file.doUpdate() === RC_SUCCESS
      ? { success: true, job: jobRecord(file) }
      : { success: false, code: "JOB_UPDATE_FAILED", message: "Không thể phục hồi job" };
  } finally {
    jobUtils().closeFile(file);
  }
}

// Claim một job đang QUEUED cho worker hiện tại.
function claimJob(id, workerId) {
  var now = new Date();
  return updateJob(id, ["QUEUED", "RETRY_WAITING"], {
    status: "RUNNING",
    "worker.id": workerId,
    "claimed.at": now,
    "started.at": now,
    "heartbeat.at": now
  });
}

function updateRunningJob(id, workerId, changes) {
  var found = findJob(id);
  if (!found.success) return found;
  var file = found.file;
  try {
    var currentStatus = jobText(file["status"]);
    var completingCancellation = currentStatus === "CANCEL_REQUESTED" && changes.status === "CANCELLED";
    if ((currentStatus !== "RUNNING" && !completingCancellation) ||
        jobText(file["worker.id"]) !== workerId) {
      return { success: false, code: "JOB_CLAIM_LOST", message: "Worker không còn giữ tác vụ" };
    }
    var field;
    for (field in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, field)) file[field] = changes[field];
    }
    file["heartbeat.at"] = new Date();
    return file.doUpdate() === RC_SUCCESS
      ? { success: true, job: jobRecord(file) }
      : { success: false, code: "JOB_UPDATE_FAILED", message: "Không thể cập nhật tác vụ" };
  } finally {
    jobUtils().closeFile(file);
  }
}

function reportProgress(id, workerId, progress) {
  var total = Math.max(0, Number(progress.totalItems || 0));
  var processed = Math.max(0, Number(progress.processedItems || 0));
  var percent = total > 0 ? Math.floor(Math.min(processed, total) * 100 / total) : 0;
  return updateRunningJob(id, workerId, {
    "total.items": total,
    "processed.items": processed,
    "success.items": Math.max(0, Number(progress.successItems || 0)),
    "failed.items": Math.max(0, Number(progress.failedItems || 0)),
    "progress.percent": Math.max(0, Math.min(100, percent))
  });
}

function heartbeat(id, workerId) {
  return updateRunningJob(id, workerId, {});
}

function finishJob(id, workerId, result) {
  var successItems = Math.max(0, Number(result.successItems || 0));
  var failedItems = Math.max(0, Number(result.failedItems || 0));
  var status = result.status;
  if (["COMPLETED", "PARTIAL_SUCCESS", "FAILED", "CANCELLED"].indexOf(status) === -1) {
    status = failedItems > 0 ? (successItems > 0 ? "PARTIAL_SUCCESS" : "FAILED") : "COMPLETED";
  }
  return updateRunningJob(id, workerId, {
    status: status,
    "processed.items": successItems + failedItems,
    "success.items": successItems,
    "failed.items": failedItems,
    "progress.percent": status === "COMPLETED" || status === "PARTIAL_SUCCESS" ? 100 : Number(result.progressPercent || 0),
    "result.file": result.resultFile || "",
    "result.summary": result.resultSummary || "",
    "error.code": result.errorCode || "",
    "error.message": result.errorMessage || "",
    "completed.at": new Date()
  });
}

function requestCancellation(id, owner) {
  var found = findJob(id);
  if (!found.success) return found;
  var file = found.file;
  try {
    if (jobText(file["requested.by"]) !== owner) {
      return { success: false, code: "JOB_FORBIDDEN", message: "Bạn không có quyền hủy tác vụ này" };
    }
    var status = jobText(file["status"]);
    if (status === "QUEUED" || status === "RETRY_WAITING") {
      file["status"] = "CANCELLED";
      file["cancel.requested"] = true;
      file["cancelled.by"] = owner;
      file["cancelled.at"] = new Date();
      file["completed.at"] = new Date();
    } else if (status === "RUNNING") {
      file["status"] = "CANCEL_REQUESTED";
      file["cancel.requested"] = true;
      file["cancelled.by"] = owner;
      file["cancelled.at"] = new Date();
    } else {
      return { success: false, code: "JOB_STATE_CONFLICT", message: "Tác vụ không thể hủy ở trạng thái hiện tại" };
    }
    return file.doUpdate() === RC_SUCCESS
      ? { success: true, job: jobRecord(file) }
      : { success: false, code: "JOB_UPDATE_FAILED", message: "Không thể yêu cầu hủy tác vụ" };
  } finally {
    jobUtils().closeFile(file);
  }
}
