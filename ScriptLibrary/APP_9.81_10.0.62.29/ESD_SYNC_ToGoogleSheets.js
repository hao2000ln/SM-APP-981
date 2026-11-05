    
/**
 * Quét các bảng trong SM và đẩy cấu trúc (1 chiều) lên Google Sheets
 * @param {String} tablePrefix - Tiền tố bảng (VD: "esd*" hoặc "esdPurchase*")
 */
/**
 * Quét các bảng trong SM, bóc tách cấu trúc chuẩn từ dbdict + datadict
 * và đẩy dữ liệu 1 chiều lên Google Sheets.
 * @param {String} tablePrefix - Tiền tố bảng (VD: "esd*")
 */
pushSchemaToGoogleSheets("esdHD*");

function pushSchemaToGoogleSheets(tablePrefix) {
    var GOOGLE_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxBM8zfl-f7QDo7cWKwbW-ymWyrCGSyr5L8QtOL5EI1gGmUa8Rdj-TeMa_RKNE5I1ri/exec";
    var fDB = null;
    var fDD = null;
    var finalFieldsArray = [];

    try {
        var query = 'name#"' + String(tablePrefix).replace(/"/g, '\\"') + '"';

        fDB = new SCFile("dbdict", SCFILE_READONLY);
        fDD = new SCFile("datadict", SCFILE_READONLY);

        // Chỉ load các trường mảng cần thiết lên RAM
        fDB.setFields(["name", "field"]);
        fDD.setFields(["name", "fields", "captions"]);

        var rcDB = fDB.doSelect(query);
        var rcDD = fDD.doSelect(query);

        var typeMap = {
            1: "number",
            2: "character",
            3: "date/time",
            4: "logical",
            8: "array",
            9: "structure"
        };

        // Lặp qua từng bảng dbdict tìm được
        while (rcDB === RC_SUCCESS) {
            var tableName = String(fDB["name"]);
            var captionMap = {};

            // Tìm bản ghi datadict tương ứng với bảng hiện tại
            var hasDataDict = false;
            if (rcDD === RC_SUCCESS) {
                // Di chuyển con trỏ datadict đến đúng bảng
                while (rcDD === RC_SUCCESS && String(fDD["name"]) < tableName) {
                    rcDD = fDD.getNext();
                }
                if (rcDD === RC_SUCCESS && String(fDD["name"]) === tableName) {
                    hasDataDict = true;
                }
            }

            // Tạo bản đồ Field -> Caption nếu có datadict
            if (hasDataDict) {
                var ddFields = fDD["fields"];
                var ddCaptions = fDD["captions"];
                var ddLen = ddFields ? ddFields.length() : 0;
                var capLen = ddCaptions ? ddCaptions.length() : 0;

                for (var i = 0; i < ddLen; i++) {
                    var fName = String(ddFields[i]);
                    captionMap[fName] = i < capLen ? String(ddCaptions[i] || "") : "";
                }
            }

            // Đọc cấu trúc trường từ dbdict
            var dbFields = fDB["field"];
            var dbLen = dbFields ? dbFields.length() : 0;

            for (var j = 0; j < dbLen; j++) {
                var item = dbFields[j];
                var fieldName = String(item.name);
                var typeCode = Number(item.type);

                if (!fieldName || fieldName === "descriptor") {
                    continue;
                }

                finalFieldsArray.push({
                    tableName: tableName,
                    fieldName: fieldName,
                    type: typeMap[typeCode] || String(typeCode),
                    caption: captionMap[fieldName] || ""
                });
            }

            rcDB = fDB.getNext();
        }

        if (finalFieldsArray.length === 0) {
            print("[GoogleSync] Không tìm thấy dữ liệu cho tiền tố: " + tablePrefix);
            return;
        }

        // Bắn JSON qua Webhook
        var payload = { fields: finalFieldsArray };
        var headers = [new Header("Content-Type", "application/json")];
        var response = doHTTPRequest("POST", GOOGLE_WEBAPP_URL, headers, JSON.stringify(payload));
        
        print("[GoogleSync] Đồng bộ thành công " + finalFieldsArray.length + " trường. Phản hồi: " + response);

    } catch (e) {
        print("[GoogleSync] ERROR: " + e.message);
    } finally {
        if (fDB) fDB.doClose();
        if (fDD) fDD.doClose();
    }
}