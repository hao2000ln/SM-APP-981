/**
 * QUERY REFERENCE
 * OpenText / HPE Service Manager
 *
 * Nguyen tac:
 * - Dung SCFILE_READONLY cho truy van chi doc.
 * - Goi setFields() truoc doSelect() va chi lay field can dung.
 * - Uu tien dieu kien tren unique key/index; tranh doSelect("true") tren bang lon.
 * - Gioi han so record tra ve cho man hinh, API va bao cao.
 * - Luon doClose() trong finally.
 * - Map nhieu bang theo batch: gom key, query bang lien quan mot lan, tao map.
 */

/** Escape dau nhay kep theo cach QueryHelper.querySafe cua he thong. */
function escapeQueryValue(value) {
  return String(value).replace(/"/g, '\\"');
}

/** Tao dieu kien bang cho field character. */
function buildEqualQuery(fieldName, value) {
  return fieldName + '="' + escapeQueryValue(value) + '"';
}

/** Tao dieu kien ISIN va loai bo null/trung lap. */
function buildIsinQuery(fieldName, values) {
  if (!Array.isArray(values) || values.length === 0) {
    return "false";
  }

  var seen = {};
  var queryValues = [];

  for (var i = 0; i < values.length; i++) {
    var value = values[i];
    if (value === null || value === undefined || value === "") {
      continue;
    }

    var key = "$" + String(value);
    if (!Object.prototype.hasOwnProperty.call(seen, key)) {
      seen[key] = true;
      queryValues.push('"' + escapeQueryValue(value) + '"');
    }
  }

  return queryValues.length > 0 ? fieldName + " isin {" + queryValues.join(",") + "}" : "false";
}

/** Chuyen record hien tai cua SCFile thanh object JS theo fields. */
function getRowByFields(file, fields) {
  var row = {};

  for (var i = 0; i < fields.length; i++) {
    var fieldName = fields[i];
    var value = file[fieldName];
    row[fieldName] = value && typeof value.toArray === "function" ? value.toArray() : value;
  }

  return row;
}

/**
 * Lay mot record. Nen dung query theo unique key/index.
 * Tra ve null neu khong tim thay hoac truy van loi.
 */
function getOneRecord(tableName, query, fields) {
  var file = null;

  if (!tableName || !query) {
    throw new Error("[getOneRecord] tableName and query are required");
  }

  if (!Array.isArray(fields) || fields.length === 0) {
    throw new Error("[getOneRecord] fields must be a non-empty array");
  }

  try {
    file = new SCFile(tableName, SCFILE_READONLY);
    file.setFields(fields);

    var rc = file.doSelect(query);
    return rc === RC_SUCCESS ? getRowByFields(file, fields) : null;
  } catch (e) {
    print("[getOneRecord] table=" + tableName + ", error=" + e.message);
    return null;
  } finally {
    if (file) {
      file.doClose();
    }
  }
}

/**
 * getRecords - Truy van record tu bang SM qua SCFile
 *
 * @param {String} tableName  Ten bang (bat buoc)
 * @param {String} [query]    Dieu kien query SM (SM query language).
 *                            - undefined/null/"" => "false" (khong lay gi - mac dinh an toan)
 *                            - "true"           => lay tat ca record
 * @param {Array}  fields     Danh sach field can lay (bat buoc, khong duoc rong)
 * @param {Number} [maxRows]  So dong toi da tra ve.
 *                            - Khong truyen => DEFAULT_MAX_ROWS.
 *                            - 0 => lay toi da HARD_CAP_MAX_ROWS.
 *                            - Lon hon HARD_CAP_MAX_ROWS => gioi han ve HARD_CAP_MAX_ROWS.
 *                            - So am se bao loi qua result.error.
 * @returns {Object} {
 *   success: Boolean,   // true neu query chay thanh cong (ke ca khi khong co record nao)
 *   rows: Array,        // du lieu lay duoc
 *   count: Number,      // so dong thuc te (rows.length)
 *   truncated: Boolean, // true neu van con record nhung ket qua da cham gioi han
 *   error: String|null, // thong diep loi neu co
 *   rc: Number|null     // return code cuoi cung tu SCFile, phuc vu debug
 * }
 */
function getRecords(tableName, query, fields, maxRows) {
  var DEFAULT_MAX_ROWS = 100;
  var HARD_CAP_MAX_ROWS = 5000;
  var result = {
    success: false,
    rows: [],
    count: 0,
    truncated: false,
    error: null,
    rc: null
  };
  var file = null;

  if (!tableName) {
    result.error = "[getRecords] tableName is required";
    print(result.error);
    return result;
  }

  if (!Array.isArray(fields) || fields.length === 0) {
    result.error = "[getRecords] fields must be a non-empty array";
    print(result.error);
    return result;
  }

  var limit = DEFAULT_MAX_ROWS;
  if (maxRows !== undefined && maxRows !== null && maxRows !== "") {
    limit = Number(maxRows);
  }

  if (isNaN(limit) || !isFinite(limit) || Math.floor(limit) !== limit || limit < 0) {
    result.error = "[getRecords] maxRows must be a non-negative integer";
    print(result.error);
    return result;
  }

  if (limit === 0 || limit > HARD_CAP_MAX_ROWS) {
    limit = HARD_CAP_MAX_ROWS;
  }

  var qry = query === undefined || query === null || query === "" ? "false" : String(query);

  try {
    file = new SCFile(tableName, SCFILE_READONLY);
    file.setFields(fields);

    var rc = file.doSelect(qry);
    result.rc = rc;

    while (rc === RC_SUCCESS && result.rows.length < limit) {
      result.rows.push(getRowByFields(file, fields));
      rc = file.getNext();
      result.rc = rc;
    }

    result.truncated = result.rows.length >= limit && rc === RC_SUCCESS;
    if (rc === RC_SUCCESS || rc === RC_NO_MORE || rc === RC_NOMATCH) {
      result.success = true;
    } else {
      result.error = "[getRecords] unexpected rc=" + rc + " table=" + tableName;
      print(result.error);
    }
  } catch (e) {
    result.error = "[getRecords] table=" + tableName + ", error=" + e.message;
    print(result.error);
  } finally {
    if (file) {
      file.doClose();
    }
  }

  result.count = result.rows.length;
  return result;
}

/** Tao object map theo mot field, vi du { "U01": record }. */
function indexRecordsBy(records, keyField) {
  var recordMap = {};

  for (var i = 0; i < records.length; i++) {
    var key = records[i][keyField];
    if (key !== null && key !== undefined && key !== "") {
      recordMap["$" + String(key)] = records[i];
    }
  }

  return recordMap;
}

/**
 * Map quan he many-to-one trong bo nho sau khi hai bang da duoc query.
 * relatedProperty la field moi duoc gan vao moi record chinh.
 */
function mapRelatedRecords(records, foreignKey, relatedRecords, relatedKey, relatedProperty) {
  var relatedMap = indexRecordsBy(relatedRecords, relatedKey);

  for (var i = 0; i < records.length; i++) {
    var key = records[i][foreignKey];
    records[i][relatedProperty] = relatedMap["$" + String(key)] || null;
  }

  return records;
}

/** Tao object map theo nhom, vi du { "$P01": [record1, record2] }. */
function groupRecordsBy(records, keyField) {
  var groupMap = {};

  for (var i = 0; i < records.length; i++) {
    var key = records[i][keyField];
    if (key === null || key === undefined || key === "") {
      continue;
    }

    var mapKey = "$" + String(key);
    if (!groupMap[mapKey]) {
      groupMap[mapKey] = [];
    }
    groupMap[mapKey].push(records[i]);
  }

  return groupMap;
}

/** Map quan he one-to-many, moi record chinh nhan mot mang record lien quan. */
function mapRelatedRecordLists(records, primaryKey, relatedRecords, relatedForeignKey, relatedProperty) {
  var relatedMap = groupRecordsBy(relatedRecords, relatedForeignKey);

  for (var i = 0; i < records.length; i++) {
    var key = records[i][primaryKey];
    records[i][relatedProperty] = relatedMap["$" + String(key)] || [];
  }

  return records;
}

/**
 * Vi du map contacts voi bang don vi, khong query bang don vi trong vong lap.
 * Tong cong chi co hai query: mot cho contacts va mot cho esdQTorgUnit.
 */
function exampleGetContactsWithUnit(contactNames, maxRows) {
  if (!Array.isArray(contactNames) || contactNames.length === 0) {
    return [];
  }

  var contactQuery = buildIsinQuery("contact.name", contactNames);
  var contactResult = getRecords("contacts", contactQuery, ["contact.name", "full.name", "lv2.id"], maxRows);
  if (!contactResult.success) {
    return [];
  }

  var contacts = contactResult.rows;
  var unitIds = [];

  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i]["lv2.id"]) {
      unitIds.push(contacts[i]["lv2.id"]);
    }
  }

  var unitQuery = buildIsinQuery("unit.id", unitIds);
  var unitResult = getRecords("esdQTorgUnit", unitQuery, ["unit.id", "unit.name"], unitIds.length);
  if (!unitResult.success) {
    return [];
  }

  return mapRelatedRecords(contacts, "lv2.id", unitResult.rows, "unit.id", "unit");
}

function exampleGetContactsWithUnit_2(contactName) {
  var file = null;

  try {
    file = new SCFile("contacts", SCFILE_READONLY);

    var safeContactName = lib.StringUtil.escapeAllStr(String(contactName));
    var query = 'SELECT c.contact.name, c.full.name, c.email, c.lv1.id, dv.unit.name AS lv1.name ' +
      'FROM contacts c ' +
      'INNER JOIN esdQTorgUnit dv ON (dv.unit.id = c.lv1.id) ' +
      'WHERE c.contact.name="' + safeContactName + '" ' +
      'AND c.status="Dang hoat dong"';

    var rc = file.doSelect(query);
    if (rc !== RC_SUCCESS) {
      return null;
    }

    return {
      contactName: file["contact.name"],
      fullName: file["full.name"],
      email: file["email"],
      unitId: file["lv1.id"],
      unitName: file["lv1.name"]
    };
  } catch (e) {
    print("[getContactWithUnit] " + e.message);
    return null;
  } finally {
    if (file) {
      file.doClose();
    }
  }
}

// Cach goi lay mot record:
// var contact = getOneRecord("contacts", buildEqualQuery("contact.name", "falcon"), ["contact.name", "full.name"]);

// Cach goi lay danh sach:
// var result = getRecords("contacts", 'active=true and contact.name#"null"', ["contact.name", "full.name"], 100);
// var contacts = result.success ? result.rows : [];
// var cappedResult = getRecords("contacts", "true", ["contact.name", "full.name"], 0);

// Cach goi map hai bang:
// var result = exampleGetContactsWithUnit(["falcon", "operator1"], 100);
// print(JSON.stringify(result));

