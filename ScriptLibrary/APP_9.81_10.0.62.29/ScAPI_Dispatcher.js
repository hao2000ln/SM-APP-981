/** The interface to each API call for Service Catalog.
*   @author Vinson
*/

var NO_RECORD_EXIT = lib.ScAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.ScAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.ScAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.ScAPI_Util.setExitType;
var setErrorMsg = lib.ScAPI_Util.setErrorMsg;
var index = system.functions.index;
var log = lib.ScAPI_Logger.log("ScAPI_Dispatcher");

function doAction() {
    vars.$G_src = true;
    var s1 = _populateCurrentAPIName();	
    switch (s1) {
		case "denyapproval":
			lib.ScAPI_svcCatApprovals.denyApproval();
			break;
		case "denyallapproval":
			lib.ScAPI_svcCatApprovals.denyApproval("all");
			break;
		case "approveapproval":
			lib.ScAPI_svcCatApprovals.approveApproval();
			break;
		case "approveallapproval":
			lib.ScAPI_svcCatApprovals.approveApproval("all");
			break;
		case "deletecart":
			lib.ScAPI_WSInterface_svcCart.removeCart();
			break;
		case "createcatalog":
			lib.ScAPI_WSInterface_svcCatalogGather.getItem();
			break;
		case "createcatalogbylanguage":
			lib.ScAPI_WSInterface_svcCatalogLanguage.getItem();
			break;
		case "createcatalogdetail":
			lib.ScAPI_WSInterface_svcCatalogDetail.getItem();
			break;
		case "createcatalogorderinfo":
			lib.ScAPI_WSInterface_Order_Info.displayInitOrderInfo();
			break;
		case "createfavoritecatalog":
			lib.ScAPI_WSInterface_svcCatalogFavorite.getItem();
			break;
		case "createinteractionapprovalcount":
			lib.ScAPI_WSInterface_RequestApprovalCount.getCount();
			break;
		case "createinteractioninbox":
			lib.ScAPI_WSInterface_Interaction_Inbox.getInteraction();
			break;
		case "queryinteractioninbox":
			lib.ScAPI_WSInterface_Interaction_Inbox.queryInteraction();
			break;	
		case "createoptionslookup": 
			lib.ScAPI_GetOptionsLookup.getOptionsLookup();
			break;
		case "additemtocartviaorder":
			lib.ScAPI_WSInterface_Add_Item.addItemToCart();
			break;
		case "updateitemincartorder":
			lib.ScAPI_WSInterface_Update_Item.updateItemInCart();
			break;
		case "deleteitemincartorder":
			lib.ScAPI_WSInterface_Update_Item.deleteItemInCart();
			break;
		case "createsubmitcart":
			lib.ScAPI_svcCatRequest.createRequest();
			break;
		case "createsrcinteraction":
		    lib.ScAPI_svcCatRequest.createRequest();
		    break;
		case "createsvccatapprovalinbox":
			lib.ScAPI_svcCatApprovals.getApprovalInbox();
			break;
		case "createsvccatcurrentapprovals":
			lib.ScAPI_svcCatApprovals.getCurrentApprovals();
			break;
		case "cancelsvccatinteraction":
			lib.ScAPI_svcCatRequest.cancelRequest();
			break;
		case "closesvccatinteraction":
			lib.ScAPI_svcCatRequest.closeRequest();
			break;
        case "createallcatalog":
			lib.ScAPI_WSInterface_svcCatalogGather.getAllCategoryOrItem();
			break;
		case "createsvccatoperator":
			lib.ScAPI_svcCatOperator.canRequestOnBehalf();
			break;
		case "resubmitsvccatinteraction":
		    lib.ScAPI_svcCatRequest.resubmitRequest();
		    break;
		case "updatesvccatinteraction":
			lib.ScAPI_svcCatRequest.updateRequest();
			break;
		case "createsvccatapprovallogs":
		    lib.ScAPI_svcCatApprovals.getApprovalLogs();
		    break;
		case "createoperators":
		    lib.ScAPI_svcCatOperator.getOperatorByCompany();
		    break;
		case "createfiltercatalog":
		    lib.ScAPI_WSInterface_svcCatalogLanguage.filterItem();
		    break;
		case "getsvccatjournalupdate":
		    lib.ScAPI_svcCatalog_DiffSync.getSyncfrVerAPI();
		    break;
		case "getsubscribedcis":
		    lib.ScAPI_Subscriptions.getServiceList();
		    break;
		case "getdelegatemodule":
		    lib.ScAPI_ApprovalDelegation.getDelegationModules();
		    break;
		case "getdelegationlists":
		    lib.ScAPI_ApprovalDelegation.getDelegationList();
		    break;
		case "getapprovalgroups":
		    lib.ScAPI_ApprovalDelegation.getApprovalGroups();
		    break;
		case "createdelegation":
		    lib.ScAPI_ApprovalDelegation.createDelegation();
		    break;
		case "updatedelegation":
		    lib.ScAPI_ApprovalDelegation.updateDelegation();
		    break;
		case "getsrcgloballists":
		    lib.ScAPI_GlobalLists.getGlobalList();
		    break;
		case "getsrcconfigbylanguage":
		    lib.ScAPI_SRCConfig.getConfig();
		    break;
		case "getdelegatetolists":
		    lib.ScAPI_ApprovalDelegation.getDelegateToList();
		    break;
		case "getinteractioninfo":
		    lib.ScAPI_WSInterface_Interaction_Info.getInteractionInfo();
		    break;
		case "getallinteractioninfo":
		    lib.ScAPI_WSInterface_Interaction_Info.getAllInteractionInfo();
		    break;
		case "createsvccatinteractioncomments":
			lib.ScAPI_svcCatApprovals.getInteractionComments();
			break;
		case "getquotedetailforapproval":
			lib.ScAPI_QuetoDetail.getQuoteDetailForApproval();
			break;
		case "getchangedetailforapproval":
			lib.ScAPI_ChangeDetail.getChangeDetailForApproval();
			break;
		case "getsubscriptioninbox":
			lib.ScAPI_svcSubscriptions.getSubscription();
			break;
		case "getsubscribedetailshistory":
			lib.ScAPI_svcSubscriptions.getSubscribeDetailsHistory();
			break;
		case "unsubscribesubscription":
			lib.ScAPI_svcSubscriptions.unsubscribeUnsubscription();
			break;
		case "removeinteractionattachment":
			lib.ScAPI_Attachment.removeAttachment();
			break;
		case "getcatalogorderinfo":
			lib.ScAPI_WSInterface_svcCatalogDetail.getItemOrderInfo();
			break;
		case "checkallcatalog":
			lib.ScAPI_WSInterface_svcCatalogGather.checkItem();
			break;
		case "createsvcexpressionevaluation":
			lib.ScAPI_ExpressionEvaluate.evaluate();
			break;
		case "getinteractioncostsinfo" :
			lib.ScAPI_WSInterface_Interaction_Info.getInteractionCostsInfo();
			break;
		case "createsrcinteractionviaonestep" :
		    lib.ScAPI_svcCatRequestOneStep.createInteractionOneStep();
		    break;
		case "getlocksvccatinteraction":
			lib.ScAPI_svcCatRequest.checkLockbeforeUpdateRequest();
			break;
		case "createkmfeedback" :
			lib.ScAPI_KM_Feedback.createKMFeedback();
			break;
		case "createkmsearchhistory" :
			lib.ScAPI_KM_Statistic.createSearchHistory();
			break;
		case "createkmusagehistory" :
			lib.ScAPI_KM_Statistic.viewKMDoc();
			break;
		case "createsvccatinteractioncomment" :
			lib.ScAPI_svcCatRequest.createInteractionComment();
			break;
		case "resetoperatorpassword":
			lib.ScAPI_svcCatOperator.resetPassword();
			break;
		case "getinteractionactivityinfo":
			lib.ScAPI_WSInterface_Interaction_Info.getInteractionActivityInfo();
			break;
		case "createsvcadvancesearchconfig":
			lib.ScAPI_SRCConfig.getAdvanceSearchConfig();
			break;
		case "createsvckmdoctypes":
			lib.ScAPI_KM.retrieveDocTypes();
			break;
		case "searchsvckmdoctypes":
			lib.ScAPI_KM.searchDocTypes();
			break;
		case "createkmquery":
			lib.ScAPI_KM.search();
			break;
		case "createkmdocument":
			lib.ScAPI_KM.retrieveDocument();
			break;
		case "createrelatedrecord":
			lib.ScAPI_RelatedRecords.retreiveRelatedRecords();
			break;
		case "createsvcsrcsurveyinbox":
			lib.ScAPI_Survey.getSurveyInbox();
			break;
		case "getsvcsrcsurvey":
			lib.ScAPI_Survey.getSurveyRecord();
			break;
		case "submitsvcsrcsurvey":
			lib.ScAPI_Survey.submitSurveyRecord();
			break;
		case "getsvcsrcsurveystatistic":
			lib.ScAPI_Survey.getSurveyStatistic();
			break;
		default:
			print("default-->" + s1);
				
	}			
 	vars.$G_src = false;

}

function _populateCurrentAPIName() {	
	
	var objName = vars.$L_object;
	var actionName =  vars.$L_extaccess_file.action_names[vars.$L_2lower_index - 1];	
	return system.functions.tolower(actionName + objName + "");
}