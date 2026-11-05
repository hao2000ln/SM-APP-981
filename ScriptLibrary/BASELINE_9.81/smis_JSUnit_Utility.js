/****************************************************************
*  Utility classed used to create Smis instance in the JSunit test cases
*  
*                                                 
*                                                              
*  Author: Shu Shiji(shiji.shu@hp.com)                                 
 *  Date:2012/06/18                                             
*  Update:                                                     
*  Version:1.0                                                 
****************************************************************/

/** This function is used to create one Smis instance if it don't exist
*     
*     @param {String} templateName - the name of the the Smis instance 
*     @returns the SMISConfiguration existed or created 
*   @type SCFile
*/

function createSMISConfiguration(templateName) {
   var configInstance = new SCFile("SMISConfiguration");
   var ret = configInstance.doSelect("template=\"" + templateName + "\"");
   if (ret == RC_SUCCESS) {
       return configInstance;
   }
   return createSMISInstance(templateName);
}


/** This function is used to generate the new intId used for new SMISConfiguration record
*     
*     @param {String} filename - the file name  
*     @param {String} fieldname - the field name to check 
*     @returns the intId used for new SMISConfiguration record 
*   @type SCFile
*/
function getnumber(filename, fieldname) {
    var maxnumber = 0;
    var instanceConfig = new SCFile(filename);
      var RC = instanceConfig.doSelect(true);
      
      while ( RC == RC_SUCCESS ){
          var intId = system.functions.val(instanceConfig[fieldname], 1);
          if (intId > maxnumber) {
             maxnumber = intId;
          }
          RC = instanceConfig.getNext();
      }
      return maxnumber+1;
}


/** This function is used to create one Smis instance 
*     
*     @param {String} templateName - the name of the the Smis instance 
*     @returns the SMISConfiguration created 
*   @type SCFile
*/
function createSMISInstance(templateName) {
    var registry = new SCFile("SMISRegistry");
    var ret = registry.doSelect("name=\"" + templateName + "\"");
    if (ret == RC_SUCCESS) {
        var configInstance = new SCFile("SMISConfiguration");
        configInstance.name = registry.name;
        configInstance.version = registry.version;
        configInstance.ctrlName = registry.ctrlName;
        configInstance.category = registry.category;
        configInstance.mgrName = registry.mgrName;
        configInstance.SMAdapter = registry.SMAdapter;
        configInstance.EPAdapter = registry.EPAdapter;
        configInstance.supportRT = registry.supportRT;
        configInstance.description = registry.description;
        configInstance.template = registry.name;
        configInstance.status = lib.smis_Constants.INSTANCE_STATUS_DISABLE();
        configInstance.category = registry.category;
        configInstance.loggerLevel = "INFO";
        
        //parameters
        var i;
        for (i in registry.paramInfo) {
            configInstance.paramInfo[i].paramName = registry.paramInfo[i].paramName;
            configInstance.paramInfo[i].paramValue = registry.paramInfo[i].paramValue;
            configInstance.paramInfo[i].paramDesc = registry.paramInfo[i].paramDesc;
            configInstance.paramInfo[i].paramCategory = registry.paramInfo[i].paramCategory;
            configInstance.paramInfo[i].ispwd = registry.paramInfo[i].ispwd;
        }


        //fields
        try {
            var smAdapter = new (lib[registry.SMAdapter].getClass())(null);
            var smFields = smAdapter.getFields();


            var epAdapter = new (lib[registry.EPAdapter].getClass())(null);
            var epFields = epAdapter.getFields();


            var tempSMFields = new SCDatum();
            tempSMFields.setType(8);

            var tempEPFields = new SCDatum();
            tempEPFields.setType(8);


            for(i in smFields) {
                      configInstance.SMFields[i].SMFieldName = smFields[i].name;
                      configInstance.SMFields[i].SMFieldType = smFields[i].type;
                      configInstance.SMFields[i].SMFieldDesc = smFields[i].desc;
                }


                for(i in epFields) {
                      configInstance.EPFields[i].EPFieldName = epFields[i].name;
                      configInstance.EPFields[i].EPFieldType = epFields[i].type;
                      configInstance.EPFields[i].EPFieldDesc = epFields[i].desc;
                }
          } catch (e) {
                print(e);
          }
            
            configInstance.intId = "" + getnumber("SMISConfiguration", "intId");
            
          //save config instance
          configInstance.doAction("addsave");


          if ((registry.fieldMapping!=null && registry.fieldMapping.length()>0)  ||
              (registry.valueMapping!=null && registry.valueMapping.length()>0)) {
            var fieldMapping = new SCFile("SMISFieldMapping");
            //field mapping
            for (i in registry.fieldMapping) {
                fieldMapping.fieldMapping[i].SMField = registry.fieldMapping[i].SMField;
                fieldMapping.fieldMapping[i].EPField = registry.fieldMapping[i].EPField;
                fieldMapping.fieldMapping[i].SMDefValue = registry.fieldMapping[i].SMDefValue;
                fieldMapping.fieldMapping[i].EPDefValue = registry.fieldMapping[i].EPDefValue;
                fieldMapping.fieldMapping[i].SMjscallback = registry.fieldMapping[i].SMjscallback;
                fieldMapping.fieldMapping[i].EPjscallback = registry.fieldMapping[i].EPjscallback;
                fieldMapping.fieldMapping[i].direction = registry.fieldMapping[i].direction;
                fieldMapping.fieldMapping[i].FMDescription = registry.fieldMapping[i].FMDescription;
                fieldMapping.fieldMapping[i].valueMappingGroup = registry.fieldMapping[i].valueMappingGroup;
         }

           var j;
           for (j in registry.valueMapping) {
                fieldMapping.valueMapping[j].SMValue = registry.valueMapping[j].SMValue;
                fieldMapping.valueMapping[j].EPValue = registry.valueMapping[j].EPValue;
                fieldMapping.valueMapping[j].valueMappingGroupID = registry.valueMapping[j].valueMappingGroupID;
                fieldMapping.valueMapping[j].VMDescription = registry.valueMapping[j].VMDescription;
           }
         //save fieldmapping
           fieldMapping.intId = configInstance.intId;
           fieldMapping.doAction("addsave");
           }
		  
          return configInstance;
     }
}