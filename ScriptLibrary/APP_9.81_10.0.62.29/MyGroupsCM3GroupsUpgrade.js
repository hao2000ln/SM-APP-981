
function syncCM3GroupsMyGroups()
{
 
 var cmgroup= new SCFile("cm3groups");
 var noOfGroups=0,noOfOperators=0;
 
 cmgroup.doSelect("true");
 
 cmgroup.getFirst();
 
 do
 {

  vars.$L_sf=system.functions.rtecall("sort", vars.$L_rc,cmgroup.approvers, 0, 0);  
  cmgroup.approvers=system.functions.denull(cmgroup.approvers);
  
  for(i=0;i<cmgroup.approvers.length();i++)
  {
   
   var mygroup = new SCFile("myGroups");
   if(mygroup.doSelect("name=\""+cmgroup.approvers[i]+"\"")==RC_SUCCESS)
   {
   
     if(system.functions.index(cmgroup.name,mygroup.approver_of)==0)
     {
      mygroup.approver_of.push(cmgroup.name);
      vars.$L_sf=system.functions.rtecall("sort", vars.$L_rc,mygroup.approver_of, 0, 0);
      vars.$L_sf=system.functions.rtecall("sort", vars.$L_rc,mygroup.member_of, 0, 0);
     }
     
     mygroup.doUpdate();
     
   } 
   else
   {
     mygroup.name=cmgroup.approvers[i];
     mygroup.approver_of[0]=cmgroup.name;
     noOfOperators+=1;

     mygroup.doInsert();
   }
  } 
  
  vars.$L_sf=system.functions.rtecall("sort", vars.$L_rc,cmgroup.members, 0, 0);  
  cmgroup.members=system.functions.denull(cmgroup.members);
  
  for(i=0;i<cmgroup.members.length();i++)
  {
   var mygroup = new SCFile("myGroups");
   if(mygroup.doSelect("name=\""+cmgroup.members[i]+"\"")==RC_SUCCESS)
   {
   
     if(system.functions.index(cmgroup.name,mygroup.member_of)==0)
     {
      mygroup.member_of.push(cmgroup.name);
      vars.$L_sf=system.functions.rtecall("sort", vars.$L_rc,mygroup.approver_of, 0, 0);
      vars.$L_sf=system.functions.rtecall("sort", vars.$L_rc,mygroup.member_of, 0, 0);
     }
     mygroup.doUpdate();
   } 
   else
   {
     mygroup.name=cmgroup.members[i];
     mygroup.member_of[0]=cmgroup.name;
     noOfOperators+=1;
     mygroup.doInsert();
   }
  }
  noOfGroups+=1;
 }while(cmgroup.getNext()==RC_SUCCESS)
 
 print(noOfGroups+" records processed in cm3groups table.");
 print(noOfOperators+" records added to myGroups table.");
 print("cm3groups-myGroups upgrade completed.")
 
}
