/*
*	This lib is to set/get exception for training, tuning & testing
*/
function getLastSuggestException(){
	return vars.$G_IDOL_CATEGORY_SUGGEST_EXCEPTION;
}


function setLastSuggestException(e){
	vars.$G_IDOL_CATEGORY_SUGGEST_EXCEPTION = e;
}


function getLastTrainingException(){
	return vars.$G_IDOL_CATEGORY_TRAINING_EXCEPTION;
}


function setLastTrainingException(e){
	vars.$G_IDOL_CATEGORY_TRAINING_EXCEPTION = e;
}


function getLastTestException(){
	return vars.$G_IDOL_CATEGORY_TEST_EXCEPTION;
}


function setLastTestException(e){
	vars.$G_IDOL_CATEGORY_TEST_EXCEPTION = e;
}


function getLastRuleBaseException(){
	return vars.$G_IDOL_CATEGORY_RULEBASE_EXCEPTION;
}


function setLastRuleBaseException(e){
	vars.$G_IDOL_CATEGORY_RULEBASE_EXCEPTION = e;
}


function getLastTuningException(){
	return vars.$G_IDOL_CATEGORY_TUNING_EXCEPTION;
}


function setLastTuningException(e){
	vars.$G_IDOL_CATEGORY_TUNING_EXCEPTION = e;
}