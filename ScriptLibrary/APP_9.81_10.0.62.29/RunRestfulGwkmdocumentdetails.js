var logger = getLog('RunRestfulGwkmdocumentdetails');
var JSON = lib.JSON.json();
var _null = funcs._null;
var lng = system.functions.lng;
var ArrayUtil = lib.ArrayUtil;
var scmsg = system.functions.scmsg;
var createSCDatumArray = lib.GatewayAPI_Util.createSCDatumArray;
var KMDocPreview = system.library.KMDocPreview;
var KMDocumentAttachment = lib.KMDocumentAttachment;
var str = system.functions.str;
var _ = lib.Underscore.require();
var $ = lib.c.$;

function POST(request, response) {
    retrieveKmDocumentDetail(request, response);
}

function retrieveKmDocumentDetail(request, response) {
    var code;
    var resultStr;
    var reqObj = request.body.gwkmdocumentdetail;
    if (reqObj && reqObj.id) {
        var kmId = reqObj.id;
        var requestOnBehalfUser = reqObj.requestOnBehalfUser;
        var isMobile = reqObj.mobileView;
        var resp = getKmDocumentDetail(kmId, requestOnBehalfUser, isMobile);
        response.status(200).send(resp);
    } else {
        code = 400;
        resultStr = "Bad request payload";
        response.status(200).send({
            "ReturnCode": code,
            "Messages": [resultStr]
        });
    }
}

//getKmDocumentDetail("KM0012R", "", 'false')

function getKmDocumentDetail(kmId, requestOnBehalfUser, isMobile) {
    var kmResponse = {}

    var capability = [];
    var oriOperator = funcs.operator();
    if (requestOnBehalfUser && requestOnBehalfUser != null && oriOperator != requestOnBehalfUser) {
        lib.GatewayAPI_Util.changeUserSession(requestOnBehalfUser);
    }
    var newOperator = funcs.operator();
    capability = lib.GatewayAPI_Cache.getCapabilityWordCache().get(newOperator);
    var canViewKm = false;
    if (system.functions.index("SysAdmin", capability) > 0 || system.functions.index("KMAdmin", capability) > 0) {
        canViewKm = true;
    }
    try {
        var kmRecord = null;
        var kmView = null;
        kmRecord = new SCFile("kmdocument");
        var rc = kmRecord.doSelect('id="' + kmId + '"');
        if (rc == RC_SUCCESS) {
            vars.$L_file = kmRecord;
            //if not sysadmin, get km view permission by km categories/groups
            if (!canViewKm) {
                canViewKm = hasViewKmRecordPermission(kmRecord, newOperator);
            }
            if (canViewKm) {
                //get km view
                var kmView = getKmView(newOperator, kmRecord['doctype'], isMobile);
                //no availalbe km view
                if (_null(kmView)) {
                    var errMsg = "Cannot find available km view for user " + newOperator + " to view km " + kmId;
                    //print(errMsg);
                    logger.error(errMsg);
                    rollBackSessionIfNeeded(newOperator, oriOperator);
                    kmResponse['ReturnCode'] = 403;
                    kmResponse['Messages'] = [errMsg];
                    return kmResponse;
                } else {

                    kmView = KMDocPreview.replaceTokensWithData(kmView, kmRecord);
                    kmView = KMDocPreview.replaceLikeTokensWithData(kmView, kmRecord);
                    kmView = KMDocPreview.replaceSCMSGTokens(kmView);

                    var guidstr = KMDocumentAttachment.getGUIDs(kmId);
                    kmResponse["guids"] = guidstr;
                    var subType = "Article";
                    if (kmRecord['hotnews']) {
                        subType = "News";
                    }
                    kmResponse["id"] = kmId;
                    kmResponse["title"] = kmRecord['title'];
                    kmResponse["summary"] = kmRecord['summary'];
                    kmResponse["docType"] = kmRecord['doctype'];
                    kmResponse["subType"] = subType;
                    kmResponse["content"] = kmView;
                    lib.KMUsageStats.incrementViewCount(kmId, "kmdocument");
                    rollBackSessionIfNeeded(newOperator, oriOperator);

                    return kmResponse;
                }
            } else {
                var kmIdArray = createSCDatumArray();
                kmIdArray.push(kmId);
                var errMsg = scmsg(185, "km", kmIdArray);
                //print(errMsg);
                logger.error(errMsg);
                rollBackSessionIfNeeded(newOperator, oriOperator);
                kmResponse['ReturnCode'] = 403;
                kmResponse['Messages'] = [errMsg];
                return kmResponse;
            }
        } else {
            var errMsg = "Cannot find document of " + kmId;
            //print(errMsg);
            logger.error(errMsg);
            rollBackSessionIfNeeded(newOperator, oriOperator);
            kmResponse['ReturnCode'] = 404;
            kmResponse['Messages'] = [errMsg];
            return kmResponse;
        }
    } catch (er) {
        logger.error(er);
        rollBackSessionIfNeeded(newOperator, oriOperator);
        kmResponse['ReturnCode'] = 400;
        kmResponse['Messages'] = [er];
        return kmResponse;
    }
}

/*****Check km permissions by km groups*****/

function hasViewKmRecordPermission(kmRecord, newOperator) {
    var hasPermission = false;
    var operKMgroups = getCurrentOperatorKmGroups(newOperator);

    var allKMGroups = [];
    var viewAccessType = kmRecord['current.phase'];
    var categoryIds = [];
    for (var i = 0; i < lng(kmRecord['categories']); i++) {
        ArrayUtil.addAllWithoutDuplicate(categoryIds, kmRecord['categories'][i].split(":"));
    }
    allKMGroups = getKMGroupsByKMCategories(categoryIds, viewAccessType);

    //If "Assign the Default Knowledge View Group to all operators" is enabled in environment and if the km contains "Default Knowledge View Group"
    if (vars['$G.km.globalenv']['allow.access'] && ArrayUtil.contains(allKMGroups, "KMG01")) {
        hasPermission = true;
    } else {
        var commonGroups = _.intersection(allKMGroups, operKMgroups);
        if (lng(commonGroups) > 0) {
            hasPermission = true;
        }
    }
    return hasPermission;
}

function getCurrentOperatorKmGroups(newOperator) {
    var newOperatorR = $("operator", SCFILE_READONLY).setFields(["kmgroup"]).select('name="' + newOperator + '"').uniqueResult();
    var operKMgroups = [];
    if (newOperatorR) {
        operKMgroups = newOperatorR.kmgroup.toArray();
    }
    return operKMgroups;
}

function getKMGroupsByKMCategories(categoryIds, viewAccessType) {
    var allGroups = [];
    for (var i = 0; i < lng(categoryIds); i++) {
        ArrayUtil.addAllWithoutDuplicate(allGroups, getKMGroupsByKMCategory(categoryIds[i], viewAccessType));
    }
    return allGroups;
}


function getKMGroupsByKMCategory(categoryId, viewAccessType) {
    var groups = [];
    var query = "id=\"" + categoryId + "\"";
    var kmcategory = new SCFile("kmcategory", SCFILE_READONLY);
    kmcategory.setFields(['permission']);
    if (kmcategory.doSelect(query) === RC_SUCCESS) {
        for (var i = 0; i < lng(kmcategory['permission']); i++) {
            if (KMProfileHasViewAccess(kmcategory['permission'][i]['kmprofile'], viewAccessType) && !ArrayUtil.contains(groups, kmcategory['permission'][i]['kmgroup'])) {
                groups.push(kmcategory['permission'][i]['kmgroup']);
            }
        }
    }
    return groups;
}

function KMProfileHasViewAccess(profileId, viewAccessType) {
    var query = "id=\"" + profileId + "\"";
    var kmprofile = new SCFile("kmprofile", SCFILE_READONLY);
    kmprofile.setFields(['view.int.ext', 'view.ext']);
    if (kmprofile.doSelect(query) === RC_SUCCESS) {
        if (viewAccessType == "internal" && kmprofile['view.int.ext']) {
            return true;
        } else if (viewAccessType == "external" && kmprofile['view.ext']) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

/******************************************************/

/********************Get km html view********************/
function getKmView(newOperator, docType, isMobile) {
    var view = null;
    var kmdoctype = new SCFile("kmdoctype");
    var rc = kmdoctype.doSelect('name="' + docType + '"');
    if (rc == RC_SUCCESS) {
        var views = kmdoctype['format.view'];
        var availableViews = [];
        var availableViewsSeclevel = [];
        var availableViewsName = [];
        var defaultView = null;
        var mobileViews = [];
        var mobileViewsSeclevel = [];
        var mobileViewsObject = [];
        var groups = [];
        for (var v = 0; v < lng(views); v++) {
            if ('Default View' === views[v]['view.name']) {
                defaultView = views[v]['view.data'];
            } else if ('Default Mobile View' === views[v]['view.name']) {// view name is not unique
                mobileViews.push(views[v]['view.data']);
                mobileViewsSeclevel.push(Number(views[v]['view.seclevel']));
                mobileViewsObject.push(views[v]);
            }
            //handle "Default Knowledge View Group" and "Assign the Default Knowledge View Group to all operators" set in km env
            if (ArrayUtil.contains(views[v]['view.roles'], "KMG01") && vars['$G.km.globalenv']['allow.access']) {
                availableViews.push(views[v]['view.data']);
                availableViewsSeclevel.push(Number(views[v]['view.seclevel']));
                availableViewsName.push(views[v]['view.name']);
            } else {
                var operKMgroups = getCurrentOperatorKmGroups(newOperator);
                var commonGroups = _.intersection(views[v]['view.roles'], operKMgroups);
                if (lng(commonGroups) > 0) {
                    availableViews.push(views[v]['view.data']);
                    availableViewsSeclevel.push(Number(views[v]['view.seclevel']));
                    availableViewsName.push(views[v]['view.name']);
                }
            }
        }
        //Mobile view logic
        if ((isMobile === 'true' || isMobile === true)) {
            // "Default Mobile View" exists
            if (!_null(mobileViews) && lng(mobileViews) > 0) {
                // Multi "Default Mobile View" in case
                var mobileViewsWithoutGroup = [];
                var mobileViewsWithoutGroupSeclevel = [];
                // Handle all mobile views which don't have group configured, all users can use this type of mobile views
                for (var m = 0; m < lng(mobileViewsObject); m++) {
                    if (lng(mobileViewsObject[m]['view.roles']) === 0) {
                        mobileViewsWithoutGroup.push(mobileViews[m]);
                        mobileViewsWithoutGroupSeclevel.push(Number(mobileViewsSeclevel[m]));
                    }
                }
                // If there are mobile views which don't have group configured
                // Sort them by Seclevel and return the view with highest Seclevel
                if (lng(mobileViewsWithoutGroup) > 0) {
                    var tempM = new SCDatum(8);
                    tempM.push(mobileViewsWithoutGroup);
                    tempM.push(mobileViewsWithoutGroupSeclevel);
                    var retcodeM;
                    system.functions.rtecall("sort", retcodeM, tempM, 1, 1);
                    mobileViews = tempM[0];
                    return mobileViews.toArray()[0];
                }
                // all mobile views have group configured
                else {
                    // Mobile and browser views get group configured, but current user doesn't have access right for any of them
                    if (lng(availableViews) === 0) {
                        return null;
                    }
                    // Mobile and browser views get group configured, if user has access right to mobile view, return it, otherwise return null.
                    else {
                        var mobileViewsWithGroup = [];
                        var mobileViewsWithGroupSeclevel = [];
                        for (var mm = 0; mm < lng(availableViewsName); mm++) {
                            if ('Default Mobile View' === availableViewsName[mm]) {
                                mobileViewsWithGroup.push(availableViews[mm]);
                                mobileViewsWithGroupSeclevel.push(Number(availableViewsSeclevel[mm]));
                            }
                        }
                        // If there are mobile views which user has access right
                        // Sort them by Seclevel and return the view with highest Seclevel
                        if (lng(mobileViewsWithGroup) > 0) {
                            var tempMM = new SCDatum(8);
                            tempMM.push(mobileViewsWithGroup);
                            tempMM.push(mobileViewsWithGroupSeclevel);
                            var retcodeMM;
                            system.functions.rtecall("sort", retcodeMM, tempMM, 1, 1);
                            mobileViews = tempMM[0];
                            return mobileViews.toArray()[0];
                        } else {
                            return null;
                        }
                    }
                }
            } else {
                return null;
            }
        }
        //Browser: if no available view, pick 'Default View'
        else if (lng(availableViews) === 0) {
            view = defaultView;
        } else {//all the views which current user has access rights
            //Sort views by view.seclevel, system will pick view with highest view.seclevel
            //if no available views, pick "Default View" hard coded
            //sort array a~z
            var temp = new SCDatum(8);
            temp.push(availableViews);
            temp.push(availableViewsSeclevel);
            var retcode;
            system.functions.rtecall("sort", retcode, temp, 1, 1);
            availableViews = temp[0];
            view = availableViews.toArray()[0];
        }
    }
    return view;
}

/******************************************************/

function rollBackSessionIfNeeded(newOperator, oriOperator) {
    if (newOperator != oriOperator) {
        lib.GatewayAPI_Util.changeUserSession(oriOperator);
    }
}

function authorize() {
    return true;
}
