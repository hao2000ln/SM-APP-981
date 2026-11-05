
var ucmdbSvc = new lib.ucmdbSMService.ucmdbSMService();

ucmdbSvc.location = "http://15.178.176.194:8080/axis2/services/ucmdbSMService";
ucmdbSvc.user     = "admin";
ucmdbSvc.password = "admin";

var getAllCIPropertiesReq = new lib.ucmdbSMService.getAllCIProperties();

//getAllCIPropertiesReq.cmdbContext.callerApplication.setValue( "Foo" );

getAllCIPropertiesReq.ID.setValue( "c68d29e394f56d2a46a5bbd112747d84" );

var getAllCIPropertiesResp = ucmdbSvc.invoke( getAllCIPropertiesReq );

if ( getAllCIPropertiesResp.isFault() )
{
   print( "SOAP Fault: " + getAllCIPropertiesResp.faultstring.getValue() );
   Quit();
}

var numProps = getAllCIPropertiesResp.CI.complexProp.length;
print( "We got " + numProps + " complex CI properties" );


for( i= 0; i < numProps; i++ )
{
	var numSubProps = getAllCIPropertiesResp.CI.complexProp[i].length();
print("numSubProps = " + numSubProps );
	for( j=0; j < numSubProps; j++ )
	{
		complexProp = getAllCIPropertiesResp.CI.complexProp[i].item[j].prop;
		numComplexPropItems = complexProp.length;
		//print("Complex Prop " + j + " has " + numComplexPropItems + "items" );
		for(k = 0; k < numComplexPropItems; k++ )	
			print(complexProp[k].name.getValue() + ": " + complexProp[k].value.getValue());
	}
}

numProps = getAllCIPropertiesResp.CI.prop.length;
print( "We got " + numProps + " CI properties" );


for( i= 0; i < numProps; i++ )
{
	print(getAllCIPropertiesResp.CI.prop[i].name.getValue() + ": " + getAllCIPropertiesResp.CI.prop[i].value.getValue());
}

