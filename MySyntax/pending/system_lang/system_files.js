/**
 * SYSTEM FILES & FUNCTIONS REFERENCE
 * OpenText / HPE Service Manager
 *
 * Tai lieu tham khao khi viet JavaScript trong SM. Cac ham example* chi chay
 * khi duoc goi; file khong tu dong mo cursor hay dung RAD khi duoc nap.
 *
 * Nguyen tac SCFile:
 * - Tao SCFile trong function, khong luu cursor vao system.files o cap global.
 * - Truy van doc dung SCFILE_READONLY va chi setFields() cac field can dung.
 * - Tranh query "true" tren bang lon; uu tien dieu kien tren field co index.
 * - Luon doClose() trong finally.
 */

// =============================================================================
// 1. CAC DOI TUONG RUNTIME VA HAM HE THONG THUONG DUNG
// =============================================================================

// system.record    : ban ghi hien tai, phu thuoc execution context.
// system.oldrecord : ban ghi truoc khi thay doi, phu thuoc execution context.
// system.vars      : cac bien $L, $G va bien SM khac.
// system.functions : cac ham RAD/SM he thong; funcs la ten rut gon co san.

var _tod = funcs.tod; // Ngay/gio hien tai
var _time = funcs.time; // Ham time cua SM
var _lng = funcs.lng; // Do dai chuoi/mang SM
var _month = funcs.month; // Lay thang tu datetime
var _year = funcs.year; // Lay nam tu datetime
var _index = funcs.index; // Tim vi tri theo quy uoc SM
var _str = funcs.str; // Chuyen gia tri SM thanh chuoi
var _insert = funcs.insert; // Chen phan tu vao mang SM
var _denull = funcs.denull; // Chuan hoa NULL cua SM
var _operator = funcs.operator; // Operator dang dang nhap
var _rtecall = funcs.rtecall; // Goi routine/RAD noi bo
var _scmsg = funcs.scmsg; // Doc system message
var _val = funcs.val; // Chuyen sang kieu du lieu SM
var _nullsub = funcs.nullsub; // Thay NULL bang gia tri mac dinh
var _getFieldCaption = funcs.get_field_caption; // Lay caption cua field
var _cleanup = funcs.cleanup; // Giai phong/lam sach doi tuong SM
var _recordcopy = funcs.recordcopy; // Copy cac field giua hai record
var _fduplicate = funcs.fduplicate; // Duplicate mot SCFile

/** Vi du: tod, year, month, operator, nullsub, str va lng. */
function exampleSystemFunctions() {
  var now = _tod();
  var safeText = _nullsub(null, "");

  print("Now: " + _str(now));
  print("Year: " + _year(now));
  print("Month: " + _month(now));
  print("Operator: " + _operator());
  print("Text length: " + _lng(safeText));
}

function getFieldCaptionSafe(fieldName, tableName) {
  return _nullsub(_getFieldCaption(fieldName, tableName), fieldName);
}
var caption = getFieldCaptionSafe("full.name", "contacts");

/**
 * system.functions.index() theo quy uoc SM: vi tri dau tien la 1;
 * ket qua 0 nghia la khong tim thay.
 */
function exampleIndex(smArray, expectedValue) {
  return _index(expectedValue, smArray) > 0;
}
// =============================================================================
// 2. SCFILE - DOC MOT BAN GHI
// =============================================================================

/**
 * Lay mot contact theo contact.name.
 * Caller phai validate/escape contactName neu gia tri den tu request ben ngoai.
 *
 * @param {String} contactName
 * @returns {Object|null}
 */
function exampleGetOneContact(contactName) {
  var file = null;

  if (contactName === null || contactName === undefined || contactName === "") {
    return null;
  }

  try {
    file = new SCFile("contacts", SCFILE_READONLY);
    file.setFields(["contact.name", "full.name", "email"]);

    var query = 'contact.name="' + contactName + '"';
    var rc = file.doSelect(query);

    if (rc !== RC_SUCCESS) {
      return null;
    }

    return {
      "contact.name": file["contact.name"],
      "full.name": file["full.name"],
      email: _nullsub(file.email, ""),
    };
  } catch (e) {
    print("[system_files.exampleGetOneContact] " + e.message);
    return null;
  } finally {
    if (file) {
      file.doClose();
    }
  }
}

// =============================================================================
// 3. SCFILE - DOC DANH SACH CO GIOI HAN
// =============================================================================

/**
 * @param {String} query Query theo cu phap SM, nen dung field co index.
 * @param {Number} maxRows So ban ghi toi da; mac dinh 100.
 * @returns {Array} Luon tra ve JavaScript array.
 */
function exampleGetContacts(query, maxRows) {
  var file = null;
  var rows = [];
  var limit = parseInt(maxRows, 10);

  if (isNaN(limit) || limit <= 0) {
    limit = 100;
  }

  try {
    file = new SCFile("contacts", SCFILE_READONLY);
    file.setFields(["contact.name", "full.name"]);

    // Khong co query thi khong doc du lieu. Caller phai chu dong truyen "true"
    // neu thuc su can doc tu dau bang.
    var rc = file.doSelect(query || "false");

    while (rc === RC_SUCCESS && rows.length < limit) {
      rows.push({
        "contact.name": file["contact.name"],
        "full.name": file["full.name"],
      });

      if (rows.length < limit) {
        rc = file.getNext();
      }
    }
  } catch (e) {
    print("[system_files.exampleGetContacts] " + e.message);
  } finally {
    if (file) {
      file.doClose();
    }
  }

  return rows;
}

// Cach goi:
// var one = exampleGetOneContact("falcon");
// var rows = exampleGetContacts('contact.name#"null"', 100);

// =============================================================================
// 5. SYSTEM.RECORD VA SYSTEM.OLDRECORD
// =============================================================================

/** Chi dung trong context co record, vi du Format Control hoac RuleSet. */
function exampleStatusChanged() {
  if (!system.record || !system.oldrecord) {
    return false;
  }

  return system.record.status != system.oldrecord.status;
}

// =============================================================================
// 6. SYSTEM.VARS VA RAD
// =============================================================================

/**
 * Chi set bien exit tai dung diem nghiep vu can dung RAD.
 * Khong set system.vars.$L_exit o cap global khi ScriptLibrary duoc nap.
 */
function exampleStopRad() {
  system.vars.$L_exit = true;
  return false;
}

// =============================================================================
// 7. RTECALL
// =============================================================================

/** rtecall la API cap thap; tham so phu thuoc routine/RAD duoc goi. */
function exampleShowMessage(message, severity) {
  var returnCode = new SCDatum();
  return _rtecall("msg", returnCode, message, severity || 0);
}

// Ghi chu:
// _val(value, type): 1 Number, 2 Character, 3 Datetime, 4 Logical,
// 8 Array, 9 Structure, 11 Expression.
// _insert(smArray, position, count, value) chen vao mang SM.
// Voi JavaScript Array thuan, uu tien push() hoac splice().
