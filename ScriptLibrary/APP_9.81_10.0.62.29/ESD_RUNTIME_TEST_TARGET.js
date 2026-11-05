/**
 * Safe runtime-validation target used by the source-management POC.
 */
function selfTest() {
    var file = null;

    try {
        file = new SCFile(
            "ScriptLibrary",
            SCFILE_READONLY
        );

        var rc = file.doSelect(
            'name="ESD_RUNTIME_TEST_TARGET"'
        );

        if (rc !== RC_SUCCESS) {
            return {
                passed: false,
                checks: [
                    {
                        name: "read-scriptlibrary",
                        passed: false,
                        detail: "RC=" + rc
                    }
                ]
            };
        }

        return {
            passed:
                String(file["name"]) ===
                "ESD_RUNTIME_TEST_TARGET",
            checks: [
                {
                    name: "read-scriptlibrary",
                    passed: true,
                    detail: String(file["name"])
                }
            ]
        };
    } catch (error) {
        return {
            passed: false,
            checks: [
                {
                    name: "runtime-exception",
                    passed: false,
                    detail: String(error)
                }
            ]
        };
    } finally {
        if (
            file &&
            typeof file.doClose === "function"
        ) {
            file.doClose();
        }
    }
}

