var str = system.functions.str;

var CHILDREN_TYPE = lib.svcCatalogMixTrigger.CHILDREN_TYPE;
var calcChildrenType = lib.svcCatalogMixTrigger.calcChildrenType;

/**
 * @author bo-tao.pan@hp.com
 *
 * This function marks a given field to true when the category contains both items and
 * categories
 *
 * @param mixedFieldName the field to mark
 * @param bulk print a status message when every $bulk records are proccessed, default to 10
 *
 **/
function markMixed(mixedFieldName, bulk) {
	// get count of svcCoung
	// explicit reference makes dependence problem, should we fix this?
	var total = system.library.ScAPI_RAD._count('svcCatalog', 'true');

	for (
			var file = new SCFile('svcCatalog'), r = file.doSelect('true'), i = 1;
			RC_SUCCESS == r;
			r = file.getNext(), ++i) { // for all categories/items f
		for (
				var pfile=new SCFile('svcCatalog'), pr = pfile.doSelect('name isin ' + str(file.parent));
				RC_SUCCESS == pr;
				pr = pfile.getNext()) { // for all parents of f, p
			pfile[mixedFieldName] = calcChildrenType(pfile[mixedFieldName], file.type);
			pfile.doUpdate();
		}
		if (i % (bulk || 10) == 0) print(i + '/' + total + ' is done');
	}
	print('All done.');
}

function clearMixed(fieldName) {
	for (
			var file = new SCFile('svcCatalog'), r = file.doSelect('true');
			r == RC_SUCCESS;
			r = file.getNext()
		) {
		file[fieldName] = CHILDREN_TYPE.EMPTY;
		file.doUpdate();
	}
}

function mix()
{
	clearMixed('children.type');
	markMixed('children.type', 50);
}
