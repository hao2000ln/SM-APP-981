var maxLogins=4;
 
function preIncreaseOperatorMaxLogins(){
       var query='ess.access.only=true and (multi.login=false or multi.login=NULL) and (max.logins=NULL or max.logins<='+maxLogins+')';
       increaseOperatorMaxLogins(query);
       query='(name="Template_SelfService" or name="Template-Service Catalog") and (multi.login=false or multi.login=NULL) and (max.logins=NULL or max.logins<='+maxLogins+')';     
       increaseOperatorMaxLogins(query);
       query ='(secRole isin {\"approver\",\"change approver\"}) and (multi.login=false or multi.login=NULL) and (max.logins=NULL or max.logins<='+maxLogins+')';
	   increaseOperatorMaxLogins(query);
}
function increaseOperatorMaxLogins(query){
       var op=new SCFile("operator");
       if(op.doSelect(query)===RC_SUCCESS){
             do{
                    op['max.logins']=maxLogins;
                    op.doUpdate();
             }while(op.getNext()===RC_SUCCESS)
       }
}
preIncreaseOperatorMaxLogins();
