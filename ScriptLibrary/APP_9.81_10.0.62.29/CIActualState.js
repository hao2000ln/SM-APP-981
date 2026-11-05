var strStyle = "<STYLE>\
body{\
  PADDING-RIGHT: 0px;\
  PADDING-LEFT:0px;\
  FONT-SIZE: 11px;\
  PADDING-BOTTOM:0px;\
  MARGIN:0px;\
  COLOR: #000000;\
  PADDING-TOP:0px;\
  FONT-FAMILY: Verdana, Arial, Helvetica, sans-serif;\
  BACKGROUND-COLOR: #ffffff\
}\
\
.listTable{\
  font-family: Verdana, Arial, Helvetica, sans-serif;\
  margin:0px;\
  padding:0px;\
  font-size: 11px;\
  border-top: #ccc 0px solid;\
  border-bottom: #ccc 0px solid;\
  border-right: #ccc 0px solid;\
  color: #000000;\
  background: #ffffff;\
}\
\
.listTable TD{\
  border-left: #ccc 0px solid;\
  font-weight: normal;\
  padding:4px 6px 4px 6px;\
  color: #000000;\
  line-height: 14px;\
}\
\
.listTableEnd {\
  border-right: #ccc 0px solid;\
}\
\
.listTable TH{\
  border-top: #ccc 0px solid;\
  border-left: #ccc 0px solid;\
  font-weight: bold;\
  padding:4px;\
  background: #E0E0E0;\
  text-align: left;\
}\
\
.oddRow{\
  BACKGROUND: #edf3fe;\
  COLOR: #0000cc\
}\
.evenRow{\
  BACKGROUND: #ffffff;\
  COLOR: #0000cc\
}\
.listTable A{\
  color: #0000CC;\
  cursor: pointer;\
  text-decoration: none;\
}\
\
.listTable A:HOVER{\
  text-decoration: underline;\
  color: #0000FF;\
}\
\
.resultLink{\
  font-weight:bold;\
}\
\
.hithighlight{\
  FONT-WEIGHT: bold;\
}\
\
.resultHeading{\
  PADDING: 4px;\
  TEXT-ALIGN:left;\
  display: block;\
}\
.resultTable{\
  font-size: 11px;\
  PADDING: 4px;\
   TEXT-ALIGN:left;\
  display: block;\
  scrolling:auto;\
}\
\
.informationMessage{\
  font-size: 11px;\
  font-weight:bold;\
  TEXT-ALIGN:left;\
}\
\
.label{\
  TEXT-ALIGN:left;\
}\
</STYLE>";

// HARDCODE TEST DATA


function getActualState(strCI_ID)
{
	var rcode;
	var strHTML = strStyle + "<DIV class=\"resultTable\"><TABLE class=\"listTable\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">";
	var strColumnWidth = "width=\"40%\"";
	var	strRowClass;	
	
	//make sure we have a ucmdb.id else return message
	if(strCI_ID== "" || strCI_ID == null || strCI_ID == undefined )
	{
		return strHTML + "<TR><TD><SPAN class=\"informationMessage\">"+ system.functions.scmsg(165, "ScriptLibrary")+"</SPAN></TD></TR></TABLE></DIV>";
	}	
	
	var ucmdbSvc = {};
	var totalRows = 0;
	ucmdbSvc.location = lib.uCMDBConfiguration.getWebserviceUrl();
	ucmdbSvc.user     = lib.uCMDBConfiguration.getUsername(); 
	ucmdbSvc.password = lib.operatorUtil.getPassword(lib.uCMDBConfiguration.getPassword());
	
	var customerId = lib.uCMDBConfiguration.getUcmdbCustomerID();
    // set CustomerID for multi tenant
    if( system.vars.$G_multi && lib.uCMDBConfiguration.isEnabled() )
    {
        var companyData = lib.discoveryEvent.getUCMDBCompanyData(vars.$L_file);
        customerId = companyData.ucmdb_customer_id || customerId;
        //set user name and password
        setUserNamePassword(ucmdbSvc,companyData);      
    } 

	var getAllCIPropertiesResp;
	try
	{
		getAllCIPropertiesResp = doGetActualState(ucmdbSvc.location, strCI_ID, ucmdbSvc.user, ucmdbSvc.password, customerId);
	}
	catch(e)
	{
		return strHTML + "<TR><TD><SPAN class=\"informationMessage\">"+ system.functions.scmsg(164, "ScriptLibrary")+"</SPAN></TD></TR><TR><TD>"+ e.toString() + "</TD></TR></TABLE></DIV>";
	}
	
	if ( getAllCIPropertiesResp.isFault() )
	{
	   return strHTML + "<TR><TD><SPAN class=\"informationMessage\">"+ system.functions.scmsg(164, "ScriptLibrary")+"</SPAN></TD></TR><TR><TD>"+ getAllCIPropertiesResp.faultstring.getValue() + "</TD></TR></TABLE></DIV>";
	}
	
	var numProps = getAllCIPropertiesResp.CI.prop.length;
		
	for( i= 0; i < numProps; i++, totalRows++ )
	{
		strRowClass = totalRows%2==0 ? "evenRow" : "oddRow";
		strHTML += "<TR valign=top CLASS=\""+ strRowClass +"\">";
		strHTML += "<TD " + strColumnWidth +" >" + 
					getLocalizedLabel( getAllCIPropertiesResp.CI.prop[i].name.getValue() )  + ": </TD>";
		strHTML += "<TD>" + getAllCIPropertiesResp.CI.prop[i].value.getValue() + "</TD>";
		strHTML += "</TR>";
	}
	
	numProps = getAllCIPropertiesResp.CI.complexProp.length;
	
	for( i= 0; i < numProps; i++ )
	{
		var numSubProps = getAllCIPropertiesResp.CI.complexProp[i].length();
		
		strRowClass = totalRows++%2==0 ? "evenRow" : "oddRow";

		for( j=0; j < numSubProps; j++ )
		{
			strHTML += "<TR valign=top CLASS=\""+ strRowClass +"\">";
			strHTML += "<TD " + strColumnWidth +" >" + 
						getLocalizedLabel( getAllCIPropertiesResp.CI.complexProp[i].className ) + "</TD>";
			strHTML += "<TD></TD>";
			strHTML += "</TR>";			
		
		    complexProp = getAllCIPropertiesResp.CI.complexProp[i].item[j].prop;
			numComplexPropItems = complexProp.length;
			
			for(k = 0; k < numComplexPropItems; k++, totalRows++ )
			{
				strRowClass = totalRows%2==0 ? "evenRow" : "oddRow";
				strHTML += "<TR valign=top CLASS=\""+ strRowClass +"\">";
				strHTML += "<TD " + strColumnWidth +" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + 
							getLocalizedLabel( complexProp[k].name.getValue() ) + ": </TD>";
				strHTML += "<TD>" + complexProp[k].value.getValue() + "</TD>";
				strHTML += "</TR>";
			}
		}
	}
		
	strHTML += "</TABLE></DIV>";	
	
	return strHTML;
}

function getLocalizedLabel( label )
{
	var text;
	
	text = system.functions.scmsg( label, "ucmdb" );
	
	if (system.functions.index( "Message ", text ) == 0 )
	{
		return text==null?label:text;
	}
	var msg = new SCFile( "scmessage", SCFILE_READONLY );
	var sql = "syslanguage=\""+vars.$G_my_language+"\" and class=\"ucmdb\" and message.id=\""+label+"\"";
	
	if ( msg.doSelect( sql ) == RC_SUCCESS )
	{
		return msg.message==null?label:msg.message;
	}
	
	if ( vars.$G_my_language != "en" )
	{
		sql = "syslanguage=\"en\" and class=\"ucmdb\" and message.id=\""+label+"\"";
		if ( msg.doSelect( sql ) == RC_SUCCESS )
		{
			return msg.message==null?label:msg.message;
		}
	}
	
	msg.syslanguage = vars.$G_my_language;
	if (msg.syslanguage == null )
	{
		msg.syslanguage = "en";
	}
	msg.message_id = label;
	msg.severity = 10;
	msg.message = label;
	msg._class = "ucmdb";
	
	msg.doInsert();

	return label;
}

function setUserNamePassword(ucmdbSvc, companyData)
{
	if (companyData.ucmdb_userid != null)
	{
		ucmdbSvc.user = companyData.ucmdb_userid;
		if(companyData.ucmdb_password == null)
		{
			ucmdbSvc.password = "";
		}		
		else 
		{
			ucmdbSvc.password = lib.operatorUtil.getPassword(companyData.ucmdb_password);
		}
	}
}

function doGetActualState(url, ucmdbId, user, pass, company) {
    if (!company) company = 1;

    var reqBody = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:typ="http://schemas.hp.com/ucmdb/1/types">'
        + '<soap:Header/><soap:Body><typ:getAllCIProperties>'
        + '  <typ:ID>' + ucmdbId + '</typ:ID>'
        + '  <typ:CustomerID>' + company + '</typ:CustomerID>'
        + '</typ:getAllCIProperties></soap:Body></soap:Envelope>';


    var baseAuth = "Basic " + lib.Base64Encoder.encode(user + ":" + pass);
    var headers = [];
    headers.push(new Header('Accept-Encoding', 'gzip,deflate'));
    headers.push(new Header('Content-Type', 'application/soap+xml;charset=UTF-8;action="getAllCIProperties"'));
    headers.push(new Header('Authorization', baseAuth));
    var respHeaders = {};
    var resp = doHTTPRequest("POST", url, headers, reqBody, 10, 10, null, respHeaders);

    var xml = new XML();
    xml.setContent(resp);
    var resultObj = {};
    lib.SOAP.deserialize( "ucmdbSMService", xml.getDocumentElement(), resultObj);
    var content = resultObj["soap_Envelope"][ "Body" ].getContent();
    return content;
}