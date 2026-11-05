/** The interface to each API call for Service Catalog.
*   @author Vinson
*/

var NO_RECORD_EXIT = lib.GatewayAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.GatewayAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.GatewayAPI_Util.setExitType;
var setErrorMsg = lib.GatewayAPI_Util.setErrorMsg;
var index = system.functions.index;
var log = lib.GatewayAPI_Logger.log("GatewayAPI_Dispatcher");

function doAction() {
    vars.$G_src = true;
    var s1 = _populateCurrentAPIName();	
    switch (s1) {
		case "denygwapproval":
			lib.GatewayAPI_svcCatApprovals.denyApproval();
			break;
		case "denyallgwapproval":
			lib.GatewayAPI_svcCatApprovals.denyApproval("all");
			break;
		case "approvegwapproval":
			lib.GatewayAPI_svcCatApprovals.approveApproval();
			break;
		case "approveallgwapproval":
			lib.GatewayAPI_svcCatApprovals.approveApproval("all");
			break;
		case "deletegwcart":
			lib.GatewayAPI_WSInterface_svcCart.removeCart();
			break;	
		case "creategwcatalog":
			lib.GatewayAPI_WSInterface_svcCatalogGather.getItem();
			break;
		case "creategwcatalogbylanguage":
			lib.GatewayAPI_WSInterface_svcCatalogLanguage.getItem();
			break;
		case "creategwcatalogdetail":
			lib.GatewayAPI_WSInterface_svcCatalogDetail.getItem();
			break;
		case "createallgwcatalogdetail":
            lib.GatewayAPI_WSInterface_svcCatalogDetail.getItem("all");
            break;
		case "creategwcatalogorderinfo":
			lib.GatewayAPI_WSInterface_Order_Info.displayInitOrderInfo();
			break;
		case "creategwfavoritecatalog":
			lib.GatewayAPI_WSInterface_svcCatalogFavorite.getItem();
			break;
		case "creategwinteractionapprovalcount":
			lib.GatewayAPI_WSInterface_RequestApprovalCount.getCount();
			break;
		case "querygwinteractioninbox":
			lib.GatewayAPI_WSInterface_Interaction_Inbox.queryInteraction();
			break;
		case "creategwoptionslookup": 
			lib.GatewayAPI_GetOptionsLookup.getOptionsLookup();
			break;
		case "additemtocartviagworder":
			lib.GatewayAPI_WSInterface_Add_Item.addItemToCart();
			break;
		case "updateitemincartgworder":
			lib.GatewayAPI_WSInterface_Update_Item.updateItemInCart();
			break;
		case "deleteitemincartgworder":
			lib.GatewayAPI_WSInterface_Update_Item.deleteItemInCart();
			break;
		case "creategwsubmitcart":
			lib.GatewayAPI_svcCatRequest.createRequest();
			break;
		case "creategwinteraction":
		    lib.GatewayAPI_svcCatRequest.createRequest();
		    break;
		case "querygwsvccatapprovalinbox":
			lib.GatewayAPI_svcCatApprovals.getApprovalInbox();
			break;
		case "querygwsvccatcurrentapprovals":
			lib.GatewayAPI_svcCatApprovals.getCurrentApprovals();
			break;
		case "cancelgwsvccatinteraction":
			lib.GatewayAPI_svcCatRequest.cancelRequest();
			break;
		case "closegwsvccatinteraction":
			lib.GatewayAPI_svcCatRequest.closeRequest();
			break;
        case "creategwallcatalog":
			lib.GatewayAPI_WSInterface_svcCatalogGather.getAllCategoryOrItem();
			break;
		case "creategwsvccatoperator":
			lib.GatewayAPI_svcCatOperator.canRequestOnBehalf();
			break;
		case "resubmitgwinteractionrequest":
		    lib.GatewayAPI_svcCatRequestOneStep.resubmitInteractionOneStep();
		    break;
		case "updategwsvccatinteraction":
			lib.GatewayAPI_svcCatRequest.updateRequest();
			break;
		case "querygwsvccatapprovallogs":
		    lib.GatewayAPI_svcCatApprovals.getApprovalLogs();
		    break;
		case "creategwoperators":
		    lib.GatewayAPI_svcCatOperator.getOperatorByCompany();
		    break;
		case "creategwfiltercatalog":
		    lib.GatewayAPI_WSInterface_svcCatalogLanguage.filterItem();
		    break;
		case "getgwsvccatjournalupdate":
		    lib.GatewayAPI_svcCatalog_DiffSync.getSyncfrVerAPI();
		    break;
		case "getgwsubscribedcis":
		    lib.GatewayAPI_Subscriptions.getServiceList();
		    break;
		case "getgwdelegatemodule":
		    lib.GatewayAPI_ApprovalDelegation.getDelegationModules();
		    break;
		case "getgwdelegationlists":
		    lib.GatewayAPI_ApprovalDelegation.getDelegationList();
		    break;
		case "getgwapprovalgroups":
		    lib.GatewayAPI_ApprovalDelegation.getApprovalGroups();
		    break;
		case "creategwdelegation":
		    lib.GatewayAPI_ApprovalDelegation.createDelegation();
		    break;
		case "updategwdelegation":
		    lib.GatewayAPI_ApprovalDelegation.updateDelegation();
		    break;
		case "getgwgloballists":
		    lib.GatewayAPI_GlobalLists.getGlobalList();
		    break;
		case "getgwcustomfieldsconfig":
		    lib.GatewayAPI_Config.getConfig();
		    break;
		case "getgwportalform":
		    lib.GatewayAPI_PortalFormConfig.getConfig();
		    break;
		case "getgwdelegatetolists":
		    lib.GatewayAPI_ApprovalDelegation.getDelegateToList();
		    break;
		case "getgwinteractioninfo":
		    lib.GatewayAPI_WSInterface_Interaction_Info.getInteractionInfo();
		    break;
		case "getallgwinteractioninfo":
		    lib.GatewayAPI_WSInterface_Interaction_Info.getAllInteractionInfo();
		    break;
	    case "getgwcustominteractioninfo":
		    lib.GatewayAPI_WSInterface_Interaction_Info_Custom.getInteractionInfo();
		    break;
		case "getallgwcustominteractioninfo":
		    lib.GatewayAPI_WSInterface_Interaction_Info_Custom.getAllInteractionInfo();
		    break;
		case "creategwsvccatinteractioncomments":
			lib.GatewayAPI_svcCatApprovals.getInteractionComments();
			break;
		case "getgwrequestdetailforapproval":
			lib.GatewayAPI_RequestDetail.getRequestDetailForApproval();
			break;
		case "getgwchangedetailforapproval":
			lib.GatewayAPI_ChangeDetail.getChangeDetailForApproval();
			break;
		case "getgwsubscriptioninbox":
			lib.GatewayAPI_svcSubscriptions.getSubscription();
			break;
		case "getgwsubscribedetailshistory":
			lib.GatewayAPI_svcSubscriptions.getSubscribeDetailsHistory();
			break;
		case "unsubscribegwsubscription":
			lib.GatewayAPI_svcSubscriptions.unsubscribeUnsubscription();
			break;
		case "removegwinteractionattachment":
			lib.GatewayAPI_Attachment.removeAttachment();
			break;
		case "getgwcatalogorderinfo":
			lib.GatewayAPI_WSInterface_svcCatalogDetail.getItemOrderInfo();
			break;
		case "checkgwallcatalog":
			lib.GatewayAPI_WSInterface_svcCatalogGather.checkItem();
			break;
		case "creategwsvcexpressionevaluation":
			lib.GatewayAPI_ExpressionEvaluate.evaluate();
			break;
		case "getgwinteractioncostsinfo" :
			lib.GatewayAPI_WSInterface_Interaction_Info.getInteractionCostsInfo();
			break;
		case "creategwinteractionrequest" :
		    lib.GatewayAPI_svcCatRequestOneStep.createInteractionOneStep();
		    break;
		case "getlockgwsvccatinteraction":
			lib.GatewayAPI_svcCatRequest.checkLockbeforeUpdateRequest();
			break;
		case "creategwkmfeedback" :
			lib.GatewayAPI_KM_Feedback.createKMFeedback();
			break;
		case "creategwkmsearchhistory" :
			lib.GatewayAPI_KM_Statistic.createSearchHistory();
			break;
		case "creategwkmusagehistory" :
			lib.GatewayAPI_KM_Statistic.viewKMDoc();
			break;
		case "creategwsvccatinteractioncomment" :
			lib.GatewayAPI_svcCatRequest.createInteractionComment();
			break;
		case "resetgwoperatorpassword":
			lib.GatewayAPI_svcCatOperator.resetPassword();
			break;
		case "getgwinteractionactivityinfo":
			lib.GatewayAPI_WSInterface_Interaction_Info.getInteractionActivityInfo();
			break;
		case "creategwsvcadvancesearchconfig":
			lib.GatewayAPI_Config.getAdvanceSearchConfig();
			break;
		case "creategwsvckmdoctypes":
			lib.GatewayAPI_KM.retrieveDocTypes();
			break;
		case "searchgwsvckmdoctypes":
			lib.GatewayAPI_KM.searchDocTypes();
			break;
		case "creategwkmquery":
			lib.GatewayAPI_KM.search();
			break;
		case "creategwkmdocument":
			lib.GatewayAPI_KM.retrieveDocument();
			break;
		case "creategwrelatedrecord":
			lib.GatewayAPI_RelatedRecords.retreiveRelatedRecords();
			break;
		case "creategwsvcsrcsurveyinbox":
			lib.GatewayAPI_Survey.getSurveyInbox();
			break;
		case "getgwsvcsrcsurvey":
			lib.GatewayAPI_Survey.getSurveyRecord();
			break;
		case "submitgwsvcsrcsurvey":
			lib.GatewayAPI_Survey.submitSurveyRecord();
			break;
		case "getgwsvcsrcsurveystatistic":
			lib.GatewayAPI_Survey.getSurveyStatistic();
			break;
		case "closegwinteractionaction":
			lib.GatewayAPI_svcCatRequestActions.closeRequest();
			break;
		case "acceptgwinteractionaction":
			lib.GatewayAPI_svcCatRequestActions.acceptRequest();
			break;
		case "rejectservicegwinteractionaction":
			lib.GatewayAPI_svcCatRequestActions.rejectServiceRequest();
			break;
		case "rejectsupportgwinteractionaction":
			lib.GatewayAPI_svcCatRequestActions.rejectSupportRequest();
			break;
		case "addactivityloggwinteractionaction":
			lib.GatewayAPI_svcCatRequestActions.addActivityLog();
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