/**  @fileoverview KMIDOLUtils
 *   @author Yang,Chun-Fu
 */
var _ = lib.Underscore.require(),
    IDOLQueryEvaluator = lib.IDOLQueryEvaluator.require(),
    IDOLGlobalSearchSandbox = lib.IDOLGlobalSearchSandbox.require(),
    IDOLGlobalSearchLibrary = lib.IDOLGlobalSearchLibrary.require();

                     
var advFieldMap=(function(){

    var field_map = {},
        KBField_Weight_Pair = {};
        
    var field_type_cache ={};
        
    var INDEX_WEIGHT = {'-1':'','0':'_INDEX','2':'_WEIGHT2','4':'_WEIGHT4','8':'_WEIGHT8','16':'_WEIGHT16'};
    
    function getFieldMapImpl(kbName, kbFile){
       var fieldMap = {};
       var numfields = kbFile.kbfields.length();

       for( var i = 0; i < numfields; i++){ 
       var fieldName= lib.KMUtils.scToJSName(kbFile.kbfields[i].kbfieldname);
       var match= kbFile.kbfields[i].match;
       fieldMap[fieldName.toUpperCase()]=match;
       }    
        field_map[kbName] = fieldMap;     
    }

    function getFieldMap(kbName){
        if( field_map[kbName] ){ return field_map[kbName]; }
        var kmknowledgebase = new SCFile("kmknowledgebase",SCFILE_READONLY ),
        rc = kmknowledgebase.doSelect('kbname="' + kbName + '"');

        if (rc === RC_SUCCESS){
           getFieldMapImpl(kbName, kmknowledgebase);
           if(!KBField_Weight_Pair[kbName] ){getPairImpl(kbName,kmknowledgebase);}
           if(!field_type_cache[kbName]){getFieldTypeImpl(kbName,kmknowledgebase);}
        }

        return field_map[kbName];
    }
    
    function setFieldMap(kbName, fieldMap){
       field_map[kbName] = fieldMap;
    }

    function setMessagesInSRCResponse(respDoc, messages){
       if(messages && messages.length){
       var messagesNode = respDoc.createNode( 1, 'messages', null );
       var respDateNode = findTargetElement( respDoc, 'responsedata' );
       respDateNode.appendNode(messagesNode);
       
       for(var i = 0; i <messages.length;i++){
         var msg = messages[i];
         var msgNode = respDoc.createNode( 1, 'message', null );
         messagesNode.appendNode(msgNode);
         var textNode = respDoc.createNode( 3, null, msg );
         msgNode.appendNode(textNode);
       }
     }
     
     return respDoc;
    }

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
    
    function isMatchField(kbname, fieldName){
        var type = false;
        var fieldMap = getFieldMap(kbname);
        if( fieldMap ){
            type = fieldMap[lib.KMUtils.scToJSName(fieldName).toUpperCase()];
        }
        return type;
    }

    function getSolutionCandidateFields(fKmKnowledgebase, indexFields,securityFields){
        var slnFields =[];
        var slnQuery = fKmKnowledgebase.solutionquery;
        if(slnQuery){
          var ast = parseQuery(sql);
          slnFields = IDOLQueryEvaluator.collectFieldNames(ast);
          slnFields = _.filter(slnFields, function(field){
            return !_.contains(indexFields, field) && !_.contains(securityFields, field);
          });    
        }
        return slnFields;
    }
    
    function getIndexFieldProps(fKmKnowledgebase, indexFields, indexTypes, indexfAlias, indexWeights,isMatch, dataClean)
    { 
      var numfields = fKmKnowledgebase.kbfields.length();
  
        // get list of fields to index from current record
      for( var i = 0; i < numfields; i++)
      { 
        indexFields[i]= lib.KMUtils.scToJSName(fKmKnowledgebase.kbfields[i].kbfieldname);
        indexTypes[i]= lib.KMUtils.scToJSName(fKmKnowledgebase.kbfields[i].kbfieldtype);
        indexfAlias[i] = lib.KMUtils.scToJSName(fKmKnowledgebase.kbfields[i].kbfieldvalue);
        indexWeights[i]= fKmKnowledgebase.kbfields[i].weight;
        isMatch[i] = fKmKnowledgebase.kbfields[i].match;
        dataClean[i] = fKmKnowledgebase.kbfields[i].datacleansing;
      }  
        return;
    }

    function getRestrictionFields(fKmKnowledgebase) {
      if (IDOLGlobalSearchLibrary.isCatalog(fKmKnowledgebase)) {
        return ['type', 'active', 'access.list', 'access.filter'];
      }
      return [];
    }

    function getIndexFieldSet(fKmKnowledgebase){
        var indexFields  = new Array(fKmKnowledgebase.kbfields.length());
        var indexfType   = new Array(fKmKnowledgebase.kbfields.length());
        var indexfAlias  = new Array(fKmKnowledgebase.kbfields.length());
        var indexWeights = new Array(fKmKnowledgebase.kbfields.length());
        var isMatch      = new Array(fKmKnowledgebase.kbfields.length());
        var dataClean    = new Array(fKmKnowledgebase.kbfields.length()); 

        var securityFields = [];
        if (IDOLGlobalSearchLibrary.isPDKnownError(fKmKnowledgebase)) {
          IDOLGlobalSearchSandbox.evaluate({
            '$isKnownError' : true
          }, function() {
            securityFields = lib.KMUtils.getSecurityFields(fKmKnowledgebase.sclibtablename, fKmKnowledgebase.kbfields);
          });
        } else {
          securityFields = lib.KMUtils.getSecurityFields(fKmKnowledgebase.sclibtablename, fKmKnowledgebase.kbfields);          
        }
        
        getIndexFieldProps(fKmKnowledgebase, indexFields, indexfType, indexfAlias, indexWeights, isMatch,dataClean);

        var restritFields = getRestrictionFields(fKmKnowledgebase);
        
        return {
          indexFields: indexFields,
          indexfType: indexfType,
          indexfAlias: indexfAlias,
          indexWeights: indexWeights,
          isMatch: isMatch,
          securityFields: securityFields,
          restritFields: restritFields,
          dataCleansing: dataClean
        };
    }
    
    function getPairImpl(kbName,kbFile){
       
       var numfields = kbFile.kbfields.length();
       var pair = {};

       for( var i = 0; i < numfields; i++){ 
         var fieldName= lib.KMUtils.scToJSName(kbFile.kbfields[i].kbfieldname);
         var weight= kbFile.kbfields[i].weight;
         pair[fieldName.toUpperCase()]=weight;
       }
          
       KBField_Weight_Pair[kbName] = pair; 
    }
    
    function getKBFieldWeightPair(kbName){
    
       if(KBField_Weight_Pair[kbName]){return KBField_Weight_Pair[kbName];}

       var kbFile = new SCFile("kmknowledgebase",SCFILE_READONLY);
       var result = kbFile.doSelect('kbname="'+kbName+'"');
       if(result ===RC_SUCCESS){
          getPairImpl(kbName, kbFile);
          if( !field_map[kbName]){getFieldMapImpl(kbName,kbFile);}
          if(!field_type_cache[kbName]){getFieldTypeImpl(kbName,kbFile);}
       }
       
       return KBField_Weight_Pair[kbName];    
    }
    
    function getFieldIndexWeight(kbName, fieldName){

       if( ! kbName ){return -1;}
       
       var wPair = getKBFieldWeightPair(kbName);
       fieldName = lib.KMUtils.scToJSName(fieldName).toUpperCase();
       return (wPair && wPair[fieldName]>-1)? wPair[fieldName]:-1;
    }
    
    function setKBFieldWeightPair(kbName, pair){
        KBField_Weight_Pair[kbName] = pair;
    }
    
    function getIndexFieldPostfix(kbname, fieldName){
      var postfix =[];
      var isMatch = isMatchField(kbname, fieldName);
      var weight = getFieldIndexWeight(kbname, fieldName);
      if(isMatch){postfix.push("_MATCH");}
      if(weight >= 0){postfix.push(getFieldPostfix(weight));}
      
      return postfix;
    }

    function getFieldPostfix(weight){
      return INDEX_WEIGHT[''+weight]||'';
    }
    
    function getSRCInvalidQueryResp(msg){
       var resp =  new XML();
       var msgs=[];
       msgs.push(msg);
       resp.setContent("<autnresponse><responsedata></responsedata></autnresponse>");
       setMessagesInSRCResponse(resp, msgs);
       return resp;
    }
    
    function matchFieldPostfix(){
      return '_MATCH';
    }
    
    function getFieldTypeImpl(kbName,kbFile){
       var numfields = kbFile.kbfields.length();
       var pair = {};

       for( var i = 0; i < numfields; i++){ 
          var field_name= lib.KMUtils.scToJSName(kbFile.kbfields[i].kbfieldname);
          var data_type= lib.KMUtils.scToJSName(kbFile.kbfields[i].kbfieldtype);
          pair[field_name.toUpperCase()]=data_type;
       }
          
       field_type_cache[kbName] = pair;
    }
    
    function getTypeMap(kbName){
       if(field_type_cache[kbName]){return field_type_cache[kbName];}

       var kbFile = new SCFile("kmknowledgebase",SCFILE_READONLY);
       var result = kbFile.doSelect('kbname="'+kbName+'"');
       if(result ===RC_SUCCESS){
          getFieldTypeImpl(kbName, kbFile);
          if( !field_map[kbName]){getFieldMapImpl(kbName,kbFile);}
          if(!KBField_Weight_Pair[kbName]){getPairImpl(kbName,kbFile);}
       }
       
       return field_type_cache[kbName]; 
    }
    
    function setTypeMap(kbName, mapValue){
      field_type_cache[kbName] = mapValue;
    }
    
    function getFieldType(fieldName, kbName){
      var type_map;
      
      if(field_type_cache[kbName]){
         type_map = field_type_cache[kbName];
      }else{
        type_map = getTypeMap(kbName);
      }
      
      return type_map[lib.KMUtils.scToJSName(fieldName).toUpperCase()];
    }


    return{
        getKBFieldMap        :getFieldMap,
        setKBFieldMap        :setFieldMap,
        getFieldPostfix      :getFieldPostfix,        
        getIndexFieldPostfix :getIndexFieldPostfix,
        isMatchField         :isMatchField,
        matchFieldPostfix    :matchFieldPostfix,
        getFieldType         :getFieldType,
        setTypeMap           :setTypeMap,
        getTypeMap           :getTypeMap,
        appendNewNode        :appendNewNode,
        getIndexFieldSet     :getIndexFieldSet,
        getFieldIndexWeight  :getFieldIndexWeight,
        setKBFieldWeightPair :setKBFieldWeightPair,
        getKBFieldWeightPair :getKBFieldWeightPair,
        setMessagesInSRCResponse :setMessagesInSRCResponse,
        getSRCInvalidQueryResp   :getSRCInvalidQueryResp
        
    };
}());


function require(){
    return advFieldMap;
}