/*  This script is used for colocating all the javascript code related
 *   to link(s) management
 *   created by gnicklas on 6/21/06
 *   This script is called from the Javascript in these processes:
 *     kmdocument.modify
 *     kmdocument.retire
 *     
 */
function removeRevisionIDFromLinks(wcDoc) {
    var lnksarray = wcDoc.links;
    var i;
    var length = lnksarray.length();
    for (i = 0; i < length; i++) {
        //we only need to rework the links if the linktype is SYSATTACHMENT 
        if (lnksarray[i].linktype == "SYSATTACHMENTS") {
            //essentially, if a link exists in the links array then it HAS to point
            //to a field in the kmdocument table which is how we can ensure that we 
            //have got the right field to search through
            var fldname = lnksarray[i].linkfield;
            //now that we know thw fieldname we need to parse the field for the linkid
            //and replace the id with the new id
            var thefldval = wcDoc[fldname];
            var regex = new RegExp(':kmdocument:' + wcDoc.id + 'R', 'g');
            thefldval = thefldval.replace(regex, ":kmdocument:" + wcDoc.id);
            //now write the value back into our sc datum file
            wcDoc[fldname] = thefldval;
            //then change the actual link record as well
            wcDoc.links[i].linkid = wcDoc.links[i].linkid.replace(regex, ":kmdocument:" + wcDoc.id); //substring(0, wcDoc.links[i].linkid.length-1);      
        }
    }
}

function workingCopyAlterLinks(wcDoc, oldId, oldUID, newUID) {
    var lnksarray = wcDoc.links;
    var lnkUID = "";

    var i;
    var length = lnksarray.length();
    for (i = 0; i < length; i++) {
        lnkUID = lnksarray[i].linkid;
        //we only need to rework the links if the linktype is SYSATTACHMENT and the link is for the UID we are processing
        if (lnksarray[i].linktype == "SYSATTACHMENTS" && lnkUID.indexOf(oldUID) >= 0) {
            //essentially, if a link exists in the links array then it HAS to point
            //to a field in the kmdocument table which is how we can ensure that we 
            //have got the right field to search through
            var fldname = lnksarray[i].linkfield;
            //now that we know thw fieldname we need to parse the field for the link
            //and replace the id with the new id
            var thefldval = wcDoc[fldname];

            var parsTxt = thefldval;

            //find the link in the field data
            var repidx = parsTxt.indexOf(lnksarray[i].linkid);
            while (repidx > 0) {
                //put in the new UID
                thefldval = thefldval.substring(0, repidx) + newUID + thefldval.substring(repidx + oldUID.length);

                //find the old Id
                repidx = thefldval.indexOf(oldId, repidx);

                //put in the new Id
                thefldval = thefldval.substring(0, repidx) + oldId + "R" + thefldval.substring(repidx + oldId.length);
                repidx += oldId.length + 1; //advance our "cursor"

                //find the next one
                parsTxt = thefldval;
                repidx = parsTxt.indexOf(lnksarray[i].linkid, repidx);
            }

            //now write the value back into our sc datum file
            wcDoc[fldname] = thefldval;

            //then change the actual link record as well
            var regex = new RegExp(oldUID, 'g');
            wcDoc.links[i].linkid = wcDoc.links[i].linkid.replace(regex, newUID);
            wcDoc.links[i].linkid = wcDoc.links[i].linkid + "R";
        }
    }
}

function workingCopyAttachmentsCopy(wcDoc, oldId) {
    //TESTING
    //first thing we need to do is a query to find all the SYSATTACHMENTS that
    //currently point to the old id and then loop through them to change each one
    var theAttach = new SCFile("SYSATTACHMENTS");
    var rc = theAttach.doSelect("topic=\"" + oldId + "\" and application=\"kmdocument\"");

    if (rc != RC_SUCCESS) {
        return;
    }

    var oldUIDS = [];
    var newUIDS = [];

    while (rc == RC_SUCCESS) {
        var newAttach = new SCFile("SYSATTACHMENTS");
        funcs.fduplicate(newAttach, theAttach);

        var i = funcs.index(theAttach.uid, oldUIDS);
        if (i == 0) {
            newAttach.uid = funcs.get_uid();
            oldUIDS.push(theAttach.uid);
            newUIDS.push(newAttach.uid);
            workingCopyAlterLinks(wcDoc, oldId, theAttach.uid, newAttach.uid);
        } else {
            newAttach.uid = newUIDS[i - 1]; //we subtract 1 from i here because the index call returns a 1-based index
        }

        //now just change the id to the new id and insert the new record
        newAttach.topic = oldId + "R";
        newAttach.doInsert();
        rc = theAttach.getNext();
    }
}


function workingCopyFeedbackCopy(oldId) {
    //TESTING
    var thefb = new SCFile("kmfeedback");
    var rcFB = thefb.doSelect("kmdocumentid=\"" + oldId + "\"");

    while (rcFB == RC_SUCCESS) {
        var newfb = new SCFile("kmfeedback");
        funcs.fduplicate(newfb, thefb);

        var callRtn = new SCDatum();
        var nextNumber = new SCDatum();
        funcs.rtecall("getnumber", callRtn, nextNumber, "kmfeedback");

        var strID = nextNumber.getText();
        if (!Number.isNaN(strID)) {
            newfb.id = parseInt(strID);

            //now just change the id to the new id and insert the new record
            newfb.kmdocumentid = oldId + "R";
            newfb.doInsert();
        }
        rcFB = thefb.getNext();
    }
    //END TESTING
}

// record is the kmdocument to be retired that other documents link to
// lnkdocsarray is an array of the other documents that link to this record
// Called by kmdocument.retire and by cm.km.retire
function moveDocsWithLinksToReview(record, lnkdocsarray) {
    var fbrec = new SCFile("kmfeedback");
    var i;
    for (i = 0; i < lnkdocsarray.length; i++) {
        //first lets do the feedback
        var callRtn = new SCDatum();
        var nextNumber = new SCDatum();
        funcs.rtecall("getnumber", callRtn, nextNumber, "kmfeedback");

        var strID = nextNumber.getText();
        if (!Number.isNaN(strID)) {
            fbrec.id = parseInt(strID);
            var arrayLinkArgs = new SCDatum();
            arrayLinkArgs.setType(8); //type array
            arrayLinkArgs.push(record.id);
            // This document links to another document (record.id) that an operator attempted to retired. Please review now.
            fbrec.feedbacktext = funcs.scmsg(136, "km", arrayLinkArgs);
            fbrec.kmdocumentid = lnkdocsarray[i];
            fbrec.doInsert();
        }

        //now that we have the feedback, send this document to workflow
        //we need to get the doc as an object we can work with first
        var lnkdoc = new SCFile("kmdocument");
        var rc2 = lnkdoc.doSelect("id=\"" + lnkdocsarray[i] + "\"");
        while (rc2 == RC_SUCCESS) {
            //ignore the doc if it is retired or draft or working copy
            if (lnkdoc.status == "internal" || lnkdoc.status == "external") {
                var oldId = lnkdoc.id;
                lnkdoc.assoc_wc_doc = oldId + "R";
                lnkdoc.doUpdate();

                lib.KMUsageHistory.modified(oldId);

                // Create a new KM document and read the published version to create a new KM document.
                vars.$L_workingcopyDoc = new SCFile("kmdocument");
                funcs.fduplicate(vars.$L_workingcopyDoc, lnkdoc);

                vars.$L_workingcopyDoc.assoc_wc_doc = null;

                // Set the status.
                vars.$L_workingcopyDoc.status = "triage";

                // Set the associated published doc id.
                vars.$L_workingcopyDoc.assoc_published_doc = oldId;

                // Set this working copy's doc id to the published doc id plus "R"; e.g., mark a revision of K36 as K36R
                vars.$L_workingcopyDoc.id = oldId + "R";

                workingCopyAlterLinks(vars.$L_workingcopyDoc, oldId);

                // Save the new kmdocument record.
                vars.$L_workingcopyDoc.doInsert();

                //after creating the working copy we are going to copy over any attachments to new
                //attachment records that point to the new id which = old id + R
                workingCopyAttachmentsCopy(oldId);

                //then we need to copy over the feedbacks to the new, altered id as well
                //first thing we need to do is a query to find all the kmfeedback recs that
                //currently point to the old id and then loop through them to change each one
                workingCopyFeedbackCopy(oldId);

                var arrayArgs = new SCDatum();
                arrayArgs.setType(8); //type array
                arrayArgs.push(oldId);
                print(funcs.scmsg(135, "km", arrayArgs)); // Feedback added and document: oldId sent for review.
            }
            rc2 = lnkdoc.getNext();
        }
    }
}

// record is the kmdocument to be retired to check if other documents link to it
// blocklnkids is returned as a semicolon-delineated list of the other documents that link to this record
// dolinksmsg is returned as true if we need to ask if the user wants to push the linking docs to a review (workflow) cycle, else false
// oktocontinue is returned as true if valid to save as is, mo docs link to this record, else false if docs link to this record
// Called by kmdocument.retire and by cm.km.retire
function checkForLinkingDocs(record) {
    //before we retire we need to check to see if they CAN retire the document as 
    //it may be linked to by other documents...if so, ask them if they want to send
    //the other docs to change with some feedback added telling the situation
    var blocklnkids = ""; // default to no doc ids link to this doc
    var dolinksmsg = "false"; // default to the calling process need not display any link message
    var oktocontinue = "true"; // default to valid to save as is, mo docs link to this record

    var chq = new SCFile("kmdocument", SCFILE_READONLY);
    chq.setFields(["status", "id", "assoc.wc.doc"]);
    var rc = chq.doSelect("linkid=\"kmdocument:id=&quot;" + record.id + "&quot;\"");
    if (rc == RC_SUCCESS) {
        //first create a string that has all the ids added together
        while (rc == RC_SUCCESS) {
            //we want to exclude documents that have already been sent to workflow here
            if ((chq.status == "internal" || chq.status == "external" || chq.status == "retired") && chq.assoc_wc_doc == null) {
                if (blocklnkids != "") {
                    blocklnkids = blocklnkids + ";";
                }
                blocklnkids = blocklnkids + chq.id;
            }
            rc = chq.getNext();
        }

        //now set the variable to tell it to ask the confirmation question
        if (blocklnkids == "") {
            // There are documents that link to this document that are being reviewed.  Cannot retire this document at this time.
            lib.KMUtils.domessageBox(funcs.scmsg(132, "km"));
            dolinksmsg = "false";
        } else {
            dolinksmsg = "true";
        }
        oktocontinue = "false"; // not valid to save, since docs link to this record
    }
    // else valid to save as is, mo docs link to this record

    // Create an array to return the three strings.
    var linkArray = new SCDatum();
    linkArray.setType(8); //type array
    linkArray.push(blocklnkids);
    linkArray.push(dolinksmsg);
    linkArray.push(oktocontinue);

    return linkArray;
}