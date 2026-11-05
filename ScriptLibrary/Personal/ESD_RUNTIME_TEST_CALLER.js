(function () {
    var libraryName = "ESD_RUNTIME_TEST_TARGET";
    var target = lib[libraryName];
    if (!target) {
        throw new Error(
            "Không tìm thấy library: " +
            libraryName
        );
    }
    if (typeof target.selfTest !== "function") {
        throw new Error(
            libraryName +
            " không có hàm selfTest()."
        );
    }

    var result = target.selfTest();

    print(
        "RUNTIME TEST RESULT: " +
        JSON.stringify(result)
    );

    if (!result || result.passed !== true) {
        throw new Error(
            "Runtime test failed: " +
            JSON.stringify(result)
        );
    }
})();