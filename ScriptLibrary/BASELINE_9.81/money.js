/**  This function is used to return a monetary value in the correct format
*	###  Should be replaced by a callrad to money.format when it is working.
*
*	@param {amount} Number - The monetary amount
*	@param {currency} String - The currency type to be used (ex. USD)
*	@return		The formatted amount
*	@type	String
*/
function formatCurrency( amount, currency )
{
	if ( currency == null )
		currency = vars.$G_root_currency;
		
	var info = new SCFile( "currency" )
	var sql = "currency.code=\""+currency+"\"";
	var negative = false;
	var theAmount = parseFloat(amount);
	
	if ( info.doSelect( sql ) == RC_SUCCESS )
	{
		if ( theAmount < 0 )
		{
			negative = true;
			theAmount = theAmount * (-1);
		}
		var formattedString = info.symbol  + parseFloat( theAmount ).toFixed(2);
		if ( negative )
			formattedString = "-"+formattedString;
		
		return formattedString;
	}
	
	return amount.toString();
}