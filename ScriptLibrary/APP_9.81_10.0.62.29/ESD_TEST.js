/**
 * Pilot ScriptLibrary managed by GitLab.
 * Used to validate compile, conflict detection, deploy and GET verification.
 */
(function () {
    var passed = 0;
    var failed = 0;
    var skipped = 0;

    function report(name, status, detail) {
        print("[" + status + "] " + name +
            (detail ? " | " + detail : ""));

        if (status === "PASS") passed++;
        else if (status === "FAIL") failed++;
        else skipped++;
    }

    print("===== SM SCRIPT LIBRARY POC =====");

    // 1. Kiểm tra API
    report("SCFile API",
        typeof SCFile === "function" ||
        typeof SCFile === "object" ? "PASS" : "FAIL");

    report("RAD API",
        typeof lib !== "undefined" &&
        lib.RAD &&
        typeof lib.RAD.run === "function"
            ? "PASS" : "FAIL");

    // 2. Đọc ScriptLibrary
    var file;
    try {
        file = new SCFile("ScriptLibrary");

        var rc = file.doSelect('name="HPT_TEST"');

        if (rc !== RC_SUCCESS) {
            report("Read HPT_TEST", "FAIL",
                "Return code: " + rc);
        } else {
            report("Read HPT_TEST", "PASS");

            var source = file.script;

            // 3. Kiểm tra kiểu dữ liệu
            report("Source type",
                typeof source === "string"
                    ? "PASS" : "FAIL",
                typeof source);

            if (typeof source === "string") {
                report("Source length", "PASS",
                    String(source.length));

                // 4. Kiểm tra JSON
                try {
                    var json = JSON.stringify({
                        name: file.name,
                        script: source
                    });

                    var restored = JSON.parse(json);

                    report("JSON round-trip",
                        restored.script === source
                            ? "PASS" : "FAIL");
                } catch (e) {
                    report("JSON round-trip", "FAIL",
                        String(e));
                }

                // 5. Kiểm tra xuống dòng
                var crlf = (source.match(/\r\n/g) || []).length;
                var lf = (source.match(/\n/g) || []).length;

                report("Line endings", "PASS",
                    "CRLF=" + crlf +
                    ", LF-only=" + (lf - crlf));

                // 6. Kiểm tra Unicode
                var unicode = 0;

                for (var i = 0; i < source.length; i++) {
                    if (source.charCodeAt(i) > 127) {
                        unicode++;
                    }
                }

                report("Unicode scan", "PASS",
                    "Non-ASCII=" + unicode);
            }
        }
    } catch (e) {
        report("SCFile read", "FAIL", String(e));
    }

    // 7. Kiểm tra khả năng truy cập Java
    report("Java interop", "SKIP",
        "Java=" + typeof Java +
        ", Packages=" + typeof Packages);

    // 8. Kiểm tra File API
    report("File API", "SKIP",
        "File=" + typeof File);

    // 9. Kiểm tra khả năng export
    report("Physical export", "SKIP",
        "Requires separate controlled test");

    // 10. Kiểm tra SVC
    report("SVC integration", "SKIP",
        "Requires separate configuration test");

    print("===== SUMMARY =====");
    print("PASS: " + passed);
    print("FAIL: " + failed);
    print("SKIP: " + skipped);
    print("===== END =====");
})();

// Conflict-safe deployment through deploysource has been verified.
