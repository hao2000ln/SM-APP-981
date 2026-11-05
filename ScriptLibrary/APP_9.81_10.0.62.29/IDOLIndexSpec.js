var IDOLFieldProcessor = lib.IDOLFieldProcessor.require();

var logger = getLog("IDOLIndexSpec");

var IDOLIndexSpec = (function() {

  function createIndexSpec(indexDef) {
    //print('IDOLIndexSpec#create is deprecated, call IDOLFieldProcessor#create directly');
    return IDOLFieldProcessor.create(indexDef);
  }
  /** 
   * @deprecated
   */
  return {
    create : createIndexSpec
  };
}());

function require() {
  return IDOLIndexSpec;
}