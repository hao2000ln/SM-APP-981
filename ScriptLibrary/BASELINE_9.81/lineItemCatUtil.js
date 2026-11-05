function checkLineItemCatAvail(lineItemCatId) {
	var ocmlcatVar = new SCFile("ocmlcat");
	var rc = ocmlcatVar.doSelect("name=\"" + lineItemCatId + "\"");
	while (rc == RC_SUCCESS) {
		if (system.functions.evaluate(ocmlcatVar.avail_cond))
			return true;
		else
			return false;
	}
	return false;
}

function checkLineItemCatArrayAvailLng(lineItemCatIdArray) {
	var aLng = 0;
	var lcArr = lineItemCatIdArray.toArray();
	for (var i = 0, len = lcArr.length; i < len; i++) {
		if (checkLineItemCatAvail(lcArr[i]))
			aLng += 1;
	}
	return aLng;
}