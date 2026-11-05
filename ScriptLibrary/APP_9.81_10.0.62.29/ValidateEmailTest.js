
var isValidEmail = new lib.ValidateEmail.IsValidEmail();

var ValidateEmailService = new lib.ValidateEmail.ValidateEmail();



isValidEmail.Email.setValue("support@peregrine.com" );

var response = ValidateEmailService.invoke( isValidEmail );

if ( response.isFault() )
{
 print( "Error! SOAP Fault! " + response.faultstring.getValue() );
}
else
 print( response.IsValidEmailResult.getValue() );
