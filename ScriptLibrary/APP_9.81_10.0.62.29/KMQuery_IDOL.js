/**  @fileoverview KMQuery_IDOL
 *   @author Yang,Chun-Fu
 */

var _ = lib.Underscore.require(),
    KMCollection_Update_Utils = lib.KMCollection_Update_Utils,
    IDOLGlobalSearchLibrary = lib.IDOLGlobalSearchLibrary.require(),
    IDOLKMSecurity          = lib.IDOLKMSecurity.require(),
    IDOLKMFieldMapping      = lib.IDOLKMFieldMapping.require(),
    IDOLKMQueryParameter    = lib.IDOLKMQueryParameter.require();

var logger = getLog('KMQuery_IDOL');

var KMQuery_IDOL= (function(){


  function getKMRawCategory(fKmKnowledgebase, scLibFile) {
    var categoryStr = lib[fKmKnowledgebase.categoryindexscript].getCategoryStr(scLibFile);
    return categoryStr || '';
  }

  function kmCategoryString(fKmKnowledgebase, scLibFile ) {
    var categoryStr = getKMRawCategory(fKmKnowledgebase, scLibFile);
    return KMCollection_Update_Utils.categoryStrtoName(categoryStr);
  }

  function kmCategoryArray(fKmKnowledgebase, scLibFile) {
    var categoryStr = getKMRawCategory(fKmKnowledgebase, scLibFile) || '';
    return categoryStr ? categoryStr.split(";") : [];
  }

  function getOnLineLibs() {
    var libs = IDOLGlobalSearchLibrary.getLibraryList();
    return _.pluck(libs, 'name');
  }
  
  function getAllOnLineLibs() {
    var libs = IDOLGlobalSearchLibrary.getAllLibraryList();
    return _.pluck(libs, 'name');
  }

  function getEpochSeconds(date) {
    var seconds = Math.floor(date.getTime()/1000);
    return seconds+'e';
  }

  return {
    getSecurityInfo         : IDOLKMSecurity.getSecurityInfo,
    processIDOL             : IDOLKMFieldMapping.processFieldMapping,
    normalField             : IDOLKMFieldMapping.mappingIDOLField,
    dateField               : IDOLKMFieldMapping.mappingIDOLDateField,

    getEpochSeconds         : getEpochSeconds,
    getCategoryString       : kmCategoryString,
    getKMSearchCategoryArray: kmCategoryArray,
    getOnLineLibs           : getOnLineLibs,
    getAllOnLineLibs        : getAllOnLineLibs
  };
}());

function require() {
  return KMQuery_IDOL;
}
