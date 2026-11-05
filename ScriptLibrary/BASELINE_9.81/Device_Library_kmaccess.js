// This script determines user access to a knowledgebase


function checkAccess(user, record)
{
  // user is the name of the user.
  // record is the kmkbase record for a collection,
  // it contains the collection name and the file being indexed.
  // This function must return True or False, depending on 
  // if the user was validated to search this collection or not.
  // The validation method should check that the user can see the 
  // filename being indexed at it's base level, For example,
  // a user can search probsummary if they have incident management rights
  //
  // Since a single file can have multiple indexes, you can also
  // validate the user against the knowledgebase name.  Remember,
  // this function must return True or False.  How you determine
  // which one to return is up to you.
  
  // check if user has access to record.sclibtablename
  // if yes,
    if (system.functions.nullsub(vars.$G_ess,false))
		return false;
	else 
		return system.functions.nullsub(vars.$G_am_environment.view,false);
  // else
  // return false;
  }
