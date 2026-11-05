var escapeDbField = lib.upgradeHelper.escapeDbField;

function getAllSupportedLanguages() {
    return ["en", "ar", "cs", "de", "es", "fr", "he", "hu", "it", "ja", "ko", "nl", "pl", "pt-Br", "ru", "tr", "zh-Hans"];
}

function getLocalizeTables() {
    return [{
            "table": "format",
            "field": "syslanguage"
        },
        {
            "table": "help",
            "field": "syslanguage"
        },
        {
            "table": "scmessage",
            "field": "syslanguage"
        },
        {
            "table": "htmltemplates",
            "field": "language"
        },
        {
            "table": "msMessageTemplate",
            "field": "language"
        },
        {
            "table": "unitofmeasure",
            "field": "syslanguage"
        }
    ];
}

function getActivedSupportedLanguages() {
    var activedSupportedLanguages = [];
    var allSupportedLanguages = getAllSupportedLanguages();
    var i;
    for (i = 0; i < allSupportedLanguages.length; i++) {
        var active = getLanguageActive(allSupportedLanguages[i]);
        var applied = isLanguageApplied(allSupportedLanguages[i]);
        if (active && applied) {
            activedSupportedLanguages.push(allSupportedLanguages[i]);
        }
    }

    return activedSupportedLanguages;
}

function storeActivedLanguages() {
    vars["$G.actived.languages"] = [];
    var language = new SCFile("language", SCFILE_READONLY);
    var rc = language.doSelect("active=true");
    while (rc == RC_SUCCESS) {
        vars["$G_actived_languages"].push(language["unique.id"]);
        rc = language.getNext();
    }
}

function fixLanguagesPost() {
    updateLanguageActive();
    removeObsoletedHebrew();
}

function updateLanguageActive() {
    lib.upgradeLog.upgrade("Update language active.");
    lib.upgradeLog.detail("Update language active.");

    if (!getLanguageActive("pt-Br") && getLanguageSelected("pt-Br")) {
        setLanguageActive("pt-Br", true);
    }

    if (vars["$G.actived.languages"] == null) {
        vars["$G.actived.languages"] = [];
    }

    var dbdict = lib.upgradeUtility.getRecord("dbdict", "name=\"upgradestatus\"");
    if (dbdict != null) {
        var status = lib.upgradeUtility.getRecord("upgradestatus", "true");
        if (status != null) {
            var i;
            var length = status.lang_selected.length();
            for (i = 0; i < length; i++) {
                if (status["lang_selected"][i]["selected"]) {
                    vars["$G_actived_languages"].push(status["lang_selected"][i]["language.code"]);
                }
            }
        }
    }

    var language = new SCFile("language");
    var rc = language.doSelect("active=true");
    while (rc == RC_SUCCESS) {
        if (language["unique.id"] != "en" && lib.ArrayUtil.indexOf(vars["$G_actived_languages"], language["unique.id"]) < 0) {
            language["active"] = false;
            lib.upgradeLog.detail("The language " + language["unique.id"] + " is set to inactive.");
            language.doUpdate();
        }
        rc = language.getNext();
    }

    if (getLanguageActive("pt-Br")) {
        setLanguageActive("pt", false);
    }
}

// Invoke during upgrade build. After load all language str files, set languages active
function setAllSupportedLanguagesActive(active) {
    if (active == null) {
        active = true;
    }

    var langs = getAllSupportedLanguages();
    var length = langs.length;
    var i;
    for (i = 0; i < length; i++) {
        setLanguageActive(langs[i], active);
    }
}

function removeObsoletedHebrew() {
    var language = lib.upgradeUtility.getRecord("language", "unique.id=\"iw\" and language=\"Hebrew\"");
    if (language != null) {
        lib.upgradeLog.upgrade("Remove obsoleted language Hebrew iw.");
        lib.upgradeLog.detail("Remove obsoleted language Hebrew iw.");
        language.doDelete();
    }
}

function isLanguageSupported(englishOnly) {
    if (englishOnly == null) {
        englishOnly = false;
    }

    //return englishOnly;
    return true;
}

function getUnsupportLanguageMessage() {
    return "The Upgrade Utility does not support multi-languages.";
}

function fixLanguages() {
    var active = getLanguageActive("pt-Br");
    if (active) {
        return;
    }

    var selected = getLanguageSelected("pt-Br");
    if (!selected) {
        return;
    }

    var fromVersion = lib.upgradeVersionUtil.getUpgradeFromVersion();
    var fromIndex = lib.upgradeVersionUtil.getVersionIndex(fromVersion);

    if (fromIndex >= 0 && fromIndex <= lib.upgradeVersionUtil.getVersionIndex("9.31.0022 PDCP3")) {
        cleanAllDuplicatedLangData("pt-Br");
        fixTableLanguage("format", "pt", "pt-Br");
        fixTableLanguage("help", "pt", "pt-Br");
        fixTableLanguageFast("scmessage", "pt", "pt-Br");
    }
}

function fixTableLanguage(table, oldlang, newlang) {
    if (oldlang == newlang) {
        return;
    }

    lib.upgradeLog.upgrade("Fixing " + table + " language from " + oldlang + " to " + newlang);
    lib.upgradeLog.detail("Fixing " + table + " language from " + oldlang + " to " + newlang);
    print("Fixing " + table + " language from " + oldlang + " to " + newlang);

    var file = new SCFile(table);
    var rc = file.doSelect("syslanguage=\"" + oldlang + "\"");
    var count = 0;
    while (rc == RC_SUCCESS) {
        file.syslanguage = newlang;
        file.doUpdate();
        count++;
        if (count % 1000 == 0) {
            print("Fixed " + count + " records of " + table + " from " + oldlang + " to " + newlang);
        }
        rc = file.getNext();
    }

    if (count == 0 || count % 1000 != 0) {
        print("Fixed " + count + " records of " + table + " from " + oldlang + " to " + newlang);
    }

    lib.upgradeLog.detail("Fixed " + count + " records of " + table + " from " + oldlang + " to " + newlang);
}

function fixTableLanguageFast(table, oldlang, newlang) {
    if (oldlang == newlang) {
        return;
    }

    var tablename = lib.upgradeUtility.getDatabaseTableName(table);
    if (tablename == null) {
        return;
    }

    lib.upgradeLog.upgrade("Fixing " + table + " language from " + oldlang + " to " + newlang);
    lib.upgradeLog.detail("Fixing " + table + " language from " + oldlang + " to " + newlang);
    print("Fixing " + table + " language from " + oldlang + " to " + newlang);

    var dbType = lib.dbdictHelper.getDbType();

    var sql = "update " + tablename + " set " + escapeDbField(dbType, "SYSLANGUAGE") + "='" + newlang + "' where " + escapeDbField(dbType, "SYSLANGUAGE") + "='" + oldlang + "'";
    var ret = lib.upgradeHelper.executeSQL(sql);

    lib.upgradeLog.upgrade("Finish fixing " + table + " language from " + oldlang + " to " + newlang);
    lib.upgradeLog.detail("Finish fixing " + table + " language from " + oldlang + " to " + newlang);
    print("Finish fixing " + table + " language from " + oldlang + " to " + newlang);
}

function cleanAllDuplicatedLangData(lang) {
    cleanDuplicatedLangData("format", lang);
    cleanDuplicatedLangData("help", lang);
    cleanDuplicatedLangData("scmessage", lang);
}

function cleanDuplicatedLangData(table, lang) {
    lib.upgradeLog.upgrade("Cleaning records of " + table + " for " + lang);
    lib.upgradeLog.detail("Cleaning records of " + table + " for " + lang);
    print("Cleaning records of " + table + " for " + lang);

    var dbType = lib.dbdictHelper.getDbType();

    var tablename = lib.upgradeUtility.getDatabaseTableName(table);

    var sql = "delete from " + tablename + " where " + escapeDbField(dbType, "SYSLANGUAGE") + "='" + lang + "'";
    var ret = lib.upgradeHelper.executeSQL(sql);

    lib.upgradeLog.upgrade("Finish cleaning records of " + table + " for " + lang);
    lib.upgradeLog.detail("Finish cleaning records of " + table + " for " + lang);
    print("Finish cleaning records of " + table + " for " + lang);
}

function getLanguageQuery(table) {
    var languages = getSelectedLanguages();

    var language_field = getLanguageField(table);

    var query = language_field + "=\"en\"";
    var i;
    for (i = 0; i < languages.length; i++) {
        query += " or " + language_field + "=\"" + languages[i] + "\"";
    }

    return "(" + query + ")";
}

function getLanguageField(table) {
    if (table == "htmltemplates" || table == "msMessageTemplate") {
        return "language";
    }

    return "syslanguage";
}

function isLanguageTable(table) {
    var language_tables = ["scmessage", "help", "format", "unitofmeasure", "htmltemplates", "msMessageTemplate"];
    return lib.ArrayUtil.contains(language_tables, table);
}

function getSelectedLanguages(upgstatus) {
    var languages = [];

    var status = upgstatus;
    if (status == null) {
        status = lib.upgradeUtility.getRecord("upgradestatus", "true");
    }
    if (status == null || status["lang.selected"] == null) {
        return languages;
    }

    var i;
    var length = status["lang.selected"].length();
    for (i = 0; i < length; i++) {
        if (status["lang.selected"][i]["selected"]) {
            languages.push(status["lang.selected"][i]["language.code"]);
        }
    }

    return languages;
}

function getSelectedLanguagesString() {
    var strLanguages = [];

    var status = lib.upgradeUtility.getRecord("upgradestatus", "true");
    if (status == null || status["lang.selected"] == null) {
        return strLanguages.toString();
    }

    var i;
    var length = status["lang.selected"].length();
    for (i = 0; i < length; i++) {
        if (status["lang.selected"][i]["selected"]) {
            strLanguages.push(status["lang.selected"][i]["language"]);
        }
    }

    return strLanguages.toString();
}

function getLanguageSelected(lang) {
    if (lang == null) {
        return false;
    }

    var status = lib.upgradeUtility.getRecord("upgradestatus", "true");
    if (status == null || status["lang.selected"] == null) {
        return false;
    }

    var i;
    var length = status["lang.selected"].length();
    for (i = 0; i < length; i++) {
        if (status["lang.selected"][i]["language.code"] == lang) {
            return status["lang.selected"][i]["selected"];
        }
    }

    return false;
}

function getLanguageActive(lang) {
    if (lang == null) {
        return false;
    }

    var language = lib.upgradeUtility.getRecord("language", "unique.id=\"" + lang + "\"");
    if (language == null) {
        return false;
    }

    return language.active;
}

function setLanguageActive(lang, active) {
    if (lang == null) {
        return;
    }

    if (active == null) {
        active = true;
    }

    var language = lib.upgradeUtility.getRecord("language", "unique.id=\"" + lang + "\"");
    if (language != null && language.active != active) {
        language.active = active;
        language.doUpdate();
    }
}

function isLanguageApplied(lang) {
    var formatCount = getLocalizedRecordsCount("format", lang);
    var messageCount = getLocalizedRecordsCount("scmessage", lang);
    return formatCount > 4000 && messageCount > 10000;
}

function getLocalizedRecordsCount(table, lang, field) {
    if (field == null) {
        field = "syslanguage";
    }
    var file = new SCFile(table, SCFILE_READONLY);
    file.setFields(field);
    var count = file.doCount(field + "=\"" + lang + "\"");
    return count;
}