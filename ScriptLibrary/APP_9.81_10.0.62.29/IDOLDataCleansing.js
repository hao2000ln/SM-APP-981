var _ = lib.Underscore.require();

var logger = getLog('IDOLDataCleansing');

var IDOLDataCleansing = (function() {

  //retrieve configured data cleansing items.
  function getDataCleanPatterns(action, filename) {
    var actions = [],
        filterDefs = new SCFile("idolDataFilter"),
        rc = filterDefs.doSelect("is.active=true and action=\"" + action + "\" ");
    
    while (rc === RC_SUCCESS) {
      if (filterDefs.scope_module == "global" || filterDefs.scope_module === filename) {
        actions.push([filterDefs.pattern_start_content, filterDefs.pattern_end_type, filterDefs.pattern_end_content, filterDefs.case_sensitive, filterDefs.is_regular_expression]);
      }
      rc = filterDefs.getNext();
    }
    return actions;
  }

  //extract the content inside of patternStart and patternEnd. return "" if no match found.
  function includeContent(text, start, end_type, end, case_sensitive) {
    var start = escapeRegExp(start);
    var flag = case_sensitive ? "g" : "gi";
    if(end_type === "end_of_line"){
      end = "$";
      flag += "m";
    }else if(end_type === "end_of_document"){
      end = "$";
    }else{
      var end = escapeRegExp(end);
    }
    //[^] means any charactor, including newline.
    var re = new RegExp(start + '([^]*?)' + end, flag);
    var myArray, result = "";
    while ((myArray = re.exec(text)) !== null)
	{
	  if(result !== ""){
	    result += " ";
	  }
	  result += myArray[1];
	}
	return result;
  }
  
  //exclude the content between patternStart and patternEnd. return original if no matche found.
  function excludeContent(text, start, end_type, end, case_sensitive) {
    var start = escapeRegExp(start);
    var flag = case_sensitive ? "g" : "gi";
    if(end_type === "end_of_line"){
      end = "$";
      flag += "m";
    }else if(end_type === "end_of_document"){
      end = "$";
    }else{
      var end = escapeRegExp(end);
    }  
	var re =  new RegExp(start + '[^]*?' + end, flag);
	
    return text.replace(re, " ");
  }
  
  //remove pattern from text. return original if no matched found
  function remove(text, userPattern, case_sensitive, isRegularExpression) {
    var pattern = userPattern;
    if(!isRegularExpression){
       //just a string
       pattern = escapeRegExp(pattern);
    }
    var re = new RegExp(pattern, case_sensitive?'g': 'gi');
    return text.replace(re, " ");                       
  }

 function extractTemplateContent(text, pattern, case_sensitive){
     var re = new RegExp(pattern, case_sensitive?'gm': 'gmi');
     var matches = re.exec(text);
     if (matches !==null && matches.length > 1){
         return  matches.slice(1).join('');
    }else{
       return null;
   }
 }

  function cleanData(content, includes, excludes, removes, templates) {
     
    if(!content){ return content;}
    var original_content = content;
    
    try{
    content = content+'';
    if (templates) {
        for (var i = 0, length = templates.length; i < length; i++) {
          var pattern = templates[i];
          extracted = extractTemplateContent(content, pattern[0], pattern[3]);
          if(extracted !== null)
             return extracted;
        }
      }
    
	//extract included patterns and join together with new line.
    var extractedContents = 
      _.chain(includes)
      .map(function(include) {
        return includeContent(content, include[0], include[1], include[2],include[3]);
      })
      .compact().value();
    
    var includeFound = !_.isEmpty(extractedContents);
    if (includeFound) {
      content = extractedContents.join('\n');
    }
	
	//remove exclude patterns if no includes found.
    if (!includeFound) {
      var i;
      for (i = 0; i < excludes.length; i++) {
        var pattern = excludes[i];
        var excluded = excludeContent(content, pattern[0], pattern[1], pattern[2],pattern[3]);
        if (excluded) {
          content = excluded;
        }
      }
    }
	
	//do remove
    for (var i = 0; i < removes.length; i++) {
      var pattern = removes[i];
      content = remove(content, pattern[0], pattern[3], pattern[4]);
    }
    }catch( ex ){
      logger.error(ex.message);
      logger.error(ex.stack);
      return original_content;
    }
    return content;
  }


  //Escaping user input to be treated as a literal string within a regular expression 
  //reference:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
  function escapeRegExp(string){
   return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }
  
  //retrieve 
  function createCleanser(filename) {
    var includePtn = getDataCleanPatterns("Include", filename) || [],
        excludePtn = getDataCleanPatterns("Exclude", filename) || [],
        removePtn = getDataCleanPatterns("Remove",filename) || [];
       templatePtn = getDataCleanPatterns("Template",filename) || [];
    return function(content) {
      return cleanData(content, includePtn, excludePtn, removePtn,templatePtn );
    };
  }
  
  return {
    getCleanser : createCleanser,
    getDataCleanPatterns : getDataCleanPatterns,
    cleanData:cleanData
    
  };
})();

function require() {
  return IDOLDataCleansing;
}