function setKMActiveLangs() {
    var language_km_ids = new SCDatum();
    language_km_ids.setType(8);
    var language_km_names = new SCDatum();
    language_km_names.setType(8);

    var idarray = vars.$G_language_km_ids.toArray();
    var namearray = vars.$G_language_km_names.toArray();
    var index = 0;

    var kmlangFile = new SCFile("language", SCFILE_READONLY);
    kmlangFile.setFields("km.id");
    var kmlangFind = kmlangFile.doSelect("km.active = \"true\"");
    while (kmlangFind == RC_SUCCESS) {
        var i;
        for (i = 0; i <= idarray.length; i++) {
            if (idarray[i] == kmlangFile.km_id) {
                index = i;
                break;
            }
        }
        language_km_ids.push(kmlangFile.km_id);
        language_km_names.push(namearray[index]);
        
        kmlangFind = kmlangFile.getNext();
    }
    vars.$G_language_km_names = language_km_names;
    vars.$G_language_km_ids = language_km_ids;

    var fipsMode = lib.KMAdmin.isFipsMode();
    var env = new SCFile("environment");
    var rc = env.doSelect('name="knowledge management"');
    if (rc == RC_SUCCESS && fipsMode && fipsMode != env.ssl_enabled) {
        env.ssl_enabled = true;
        env.doUpdate();
    }
}