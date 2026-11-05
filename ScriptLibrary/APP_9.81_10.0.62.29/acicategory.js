var _ = lib.Underscore.require(),
    CONSTANT = lib.IDOL_Constant,
    IDOLCommon = lib.IDOLCommon.require(),
    IDOLSmartTicketCategorizerFactory = lib.IDOLSmartTicketCategorizerFactory.require(),
    IDOLSmartTicketCategorizerTestReport = lib.IDOLSmartTicketCategorizerTestReport.require(), IDOLMandant = lib.IDOLMandant.require();

var logger = getLog('acicategory');

function getCategoryGroupTestReport(id, company, round) {
  var categorizer = IDOLSmartTicketCategorizerFactory.create(id, company);
  
  if (!categorizer) {
    // no report (training not started)
    return funcs.scmsg("TestReport_1","acicategory");
  }

  var root = categorizer.getRootCategory();
  if (!root || !root.testflag) {
    return funcs.scmsg("TestReport_2","acicategory");
  }

  round = round || categorizer.getLatestTestRound();
  if (!round) {
    return funcs.scmsg("TestReport_2","acicategory");
  }

  var reporter = IDOLSmartTicketCategorizerTestReport.create(categorizer, round);
  return reporter.generateTextReport();
}

function getCategoryGroupTestRunningStatus(id, company) {
  var categorizer = IDOLSmartTicketCategorizerFactory.create(id, company);
  var manager = categorizer.getStatusManager();
  return manager.getTestingStatus();
}


function refreshMultiCompanyTestingResults(fCategorizer) {
  var id = fCategorizer['adapter.id'];
  var fCompanyCategorizer = new SCFile('idolsecgroup');
  var rc = fCompanyCategorizer.doSelect(new QueryCond('adapter.id', EQ, id));
  var results = [];
  while (rc === RC_SUCCESS) {
    var company = fCompanyCategorizer['security.id'];
    var categorizer = IDOLSmartTicketCategorizerFactory.create(fCategorizer, company);
    var statusManager = categorizer.getStatusManager();
    var round = categorizer.getLatestTestRound();
    if (round) {
      var reporter = IDOLSmartTicketCategorizerTestReport.create(categorizer, round);
      var statistics = reporter.generateTestStatistics();

      var accTotal = statistics.accTotal;
      var accHit1 = statistics.accHit1;
      var accHit2 = statistics.accHit2;
      var accHit3 = statistics.accHit3;
      var accMiss = statistics.accMiss;
      var accFail = statistics.accFail;

      var hit1Rate = 100 * accHit1 / accTotal,
	          hit2Rate = 100 * (accHit1 + accHit2) / accTotal,
	          hit3Rate = 100 * (accHit1 + accHit2 + accHit3) / accTotal,
	          missRate = 100 * accMiss / accTotal,
	          failRate = 100 * accFail / accTotal;
	          
	  if(isNaN(hit1Rate)) {
	      hit1Rate = 0;
	  }        
	  if(isNaN(hit3Rate)) {
	      hit3Rate = 0;
	  }
	            
      results.push({
	        company: company,
	        firstHit: hit1Rate.toFixed(2) + '%',
	        totalHit: hit3Rate.toFixed(2) + '%',
	        trainingStatus: statusManager.findTrainingStatus(fCompanyCategorizer['training.status']),
	        testingStatus: statusManager.findTestingStatus(fCompanyCategorizer['testing.status'])	        
	   })
	   fCompanyCategorizer.first_accuracy=hit1Rate.toFixed(2) + '%';
	   fCompanyCategorizer.total_three_accuracy=hit3Rate.toFixed(2) + '%';
	} else {
	   results.push({company: company, firstHit: '', totalHit: '', 
	        trainingStatus:statusManager.findTrainingStatus(fCompanyCategorizer['training.status']),
	        testingStatus:statusManager.findTestingStatus(fCompanyCategorizer['testing.status'])   });
	}
  
    fCompanyCategorizer.training_status_desc=statusManager.findTrainingStatus(fCompanyCategorizer['training.status']);
    fCompanyCategorizer.testing_status_desc=statusManager.findTestingStatus(fCompanyCategorizer['testing.status']) ;
    fCompanyCategorizer.doUpdate();
    rc = fCompanyCategorizer.getNext();
  }
  return results;
}

function getMandantSettingOfCurrentAdaper( fAdapter )
{
    if(!fAdapter) {
        return {'haveMandant': false, 'mandantFieldName': '', 'isArrayMandantField': false};
    }
    var haveMandant = false, fieldName='', isarray=false, filename = fAdapter['table.name'];
        
    var fieldName = IDOLMandant.getMandantField(filename);
    var mandantFieldType = lib.tableFunctions.getFieldType(fieldName, filename, true);
    
    if(mandantFieldType == -1){
      logger.error('No mandant setting found, current smart ticket run in single company mode');
      return {'haveMandant': false, 'mandantFieldName': '', 'isArrayMandantField': false};
    }else{
      haveMandant = true;
      if(mandantFieldType!=8){
        isarray = false;
      }else{
        isarray = true;
      }
    }
    
    return {'haveMandant': haveMandant, 'mandantFieldName': fieldName, 'isArrayMandantField': isarray};
}

function haveMandant( fAdapter ){
   var mandantSetting =  getMandantSettingOfCurrentAdaper(fAdapter);
   return mandantSetting.haveMandant;
}

function setupCategorizerView(fCategorizer) {
  if(!fCategorizer){
     return ;
  }
  var id = fCategorizer['adapter.id'];
  if (!id) { return; }

  var categorizer = IDOLSmartTicketCategorizerFactory.create(fCategorizer);
    
  var statusManager = categorizer.getStatusManager();

  vars['$training.status'] = statusManager.getTrainingStatus();
  vars['$tuning.status'] = statusManager.getTuningStatus();
  
  
  var round = categorizer.getLatestTestRound();
  if (!round) {
    vars['$testing.status'] = funcs.scmsg("TestingStatus_1","acicategory");
  }else{
    vars['$testing.status'] = statusManager.getTestingStatus().toString();
  }

  var report;
  
  var JSON = lib.JSON.json();
  var mandantSetting = getMandantSettingOfCurrentAdaper(fCategorizer);
  
  var haveMandant = mandantSetting.haveMandant;
  
  if (vars['$G.multi']) {
    report = funcs.scmsg('testing.multi.company.result', 'SmartTicket');
  } else if(haveMandant){
    report = funcs.scmsg('testing.mand.result', 'SmartTicket');
  } else {
    report = getCategoryGroupTestReport(id);;
  }
  
  vars['$result.report'] = report;
  
  vars['$ismandant'] = haveMandant;
 
  //if (vars['$G.multi']) {
  if(haveMandant){
    var results = refreshMultiCompanyTestingResults(fCategorizer);
    var companies=[], firstHits = [], totalHits = [],trainingStatus=[],testingStaus =[];
    
    _.each(results, function(result) {
      companies.push(result.company);
      firstHits.push(result.firstHit);
      totalHits.push(result.totalHit);
      trainingStatus.push(result.trainingStatus);
      testingStaus.push(result.testingStatus);
    });
    
    vars['$multi.company.companyname'] = companies;
    vars['$multi.company.first.hits'] = firstHits;
    vars['$multi.company.total.hits'] = totalHits;
    vars['$multi.training.status.desc']=trainingStatus;
    vars['$multi.testing.status.desc']=testingStaus;
  }
}


function getCategorizerStatus(fCategorizer) {
  var categorizer = IDOLSmartTicketCategorizerFactory.create(fCategorizer);
  var statusManager = categorizer.getStatusManager();

  var name = fCategorizer['category.group.name'],
      module = funcs.scmsg(fCategorizer['table.name'], 'tablename');
  var trainingStatus = statusManager.getTrainingStatus();
  
  var round = categorizer.getLatestTestRound();
  if (!round) {
    var testStatus  = funcs.scmsg("TestingStatus_1","acicategory");
  }else{
    var testStatus  = statusManager.getTestingStatus().toString();
  }
  
  var tuningStatus = statusManager.getTuningStatus();
  var isActive = fCategorizer['is.active'];

  return {
    name: fCategorizer['category.group.name'],
    moduleName: funcs.scmsg(fCategorizer['table.name'], 'tablename'),
    isActive: fCategorizer['is.active'],
    trainingStatus: trainingStatus,
    testStatus: testStatus,
    tuningStatus: tuningStatus
  };
}


// select/deselect company, and those companies will be used in following training/testing process.
// these function is invoked by "wizard - 'idol select company'" & "wizard - 'idol remove company'"
function selectCompany(fCategorizer, company) {
  var categorizerId = fCategorizer['adapter.id'];
  var companySelection = new SCFile('idolsecgroup');
  var rc = companySelection.doSelect(
    new QueryCond('adapter.id', EQ, categorizerId).and(
      new QueryCond('security.id', EQ, company)));
  if (rc === RC_SUCCESS) {
    return;
  }

  var rteNumber = new SCDatum();
  funcs.rtecall( "getnumber", new SCDatum(), rteNumber, "idolsecgroupid", null );
  companySelection.id = rteNumber.getText();

  // XXX: at very beginning, category will be trained by "security group"
  // after that, "security group" has been replaced by "company"
  // but the field name is still kept
  companySelection.security_id = company;
  companySelection.adapter_id = categorizerId;
  
  companySelection.testing_status = 0;
  companySelection.testing_status_desc = '';
  companySelection.training_status = 0;
  companySelection.training_status_desc = '';
  companySelection.doSave();
}

function deselectCompany(fCategorizer, company) {
  var categorizerId = fCategorizer['adapter.id'];
  var companySelection = new SCFile('idolsecgroup');
  var rc = companySelection.doSelect(
    new QueryCond('adapter.id', EQ, categorizerId).and(
      new QueryCond('security.id', EQ, company)));
  if (rc === RC_SUCCESS) {
    companySelection.doRemove();
  }
  
  var sql = 'categorizer.id="'+ categorizerId +'" and company="'+ company +'"';
  
  //clean test results
  var test_result_file = new SCFile("SmartTicketTestResults");
  test_result_file.doPurge(sql);
  
  //clean test rounds 
  var test_result_file = new SCFile("SmartTicketTestRounds");
  test_result_file.doPurge(sql);
  
  //clean distribution cache data 
  var test_result_file = new SCFile("SmartTicketDistributionCache");
  test_result_file.doPurge(sql);
}

// before version sm9.6, the response format is array of array
// convert to this shape to make it compatible
//
// .e.g
// [
//   ["category1", "subcategory1", "product.type1"],
//   ["category2", "subcategory2", "product.type2"],
//   ["category3", "subcategory3", "product.type3"],
// ]
function convertToCompatibleFormat(categorizer, candidates) {
  var ids = _.pluck(candidates, 'id');
  var categories = categorizer.idsToCategory(ids);
  return categories.map(function(category) {
    return category.getNames();
  });
}


function convertToCompatibleFormatNew(candidates) {
  var JSON = lib.JSON.json()
   
  var ret = [];
  for(var i=0; i<candidates.length; i++){
     var aCandidate = candidates[i];
     var id = aCandidate['id'];
     var categorizer = aCandidate['categorizer'];
     var categories  = categorizer.idsToCategory(id);
     ret.push(categories.getNames());
  }
  return ret;  
}

function getCategoryByContent(fTicket, categorizerId, numResults, company) {
  var JSON = lib.JSON.json();
  
  if(company && _.isArray(company) && company.length>0){
  //if(company && _.isArray(company)){
    var ret = [];
    for(var i=0; i<company.length; i++){
      var aCompany = company[i];
      var aRet = getCategoryByContentForOneMandantValue( fTicket, categorizerId, numResults, aCompany );
      //ret = _.union(ret, aRet);
      ret = ret.concat(aRet); 
    } 
    
    var t = _.chain(ret).
           sortBy(function(aObject){ return -aObject.weight}).
           first(numResults).
           value();
           
    logger.info("company length[" + company.length +  "], merge result: [" + JSON.stringify(t) + "]");
    return convertToCompatibleFormatNew(t); 
  }else{
    logger.info("company is null value / company is not a array / company length equals 0");
    var filename = system.functions.filename(fTicket); 
    var fieldName = IDOLMandant.getMandantField(filename);
    if(fieldName != ""){
       logger.info("mandant field for scfile["+filename+"] is ["+ fieldName +"], but in multi company or mandant enabled status, please specific at least one mandant value!")
       return [];
    }
	var ret = getCategoryByContentForOneMandantValue( fTicket, categorizerId, numResults, null );
	return convertToCompatibleFormatNew(ret);
  }
}

function getCategoryByContentForOneMandantValue(fTicket, categorizerId, numResults, company) {
    var categorizer = IDOLSmartTicketCategorizerFactory.create(categorizerId, company);
    if (!categorizer.isActive()) {
      return [];
    }
    var client = categorizer.createClient(); // which IDOL server should connect to
    var agent = categorizer.createSuggestionAgent(client); // hide suggestion logic, like prefilled values
    var candidates = agent.suggestIDOLCategory(fTicket, {
      NumResults: numResults || 3
    }) || [];
    
    var aExtend = _.map(candidates, function(candidate){ return _.extend( candidate, {'categorizer': categorizer}) } );
    //return convertToCompatibleFormat(categorizer, candidates);
    return aExtend
}

// For `IDOLWebService`
/**
  since to support multi-mandant for Smart ticket, and also need support the mandant field value perhaps is array type
  then adjust below code for web service use.
  when invoke this web service, company can passed in a String which include comma.
**/
function getCategoryByText(categorizerId, numResults, text, level1Value, level2Value, company) {
  if(company) {
    var localCompany = _.compact(company.split(","));
    var ret = [];
    for(var i=0; i<localCompany.length; i++){
      var aCompany = localCompany[i];
      var aRet = getCategoryByTextForOneMandantValue( categorizerId, numResults, text, level1Value, level2Value, aCompany );
      //ret = _.union(ret, aRet);
      ret = ret.concat(aRet); 
    }
    
    var t = _.chain(ret).
           sortBy(function(aObject){ return -aObject.weight}).
           first(numResults).
           value();
           
     logger.info("getCategoryByText and response is:[" + JSON.stringify(t) + "]");
    return convertToCompatibleFormatNew(t);
  } else {
    var ret = getCategoryByTextForOneMandantValue( categorizerId, numResults, text, level1Value, level2Value, company );
    return convertToCompatibleFormatNew(ret);
  }
  

  /** origin code 
  var JSON = lib.JSON.json();
  
  var categorizer = IDOLSmartTicketCategorizerFactory.create(categorizerId, company);
  if (!categorizer.isActive()) {
    print("Categorizer  " + categorizer +" is inactive"); 
    return [];
  }
  var client = categorizer.createClient(); 
  
  print("-->" + JSON.stringify(client));
  var agent = categorizer.createSuggestionAgent(client);
  var prefills = _.compact([level1Value, level2Value]);
  var schema = agent.findCategorySchema(prefills);
  
  print("-schema->" + schema.id);
  
  var candidates = agent.suggestIDOLCategory(text, {
    NumResults: numResults || 3,
    Schema: '1235'
  }) || [];
  
  return convertToCompatibleFormat(categorizer, candidates);
  */
}

function getCategoryByTextForOneMandantValue(categorizerId, numResults, text, level1Value, level2Value, company) {
  var categorizer = IDOLSmartTicketCategorizerFactory.create(categorizerId, company);

  if (!categorizer.isActive()) {
    print("Categorizer  " + categorizer +" is inactive"); 
    return [];
  }
  var client = categorizer.createClient();
  var agent = categorizer.createSuggestionAgent(client);
  var prefills = _.compact([level1Value, level2Value]);
  var schema = agent.findCategorySchema(prefills);
  var candidates = agent.suggestIDOLCategory(text, {
    NumResults: numResults || 3,
    Schema: schema.id //fix bug should reference schema's id not the instance object of schema
  }) || [];
  
  var aExtend = _.map(candidates, function(candidate){ return _.extend( candidate, {'categorizer': categorizer}) } );
  return aExtend;
  //return convertToCompatibleFormat(categorizer, candidates);
}


function deleteCategorizer(fCategorizer) {
  var categorizer = IDOLSmartTicketCategorizerFactory.create(fCategorizer);
  categorizer.destroyCategories();
}

function getCategoryIDOLDatabase(filename,group,subgroup) {
  var db="";
  var realgroup = group.substring(0,32);
  if(subgroup != null && subgroup!="")
  {
    db=filename + "_" + realgroup+"_"+subgroup;
  }
  else
  {
   db=filename+ "_" + realgroup;
  }
  db=db.replace(/ /g,"_");
  db=db.replace(/&/g,"_");
  db=db.replace(/\t/g,"_");
  db = encodeURIComponent(db);
  if(db.length > 64)
  {
    db = db.substring(0,64);
  }
  return db;
}

function stopTrainingTask()
{
  var f = new SCFile(CONSTANT.getCategoryFileName());
  var rc = f.doSelect("id=0");
  if(rc == RC_SUCCESS)
  {
    f.status=1;
    f.doUpdate();
  }

  // else
  // {
  //   f.id=0;
  //   f.parentid=-1;
  //   f.status=1;
  //   f.testflag=0;
  //   f.doInsert();
  // }
}

function startTrainingTask(groupid,subgroupname) {
  print('start training task: ' + groupid + ',' + subgroupname);
  var f = new SCFile(CONSTANT.getCategoryFileName());
  var rc = f.doSelect("id=0");
  var mystr = groupid+",";
  if(subgroupname != undefined && subgroupname!=null && subgroupname!= "")
  {
    mystr = groupid+"["+subgroupname+"],";
  }
  if(rc == RC_SUCCESS)
  {
    var ar = [];
    if(f.traindocs != null)
    {
      ar = f.traindocs.toArray();
    }
    var str ="";
    
   
    
    if(ar.length>0)
    {
      str = ar[0].toString();
    }
    if( str.indexOf(mystr) != -1)
    {
    }
    else
    {
      str += mystr;
    }
 
     f.traindocs[0] = str;
     f.status=0;
     f.testflag=0;
     f.doUpdate();
  }
  else
  {
    f.id=0;
    f.parentid=-1;
    f.traindocs[0]=mystr;
    f.status=0;
    f.testflag=0;
    f.doInsert();
  }
}


function checkTaskIsStoped(bupdate)
{
  var f = new SCFile(CONSTANT.getCategoryFileName());
  var rc = f.doSelect("id=0 and status=1");
  if(rc == RC_SUCCESS)
  {
    if(bupdate != undefined && bupdate ==  true)
    {
      f.status=0;
      f.doUpdate();
      return true;
    }
    else
    {
      throw "User ask to stop task";
    }
  }
  return false;
}
function stopTestTask()
{
  var f = new SCFile(CONSTANT.getCategoryFileName());
  var rc = f.doSelect("id=0");
  if(rc == RC_SUCCESS)
  {
    f.testflag=1;
    f.doUpdate();
  }
  else
  {
    f.id=0;
    f.parentid=-1;
    f.testflag=1;
    f.status=0;
    f.doInsert();
  }
}
function checkTestIsStoped()
{
  var f = new SCFile(CONSTANT.getCategoryFileName());
  var rc = f.doSelect("id=0 and testflag=1");
  if(rc == RC_SUCCESS)
  {
    f.testflag=0;
    f.doUpdate();
    return true;
  }
  return false;
}


function getMandantField(filename)
{
  var fm = new SCFile("scmandant");
  var rc = fm.doSelect("filename=\""+filename+"\"");
  if(rc == RC_SUCCESS)
  {
    return fm.fieldname;
  }
  return "";
}