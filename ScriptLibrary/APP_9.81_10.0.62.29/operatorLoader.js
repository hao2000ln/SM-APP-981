/**
* This script populates any given number of operators 
* 
* 09/19/2008
* Hua Zhang
*/

var assign = new Array("Application","Hardware","Network","Service Desk","Service Manager");
var changeProfile=new Array("sysadmin","problem manager","initiator","emergency group","change manager");
var requestProfile=new Array("sysadmin","requestor","request approver","request admin","request coordinator");
var serviceProfile=new Array("sysadmin","service desk manager","service desk agent","approver","helpdesk tech");
var incidentProfile=new Array("sysadmin","service desk manager","service tech","incident analyst","incident manager");
var problemProfile=new Array("sysadmin","problem manager","problem coordinator","problem analyst","initiator");
var configProfile=new Array("sysadmin","coordinator","configuration auditor","administrator","configuration administrator");
var contractProfile=new Array("DEFAULT","PAYMENT SPECIALIST","contract specialist","sysadmin","sysadmin");
var number=100;

for (var i=0;i<number;++i)
{
	var contacts = new SCFile("contacts");
	contacts.full_name="TESTS"+i;
	contacts.contact_name="TESTS"+i;
	contacts.doInsert();	
}

var start = new Date;
for (var i=0;i<number;++i)
{
	var operator = new SCFile("operator");
	operator.name="TESTS"+i;
	operator.contact_name="TESTS"+i;
	operator.full_name="TESTS"+i;
	operator.company="advantage";
	operator.profile_sla="DEFAULT";
	operator.email="test@hp.com";
	operator.profile_service=serviceProfile[i%5];
	operator.profile_incident=incidentProfile[i%5];
	operator.profile_rootcause=problemProfile[i%5];
	operator.profile_inventory=configProfile[i%5];
	operator.profile_contract=contractProfile[i%5];
	operator.profile_change[0]=changeProfile[i%5];
	operator.profile_request[0]=requestProfile[i%5];
	operator.assignment_groups[0]=assign[i%5];
	operator.doInsert();	
}

var end = new Date;
      
print( " =======> Response time was: " + (end - start)+" millseconds for creating "+number+" of operators" );
