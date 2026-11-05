var _ = lib.Underscore.require(),
    IDOLQueryEvaluator = lib.IDOLQueryEvaluator.require(),
    IDOLKMFieldMapping = lib.IDOLKMFieldMapping.require(),
    mappingIDOLField = IDOLKMFieldMapping.mappingIDOLField;

var IDOLKMFilter = (function() {

  function mappingIDOLField(fieldname) {
    return fieldname.toUpperCase() + "_MATCH";
  }

  function getKBFilter(kmlibFile,fKMQuery) {
    var kbFilter=[];

    var secFilter = getSecurityFilter(kmlibFile);
    if(secFilter.length > 3){
      kbFilter.push(secFilter);
    }

    var pcFilter = getProcessCriteriaFilter(kmlibFile,fKMQuery);

    if (pcFilter.length > 3) {
        kbFilter.push(pcFilter);
    }
    kbFilter = "(" + kbFilter.join(' AND ') +")" ;

    return kbFilter;
  }

  function getProcessCriteriaFilter(kmlibFile, fKMQuery){
    var advfilter ="";
    if(vars.$G_advsearch || (fKMQuery.kmlib_hotnews && kmlibFile.kbname === 'Knowledge_Library')) {
      var accessScript = lib[kmlibFile.processlibcriteriascript];
      if (accessScript && accessScript.ProcessLibCriteria ) {
          advfilter = accessScript.ProcessLibCriteria(fKMQuery);
        }
    }
    return advfilter;
  }

  function getKMSecurity(kmlibFile) {
    var  kmsearchquery = "",
         tmpsearchquery = "",
         securityScript = lib[kmlibFile.searchsecurityscript];
         
    if (securityScript && securityScript.getSecurityInfo ) {
        tmpsearchquery = securityScript.getSecurityInfo(funcs.operator(), kmlibFile);
    }

    if (tmpsearchquery.length > 1) {
        kmsearchquery = "(" + tmpsearchquery + ")+AND+MATCH{" + kmlibFile.kbname + "}:KNOWLEDGEBASE_NAME_MATCH";
    } else {
        kmsearchquery += "MATCH{" + kmlibFile.kbname+"}:KNOWLEDGEBASE_NAME_MATCH";
    }
    return kmsearchquery;
  }

  function getMandantenFilter(kmlibFile) {
    var mdtFilter = "";
    if(kmlibFile.kbtype === "sclib" ) {
      var sctable = kmlibFile.sclibtablename;
      var sql = getMandantQuery(sctable);

      if(sql) {
        sql = lib.IDOLSecurity.checkArrayMandant(sctable, sql);
        var ast = parseQuery(sql);
        mdtFilter += IDOLQueryEvaluator.convertToIDOLQuery(ast, null, function (fieldname) {
          return fieldname.toUpperCase() + "_MATCH";
        });
      }
    }
    return mdtFilter;
  }


  function getSecurityFilter(kmlibFile) {
    var buff = [];
    if(kmlibFile.kbtype === 'sclib') {
      var  kmSecurity = getKMSecurity(kmlibFile);
      if(kmSecurity.length > 1 ) {
        buff.push(kmSecurity);
      }
      var secMandanten = getMandantenFilter(kmlibFile);
      if(secMandanten.length > 3){
        buff.push(secMandanten);
      }            
    } else {
      buff.push('MATCH{' + kmlibFile.kbname + '}:DREDBNAME');
    }
    return buff.join(' AND ');
  }

  function getFieldText(selectedLibs,fKMQuery) {
    var buff = [];
    if (fKMQuery.searchinresults){
      try{
        var pre_submit = JSON.parse(fKMQuery.submitstring);
        var pre_fieldText= pre_submit.FieldText;
        if(pre_fieldText.length >0 ){
            buff.push(pre_fieldText);
        }
      }
      catch(e){
        logger.error(e);
        throw e;
      }
    }

    buff.push(getAttachmentFilter());
    buff.push(searchIDOLFilterQuery(selectedLibs, fKMQuery));
    if(fKMQuery.kmlib_hotnews){
      buff.push('MATCH{true}:'+ mappingIDOLField("hotnews",'Knowledge_Library'));
    }

    return {"FieldText":buff.join(' AND ')};
  }



  function searchIDOLFilterQuery(selectedKBs, fKMQuery) {
    var kmlibFile = new SCFile("kmknowledgebase");
    var rc = kmlibFile.doSelect("true");

    var buff = [];
    fKMQuery.previousfilterqueries = fKMQuery.previousfilterqueries || "";

    if (rc == RC_SUCCESS) {
      rc = kmlibFile.getFirst();
      while (rc == RC_SUCCESS) {
        if (selectedKBs.indexOf(kmlibFile.kbname) > -1) {

          var kbFilter = getKBFilter(kmlibFile, fKMQuery);
          if(kbFilter) {
            buff.push(kbFilter);
          }
        }
        rc = kmlibFile.getNext();
      }
      fKMQuery.filterqueries ="("+buff.join('+OR+')+")";
    }

    return fKMQuery.filterqueries;
  }


  function getAttachmentFilter() {
    return "((NOTMATCH{joboptions}:IMPORTMAGICEXTENSION)+OR+EMPTY{}:IMPORTMAGICEXTENSION)";
  }

  return {
    getKBFilter : getKBFilter,
    getSecurityFilter : getSecurityFilter,
    getFieldText : getFieldText,
    getAttachmentFilter : getAttachmentFilter,
    searchIDOLFilterQuery : searchIDOLFilterQuery
  }
})();

function require() {
  return IDOLKMFilter;
}