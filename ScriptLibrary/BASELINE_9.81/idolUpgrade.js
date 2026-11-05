function idoladapterSyncTitleField(){
  var idoladapter = new SCFile('idoladapter');
  if (!system.functions.filename(idoladapter)) {
    print('Smart Analyticts module is not loaded');
    return;
  }
  
  var rc = idoladapter.doSelect('true');
  while(rc === RC_SUCCESS) {
    var content = idoladapter['content.fields'];
    var title = content[0];
    if (!idoladapter['title.field'] && title) {
      idoladapter['title.field'] = title;
      content.shift();
      print(content);
      idoladapter['content.fields'] = content;
    }
    idoladapter.doSave();
    print('Smart Ticket Task "' + idoladapter['category.group.name'] + '" upgrades successfully');
    rc = idoladapter.getNext();
  }
}



function setDisplayId(){
  var i = 0;
  var batchSize = 1;
  var counter = new SCFile('counters');
  var rc = counter.doSelect('table.name = "svcDisplay"');
  if (rc === RC_SUCCESS) {
    i = counter['current.value'];
    if (counter['batch.size'] != null) {
      batchSize = counter['batch.size'];
    }
  }

  var svcDisplay = new SCFile('svcDisplay');
  
  var totalCount = svcDisplay.doCount('syslanguage like "*" and displayId = NULL');
  if (totalCount > 0) {
    print(system.functions.scmsg("266","upg",["svcDisplay"]));
  } else {
    print(system.functions.scmsg("1120","upg"));
    return;
  }
  
  rc = svcDisplay.doSelect('syslanguage like "*" and displayId = NULL');
  var count = 0;
  
  // disable trigger
  var triggerStatus = system.functions.sysinfo_get("trigger");
  var ret;
  system.functions.rtecall("trigger", ret, 0);
  
  while (rc === RC_SUCCESS) {
    i = i + batchSize;
    count++;
    if (count % 50 == 0) {
      print(system.functions.scmsg("274","upg",[count, totalCount]));
    }
    svcDisplay.displayId = i;
    svcDisplay.doUpdate();
    rc = svcDisplay.getNext();
  }
  
  // enable trigger
  system.functions.rtecall("trigger", ret, triggerStatus);
  
  counter['current.value'] = i;
  counter.doUpdate();
  print(system.functions.scmsg("34","upg",['svcDisplay']));
  print(system.functions.scmsg("279","upg",[count]));
  //update counter table
}


function setSeqIdForDept() {
  var i = 0;
  var batchSize = 1;
  var counter = new SCFile('counters');
  var rc = counter.doSelect('table.name = "dept"');
  if (rc === RC_SUCCESS) {
    i = counter['current.value'];
    if (counter['batch.size'] != null) {
      batchSize = counter['batch.size'];
    }
  }

  var dept = new SCFile('dept');
  
  var totalCount = dept.doCount('true');
  if (totalCount > 0) {
    print(system.functions.scmsg("266","upg",["dept"]));
  } else {
    print(system.functions.scmsg("1120","upg"));
    return;
  }
  
  rc = dept.doSelect('true');
  var count = 0;
  
  // disable trigger
  var triggerStatus = system.functions.sysinfo_get("trigger");
  var ret;
  system.functions.rtecall("trigger", ret, 0);
    
  while (rc === RC_SUCCESS) {
    i = i + batchSize;
    count++;
    if (count % 50 == 0) {
      print(system.functions.scmsg("274","upg",[count, totalCount]));
    }
    dept.seq_id = i;
    dept.doUpdate();
    rc = dept.getNext();
  }
  
  // enable trigger
  system.functions.rtecall("trigger", ret, triggerStatus);
  
  counter['current.value'] = i;
  counter.doUpdate();
  print(system.functions.scmsg("34","upg",['dept']));
  print(system.functions.scmsg("279","upg",[count]));
}

var joinNames = ['joinsvcDisplay', 'joinSvcCatOperator'];
var joinTables = [['svcDisplay', 'svcCatalog'], ['operator', 'svcCatOperatorInfo']];

function renewJoindefs() {
  var triggerStatus = system.functions.sysinfo_get("trigger");
  var ret;
  system.functions.rtecall("trigger", ret, 1);
  
  var joindef = new SCFile('joindefs');
  var i;
  for (i = 0; i  < joinNames.length; i++) {
    var tableName = joinNames[i];
    var rc = joindef.doSelect('join.name = "' + tableName + '"');
    if (rc === RC_SUCCESS) {
      joindef.doDelete();
    }

    var joindef2 = new SCFile('joindefs');
    var tableArrays = joinTables[i];
  
    var jointables = [];
    var j;
    for (j = 0; j < tableArrays.length; j++) {
      var subtable = new SCDatum();
      subtable.setType(9);
      subtable.push(tableArrays[j]);
      jointables.push(subtable);
    }

    joindef2['join.tables'] = jointables;
    joindef2['join.name'] = tableName;
    joindef2.doInsert();
    print(system.functions.scmsg("1178","upg", [tableName]));
  }
  
  system.functions.rtecall("trigger", ret, triggerStatus);
}


function migrateIdolConfig() {
  var idolConfig = new SCFile('idolserverinfo');
  var rc = idolConfig.doSelect('true');
  if (rc === RC_SUCCESS) {
    var idolenable = idolConfig.enable;
    if (!idolenable) {
      idolConfig['server.url'] = 'http://12.3.4.56:9000/';
      idolConfig['default.cfs.url'] = 'http://12.3.4.56:7000/';
      idolConfig['image.url'] = 'http://12.3.4.56:18000/';
      idolConfig.doUpdate();
      return;
    }
  }
  idolConfig['image.enable'] = true;
  lib.IDOL_EnableKM.enableIDOL(idolConfig);
  idolConfig.doUpdate();
}



var HotTopicsUpgrade = (function() {

  function upgradeDataCleansing() {
    var cleansing = new SCFile('idolDataFilter');
    var rc = cleansing.doSelect(true);
    while(rc === RC_SUCCESS) {
      if (!cleansing['pattern.end.type']) {
        print('upgrade idolDataFilter record: ' + cleansing.ID);
        cleansing['pattern.end.type'] = 'text_string';
        cleansing.doSave();
      }
      rc = cleansing.getNext();
    }
  }

  function upgradeHotTopicSettings() {
    var idolpbmhunter = new SCFile('idolpbmhunter');
    var rc = idolpbmhunter.doSelect(new QueryCond('table.name', EQ, 'probsummary'));
    if (rc === RC_SUCCESS) {
      if (!idolpbmhunter['group.by']) {
        print('upgrade idolpbmhunter configuration, add group.by value: affected.item');
        idolpbmhunter['group.by'] = 'affected.item';
        var actions = new SCDatum(),
            queries = new SCDatum();

        actions.setType(8);
        queries.setType(8);

        actions.push('setparent');
        actions.push('createproblem');
        actions.push('default');

        queries.push('null(master.incident) and null(parent.incident)');
        queries.push('jscall(\"IDOLModuleConfiguration.getAction4CreateProblem\", $hta.action.facet, $hta.action.facet.key)');
        queries.push('jscall(\"IDOLModuleConfiguration.getAction4CreateChangeArticle\", $hta.action.facet, $hta.action.facet.key)');

        idolpbmhunter['candidates.action'] = actions;
        idolpbmhunter['candidates.query'] = queries;
      }
      idolpbmhunter.doSave();
    }
  }

  function upgrade() {
    upgradeDataCleansing();
    upgradeHotTopicSettings();
  }

  return {
    upgrade : upgrade
  };
}());


function hottopicsUpgrade() {
  return HotTopicsUpgrade.upgrade();
}


function removeSAATemplate() {
	var idolToolsTemplate = new SCFile('idolToolsTemplate');
	idolToolsTemplate.doPurge('name isin {"Backup Category","Restore Category"}');
	print(funcs.scmsg('117', 'idol', ['idolToolsTemplate']));
}




function upgrade() {
  setSeqIdForDept();
  setDisplayId();
  renewJoindefs();
  migrateIdolConfig();
  hottopicsUpgrade();
  removeSAATemplate();
  if (vars["$lo.idol.enabled"] == true && (vars["$G.kmsearchengine"] == "idol" || vars["$G.kmsearchengine"] == "IDOL")) {
      lib.IDOL_EnableKM.removeMenu();
  }
}

function customUpgrade() {
  lib.IDOL_EnableKM.removeStopSchedule();
  removeSAATemplate();
}

