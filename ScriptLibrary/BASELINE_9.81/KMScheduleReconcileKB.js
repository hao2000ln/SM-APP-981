//This will schedule the KMUpdate scheduler background process to run a reconcile of the database documents 
//against the KM Search Engine Indexes.  Note that regular processing of the KMUpdate will not run while this reconcile is processing.

//change this parameter to the KB you wish to reconcile
//Modify the parameter to correspond to the Knowledgebase name you wish to reconcile.  
//Press "Save", Press "Compile" (ensure no errors), Press "Execute"

system.library.KMReconcileKnowledgebase.scheduleReconcileKnowledgebase("Knowledge_Library");