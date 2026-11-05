var KM_ESCAPE_CHARS = ["\/", "\\", "#", "$", "%", "^", "&", "(", ")", "_", "-", "+", "=", "|", "<", ">", ".", ":", "{", "}", "[", "]", ","]; 

/**  @fileoverview KMSearch
 *   @author Joe Antoneccia
 */

/**
 *   @class KMSearch
 *   @constructor
 */
 
var _ = lib.Underscore.require();

function KMSearch()
{
}

function submitSearch( serverspec, docstart, submitstring, querytype, queryfields, filterqueries, collections, hitlistfields, hitarray, doccount, maxdocs,sortinfo)
{
    var initSearcher = lib.KMUtils.getSearchEngineConfig("", "search");
    
    var result = lib.KMSearchInterface.initializeEngine(initSearcher);
    if (result == -1)
    {
        lib.KMUtils.domessageBox(funcs.scmsg(224, "km"));
        hitarray.push("FAILED",0);
        return hitarray;
    }
    
    //QCCR80005
    if (docstart + doccount > maxdocs)
    {
        doccount = maxdocs - docstart;
    }
    hitarray = lib.KMSearchInterface.searchIndexes(submitstring, querytype, queryfields, funcs.str(docstart), funcs.str(doccount), funcs.str(maxdocs), collections, hitlistfields, filterqueries, sortinfo);
    
    return hitarray;
}

function initHotNews(fKMQuery)
{
    vars.$L_format="kmknowledgebase.search.g";
    if(vars.$L_passedquery)
    {
        funcs.fduplicate(fKMQuery,vars.$queryfile);
    }
    fKMQuery.docstart = 1;
    fKMQuery.doccount = 10;
    fKMQuery.maxdocs = vars.$G_km_globalenv.km_max_docs_returned;
    fKMQuery.locale = lib.KMUtils.getKMlangcode(vars.$G_my_language.slice(0,2));
    fKMQuery.queryfields = "";
    fKMQuery.filterqueries = "";
    vars.$L_currentpage = 0;
    vars.$L_lastpage = 0;
}

function initSearch( fKMQuery )
{
    vars.$L_format="kmknowledgebase.search.g";
    if(vars.$G_client_type=="mobile") 
    {
    	vars.$L_format="kmknowledgebase.search.g.mobile";
	}
	
    if(vars.$L_passedquery)
    {
        funcs.fduplicate(fKMQuery,vars.$queryfile);
    }

    fKMQuery.hitlist = funcs.nullsub(fKMQuery.hitlist, "Default");
    getAvailableKnowledgeBases(fKMQuery);
    fKMQuery.docstart = 1;
    fKMQuery.doccount = 10;
    fKMQuery.maxdocs = vars.$G_km_globalenv.km_max_docs_returned;
    fKMQuery.locale = lib.KMUtils.getKMlangcode(vars.$G_my_language.slice(0,2));
    fKMQuery.queryfields = "";
    fKMQuery.filterqueries = "";
    vars.$L_currentpage = 0;
    vars.$L_lastpage = 0;
    vars.$L_showprevious=false;
    vars.$L_showpager=false;
    vars.$G_advsearch=false;
    var strStyle = vars.$G_km_globalenv.kmhitliststyle;
    fKMQuery.results = strStyle + "<DIV></DIV>";
}

/**
 *  returns an array of strings representing the fields to display in the hitlist
 *  @param  {SCFile} fHitList - a kmhitlist file variable
 *  @return Array
 *   @type String
 */
function getHitListFields(strHitlistTemplate)
{
    var hitlistfields = new Datum();
    hitlistfields.setType(8);
    
    //lookup the hitlist columns
    var hitlist = new Query("kmhitlisttemplate", new QueryCond("name", EQ, strHitlistTemplate));
    var h0 = hitlist[0];
    var hitlistcolumns = h0.columns;
    
    var i;
    var ilength = hitlistcolumns.length();
    for( i = 0; i < ilength; i++)
    {
    	var j;
    	var jlength = hitlistcolumns[i].fields.length(); 
        for(j = 0; j < jlength; j++)
        {
            if (hitlistcolumns[i].fields[j] == "$KNOWLEDGEBASE_NAME")
            {// workaround Verity bug...  Pull collection name from field instead of
                // using Verity's collection_name function.  By removing the "$" here, it
                // gets treated as a normal field instead of a special field.
                hitlistcolumns[i].fields[j] = "knowledgebase_name";
            }
            if (hitlistcolumns[i].fields[j] == "$VLANG")
            {// pull Verity assigned locale field for hitlist

                hitlistcolumns[i].fields[j] = "vlang";
            }
            hitlistfields.push(lib.KMUtils.scToJSName(hitlistcolumns[i].fields[j]));
        }
    }

    return hitlistfields;
}


function getLinkPosition(hitlist, hitlistcolumns)
{
    var linkPosition = 0;
    var bFound = false;
    var numColumns = hitlistcolumns.length();
    var numfields;
    var rcode;
    var cols;
    for (cols = 0; bFound == false && cols < numColumns; cols++)
    {
        numfields = hitlistcolumns[cols].fields.length();
        var f;
        for (f = 0; bFound==false && f < numfields; f++)
        {
            rcode = funcs.index( hitlist[0].link_field, hitlistcolumns[cols].fields[f], 1);
            linkPosition++;
            if(rcode == 0)
            {
                continue;
            }
            else
            {
                bFound = true;
            }
        }
    }

    return linkPosition;
}

// The position of the knowledgebase name is needed for mapping the fsyslib 
//   start path from UNIX to a path that a Windows client can use.
// Whatever position of the knowledgebase name is returned, the calling code 
//   will add one for the viewURL and one to account for a 1 based array in SC
// OOB, it's 5, but the calling code will add 2 to make it 7
function getKBNamePosition(hitlist, hitlistcolumns)
{
    var kbnamePosition = 0;
    var bFound = false;
    var numColumns = hitlistcolumns.length();
    var numfields;
    var rcode;
    var cols;
    for (cols = 0; bFound == false && cols < numColumns; cols++)
    {
        numfields = hitlistcolumns[cols].fields.length();
        var f;
        for(f = 0; bFound==false && f < numfields; f++)
        {
            rcode = funcs.index( "$KNOWLEDGEBASE_NAME", hitlistcolumns[cols].fields[f], 1);
            kbnamePosition++;
            if(rcode == 0) {
                continue;
            }
            else
            {
                bFound = true;
                
            }
        }
    }

    return kbnamePosition;
}

// The position of the field name is needed for mapping the fsyslib 
//   start path from UNIX to a path that a Windows client can use.
// Whatever position of the field name is returned, the calling code 
//   will add one for the viewURL and one to account for a 1 based array in SC
// OOB, it's 5, but its actual position is 7. However, as the calling codes start loop from 2, 
// it is not needed to add 2 and the comments for the function getKBName Position is not correct.
// This function is the general one for getKBNamePosition. 
// It should return the same result for getFieldPosition(hitlist, hitlistcolumns, "$KNOWLEDGEBASE_NAME") 
// and getKBNamePosition(hitlist, hitlistcolumns)
function getFieldPosition(hitlist, hitlistcolumns, field)
{
    var fieldPosition = 0;
    var bFound = false;
    var numColumns = hitlistcolumns.length();
    var numfields;
    var rcode;
    var cols;
    for (cols = 0; bFound == false && cols < numColumns; cols++)
    {
        numfields = hitlistcolumns[cols].fields.length();
        var f;
        for(f = 0; bFound==false && f < numfields; f++)
        {
            rcode = funcs.index( field, hitlistcolumns[cols].fields[f], 1);
            fieldPosition++;
            if(rcode == 0) {
                continue;
            }
            else
            {
                bFound = true;
                
            }
        }
    }

    return fieldPosition;
}


function addColumnHeadings(hitlistcolumns)
{
    var strHTML = "<TR valign=top; align=left>";
    var numColumns = hitlistcolumns.length();
    var hidx;
    for( hidx = 0; hidx < numColumns; hidx ++)
    {
        var theHdr = hitlistcolumns[hidx].heading;
        var spec_loc = theHdr.indexOf("*SCMSG");
        var tmpFld = "";
        var tmpVal = hitlistcolumns[hidx].heading;

        if (spec_loc >= 0)
        {
            tmpFld = theHdr.substring(spec_loc + 7, theHdr.length);
            tmpFld = tmpFld.substring(0, tmpFld.indexOf("*SCMSG"));
            eval('tmpVal = funcs.scmsg(' + tmpFld + ', "km");');
            if (tmpVal == null)
            {
                tmpVal = "";
            }
        }

        strHTML += "<TH>" + tmpVal + "</TH>";
    }
    strHTML += "</TR>";

    return strHTML;
}

function convertUnixToWindowsPath(fsyslib, strViewURL, kbname)
{
    // May need mapping. fsyslib has this format:
    //   kbname;filestartpath;filemap
    //   Test_File_Lib;/ServiceCenter/webcrawltest;\\\\tbrayblade100
    // Map it if the strViewURL begins with filestartpath
    var mapArray = lib.KMUtils.parseListToSCArray(fsyslib,";");
    
    if ( strViewURL.indexOf(mapArray[1]) >= 0 )
    {
        // Map strViewURL - substitute filemapto for filemapfrom
        
        if (mapArray[2].charAt(mapArray[2].length-1) == "//" ||
            mapArray[2].charAt(mapArray[2].length-1) == "\\")
        {
            mapArray[2] = mapArray[2].substr(0,mapArray[2].length-1);
        }
        if (mapArray[3].charAt(mapArray[3].length-1) == "//" ||
            mapArray[3].charAt(mapArray[3].length-1) == "\\")
        {
            mapArray[3] = mapArray[3].substr(0,mapArray[3].length-1);
        }
        strViewURL = mapArray[3] + strViewURL.substr(mapArray[2].length);
        
    }
    return strViewURL;
}

function getSummaryFields() {
    return ["$PASSAGE_BASED_SUMMARY", "$DYNAMIC_SUMMARY"];
}

function convertSummaryDatetime(strSummary) {
    strSummary = strSummary.replace(/(\s+)(\d{4}-\d{1,2}-\d{1,2}T\d{2}:\d{2}:\d{2}Z)(\s+|$)/g, function(str, $1, $2, $3) {
        var dateString = lib.tzFunctions.convertISO8601DateToLocal($2);
        return $1 + "" + dateString + "" + $3;
    });
    
    strSummary = trimSuffixPartDateString(strSummary);
    
    return strSummary;
}

function trimSuffixPartDateString(str) {
    var ISO_DATE_LENGTH = 20; // the length of YYYY-MM-DDThh:mm:ssZ
    var length = str.length;
    if (length < ISO_DATE_LENGTH - 2) {  // the format of date may be YYYY-M-DThh:mm:ssZ
        return str;
    }
    var suffix = str;
    if (length > ISO_DATE_LENGTH) {
        suffix = str.substring(length - ISO_DATE_LENGTH);
    }
    
    suffix = suffix.replace(/\s+\d{4}-(\d{1,2}(-(\d{1,2}(T(\d{1,2}(:(\d{1,2}(:\d{0,2}){0,1}){0,1}){0,1}){0,1}){0,1}){0,1}){0,1}){0,1}$/g, "");
    
    return str.substring(0, length - ISO_DATE_LENGTH) + suffix;
}

/**
 *  returns an HTML string reprsenting a hitlist array
 *  @param  {Array} aHitList - a array datum variable
 *  @return String
 *   @type String
 */
function getHTMLHitListFromArray(aHitList, strHitlistTemplate) {

	//lookup the hitlist columns
    var hitlist = new Query("kmhitlisttemplate", new QueryCond("name", EQ, strHitlistTemplate));
    var hitlistcolumns = hitlist[0].columns;

    var strStyle = vars.$G_km_globalenv.kmhitliststyle;

    var strQuery = vars.$L_file.submitstring.replace(/>/g, "&gt;");
    strQuery = strQuery.replace(/</g, "&lt;");
    var docsSearchedString;
    
    if (aHitList[0] >= 0) {
        var arrayArgs = new SCDatum();
        arrayArgs.setType(8);  //type array
        arrayArgs.push(aHitList[0]);
        arrayArgs.push(aHitList[1]);
        docsSearchedString = funcs.scmsg(163, "km", arrayArgs);
    }
    else {
        docsSearchedString = funcs.scmsg(222, "km");
    }
    var strHTML = strStyle + "<DIV class=\"resultHeading\">" + docsSearchedString + "<BR><BR></DIV><DIV class=\"resultTable\">";

    //identify the position of the link field in the hitlist array
    var linkPosition = getLinkPosition(hitlist, hitlistcolumns);
    // identify the position of the knowledgebase name in the hitlist array.
    // add one for the viewURL and one to account for a 1 based array in SC.
    var kbnamePosition = 2 + getKBNamePosition(hitlist, hitlistcolumns);
    
    var summaryPositions = [];
    var summaryFields = getSummaryFields();
    var i;
    for (i=0; i<summaryFields.length; i++) {
        summaryPositions.push(getFieldPosition(hitlist, hitlistcolumns, summaryFields[i]));
    }

    //add the column heading row

    var numColumns = hitlistcolumns.length();
    
    var rcount = 0;
    var numRows = aHitList.length();
    
    var strViewURL;
    var fieldcount;
    var strRowClass;
    var numfields;
    var fsyslibLength = vars.$fsyslibs.length();
    for (i = 2; i < numRows; rcount++) {
        strViewURL = aHitList[i++]; //"sclink://kmdocument:id#11";

        var kbname = aHitList[kbnamePosition] + ";";  // with a semi-colon on the end
        // Loop through the $fsyslibs mappings that are build in KMSearchQuery.
        // Determine if this row in the hitlist needs to be mapped from
        //   the UNIX path to a Windows path.
        var k;
        for (k = 0; k < fsyslibLength; k++) {
            if (vars.$fsyslibs[k].indexOf(kbname) == 0) {
                strViewURL = convertUnixToWindowsPath(vars.$fsyslibs[k], strViewURL, kbname);
                break;
            }
        }

        fieldcount = 1; //we are already on position 1 because position 0 is the VIEW_URL
        //add row for each hit
        strRowClass = rcount % 2 == 0 ? "evenRow" : "oddRow";
        strHTML += "<DIV CLASS=\"" + strRowClass + "\">";
        var j;
        for (j = 0; j < numColumns; j++) {
            if (hitlistcolumns[j].heading != null && typeof(hitlistcolumns[j].heading) != "object") {
                var theHdr = hitlistcolumns[j].heading;
                var spec_loc = theHdr.indexOf("*SCMSG");
                var tmpFld = "";
                var tmpVal = hitlistcolumns[j].heading;

                if (spec_loc >= 0) {
                    tmpFld = theHdr.substring(spec_loc + 7, theHdr.length);
                    tmpFld = tmpFld.substring(0, tmpFld.indexOf("*SCMSG"));
                    eval('tmpVal = funcs.scmsg(' + tmpFld + ', "km");');
                    if (tmpVal == null) {
                        tmpVal = "";
                    }

                }
                strHTML += "<DIV class=\"fieldLabel\">" + tmpVal + ":</DIV>";
            }
            strHTML += "<DIV class=\"" + hitlistcolumns[j].width + "\" >";
            numfields = hitlistcolumns[j].fields.length();
            for (k = 0; k < numfields; k++) {
                if (fieldcount == linkPosition) { // build the view link
                    strHTML += "<a href=\"" + strViewURL + "\"><SPAN class=\"resultLink\">" + customizeViewURL(aHitList[i]) + "</span></a>";
                }
                else {
                    if (lib.ArrayUtil.contains(summaryPositions, fieldcount)) {
                        strHTML += convertSummaryDatetime(aHitList[i]);
                    } else {
                        strHTML += aHitList[i];
                    }
                }
                if (numfields > 1 && k < numfields - 1) {
                    i++;
                }
                fieldcount++;
            }
            strHTML += "</DIV>";
            i++;
        }
        strHTML += "</DIV>";
    }
    return strHTML;
}

function gotopage(pageNumb)
{
    vars.$L_file.docstart = vars.$L_file.docstart + vars.$L_file.doccount*(pageNumb-1);
    vars.$newsearch = false;
}


function getFieldValue(strTargetField, aDocumentFields)
{
    var strReturn = "";
    var i;
    var length = aDocumentFields.length();
    for (i = 0; i < length; i++ )
    {
        if( aDocumentFields[i].field_name == strTargetField)
        {
            strReturn = aDocumentFields[i].field_value;
        }
    }
    return strReturn;
}

function getAvailableKnowledgeBases(fKMQuery)
{
    // This function sets the index value in the KB array for the KBs that the user can see,
    //   and for the KBs that the user CANNOT see, sets the index to 0
    // It also sets the Boolean fields in kmquery to true for the KBs that the user can see,
    //   and for the KBs that the user CANNOT see, sets the Boolean fields in kmquery to false
    lib.KMSearchQuery.getvalidKBs(fKMQuery, funcs.operator());
}

/**
 *  This function takes a kmquery file and returns an array of knowledgebase names the '
 *   user selected for searching (advanced search screen)
 *  @param SCFile a kmquery file object populated from advanced search
 *  @return {String} array of strings containing the knowledgebase names selected
 *   @type {String}
 */
function getSelectedCollections(fKMQuery)
{
    var colls = new Datum();
    colls.setType(8);
    var kmlibFile = new SCFile("kmknowledgebase", SCFILE_READONLY);
    kmlibFile.setFields(["kbname","searchservername"]);
    var kmFind = kmlibFile.doSelect("true");

    while( kmFind == RC_SUCCESS )
    {
        var nameNoDot = lib.KMUtils.removetoken(kmlibFile.kbname, ".");
        var nameNoUnderscore = lib.KMUtils.removetoken(nameNoDot, "_");
		nameNoUnderscore = nameNoUnderscore.replace(/ /g, "");
		
        var strEval = eval("fKMQuery."+nameNoUnderscore+"==true;");
        if (strEval)
        {
            // get host:port/instance here
            var getenginename = lib.KMSearchInterface.getEngineName();
            if (getenginename != "IDOL")
            {
                var shardInfo = lib.KMUtils.getShardInfo(kmlibFile.searchservername);

                eval("colls.push(\""+shardInfo+"/"+kmlibFile.kbname+"\");");
            }
            else
            {
                eval("colls.push(\""+kmlibFile.kbname+"\");");
            }
        }

        kmFind = kmlibFile.getNext();
    }

    // This is an example of what the eval code is generating:
    //if(fKMQuery.KnowledgeLibrary)
    //colls.push("Knowledge_Library");

    return colls;
}

function getSelectedCollectionsString(fKMQuery)
{
    var colls = "";

    var kmlibFile = new SCFile("kmknowledgebase", SCFILE_READONLY);
    kmlibFile.setFields(["kbname"]);
    var kmFind = kmlibFile.doSelect("true");
    if( kmFind == RC_SUCCESS )
    {
        var firstTime = true;
        while( kmFind == RC_SUCCESS )
        {
            var nameNoDot = lib.KMUtils.removetoken(kmlibFile.kbname, ".");
            var nameNoUnderscore = lib.KMUtils.removetoken(nameNoDot, "_");
            nameNoUnderscore = nameNoUnderscore.replace(/ /g, "");

            var strEval = eval("fKMQuery."+nameNoUnderscore+"==true;");
            if (strEval)
            {
                if (firstTime)
                {
                    eval("colls +=\""+kmlibFile.kbname+"\";");
                    firstTime = false;
                }
                else
                {
                    eval("colls += ((colls !=\"\" ? \";\":\"\") + \""+kmlibFile.kbname+"\");");
                }
            }

            kmFind = kmlibFile.getNext();
        }
    }

    // This is an example of what the eval code is generating:

    return colls;
}


function getSearchParameters(strMapping)
{
    var iCount = 0;
    var kmsearch = new SCFile("kmquery");

    var mapping = new Query("kmmapping", new QueryCond("name", EQ, strMapping));
    var row;
    for( row in mapping ) //this will only happen once if the mapping is found
    {
        //loop through the field-mapping array for this mapping
        var mrow = mapping[row];
        var fields = mrow.search_fields;
        var idx;
        for( idx in fields )
        {
            var field = fields[idx];
            
            if(field.sc_searchfield == null) {
                continue;
            }
            var strTargetField = lib.KMUtils.scToJSName(field.km_target);

            //test for literal string
            if( field.sc_searchfield.substring(0,1) == "\"" )
            {
                var len = field.sc_searchfield.length -1;
                eval("kmsearch." + strTargetField + " += field.sc_searchfield.substring(1, len)");
            }
            else // normal field mapping
            {
                var tmpEvalStr;
                var strFieldValue = "";
                var strEvalString ="vars.$L_file." + lib.KMUtils.scToJSName(field.sc_searchfield);
                if( lib.KMUtils.isSCArray( eval(strEvalString) ) )
                {
                    tmpEvalStr = "";
                    tmpEvalStr += lib.KMUtils.scArrayToString(eval(strEvalString));
                    tmpEvalStr=markWordWithSpecialCharInDoubleQuote(tmpEvalStr);
                    //QCCR1E68796: replace it by next   linestrFieldValue += tmpEvalStr.replace(/\"/g, "\\\"");
                    
                    strFieldValue += lib.StringUtil.escapeAllStr(tmpEvalStr);
                }
                else
                {
                    tmpEvalStr = "";
                    tmpEvalStr += eval(strEvalString);
                    tmpEvalStr=markWordWithSpecialCharInDoubleQuote(tmpEvalStr);
                    //QCCR1E68796: replace it by next strFieldValue += tmpEvalStr.replace(/\"/g, "\\\"");
                    strFieldValue += lib.StringUtil.escapeAllStr(tmpEvalStr);
                }
                if( eval("kmsearch."+strTargetField + "!= null")) //then append
                {
                    strEvalString = "kmsearch." + strTargetField + " += \"" + strFieldValue +"\"";
                }
                else
                {
                    strEvalString = "kmsearch." + strTargetField + " = \"" + strFieldValue +"\"";
                }
                eval(strEvalString);
            }
        }
    }
    
    return kmsearch;
}


/** This function is a convenience method for displaying a status message.  It is
 *  intended to be called from a RAD Expression using jscall().
 *  @param {String} strMessage - a string containing the message to be displayed.
 */
function statusMessage(strMessage)
{
    print(strMessage);
}

/** This function is a  method for removing start enter char
 *  
 *  @param {String} strMessage - a string  to be removed.
 */
function removeStartEnter(strMessage)
{
   var i;
   for(i=0;strMessage && i<strMessage.length;i++)
   {
     if(strMessage.charAt(i)!= "\r" && strMessage.charAt(i)!="\n")
     {
        return strMessage.substring(i);
     }
   }
   return "";
}

/**
 * This function is called to use a solution being viewed in Knowledge Management in another module.
 * The user will request the retrieve using the Use Solution display option (i.e. button or menu)
 */
function useSolution(strMapping, fSourceDocument, fTargetFile)
{
    var q = new Query("kmmapping", new QueryCond("name", EQ, strMapping));
    var rowcount = 0;
    var strSourceFilename = funcs.filename(fSourceDocument);
    var strTargetFilename = funcs.filename(fTargetFile);
    var reg = /(")|(")|(\{*,\s")/g; // regular expression used to strip out the quotes in a field
    var row;
    for( row in q )
    {
        var qrow = q[row];
        var fields = qrow.retrieval_fields;
        
        var idx;
        for( idx in fields )
        {
            var field = fields[idx];
            
            //find the doctype mapping for our source kmdocument
            var strDocType = "" + field.km_type;
            //check for non-kmdocument file mappings

            if( strSourceFilename != "kmdocument" && strDocType != strSourceFilename )
            {
                continue;
            }
            
            //process kmdocument file mappings
            if( strSourceFilename == "kmdocument" && strDocType != fSourceDocument.doctype && strDocType.toLowerCase() != "all" )
            {
                continue;
            }

            //we found a mapping for this file type and doctype
            //check if source value is lietral or field
            var strSourceValue = "" + field.km_source.substring(0,1) == "\""? field.km_source : lib.KMUtils.scToJSName(field.km_source);
            var strTargetValue = "" + lib.KMUtils.scToJSName(field.sc_target);
            
            var strSourceField = "" + field.km_source.substring(0,1) == "\"" ?  field.km_source.substring(1,field.km_source.length - 1) : field.km_source;
            var strTargetField = "" + field.sc_target;
            
            var isTargetArray = lib.KMUtils.isSCArray2(strTargetFilename, strTargetField);
            var isSourceArray = lib.KMUtils.isSCArray2(strSourceFilename, strSourceField);
            
            if (isTargetArray)
            {
               if(fTargetFile[strTargetField] == null) 
               {
                 fTargetFile[strTargetField] = [];
               }
               else
               {
                 var ar = funcs.denull(fTargetFile[strTargetField]);
                 fTargetFile[strTargetField] = ar;
               }
            }
            
            var strOperator = " = ";
            //test for literal string
            if( strSourceValue.substring(0,1) == "\"" )
            {
                var len = strSourceValue.length -1;
                //var isArray = lib.KMUtils.isSCArray( eval("fTargetFile." + strTargetValue) );
                isTargetArray ? eval("fTargetFile." + strTargetValue + ".push(strSourceValue.substring(1, len))")
                    : eval( "fTargetFile." + strTargetValue + strOperator + "\"" + strSourceValue.substring(1, len) +"\"" );
            }
            else if( strSourceFilename != "kmdocument") //direct file mappings
            {
                //var isTargetArray = lib.KMUtils.isSCArray( eval("fTargetFile." + strTargetValue) );
                //var isSourceArray = lib.KMUtils.isSCArray( eval("fSourceDocument." + strSourceValue) );
                
                if(isTargetArray)
                {
                    if (isSourceArray)
                    {
                        var tmpSourceArray = eval("fSourceDocument." + strSourceValue);
                        var sidx;
                        for(sidx in tmpSourceArray )
                        {
                            if(tmpSourceArray[sidx] != null)
                            {
                                // Strip out any quotes in the field, QC7966.
                                //tmpSourceArray[sidx] = tmpSourceArray[sidx].replace(reg, "");
                                
                                fTargetFile[strTargetValue].push(tmpSourceArray[sidx]);
                            }
                        }
                    }
                    else 
                    {
                    	eval("fTargetFile." + strTargetValue + ".push(fSourceDocument." + strSourceValue+");");
                   	}

                }
                else
                {
                    isSourceArray ? eval("fTargetFile." + strTargetValue + strOperator + "lib.KMUtils.scArrayToString(fSourceDocument." + strSourceValue+" ))")
                        : eval("fTargetFile." + strTargetValue + strOperator + "fSourceDocument." + strSourceValue );
                }
            }
            else //not a literal string so evaluate the value of the field and send that
            {
                strSourceValue = lib.KMUtils.scToJSName(strSourceValue);
                //var strSourceData = lib.KMUtils.isSCArray( eval("fSourceDocument." + strSourceValue)) ?
                var strSourceData = isSourceArray ? 
                    lib.KMUtils.scArrayToString(eval("fSourceDocument." + strSourceValue)):
                    eval("fSourceDocument." + strSourceValue);
                
                var strSourceCleaned = lib.KMUtils.HTMLtoText(strSourceData);
                if(isTargetArray && eval("fTargetFile." + strTargetValue +".length()")==0)
                {
                  strSourceCleaned = removeStartEnter(strSourceCleaned);
                }
                //var isArray = lib.KMUtils.isSCArray( eval("fTargetFile." + strTargetValue) );
                isTargetArray ? eval("fTargetFile." + strTargetValue + ".push(strSourceCleaned)")
                    : eval("fTargetFile." + strTargetValue + strOperator + "strSourceCleaned");
            }
        }
    }
    
    if(strSourceFilename == "kmdocument" || strSourceFilename == "rootcause" || strSourceFilename == "knownerror") {
        lib.KMUsageStats.incrementUsageCount(fSourceDocument.id, strSourceFilename);
    }
    else if( strSourceFilename == "probsummary" ) {
        lib.KMUsageStats.incrementUsageCount(fSourceDocument.number, strSourceFilename);
    }
    else if( strSourceFilename == "incidents" ) {
        lib.KMUsageStats.incrementUsageCount(fSourceDocument.incident_id, strSourceFilename);
    }

    // add usage history
    if (strSourceFilename == "kmdocument") {
        var key = lib.dbdictHelper.getUniqueKey(funcs.filename(fTargetFile))[0];
        var strContext = fTargetFile[key];
        lib.KMUsageHistory.usesolution(fSourceDocument.id, strSourceFilename, strContext);
    }

}

/**
 * This function is called to create a solution in Knowledge Management from the current file record in ServiceCenter.
 * The user will request the creation using the Create Knowledge display option (i.e. menu)
 * A selection wizard prompts the user to select the document type of the solution to create
 * Once selected the wizard calls a Process Record (kmmappedcreate and kmdocument.open.init) that formats the call to this function
 * @param {String} strMapping - string containing the name of the current file ("probsummary", "incidents", etc... )
 * @param {SCFile} fSourceFile - a file containing the source we are authoring from
 * @param {SCFile} fTargetFile - a kmdocument file (with the doctype populated) we are authoring
 */
function createSolution(strMapping, fSourceFile, fTargetFile)
{
    var q = new Query("kmmapping", new QueryCond("name", EQ, strMapping));
    var rowcount = 0;
    var row;
    for( row in q )
    {
        var qrow = q[row];
        var fields = qrow.fields;
        
        var idx;
        for( idx in fields )
        {
            var field = fields[idx];
            
            var strDocType = "" + field.km_doctype;
            if( strDocType != fTargetFile.doctype && strDocType.toLowerCase() != "all" ) {
                continue;
            }
            //we found a mapping for this file type and doctype
            //write the file information to the getansintegration table
            var strSourceValue = field.sc_field;
            var strTargetValue = field.km_field;
            // replace '.' with '_' for field name 
            strSourceValue = lib.KMUtils.scToJSName(strSourceValue);
            strTargetValue = lib.KMUtils.scToJSName(strTargetValue);

            var strOperator = " += ";
            if(eval("fTargetFile." + strTargetValue + " == null")) {
                strOperator = " = ";
            }

            //test for literal string
            if( strSourceValue.substring(0,1) == "\"" )
            {
                var len = strSourceValue.length -1;
                eval( "fTargetFile." + strTargetValue + strOperator + "\"" + strSourceValue.substring(1, len) +"\"" );
            }
            else //not a literal string so evaluate the value of the field and send that
            {
                var isArray = lib.KMUtils.isSCArray( eval("fSourceFile." + strSourceValue) );
                isArray ? eval("fTargetFile." + strTargetValue + strOperator + "lib.KMUtils.scArrayToHTMLString(fSourceFile." + strSourceValue +")")
                    : eval("fTargetFile." + strTargetValue + strOperator + "fSourceFile." + strSourceValue.replace(/"/g, "\\\"") );
            }
        }
    }
}

//strip string "file:/" from URL
function customizeViewURL(strViewURL)
{
	if ( strViewURL!= null)
    {
        strViewURL = strViewURL.replace("file:/","");
        
       	/*
 	  		fixCCR1E135902: escape the title field
		*/	
			
		// Characters < , > and " are escaped in rte plugin, so unescape them first 
		strViewURL = strViewURL.replace(/&lt;/g, '<');
		strViewURL = strViewURL.replace(/&gt;/g, '>');
		strViewURL = strViewURL.replace(/&quot;/g, '"');
		
		//escape < , > , ", &, ', `
		strViewURL = _.escape(strViewURL);
		
		//end CCR1E135902
    }
    return strViewURL;
}


/**
 *@NO:QCCR1E68776
 *@Description:word will be marked in double quote if it include special characters , like I/*&-O  will became "I/*&-O",
 *@Author:yuli
 *@Since by 2011/9/15
 */
function markWordWithSpecialCharInDoubleQuote(queryStr)
{
    var reg=/\W+/g;
    var rtnquery="";
    var wordarray = queryStr.split(" ");
    var words;
    for (words =0; words < wordarray.length; words++)
    {
        wordarray[words]=wordarray[words].replace(/\\"/g,"");
        if (!reg.test(wordarray[words]))
        {
            if (rtnquery.length > 1)
            {
                rtnquery += " "+wordarray[words]+" ";
            }
            else
            {
                rtnquery += wordarray[words];
            }
        }
        else
        {
            if (rtnquery.length > 1)
            {
                rtnquery += " \""+wordarray[words]+"\"";
            }
            else
            {
                rtnquery += " \""+wordarray[words]+"\"";
            }
        }
    }
    return rtnquery;
}

/**
 @No.: QCCR1E83877
 @Author: Zhang, Ming-Di
 @Description: OVSM KM: Advanced Search on Title searches incorrectly depending on term and case
 @Since: 2013/04/27
 @param script, scriptLibrary file contains kbname and fieldmapping info
 @return kbname, i.e. Knowledge_library_kmprocesslibcriteria => Knowledge_library
 **/
function parseKbname(script) {
    return String(script).replace("[C++ object library]", "").replace("_kmprocesslibcriteria", "");
}

function escapeQueryField(queryField){
	_.forEach(KM_ESCAPE_CHARS, function(item){
		var token = item.replace(/[\-\[\]\/{}()*+?.\\\^$|]/g, "\\$&");
		queryField = queryField.replace(new RegExp(token, 'g'), "\\"+item);
	});
	
    return queryField;
}

/**
 @No.: QCCR1E83877
 @Author: Zhang, Ming-Di
 @Description: OVSM KM: Advanced Search on Title searches incorrectly depending on term and case
 @Since: 2013/04/27
 @param KMQuery, kmquery file generated when search knowledge base,
 @param fieldmapping, defined in scriptlibrary: library>__kmprocesslibcriteria,
 used to parse mapping relation between kmquery field and search engine field
 @return strQuery, parsed search engine query string
 **/
function parseQueryFields(KMQuery,fieldmapping) {
    var strQuery = '';
    var i;
    for (i = 0; i < fieldmapping.length; i++) {
        var fields = fieldmapping[i];
        var tmp;
        if (KMQuery[fields[0]] != null) {
        
        	var queryField = escapeQueryField(KMQuery[fields[0]]);  
            if (queryField.split(" ").length > 1){      
                tmp = queryField;         
                if(fields[2]) {
                    tmp= tmp.replace(/\s+/g,"+");
                }
                strQuery += fields[1] + ':(' + tmp + ")";
            
            } else {
                strQuery += fields[1] + ':' + queryField;
            }  
            strQuery += " AND ";
        } else {
            //for a reference field, try to get display value
            if (fields[0] != null) {
               var fieldName = fields[0].replace("_", ".");
               var refTable = lib.DisplayName.getRefTable(fieldName, "kmquery");
               if (refTable != null) {
                 var displayValue = funcs.get_display_value(KMQuery, fieldName,-1,true);
                 if (displayValue != null) {
                    //for reference field, display name is automactically indexed, so use field name plus displayname to do a query
                    displayValue = escapeQueryField(displayValue);
                    if (displayValue.split(" ").length > 1){
                        tmp = displayValue;
                        if (fields[2]) {
                           tmp= tmp.replace(/\s+/g,"+");
                        }
                        strQuery += fields[1] + "displayname" + ':(' + tmp + ")";

                     } else {
                        strQuery += fields[1] + "displayname" + ':' + displayValue;
                     }
                     strQuery += " AND ";
                 }
               }
            } 
        }
    }
    
    return strQuery;
}
