/*   @author Tony Bray
 *
 *   Package: KMAdmin
 * 
 *   Description: Read collection specific setting and pass to search engine via plugin call
 *
*/

function configureCollection(xmlRecord)
{
  var getenginename = system.library.KMSearchInterface.getEngineName();
  var result = 0;
  if (getenginename == "IDOL")
  {
  // write style files using field defs stored in record
     return result;
  }
  else
  {
     result = system.library.KMSearchInterface.configureIndex(xmlRecord);
     return result;
  }
}

