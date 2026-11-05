/**  @fileoverview KMSecurity 
 *   @author Sal James
 */

var $ = lib.c.$;

var reg = />/g;

/**
 *   @class KMSecurity
 *   @constructor
 */

/**
 *	This class consists of functions that return arrays of associations
 *   between user logins, km categories, km profiles, and the km permissions
 *   of view, contribute, review, edit, and own.
 */
function KMSecurity() {}

// Called by km.environment when the user logs in. 
// This function builds these global arrays:
// $G.appext - an array of approve externally categories that the user is a KCS III in
// $G.appintext - an array of approve internally categories that the user is a KCS II/III in
// $G.contrib - an array of contributable categories that the user is a KCS I/II/III in
// $G.viewintext - an array of internally (and externally) viewable categories that the user can search
// $G.viewext - an array of externally viewable categories that the user can search
// $G.retire - an array of categories that the user can retire or unretire, or delete retired drafts
function getCatsAtLogin(allow_access) {
    var KMADMIN = "KM ADMIN";
    var operatorName = funcs.operator(); // Get login name from operator() function.

    var appext = new Datum();
    appext.setType(8); // DO WE NEED an array of approve externally categories that the user is a KCS III in (external permission)
    var appextid = new Datum();
    appextid.setType(8); // an array of ids of the approve externally categories that the user is a KCS III in (external permission)
    var appintext = new Datum();
    appintext.setType(8); // an array of approve internal & external categories that the user is a KCS III in (internal && external permission)
    var appint = new Datum();
    appint.setType(8); // an array of approve internal categories that the user is a KCS II only in, not a KCS III (internal && !external permission)
    var appintid = new Datum();
    appintid.setType(8); // an array of ids of the approve internal categories that the user is a KCS II only in, not a KCS III (internal && !external permission)
    var filterAppWcRet = new Datum();
    filterAppWcRet.setType(8); // an array of categories that the user is at least a KCS II in (internal permission)
    var filterEditInChm = new Datum();
    filterEditInChm.setType(8); // an array of categories that the user is at least a KCS I Editor in (edit.in.workflow permission)
    var chmcatid = new Datum();
    chmcatid.setType(8); // an array of category ids that the user can search for change documents in 
    // chmcatid is sent to the "KM choose search kmcategory" wizard by the cm.km.search process - SPARKS Incident # 4000075647
    var contrib = new Datum();
    contrib.setType(8); // an array of contribute category fullpathids "KMCAT1:KMCAT2:KMCAT3" that the user is at least a KCS I in
    var contribid = new Datum();
    contribid.setType(8); // an array of contribute category ids, e.g. "KMCAT3" that the user is at least a KCS I in
    var contribname = new Datum();
    contribname.setType(8); // an array of contribute category names "Happy > Joy > Fun" that the user is at least a KCS I in
    var viewintext = new Datum();
    viewintext.setType(8); // an array of categories that the user can view internally and externally in
    var viewext = new Datum();
    viewext.setType(8); // an array of categories that the user can view only externally in
    var appImmedIntExt = new Datum();
    appImmedIntExt.setType(8); // an array of categories that the user can approve immediately internally and externally in
    var appImmedInt = new Datum();
    appImmedInt.setType(8); // an array of categories that the user can approve immediately internally in
    var viewwc = new Datum();
    viewwc.setType(8); // an array of categories that the user can view working copy docs in
    var viewid = new Datum();
    viewid.setType(8); // an array of category ids that the user can view
    var viewname = new Datum();
    viewname.setType(8); // an array of category names that the user can view
    var retire = new Datum();
    retire.setType(8); // an array of categories that the user can retire docs in
    var deleteCats = new Datum();
    deleteCats.setType(8); // an array of categories that the user can delete retired docs in
    var editinplace = new Datum();
    editinplace.setType(8); // an array of categories that the user can edit approved docs in place
    var viewAdaptive = new Datum();
    viewAdaptive.setType(8); // an array of categories that the user can view adaptive learning phrases and usage counts in
    var editAdaptive = new Datum();
    editAdaptive.setType(8); // an array of categories that the user can edit adaptive learning phrases and usage counts in (generally the KMAdmin edits all docs in all categories)

    lib.KMLanguages.setKMActiveLangs();
    var rc;
    var fullpathid = "";
    var id = "";
    var fullpathname = "";
    var testRtn = 0;

    // Initialize all the return arrays to empty
    vars.$G_appext = appext;
    vars.$G_appextid = appextid;
    vars.$G_appintext = appintext;
    vars.$G_appint = appint;
    vars.$G_appintid = appintid;
    vars.$G_appImmedIntExt = appImmedIntExt;
    vars.$G_appImmedInt = appImmedInt;
    vars.$G_filterAppWcRet = filterAppWcRet;
    vars.$G_filterEditInChm = filterEditInChm;
    vars.$G_chmcatid = chmcatid;
    vars.$G_contrib = contrib;
    vars.$G_contribid = contribid;
    vars.$G_contribname = contribname;
    vars.$G_viewintext = viewintext;
    vars.$G_viewext = viewext;
    vars.$G_viewwc = viewwc;
    vars.$G_viewid = viewid;
    vars.$G_viewname = viewname;
    vars.$G_retire = retire;
    vars.$G_deleteCats = deleteCats;
    vars.$G_editinplace = editinplace;
    vars.$G_editAdaptive = editAdaptive;
    vars.$G_draftquery = "status=\"draft\" AND author=\"" + operatorName + "\"";
    vars.$G_retiredquery = "";
    vars.$G_approvedquery = "";
    vars.$G_maintainDocQuery = "";
    vars.$G_wcquery = "";
    vars.$G_inboxquery = "";
    vars.$G_appextQuery = "";
    vars.$G_appImmedIntExtQuery = "";
    vars.$G_appImmedIntQuery = "";
    vars.$G_inboxAppIntCM = "";
    vars.$G_inboxAppExtCM = "";
    vars.$G_deleteCatsQuery = "";
    vars.$G_editinplacequery = "";
    vars.$G_viewAdaptiveQuery = "";
    vars.$G_editAdaptiveQuery = "";

    vars.$G_noChm = false;
    if (funcs.lioption("Change Management") == null || funcs.lioption("Change Management") == false) {
        vars.$G_noChm = true; // for menu.gui.km	
    }

    // The categories field in kmdocument record has the doc categories for approved and retired
    // The misc_array1 field in cm3r record has the doc categories to check for approve int or ext

    // Create a profile record and initialize it to all false if there's no operator record 
    //   or to all true if the user is an admin
    vars.$G_km_environment = new SCFile("kmprofile");

    // If Knowledge Management is not licensed, then no user is authorized.
    // if ( (!(funcs.lioption("Knowledge Management")==true )))
    // {
    //    // Call initProfile to give the user no capabilities.
    //    initProfile(vars.$G_km_environment,false);
    //    return; // Return all empty category lists and a profile of false settings.
    // }

    var operatorFile = vars['$lo.operator'];
    if (operatorFile == null || operatorFile.name != operatorName) {
        // Read the record for the operator who is signed in.
        /**QCCR1E101184, SM934, dengxin
         **add readonly for doselect, and add the selected fields.
         */
        operatorFile = new SCFile("operator", SCFILE_READONLY);
        operatorFile.setFields("kmgroup");
        //QCCR1E101184, end

        rc = operatorFile.doSelect("name =  \"" + operatorName + "\"");
        if (rc != RC_SUCCESS) {
            // Cannot find user in operator table!
            if (operatorName != "scheduler" && operatorName != "external" && operatorName != "KMUpdate") {
                // Call initProfile to give the user no capabilities.
                initProfile(vars.$G_km_environment, false);
                return; // Return all empty category lists and a profile of false settings
            }
        }
    }

    // Check if this user is an admin.
    // The operator cap.exec array settings indicate admin permissions
    //change the first line for QCCR1E151762
    if ((funcs.index("SysAdmin", vars.$lo_ucapex) > 0 && !funcs.nullsub(vars.$G_ess, false)) ||
        funcs.index("KMAdmin", vars.$lo_ucapex) > 0 ||
        operatorName == "scheduler" || operatorName == "external" || operatorName == "KMUpdate") {
        // Give the admin all capabilities in the KM admin profile.
        var kmprofile = new SCFile("kmprofile");
        if (kmprofile.doSelect("name = \"" + KMADMIN + "\"") == RC_SUCCESS) {
            updateProfile(vars.$G_km_environment, kmprofile);
        }
        // Cannot find KM admin record, so set every capability to true.
        else {
            initProfile(vars.$G_km_environment, true);
        }

        vars.$G_approvedquery = "status=\"internal\" or status=\"external\"";
        vars.$G_maintainDocQuery = "true";
        vars.$G_inboxAppIntCM = "true";
        vars.$G_appextQuery = "true";
        vars.$G_appImmedIntQuery = "true";
        vars.$G_appImmedIntExtQuery = "true";
        vars.$G_inboxAppExtCM = "true";
        vars.$G_editinplacequery = "true";
        vars.$G_viewAdaptiveQuery = "true";
        vars.$G_editAdaptiveQuery = "true";
        vars.$G_wcquery = "status isin {\"workingcopy\",\"revise\",\"review\",\"conclude\",\"triage\"}";
        vars.$G_inboxquery = "status isin {\"workingcopy\",\"revise\",\"review\",\"conclude\",\"triage\"}";
        vars.$G_retiredquery = "status=\"retired\"";
        if (vars.$G_km_environment.any_draft) {
            vars.$G_draftquery = "status=\"draft\"";
        }

        return; // Return all empty category lists; user sees all cats
    }

    // The operator groups will be stored in groupArray.
    var groupArray = new SCDatum();
    groupArray.setType(8); // An array is type 8

    // Set the groupArray equal to the operator record if the operator record is not empty
    if (operatorFile.kmgroup != null && funcs.type(operatorFile.kmgroup) == 8) {
        groupArray = funcs.denull(operatorFile.kmgroup); // Remove blank entries, too.
    }

    // Convert the names to ids

    // If allow access is set in the km environment record; add the "Default Knowledge View Group" with id "KMG01"
    if (allow_access) {
        // Make sure the kmgroup with id KMG01 exists; print a message if not
        /**QCCR1E101184, SM934, dengxin
         **add readonly for doselect, and add the selected fields.
         */
        var aFile = new SCFile("kmgroup", SCFILE_READONLY);
        aFile.setFields(["id"]);
        //QCCR1E101184, end

        if (aFile.doSelect("id=\"KMG01\"") != RC_SUCCESS) {
            print(funcs.scmsg(2, "km"));
        } else if (funcs.index("KMG01", groupArray) == 0) {
            groupArray = funcs.insert(groupArray, 0, 1, "KMG01");
        }
    }

    // Since the kmgroup file may not match the operator record, look there for more groups
    //  that the operator belongs to.
    /**QCCR1E101184, SM934, dengxin
     **add readonly for doselect, and add the selected fields.
     */
    var chkGroupFile = new SCFile("kmgroup", SCFILE_READONLY);

    //	chkGroupFile.setFields("id");
    //	rc = chkGroupFile.doSelect("operators = \"" + operatorName + "\"");  
    rc = chkGroupFile.doSelect('SELECT id FROM kmgroup WHERE (operators = "' + operatorName + '")');

    while (rc == RC_SUCCESS) {
        if (funcs.index(chkGroupFile.id, groupArray) == 0) {
            groupArray = funcs.insert(groupArray, 0, 1, chkGroupFile.id);
        }
        rc = chkGroupFile.getNext();
    }

    // If the operator still has no kmgroups, then he's not authorized.
    if (groupArray.length() == 0) {
        // Call initProfile to give the user no capabilities.
        initProfile(vars.$G_km_environment, false);
        return; // Return all empty category lists and a profile of false settings.
    }

    // Loop through each kmgroup
    // Add the capabilities for the kmprofiles that are found in the kmgroup-kmprofile-kmcategory mapping.
    // Also add categories to all those global arrays.

    // Init every capability to false so we have no null values after the capabilities with a "true"
    //  setting are applied.
    initProfile(vars.$G_km_environment, false);

    var arrayArgs;

    // Read all the profile records in the database. This should be very few.	
    var kmprofileFile = new SCFile("kmprofile");
    if (kmprofileFile.doSelect("true") != RC_SUCCESS && getLastRC() != RC_SUCCESS) {
        arrayArgs = new SCDatum();
        arrayArgs.setType(8); //type array
        arrayArgs.push("kmprofile");
        arrayArgs.push(RCtoString(getLastRC()));

        print(funcs.scmsg(192, "km", arrayArgs)); // Error reading kmprofile file with return code %S.
        // Call initProfile to give the user no capabilities.
        initProfile(vars.$G_km_environment, false);
        return; // Return all empty category lists and a profile of false settings.
    } else {
        // Read the kmcategory records associated with all of the groups that this user belongs to.
        var whereClause = "kmgroup = \"" + groupArray[0] + "\"";
        var i;
        var j;
        var gLength = groupArray.length();
        for (j = 1; j < gLength; j++) {
            whereClause += " or kmgroup = \"" + groupArray[j] + "\"";
        }

        // Read all the category records for this group.	
        var catFile = new SCFile("kmcategory", SCFILE_READONLY);
        catFile.setFields(["id", "name", "pathid", "pathname", "permission"]);
        rc = catFile.doSelect(whereClause);
        if (rc == RC_SUCCESS) {
            while (rc == RC_SUCCESS) // While loop through all the categories for the user's kmgroups.
            {
                var catFilePermissions = catFile.permission;
                // Determine the groups for this user that are in this category's permissions,  
                //   and then for each group, which profile is associated with the group. 
                // For a profile associated with the group, find the profile in the kmprofileFile  
                //  SQL buffer and check the checkbox settings to see if these are set: 
                //  approve int/ext, view int/ext, contrib, retire, modify, revert, delete, etc
                var pIndex;
                var pLength = catFilePermissions.length();
                for (pIndex = 0; pIndex < pLength; pIndex++) // Loop thru kmgroups for this cat
                {
                    for (i = 0; i < gLength; i++) {
                        if (groupArray[i] == catFilePermissions[pIndex].kmgroup) {
                            // This profile has the kmgroup in it. Get the full path id.
                            // The pathid field KMCAT1>KMCAT2>KMCAT3 does not includes this category KMCAT4
                            fullpathid = catFile.id; // in case top level
                            fullpathname = catFile.name; // in case top level
                            if (catFile.pathid != null && catFile.pathid != "") {
                                fullpathid = catFile.pathid + ">" + catFile.id; // e.g.,KMCAT1>KMCAT2>KMCAT3 + > + KMCAT4						
                                fullpathname = catFile.pathname + " > " + catFile.name; // e.g.,Cakes > Fudgey + > + Brownie						
                            }
                            fullpathid = fullpathid.replace(reg, ":");

                            // Find the profile record in the kmprofile SQL result buffer based on the profile id.
                            var rcode = kmprofileFile.getFirst();
                            while (rcode == RC_SUCCESS) // Loop through all the profiles to find the profile for this category.
                            {
                                if (kmprofileFile.id != catFilePermissions[pIndex].kmprofile) {
                                    rcode = kmprofileFile.getNext();
                                } else {
                                    // Determine permissions and combinations of permissions.
                                    updateProfile(vars.$G_km_environment, kmprofileFile);
                                    if (kmprofileFile.internal && kmprofileFile.external) {
                                        appintext.push(fullpathid); // The user's profile has internal and external in this cat.							
                                    }

                                    if (kmprofileFile.internal && !kmprofileFile.external) {
                                        appintid.push(catFile.id); //	For the wizard selection in Contribute documents
                                        appint.push(fullpathid); // The user's profile has internal only in this cat.							
                                    }

                                    if (kmprofileFile.ext_immediate) {
                                        appImmedIntExt.push(fullpathid); // The user's profile has approve internal and external immediately in this cat.							
                                    }

                                    if (kmprofileFile.int_immediate) {
                                        appImmedInt.push(fullpathid); // The user's profile has approve internal immediately in this cat.							
                                    }

                                    if (kmprofileFile.external) {
                                        appextid.push(catFile.id); //	For the wizard selection in Contribute documents
                                        appext.push(fullpathid); // The user's profile has external; we need this for Approve Ext menu item							
                                    }

                                    if (kmprofileFile.edit_in_place) {
                                        editinplace.push(fullpathid); // The user's profile has edit in place; use this for Approval lists off menu and for search results							
                                    }

                                    if (kmprofileFile.view_adaptive_learning) {
                                        viewAdaptive.push(fullpathid); // The user's profile has view adaptive learning; use this anyplace that approved kmdocuments are viewed or edited
                                    }

                                    if (kmprofileFile.edit_adaptive_learning) {
                                        editAdaptive.push(fullpathid); // The user's profile has edit adaptive learning; use this anyplace that existing kmdocuments are viewed or edited	
                                    }

                                    if (kmprofileFile.internal) {
                                        filterAppWcRet.push(fullpathid); // The user's profile has internal; use this for Approval/WC/Retired lists off menu							
                                    }

                                    if (kmprofileFile.edit_in_workflow) {
                                        filterEditInChm.push(fullpathid); // The user's profile has edit.in.workflow; use this for Edit Document menu item in ChM							
                                        chmcatid.push(catFile.id); //	For the wizard selection in Search workingcopy documents - SPARKS Incident # 4000075647
                                    }

                                    if (kmprofileFile.contribute) {
                                        contrib.push(fullpathid); // The user's profile has contribute.							
                                        contribid.push(catFile.id); //	For the wizard selection in Contribute documents				

                                        contribname.push(fullpathname);
                                    }

                                    if (kmprofileFile.view_all) {
                                        viewwc.push(fullpathid); // The user's profile can view workingcopy.
                                        if (funcs.index(catFile.id, viewid) == 0) {
                                            viewid.push(catFile.id); //	For the wizard selection in Adv Search				
                                            viewname.push(fullpathname);
                                        }
                                    }

                                    if (kmprofileFile.view_int_ext) {
                                        viewintext.push(fullpathid); // The user's profile has view int and ext.
                                        viewext.push(fullpathid);
                                        if (funcs.index(catFile.id, viewid) == 0) {
                                            viewid.push(catFile.id); //	For the wizard selection in Adv Search				
                                            viewname.push(fullpathname);
                                        }
                                    }

                                    if (kmprofileFile.view_ext && !kmprofileFile.view_int_ext) {
                                        viewext.push(fullpathid); // The user's profile has view external only.
                                        if (funcs.index(catFile.id, viewid) == 0) {
                                            viewid.push(catFile.id); //	For the wizard selection in Adv Search				
                                            viewname.push(fullpathname);
                                        }
                                    }

                                    if (kmprofileFile.retire) {
                                        retire.push(fullpathid); // The user's profile has retire.							
                                    }

                                    if (kmprofileFile.delete_doc) {
                                        deleteCats.push(fullpathid); // The user's profile has delete a retired doc.							
                                    }


                                    break; // break out of while loop since matching profile was found
                                } // end else to determine perissions for this profile and group
                            } // end while loop through all the profiles to find the profile for this group and category.
                            break; // break out of for loop since matching group was found
                        }
                    } // end loop thru kmgroups for this permission in category
                } // end for loop through all the groups and their associated profiles in kmcategory permissions
                rc = catFile.getNext();

            } // end while loop through all the categories for the user's kmgroups
        } // end if read of all the category records for this group.succeeded
        else {
            if (rc != RC_NO_MORE) // If the error is not "No more records found", print error message
            {
                arrayArgs = new SCDatum();
                arrayArgs.setType(8); //type array
                arrayArgs.push("kmcategory");
                arrayArgs.push(RCtoString(getLastRC()));

                print(funcs.scmsg(192, "km", arrayArgs)); // Error reading kmcategory file with return code %S.

                // Call initProfile to give the user no capabilities.
                initProfile(vars.$G_km_environment, false);
                return; // Return all empty category lists and a profile of false settings.
            }
        }
    }

    // For Advanced Search and the "KM choose search kmcategory" wizard
    vars.$G_viewid = viewid;
    vars.$G_viewname = viewname; // may not ever use name

    // The $G.kmSearchList is blank for an admin, and otherwise looks like this:
    // KMCAT0001:KMCAT0002:KMCAT0003:KMCAT0004,workingcopy;KMCAT0001,external:internal;KMCAT0005:KMCAT0006,external;	
    vars.$G_kmSearchList = "";

    vars.$G_inboxquery = "status isin {\"workingcopy\",\"revise\",\"review\",\"conclude\",\"triage\"} and (assignedEditor =\"" + operatorName + "\" or documentOwner=\"" + operatorName + "\" or author=\"" + operatorName + "\"";
    vars.$G_wcquery = "status isin {\"workingcopy\",\"revise\",\"review\",\"conclude\",\"triage\"} and (assignedEditor =\"" + operatorName + "\" or documentOwner=\"" + operatorName + "\" or author=\"" + operatorName + "\"";

    var arrayLength = filterEditInChm.length();
    var m; // counter
    vars.$G_filterEditInChm = new Array(arrayLength);
    for (m = 0; m < arrayLength; m++) {
        fullpathid = filterEditInChm.pop();
        fullpathid = fullpathid.replace(reg, ":");
        vars.$G_filterEditInChm[m] = fullpathid;
        if (m == 0) {
            vars.$G_filterEditInChm = "(categories in $L.file)#\"" + fullpathid + "\"";
        } else {
            vars.$G_filterEditInChm += " or (categories in $L.file)#\"" + fullpathid + "\"";
        }
    }
    if (vars.$G_filterEditInChm == "") {
        vars.$G_filterEditInChm = "false";
    } else {
        vars.$G_filterEditInChm += ")"; // close off the query OR conditions
    }

    // The queries are so the Approved document, and Change Queue/ Document Queue filter by cat permissions
    arrayLength = filterAppWcRet.length();
    vars.$G_filterAppWcRet = new Array(arrayLength);
    for (m = 0; m < arrayLength; m++) {
        fullpathid = filterAppWcRet.pop();
        fullpathid = fullpathid.replace(reg, ":");
        vars.$G_filterAppWcRet[m] = fullpathid;
        if (m == 0) {
            vars.$G_approvedquery = "(status=\"internal\" or status=\"external\") and (categories#\"" + fullpathid + "\"";
            vars.$G_maintainDocQuery += "(categories in $L.file)#\"" + fullpathid + "\"";
            vars.$G_inboxAppIntCM = "(categories in $L.file)#\"" + fullpathid + "\"";
        } else {
            vars.$G_approvedquery += " or categories#\"" + fullpathid + "\"";
            vars.$G_maintainDocQuery += " or (categories in $L.file)#\"" + fullpathid + "\"";
            vars.$G_inboxAppIntCM += " or (categories in $L.file)#\"" + fullpathid + "\"";
        }
        vars.$G_inboxquery += " or categories#\"" + fullpathid + "\"";
        vars.$G_wcquery += " or categories#\"" + fullpathid + "\"";
    }

    if (vars.$G_approvedquery == "") {
        vars.$G_approvedquery = "false";
    } else {
        vars.$G_approvedquery += ")"; // close off the query OR conditions
    }

    if (vars.$G_maintainDocQuery == "") {
        vars.$G_maintainDocQuery = "false";
    }

    if (vars.$G_inboxAppIntCM == "") {
        vars.$G_inboxAppIntCM = "false";
    }

    if (vars.$G_wcquery == "") {
        vars.$G_wcquery = "false";
    } else {
        vars.$G_wcquery += ")"; // close off the query OR conditions
    }

    if (vars.$G_inboxquery == "") {
        vars.$G_inboxquery = "false";
    } else {
        vars.$G_inboxquery += ")"; // close off the query OR conditions
    }

    // This array ensures that the Approve External menu item appears for the correct doc categories
    arrayLength = appext.length();
    vars.$G_appext = new Array(arrayLength);
    for (m = 0; m < arrayLength; m++) {
        fullpathid = appext.pop();
        fullpathid = fullpathid.replace(reg, ":");
        vars.$G_appext[m] = fullpathid;
        if (m == 0) {
            vars.$G_appextQuery += "(categories in $L.file)#\"" + fullpathid + "\"";
            vars.$G_inboxAppExtCM = "(categories in $L.file)#\"" + fullpathid + "\"";
        } else {
            vars.$G_appextQuery += " or (categories in $L.file)#\"" + fullpathid + "\"";
            vars.$G_inboxAppExtCM += " or (categories in $L.file)#\"" + fullpathid + "\"";
        }
    }

    if (vars.$G_appextQuery == "") {
        vars.$G_appextQuery = "false";
    }

    if (vars.$G_inboxAppExtCM == "") {
        vars.$G_inboxAppExtCM = "false";
    }

    // This array ensures that the Approve Immediately External menu item appears for a doc based on the doc's categroies
    arrayLength = appImmedIntExt.length();
    vars.$G_appImmedIntExt = new Array(arrayLength);
    for (m = 0; m < arrayLength; m++) {
        fullpathid = appImmedIntExt.pop();
        fullpathid = fullpathid.replace(reg, ":");
        vars.$G_appImmedIntExt[m] = fullpathid; // Do we need this?
        if (m == 0) {
            vars.$G_appImmedIntExtQuery += "(categories in $L.file)#\"" + fullpathid + "\"";
        } else {
            vars.$G_appImmedIntExtQuery += " or (categories in $L.file)#\"" + fullpathid + "\"";
        }
    }
    if (vars.$G_appImmedIntExtQuery == "") {
        vars.$G_appImmedIntExtQuery = "false";
    }

    // This array ensures that the Approve Immediately Internal menu item appears for a doc based on the doc's categroies
    arrayLength = appImmedInt.length();
    vars.$G_appImmedInt = new Array(arrayLength);
    for (m = 0; m < arrayLength; m++) {
        fullpathid = appImmedInt.pop();
        fullpathid = fullpathid.replace(reg, ":");
        vars.$G_appImmedInt[m] = fullpathid; // Do we need this?
        if (m == 0) {
            vars.$G_appImmedIntQuery += "(categories in $L.file)#\"" + fullpathid + "\"";
        } else {
            vars.$G_appImmedIntQuery += " or (categories in $L.file)#\"" + fullpathid + "\"";
        }
    }
    if (vars.$G_appImmedIntQuery == "") {
        vars.$G_appImmedIntQuery = "false";
    }

    arrayLength = appintext.length();
    vars.$G_appintext = new Array(arrayLength);
    for (m = 0; m < arrayLength; m++) {
        fullpathid = appintext.pop();
        fullpathid = fullpathid.replace(reg, ":");
        vars.$G_appintext[m] = fullpathid;
    }

    arrayLength = appint.length();
    vars.$G_appint = new Array(arrayLength);
    for (m = 0; m < arrayLength; m++) {
        fullpathid = appint.pop();
        fullpathid = fullpathid.replace(reg, ":");
        vars.$G_appint[m] = fullpathid;
    }
    vars.$G_appintid = appintid;
    vars.$G_appextid = appextid;
    vars.$G_chmcatid = chmcatid;

    arrayLength = editinplace.length();
    vars.$G_editinplace = new Array(arrayLength);
    for (m = 0; m < arrayLength; m++) {
        fullpathid = editinplace.pop();
        fullpathid = fullpathid.replace(reg, ":");
        vars.$G_editinplace[m] = fullpathid;

        if (m == 0) {
            vars.$G_editinplacequery = "edit.in.place in $G.km.environment and ((categories in $L.file)#\"" + fullpathid + "\"";
        } else {
            vars.$G_editinplacequery += " or (categories in $L.file)#\"" + fullpathid + "\"";
        }
    }

    if (vars.$G_editinplacequery == "") {
        vars.$G_editinplacequery = "false";
    } else {
        vars.$G_editinplacequery += ")"; // close off the query OR conditions
    }

    arrayLength = viewAdaptive.length();
    vars.$G_viewAdaptive = new Array(arrayLength);
    for (m = 0; m < arrayLength; m++) {
        fullpathid = viewAdaptive.pop();
        fullpathid = fullpathid.replace(reg, ":");

        if (m == 0) {
            vars.$G_viewAdaptiveQuery = "view.adaptive.learning in $G.km.environment and ((categories in $L.file)#\"" + fullpathid + "\"";
        } else {
            vars.$G_viewAdaptiveQuery += " or (categories in $L.file)#\"" + fullpathid + "\"";
        }
    }

    if (vars.$G_viewAdaptiveQuery == "") {
        vars.$G_viewAdaptiveQuery = "false";
    } else {
        vars.$G_viewAdaptiveQuery += ")"; // close off the query OR conditions
    }

    arrayLength = editAdaptive.length();
    vars.$G_editAdaptive = new Array(arrayLength);
    for (m = 0; m < arrayLength; m++) {
        fullpathid = editAdaptive.pop();
        fullpathid = fullpathid.replace(reg, ":");
        vars.$G_editAdaptive[m] = fullpathid;

        if (m == 0) {
            vars.$G_editAdaptiveQuery = "edit.adaptive.learning in $G.km.environment and ((categories in $L.file)#\"" + fullpathid + "\"";
        } else {
            vars.$G_editAdaptiveQuery += " or (categories in $L.file)#\"" + fullpathid + "\"";
        }
    }

    if (vars.$G_editAdaptiveQuery == "") {
        vars.$G_editAdaptiveQuery = "false";
    } else {
        vars.$G_editAdaptiveQuery += ")"; // close off the query OR conditions
    }

    arrayLength = contrib.length();
    vars.$G_contrib = new Array(arrayLength);
    vars.$G_contribid = new Array(arrayLength);
    vars.$G_contribname = new Array(arrayLength);
    for (m = 0; m < arrayLength; m++) {
        fullpathid = contrib.pop();
        fullpathid = fullpathid.replace(reg, ":");
        vars.$G_contrib[m] = fullpathid;
        id = contribid.pop();
        vars.$G_contribid[m] = id;
        fullpathname = contribname.pop();
        vars.$G_contribname[m] = fullpathname;
    }

    var intExtStats = "external:internal";
    arrayLength = viewintext.length();
    vars.$G_viewintext = new Array(arrayLength);
    for (m = 0; m < arrayLength; m++) {
        fullpathid = viewintext.pop();
        fullpathid = fullpathid.replace(reg, ":");
        vars.$G_viewintext[m] = fullpathid;
        vars.$G_kmSearchList += fullpathid + "," + intExtStats + ";";
    }

    // do we need the array, or just the rtnString?
    var wcStats = "workingcopy";
    arrayLength = viewwc.length();
    vars.$G_viewwc = new Array(arrayLength);
    for (m = 0; m < arrayLength; m++) {
        fullpathid = viewwc.pop();
        fullpathid = fullpathid.replace(reg, ":");
        vars.$G_viewwc[m] = fullpathid;
        vars.$G_kmSearchList += fullpathid + "," + wcStats + ";";
    }

    var extStats = "external";
    arrayLength = viewext.length();
    vars.$G_viewext = new Array(arrayLength);
    for (m = 0; m < arrayLength; m++) {
        fullpathid = viewext.pop();
        fullpathid = fullpathid.replace(reg, ":");
        vars.$G_viewext[m] = fullpathid;
        vars.$G_kmSearchList += fullpathid + "," + extStats + ";";
    }

    arrayLength = retire.length();
    vars.$G_retire = new Array(arrayLength);
    for (m = 0; m < arrayLength; m++) {
        fullpathid = retire.pop();
        fullpathid = fullpathid.replace(reg, ":");
        vars.$G_retire[m] = fullpathid;
        if (m == 0) {
            vars.$G_retiredquery = "status=\"retired\" and (categories#\"" + fullpathid + "\"";
        } else {
            vars.$G_retiredquery += " OR categories#\"" + fullpathid + "\"";
        }
    }
    if (vars.$G_retiredquery == "") {
        vars.$G_retiredquery = "false";
    } else {
        vars.$G_retiredquery += ")"; // close off the query OR conditions
    }

    arrayLength = deleteCats.length();
    vars.$G_deleteCats = new Array(arrayLength);
    for (m = 0; m < arrayLength; m++) {
        fullpathid = deleteCats.pop();
        fullpathid = fullpathid.replace(reg, ":");
        vars.$G_deleteCats[m] = fullpathid;
        if (m == 0) {
            vars.$G_deleteCatsQuery = "categories in $L.file#\"" + fullpathid + "\"";
        } else {
            vars.$G_deleteCatsQuery += " OR categories in $L.file#\"" + fullpathid + "\"";
        }
    }
    if (vars.$G_deleteCatsQuery == "") {
        vars.$G_deleteCatsQuery = "false";
    }

    return true;
}

// This function initializes each boolean in the profile record to the TFValue
//   e.g., to all false in case there's no operator record or to all true if the user is an admin
function initProfile(record, TFValue) {
    record.admin_search_all = TFValue;
    record.adv_search = TFValue;
    record.any_draft = TFValue;
    record.archive_feedback = TFValue;
    record.browse = TFValue;
    record.configure_hit_list = TFValue;
    record.contribute = TFValue;
    record.cpyopn = TFValue;
    record.delete_doc = TFValue;
    record.delete_feedback = TFValue;
    record.doctypes = TFValue;
    record.edit_adaptive_learning = TFValue;
    record.edit_in_place = TFValue;
    record.edit_in_workflow = TFValue;
    record.environment_profiles = TFValue;
    record.ext_immediate = TFValue;
    record.external = TFValue;
    record.feedback = TFValue;
    record.int_immediate = TFValue;
    record.integration_mapping = TFValue;
    record.internal = TFValue;
    record.knowledgebases = TFValue;
    record.manage_categories = TFValue;
    record.modify = TFValue;
    record.retire = TFValue;
    record.revert = TFValue;
    record.save_draft = TFValue;
    record.search = TFValue;
    record.shared_content = TFValue;
    record.unretire = TFValue;
    record.view_adaptive_learning = TFValue;
    record.view_all = TFValue;
    record.view_ext = TFValue;
    record.view_feedback = TFValue;
    record.view_int_ext = TFValue;
    record.view_kcs_reports = TFValue;
    record.find = TFValue;
    record.fill = TFValue;
    record.count = TFValue;
}

// This function sets all the true (checkbox) settings in the profile record to true in the recordToUpdate
function updateProfile(recordToUpdate, profile) {

    if (profile.admin_search_all != null && profile.admin_search_all) {
        recordToUpdate.admin_search_all = true;
    }
    if (profile.adv_search != null && profile.adv_search) {
        recordToUpdate.adv_search = true;
    }
    if (profile.any_draft != null && profile.any_draft) {
        recordToUpdate.any_draft = true;
    }
    if (profile.archive_feedback != null && profile.archive_feedback) {
        recordToUpdate.archive_feedback = true;
    }
    if (profile.browse != null && profile.browse) {
        recordToUpdate.browse = true;
    }
    if (profile.configure_hit_list != null && profile.configure_hit_list) {
        recordToUpdate.configure_hit_list = true;
    }
    if (profile.contribute != null && profile.contribute) {
        recordToUpdate.contribute = true;
    }
    if (profile.cpyopn != null && profile.cpyopn) {
        recordToUpdate.cpyopn = true;
    }
    if (profile.delete_doc != null && profile.delete_doc) {
        recordToUpdate.delete_doc = true;
    }
    if (profile.delete_feedback != null && profile.delete_feedback) {
        recordToUpdate.delete_feedback = true;
    }
    if (profile.doctypes != null && profile.doctypes) {
        recordToUpdate.doctypes = true;
    }
    if (profile.edit_adaptive_learning != null && profile.edit_adaptive_learning) {
        recordToUpdate.edit_adaptive_learning = true;
    }
    if (profile.edit_in_place != null && profile.edit_in_place) {
        recordToUpdate.edit_in_place = true;
    }
    if (profile.edit_in_workflow != null && profile.edit_in_workflow) {
        recordToUpdate.edit_in_workflow = true;
    }
    if (profile.environment_profiles != null && profile.environment_profiles) {
        recordToUpdate.environment_profiles = true;
    }
    if (profile.ext_immediate != null && profile.ext_immediate) {
        recordToUpdate.ext_immediate = true;
    }
    if (profile.external != null && profile.external) {
        recordToUpdate.external = true;
    }
    if (profile.feedback != null && profile.feedback) {
        recordToUpdate.feedback = true;
    }
    if (profile.int_immediate != null && profile.int_immediate) {
        recordToUpdate.int_immediate = true;
    }
    if (profile.integration_mapping != null && profile.integration_mapping) {
        recordToUpdate.integration_mapping = true;
    }
    if (profile.internal != null && profile.internal) {
        recordToUpdate.internal = true;
    }
    if (profile.knowledgebases != null && profile.knowledgebases) {
        recordToUpdate.knowledgebases = true;
    }
    if (profile.manage_categories != null && profile.manage_categories) {
        recordToUpdate.manage_categories = true;
    }
    if (profile.modify != null && profile.modify) {
        recordToUpdate.modify = true;
    }
    if (profile.retire != null && profile.retire) {
        recordToUpdate.retire = true;
    }
    if (profile.revert != null && profile.revert) {
        recordToUpdate.revert = true;
    }
    if (profile.save_draft != null && profile.save_draft) {
        recordToUpdate.save_draft = true;
    }
    if (profile.search != null && profile.search) {
        recordToUpdate.search = true;
    }
    if (profile.shared_content != null && profile.shared_content) {
        recordToUpdate.shared_content = true;
    }
    if (profile.unretire != null && profile.unretire) {
        recordToUpdate.unretire = true;
    }
    if (profile.view_adaptive_learning != null && profile.view_adaptive_learning) {
        recordToUpdate.view_adaptive_learning = true;
    }
    if (profile.view_all != null && profile.view_all) {
        recordToUpdate.view_all = true;
    }
    if (profile.view_ext != null && profile.view_ext) {
        recordToUpdate.view_ext = true;
    }
    if (profile.view_feedback != null && profile.view_feedback) {
        recordToUpdate.view_feedback = true;
    }
    if (profile.view_int_ext != null && profile.view_int_ext) {
        recordToUpdate.view_int_ext = true;
    }
    if (profile.view_kcs_reports != null && profile.view_kcs_reports) {
        recordToUpdate.view_kcs_reports = true;
    }
    if (profile.find != null && profile.find) {
        recordToUpdate.find = true;
    }
    if (profile.fill != null && profile.fill) {
        recordToUpdate.fill = true;
    }
    if (profile.count != null && profile.count) {
        recordToUpdate.count = true;
    }
}

// This function returns true if a user can search the kmdocument KB, and false if not
function kbname_canSearchKB() {
    return canProfileSearchKB(vars.$G_km_environment);
}


function canProfileSearchKB(kmprofile) {
    return (kmprofile.search || kmprofile.adv_search || kmprofile.admin_search_all);
}


/*
 *	This function is the script called by the search engine to determine which categories 
 *	a user can search and view with which statuses. i.e., external, internal, or workingcopy.
 * This function returns:
 * 	if the user is an admin: "" with no categories since the admin can see all categories
 *	if the user has no access: this function should not be called; a return of "no access" will cause the search to fail which is good
 *	if the user has access, a string like this is returned:
 * KMCAT0001:KMCAT0002:KMCAT0003:KMCAT0004,workingcopy;KMCAT0001,external:internal;KMCAT0005:KMCAT0006,external;
 */
function kbname_kmsearchsecurity(operatorName) {
    // Is this user an admin? if so, return empty stuff (the admin will see draft and retired if indexed, too)

    var rtnString = "";

    // Check if this user is an admin.
    // The operator cap.exec array settings indicate admin permissions
    // When virtual agent, do not check cap.exec as it works as ESS
    if (!vars["$G.virtualagent"] && (funcs.index("SysAdmin", vars.$lo_ucapex) > 0 ||
            funcs.index("KMAdmin", vars.$lo_ucapex) > 0 ||
            vars.$G_km_environment.admin_search_all)) {

        rtnString = ""; // Spelling it out here.	
        return rtnString; // Return the statuses that an admin can see with no categories
    }

    return vars.$G_kmSearchList; // calculated when the user logs in in KMSecurity.getCatsAtLogin
}

/**
 *  Get the value of KM search list for Virtual Agent for IDOL Search
 *  The function is implemented referred to KMSecurity.getCatsAtLogin
 *   and thevalue should be same.
 *  It will be used by KMSecurity.kbname_kmsearchsecurity
 *  Parameters:
 *      name - the operator's login name
 *      allowAccess - allow to use KM search
 *  Return: the value of KM search list
 */
function getOperatorKMSearchList(name, allowAccess) {
    if (!name) {
        return "";
    }

    var groupArray = [];
    var kmgroup = new SCFile("kmgroup", SCFILE_READONLY);
    kmgroup.setFields(["id"]);
    var rc = kmgroup.doSelect("operators=\"" + name + "\"");
    while (rc == RC_SUCCESS) {
        groupArray.push(kmgroup["id"]);
        rc = kmgroup.getNext();
    }
    if (allowAccess && !groupArray.includes("KMG01")) {
        groupArray.push("KMG01");
    }
    if (groupArray.length == 0) {
        return "";
    }

    var kmprofile = new SCFile("kmprofile", SCFILE_READONLY);
    kmprofile.setFields(["id", "view.int.ext", "view.all", "view.ext"]);
    rc = kmprofile.doSelect("true");
    var kmprofileMap = {};
    while (rc == RC_SUCCESS) {
        kmprofileMap[kmprofile["id"]] = {};
        if (kmprofile["view.int.ext"]) {
            kmprofileMap[kmprofile["id"]]["view.int.ext"] = kmprofile["view.int.ext"];
        }
        if (kmprofile["view.all"]) {
            kmprofileMap[kmprofile["id"]]["view.all"] = kmprofile["view.all"];
        }
        if (kmprofile["view.ext"]) {
            kmprofileMap[kmprofile["id"]]["view.ext"] = kmprofile["view.ext"];
        }
        rc = kmprofile.getNext();
    }

    var viewintext = [];
    var viewwc = [];
    var viewext = [];

    var whereClause = "kmgroup isin {\"" + groupArray.join("\",\"") + "\"}";
    var kmcategory = new SCFile("kmcategory", SCFILE_READONLY);
    kmcategory.setFields(["permission", "id", "pathid"]);
    rc = kmcategory.doSelect(whereClause);
    var i;
    var pLength;
    var fullpathid;
    while (rc == RC_SUCCESS) {
        if (kmcategory["permission"] != null) {
            pLength = kmcategory["permission"].length();
            for (i = 0; i < pLength; i++) {
                if (groupArray.includes(kmcategory["permission"][i]["kmgroup"])) {
                    kmprofile = kmprofileMap[kmcategory["permission"][i]["kmprofile"]];
                    if (kmprofile) {
                        fullpathid = kmcategory["id"];
                        if (kmcategory["pathid"] != null && kmcategory["pathid"] != "") {
                            fullpathid = kmcategory["pathid"] + ">" + kmcategory["id"];
                        }
                        fullpathid = fullpathid.replace(reg, ":");

                        if (kmprofile["view.int.ext"]) {
                            viewintext.push(fullpathid);
                            viewext.push(fullpathid);
                        } else if (kmprofile["view.ext"]) {
                            viewext.push(fullpathid);
                        }

                        if (kmprofile["view.all"]) {
                            viewwc.push(fullpathid);
                        }
                    }
                }
            }
        }
        rc = kmcategory.getNext();
    }

    return getSearchList(viewintext, "external:internal") + getSearchList(viewwc, "workingcopy") + getSearchList(viewext, "external");
}

// Return constructed KM search list for different stats
// Used by getOperatorKMSearchList
function getSearchList(array, stats) {
    if (!array) {
        return "";
    }

    var searchList = "";
    var length = array.length;
    var i;
    for (i = 0; i < length; i++) {
        searchList += array[i].replace(reg, ":") + "," + stats + ";";
    }

    return searchList;
}

/**
 *	This function determines if a user can view a kmdocument and returns T or F
 *	@param  {Object} record - the kmdocument to be viewed
 *	@return Boolean true or false
 */
function doesUserHaveDocViewRights(record) {
    // Ensure that the record is not null
    if (record == null) {
        return false;
    }

    // Check if this user is an admin. Admins can view any kmdocument
    // The operator cap.exec array settings indicate admin permissions
    if (funcs.index("SysAdmin", vars.$lo_ucapex) > 0 ||
        funcs.index("KMAdmin", vars.$lo_ucapex) > 0) {
        return true;
    }

    // Not an admin. Check the user's view external or internal/external rights.
    var fullpathid = "";
    var docCatArrayLength = 0;
    var permCatArrayLength = 0;
    var m;
    var p;
    if (record.status == "internal") {
        permCatArrayLength = vars.$G_viewintext.length();
        // Check if this document's category(s) start with a cat in the vars.$G_viewintext array.
        // OK to view if so
        for (m = 0; m < permCatArrayLength; m++) {
            docCatArrayLength = record.categories.length();
            fullpathid = vars.$G_viewintext[m];
            for (p = 0; p < docCatArrayLength; p++) {
                if (record.categories[p].indexOf(fullpathid) == 0) {
                    return true;
                }
            }
        }
        // Couldn't find the document's category in the view int and ext category array	for this user.
        return false;
    } else if (record.status == "external") {
        permCatArrayLength = vars.$G_viewext.length();
        // Check if this document's category(s) start with a cat in the vars.$G_viewext array.
        // OK to view if so
        for (m = 0; m < permCatArrayLength; m++) {
            docCatArrayLength = record.categories.length();
            fullpathid = vars.$G_viewext[m];
            for (p = 0; p < docCatArrayLength; p++) {
                if (record.categories[p].indexOf(fullpathid) == 0) {
                    return true;
                }
            }
        }
        // Couldn't find the document's category in the view ext category array	for this user.
        return false;
    } else if (record.status == "retired") {
        permCatArrayLength = vars.$G_retire.length();
        print("permCatArrayLength:" + permCatArrayLength);
        // Check if this document's category(s) start with a cat in the vars.$G_retire array.
        // OK to view if so
        for (m = 0; m < permCatArrayLength; m++) {
            docCatArrayLength = record.categories.length();
            fullpathid = vars.$G_retire[m];
            for (p = 0; p < docCatArrayLength; p++) {
                if (record.categories[p].indexOf(fullpathid) == 0) {
                    return true;
                }
            }
        }

        // Couldn't find the document's category in the view ext category array	for this user.
        return false;
    }

    // This function was called with a document status other than internal or external.
    return false;
}

/**
 *	This function returns an array of user logins representing the fields 
 *    to display in the hitlist
 *	@param  {String} categoryName - a string containing the name of a kmcategory 
 *	@return Array
 *   @type String
 */


// for docviews 4-29-06
function getKMGroupsForDocView(record) {
    var kmgroupArray = new Datum();
    kmgroupArray.setType(8); // the array of kmgroups this user belongs to

    // Read the record for the operator who is signed in.
    var operatorName = funcs.operator(); // Get login name from operator() function.
    var opgroups = new Query("kmgroup", new QueryCond("operators", EQ, operatorName));
    var row;
    for (row in opgroups) {
        kmgroupArray.push(opgroups[row].id);
    }

    var envFile = new SCFile("environment", SCFILE_READONLY);
    var rc = envFile.doSelect("name = \"knowledge management\"");
    if (envFile.allow_access) {
        // if the Default Knowledge View Group with id KMG01 is not already in kmgroupArray, add it.
        if (kmgroupArray.length() == 0 ||
            funcs.index(kmgroupArray, "KMG01") < 1) {
            kmgroupArray = funcs.insert(kmgroupArray, 1, 1, "KMG01");
        }
    }

    return kmgroupArray;
}

/**
 *	add for QCCR1E87717, generate query string for published kmdocument searching
 *	Zhang, Ming-Di
 *	2012/11/14
 */
function getCatsQueryForDocument(list) {
    var tmp = list.toArray();
    var q = "";
    if (tmp.length > 0) {
        q += " and ( ";
    } else {
        return " and false";
    }
    var i;
    for (i = 0; i < tmp.length; i++) {
        q += " categories #\"" + tmp[i] + "\"";
        if (i != tmp.length - 1) {
            q += " or ";
        }
    }
    if (tmp.length > 0) {
        q += " ) ";
    }
    return q;
}


/**
 * determin whether has km update capability
 *
 * @param {SCFile} kmprofile
 * @returns {Boolean}
 */
function hasUpdateCapability(kmprofile) {
    if (!kmprofile) {
        return false;
    }

    var fields = [
        "any.draft",
        "archive.feedback",
        "configure.hit.list",
        "contribute",
        "cpyopn",
        "delete.doc",
        "delete.feedback",
        "doctypes",
        "edit.in.workflow",
        "environment.profiles",
        "ext.immediate",
        "external",
        "import",
        "int.immediate",
        "integration.mapping",
        "internal",
        "knowledgebases",
        "manage.categories",
        "modify",
        "retire",
        "revert",
        "save.draft",
        "shared.content",
        "unretire"
    ];

    var i;
    for (i = 0; i < fields.length; i++) {
        if (kmprofile[fields[i]]) {
            return true;
        }
    }

    return false;
}


/**
 * check whether operator can search knowledge base
 *
 * @param {String} opName
 * @returns {Boolean} true if has search permission
 */
function canOperatorSearchKnowledge(opName) {
    /*
     * this function doesn't consider SysAdmin/KMAdmin capability word
     * if using this function in index.do client, need to check capability word outside it.
     */
    var operator = $("!operator").fields("kmgroup").find("name=:name", opName).one();
    if (!operator || !operator.kmgroup) {
        return false;
    }

    var groups = operator.kmgroup.toArray();

    // append "Default Knowledge View Group"
    const defaultGroup = "KMG01";
    if (groups.indexOf(defaultGroup) == -1 && vars.$G_km_globalenv.allow_access) {
        var dg = $("!kmgroup").fields("id").find(`id="${defaultGroup}"`).one();
        if (dg) {
            groups.push(defaultGroup);
        }
    }

    if (groups.length == 0) {
        return false;
    }

    var hasSearchPermission = false;
    var profileSet = new Set();

    // query km category
    var categoryQuery = "kmgroup isin {";
    var i;
    for (i = 0; i < groups.length - 1; i++) {
        categoryQuery += '"' + groups[i] + '",';
    }
    categoryQuery += '"' + groups[groups.length - 1] + '"}';

    $("!kmcategory").fields("permission").find(categoryQuery).each(function(category) {
        if (!category.permission) {
            return false;
        }

        var plength = category.permission.length();
        for (i = 0; i < plength; i++) {
            var permission = category.permission[i];

            if (groups.indexOf(permission.kmgroup) == -1) {
                continue;
            }

            // find match permission {kmprofile, kmgroup}
            var profile = permission.kmprofile;

            // profile without permission already check
            if (profileSet.has(profile)) {
                break;
            }

            if (canProfileSearchKB(profile)) {
                hasSearchPermission = true;
                return true;
            }

            profileSet.add(profile);
        }
    });

    return hasSearchPermission;
}