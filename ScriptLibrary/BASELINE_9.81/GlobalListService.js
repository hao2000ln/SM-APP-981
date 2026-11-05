

  
  function queryGlobalList(globalListName){
    var glFile = new SCFile("globallists");
    if(RC_SUCCESS == glFile.doSelect('name="' + globalListName + '"')) {
      var valueStr = vars[glFile.list_variable];
      var displayStr = vars[glFile.display_variable];
      displayStr = displayStr?displayStr.toArray():valueStr.toArray();
      return {
        name:globalListName,
        values:valueStr.toArray(),
        displays:displayStr
      };
    }
  }
  
  function queryManualList(area, settingId){
    var sql = 'setting="' + area + '" and id="' + settingId + '"';
    var settings = new SCFile("settingsConfig");
    if(RC_SUCCESS == settings.doSelect(sql)) {
      return {
        name: settingId,
        values: settings['valueList'].toArray(),
        displays: settings['displayList'].toArray()
      };
    }
  }
