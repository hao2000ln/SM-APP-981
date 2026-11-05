  /**
   * ScriptLibrary name: HPT_ContractJobExecutors
   * Background-safe executors for contract jobs.
   */

  function importJobSlice(input, start, end) {
    var fields = ["rowNumbers", "contract_no", "status", "start_date", "contract_value_total"];
    var result = { importMode: "commit" };
    for (var i = 0; i < fields.length; i++) result[fields[i]] = input[fields[i]].slice(start, end);
    return result;
  }

  function validateImportJobInput(input) {
    var fields = ["rowNumbers", "contract_no", "status", "start_date", "contract_value_total"];
    if (!input || !Array.isArray(input.rowNumbers) || !input.rowNumbers.length ||
        input.rowNumbers.length > 500) {
      return { success: false, code: "INVALID_IMPORT_JOB_INPUT" };
    }
    for (var i = 0; i < fields.length; i++) {
      if (!Array.isArray(input[fields[i]]) || input[fields[i]].length !== input.rowNumbers.length) {
        return { success: false, code: "INVALID_IMPORT_JOB_INPUT" };
      }
    }
    return { success: true, total: input.rowNumbers.length };
  }

  function getImportContractsExecutor() {
    return {
      execute: function (context) {
        var service = lib.HPT_ContractService;
        var body = context.payload && context.payload.request && context.payload.request.body || {};
        var input = body.input || {};
        var validation = validateImportJobInput(input);
        if (!service || typeof service.executeImport !== "function" || !validation.success) {
          return {
            success: false,
            errorCode: validation.code || "CONTRACT_SERVICE_UNAVAILABLE",
            errorMessage: "Dữ liệu import nền không hợp lệ"
          };
        }
        var total = validation.total;
        var succeeded = 0;
        var failed = 0;
        var processed = 0;
        var chunkSize = 50;
        for (var start = 0; start < total; start += chunkSize) {
          if (context.isCancellationRequested()) {
            return {
              success: true,
              status: "CANCELLED",
              successItems: succeeded,
              failedItems: failed,
              resultSummary: JSON.stringify({ total: total, processed: processed, cancelled: true })
            };
          }
          var response = service.executeImport({
            input: importJobSlice(input, start, Math.min(start + chunkSize, total))
          });
          if (!response || response.success !== true || !response.data || !response.data.summary) {
            return {
              success: false,
              successItems: succeeded,
              failedItems: failed,
              errorCode: response && response.code || "IMPORT_JOB_CHUNK_FAILED",
              errorMessage: response && response.message || "Không thể xử lý chunk import"
            };
          }
          succeeded += Number(response.data.summary.succeeded || 0);
          failed += Number(response.data.summary.failed || 0);
          processed = Math.min(start + chunkSize, total);
          context.reportProgress({
            totalItems: total,
            processedItems: processed,
            successItems: succeeded,
            failedItems: failed
          });
        }
        return {
          success: true,
          status: failed > 0 ? "PARTIAL_SUCCESS" : "COMPLETED",
          successItems: succeeded,
          failedItems: failed,
          resultSummary: JSON.stringify({ total: total, succeeded: succeeded, failed: failed })
        };
      }
    };
  }
