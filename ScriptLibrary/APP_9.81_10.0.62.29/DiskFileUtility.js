function copyTextFile(srcPath, destPath) {
  var obj = readTextFile(srcPath);
  if (obj == null || obj =='undefined') {
    var msg ="File is not available at " + srcPath;
    print(msg);
    return;
  }
  return writeTextFile(destPath, obj);
}

//read text file
function readTextFile(path) {
  try {
    var textFile = readFile( path, "t" );
    return textFile;
  } catch(ex) {
     print("exception: " + ex);
     throw "cannot read text file:" + path + " - " + ex;
  }
}

//read binary file
function readBinFile(path) {
  try {
    var binFile = readFile( path, "b" );
    return binFile;
  } catch(ex) {
     print("exception: " + ex);
     throw "cannot read bianry file: " + path + " - " + ex;
  }
}


//write binary file
function writeBinFile(path, object) {
  try {
    var output = writeFile( path, "b", object );
    return output;
  } catch(ex) {
     print("exception: " + ex);
     throw "cannot write binary file: " + path + " - " + ex;
  }
}

//write text file
function writeTextFile(path, object) {
  try {
    var output = writeFile( path, "t", object );
    return output;
  } catch(ex) {
     print("exception: " + ex);
     throw "cannot write text file: " + path + " - " + ex;
  }
}

function trimString( str ) {
    if( str ) {
        str = str.replace( /^\s*/, "" ).replace( /\s*$/, "" );
    }
    return str;
}

//Import unload files
function importUnload( path ) {
    if (path == null) { 
       print("Path is empty"); 
       return;
    }
    //replace \ to / in the folder
    path = path.replace(/\\/g, "/");
	var execString = "sm file.load " + path + " NULL NULL winnt";
	var rc = sysExec(execString);
	print(rc[2]);
	if(rc[0] == 0 && rc[1] == 0){
		print("Import successfully.")
	}
	
}
