/******************************************************
* Module Name: survey Constants
* Function: contain global constants
* Author: Tian, Shao-Qin
* Version: 1.00
* Creation Date: Mar., 2013
*******************************************************/


function SCHEDULER_RUN() { return "var surveyDefinition = lib.Survey_ConfigurationManager.getSurveyDefinition(\"\$surveyId\$\"); \n if (surveyDefinition != null && surveyDefinition.active && surveyDefinition.integrationInstance != null) { \n var producer = lib.Survey_ConfigurationManager.getTaskProducer(surveyDefinition);\n producer.produceSurveyTasks();}"};

function SCHEDULE_CLASS_NAME() {return "Survey_Service_Agent"};