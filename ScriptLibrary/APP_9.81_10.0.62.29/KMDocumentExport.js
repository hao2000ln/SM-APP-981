var earlierVer = false;
var createdViewName = "Auto Created View for KM Export"  

function appendNewNode( type, name, value, xmlSource, target ){
    var newNode = xmlSource.createNode( type, name, value );
    var FoundNode = findTargetElement( xmlSource, target );
    FoundNode.appendNode( newNode );
    return newNode;
}

function findTargetElement( node, targetElem ){
    var topNodeName = node.getNodeName();
    while (node != null && node.getNodeName() != targetElem )
    {
        var childNode = node.getFirstChildElement();
        if (childNode == null){
            childNode = node.getNextSiblingElement();
            while (childNode == null){
                node = node.getParentNode();
                if ( node == null || topNodeName == node.getNodeName() ){
                    return null;
                }
                childNode = node.getNextSiblingElement();
            }
            node = childNode;
        }
        else{
            node = childNode;
        }
    }
    return node;
}

function writeAttachments(  sclibFile, indexArray, attachPath )
{
    var retArray = [];
    var retSub1 = [];
    var retSub2 = [];
    var retSub3 = [];
    var doc_id = sclibFile["id"];
    var doc_id_fs = lib.KMUtils.cleanDocID(sclibFile["id"]);
    if ( indexArray != null && indexArray[0].length > 0 ) {
        for ( var i = 0; i < indexArray[0].length; i++ ) {
            var rc = writeAttachmentToFile( attachPath+"/"+doc_id_fs+"_"+indexArray[1][i], "kmdocument", doc_id, indexArray[2][i] );
            if (rc == RC_SUCCESS){
                retSub1.push( indexArray[0][i] );
                retSub2.push( indexArray[1][i] );
                retSub3.push( indexArray[2][i] );
            }
        }
    }

    retArray[0] = retSub1;
    retArray[1] = retSub2;
    retArray[2] = retSub3;
    return retArray;
}

function findAttachments( kmdoc )
{
    var retArray = [];
    var retSub1 = [];
    var retSub2 = [];
    var retSub3 = [];
    var attinfo = lib.KMUtils.getAttachmentInfo("kmdocument", kmdoc["id"]);

    if ((attinfo != null) && (attinfo.length() > 0)) {
        var numAttachments = attinfo.length();
        for (var i=0; i<numAttachments; i++) {
            // get the UID of the attachment
            var strUID = attinfo[i].split(":")[0];
            // get the filename of the attachment
            var fname = attinfo[i].split(":")[1];

            retSub1.push( i );
            retSub2.push( fname );
            retSub3.push( strUID );
        }
    }
    retArray[0] = retSub1;
    retArray[1] = retSub2;
    retArray[2] = retSub3;
    return retArray;
}

function normarizeAttachFileName( doc,docid){

    if( !doc) {
        return "";
    }
    var srcIndex = doc.indexOf("scattach://");
    var end;
    var attachSrc;
    var attchName;
    var normalName;
    while(srcIndex > 0){
        end =  doc.indexOf('"',srcIndex);
        attachSrc = doc.substring(srcIndex+11, end);
        if(attachSrc.indexOf(docid) == attachSrc.length - docid.length ){
            attchName = attachSrc.split(':');
            normalName ='../resources/' +attchName[3]+'_'+attchName[1];
            doc = doc.replace('scattach://'+attachSrc,normalName);
        }
        else{
            srcIndex = end;
        }
        srcIndex = doc.indexOf("scattach",srcIndex);
    }
    return doc;
}

function normarizeActiveLink(doc,links){
    if(!doc) {
        return "";
    }
    var linkIndex = doc.indexOf("scactivelink://kmdocument:id=");
    var end;
    var attachSrc;
    var normalName;
    while(linkIndex > 0){
        end =  doc.indexOf('"',linkIndex);
        attachSrc = doc.substring(linkIndex, end);
        
        var attachName = attachSrc.split(':')[2];
     	
     	attachName = attachName.split('=')[1];
        normalName =attachName.substring(6, attachName.length-6);
        
        links.push(normalName+".html");
        var linkName = "./"+normalName+".html";
        doc = doc.replace(attachSrc,"./"+normalName+".html");
        end = linkIndex+linkName.length;
        	
        linkIndex = doc.indexOf("scactivelink://kmdocument:id=",end);        
    }

    return doc;
}

function getErrorMsgContent(kmDoc){
    var htmlContent = [];
    if(kmDoc.error){
        htmlContent.push('<div>Error Message</div><p>');
        htmlContent.push(kmDoc.error);
        htmlContent.push('</p>');

        htmlContent.push('<div>Cause</div><p>');
        htmlContent.push(kmDoc.cause);
        htmlContent.push('</p>');

        htmlContent.push('<div>Workaround / Fix</div><p>');
        htmlContent.push(kmDoc.fix);
        htmlContent.push('</p>');
    }

    return htmlContent.join("");
}

function getQuestionAnswerContent(kmDoc){
    var htmlContent = [];
    htmlContent.push('<div>Question</div><p>');
    htmlContent.push(kmDoc.question);
    htmlContent.push('</p>');

    htmlContent.push('<div>Answer</div><p>');
    htmlContent.push(kmDoc.answer);
    htmlContent.push('</p>');

    return htmlContent.join("");
}

function getProblemSolutionContent(kmDoc){
    var htmlContent = [];
    htmlContent.push('<div>Problem</div><p>');
    htmlContent.push(kmDoc.problem);
    htmlContent.push('</p>');

    htmlContent.push('<div>Solution</div><p>');
    htmlContent.push(kmDoc.solution);
    htmlContent.push('</p>');

    return htmlContent.join("");
}

function getReferenceContent(kmDoc){
    return kmDoc.reference;
}

function add2HtmlContent(val,fieldName,htmlContent)
{
	if (val)
	{
		htmlContent.push('<div>');
		htmlContent.push(fieldName);
		htmlContent.push('</div><p>');
		htmlContent.push(val);
		htmlContent.push('</p>');
	}
	
	return htmlContent;
}

function html2Escape(sHtml) {
    return sHtml.replace(/[<>&"]/g, function(c) {
        return {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;'
        }[c];
    });
}

function getOtherTypeContent(kmDoc){

	var htmlContent = [];
    
    htmlContent = add2HtmlContent(kmDoc.problem, "Problem", htmlContent);
    htmlContent = add2HtmlContent(kmDoc.solution,"Solution", htmlContent);    
    
    htmlContent = add2HtmlContent(kmDoc.question,"Question", htmlContent);
    htmlContent = add2HtmlContent(kmDoc.answer, "Answer",htmlContent );
    
    htmlContent = add2HtmlContent(kmDoc.error, "Error Message", htmlContent);
    htmlContent = add2HtmlContent(kmDoc.cause, "Cause",htmlContent );
    htmlContent = add2HtmlContent(kmDoc.fix, "Workaround / Fix", htmlContent);
    
    if (kmDoc.summary)
    {
    	htmlContent = add2HtmlContent(html2Escape(kmDoc.summary),"Summary", htmlContent);
    }
    htmlContent = add2HtmlContent(kmDoc.reference, "Reference", htmlContent);
   
    if ( htmlContent.length == 0 )
	{
		htmlContent.push("There is no content for this KM Article.")
	}

    return htmlContent.join("");
}

function getHTMLContent(kmDoc, hasView){
    var htmlContent = "";
	
	if (hasView)
	{
		var docType = kmDoc.doctype;
		//get the doctype record
		var q = new Query("kmdoctype", new QueryCond("name", EQ, docType));
		var q0 = q[0]; 
		if (q0)
		{
		    var views = q0.format_view;
		    
            var vwIdx;
            var vwlength = views.length();
			for (vwIdx=0;vwIdx < vwlength;vwIdx++)
			{
				if (views[vwIdx].view_name == createdViewName)
				{
					var theView = views[vwIdx].view_data;
					
					if (theView==null || theView == "")
					{
						htmlContent ="There is no content for this KM Article.";
					}
					else
					{
						theView = lib.KMDocPreview.replaceTokensWithData( theView, kmDoc);
						theView = lib.KMDocPreview.replaceSCMSGTokens(theView);
						htmlContent = theView;
					}
					return htmlContent;
				}	
			
			}
		}
	}
	
	htmlContent = getOtherTypeContent(kmDoc);
		
    return htmlContent;
}

function getMetaData(kmDoc){
    var metaData = {
        "document-type": kmDoc.doctype,
        "title": kmDoc.title,
        "author": kmDoc.author,
        "tags": kmDoc.tags ? kmDoc.tags.toArray().join(';') : "",
        "categories": kmDoc.categories ? kmDoc.categories.toArray().join(';') : "",
        "created-time": funcs.str(kmDoc.creation_date),
        "last-modified-time": funcs.str(kmDoc.sysmodtime),
        "expiration-date": funcs.str(kmDoc.expiration_date),
        "external-id": kmDoc.id,
        "status":kmDoc.status,
        "summary":kmDoc.summary,
        "file-name":kmDoc.id+".html"
    };
    return metaData;
}

function exportKMDoc(kmDoc, exportPath, hasView)
{
	var htmlContent = getHTMLContent(kmDoc, hasView);
    var metaData = getMetaData(kmDoc);

    if(htmlContent){
        htmlContent = normarizeAttachFileName(htmlContent, kmDoc["id"]);
        var links = [];
        htmlContent = normarizeActiveLink(htmlContent,links);
        writeFile(exportPath+"/"+kmDoc["id"]+".html",null,htmlContent );
    }
    if(links && links.length){metaData['sclink']=links;}
    return metaData;
}

function writeMetaInfo(metaFile,meta_data,attachmentArray,doc_id){
    var articleNode = metaFile.createNode(1,'article',null);
    var metaNode = findTargetElement(metaFile,'metadata');
    metaNode.appendNode(articleNode);

    var item;
	for(item in meta_data){
        if(item == "sclink"){
        	var sclinkNode = metaFile.createNode(1, "sclinks", null);
            articleNode.appendNode(sclinkNode);
            var links = meta_data[item];
            var idx;
            for(idx = 0; idx<links.length; idx++){
                var linkNode = metaFile.createNode(1, item, null);
                sclinkNode.appendNode(linkNode);
                if(links[idx]) {
                    var linkText = metaFile.createNode(3, null, links[idx]);
                    linkNode.appendNode(linkText);
                }
            }
        }
        else if(item == "title" || item == "summary"){
            
            var titleNode = metaFile.createNode(1, item, null);
          	articleNode.appendNode(titleNode);
          		
			if ( typeof metaFile.enableCData === 'function' )
          	{
          		var cdataNode = metaFile.createNode(4, null, meta_data[item]);
          		cdataNode.enableCData(true);
          	}          
          	else
          	{
          		earlierVer = true;
          		var metaItem = html2Escape( meta_data[item]) ;
          		          		
          		var titleStr = "\<![CDATA[" + metaItem + "]]\>";        		
           		var cdataNode = metaFile.createNode(3, null, titleStr);
          	}
           
           	titleNode.appendNode(cdataNode);
        }
        
        else{
            var itemNode = metaFile.createNode(1, item, null);
            articleNode.appendNode(itemNode);
            if(meta_data[item]) {
                var textNode = metaFile.createNode(3, null, meta_data[item]);
                itemNode.appendNode(textNode);
            }
        }
    }

    if ( attachmentArray != null && attachmentArray[0].length > 0 ) {
        var attachmentsNode = metaFile.createNode(1, "attachments", null);
        articleNode.appendNode(attachmentsNode);
        var i;
        for (i = 0; i < attachmentArray[0].length; i++) {
            var attachmentNode = metaFile.createNode(1, "attachment", null);
            attachmentsNode.appendNode(attachmentNode);

            var textNode = metaFile.createNode(3, null, "./resources/" + doc_id + "_" + attachmentArray[1][i]);
            attachmentNode.appendNode(textNode);
        }
    }

    return metaFile;
}


function doExport( exportPath, hasView, exportPhase ){

	if (hasView=="" || hasView==null)
    {
    	hasView = false;
    }
    
	var sfile =  new SCFile("kmdocument");
	var sql="";
	if (exportPhase=="" || exportPhase==null)
	{
		sql="true";
	}
	else
	{
		sql = "status=\""+exportPhase+"\"";
	}
	var rc = sfile.doSelect(sql);
        
    var metaFile =  new XML();
    var attachmentArray;
    var counter = 0;
    if(rc == RC_SUCCESS){
    	if (makeDir(exportPath+'/articles')!=0 )
        {
        	var msg = funcs.scmsg("create.article.folder.error", "KMDocumentExport");
        	print(msg);
        	return;
        }
        if (makeDir(exportPath+'/resources')!=0)
        {
        	var msg = funcs.scmsg("create.resource.folder.error", "KMDocumentExport");
        	print(msg);
        	return;
        }
        metaFile.setContent("<metadata></metadata>");
        
        while(rc == RC_SUCCESS){
        	var meta_data = exportKMDoc(sfile,exportPath+'/articles', hasView);
        	attachmentArray = findAttachments(sfile);
        	writeAttachments(sfile,attachmentArray,exportPath+'/resources');

        	var doc_id = lib.KMUtils.cleanDocID(sfile["id"]);
        	metaFile = writeMetaInfo(metaFile, meta_data,attachmentArray,doc_id);
        	counter++;
        	if( counter % 100 == 0 ){
        		var msg = funcs.scmsg("document.exporting", "KMDocumentExport",[counter]);        	
        		print(msg);        	
        	}
        	rc = sfile.getNext();
    	}

		var metaXMLString = metaFile.toXMLString();
	
		if (earlierVer)
		{
			metaXMLString = metaXMLString.replace(/&lt;!\[CDATA\[/g, "<!\[CDATA\[");
			metaXMLString = metaXMLString.replace(/]]&gt;/g, "]]>");
		}

    	writeFile(exportPath+"/metadata.xml",null,metaXMLString);
    }
   
    var msg = funcs.scmsg("document.exported", "KMDocumentExport",[counter]); 
    print(msg);   
}

//delete km doctype template view for exporting km article
function deleteTemplateViews()
{
	var fDocType = new SCFile("kmdoctype");
    var rc = fDocType.doSelect("true");
      
    while( rc == RC_SUCCESS)
    {   
    	var len =  fDocType.format_view.length();	
    	var vwIdx;
        for (vwIdx=0;vwIdx < len;vwIdx++)
		{			
			if ( fDocType.format_view[vwIdx].view_name == createdViewName)
			{
				fDocType.format_view=funcs._delete(fDocType.format_view,vwIdx+1);
				break;
			}	
		}
		fDocType.doSave();
      	rc = fDocType.getNext();
    }
    
    var msg = funcs.scmsg("delete.template.view", "KMDocumentExport"); 
    print(msg);
}


//duplicate km doctype template view for exporting km article
function copyDocTypeTemplateViews()
{
	var fDocType = new SCFile("kmdoctype");
    var rc = fDocType.doSelect("true");
     
    while( rc == RC_SUCCESS)
    {  		
    	var highestLevelVal = 0;
		var highestLevelViewIndex = 0;
	
    	var createViewFlag = true;
        var len =  fDocType.format_view.length();	
        var vwIdx;
        for (vwIdx=0;vwIdx < len;vwIdx++)
		{
			if (fDocType.format_view[vwIdx].view_seclevel > highestLevelVal )
			{
				highestLevelVal = fDocType.format_view[vwIdx].view_seclevel;
				highestLevelViewIndex = vwIdx;
			}	
			if ((!fDocType.format_view[vwIdx].view_name || fDocType.format_view[vwIdx].view_name == createdViewName) && createViewFlag)
			{
				createViewFlag = false;
				break;
			}
		}
	
		if (createViewFlag)
		{	
			var f_view = fDocType.format_view[highestLevelViewIndex];
        	
      		var add_view = fDocType.format_view[len];
      		add_view.view_name = createdViewName;
      		add_view.view_data = f_view.view_data;
      		add_view.view_description = f_view.view_description;
      		//add_view.view_roles = f_view.view_roles;
      		add_view.view_roles = [];
      		add_view.view_seclevel = -1;
      	     	      		
      	    fDocType.doSave();
      	}
      	rc = fDocType.getNext();
    }
    
    var msg = funcs.scmsg("create.template.view", "KMDocumentExport"); 
    print(msg);
}


//step1
//this step is optional and it is suggested to run this step when new columns are added to kmdocument table:
//if running this step,this tool will create exporting view for each document type and KM articles can be exported with these views in step2.
//if not running this step, this tool only supports to export km articles with default format and oob fields.
//
//how to run this step?
//1. uncomment the copyDocTypeTemplateViews() to run this step.
//2. the newly created views need to be modified manually following the User Guide. 
//3. Comment the copyDocTypeTemplateViews() for next running. 
//
//copyDocTypeTemplateViews();


//step2
//comment the copyDocTypeTemplateViews() if it is uncommented in step 1
//uncomment doExport(path, hasView, exportStatus) and change its arguments following below description:
//
//path:         this argument is used to set the directory for storing output files. the valid path format should be "driver:\\directory";
//hasView:      if you ran the copyDocTypeTemplateViews() and modified exporting views mannually,then set hasView as true, 
//              otherwise set hasView as false. you also can ignore this argument and the default value is false
//exportStatus: type a valid KM status value(such as "internal", "external"), then this tool will only export the KM articles which are in specified status. 
//              if ignoring this argument, this tool will export all KM articles.
//
//doExport(path, hasView, exportStatus);

//step3
//you can run deleteTemplateViews() to remove template views created in the copyDocTypeTemplateViews()
//Before running this function, please comment both copyDocTypeTemplateViews() and doExport()
//
//deleteTemplateViews();
