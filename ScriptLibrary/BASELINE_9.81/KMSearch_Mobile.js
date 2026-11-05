function JsonEncodeArray(array)
{
	var result = [];
	
	var i;
	for(i= 0;i<array.length;i++)
	{
		var value = array[i];
		
		result.push(JsonEncode(value));
	}
	return '['+result.join(',')+']';
}

function JsonEncodeObject(obj)
{
	var result = [];
	var i;
	for(i in obj)
	{
		var value = obj[i];
		var name = i+':';
		result.push(name+JsonEncode(value));
	}
	return '{'+result.join(',')+'}';
}

function JsonEncode(obj)
{
	Array.prototype.testABCD123 = function(){};
	
	if(typeof(obj)=='object')
	{
		//Array
		if(obj!=null && obj.testABCD123 !=null)
		{
			return JsonEncodeArray(obj);
		}
		else
		{
			return JsonEncodeObject(obj);
		}
	}
	else
	{
		if(typeof(obj)=='string')
		{ 
			return '"'+Escape(obj)+'"';
		}
		else if(typeof(obj)=='number')
		{
			return obj;
		}
		else if(obj == null || obj == undefined)
		{
			return null;
		}
		else
		{
			return obj.toString();
		}
	}
}

function Escape(str)
{
	return str.replace(/\\/g,"\\\\").replace(/"/g,'\\\"').replace(/\r/g,"\\u000d").replace(/\n/g,"\\u000a");
}


function SearchResult()
{
	this.fields = [];
	this.data = [];
	this.currentSize = 0;
	this.documents = 0;
}

function RowItem()
{
	this.columnData = [];
	this.voteCount = 0;
	this.commentCount = 0;
}

function getFeedbackInfo(kmId)
{
	var result = {};
	
	var fkmfeedback = new SCFile("kmfeedback");
	var queryStr = "kmdocumentid=\""+kmId+"\"";

	var returnCount = new SCDatum();
    var rc = new SCDatum();
    var rc2 = funcs.rtecall("count", rc, fkmfeedback, queryStr, returnCount);
	result.commentCount = Number(returnCount.getText());
	
	queryStr = "kmdocumentid=\""+kmId+"\" and useful=true";
	rc2 = funcs.rtecall("count", rc, fkmfeedback, queryStr, returnCount);
	result.voteCount =Number( returnCount.getText());
	
	return result;
}

function getColumnFields(strHitlistTemplate)
{
	var hitlist = new Query("kmhitlisttemplate", new QueryCond("name", EQ, strHitlistTemplate));
	var h0 = hitlist[0];
	var hitlistcolumns = h0.columns;
	
	var fieldCount = 0;

    var i;	
    var length = funcs.lng(hitlistcolumns); 
	for(i=0;i<length;i++)
	{
		fieldCount+= funcs.lng(funcs.denull(hitlistcolumns[i].fields));
	}
	
	return fieldCount;
}

function buildSearchResult(aHitList, strHitlistTemplate)
{
	var searchResult = new SearchResult();
	
	//lookup the hitlist columns
	var hitlist = new Query("kmhitlisttemplate", new QueryCond("name", EQ, strHitlistTemplate));
	var h0 = hitlist[0];
	var hitlistcolumns = h0.columns;
	
	var columnFieldCount = getColumnFields(strHitlistTemplate);
	
 	var arrayArgs = new SCDatum();
  	arrayArgs.setType(8);  //type array
  	arrayArgs.push(aHitList[0]);
  	arrayArgs.push(aHitList[1]);
 	searchResult.currentSize = Number(aHitList[0]);
 	searchResult.documents = Number(aHitList[1]);
 	
 	searchResult.fields = addColumnHeadings(hitlistcolumns);
 	
 	
 	//identify the position of the link field in the hitlist array
	var linkPosition = lib.KMSearch.getLinkPosition(hitlist, hitlistcolumns);
	// identify the position of the knowledgebase name in the hitlist array.
	// add one for the viewURL and one to account for a 1 based array in SC.
	var kbnamePosition = 2 + lib.KMSearch.getKBNamePosition(hitlist, hitlistcolumns);
	
	var summaryPositions = [];
	var summaryFields = lib.KMSearch.getSummaryFields();
	var i;
	for (i=0; i<summaryFields.length; i++) {
	    summaryPositions.push(lib.KMSearch.getFieldPosition(hitlist, hitlistcolumns, summaryFields[i]));
	}
	
	var numColumns = hitlistcolumns.length();
	
	var rcount=0;
	var numRows = (aHitList.length() - 2)/(columnFieldCount + 1);
	
	var strViewURL;
	var fieldcount;
	var strRowClass;
	var numfields;
	var fsyslibLength = vars.$fsyslibs.length();
	
	var feedbacks= [];

	for(i=0;i<numRows;i++)
	{
	    var temp ={};
		searchResult.data[i] = [];
		var startIndex = 2 + (columnFieldCount + 1)*i;
		var offset = 1; 
		var j;
		for(j=0;j<numColumns;j++)
		{
			var fieldCount = funcs.lng(funcs.denull(hitlistcolumns[j].fields));
			
			var currentValue = "";
			var t;
			for(t=0;t<fieldCount;t++)
			{	
				if (t>0) {
				    currentValue += "\n";
				}
				if (lib.ArrayUtil.contains(summaryPositions, offset)) {
				    currentValue += lib.KMSearch.convertSummaryDatetime(aHitList[startIndex + offset]);
				} else {
				    currentValue += aHitList[startIndex + offset];
				}
				offset++;
			}
			temp[searchResult.fields[j]]=removeHTMLTag(currentValue);
			
		}
		//Link
		var link = aHitList[startIndex];
		temp["Link"]=link;
		searchResult.data[i]=temp;
		
		var kmIdReg =  /KM\d+/gi;
		var matches = link.match(kmIdReg);
		if(matches)
		{
			var kmId = matches[0];
			
			feedbacks.push(kmId);
		}
	}
	
	getFeedbackCount(feedbacks);
	
	for(i=0;i<numRows;i++)
	{
	    if(!!feedbacks[i]) {
		    searchResult.data[i]["commentCount"]=feedbacks[i].commentCount;
		    searchResult.data[i]["usefulCount"]=feedbacks[i].usefulCount;
	    }
	}
	
	return lib.JSON2.toJSON(searchResult);
}

//strip string "file:/" from URL
function customizeViewURL(strViewURL)
{
      if ( strViewURL!= null)
      {
            strViewURL = strViewURL.replace("file:/","");
      }           
      return strViewURL;
}

function addColumnHeadings(hitlistcolumns)
{
	var headerItems = [];
	var numColumns = hitlistcolumns.length();
	var hidx;
	for( hidx = 0; hidx < numColumns; hidx ++)
	{
		var tmpVal = "";
	    var theHdr = hitlistcolumns[hidx].heading;
	    if(theHdr == null || theHdr == "")
	    {
	    	tmpVal = "Header"+hidx;
	    }
	    else
	    {
		    var spec_loc = theHdr.indexOf("*SCMSG");
		    tmpVal = hitlistcolumns[hidx].heading;
		 
			if (spec_loc >= 0)
			{
		    	var tmpFld = theHdr.substring(spec_loc + 7, theHdr.length);
			    tmpFld = tmpFld.substring(0, tmpFld.indexOf("*SCMSG"));
		    	eval('tmpVal = funcs.scmsg(' + tmpFld + ', "km");');
			    if (tmpVal == null)
			    {
		    	    tmpVal = "";
		    	}   
		      
			}
		}
				    	
		headerItems.push(tmpVal);
	}
	headerItems.push("Link");
	headerItems.push("commentCount");
	headerItems.push("voteCount");
	return headerItems;
}

function removeHTMLTag(htmStr)
{
	var htmTags = ['ul','li'];
	var reg = buildReg(htmTags);
	return htmStr.replace(reg,"");
}

function getFeedbackCount(idArray)
{	
	var kmfile =new SCFile("kmfeedback", SCFILE_READONLY);
	var resultArray = [];
	var idStr="";
	var i;
	for(i=0; i<idArray.length; i++)
	{
		if (i==idArray.length-1) {
		    idStr+="\""+idArray[i]+"\"";
		}
		else {
		    idStr+="\""+idArray[i]+"\",";
		}
	}

	var sql="kmdocumentid isin{"+idStr+"}";// order by FB.kmdocumentid";
	var orderbyFileds=["kmdocumentid"];
	var orderbySort = [SCFILE_ASC];
	var rc = kmfile.setOrderBy(orderbyFileds, orderbySort);
	if(rc!=RC_SUCCESS)
	{
		return false;
	}
	
	rc = kmfile.doSelect(sql);
	if(rc==RC_SUCCESS)
	{
		for(i=0; i<idArray.length; i++)
		{
			var docFeedback = {
								id: kmfile.kmdocumentid,
								usefulCount: 0, 
							    commentCount: 0
							   };
			
			while(rc==RC_SUCCESS)
			{
				if(null!=kmfile.useful && kmfile.useful)
				{
					docFeedback.usefulCount++;
				}
				if(null!=kmfile.feedbacktext)
				{
					docFeedback.commentCount++;
				}
				rc = kmfile.getNext();
				
				if(docFeedback.id!=kmfile.kmdocumentid) {
				    break;
				}
			}
			resultArray.push(docFeedback);
		}
		var hasId;
		for(i=0; i<resultArray.length; i++)
		{
			hasId=false;
			var j;
			for(j=0; j<resultArray.length; j++)
			{
				if(idArray[i]==resultArray[j].id)
				{
					idArray[i]=resultArray[j];
					hasId=true;
					break;
				}
			}
			if(!hasId)
			{
				idArray[i]= {
							id: idArray[i],
							usefulCount: 0, 
						    commentCount: 0
						   };
			}
		}
		return idArray;
	}
	else
	{	
		return false;
	}
}

function buildReg(htmTags)
{
	var str = "/";
	str = str + "<"+htmTags[0]+".*?>|"+"<\\/"+htmTags[0]+">";
	var i;
	for(i=1;i<htmTags.length;i++)
	{
		str = str + "|<"+htmTags[i]+".*?>|"+"<\\/"+htmTags[i]+">";
	}
	str = str + "/gi";
	return eval(str);
}

function test()
{
	var x="<SPAN class=\"hithighlight\">Process</SPAN>";
	print(removeHTMLTag(x));
	return system.vars.$L_file.results;
}
