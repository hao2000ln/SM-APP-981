var idolConfig = lib.IDOLConfigure.require();
idolConfig.clearIDOLServerConfigCache();
lib.jsaci.clearIDOLServer();

var idolEnabled = idolConfig.getConfig()['enable'];
if (idolEnabled) 
{
	vars.$G_kmsearchengine = 'IDOL';
    var result = lib.KMCollection_Update_IDOL.require().refreshIndexes();
    print("index done, result: "+result);

    lib.KMUtils.getIndexedSCFileArray();
}
