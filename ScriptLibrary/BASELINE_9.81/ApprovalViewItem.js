/**
* Use to support view function of Line Item Approval
*
* Beddy(guo.zou@hp.com)
*/

// Import codes of sl:ScAPI_RAD
var us_convert_currency = lib.ScAPI_RAD.us_convert_currency;
var money_format        = lib.ScAPI_RAD.money_format;


function initDisplayScreen()
{
    var fmt = vars.$L_format;
    
    // check for $L.format
    fmt = getEscapeString(fmt, false);
	var sql = lib.DBUtils.getQueryByTag(fmt);
	if (sql != "" && sql != null)
	{
		var fApproval = new SCFile("Approval");
		var fRlt = fApproval.doSelect(sql);
	
		if (fRlt == RC_SUCCESS)
		{
		    vars.$L_approval_tag = lib.DBUtils.getTagByRecord(fApproval); // Record this string for later use
		    if (fApproval.component == null)
		    {
		        vars.$L_mode = "viewitem";
		        vars.$L_format = "SD.approval.cartitem";
		    }
		    else
		    {
		        vars.$L_mode = "viewcomponent";
		        vars.$L_format = "SD.approval.cartitem";
		    }
		    buildViewVar(vars.$L_mode);
		}
		else
		{
		    vars.$L_mode = "normal";
		}
	}
	else
	{
	    if (fmt == "SD.approval.cartitem")
	    {
	        vars.$L_mode = "viewrelateditem";
	        buildViewVar(vars.$L_mode);
	    }
	    else
	    {
	        vars.$L_mode = "normal";
	    }
	}
}

function buildViewVar(lMode)
{
    var relatedCatalog = new SCFile("svcCatalog");
    var rlt = relatedCatalog.doSelect("name=\"" + vars.$L_file.item_description + "\"");
    if (rlt == RC_SUCCESS)
    {
    	vars.$L_detailed_description = relatedCatalog.detailedDescription;
    	if (relatedCatalog.type == "item")
    	{
    	    vars.$L_option_instructions = relatedCatalog.option_instructions;
    	}	
    }

    // Get sla title
    if (vars.$L_file.serviceSLA != null)
    {
        var fSLA = new SCFile("sla");
        if (fSLA.doSelect("agreement.id=" + vars.$L_file.serviceSLA) == RC_SUCCESS)
        {
            vars.$L_service_id = system.functions.insert(vars.$L_service_id, 1, 1, vars.$L_file.serviceSLA);
            vars.$L_service_title = system.functions.insert(vars.$L_service_title, 1, 1, fSLA.title);
        }
    }
    
    // Build Line Item values
    if (vars.$L_file.bundle)
    {
        vars.$L_option_text = system.functions.scmsg(100, "svcCat");
    }
    else
    {
        vars.$L_option_text = system.functions.scmsg(99, "svcCat");
    }
    vars.$L_image = "svcCatalog;" + vars.$L_file.item_description;
    vars.$L_total_cost = getCartItemCostStr(vars.$L_file);
    
    if (lMode == "viewcomponent")
    {
        // Build Component values
        var componentName = vars.$L_file.item_description;
        vars.$L_title += " " + componentName;
    }
}

function getCartItemCostStr(lCartItem)
{
    var rtnStr = new String();
    var sourceAmount = system.functions.nullsub(lCartItem.cost, 0);
    var targetAmount = sourceAmount;

    var fCatalog = new SCFile("svcCatalog");
    if (fCatalog.doSelect("name=\""+lCartItem.item_description+"\"") == RC_SUCCESS)
    {
	    var convertRlt = us_convert_currency(fCatalog.currency,vars.$G_my_currency,sourceAmount,system.functions.tod());
	    if (convertRlt.getReturnCode() == "success")
	    {
	        targetAmount = convertRlt.getTargetQuantity();
	    } 
    }
    rtnStr = money_format(targetAmount,vars.$G_my_currency);
    
    return rtnStr;
}

function getEscapeString(lStr, lType)
{
    // Two array's length mush be the same
    var oldStr = new Array(";");
    var newStr = new Array("&nbsp");
    
    if (lType)
    {
        for (var i = 0; i < oldStr.length; i++)
        {
            var reg = new RegExp(oldStr[i],"g");   
            lStr = lStr.replace(reg , newStr[i]);
        }
    }
    else
    {
        for (var i = 0; i < oldStr.length; i++)
        {
            var reg = new RegExp(newStr[i],"g"); 
            lStr = lStr.replace(reg , oldStr[i]);
        }
    }
    
    return lStr;
}

function getFormatStrFromTag(lTag)
{   
    var format = system.functions.str(lTag);
    format = getEscapeString(format, true);
    
    return format;
}