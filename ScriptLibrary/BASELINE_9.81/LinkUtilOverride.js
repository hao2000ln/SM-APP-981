
/**
 * This function is left to customers to customize their dynamic links instead of using links defined in link table for auto complete functionality
 *
 * @param record (SM file)
 *          The record against which the master link record is defined
 * @param format (String)
 *          The format against which the form-based link record is defined, if not given, the current format will be used
 * @param field (String)
 *          The source field against which the link line is defined
 * @param optionValue (String)
 *          The content user has typed for current field
 * @return The link line definition, or null if not found
 *          var result = {
 *               // The field the user is filling data
 *               sourceField: "affected,item",
 *               // The table name which system will query data against
 *               targetFile: "device",
 *               // The field of the targetFile which the query will base on
 *               targetField: "logical.name",
 *               
 *               targetFormat: "device.qbe",
 *               
 *               query: "lgical.name#"App"",
 *               //If the link has post expressions or javascripts
 *               hasPostStatement: true/false
 *               //Object: Source/Target fields
 *               mapping: {"logical.name":"affected,item","assignment":"assignment"},
 *             }
 */
function getCustomizedLink(record, format, field, optionValue){
    //add your customized code for link and return as an object
    /*var link = GET_LINK_FUNCTION; */
    //before return link, please eval pre javascript and pre RAD, below is as an example
    /*
    if(link!=null){
		vars.$File = record;
		if(link["javascript.pre"]!=null){
			eval(link["javascript.pre"]);
		}
		var preExpressions=link["expressions"];
		if(preExpressions){
			var j;
			for (j = 0, count = preExpressions.length(); j < count; j++) {
				if (preExpressions[j] != null) {
					system.functions.evaluate(preExpressions[j]);
				}
			}
		}
		var hasPostStatement = link["javascript.post"]!=null?true:false;
		var mapping = {};
		for( var i =0; i < link["project.source.fields"].length; i ++) {
			mapping[link["project.source.fields"][i]]=link["project.target.fields"][i];
		}
		var query = "";
		for(var i = 0; i < link["add.query"].length(); i++){
			if( link["add.query"][i]!=null){
				query +=  system.functions.str(eval("system.vars."+system.functions.parse( link["add.query"][i], 13))) + " ";
			}
		}
	  
		return {
			sourceField: link['source.fields'][0],
			targetFile: link['target.files'][0],
			targetField: link['target.fields'][0],
			targetFormat: link['target.formats'][0],
			query: query,
			hasPostStatement:hasPostStatement,
			mapping: mapping
		};
	}*/
	return null;
}
