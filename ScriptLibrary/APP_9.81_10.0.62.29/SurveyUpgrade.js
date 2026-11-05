function doUpgrade(){

  InsertQuestionToTemplate();
  upgradeSettings();

}

function InsertQuestionToTemplate()
{
 var question = new SCFile("svcSrcSurveyConfig")
 question.setOrderBy(['order'], [SCFILE_ASC]);
 var query = "order~=NULL"
 var rc = question.doSelect(query);
 var template = new SCFile("SurveyTemplate")
 var q = "name=\"DEFAULT\""
 var rc2 = template.doSelect(q)
 if (rc != RC_SUCCESS) return
 else{
   if (rc2 == RC_SUCCESS)
   {
     template.questions=[];
     while (rc == RC_SUCCESS)
     {
       template.questions.push(question.id)
       template.doSave()
       rc = question.getNext();
     }
   }
 }
}

function upgradeSettings(){
  var settingsConfig = new SCFile('settingsConfig');
  var rc = settingsConfig.doSelect('setting="Survey" and id="survey.portal"');
  if (rc===RC_SUCCESS) {
    settingsConfig.doDelete();
  }
}
