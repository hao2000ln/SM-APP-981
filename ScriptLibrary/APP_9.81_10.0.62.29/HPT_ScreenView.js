/**
 * ScriptLibrary name: HPT_ScreenView
 * Shared HTMLViewer shell for every registered metadata-driven screen.
 * Chỉ sinh shell tối thiểu; toàn bộ UI thật do HPTScreenRuntime dựng bất đồng bộ.
 */

// Escape dữ liệu chèn vào HTML để ngăn markup/script injection.
function screenViewEscapeHtml(value) {
  return String(value === undefined || value === null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Validate screenId và trả HTMLViewer shell dùng chung cho mọi màn hình.
function render(screenId) {
  screenId = String(screenId || "");
  if (!/^[a-z][a-z0-9_-]{0,63}$/.test(screenId)) {
    throw new Error("screenId is invalid");
  }

  var registry = lib.HPT_ScreenRegistry;
  if (!registry || typeof registry.resolveScreen !== "function") {
    throw new Error("HPT_ScreenRegistry is not available");
  }
  var resolved = registry.resolveScreen(screenId);
  if (!resolved || !resolved.success || !resolved.config ||
      !resolved.config.screenPublic) {
    var code = resolved && resolved.code ? resolved.code : "SCREEN_RESOLUTION_FAILED";
    var errors = resolved && resolved.errors && resolved.errors.length
      ? ": " + resolved.errors.join("; ")
      : "";
    throw new Error("Screen cannot be resolved [" + code + "]" + errors);
  }

  var title = screenViewEscapeHtml(resolved.config.screenPublic.title || screenId);
  var safeScreenId = screenViewEscapeHtml(screenId);
  return [
    "<!doctype html>",
    '<html lang="vi">',
    "<head>",
    '  <meta charset="utf-8">',
    '  <meta name="viewport" content="width=device-width,initial-scale=1">',
    "  <title>" + title + "</title>",
    '  <link rel="stylesheet" href="../js/lib/css/hpt_screen_shell.css?v=hpt-screen-shell-001">',
    '  <link id="hpt-branding-tokens" rel="stylesheet" href="../branding/hpt/tokens.css">',
    "</head>",
    "<body>",
    '  <div id="hptScreenRoot" class="hpt-screen-loading" data-screen-id="' +
      safeScreenId + '" aria-busy="true">',
    '    <div class="hpt-screen-shell" role="status" aria-label="Đang tải màn hình">',
    '      <div class="hpt-shell-toolbar">',
    '        <span class="hpt-shell-block hpt-shell-search"></span>',
    '        <span class="hpt-shell-block hpt-shell-filter"></span>',
    '        <span class="hpt-shell-block hpt-shell-filter"></span>',
    '        <span class="hpt-shell-block hpt-shell-filter"></span>',
    '        <span class="hpt-shell-block hpt-shell-action"></span>',
    '      </div>',
    '      <div class="hpt-shell-table">',
    '        <div class="hpt-shell-table-head"></div>',
    '        <div class="hpt-shell-row"></div>',
    '        <div class="hpt-shell-row"></div>',
    '        <div class="hpt-shell-row"></div>',
    '        <div class="hpt-shell-row"></div>',
    '        <div class="hpt-shell-row"></div>',
    '        <div class="hpt-shell-row"></div>',
    '      </div>',
    '      <span class="hpt-shell-status">Đang chuẩn bị màn hình...</span>',
    '    </div>',
    '  </div>',
    '  <script type="text/javascript">',
    "  (function () {",
    '    var runtimeStyle = document.createElement("link");',
    '    runtimeStyle.rel = "stylesheet";',
    '    runtimeStyle.href = "../js/lib/css/hpt_screen_runtime.css?v=hpt-screen-runtime-039";',
    '    window.__hptScreenStylePromise = new Promise(function (resolve) {',
    '      runtimeStyle.onload = resolve;',
    '      runtimeStyle.onerror = resolve;',
    '      setTimeout(resolve, 1500);',
    '    });',
    '    document.head.appendChild(runtimeStyle);',
    '    var screenScript = document.createElement("script");',
    '    screenScript.src = "../js/lib/js/hpt_screen_bootstrap.js?v=hpt-screen-bootstrap-049";',
    "    screenScript.async = false;",
    "    screenScript.onerror = function () {",
    '      var root = document.getElementById("hptScreenRoot");',
    '      if (root) root.setAttribute("aria-busy", "false");',
    '      if (root) root.textContent = "Không thể tải tài nguyên màn hình.";',
    "    };",
    "    document.head.appendChild(screenScript);",
    "  }());",
    "  </script>",
    "</body>",
    "</html>"
  ].join("\n");
}
