function getFormByClientType(formatName, fileName,clientType)
{
    var fFormat = new SCFile("format");
    var rc = fFormat.doSelect("name=\"" + formatName + "."+ clientType+ "\"");
    if (rc == RC_SUCCESS) 
    {
        return formatName+ "."+ clientType;
    }else{
        return formatName;
    }
}

function getButtonIdsByClientType( fileName,clientType)
{    
    var fDisplaybutton = new SCFile("displaybutton");
    var rc = fDisplaybutton.doSelect("filename=\"" + fileName + "\" and client.type=\""+ clientType+ "\"");
    
    if (rc == RC_SUCCESS) 
    {
        // QCCR1E127201 Buttons are not greyed out as expected when using Wizards in the Mobile Client
        // Mobile buttons are defined by table 'displaybutton', the table is only for the screen of specified file
        // But for other display screens like wizarnd and outage, the table is not enougth to define the buttons
        // Here can add the hard-code screen buttons for the display screen        
        var newButtonIds = '';
        if(vars.$L_screen.screen_id=='sla.outage.confirm') {
            newButtonIds = '2,';    
        } else if(vars.$L_screen.screen_id=='wizard.display') {
            newButtonIds = '3,5,10,11,';
        }  
        var buttonIds = ","+fDisplaybutton.button_ids+",";
        if(newButtonIds){
            buttonIds = buttonIds+newButtonIds;
        }
        
        return buttonIds;
    }else{
        return null;
    }
}

function getInteractionApproveIds()
{
    var interactionIds =  new Array();
    var fApproval = new SCFile("Approval");
    var rc = fApproval.doSelect('file.name="incidents" and (current.pending.groups isin approval.groups in $G.sm.environment or current.pending.groups isin {$lo.user.name}) or current.pending.groups isin $G.delegated.svc.groups');    
    while(rc == RC_SUCCESS)
    {
        //print("Approval unique.key:"+fApproval.unique_key);
        interactionIds.push( fApproval.unique_key );
        rc = fApproval.getNext();
    }
    
    return interactionIds;
}