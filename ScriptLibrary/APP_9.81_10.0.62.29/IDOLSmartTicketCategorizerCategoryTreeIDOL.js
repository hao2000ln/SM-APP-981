/**
 * category representation in IDOL server side
 *
 * this category tree should keep align with `cate2idol2`, every newly create
 * `cate2idol2` record should have corresponding IDOL category node
 */
var _ = lib.Underscore.require(),
    JSON = lib.JSON.json(),
    XQuery = lib.XQuery.require(),
    IDOLSmartTicketCompatible = lib.IDOLSmartTicketCompatible.require();

var logger = getLog('IDOLSmartTicketCategorizerCategoryTreeIDOL');
var CategoryTree = lib.IDOLSmartTicketCategorizerCategoryTree.CategoryTree;
var Node = CategoryTree.Node;
var CompatibleCodec = IDOLSmartTicketCompatible.name;

function IDOLCategoryTree() {
  CategoryTree.apply(this, arguments);
}

function F1() {}
F1.prototype = CategoryTree.prototype;
IDOLCategoryTree.prototype = new F1();
IDOLCategoryTree.prototype.constructor = IDOLCategoryTree;

IDOLCategoryTree.prototype._findParent = function(names) {
  var path = _.initial(names);
  return this.find(path);
};

IDOLCategoryTree.prototype.add = function(names, props) {
  var parent = this._findParent(names), name = _.last(names);
  var nodeProps = _.extend({ name: name }, props);
  return parent.add(nodeProps);
};

IDOLCategoryTree.prototype.remove = function(names) {
  var path = _.initial(names), name = _.last(names);
  var parent = this.find(path);
  if (parent) {
    parent.remove({ name: name }); // remove child by name
  }
};

IDOLCategoryTree.prototype._updateStatus = function(id, status) {
  var fCategory = new SCFile('cate2idol2');
  var rc = fCategory.doSelect(new QueryCond('id', EQ, id));
  if (rc === RC_SUCCESS) {
    fCategory.status = status;
    fCategory.doUpdate();
  }
};

/**
 * parameter shape
 *
 * names: ['incidents', 'access', 'failure'],
 * props: { id: 999, traindocs: ["SD10001", "SD10002"] }
 *
 * `props` is calculated derived from staging category tree
 */
IDOLCategoryTree.prototype.create = function(names, props) {
  var categorizer = this._categorizer;
  var client = categorizer.createClient();
  var traindocs = props.traindocs || [];
  var database = categorizer.getIDOLDatabaseName();
  var parent = this._findParent(names), name = _.last(names);
  client.executeAction({
    action: 'CategoryCreate',
    Name: CompatibleCodec.encode(name),
    Category: props.id,
    Parent: parent.id,
    // document my have same references in two different database
    DatabaseMatch: database, 
    DocRef: traindocs.join(',')
  }, {
    long_time: true,
    synchronize: true
  });
  
  var fieldnames = categorizer.getCategoryFields();
  
  logger.info('names.length:' + names.length);
  logger.info('fieldnames.length:' + fieldnames.length);
  
  //leaf, only leaf node need set category details 
  if(names.length === fieldnames.length){
     logger.info("set category details begin");    
     var KeysAndValue = this._getFieldAndValue(categorizer.getFilename(), _.last(fieldnames), names, null);
     logger.info("Get Keys and Value:[" + JSON.stringify(KeysAndValue) +"]");
     
     if(KeysAndValue != null && !_.isEmpty(KeysAndValue['fields']) && !_.isEmpty(KeysAndValue['values'])){
        var fields = KeysAndValue['fields'].join(',');
        var values = KeysAndValue['values'].join(',');
        logger.info("fields["+fields+"]");
        logger.info("values["+values+"]");
        client.executeAction({
          action: 'CategorySetDetails',
          Category: props.id,
          Fields: fields,
          Values: values
        }, {
          long_time: true,
          synchronize: true
        });
        
        logger.info("after set category details , need rebuild this category to make details effective");
        client.executeAction({
          action: 'CategoryBuild',
          Category: props.id
        }, {
          long_time: true,
          synchronize: true
        });        
     }
  }
  if (traindocs.length > 0) {
    //This will start trigger code of cate2idol2 table
    this._updateStatus(props.id, 2); // mark as training finished
  }
  return { id: props.id, name: name };
};

IDOLCategoryTree.prototype._getTargetTableInfo = function( fileName, field ){
      //retrieve link by file name
    var link = new SCFile('link');
    var rc = link.doSelect('name = "' + fileName + '"');
    //if no link found, return the top numresult
    if (rc !== RC_SUCCESS) {
        return null
    }
    
    //get the source field and targe field in link
    var sourceFields = link['source.fields'];
    var targetField;
    var length = sourceFields.length();
    for (i = 0; i < length; i++) {
        if (sourceFields[i] === field) {
            targetField = link['target.fields'][i];
            targetFile  = link['target.files'][i];
            
            return {'targetField':targetField, 'targetFile':targetFile}
        }
    }
    
    return null;
}


IDOLCategoryTree.prototype._getPrimaryKey =  function (fileName){
   var dbdict = new SCFile('dbdict');
   var rc = dbdict.doSelect('name = "' + fileName +'"');   
   if (rc == RC_SUCCESS) {
        var keys = dbdict['key'];
        var keysLen = keys.length();
        for(var i=0; i<keysLen; i++){
           var key = keys[i];
           if(key['flags'] == '12') {
              return (key['name']);
           }
        }
   }
   return null;
}


/**
 * base on link defined in data table, we can find the target file which contain the category defined.
 * find unique key of category definition table, try get category definition record by input parameter
 * then, get mandant field value of current category, then generate field and values for set category details
**/

IDOLCategoryTree.prototype._getFieldAndValue = function (filename, categoryFieldName, categoryvalues, company){

    var IDOLMandant = lib.IDOLMandant.require();
    var IDOLCommon = lib.IDOLCommon.require();
    
    var linkObj = this._getTargetTableInfo(filename, categoryFieldName);
    if(linkObj == null){
       logger.warn("get link information for table["+filename+"] field["+categoryFieldName+"] meet error, please make sure master link is existing");
       return null;
    } 
    var mandantFieldName = IDOLMandant.getMandantField(linkObj.targetFile );
    
    if(_.isEmpty(mandantFieldName)){
       logger.warn("there is not mandant setting for table ["+ linkObj.targetFile +"]");
       return null;
    }else{
       logger.info("found mandant setting for table ["+ linkObj.targetFile +"], mandant fieldname ["+ mandantFieldName +"]");
    }   
    var pKeyFieldNameList = this._getPrimaryKey(linkObj.targetFile);
    if(pKeyFieldNameList == null){
       logger.warn("get primary key for file ["+inkObj.targetFile+"] meet error");
       return null;
    }  
    var fieldNames = [];
    var filterQuery = [];
    for(var i=0; i<pKeyFieldNameList.length(); i++){
      if(pKeyFieldNameList[i] == 'company'){
        /*
        if(mandantFieldName == 'company'){
          filterQuery.push(new QueryCond(mandantFieldName, EQ, company).asRAD());
        }
        */
        continue;
      }else{
        fieldNames.push(pKeyFieldNameList[i]);
      }
    }
    
    if(categoryvalues.length !=  fieldNames.length){
       logger.warn("Provided filter values["+categoryvalues+"] number["+categoryvalues.length+"] is not equals "+
             "primary key fields["+fieldNames+"] number["+fieldNames.length+"] in table:" + linkObj.targetFile);
       return null;
    }else{
       for(var i=0; i<fieldNames.length; i++){
          var aQuery = new QueryCond(fieldNames[i], EQ, categoryvalues[i]).asRAD(); 
          filterQuery.push(aQuery);
       }
    }
    var sql = IDOLCommon.compositeCriteria(filterQuery,' and ');
	logger.info("query category table ["+linkObj.targetFile+"] via sql ["+sql+"]");
	var categoryFile = new SCFile(linkObj.targetFile, SCFILE_READONLY);
	var rc = categoryFile.doSelect(sql);
	
	var detailFieldNames = [];
	var detailFieldValues = [];	
	var mandantFieldType = lib.tableFunctions.getFieldType(mandantFieldName, filename, true)
	
	if(rc==RC_SUCCESS){
	   var mandantValues =  categoryFile[mandantFieldName];
	   //replace the fieldname which contain dot to underscore
	   var mandantFieldNameStr = mandantFieldName.replace(/\./g, '_');
	   if(_.isEmpty(mandantValues)){
	      return null;
	   }
	   
	   if(mandantFieldType == 8){
	      var len = mandantValues.length();
	      for(var i=0; i<len; i++){
	         if(!_.isEmpty(mandantValues[i])){
	            detailFieldNames.push(mandantFieldNameStr);
	            detailFieldValues.push(mandantValues[i]);
	         } 
	      }
	   }else{
	      detailFieldNames.push(mandantFieldNameStr.toUpperCase());
	      detailFieldValues.push(mandantValues);
	   }
	   
	   return {'fields': detailFieldNames, 'values': detailFieldValues}
	} 	
	return null;
}


IDOLCategoryTree.prototype.destroy = function(names, props) {
  var categorizer = this._categorizer;
  logger.info(categorizer + ', destroying category with name: ' + JSON.stringify(names) + ', props: ' + JSON.stringify(props));
  var client = this._categorizer.createClient();
  var id = props.id;
  if (id) {
    IDOLCategoryTree._destroyCategory(categorizer, client, id);
  } else {
    logger.info(categorizer + ', skip destroy category, id: ' + id);
  }
};

// find taxonomy by name can be potentially not accuracy
//
// e.g.
// 1. train 1st round, root category node id is 3333 (number:cate2idolid)
// 2. delete `cate2idol` records
//    then SM doesn't have category defined, but IDOL still hode
// 3. start 2nd round train
//    new root category record will be insert into `cate2idol2` table with
//    category id 3444
// 
// this method still says 'taxonomy exists', in fact they should not, because
// we start a new round of training
IDOLCategoryTree._getTaxonomy = function(categorizer, client) {
  var doc = client.executeAction({ action: 'CategoryGetTaxonomyRoots' });
  var names = XQuery.query('responsedata/taxonomy/autn:name', doc);
  var ids = XQuery.query('responsedata/taxonomy/autn:category_id', doc);
  
  var taxonomies = [];
  for (var i = 0, length = names.length; i < length; i++) {
    var name = CompatibleCodec.decode(names[i].getText());
    var id = parseInt(ids[i].getText(), 10);
    taxonomies.push({ id: id, name: name });
  }
  return taxonomies;
}

IDOLCategoryTree._appendCategoryNode = function(xml, node) {
  var children = XQuery.query('autn:children/autn:child', xml);
  _.each(children, function(xml) {
    var props = XQuery.queryObject({
      id: 'autn:childid',
      name: 'autn:childname',
      active: 'autn:active',
      numchildren: 'autn:numchildren'
    }, xml);
    props.id = parseInt(props.id, 10);
    props.name = CompatibleCodec.decode(props.name);
    props.active = props.active === 'true';
    props.numchildren = parseInt(props.numchildren, 10);
    var childNode = node.add(props);
    this._appendCategoryNode(xml, childNode);
  }, this);
};

IDOLCategoryTree._destroyCategory = function(categorizer, client, id) {
  logger.info(categorizer + ', deleting IDOL category, id: ' + id);
  return client.executeAction({
    action: 'CategoryDelete',
    Category: id
  });
};

IDOLCategoryTree._getCategoryHierarchyTreeXML = function(categorizer, client) {
  var taxonomy = categorizer.getTaxonomy();
  var doc = client.executeAction({
    action: 'CategoryGetHierDetails',
    TaxonomyName: CompatibleCodec.encode(taxonomy),
    Expand: 'all'
  });
  return XQuery.queryOne('responsedata/autn:category', doc);
};

IDOLCategoryTree._findTaxonomy = function(categorizer, taxonomies) {
  var taxonomy = categorizer.getTaxonomy();
  return _.find(taxonomies, function(t) {
    return t.name === taxonomy;
  });
};

// load category tree defintion from IDOL server side
IDOLCategoryTree.constructCategoryTree = function(categorizer) {
  var client = categorizer.createClient();
  var taxonomies = this._getTaxonomy(categorizer, client);
  var taxonomy = this._findTaxonomy(categorizer, taxonomies);

  if (!taxonomy) {
    logger.info(categorizer + ', unable to find taxonomy for ' + categorizer.toString());
    categorizer.createTaxonomyRoot(client);
  } else if (taxonomy.id !== categorizer.getRootCategory().id) {
    logger.warn('***************************************************************');
    logger.warn('* Taxonomy category id miss matched with root category id     *');
    logger.warn('* This may because IDOL category is used by other sm instance *');
    logger.warn('* Or have removed `cate2idol2` data and start a full re-train *');
    logger.warn('***************************************************************');
    
    logger.info(categorizer + ', Assume delete taxonomy and create a brand new taxonomy, taxonomy id: ' 
      + taxonomy.id + ', root category id: ' + categorizer.getRootCategory().id);
    IDOLCategoryTree._destroyCategory(categorizer, client, taxonomy.id);
    categorizer.createTaxonomyRoot(client);
  }

  // else, start a delta training

  var tree = new this(categorizer);
  var doc = this._getCategoryHierarchyTreeXML(categorizer, client);
  this._appendCategoryNode(doc, tree.getRoot());
  return tree;
};


/* Test Code */

// var _ = lib.Underscore.require();
// var JSON = lib.JSON.json();
// var IDOLSmartTicketCategorizerFactory = lib.IDOLSmartTicketCategorizerFactory.require();
// var IDOLCategoryTree = lib.IDOLSmartTicketCategorizerCategoryTreeIDOL.IDOLCategoryTree;

// var categorizer = IDOLSmartTicketCategorizerFactory.create(6);

// var tree = IDOLCategoryTree.constructCategoryTree(categorizer);
// print(JSON.stringify(tree._inspect(), null, '     '));