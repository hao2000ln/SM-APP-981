// You must register with Amazon (free) to use their web services
// Change the line of code that sets the "devtag" element to contain your authorization code

var Amazon = new lib.AmazonSearchService.AmazonSearchService();

var actorSearchRequest = new lib.AmazonSearchService.ActorSearchRequest();

// Note: the annoying need to specify a redundant "ActorSearchRequest" property
// is due to bad Amazon XML document design: An <ActorSearchRequest> contains another <ActorSearchRequest>...
// We can mitigate this a bit by calling our request object "asr" and do less typing 

var asr = actorSearchRequest;

asr.ActorSearchRequest.devtag.setValue("Your auth code here");

asr.ActorSearchRequest.actor.setValue("Harrison Ford");
asr.ActorSearchRequest.mode.setValue("dvd");
asr.ActorSearchRequest.page.setValue("1");   
asr.ActorSearchRequest.type.setValue("lite");

var actorSearchResponse = Amazon.invoke( asr );

if ( actorSearchResponse.isFault() )
{
  print( "SOAP Fault: " + actorSearchResponse.faultstring.getValue() );
}
else
{

var productDetailsArray = actorSearchResponse._return.Details;

// There are several alternative valid ways to get the size of a returned array

var numItems = productDetailsArray.length();    // we implement a length function on array containers
    numItems = productDetailsArray.Details.length; // ..or you can dip into the array object in the container
    numItems = productDetailsArray.item.length;    // which always has a synonym called item[]

for ( var i=0; i<numItems; i++ )
{
  // Either syntax below is valid ( "item[i]" or "Details[i] )
  
  var productDetail = productDetailsArray.item[i];
  
      productDetail = productDetailsArray.Details[i];
      
  // Amazon responses may not contain the "OurPrice" object if the item is not in stock
  // Such items usually have a "UsedPrice", so try to get that
  // As a last resort, pick up "ListPrice"
      
  var price;
  var priceType;
  
  if ( productDetail.OurPrice.getValue() != undefined )
  {
    price = productDetail.OurPrice;
    priceType = "Amazon price: ";
  }
  else
  {
    if ( productDetail.UsedPrice.getValue() == undefined )
    {
      price = productDetail.ListPrice;
      priceType = "List price: ";
    }
    else
    {
      price = productDetail.UsedPrice;
      priceType = "Used price: ";
    }
  }
  
  print( productDetail.ProductName.getValue() + "\t" 
        + productDetail.Availability.getValue() + "\t"
        + priceType
        + price.getValue() );
}
}

