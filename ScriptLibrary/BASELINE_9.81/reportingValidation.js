_index    = funcs.index;
_lng      = funcs.lng;
_str      = funcs.str;
_insert   = funcs.insert;
_denull   = funcs.denull;
_operator = funcs.operator;
_rtecall  = funcs.rtecall;
_scmsg    = funcs.scmsg;
_nullsub  = funcs.nullsub;
_type     = funcs.type;
var _ = lib.Underscore.require();
var JSON = lib.JSON.json();

function validationReportCategory(reportName, aryTableNames)
{
  if (aryTableNames==null) {
    return true;
  }

  var sql = "name<>\"" + reportName + "\" and table.names isin " + _str(aryTableNames) + " ";
  var record = new SCFile("reportCategory", SCFILE_READONLY);
  record.setFields(["name"]);

  if (record.doSelect(sql) == RC_SUCCESS)
  {
    return false;
  }

  return true;
}

function checkPivotCalculator(objFields, objCalculators, cursorField, aryFieldsWithCal, aryFieldsNoCal)
{
  var lng = 0;
  var i = 0;
  var position = 0;

  lng = objFields.getSize();
  if (objCalculators.getSize()>lng) {
    lng = objCalculators.getSize();
  }
  for (i=0;i<lng;i++)
  {
    theField = objFields[i];
    theCalculator = objCalculators[i];

    if (theCalculator!=null && theField==null)
    {
      funcs.msg(_scmsg(92,"Reporting"),3);
      vars["$cursor.field"] = cursorField;
      return false;
    }

    if (theCalculator!=null)
    {
      position = funcs.index(theField, aryFieldsNoCal);
      if (position!=null && position>0)
      {
        funcs.msg(_scmsg(98,"Reporting"),3);
        vars["$cursor.field"] = cursorField;
        return false;
      }

      position = funcs.index(theField, vars['$report.fields.all.key']);
      if (position!=null && position>0 && vars['$report.fields.all.type'][position-1]!=3)
      {
        funcs.msg(_scmsg(94,"Reporting"),3);
        vars["$cursor.field"] = cursorField;
        return false;
      }
    }

    if (theCalculator==null)
    {
      position = funcs.index(theField, aryFieldsWithCal);
      if (position!=null && position>0)
      {
        funcs.msg(_scmsg(98,"Reporting"),3);
        vars["$cursor.field"] = cursorField;
        return false;
      }
      position = funcs.index(theField, vars['$report.fields.all.key']);
      if (position!=null && position>0 && vars['$report.fields.all.type'][position-1]==3)
      {
        funcs.msg(_scmsg(98,"Reporting"),3);
        vars["$cursor.field"] = cursorField;
        return false;
      }
    }

    if (theCalculator==null) {
      aryFieldsNoCal.push(theField);
    }
    if (theCalculator!=null) {
      aryFieldsWithCal.push(theField);
    }
  }

  return true;
}

function validationSaveDashboard( fInbox )
{
  if ( fInbox['dashboard.refresh.enable'] )
  {
    var msgCheck = lib.reportDashboard.checkMaxAutoRefreshDashboard(fInbox);

    if ( msgCheck )
    {
      funcs.msg(msgCheck, 3);
      vars["$cursor.field"] = "dashboard.refresh.enable";
      return false;
    }
  }

  return true;
}

function validationSaveReport()
{
  var objFile = vars["$L.file"];
  var position = 0;

  if ( objFile['inbox.class'] == "dashboard" )
  {
    return validationSaveDashboard(objFile);
  }

  //check assignment groups
  if (objFile.audience_type!=null && objFile.audience_type=="assignmentgroups")
  {
    objFile.assignment_groups = _denull(objFile.assignment_groups);
    if (objFile.assignment_groups[0]==null)
    {
      funcs.msg(_scmsg(100,"Reporting"),3);
      vars["$cursor.field"] = "assignment.groups";
      return false;
    }
  }

  //check user roles
  if (objFile.audience_type!=null && objFile.audience_type=="role")
  {
    objFile.role = _denull(objFile.role);
    if (objFile.role[0]==null)
    {
      funcs.msg(_scmsg(102,"Reporting"),3);
      vars["$cursor.field"] = "role";
      return false;
    }
  }

  if (objFile.inbox_class=="chart" || objFile.inbox_class=="classList" || objFile.inbox_class=="pivot")
  {
    if (objFile.inbox_type == null)
    {
      funcs.msg(_scmsg(95,"Reporting"),3);
      vars["$cursor.field"] = "inbox.type";
      return false;
    }
    if (objFile.short_query == null)
    {
      funcs.msg(_scmsg(96,"Reporting"),3);
      vars["$cursor.field"] = "short.query";
      return false;
    }
  }

  if (objFile.inbox_class=="pivot")
  {
    var aryFieldsWithCal = [];
    var aryFieldsNoCal = [];
    var aryCalculator = [];

    if (objFile.pivot_rowField==null) {
        objFile.pivot_rowField=[];
    }
    if (objFile.pivot_rowCalculator==null) {
        objFile.pivot_rowCalculator=[];
    }
    if (objFile.pivot_colField==null) {
        objFile.pivot_colField=[];
    }
    if (objFile.pivot_colCalculator==null) {
        objFile.pivot_colCalculator=[];
    }
    if (objFile.pivot_candField==null) {
        objFile.pivot_candField=[];
    }
    if (objFile.pivot_candCalculator==null) {
        objFile.pivot_candCalculator=[];
    }

    if (!checkPivotCalculator(objFile.pivot_rowField, objFile.pivot_rowCalculator, "pivot.rowField", aryFieldsWithCal, aryFieldsNoCal)) {
        return false;
    }
    if (!checkPivotCalculator(objFile.pivot_colField, objFile.pivot_colCalculator, "pivot.colField", aryFieldsWithCal, aryFieldsNoCal)) {
        return false;
    }
    if (!checkPivotCalculator(objFile.pivot_candField, objFile.pivot_candCalculator, "pivot.candField", aryFieldsWithCal, aryFieldsNoCal)) {
        return false;
    }

    if (objFile.aggregation_type!=null && objFile.aggregation_type!="Count")
    {
      if (objFile.aggregation_field == null)
      {
        funcs.msg(_scmsg(99,"Reporting"),3);
        vars["$cursor.field"] = "aggregation.field";
        return false;
      }
    }

    if ((_denull(objFile.pivot_rowField).getSize()==0) && _denull(objFile.pivot_colField).getSize()==0 && _denull(objFile.pivot_candField).getSize()==0)
    {
      funcs.msg(_scmsg(105,"Reporting"),3);
      vars["$cursor.field"] = "pivot.rowField";
      return false;
    }

    return true;
  }

  if (objFile.inbox_class=="htamap")
  {
    if (vars["$htamap.misc.fromdate"]!=null && vars["$htamap.misc.fromdate"]!="")
    {
      if (_type(funcs.val(vars["$htamap.misc.fromdate"], 3))!=3)
      {
        funcs.msg(_scmsg(732,"us"),3);
        vars["$cursor.field"] = "$htamap.misc.fromdate";
        return false;
      }
    }
    if (vars["$htamap.misc.todate"]!=null && vars["$htamap.misc.todate"]!="")
    {
      if (_type(funcs.val(vars["$htamap.misc.todate"], 3))!=3)
      {
        funcs.msg(_scmsg(732,"us"),3);
        vars["$cursor.field"] = "$htamap.misc.todate";
        return false;
      }
    }
  }

  if (objFile.inbox_class=="chart")
  {
    //Aggregation Field is required
    if (objFile.aggregation_type!=null && objFile.aggregation_type!="Count" && objFile.chart_source=="aggregate")
    {
      if (objFile.aggregation_field == null  && objFile.chart_model!="calc" && objFile.chart_model!="duration")
      {
        funcs.msg(_scmsg(99,"Reporting"),3);
        vars["$cursor.field"] = "aggregation.field";
        return false;
      }
    }
    
    var chartType = objFile.chart_type;
     
    //Group By Field is required
    if (chartType!="number" && objFile.chart_source!=null && objFile.chart_source=="aggregate")
    {
      if (objFile.chart_break_down_by == null && objFile.chart_model!="calc")
      {
        if (chartType=="line" || chartType=="area")
        {
          funcs.msg(_scmsg(93,"Reporting"),3);
        } else {
          funcs.msg(_scmsg(97,"Reporting"),3);
        }
        vars["$cursor.field"] = "chart.break.down.by";
        return false;
      }
    }
    
    //Check to use a calculator with datetime field for groupBy.calculator
    if (chartType!="number" && objFile.chart_break_down_by!=null && objFile.groupBy_calculator==null && objFile.chart_source=="aggregate")
    {
      position = funcs.index(objFile.chart_break_down_by, vars['$report.fields.all.key']);
      if (position!=null && position>0 && vars['$report.fields.all.type'][position-1]==3)
      {
        funcs.msg(_scmsg(98,"Reporting"),3);
        vars["$cursor.field"] = "groupBy.calculator";
        return false;
      }
    }
    
    //Stacked Field is required
    if (chartType=="stackedhbar" || chartType=="stackedvbar")
    {
      if (objFile.stack_field == null)
      {
        funcs.msg(_scmsg(91,"Reporting"),3);
        vars["$cursor.field"] = "stack.field";
        return false;
      }
    }
    
    //Check to use a calculator with datetime field for stack.calculator
    if (chartType!="number" && objFile.stack_field!=null && objFile.stack_calculator==null && objFile.chart_source=="aggregate")
    {
      position = funcs.index(objFile.stack_field, vars['$report.fields.all.key']);
      if (position!=null && position>0 && vars['$report.fields.all.type'][position-1]==3)
      {
        funcs.msg(_scmsg(98,"Reporting"),3);
        vars["$cursor.field"] = "stack.calculator";
        return false;
      }
    }
    
    //Check to use a calculator with non-datetime field for groupBy.calculator
    if (objFile.chart_break_down_by!=null && objFile.groupBy_calculator!=null)
    {
      position = funcs.index(objFile.chart_break_down_by, vars['$report.fields.all.key']);
      if (position!=null && position>0 && vars['$report.fields.all.type'][position-1]!=3)
      {
        funcs.msg(_scmsg(94,"Reporting"),3);
        vars["$cursor.field"] = "groupBy.calculator";
        return false;
      }
    }
    
    //Check to use a calculator with non-datetime field for stack.calculator
    if (objFile.stack_field!=null && objFile.stack_calculator!=null)
    {
      position = funcs.index(objFile.stack_field, vars['$report.fields.all.key']);
      if (position!=null && position>0 && vars['$report.fields.all.type'][position-1]!=3)
      {
        funcs.msg(_scmsg(94,"Reporting"),3);
        vars["$cursor.field"] = "stack.calculator";
        return false;
      }
    }

    if (chartType=="line" || chartType=="area" || chartType=="hbar" || chartType=="vbar" || chartType=="stackedhbar" || chartType=="stackedvbar")
    {
      //Check to calculate a field with group by this field together
      if (objFile.stack_field != null && objFile.chart_break_down_by != null && objFile.stack_field == objFile.chart_break_down_by)
      {
        if ((objFile.groupBy_calculator==null && objFile.stack_calculator!=null) || (objFile.groupBy_calculator!=null && objFile.stack_calculator==null))
        {
          funcs.msg(_scmsg(98,"Reporting"),3);
          vars["$cursor.field"] = "stack.calculator";
          return false;
        }
      }
      
      //Check to the two calculators should be on same datetime field
      if (objFile.chart_model!="calc" && objFile.groupBy_calculator!=null && objFile.stack_calculator!=null && objFile.stack_field!=objFile.chart_break_down_by)
      {
        funcs.msg(_scmsg(89,"Reporting"),3);
        vars["$cursor.field"] = "stack.calculator";
        return false;
      }
      //Check for The Year/Date calculators can not be supported.
      if (objFile.groupBy_calculator=="YEAR" && objFile.stack_calculator=="DATE")
      {
        funcs.msg(_scmsg(85,"Reporting"),3);
        vars["$cursor.field"] = "stack.calculator";
        return false;
      }
      //Check for The Quarter/Date calculators can not be supported.
      if (objFile.groupBy_calculator=="QUARTER" && objFile.stack_calculator=="DATE")
      {
        funcs.msg(_scmsg(86,"Reporting"),3);
        vars["$cursor.field"] = "stack.calculator";
        return false;
      }
    }

    //Check min/max axis bounds
    if (chartType != "number" && chartType != "area") {
      // min axis should smaller than max axis
      if ( _.isNumber(vars["$chart.misc.minAxis"]) && _.isNumber(vars["$chart.misc.maxAxis"]) && 
           parseFloat(vars["$chart.misc.minAxis"]) >= parseFloat(vars["$chart.misc.maxAxis"]) ) {
        funcs.msg(_scmsg(115,"us"),3);
        vars["$cursor.field"] = "$chart.misc.maxAxis";
        return false;
      }
    } 

    //check for thresholds, if there is any
    if(!validationChartThresholds(objFile)) {
        return false;
    }

    if (objFile.chart_model=="duration")
    {
      if (validationDurationChartReport(objFile)==false) {
        return false;
      }
    }

    if (objFile.chart_model=="calc")
    {
      if (validationCalcChartReport(objFile)==false) {
        return false;
      }
    }

    return true;
  }

  return true;
}

function validationChartThresholds(objFile){
  var hasThresholds = _lng(objFile['chart.threshold.from'])>0 || _lng(objFile['chart.threshold.to'])>0 || _lng(objFile['chart.threshold.color'])>0;
  if (hasThresholds) {
    var decimalPlaces = vars['$report.misc.decimalPlaces'];

    var fromList = lib.ArrayUtil.toJsArray(objFile['chart.threshold.from']);
    var toList = lib.ArrayUtil.toJsArray(objFile['chart.threshold.to']);
    var colorList = lib.ArrayUtil.toJsArray(objFile['chart.threshold.color']);

    var _fromList = lib.ArrayUtil.toSCDatum([]);
    var _toList = lib.ArrayUtil.toSCDatum([]);
    var _colorList = lib.ArrayUtil.toSCDatum([]);

    //step1 combine 3 arrays to list of threshold items
    var thresholds = [];
    var i;
    for (i = 0; i < colorList.length; i++) {
      //clear empty lines
      if( !_.isNumber(fromList[i]) && !_.isNumber(toList[i]) ) {
        continue;
      }
      var thldItem = {
        from: _.isNumber(fromList[i])?parseFloat(fromList[i].toFixed(decimalPlaces)):null,
        to: _.isNumber(toList[i])?parseFloat(toList[i].toFixed(decimalPlaces)):null,
        color: colorList[i]
      };
      thresholds.push(thldItem);
      _fromList.push(thldItem.from);
      _toList.push(thldItem.to);
      _colorList.push(thldItem.color);
    }

    //step2 set cleared array back to record
    objFile['chart.threshold.from'] = _fromList;
    objFile['chart.threshold.to'] = _toList;
    objFile['chart.threshold.color'] = _colorList;

    //step3 validation
    var index;
    for (index = 0; index < thresholds.length; index++) {
      thldItem = thresholds[index];
      vars['$cursor.row.number'] = index + 1;
      // each line should have color
      if (_.isEmpty(thldItem.color)) {
        funcs.msg(_scmsg(902,"Reporting",[index+1]),3);
        vars["$cursor.field"] = "chart.threshold.color";
        return false;
      }
      // value of lines should be continuous
      if (index > 0) {
        if (thldItem.from !== thresholds[index-1].to) {
          funcs.msg(_scmsg(903,"Reporting",[index+1]),3);
          vars["$cursor.field"] = "chart.threshold.from";
          return false;
        }
      }

      if( index===0 ){
        // 'to' of 1st line should not be NONE
        if (!_.isNumber(thldItem.to)) {
          funcs.msg(_scmsg(901,"Reporting",[index+1]),3);
          vars["$cursor.field"] = "chart.threshold.to";
          return false;
        }
        // value should be in ascending order
        else if(_.isNumber(thldItem.from) && thldItem.from >= thldItem.to){
          funcs.msg(_scmsg(904,"Reporting",[index+1]),3);
          vars["$cursor.field"] = "chart.threshold.from";
          return false;
        }
      }
      else if( index===thresholds.length-1 ){
        // 'from' of last line should not be NONE
        if (!_.isNumber(thldItem.from)) {
          funcs.msg(_scmsg(901,"Reporting",[index+1]),3);
          vars["$cursor.field"] = "chart.threshold.from";
          return false;
        }
        // value should be in ascending order
        else if(_.isNumber(thldItem.to) && thldItem.from >= thldItem.to){
          funcs.msg(_scmsg(904,"Reporting",[index+1]),3);
          vars["$cursor.field"] = "chart.threshold.from";
          return false;
        }
      }
      else{
        // only 1st.from and last.to can be NONE
        if(!_.isNumber(thldItem.from)){
          funcs.msg(_scmsg(901,"Reporting",[index+1]),3);
          vars["$cursor.field"] = "chart.threshold.from";
          return false;
        }
        if(!_.isNumber(thldItem.to)){
          funcs.msg(_scmsg(901,"Reporting",[index+1]),3);
          vars["$cursor.field"] = "chart.threshold.to";
          return false;
        }
        // value should be in ascending order
        else if(_.isNumber(thldItem.from) && _.isNumber(thldItem.to) && thldItem.from >= thldItem.to){
          funcs.msg(_scmsg(904,"Reporting",[index+1]),3);
          vars["$cursor.field"] = "chart.threshold.from";
          return false;
        }
      }

    }
  }
  return true;
}

function validationDurationChartReport(objFile)
{
  if (objFile.duration_startfield == null && _nullsub(objFile.aggregation_field_timeduration,false) == false)
  {
    funcs.msg(_scmsg(120,"Reporting"),3);
    vars["$cursor.field"] = "duration.startfield";
    return false;
  }

  if (objFile.duration_endfield == null )
  {
    if (_nullsub(objFile.aggregation_field_timeduration,false) == false)
    {
      funcs.msg(_scmsg(121,"Reporting"),3);
      vars["$cursor.field"] = "duration.endfield";
      return false;
    }
    else
    {
      funcs.msg(_scmsg(124,"Reporting"),3);
      vars["$cursor.field"] = "duration.endfield";
      return false;
    }
  }

  if (objFile.duration_format == null)
  {
    funcs.msg(_scmsg(122,"Reporting"),3);
    vars["$cursor.field"] = "duration.format";
    return false;
  }
  if (objFile.chart_type!="pie" && objFile.chart_number_label == null)
  {
    funcs.msg(_scmsg(123,"Reporting"),3);
    vars["$cursor.field"] = "chart.number.label";
    return false;
  }

  if (objFile.calcline_interval == null)
  {
    if (vars["$report.misc.runinfrontend"]!=null && vars["$report.misc.runinfrontend"]=="true") {
    } else {
      funcs.msg(_scmsg(130,"Reporting"),3);
      vars["$cursor.field"] = "calcline.interval";
      return false;
    }
  }

  var ret = lib.ReportService.verifyMeta(objFile);
  if (ret.valid == false)
  {
    funcs.msg(ret.message,3);
    vars["$cursor.field"] = ret.fieldName;
    return false;
  }

  return true;
}

function validationCalcChartReport(objFile)
{
  if ( objFile.chart_type!="pie" && objFile.chart_labelx == null)
  {
    funcs.msg(_scmsg(131,"Reporting"),3);
    vars["$cursor.field"] = "chart.labelx";
    return false;

  }

  if ( (objFile.chart_type!="number" && objFile.chart_type!="pie") && objFile.chart_labely == null)
  {
    funcs.msg(_scmsg(132,"Reporting"),3);
    vars["$cursor.field"] = "chart.labely";
    return false;
  }

  if (objFile.calcline_interval == null)
  {
    if (vars["$report.misc.runinfrontend"]!=null && vars["$report.misc.runinfrontend"]=="true") {
    } else {
      funcs.msg(_scmsg(130,"Reporting"),3);
      vars["$cursor.field"] = "calcline.interval";
      return false;
    }
  }

  if (objFile.chart_type=="number")
  {
    objFile.calcformula = _denull(objFile.calcformula);

    var lngFormula = objFile.calcformula.length();
    if (lngFormula>1)
    {
      funcs.msg(_scmsg(133,"Reporting"),3);
      vars["$cursor.field"] = "calcformula";
      return false;
    }
  }

  if (objFile.chart_type=="pie")
  {
    objFile.calcformula = _denull(objFile.calcformula);

    var lngFormula = objFile.calcformula.length();
    if (lngFormula>1)
    {
      funcs.msg(_scmsg(134,"Reporting"),3);
      vars["$cursor.field"] = "calcformula";
      return false;
    }
  }

  var ret = lib.ReportService.verifyMeta(objFile);
  if (ret.valid == false)
  {
    funcs.msg(ret.message,3);
    vars["$cursor.field"] = ret.fieldName;
    return false;
  }

  return true;
}
