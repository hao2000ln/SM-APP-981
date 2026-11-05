
// Before this sample can be used, you need to register again and get a new temporary / trial License Key
// by going to www.serviceobjects.com and registering to use the ValidateAddress (or DOTSAddressValidate) web service
// Then uncomment the line of code below beginning with "myRequest.LicenseKey" and set the key in between the double quotes.

var DOTSAddress = new lib.DOTSAddressValidate.DOTSAddressValidate();

var myRequest = new lib.DOTSAddressValidate.ValidateAddress();

myRequest.Address.setValue( "3611 Valley Centre Drive" );
myRequest.City.setValue( "San Diego" );
myRequest.State.setValue( "CA" );
myRequest.PostalCode.setValue( "92130" );

myRequest.LicenseKey.setValue( "Your license code here" );
  
try
{  
  var validateAddressResponse = DOTSAddress.invoke( myRequest );

  if ( validateAddressResponse.isFault() )
  {
    print( validateAddressResponse.faultstring.getValue() );
  }
  else
  {
    var result = validateAddressResponse.ValidateAddressResult;

    if ( result.Error.Desc.getValue() != null )
    {
      print( result.Error.Desc.getValue() );
    }
    else  
      print( "That address is in " + result.CountyName.getValue() + " county" +
              " and the full zip is " + result.Zip.getValue() );
  }
}
catch( e )
{
  print( e.toString() );
}