function File(fileName, fields, sortBy, orderBy) {
    this.fileName = fileName;

    if (sortBy) {
        this.sortBy = sortBy;
    }

    if (orderBy) {
        if (!(orderBy instanceof Array)) {
            orderBy = [orderBy];
        }

        var orderValues = {
            ASC: SCFILE_ASC,
            DESC: SCFILE_DSC,
            DSC: SCFILE_DSC
        };
        orderValues[(SCFILE_ASC).toString()] = SCFILE_ASC;
        orderValues[(SCFILE_DSC).toString()] = SCFILE_DSC;

        var i;
        for (i = 0; i < orderBy.length; ++i) {
            if (orderBy[i] === SCFILE_ASC || orderBy[i] === SCFILE_DSC) {
                continue;
            } else if (typeof orderBy[i] == 'string' && orderValues[orderBy[i].toUpperCase()]) {
                orderBy[i] = orderValues[orderBy[i].toUpperCase()];
            } else {
                orderBy[i] = SCFILE_ASC;
            }
        }

        this.orderBy = orderBy;
    } else {
        this.orderBy = [SCFILE_ASC];
    }

    if (fields == undefined) {
        this.scFile = new SCFile(fileName);
    } else {
        this.scFile = new SCFile(fileName, SCFILE_READONLY);
        this.scFile.setFields(fields);
    }

    if (this.sortBy) {
        this.scFile.setOrderBy([].concat(this.sortBy), this.orderBy);
    }
}

File.prototype.setPaging = function(start, size) {
    this.paging = true;
    this.pageStart = start;
    this.pageSize = size;
};

File.prototype.getRecords = function(queryString) {
    var scReturnCode = this.scFile.doSelect(queryString);
    if (scReturnCode == RC_BAD_QUERY) {
        throw new Error('Bad Query:' + queryString);
    }

    if (scReturnCode == RC_NO_MORE) {
        return null;
    }

    var file = this;
    return {
        "scFile": this.scFile,
        "scReturnCode": scReturnCode,
        "each": function(run) {
            if (this.scReturnCode == RC_SUCCESS) {
                this.scFile.getFirst();
                var pi = 1;
                do {
                    if (file.paging) {
                        if (pi < file.pageStart) {
                            ++pi;
                            continue;
                        } else if (pi >= file.pageStart + file.pageSize) {
                            break;
                        } else {
                            ++pi;
                        }
                    }
                    if (run(this.scFile) === false) {
                        break;
                    }
                } while (this.scFile.getNext() == RC_SUCCESS);
            }
        }
    };
};

function getQueryByRecord(record) {
    var lRtnCode = new SCDatum();
    var lRtnSql = new SCDatum();
    var lTag = getTagByRecord(record);
    var lInitedFile = new SCFile(funcs.filename(record));
    funcs.rtecall("tagquery", lRtnCode, lInitedFile, lRtnSql, lTag, false);

    return funcs.str(lRtnSql);
}

function getTagByRecord(record) {
    var lRtnCode = new SCDatum();
    var lTag = new SCDatum();
    funcs.rtecall("tag", lRtnCode, lTag, record);

    return funcs.str(lTag);
}

function getQueryByTag(lTag) {
    var tableName = getFilenameByTag(lTag);
    var dbdict = new SCFile("dbdict");
    var sql = "";
    if (dbdict.doSelect("name=\"" + tableName + "\"") == RC_SUCCESS) {
        var lInitedFile = new SCFile(tableName);
        var lRtnCode = new SCDatum();
        var lRtnSql = new SCDatum();
        funcs.rtecall("tagquery", lRtnCode, lInitedFile, lRtnSql, lTag, false);

        sql = funcs.str(lRtnSql);
    }

    return sql;
}

function getFilenameByTag(lTag) {
    return lTag.substring(0, lTag.indexOf(";"));
}

// Delete a record by get it using query
function deleteByRecord(lRecord) {
    var sql = getQueryByRecord(lRecord);
    var fRecord = new SCFile(funcs.filename(lRecord));
    if (fRecord.doSelect(sql) == RC_SUCCESS) {
        if (fRecord.doRemove() == RC_SUCCESS) {
            return true;
        }
    }

    return false;
}