

function initChangeEnvironmentVariable(){

  var env = new SCFile("environment",SCFILE_READONLY);
  
  var rc = env.doSelect("name=\"cm3r\"");

  if(rc == RC_SUCCESS){
    vars.$G_cm3_global_environment = env;
  }


}