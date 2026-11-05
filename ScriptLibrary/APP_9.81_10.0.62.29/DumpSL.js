/**
 * Takes Service Manager ScriptLibrary files and writes them to .js files in the local operating system
 * @module DumpSL
 * @author Hao Ding <hao.ding@hp.com>
 */

/**
 * The output directory of the JS source codes
 * 
 * @private
 * @type {string}
 */
var OUTPUT_DIR = "../JSSources/";

/**
 * Whether or not to write the ScriptLibrary files defined in JSBeanFactory only
 * 
 * @private
 * @type {boolean}
 */
var JS_BEAN_ONLY = true;

/**
 * Whether or not to group the source files by packages
 * 
 * @private
 * @type {boolean}
 */
var GROUP_BY_PACKAGE = true;

/**
 * These ScriptLibrary files MUST be included.
 * 
 * @private
 * @type {string[]}
 */
var INCLUDES = [ "c", "DumpSL" ];

/**
 * These ScriptLibrary files MUST be excluded.
 * 
 * @private
 * @type {string[]}
 */
var EXCLUDES = [];

/**
 * These ScriptLibrary packages MUST be included.
 * 
 * @private
 * @type {string[]}
 */
var INCLUDE_PACKAGES = [];

/**
 * See {@link module:c}
 * 
 * @private
 * @method
 */
var $ = lib.c.$;

/**
 * This function dumps the ScriptLibrary files to .js files in the local
 * operating system
 */
function dumpScriptLibrary() {
	var names = INCLUDES;
	var packages = INCLUDE_PACKAGES;

	var query = "true";

	if (JS_BEAN_ONLY) {
		$("JSBeanFactory").selectAll().iterate(function(bean) {
			names.push(bean["default.class"]);
		});
		query = "name isin {";
		for ( var i = 0; i < names.length; i++) {
			query = query + "\"" + names[i] + "\"";
			if (i != names.length - 1) {
				query += ",";
			}
		}
		query += "}";
	}

	if (packages.length > 0) {
		query += " and package isin {";
		for ( var j = 0; j < packages.length; j++) {
			query = query + "\"" + packages[j] + "\"";
			if (j != packages.length - 1) {
				query += ",";
			}
		}

		query += "}";
	}

	$("ScriptLibrary").select(query).iterate(function(record) {
		var name = record["name"];
		if (!$.contains(EXCLUDES, name)) {
			var pkgName = record["package"];
			var fileName = OUTPUT_DIR + name + ".js";
			if (GROUP_BY_PACKAGE && (pkgName != null && pkgName.length > 0)) {
				makeDir(OUTPUT_DIR + pkgName);
				fileName = OUTPUT_DIR + pkgName + "/" + name + ".js";
			}
			writeFile(fileName, "t", record["script"]);
		}
	});
}

dumpScriptLibrary();