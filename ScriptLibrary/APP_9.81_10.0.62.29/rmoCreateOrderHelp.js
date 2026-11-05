function getLineItemQuote(lineItem) {
	var quote = new SCFile("ocmq");
	var rc = quote.doSelect("number=\"" + lineItem["parent.quote"] + "\"");
	if (rc == RC_SUCCESS) {
		return quote;
	}
	return null;
}

function getQuotePhase(quote) {
	var quotePhase = new SCFile("ocmoptions");
	var rc = quotePhase.doSelect("name=\"" + quote["current.phase"] + "\"");
	if (rc == RC_SUCCESS) {
		return quotePhase
	}
	return null;
}

function getLineItemQuotePhaseGenOrder(lineItem) {
	var isGenOrder = null;
	var quote = getLineItemQuote(lineItem);
	if (quote) {
		var quotePhase = getQuotePhase(quote);
		if (quotePhase) {
			isGenOrder = quotePhase["gen.order"];
		}
	}
	if (isGenOrder)
		return true;
	else
		return false;
}
