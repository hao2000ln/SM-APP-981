/**
 * This function is left to customers to customize the chat request info which is displayed when accepting a chat request, system will display 
 * OOB default configuration (Department, Email, Location, and Description of the Service Portal user's issue) if this function returns null
 * @param chatReqId (String)
 *          The chat request ticket id, it will be passed in automatically
 * @param chatReqTableName (String)
 *          The chat request dbdict name, it will be passed in automatically
 * @return [
 *             {"label":"Company","value":"advantage"},
 *             {"label":"Dept Name","value":"North America - HR & Administration"},
 *             {"label":"Email","value":"user@hpe.com"},
 *             {"label":"Location","value":"BLDG1"},
 *             {"label":"Description","value":"Can not connect to email server"}            
 *          ]
 */
function overrideChatRequestInfo(chatReqId, chatReqTableName) {
    /*
    //Below is an example
    var chat=new SCFile(chatReqTableName,SCFILE_READONLY);
    var sql="number=\""+chatReqId+"\"";
    if(chat.doSelect(sql)===RC_SUCCESS){
        var contact=lib.EndUserChat.getContactByName(chat['contact']);
        var rtn=[];
        rtn.push({"label":lib.EndUserChat.getFieldLocalizedCaption("company", "contacts"),"value":contact['company']});
        rtn.push({"label":lib.EndUserChat.getFieldLocalizedCaption("dept.name", "contacts"),"value":contact['dept.name']});
        rtn.push({"label":lib.EndUserChat.getFieldLocalizedCaption("email", "contacts"),"value":contact['email']});
        rtn.push({"label":lib.EndUserChat.getFieldLocalizedCaption("location", "contacts"),"value":contact['location']});
        rtn.push({"label":lib.EndUserChat.getFieldLocalizedCaption("description", chatReqTableName),"value":chat['description']});
        return rtn;
    }
    else return null;
    */
    return null;
}