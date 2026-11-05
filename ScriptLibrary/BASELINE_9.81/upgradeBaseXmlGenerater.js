/*
 * Please generate the base version xml files according following steps:
 * - Install base version oob dataset with language package installed
 * - Execute *aapm.upgrade.purge sm command to remove the upgrade files completely
 * - Load preupg.bin and transfer.bin
 * - Load upgrade.inf and upgrade-<lang>.inf
 *   Or Load upgrade-pd.info and upgrade-pd-<lang>.inf for PD
 * - Never generate for SC6.2 and SM7
 *   For SC6.2 and SM7 base versions, add "id" character-ID-VARCHAR(70)-m1 to notification table
 *   Open notification table in db side, search all the records, update "id" values with "name" values + suffix "_1" or "_2"
 *   Change the Unique key to "id" for notification table
 * - Execute current JS
 */

var versions = lib.upgradeConstants.FULL_VERSIONS();

var bigVer = getBigVersion();
var scVer = lib.upgradeVersionUtil.getCurrentVersion();

/*
generate();
*/

function generate(parent) {
    if (parent == null) {
        parent = "C:\\oob\\";
    }
    var i = 0;
    var sigmake = new SCFile("signaturemake", SCFILE_READONLY);
    var rc = sigmake.doSelect("table.name~=\"displaycache\" and table.name~=\"code\" and table.name~=\"application\" and table.name~=\"enclapplication\" and table.name~=\"enclapplrev\" and table.name~=\"format\"");
    while (rc == RC_SUCCESS) {
        var j = 0;
        var folder = parent + bigVer + "\\" + sigmake.table_name;
        var file = new SCFile("upgradeobjects", SCFILE_READONLY);
        var objectname = sigmake.table_name == "format" ? "Format Record" : sigmake.table_name + ",";
        rc = file.doSelect("object.name # \"" + objectname + "\"");

        while (rc == RC_SUCCESS) {
            var contents = file.contents;
            var content = contents[0];
            if (!lib.upgradeCommonHelper.isValidTable(content.table)) {
                rc = file.getNext();
                continue;
            }

            var curSig = getSignature(content.sigs, scVer);
            var newSig = content.new_sig;

            var toGenerate = false;

            if (curSig != null && curSig.length > 0 && newSig != null) {
                var k;
                for (k = 0; k < curSig.length; k++) {
                    if (curSig[k] != newSig) {
                        toGenerate = true;
                        break;
                    }
                }
            }

            if (toGenerate) {
                var object = new SCFile(content.table, SCFILE_READONLY);
                var query = adjustUnreleasedDataQuery(content.table, content.query);
                rc = object.doSelect(query);
                if (rc == RC_SUCCESS) {
                    i++;
                    j++;
                    makeDir(folder);
                    var path = folder + "\\" + getFileName(object, sigmake.key) + ".xml";

                    saveToXML(object, path, getExclusion(sigmake.table_name, sigmake.fields, sigmake.fieldarray_type));
                }
            }
            rc = file.getNext();
        }
        print((sigmake.table_name == "format" ? "Format Record" : sigmake.table_name) + ": " + j + " xml files generated.");
        rc = sigmake.getNext();
    }
    print(i + " xml files generated.");
}

function saveToXML(file, path, exclusion) {
    var text = file.getXml().toXMLString();
    text = tailor(text, exclusion);
    var rc = writeFile(path, false, text);
}

function getSignature(sigs, version) {
    var verIndex = funcs.index(version, versions);
    var signature = [];
    var lastIndex = -1;
    var i;
    var length = sigs.length();
    var tmpIndex;
    for (i = 0; i < length; i++) {
        if (sigs[i].version == version) {
            signature.push(sigs[i].sig);
            continue;
        }

        tmpIndex = funcs.index(sigs[i].version, versions);
        if (tmpIndex < verIndex && tmpIndex > lastIndex) {
            lastIndex = tmpIndex;
        }
    }

    if (signature.length == 0) {
        length = sigs.length();
        for (i = 0; i < length; i++) {
            tmpIndex = funcs.index(sigs[i].version, versions);
            if (tmpIndex == lastIndex) {
                signature.push(sigs[i].sig);
            }
        }
    }

    return signature;
}

function tailor(xml, exclusion) {
    var i;
    for (i = 0; i < exclusion.length; i++) {
        var str = "<" + exclusion[i] + "\\stype(.)*?</" + exclusion[i] + ">";
        var regex = new RegExp(str);
        xml = xml.replace(regex, "");
    }
    xml = xml.replace(/></g, ">\n<");
    return xml;
}

function getFileName(file, key) {
    var name = file[key[0]];
    var i;
    var length = key.length();
    for (i = 1; i < length; i++) {
        name += "-" + file[key[i]];
    }
    if (typeof name == "string" && name != null) {
        return name.replace(/[\s\/\?:><\"\*]/g, "_");
    }
    return name;
}

function getExclusion(table, fields, excluded) {
    if (excluded == 0) {
        return fields.toArray();
    }
    var file = new SCFile("dbdict", SCFILE_READONLY);
    var rc = file.doSelect("name=\"" + table + "\"");
    var exclusions = [];
    if (rc == RC_SUCCESS) {
        var i;
        var length = file.field.length();
        for (i = 0; i < length; i++) {
            if (file.field[i].level == 1 && funcs.index(file.field[i].name, fields) == 0) {
                exclusions[exclusions.length] = file.field[i].name;
            }
        }
    }
    return exclusions;
}

function getBigVersion() {
    var version = lib.upgradeVersionUtil.getCurrentVersion();
    var pdVersion = lib.upgradeVersionUtil.getPdVersion();
    if (version != "Unknown") {
        var verList = ["SM7.10", "7.11", "9.2", "9.3", "9.4", "9.5", "9.6", "9.7"];
        var i;
        for (i = 0; i < verList.length; i++) {
            if (version.indexOf(verList[i]) == 0) {
                if (pdVersion == "") {
                    return verList[i];
                } else {
                    return verList[i] + "PD";
                }
            }
        }
        return version;
    }
    print("Failed to get version.");
    return null;
}

/**
 * exclude unreleased data
 */
function adjustUnreleasedDataQuery(tableName, query) {
    if (tableName == "ScriptLibrary") {
        return '(' + query + ') and name~="JSLINT" and package~="SMUnitTest" and package~="AppsI18NTest"';
    }
    
    return query;
}