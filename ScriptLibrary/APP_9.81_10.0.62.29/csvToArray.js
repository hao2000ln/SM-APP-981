/* Copyright 2012-2013 Daniel Tillin
	@include: cvsToArray 2.1 
	@website: https://code.google.com/p/csv-to-array/
 */
var util = lib.ArrayUtil;
var _scmsg = funcs.scmsg;
var _rtecall = funcs.rtecall;

function exec(strData, descriptor, rowstoread, headers) {
    var str = strData.join('\n');
    var mode = 'proceed';
    var o = { 'fSep': getDelim(descriptor), 'head': false };
    if (!headers) {
        rowstoread = 1;
        o['trim'] = true;
    }

    if (rowstoread == 200) {
        mode = 'test';
        rowstoread = 10;
    }

    var ret = csvToArray(str, o, rowstoread, descriptor, headers);
    return ret;
}

function csvToArray(str, o, rowstoread, descriptor, headers) {
    var caseConversion = descriptor['translate'];
    var conversionFunc = null;
    if (caseConversion) {
        conversionFunc = caseConversion == 'uc' ? funcs.toupper : funcs.tolower;
    }
    var added = 0;
    var updated = 0;
    var counter = 0;

    str += '\n';
    var retVal = new SCDatum();
    retVal.setType(8);
    var lineCounter = 0;
    var sfn = descriptor['name'];
    var fields = descriptor['fields'];
    var lines = util.toJsArray(fields);
    var array_sep = descriptor['array.parser'];
    switch (array_sep) {
        case 'semicolon':
            array_sep = ';';
            break;
        case 'line breaker':
            array_sep = '\n';
            break;
        default:
            array_sep = '\n';
    }

    var od = {
        'fSep': ',',
        'rSep': '\n',
        'quot': '"',
        'head': false,
        'trim': false
    };

    if (o) {
        var i;
        for (i in od) {
            if (!o[i]) {
                o[i] = od[i];
            }
        }
    } else {
        o = od;
    }

    var breaker = true;
    var a = [
        ['']
    ];

    var r = 0;
    var f = 0;
    var q = 0;
    var p;
    for (p = 0; breaker && p < str.length + 1; p++) {
        var c = str.charAt(p);
        switch (c) {
            case o.quot:
                if (q && str.charAt(p + 1) == o.quot) {
                    a[r][f] += o.quot;
                    ++p;
                } else {
                    q ^= 1;
                }
                break;
            case o.fSep:
                if (!q) {
                    if (o.trim) {
                        a[r][f] = a[r][f].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                    }
                    a[r][++f] = '';
                } else {
                    a[r][f] += c;
                }
                break;
            case o.rSep.charAt(0):
                if (!q && (!o.rSep.charAt(1) || (o.rSep.charAt(1) && o.rSep.charAt(1) == str.charAt(p + 1)))) {
                    if (o.trim) {
                        a[r][f] = a[r][f].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                    }

                    var line;
                    var source;

                    if (rowstoread && rowstoread == 1) {
                        if (r == rowstoread) {
                            breaker = false;
                        }
                        a[1] = util.toSCDatum(a[1]);
                    } else if (rowstoread && rowstoread == 10) { // get test
                        // array
                        line = a[r];
                        source = buildSCObject(headers, line, conversionFunc);
                        var element = [];
                        util.each(lines, function(map) {
                            var column_name = map['source.column'];
                            if (column_name) {
                                element.push(source[column_name]);
                            }
                        });

                        retVal.push(element);
                        if (lineCounter++ == r + 1) {
                            breaker = false;
                        }
                    }
                    // do data insert/update
                    else {
                        if (headers) {
                            if (++counter % 100 == 0) {
                                var totalRecordsMsg = _scmsg(3009, "us", [counter]);
                                _rtecall("msg", "", totalRecordsMsg);
                            }
                            if (a[r].length < headers.length()) {
                                var emptyLineMsg = _scmsg(3006, "us", [descriptor['skip.lines'] + counter]);
                                _rtecall("msg", "", emptyLineMsg);
                                continue;
                            }
                            line = a[r];
                            source = buildSCObject(headers, line, conversionFunc);
                            a[r] = "";
                            var target = new SCFile(sfn);
                            util.each(lines, function(map) {
                                var column_name = map['source.column'];
                                var field_name = map['field.name'];
                                if (field_name != null) {
                                    target[field_name] = parseField(source[column_name], map, array_sep);
                                }
                            });
                            eval(descriptor['javascript']);

                            try {
                                var count = cu(target, descriptor);
                                if (count == RC_SUCCESS) {
                                    updated++;
                                    var updateMsg = _scmsg(3008, "us", [counter + 1]);
                                    _rtecall("msg", "", updateMsg);
                                } else {
                                    added++;
                                }
                            } catch (e) {
                                if (e.message == 'fc') {
                                    var fcErrorMsg = _scmsg(3011, "us", [(counter + 1)]);
                                    _rtecall("msg", "", fcErrorMsg);
                                } else {
                                    var modifyRecordError = _scmsg(3007, "us", [counter + 1]);
                                    _rtecall("msg", "", modifyRecordError);
                                }
                            }
                        }
                    }
                    a[++r] = [''];
                    a[r][f = 0] = '';
                    if (o.rSep.charAt(1)) {
                        ++p;
                    }
                } else {
                    a[r][f] += c;
                }
                break;
            default:
                a[r][f] += c;
        }

        if (rowstoread && r == rowstoread) {
            break;
        }
    }

    if (o.head && headers) {
        a.shift();
    }
    if (a[a.length - 1].length < a[0].length) {
        a.pop();
    }
    if (rowstoread == 10) {
        a = retVal;
    }
    if (headers && rowstoread != 10) {
        var resultMsg = _scmsg(3010, "us", [added, updated]);
        _rtecall("msg", "", resultMsg);
        return;
    }

    return a;
}

function caseConversion(func, string) {
    if (!func) {
        return string;
    } else {
        return func(string);
    }
}

function cu(target, descriptor) {
    var key = lib.DBUtils.getQueryByRecord(target);
    var fn = funcs.filename(target);
    var tmp = new SCFile(fn);
    var rc = tmp.doSelect(key);
    var fctl = descriptor['format.control'];
    var ret;

    if (rc == RC_SUCCESS) {
        if (fctl) {
            ret = fc(target, fctl, 'update');
            if (ret == 'error') {
                throw new Error("fc");
            }
        }
        var conTarget = funcs.contents(target);
        var conTmp = funcs.contents(tmp);
        var item;
        var itemLoopTimes = conTarget.length();
        for (item = 0; item < itemLoopTimes; item++) {
            if (funcs.str(conTarget[item]) && !funcs._null(conTarget[item]) && conTarget[item] != conTmp[item]) {
                tmp[item] = target[item];
            }
        }
        tmp.doUpdate();
    } else {
        if (fctl) {
            ret = fc(target, fctl, 'add');
            if (ret == 'error') {
                throw new Error("fc");
            }
        }
        target.doInsert();
    }

    return rc;
}


function getDelim(descriptor) {
    var ret = ',';
    switch (descriptor['delim.type']) {
        case 'comma':
            ret = ',';
            break;
        case 'tab':
            ret = '\t';
            break;
        case 'semicolon':
            ret = ';';
            break;
        case 'other':
            ret = descriptor['delim.other'];
            break;
        default:
            ret = ',';
    }

    return ret;
}

function fc(target, fctl, mode) {
    var exit = new SCDatum();
    exit.setType(2);
    var ex2 = new SCDatum();
    var names = ['string1', 'file', 'query', 'prompt', 'record'];
    var values = [fctl, target, mode, exit, null];

    var r = funcs.rtecall("callrad", ex2, 'fc.bg', names, values, false);
    var ret = vars.$record;
    funcs.cleanup(vars.$record);
    if (funcs.str(vars.$exit) == 'error' || funcs.str(vars.$exit) == 'bad.val') {
        vars.$exit = 'normal';
        return 'error';
    } else {
        target = vars.$record;
    }
}

function findDuplicatedElements(fields) {
    if (fields == null) {
        return null;
    }

    var hash = [];
    // build hash
    var arr = lib.ArrayUtil.toJsArray(fields);
    var n;
    for (n = arr.length; n > 0; n--) {
        if (typeof hash[arr[n]] === 'undefined') {
            hash[arr[n]] = [];
        }
        hash[arr[n]].push(n);
    }

    // work with compiled hash (not necessary)
    var duplicates = [];
    var key;
    for (key in hash) {
        if (hash.hasOwnProperty(key) && hash[key].length > 1) {
            duplicates.push(key);
        }
    }

    return lib.ArrayUtil.toSCDatum(duplicates);
}

function buildSCObject(headers, line, conversionFunc) {
    var source = {};
    var i;
    var iLoopTimes = headers.length();
    for (i = 0; i < iLoopTimes; i++) {
        source[headers[i]] = caseConversion(conversionFunc, line[i]);
    }
    return source;
}

/**
 * convert the givin date string to current login user formatted date string
 */
function dm(fmt, dt) {
    var d = new Date();
    var sysutil = lib.SysUtil;
    var date = {
        'mm': 0,
        'dd': 0,
        'yy': 0,
        'hh': 0,
        'ii': 0,
        'ss': 0
    };

    var i;
    for (i in date) {
        var index = fmt.indexOf(i);
        if (index > -1) {
            date[i] = parseInt(dt.substr(fmt.indexOf(i), 2) || 0, 10);
        }
    }

    return {
        'date': date,
        'toSMdate': function() {
            return sysutil._datemake(date['yy'], date['mm'], date['dd'], date['hh'], date['ii'], date['ss']);
        }
    };
}

function checkGrammar(descriptor) {
    var js = descriptor['javascript'];
    var ret = compile(js);
    return ret;
}

function getIndexList(fileList, cols) {
    var indexList = new SCDatum();
    indexList.setType(8);
    var i;
    var length = funcs.lng(fileList);
    for (i = 0; i < length; i++) {
        var item = fileList[i];
        indexList.push(lib.ArrayUtil.indexOf(cols.toArray(), item));
    }

    return indexList;
}


function parseField(value, line, array_sep) {
    var type = line['field.type'];
    var retValue;

    switch (funcs.str(type)) {
        case '1': // for number field
            retValue = parseFloat(value);
            break;
        case '4': // for bool, assume '0', 'false', '-1' as false, others
            // are true
            if (util.contains(['0', 'false', '-1', 'f', 'FALSE', 'False'], value)) {
                retValue = false;
            } else {
                retValue = true;
            }
            break;
        case '3':
            var fmt = line['date.format'];
            retValue = dm(fmt, value).toSMdate();
            break;
        case '8':
            retValue = value ? value.split(array_sep || '\n') : [];
            break;
        default:
            retValue = value;
    }

    return retValue;
}