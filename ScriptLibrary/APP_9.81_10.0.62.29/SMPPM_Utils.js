function ppmcloseme(){
	if (vars.$L_file!=null)
	{	    
		 	var file = vars.$L_file;
		 	
		 	
		 	switch( file.doAction( '_wfE:ppmcloseme' ) ) {
		 	
		   	case RC_VALIDATION_FAILED: case 71:
		   	
		   		vars.$L_exit="badval";
		   		break;
		   		
		   	case RC_MODIFIED: case 51:
		   	
		   		vars.$L_exit = "changed";
		   		break;
		   		
		   	case RC_CANT_HAVE: case 3:
		   	
		   		vars.$L_exit = "locked";
		   		break;
		   		
		   	case RC_ERROR:
		   	
		   		vars.$L_exit = "error";
		   		break;
		   		
		   	default:	
		   		vars.$L_exit = "normal";
		   		
		   	}


		 }
		 


}