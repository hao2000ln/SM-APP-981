/**
 * ScriptLibrary name: HPT_JobWorker
 * Fixed scheduler entry point which resolves only allowlisted executors.
 */

function jobWorkerDependencies() {
  var engine = lib.HPT_BackgroundJobEngine;
  var registry = lib.HPT_JobExecutorRegistry;
  if (!engine || !registry) throw new Error("Job worker dependencies are unavailable");
  return { engine: engine, registry: registry };
}

function executeClaimedJob(context) {
  var dependencies = jobWorkerDependencies();
  var job = context.job || {};
  var payload = context.payload || {};
  var body = payload.request && payload.request.body || {};
  if (!job.executorId || String(body.screenId || "") !== String(job.screenId || "") ||
      String(body.actionId || "") !== String(job.actionId || "")) {
    return {
      success: false,
      errorCode: "JOB_PAYLOAD_MISMATCH",
      errorMessage: "Payload không khớp metadata tác vụ"
    };
  }
  var resolved = dependencies.registry.resolve(job.executorId);
  if (!resolved.success) {
    return {
      success: false,
      errorCode: resolved.code || "JOB_EXECUTOR_NOT_FOUND",
      errorMessage: "Không tìm thấy executor được phép"
    };
  }
  try {
    return resolved.executor.execute(context) || {
      success: false,
      errorCode: "JOB_EXECUTOR_EMPTY_RESULT",
      errorMessage: "Executor không trả về kết quả"
    };
  } catch (error) {
    return {
      success: false,
      errorCode: "JOB_EXECUTOR_FAILED",
      errorMessage: "Executor tác vụ thất bại"
    };
  }
}

function runOnce(workerId) {
  return jobWorkerDependencies().engine.runNext(executeClaimedJob, workerId);
}

function recover(timeoutMs, limit) {
  return jobWorkerDependencies().engine.recoverStale(timeoutMs, limit);
}
