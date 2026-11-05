
var $ = lib.c.$;
var _ = lib.Underscore.require();


/**
 * generate new id for new Known Error record.
 * @return {String} new number value
 */
function generateId(){

	var newid = new Datum();
	var rcode = new Datum();
	rcode = system.functions.rtecall("getnumber", rcode, newid, "knownerror management");
	return newid;

}

/**
 * Do the post proessing after field mapping.
 * @param  {SCFile} mapping      migtrationSetting record.
 * @param  {SCFile} sourceRecord source record.
 * @param  {SCFile} targetRecord mapped record.
 * @return {[type]}              [description]
 */
function postProcess(mapping, sourceRecord, targetRecord){

	try{
	//Step 1: Update sourceRecord.isKonwnError to make it a pure problem record.
	sourceRecord.isKnownError = false;
	sourceRecord.doSave();

	//Step 2: Process post options.
	var opt = getOptions(mapping.post_options);
	if(opt.relation === "migrate") migrateRelations(sourceRecord, targetRecord);

	//Step 3: Link new KE to the problem record.
	createRelation(sourceRecord, targetRecord);

	}catch(e){
		print(e);
		var ret;
		system.functions.rtecall("trigger", ret, 1);
	}
	
}

/**
 * Copy original relations to new known error record.
 * @param  {SCFile} sourceRecord 
 * @param  {SCFile} targetRecord 
 * @return {[type]}              [description]
 */
function migrateRelations(sourceRecord, targetRecord){

	//turn off triggers
	var ret;
	system.functions.rtecall("trigger", ret, 0);

	var sourceId = sourceRecord.id;
	var targetId = targetRecord.id;

	var relationQuery = 'source.filename="rootcause" and source="' + sourceId + '"';
	var reverseRelationQuery = 'depend.filename="rootcause" and depend="' + sourceId +'"';

	$("screlation").select(relationQuery).iterate(function(record){
		if(_.startsWith(record.depend,"KE")) return "";
		record.source = targetId;
		record.doInsert();
	});

	$("screlation").select(reverseRelationQuery).iterate(function(record){
		if(_.startsWith(record.source,"KE")) return "";
		record.depend = targetId;
		record.doInsert();
	});

	//trurn on triggers
	system.functions.rtecall("trigger", ret, 1);
}

/**
 * Inteprete post.options field to JS Object. 
 * @param  {String} xmlContent value of post.options field.
 * @return {Object} opt  translated options vlue.
 */
function getOptions(xmlContent){

	var opt = {};
	var xml = new XML();
	xml.setContent(xmlContent);
	var element = xml.getFirstChildElement();
	
	do{
		
		if (element == null) break;

		var id = element.getAttributeValue("id");
		opt[id] = element.getValue();	
			
		var element = element.getNextSiblingElement();
		if (element == null) break;
		
	}while(true)
	
	return opt;

}


/**
 * Create screlation between source record and target record.
 * @param  {SCFile} sourceRecord [description]
 * @param  {SCFile} targetRecord [description]
 * @return {[type]}              [description]
 */
function createRelation(sourceRecord, targetRecord){

	sourceId = sourceRecord.id;
	targetId = targetRecord.id;
	var screlation = new SCFile("screlation");
	var checkQuery = 'source.filename="rootcause" and depend.filename="rootcause" and source="' + sourceId + '" and depend="' + targetId + '"';
	
	if(!$("screlation").select(checkQuery).uniqueResult()){
		
		screlation.source = sourceId;
		screlation.source_filename = "rootcause";
		screlation.source_active = (sourceRecord.rcStatus == "Closed")? false:true;

		screlation.depend = targetId;
		screlation.depend_filename = "rootcause";
		screlation.depend_active = (sourceRecord.rcStatus == "Closed")? false:true;

		screlation.type = "Related Known Errors";

		vars.$relationType = "Related Known Errors";
		vars.$sourceType = "pbm";
		vars.$targetType = "ke";

		screlation.doSave();

	}
}

