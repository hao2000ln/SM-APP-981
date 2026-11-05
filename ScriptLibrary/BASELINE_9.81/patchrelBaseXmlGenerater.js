/*
 * Please generate the base version xml files according following steps:
 * - Install base version oob dataset
 * - Load transfer.bin, patchrel.inf and patchrel.mak
 * - Execute current JS
 */
var $ = lib.c.$;

/**
 * Generate 3 way merge XML files
 *
 * @param	{String} 	name of Patches record
 */
function generate(base) {

    var folder = "C:\\Temp\\upgrade\\";

    if (base == null) {
        base = "APM";
    }

    var list = getFileList(base);

    var total = 0;
    var Generater = lib.upgradeBaseXmlGenerater;

    var i;
    for (i = 0; i < list.length; i++) {

        var tableName = list[i];

        if (!lib.upgradeUtility.isDbdictExist(tableName)) {
            continue;
        }

        var make = $("signaturemake", SCFILE_READONLY).select('table.name="' + tableName + '"').uniqueResult();

        var objQuery = 'object.name#"' + tableName + ',"';
        var fieldExclusion = Generater.getExclusion(tableName, make.fields, make.fieldarray_type);

        var number = 0;

        // export xml file according to patchrelobjects record 				
        $("patchrelobjects", SCFILE_READONLY).select(objQuery).iterate(function(pobj) {

            var contents = pobj.contents;
            var content = contents[0];
            var query = content.query;

            // exclude unrelease data
            query = Generater.adjustUnreleasedDataQuery(tableName, query);

            var file = $(tableName, SCFILE_READONLY).select(query).uniqueResult();
            if (file == null) {
//				print(tableName + ":" + content.query + " not found.");
                return false;
            }

            number++;

            var subFolder = folder + tableName + "\\";
            makeDir(subFolder);
            var path = subFolder + Generater.getFileName(file, make.key) + ".xml";
            Generater.saveToXML(file, path, fieldExclusion);
        });

        if (number > 0) {
            print(tableName + ": " + number + " xml files generated.");
            total += number;
        }
    }

    print(total + " xml files generated.");
}


/**
 * Generate file list according to the patches record
 *
 * @param		{String}	name of patches record
 * @returns	{Array}		file list
 */
function getFileList(base) {

    var patches = $("patches", SCFILE_READONLY).select("name=\"" + base + "\"").uniqueResult();
    if (patches == null) {
        print('patches record "' + base + '" not found!');
        return [];
    }

    var list = [];

    // exclude unnecessary files
    var fileExclude = ["application", "code", "displaycache", "enclapplication", "enclapplrev", "format"];

    var tables = patches.secondary;

    var length = tables.length();
    var i;
    for (i = 0; i < length; i++) {
        var table = tables[i];
        var tableName = table[0];
        var tableQuery = table[2];

        if (tableQuery == "false" || fileExclude.indexOf(tableName) >= 0) {
            continue;
        }

        list.push(tableName);
    }

    return list;
}

//generate();