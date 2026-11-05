var $ = lib.c.$;
var _ = lib.Underscore.require();

function getStopPhraseRecord( currentStopPhrases )
{
   var sql=true;
   var stopphrase = new SCFile("idolStopPhrase");
   if(stopphrase.doSelect(sql) == RC_SUCCESS){
      return stopphrase
   }
   return null;
}