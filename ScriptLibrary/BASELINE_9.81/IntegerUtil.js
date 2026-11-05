/**
 * This file containes some common methods for integer object
 */
 

/**
*  This function checks isf the provided string is a valid positive integer.
*
*  	History:
*	2013-04-30, Jan Steube - function created
*	
*  @param 	{string / integer} 	value 		- the value to be checked
*  @returns {boolean} 			true/false	- the string is a valid integer
*/ 


function isNormalInteger(value)
{
 	return /^\+?(0|[1-9]\d*)$/.test(value);
}

function isPositiveInteger(str)
{
 	return /^\+?([1-9]\d*)$/.test(str);
}