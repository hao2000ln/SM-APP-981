var $ = lib.c.$;
var _denull = funcs.denull;
var _null = funcs._null;
var msg = funcs.scmsg;

var ProblemService = $(new function() {
    var dataService = $("#dataService");

    return {
        isDuplicateProblem: function(currentrecord, record, parentrecord) {
            var Dpbms = [];
            var path;
            vars.$L_sf = funcs.rtecall("sort", vars.$L_rc, record.hasDuplicate_Problems, 0, 0);
            Dpbms = _denull(record.hasDuplicate_Problems);
            if (!_null(Dpbms)) {
                var m;
                var length = funcs.lng(Dpbms);
                for (m = 0; m < length; m++) {

                    path = msg(353, "pm", [parentrecord, Dpbms[m]]);

                    if (Dpbms[m] == currentrecord.id) {
                        return path;
                    } else {
                        var childrecord = $("rootcause").select('id="' + Dpbms[m] + '"').uniqueResult();
                        path = path + ";" + Dpbms[m];
                        return this.isDuplicateProblem(currentrecord, childrecord, path);
                    }
                }
            }
            return null;
        },

        updateDuplicateProblems: function(record, oldrecord) {
            var hasNewDpbms = [];
            var hasDelDpbms = [];
            var flag;

            var i;
            var j;
            var m;
            var ilength = record.hasDuplicate_Problems.length();
            var jlength = oldrecord.hasDuplicate_Problems.length();

            for (i = 0; i < ilength; i++) {
                flag = false;
                for (j = 0; j < jlength; j++) {
                    if (oldrecord.hasDuplicate_Problems[j] == record.hasDuplicate_Problems[i]) {
                        flag = true;
                        break;
                    }
                }
                if (flag == false || funcs._null(oldrecord.hasDuplicate_Problems)) {
                    hasNewDpbms.push(record.hasDuplicate_Problems[i]);
                }
            }

            ilength = oldrecord.hasDuplicate_Problems.length();
            jlength = record.hasDuplicate_Problems.length();
            for (i = 0; i < ilength; i++) {
                flag = false;
                for (j = 0; j < jlength; j++) {
                    if (oldrecord.hasDuplicate_Problems[i] == record.hasDuplicate_Problems[j]) {
                        flag = true;
                        break;
                    }
                }
                if (flag == false || funcs._null(record.hasDuplicate_Problems)) {
                    hasDelDpbms.push(oldrecord.hasDuplicate_Problems[i]);
                }
            }

            var file;
            for (m = 0; m < hasDelDpbms.length; m++) {

                file = $("rootcause").select("id=\"" + hasDelDpbms[m] + "\"").uniqueResult();
                if (file != null) {
                    file.isDuplicate_Problem = null;
                    dataService.updateWithoutTrigger(file);
                }
            }

            for (m = 0; m < hasNewDpbms.length; m++) {

                file = $("rootcause").select("id=\"" + hasNewDpbms[m] + "\"").uniqueResult();
                if (file != null) {
                    var oldfile = $("rootcause").select("id=\"" + file.isDuplicate_Problem + "\"").uniqueResult();
                    if (oldfile != null) {
                        var hasDpbms = [];
                        ilength = oldfile.hasDuplicate_Problems.length();
                        for (i = 0; i < ilength; i++) {
                            if (oldfile.hasDuplicate_Problems[i] != file.id) {
                                hasDpbms.push(oldfile.hasDuplicate_Problems[i]);
                            }
                        }
                        oldfile.hasDuplicate_Problems = hasDpbms;
                        dataService.updateWithoutTrigger(oldfile);
                    }
                    file.isDuplicate_Problem = record.id;
                    dataService.updateWithoutTrigger(file);
                }
            }
        },

        isDuplicateofProblem: function(currentrecord, record, childrecord) {
            childrecord = childrecord || "";
            var Dopbm = record.isDuplicate_Problem;
            var path = msg(352, "pm", [Dopbm, record["id"] + ";" + childrecord]);

            if (!_null(Dopbm)) {

                if (Dopbm == currentrecord.id) {
                    return path;
                } else {
                    var parentrecord = $("rootcause").select('id="' + Dopbm + '"').uniqueResult();
                    return this.isDuplicateofProblem(currentrecord, parentrecord, path);
                }
            }
            return null;
        },

        updateDuplicateofProblem: function(record, oldrecord) {
            vars.$L_sf = funcs.rtecall("sort", vars.$L_rc, record.hasDuplicate_Problems, 0, 0);
            record.hasDuplicate_Problems = _denull(record.hasDuplicate_Problems);
            var hasDpbms = [];
            var file;
            if (funcs._null(oldrecord.isDuplicate_Problem)) {

                file = $("rootcause").select("id=\"" + record.isDuplicate_Problem + "\"").uniqueResult();
                if (file != null) {
                    if (funcs._null(file.hasDuplicate_Problems)) {
                        hasDpbms.push(record.id);
                        file.hasDuplicate_Problems = hasDpbms;
                    } else {
                        file.hasDuplicate_Problems.push(record.id);
                    }
                    dataService.updateWithoutTrigger(file);
                }
            } else {
                var ret;
                file = $("rootcause").select("id=\"" + oldrecord.isDuplicate_Problem + "\"").uniqueResult();
                if (file != null) {
                    var i;
                    var length = file.hasDuplicate_Problems.length();
                    for (i = 0; i < length; i++) {
                        if (file.hasDuplicate_Problems[i] != record.id) {
                            hasDpbms.push(file.hasDuplicate_Problems[i]);
                        }
                    }
                    file.hasDuplicate_Problems = hasDpbms;
                    dataService.updateWithoutTrigger(file);
                }

                if (!funcs._null(record.isDuplicate_Problem)) {
                    var file2 = $("rootcause").select("id=\"" + record.isDuplicate_Problem + "\"").uniqueResult();
                    if (file2 != null) {
                        if (funcs._null(file2.hasDuplicate_Problems)) {
                            var hasDpbms2 = [];
                            hasDpbms2.push(record.id);
                            file2.hasDuplicate_Problems = hasDpbms2;
                        } else {
                            file2.hasDuplicate_Problems.push(record.id);
                        }
                        dataService.updateWithoutTrigger(file2);
                    }
                }
            }
        },

        validateDuplicateProblems: function(file) {
            vars.$L_sf = funcs.rtecall("sort", vars.$L_rc, file.hasDuplicate_Problems, 0, 0);
            file.hasDuplicate_Problems = _denull(file.hasDuplicate_Problems);
            var i;
            var length = file.hasDuplicate_Problems.length();
            for (i = 0; i < length; i++) {

                var record = $("rootcause", SCFILE_READONLY).setFields(["id"]).select('id="' + file.hasDuplicate_Problems[i] + '"').uniqueResult();

                if (_null(record)) {
                    return i;
                }
            }
            return -1;
        },

        getAvailableCatsCount: function(filename, cattablename, catname, includeself) {
            var sql = "active=true";
            var _str = funcs.str;
            var area = lib.security.getArea(filename);
            var allowedCategory = lib.security.getRights(area, "allowedCategory");
            vars.$L_sf = funcs.rtecall("sort", vars.$L_rc, allowedCategory, 0, 0);
            allowedCategory = _denull(allowedCategory);
            if (!includeself) {
                sql += ' and name~="' + catname + '"';
            }
            if (!_null(allowedCategory)) {
                sql += " and name isin " + _str(allowedCategory);
            }
            var count = $(cattablename, SCFILE_READONLY).count(sql);
            return funcs.nullsub(count, 0);
        },

        getRelatedRecordCount: function(source, relatedfile) {
            var sql = "source=\"" + source + "\"";
            if (relatedfile != "") {
                sql += " and depend.filename=\"" + relatedfile + "\"";
            }
            var count = $("screlation", SCFILE_READONLY).setFields(["source"]).count(sql);
            return funcs.nullsub(count, 0);
        },

        getLastTaskNo: function(id) {
            var initDbdictFile = lib.dbdictHelper.initDbdictFile;
            var dbType = lib.dbdictHelper.getDbType();
            var adapter = lib.DataService.getAdaptor(dbType);
            var rcTaskSqlTable = $("#dbdictService").getPrimaryTable(initDbdictFile("rootcausetask"))[1];
            var sql = "select count(*) from " + rcTaskSqlTable + " WHERE " + adapter.escapeField("PARENT_PROBLEM") + "= '" + id + "'";

            lib.RAD.run("SQLselect", ["table", "query"], ["", sql], [6, 6], ["table"]);
            funcs.evaluate(funcs.parse("$L.lastno=1 in contents(1 in $smtestresult)", 11));

            return funcs.nullsub(vars.$L_lastno, 0);
        },

        initTaskId: function(file) {
            var lastTaskNo = this.getLastTaskNo(file['parent.problem']);
            lastTaskNo = lastTaskNo + 1;
            var taskIDTmp = lastTaskNo.toString();
            var length = vars.$G_rc_global_environment.prefix_or_suffix || 3;
            var i;
            for (i = taskIDTmp.length; i < length; i++) {
                taskIDTmp = "0" + taskIDTmp;
            }
            return file['parent.problem'] + "-" + taskIDTmp;
        },

        setAffectCIs: function(file) {

            var member = $.createSCArray();
            var names = [];

            var i;
            var ilength = file.affected_ci.length();
            if (ilength > 0) {
                for (i = 0; i < ilength; i++) {
                    var ci = file.affected_ci[i];

                    var j;
                    var jlength = vars.$affected_cis.length();
                    for (j = 0; j < jlength; j++) {
                        if (ci.ci_device_name == vars.$affected_cis[j]) {
                            // don't push directly, it will break data structure, use SCStruture instead. 
                            // member.push(ci);
                            var ciDatum = $.createSCStructure();
                            ciDatum.push(ci.ci_device_name);
                            ciDatum.push(ci.ci_device_type);
                            ciDatum.push(ci.ci_assign_group);
                            ciDatum.push(ci.ci_location);
                            member.push(ciDatum);

                            // field "affected.ci.names" is a redundancy field for query
                            // because field "affected_ci" is array-structure which not support display name function 
                            names.push(ci.ci_device_name);

                            break;
                        }
                    }
                }

                file.affected_ci = member;
                file.affected_ci_names = names;
            }

            file.affected_ci_count = _denull(file.affected_ci).length();
        },

        getAffectCIs: function(file) {
            var member = [];
            if (vars.$affected_cis == null) {
                vars.$affected_cis = {};
            }
            if (file.affected_ci.length() >= 0) {
                member.length = 0;
                var i;
                var length = file.affected_ci.length();
                for (i = 0; i < length; i++) {
                    member[i] = file.affected_ci[i].ci_device_name;
                }
                vars.$affected_cis = member;
            }
            file.affected_ci_count = _denull(file.affected_ci).length();
        },

        validateAffectCIs: function() {
            vars.$L_sf = funcs.rtecall("sort", vars.$L_rc, vars.$affected_cis, 0, 0);
            vars.$affected_cis = _denull(vars.$affected_cis);
            var i;
            var length = vars.$affected_cis.length();
            for (i = 0; i < length; i++) {

                var record = $("device", SCFILE_READONLY).setFields(["logical.name"]).select('logical.name="' + vars.$affected_cis[i] + '"').uniqueResult();
                if (_null(record)) {
                    return i;
                }
            }
            return -1;
        },

        hasOpenDependRecord: function(rid, dependfname) {

            var count = this.countOpenDependRecord(rid, dependfname);
            if (funcs.nullsub(count, 0) > 0) {
                return true;
            } else {
                return false;
            }
        },

        countOpenDependRecord: function(rid, dependfname) {

            var sql = "source=\"" + rid + "\" and depend.filename=\"" + dependfname + "\" and depend.active=true ";

            var count = $("screlation", SCFILE_READONLY).setFields(["source"]).count(sql);
            return count;
        },

        hasOpenRelatedTask: function(file) {
            var sql = "parent.problem=\"" + file["id"] + "\" and rcStatus~=\"Closed\" and rcStatus~=\"Cancelled\"";

            var count = $("rootcausetask", SCFILE_READONLY).setFields(["id"]).count(sql);
            if (funcs.nullsub(count, 0) > 0) {
                return true;
            } else {
                return false;
            }
        },

        hasOpenKnownError: function(rid, filename) {
            var sql = "source=\"" + rid + "\" and depend.filename=\"" + filename + "\" and depend.active=true ";

            var hasOpenKe = false;
            $("screlation", SCFILE_READONLY).setFields(["depend"]).select(sql).iterate(function(record) {
                var rcrecord = $("rootcause", SCFILE_READONLY).setFields(["isKnownError"]).select('id="' + record["depend"] + '"').uniqueResult();
                if (rcrecord["isKnownError"]) {
                    hasOpenKe = true;
                    return true;
                }
            });

            return hasOpenKe;
        },

        /**
         *
         *  This function to copy fields defined in link from Problem to related open Known Errors
         *
         *  @date 6/26/2014
         *  @author Yuki
         *  @param   {ke}     - knownError record
         *  @param   {pbm}     - Problem record
         *  @returns {Object} 	  - Related Known Error record
         *
         */
        copyLinkToKe: function(ke, pbm) {
            var linkname = lib.settings.getSettingValue("Problem", "post.to.link.ke"); // independent, cascade
            var rteNames = new SCDatum();
            rteNames.push("file");
            rteNames.push("record");
            rteNames.push("name");

            var rteValues = new SCDatum();
            rteValues.push(ke);
            rteValues.push(pbm);
            rteValues.push(linkname);

            // call rad "move.fields.by.link" to copy fields from problem to related known error
            funcs.rtecall("callrad", new SCDatum(), "move.fields.by.link", rteNames, rteValues, false);

            return ke;
        },

        reviewDetail: function(file, review) {
            var operator = this.getUserName();
            vars.$L_stamp = funcs.str(funcs.tod()) + " " + vars['$lo.time.zone'] +  " (" + operator + "):";
            var jsdetail = [];
            var jsstamp = [];
            var AU = lib.ArrayUtil;
            if (review != null && funcs.lng(_denull(review)) != 0) {
                if (_null(file["review.detail.log"])) {
                    file["review.detail.log"] = review;
                } else {
                    jsdetail = AU.toJsArray(_denull(review));
                    AU.addAll(jsdetail, AU.toJsArray(file["review.detail.log"]));
                    file["review.detail.log"] = jsdetail;
                }
            }
            jsdetail = [];
            jsdetail.push(vars.$L_stamp);
            lib.ArrayUtil.addAll(jsdetail, AU.toJsArray(_denull(file["review.detail.log"])));
            file["review.detail.log"] = jsdetail;
            funcs.cleanup(file['review.detail']);
        },


        journalUpdate: function(file, scupdate) {
            var operator = this.getUserName();
            vars.$L_stamp = funcs.str(funcs.tod()) + " " + vars['$lo.time.zone'] + " (" + operator + "):";
            var jsupdate = [];
            var jsstamp = [];
            var AU = lib.ArrayUtil;
            if (_null(file["update"])) {
                file["update"] = scupdate;
            } else {
                jsupdate = AU.toJsArray(scupdate);
                AU.addAll(jsupdate, AU.toJsArray(file["update"]));
                file["update"] = jsupdate;
            }
            jsupdate = [];
            jsupdate.push(vars.$L_stamp);
            lib.ArrayUtil.addAll(jsupdate, AU.toJsArray(file["update"]));
            file["update"] = jsupdate;
        },

        getUserName: function() {
            return lib.ActivityUtil.getUserName(vars.$G_rc_global_environment["full.name"]);
        },

        getWFPhase: function(problem) {
            var objectFile = $("Object", SCFILE_READONLY).setFields(["category.file.name"]).select("file.name=\"rootcause\"").uniqueResult();
            if (null == objectFile) {
                return null;
            }
            var categoryFile = $(objectFile.category_file_name, SCFILE_READONLY).setFields(["workflow"]).select("name=\"" + problem.category + "\"").uniqueResult();
            if (null == categoryFile) {
                return null;
            }
            return $("WorkflowPhase").select("tableName=\"rootcause\" and phaseName=\"" + problem.current_phase + "\" and workflowName=\"" + categoryFile.workflow + "\"").uniqueResult();
        },

        clearActivityVarsOfProblem: function() {
            vars['$pm.activity'] = [];
            vars['$rc.update'] = [];
            var record = vars['$L.file'];
            if (record != null) {
                record['cust.visible'] = false;
            }
        }
    };
});

function getClass() {
    return ProblemService;
}