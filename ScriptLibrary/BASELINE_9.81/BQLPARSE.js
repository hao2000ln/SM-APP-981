/*
	Default driver template for JS/CC generated parsers for JScript.
	Platforms JScript.NET and Windows Script Host are supported.
	
	Features:
	- Parser trace messages
	- Step-by-step parsing
	- Integrated panic-mode error recovery
	- Pseudo-graphical parse tree generation
	
	Written 2007, 2008 by Jan Max Meyer, J.M.K S.F. Software Technologies
	
	This is in the public domain.
*/
var DIRECTION = lib.BDM_Mapping_Constants.DIRECTION;
var SM2BDM = DIRECTION.EP1TOEP2;
var BDM2SM = DIRECTION.EP2TOEP1;

var _dbg_withparsetree	= false;
var _dbg_withtrace		= false;
var _dbg_withstepbystep	= false;

function __dbg_print( text )
{
}

function __dbg_wait()
{
}

function __lex( info )
{
	var state		= 0;
	var match		= -1;
	var match_pos	= 0;
	var start		= 0;
	var pos			= info.offset + 1;

	do
	{
		pos--;
		state = 0;
		match = -2;
		start = pos;

		if( info.src.length <= start )
			return 40;

		do
		{

switch( state )
{
	case 0:
		if( info.src.charCodeAt( pos ) == 9 || info.src.charCodeAt( pos ) == 32 ) state = 1;
		else if( info.src.charCodeAt( pos ) == 40 ) state = 2;
		else if( info.src.charCodeAt( pos ) == 41 ) state = 3;
		else if( info.src.charCodeAt( pos ) == 44 ) state = 4;
		else if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 5;
		else if( info.src.charCodeAt( pos ) == 60 ) state = 6;
		else if( info.src.charCodeAt( pos ) == 61 ) state = 7;
		else if( info.src.charCodeAt( pos ) == 62 ) state = 8;
		else if( info.src.charCodeAt( pos ) == 65 || info.src.charCodeAt( pos ) == 97 ) state = 9;
		else if( info.src.charCodeAt( pos ) == 91 ) state = 10;
		else if( info.src.charCodeAt( pos ) == 93 ) state = 11;
		else if( info.src.charCodeAt( pos ) == 123 ) state = 12;
		else if( info.src.charCodeAt( pos ) == 125 ) state = 13;
		else if( info.src.charCodeAt( pos ) == 33 ) state = 32;
		else if( info.src.charCodeAt( pos ) == 73 || info.src.charCodeAt( pos ) == 105 ) state = 34;
		else if( info.src.charCodeAt( pos ) == 39 ) state = 35;
		else if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 36;
		else if( info.src.charCodeAt( pos ) == 45 ) state = 37;
		else if( info.src.charCodeAt( pos ) == 46 ) state = 39;
		else if( ( info.src.charCodeAt( pos ) >= 66 && info.src.charCodeAt( pos ) <= 72 ) || ( info.src.charCodeAt( pos ) >= 74 && info.src.charCodeAt( pos ) <= 75 ) || info.src.charCodeAt( pos ) == 77 || ( info.src.charCodeAt( pos ) >= 80 && info.src.charCodeAt( pos ) <= 84 ) || ( info.src.charCodeAt( pos ) >= 86 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 98 && info.src.charCodeAt( pos ) <= 104 ) || ( info.src.charCodeAt( pos ) >= 106 && info.src.charCodeAt( pos ) <= 107 ) || info.src.charCodeAt( pos ) == 109 || ( info.src.charCodeAt( pos ) >= 112 && info.src.charCodeAt( pos ) <= 116 ) || ( info.src.charCodeAt( pos ) >= 118 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 80;
		else if( info.src.charCodeAt( pos ) == 78 || info.src.charCodeAt( pos ) == 110 ) state = 81;
		else if( info.src.charCodeAt( pos ) == 85 || info.src.charCodeAt( pos ) == 117 ) state = 82;
		else state = -1;
		break;

	case 1:
		state = -1;
		match = 1;
		match_pos = pos;
		break;

	case 2:
		state = -1;
		match = 11;
		match_pos = pos;
		break;

	case 3:
		state = -1;
		match = 12;
		match_pos = pos;
		break;

	case 4:
		state = -1;
		match = 18;
		match_pos = pos;
		break;

	case 5:
		if( info.src.charCodeAt( pos ) == 46 ) state = 16;
		else if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 83;
		else state = -1;
		match = 26;
		match_pos = pos;
		break;

	case 6:
		if( info.src.charCodeAt( pos ) == 61 ) state = 17;
		else if( info.src.charCodeAt( pos ) == 62 ) state = 18;
		else state = -1;
		match = 20;
		match_pos = pos;
		break;

	case 7:
		state = -1;
		match = 17;
		match_pos = pos;
		break;

	case 8:
		if( info.src.charCodeAt( pos ) == 61 ) state = 19;
		else state = -1;
		match = 21;
		match_pos = pos;
		break;

	case 9:
		if( info.src.charCodeAt( pos ) == 78 || info.src.charCodeAt( pos ) == 110 ) state = 38;
		else if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 77 ) || ( info.src.charCodeAt( pos ) >= 79 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 109 ) || ( info.src.charCodeAt( pos ) >= 111 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 25;
		match_pos = pos;
		break;

	case 10:
		state = -1;
		match = 15;
		match_pos = pos;
		break;

	case 11:
		state = -1;
		match = 16;
		match_pos = pos;
		break;

	case 12:
		if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 122 ) || info.src.charCodeAt( pos ) == 124 || ( info.src.charCodeAt( pos ) >= 126 && info.src.charCodeAt( pos ) <= 254 ) ) state = 43;
		else state = -1;
		match = 13;
		match_pos = pos;
		break;

	case 13:
		state = -1;
		match = 14;
		match_pos = pos;
		break;

	case 14:
		state = -1;
		match = 24;
		match_pos = pos;
		break;

	case 15:
		if( info.src.charCodeAt( pos ) == 39 ) state = 35;
		else state = -1;
		match = 29;
		match_pos = pos;
		break;

	case 16:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 16;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 47;
		else state = -1;
		match = 27;
		match_pos = pos;
		break;

	case 17:
		state = -1;
		match = 22;
		match_pos = pos;
		break;

	case 18:
		state = -1;
		match = 19;
		match_pos = pos;
		break;

	case 19:
		state = -1;
		match = 23;
		match_pos = pos;
		break;

	case 20:
		if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 6;
		match_pos = pos;
		break;

	case 21:
		if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 7;
		match_pos = pos;
		break;

	case 22:
		if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 23:
		if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 2;
		match_pos = pos;
		break;

	case 24:
		if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 4;
		match_pos = pos;
		break;

	case 25:
		state = -1;
		match = 31;
		match_pos = pos;
		break;

	case 26:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 26;
		else state = -1;
		match = 28;
		match_pos = pos;
		break;

	case 27:
		if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 5;
		match_pos = pos;
		break;

	case 28:
		if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 8;
		match_pos = pos;
		break;

	case 29:
		if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 10;
		match_pos = pos;
		break;

	case 30:
		if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 9;
		match_pos = pos;
		break;

	case 31:
		state = -1;
		match = 30;
		match_pos = pos;
		break;

	case 32:
		if( info.src.charCodeAt( pos ) == 61 ) state = 14;
		else state = -1;
		break;

	case 33:
		if( info.src.charCodeAt( pos ) == 46 ) state = 16;
		else if( info.src.charCodeAt( pos ) == 45 ) state = 51;
		else if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 84;
		else state = -1;
		match = 26;
		match_pos = pos;
		break;

	case 34:
		if( info.src.charCodeAt( pos ) == 78 || info.src.charCodeAt( pos ) == 110 ) state = 20;
		else if( info.src.charCodeAt( pos ) == 83 || info.src.charCodeAt( pos ) == 115 ) state = 21;
		else if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 77 ) || ( info.src.charCodeAt( pos ) >= 79 && info.src.charCodeAt( pos ) <= 82 ) || ( info.src.charCodeAt( pos ) >= 84 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 109 ) || ( info.src.charCodeAt( pos ) >= 111 && info.src.charCodeAt( pos ) <= 114 ) || ( info.src.charCodeAt( pos ) >= 116 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 25;
		match_pos = pos;
		break;

	case 35:
		if( info.src.charCodeAt( pos ) == 39 ) state = 15;
		else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 38 ) || ( info.src.charCodeAt( pos ) >= 40 && info.src.charCodeAt( pos ) <= 254 ) ) state = 35;
		else state = -1;
		break;

	case 36:
		if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 22;
		else if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 81 ) || ( info.src.charCodeAt( pos ) >= 83 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 113 ) || ( info.src.charCodeAt( pos ) >= 115 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 25;
		match_pos = pos;
		break;

	case 37:
		if( info.src.charCodeAt( pos ) == 46 ) state = 41;
		else if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 85;
		else state = -1;
		break;

	case 38:
		if( info.src.charCodeAt( pos ) == 68 || info.src.charCodeAt( pos ) == 100 ) state = 23;
		else if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 67 ) || ( info.src.charCodeAt( pos ) >= 69 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 99 ) || ( info.src.charCodeAt( pos ) >= 101 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 25;
		match_pos = pos;
		break;

	case 39:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 16;
		else state = -1;
		break;

	case 40:
		if( info.src.charCodeAt( pos ) == 75 || info.src.charCodeAt( pos ) == 107 ) state = 50;
		else if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 74 ) || ( info.src.charCodeAt( pos ) >= 76 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 106 ) || ( info.src.charCodeAt( pos ) >= 108 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 25;
		match_pos = pos;
		break;

	case 41:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 45;
		else state = -1;
		break;

	case 42:
		if( info.src.charCodeAt( pos ) == 87 || info.src.charCodeAt( pos ) == 119 ) state = 52;
		else if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 86 ) || ( info.src.charCodeAt( pos ) >= 88 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 118 ) || ( info.src.charCodeAt( pos ) >= 120 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 25;
		match_pos = pos;
		break;

	case 43:
		if( info.src.charCodeAt( pos ) == 125 ) state = 25;
		else if( ( info.src.charCodeAt( pos ) >= 0 && info.src.charCodeAt( pos ) <= 122 ) || info.src.charCodeAt( pos ) == 124 || ( info.src.charCodeAt( pos ) >= 126 && info.src.charCodeAt( pos ) <= 254 ) ) state = 43;
		else state = -1;
		break;

	case 44:
		if( info.src.charCodeAt( pos ) == 84 || info.src.charCodeAt( pos ) == 116 ) state = 24;
		else if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 83 ) || ( info.src.charCodeAt( pos ) >= 85 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 115 ) || ( info.src.charCodeAt( pos ) >= 117 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 25;
		match_pos = pos;
		break;

	case 45:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 45;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 47;
		else state = -1;
		break;

	case 46:
		if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 54;
		else if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 75 ) || ( info.src.charCodeAt( pos ) >= 77 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 107 ) || ( info.src.charCodeAt( pos ) >= 109 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 25;
		match_pos = pos;
		break;

	case 47:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 26;
		else if( info.src.charCodeAt( pos ) == 43 || info.src.charCodeAt( pos ) == 45 ) state = 49;
		else state = -1;
		break;

	case 48:
		if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 79 ) || ( info.src.charCodeAt( pos ) >= 81 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 111 ) || ( info.src.charCodeAt( pos ) >= 113 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else if( info.src.charCodeAt( pos ) == 80 || info.src.charCodeAt( pos ) == 112 ) state = 78;
		else state = -1;
		match = 25;
		match_pos = pos;
		break;

	case 49:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 26;
		else state = -1;
		break;

	case 50:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 27;
		else if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 68 ) || ( info.src.charCodeAt( pos ) >= 70 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 25;
		match_pos = pos;
		break;

	case 51:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 49 ) ) state = 53;
		else state = -1;
		break;

	case 52:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 56;
		else if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 68 ) || ( info.src.charCodeAt( pos ) >= 70 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 25;
		match_pos = pos;
		break;

	case 53:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 55;
		else state = -1;
		break;

	case 54:
		if( info.src.charCodeAt( pos ) == 76 || info.src.charCodeAt( pos ) == 108 ) state = 28;
		else if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 75 ) || ( info.src.charCodeAt( pos ) >= 77 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 107 ) || ( info.src.charCodeAt( pos ) >= 109 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 25;
		match_pos = pos;
		break;

	case 55:
		if( info.src.charCodeAt( pos ) == 45 ) state = 57;
		else state = -1;
		break;

	case 56:
		if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 29;
		else if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 81 ) || ( info.src.charCodeAt( pos ) >= 83 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 113 ) || ( info.src.charCodeAt( pos ) >= 115 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 25;
		match_pos = pos;
		break;

	case 57:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 51 ) ) state = 59;
		else state = -1;
		break;

	case 58:
		if( info.src.charCodeAt( pos ) == 82 || info.src.charCodeAt( pos ) == 114 ) state = 30;
		else if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 81 ) || ( info.src.charCodeAt( pos ) >= 83 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 113 ) || ( info.src.charCodeAt( pos ) >= 115 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 25;
		match_pos = pos;
		break;

	case 59:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 60;
		else state = -1;
		break;

	case 60:
		if( info.src.charCodeAt( pos ) == 84 ) state = 61;
		else state = -1;
		break;

	case 61:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 50 ) ) state = 62;
		else state = -1;
		break;

	case 62:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 63;
		else state = -1;
		break;

	case 63:
		if( info.src.charCodeAt( pos ) == 58 ) state = 64;
		else state = -1;
		break;

	case 64:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 53 ) ) state = 65;
		else state = -1;
		break;

	case 65:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 66;
		else state = -1;
		break;

	case 66:
		if( info.src.charCodeAt( pos ) == 58 ) state = 67;
		else state = -1;
		break;

	case 67:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 53 ) ) state = 68;
		else state = -1;
		break;

	case 68:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 69;
		else state = -1;
		break;

	case 69:
		if( info.src.charCodeAt( pos ) == 90 ) state = 31;
		else if( info.src.charCodeAt( pos ) == 43 || info.src.charCodeAt( pos ) == 45 ) state = 70;
		else if( info.src.charCodeAt( pos ) == 46 ) state = 71;
		else state = -1;
		break;

	case 70:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 50 ) ) state = 79;
		else state = -1;
		break;

	case 71:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 72;
		else state = -1;
		break;

	case 72:
		if( info.src.charCodeAt( pos ) == 90 ) state = 31;
		else if( info.src.charCodeAt( pos ) == 43 || info.src.charCodeAt( pos ) == 45 ) state = 70;
		else if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 72;
		else state = -1;
		break;

	case 73:
		if( info.src.charCodeAt( pos ) == 58 ) state = 74;
		else state = -1;
		break;

	case 74:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 53 ) ) state = 75;
		else state = -1;
		break;

	case 75:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 31;
		else state = -1;
		break;

	case 76:
		if( info.src.charCodeAt( pos ) == 46 ) state = 16;
		else if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 33;
		else state = -1;
		match = 26;
		match_pos = pos;
		break;

	case 77:
		if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 25;
		match_pos = pos;
		break;

	case 78:
		if( info.src.charCodeAt( pos ) == 69 || info.src.charCodeAt( pos ) == 101 ) state = 58;
		else if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 68 ) || ( info.src.charCodeAt( pos ) >= 70 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 25;
		match_pos = pos;
		break;

	case 79:
		if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 73;
		else state = -1;
		break;

	case 80:
		if( info.src.charCodeAt( pos ) == 73 || info.src.charCodeAt( pos ) == 105 ) state = 40;
		else if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 42;
		else if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 72 ) || ( info.src.charCodeAt( pos ) >= 74 && info.src.charCodeAt( pos ) <= 78 ) || ( info.src.charCodeAt( pos ) >= 80 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 104 ) || ( info.src.charCodeAt( pos ) >= 106 && info.src.charCodeAt( pos ) <= 110 ) || ( info.src.charCodeAt( pos ) >= 112 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 25;
		match_pos = pos;
		break;

	case 81:
		if( info.src.charCodeAt( pos ) == 79 || info.src.charCodeAt( pos ) == 111 ) state = 44;
		else if( info.src.charCodeAt( pos ) == 85 || info.src.charCodeAt( pos ) == 117 ) state = 46;
		else if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 78 ) || ( info.src.charCodeAt( pos ) >= 80 && info.src.charCodeAt( pos ) <= 84 ) || ( info.src.charCodeAt( pos ) >= 86 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 110 ) || ( info.src.charCodeAt( pos ) >= 112 && info.src.charCodeAt( pos ) <= 116 ) || ( info.src.charCodeAt( pos ) >= 118 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 25;
		match_pos = pos;
		break;

	case 82:
		if( info.src.charCodeAt( pos ) == 80 || info.src.charCodeAt( pos ) == 112 ) state = 48;
		else if( info.src.charCodeAt( pos ) == 45 || ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) || ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 79 ) || ( info.src.charCodeAt( pos ) >= 81 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 111 ) || ( info.src.charCodeAt( pos ) >= 113 && info.src.charCodeAt( pos ) <= 122 ) ) state = 77;
		else state = -1;
		match = 25;
		match_pos = pos;
		break;

	case 83:
		if( info.src.charCodeAt( pos ) == 46 ) state = 16;
		else if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 76;
		else state = -1;
		match = 26;
		match_pos = pos;
		break;

	case 84:
		if( info.src.charCodeAt( pos ) == 46 ) state = 16;
		else if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 84;
		else state = -1;
		match = 26;
		match_pos = pos;
		break;

	case 85:
		if( info.src.charCodeAt( pos ) == 46 ) state = 16;
		else if( ( info.src.charCodeAt( pos ) >= 48 && info.src.charCodeAt( pos ) <= 57 ) ) state = 85;
		else state = -1;
		match = 26;
		match_pos = pos;
		break;

}


			pos++;

		}
		while( state > -1 );

	}
	while( 1 > -1 && match == 1 );

	if( match > -1 )
	{
		info.att = info.src.substr( start, match_pos - start );
		info.offset = match_pos;
		
switch( match )
{
	case 29:
		{
		 info.att = parseString(info.att); 
		}
		break;

	case 31:
		{
		 alert("match namespace "+info.att); 
		}
		break;

}


	}
	else
	{
		info.att = new String();
		match = -1;
	}

	return match;
}


function __parse( src, err_off, err_la )
{
	var		sstack			= new Array();
	var		vstack			= new Array();
	var 	err_cnt			= 0;
	var		act;
	var		go;
	var		la;
	var		rval;
	var 	parseinfo		= new Function( "", "var offset; var src; var att;" );
	var		info			= new parseinfo();
	
	//Visual parse tree generation
	var 	treenode		= new Function( "", "var sym; var att; var child;" );
	var		treenodes		= new Array();
	var		tree			= new Array();
	var		tmptree			= null;

/* Pop-Table */
var pop_tab = new Array(
	new Array( 0/* where_expression' */, 1 ),
	new Array( 33/* where_expression */, 1 ),
	new Array( 32/* expression */, 3 ),
	new Array( 32/* expression */, 3 ),
	new Array( 32/* expression */, 2 ),
	new Array( 32/* expression */, 3 ),
	new Array( 32/* expression */, 3 ),
	new Array( 32/* expression */, 3 ),
	new Array( 32/* expression */, 3 ),
	new Array( 32/* expression */, 3 ),
	new Array( 32/* expression */, 3 ),
	new Array( 32/* expression */, 3 ),
	new Array( 32/* expression */, 3 ),
	new Array( 32/* expression */, 3 ),
	new Array( 32/* expression */, 3 ),
	new Array( 32/* expression */, 3 ),
	new Array( 32/* expression */, 3 ),
	new Array( 32/* expression */, 3 ),
	new Array( 32/* expression */, 3 ),
	new Array( 32/* expression */, 3 ),
	new Array( 32/* expression */, 3 ),
	new Array( 32/* expression */, 5 ),
	new Array( 32/* expression */, 3 ),
	new Array( 32/* expression */, 1 ),
	new Array( 37/* propExpr */, 4 ),
	new Array( 37/* propExpr */, 1 ),
	new Array( 36/* literalList */, 1 ),
	new Array( 36/* literalList */, 3 ),
	new Array( 34/* propertyReference */, 1 ),
	new Array( 34/* propertyReference */, 1 ),
	new Array( 38/* simplePropertyRef */, 2 ),
	new Array( 38/* simplePropertyRef */, 1 ),
	new Array( 39/* modifiedPropertyRef */, 4 ),
	new Array( 39/* modifiedPropertyRef */, 4 ),
	new Array( 35/* literal */, 1 ),
	new Array( 35/* literal */, 1 ),
	new Array( 35/* literal */, 1 ),
	new Array( 35/* literal */, 1 )
);

/* Action-Table */
var act_tab = new Array(
	/* State 0 */ new Array( 4/* "NOT" */,3 , 11/* "(" */,5 , 31/* "NAMESPACE_URI" */,9 , 25/* "FIELD_TOKEN" */,10 , 9/* "UPPER" */,11 , 10/* "LOWER" */,12 ),
	/* State 1 */ new Array( 40/* "$" */,0 ),
	/* State 2 */ new Array( 3/* "OR" */,13 , 2/* "AND" */,14 , 40/* "$" */,-1 ),
	/* State 3 */ new Array( 4/* "NOT" */,3 , 11/* "(" */,5 , 31/* "NAMESPACE_URI" */,9 , 25/* "FIELD_TOKEN" */,10 , 9/* "UPPER" */,11 , 10/* "LOWER" */,12 ),
	/* State 4 */ new Array( 6/* "IN" */,16 , 7/* "IS" */,17 , 5/* "LIKE" */,18 , 23/* ">=" */,19 , 21/* ">" */,20 , 22/* "<=" */,21 , 20/* "<" */,22 , 24/* "NOT_EQUAL" */,23 , 19/* "<>" */,24 , 17/* "=" */,25 ),
	/* State 5 */ new Array( 4/* "NOT" */,3 , 11/* "(" */,5 , 31/* "NAMESPACE_URI" */,9 , 25/* "FIELD_TOKEN" */,10 , 9/* "UPPER" */,11 , 10/* "LOWER" */,12 ),
	/* State 6 */ new Array( 40/* "$" */,-23 , 2/* "AND" */,-23 , 3/* "OR" */,-23 , 12/* ")" */,-23 , 16/* "]" */,-23 ),
	/* State 7 */ new Array( 15/* "[" */,27 , 17/* "=" */,-28 , 19/* "<>" */,-28 , 24/* "NOT_EQUAL" */,-28 , 20/* "<" */,-28 , 22/* "<=" */,-28 , 21/* ">" */,-28 , 23/* ">=" */,-28 , 5/* "LIKE" */,-28 , 7/* "IS" */,-28 , 6/* "IN" */,-28 , 16/* "]" */,-28 , 2/* "AND" */,-28 , 3/* "OR" */,-28 ),
	/* State 8 */ new Array( 17/* "=" */,-29 , 19/* "<>" */,-29 , 24/* "NOT_EQUAL" */,-29 , 20/* "<" */,-29 , 22/* "<=" */,-29 , 21/* ">" */,-29 , 23/* ">=" */,-29 , 5/* "LIKE" */,-29 , 7/* "IS" */,-29 , 6/* "IN" */,-29 ),
	/* State 9 */ new Array( 25/* "FIELD_TOKEN" */,28 ),
	/* State 10 */ new Array( 17/* "=" */,-31 , 19/* "<>" */,-31 , 24/* "NOT_EQUAL" */,-31 , 20/* "<" */,-31 , 22/* "<=" */,-31 , 21/* ">" */,-31 , 23/* ">=" */,-31 , 5/* "LIKE" */,-31 , 7/* "IS" */,-31 , 6/* "IN" */,-31 , 15/* "[" */,-31 , 12/* ")" */,-31 ),
	/* State 11 */ new Array( 11/* "(" */,29 ),
	/* State 12 */ new Array( 11/* "(" */,30 ),
	/* State 13 */ new Array( 4/* "NOT" */,3 , 11/* "(" */,5 , 31/* "NAMESPACE_URI" */,9 , 25/* "FIELD_TOKEN" */,10 , 9/* "UPPER" */,11 , 10/* "LOWER" */,12 ),
	/* State 14 */ new Array( 4/* "NOT" */,3 , 11/* "(" */,5 , 31/* "NAMESPACE_URI" */,9 , 25/* "FIELD_TOKEN" */,10 , 9/* "UPPER" */,11 , 10/* "LOWER" */,12 ),
	/* State 15 */ new Array( 3/* "OR" */,13 , 2/* "AND" */,14 , 40/* "$" */,-4 , 12/* ")" */,-4 , 16/* "]" */,-4 ),
	/* State 16 */ new Array( 11/* "(" */,33 ),
	/* State 17 */ new Array( 8/* "NULL" */,34 ),
	/* State 18 */ new Array( 29/* "STRING_LITERAL" */,36 , 26/* "INTEGER_LITERAL" */,37 , 27/* "DECIMAL_LITERAL" */,38 , 28/* "FLOAT_LITERAL" */,39 ),
	/* State 19 */ new Array( 30/* "DATE_LITERAL" */,41 , 29/* "STRING_LITERAL" */,36 , 26/* "INTEGER_LITERAL" */,37 , 27/* "DECIMAL_LITERAL" */,38 , 28/* "FLOAT_LITERAL" */,39 ),
	/* State 20 */ new Array( 30/* "DATE_LITERAL" */,43 , 29/* "STRING_LITERAL" */,36 , 26/* "INTEGER_LITERAL" */,37 , 27/* "DECIMAL_LITERAL" */,38 , 28/* "FLOAT_LITERAL" */,39 ),
	/* State 21 */ new Array( 30/* "DATE_LITERAL" */,45 , 29/* "STRING_LITERAL" */,36 , 26/* "INTEGER_LITERAL" */,37 , 27/* "DECIMAL_LITERAL" */,38 , 28/* "FLOAT_LITERAL" */,39 ),
	/* State 22 */ new Array( 30/* "DATE_LITERAL" */,47 , 29/* "STRING_LITERAL" */,36 , 26/* "INTEGER_LITERAL" */,37 , 27/* "DECIMAL_LITERAL" */,38 , 28/* "FLOAT_LITERAL" */,39 ),
	/* State 23 */ new Array( 30/* "DATE_LITERAL" */,49 , 29/* "STRING_LITERAL" */,36 , 26/* "INTEGER_LITERAL" */,37 , 27/* "DECIMAL_LITERAL" */,38 , 28/* "FLOAT_LITERAL" */,39 ),
	/* State 24 */ new Array( 30/* "DATE_LITERAL" */,51 , 29/* "STRING_LITERAL" */,36 , 26/* "INTEGER_LITERAL" */,37 , 27/* "DECIMAL_LITERAL" */,38 , 28/* "FLOAT_LITERAL" */,39 ),
	/* State 25 */ new Array( 30/* "DATE_LITERAL" */,53 , 29/* "STRING_LITERAL" */,36 , 26/* "INTEGER_LITERAL" */,37 , 27/* "DECIMAL_LITERAL" */,38 , 28/* "FLOAT_LITERAL" */,39 ),
	/* State 26 */ new Array( 3/* "OR" */,13 , 2/* "AND" */,14 , 12/* ")" */,54 ),
	/* State 27 */ new Array( 31/* "NAMESPACE_URI" */,9 , 25/* "FIELD_TOKEN" */,10 , 4/* "NOT" */,3 , 11/* "(" */,5 , 9/* "UPPER" */,11 , 10/* "LOWER" */,12 ),
	/* State 28 */ new Array( 17/* "=" */,-30 , 19/* "<>" */,-30 , 24/* "NOT_EQUAL" */,-30 , 20/* "<" */,-30 , 22/* "<=" */,-30 , 21/* ">" */,-30 , 23/* ">=" */,-30 , 5/* "LIKE" */,-30 , 7/* "IS" */,-30 , 6/* "IN" */,-30 , 15/* "[" */,-30 , 12/* ")" */,-30 ),
	/* State 29 */ new Array( 31/* "NAMESPACE_URI" */,9 , 25/* "FIELD_TOKEN" */,10 ),
	/* State 30 */ new Array( 31/* "NAMESPACE_URI" */,9 , 25/* "FIELD_TOKEN" */,10 ),
	/* State 31 */ new Array( 3/* "OR" */,13 , 2/* "AND" */,14 , 40/* "$" */,-3 , 12/* ")" */,-3 , 16/* "]" */,-3 ),
	/* State 32 */ new Array( 3/* "OR" */,13 , 2/* "AND" */,14 , 40/* "$" */,-2 , 12/* ")" */,-2 , 16/* "]" */,-2 ),
	/* State 33 */ new Array( 29/* "STRING_LITERAL" */,36 , 26/* "INTEGER_LITERAL" */,37 , 27/* "DECIMAL_LITERAL" */,38 , 28/* "FLOAT_LITERAL" */,39 ),
	/* State 34 */ new Array( 40/* "$" */,-20 , 2/* "AND" */,-20 , 3/* "OR" */,-20 , 12/* ")" */,-20 , 16/* "]" */,-20 ),
	/* State 35 */ new Array( 40/* "$" */,-19 , 2/* "AND" */,-19 , 3/* "OR" */,-19 , 12/* ")" */,-19 , 16/* "]" */,-19 ),
	/* State 36 */ new Array( 40/* "$" */,-34 , 2/* "AND" */,-34 , 3/* "OR" */,-34 , 12/* ")" */,-34 , 16/* "]" */,-34 , 18/* "," */,-34 ),
	/* State 37 */ new Array( 40/* "$" */,-35 , 2/* "AND" */,-35 , 3/* "OR" */,-35 , 12/* ")" */,-35 , 16/* "]" */,-35 , 18/* "," */,-35 ),
	/* State 38 */ new Array( 40/* "$" */,-36 , 2/* "AND" */,-36 , 3/* "OR" */,-36 , 12/* ")" */,-36 , 16/* "]" */,-36 , 18/* "," */,-36 ),
	/* State 39 */ new Array( 40/* "$" */,-37 , 2/* "AND" */,-37 , 3/* "OR" */,-37 , 12/* ")" */,-37 , 16/* "]" */,-37 , 18/* "," */,-37 ),
	/* State 40 */ new Array( 40/* "$" */,-11 , 2/* "AND" */,-11 , 3/* "OR" */,-11 , 12/* ")" */,-11 , 16/* "]" */,-11 ),
	/* State 41 */ new Array( 40/* "$" */,-18 , 2/* "AND" */,-18 , 3/* "OR" */,-18 , 12/* ")" */,-18 , 16/* "]" */,-18 ),
	/* State 42 */ new Array( 40/* "$" */,-10 , 2/* "AND" */,-10 , 3/* "OR" */,-10 , 12/* ")" */,-10 , 16/* "]" */,-10 ),
	/* State 43 */ new Array( 40/* "$" */,-17 , 2/* "AND" */,-17 , 3/* "OR" */,-17 , 12/* ")" */,-17 , 16/* "]" */,-17 ),
	/* State 44 */ new Array( 40/* "$" */,-9 , 2/* "AND" */,-9 , 3/* "OR" */,-9 , 12/* ")" */,-9 , 16/* "]" */,-9 ),
	/* State 45 */ new Array( 40/* "$" */,-16 , 2/* "AND" */,-16 , 3/* "OR" */,-16 , 12/* ")" */,-16 , 16/* "]" */,-16 ),
	/* State 46 */ new Array( 40/* "$" */,-8 , 2/* "AND" */,-8 , 3/* "OR" */,-8 , 12/* ")" */,-8 , 16/* "]" */,-8 ),
	/* State 47 */ new Array( 40/* "$" */,-15 , 2/* "AND" */,-15 , 3/* "OR" */,-15 , 12/* ")" */,-15 , 16/* "]" */,-15 ),
	/* State 48 */ new Array( 40/* "$" */,-7 , 2/* "AND" */,-7 , 3/* "OR" */,-7 , 12/* ")" */,-7 , 16/* "]" */,-7 ),
	/* State 49 */ new Array( 40/* "$" */,-14 , 2/* "AND" */,-14 , 3/* "OR" */,-14 , 12/* ")" */,-14 , 16/* "]" */,-14 ),
	/* State 50 */ new Array( 40/* "$" */,-6 , 2/* "AND" */,-6 , 3/* "OR" */,-6 , 12/* ")" */,-6 , 16/* "]" */,-6 ),
	/* State 51 */ new Array( 40/* "$" */,-13 , 2/* "AND" */,-13 , 3/* "OR" */,-13 , 12/* ")" */,-13 , 16/* "]" */,-13 ),
	/* State 52 */ new Array( 40/* "$" */,-5 , 2/* "AND" */,-5 , 3/* "OR" */,-5 , 12/* ")" */,-5 , 16/* "]" */,-5 ),
	/* State 53 */ new Array( 40/* "$" */,-12 , 2/* "AND" */,-12 , 3/* "OR" */,-12 , 12/* ")" */,-12 , 16/* "]" */,-12 ),
	/* State 54 */ new Array( 40/* "$" */,-22 , 2/* "AND" */,-22 , 3/* "OR" */,-22 , 12/* ")" */,-22 , 16/* "]" */,-22 ),
	/* State 55 */ new Array( 16/* "]" */,61 , 2/* "AND" */,-23 , 3/* "OR" */,-23 ),
	/* State 56 */ new Array( 3/* "OR" */,13 , 2/* "AND" */,14 , 16/* "]" */,-25 ),
	/* State 57 */ new Array( 12/* ")" */,62 ),
	/* State 58 */ new Array( 12/* ")" */,63 ),
	/* State 59 */ new Array( 18/* "," */,64 , 12/* ")" */,65 ),
	/* State 60 */ new Array( 12/* ")" */,-26 , 18/* "," */,-26 ),
	/* State 61 */ new Array( 40/* "$" */,-24 , 2/* "AND" */,-24 , 3/* "OR" */,-24 , 12/* ")" */,-24 , 17/* "=" */,-24 , 19/* "<>" */,-24 , 24/* "NOT_EQUAL" */,-24 , 20/* "<" */,-24 , 22/* "<=" */,-24 , 21/* ">" */,-24 , 23/* ">=" */,-24 , 5/* "LIKE" */,-24 , 7/* "IS" */,-24 , 6/* "IN" */,-24 , 16/* "]" */,-24 ),
	/* State 62 */ new Array( 17/* "=" */,-32 , 19/* "<>" */,-32 , 24/* "NOT_EQUAL" */,-32 , 20/* "<" */,-32 , 22/* "<=" */,-32 , 21/* ">" */,-32 , 23/* ">=" */,-32 , 5/* "LIKE" */,-32 , 7/* "IS" */,-32 , 6/* "IN" */,-32 ),
	/* State 63 */ new Array( 17/* "=" */,-33 , 19/* "<>" */,-33 , 24/* "NOT_EQUAL" */,-33 , 20/* "<" */,-33 , 22/* "<=" */,-33 , 21/* ">" */,-33 , 23/* ">=" */,-33 , 5/* "LIKE" */,-33 , 7/* "IS" */,-33 , 6/* "IN" */,-33 ),
	/* State 64 */ new Array( 29/* "STRING_LITERAL" */,36 , 26/* "INTEGER_LITERAL" */,37 , 27/* "DECIMAL_LITERAL" */,38 , 28/* "FLOAT_LITERAL" */,39 ),
	/* State 65 */ new Array( 40/* "$" */,-21 , 2/* "AND" */,-21 , 3/* "OR" */,-21 , 12/* ")" */,-21 , 16/* "]" */,-21 ),
	/* State 66 */ new Array( 12/* ")" */,-27 , 18/* "," */,-27 )
);

/* Goto-Table */
var goto_tab = new Array(
	/* State 0 */ new Array( 33/* where_expression */,1 , 32/* expression */,2 , 34/* propertyReference */,4 , 37/* propExpr */,6 , 38/* simplePropertyRef */,7 , 39/* modifiedPropertyRef */,8 ),
	/* State 1 */ new Array(  ),
	/* State 2 */ new Array(  ),
	/* State 3 */ new Array( 32/* expression */,15 , 34/* propertyReference */,4 , 37/* propExpr */,6 , 38/* simplePropertyRef */,7 , 39/* modifiedPropertyRef */,8 ),
	/* State 4 */ new Array(  ),
	/* State 5 */ new Array( 32/* expression */,26 , 34/* propertyReference */,4 , 37/* propExpr */,6 , 38/* simplePropertyRef */,7 , 39/* modifiedPropertyRef */,8 ),
	/* State 6 */ new Array(  ),
	/* State 7 */ new Array(  ),
	/* State 8 */ new Array(  ),
	/* State 9 */ new Array(  ),
	/* State 10 */ new Array(  ),
	/* State 11 */ new Array(  ),
	/* State 12 */ new Array(  ),
	/* State 13 */ new Array( 32/* expression */,31 , 34/* propertyReference */,4 , 37/* propExpr */,6 , 38/* simplePropertyRef */,7 , 39/* modifiedPropertyRef */,8 ),
	/* State 14 */ new Array( 32/* expression */,32 , 34/* propertyReference */,4 , 37/* propExpr */,6 , 38/* simplePropertyRef */,7 , 39/* modifiedPropertyRef */,8 ),
	/* State 15 */ new Array(  ),
	/* State 16 */ new Array(  ),
	/* State 17 */ new Array(  ),
	/* State 18 */ new Array( 35/* literal */,35 ),
	/* State 19 */ new Array( 35/* literal */,40 ),
	/* State 20 */ new Array( 35/* literal */,42 ),
	/* State 21 */ new Array( 35/* literal */,44 ),
	/* State 22 */ new Array( 35/* literal */,46 ),
	/* State 23 */ new Array( 35/* literal */,48 ),
	/* State 24 */ new Array( 35/* literal */,50 ),
	/* State 25 */ new Array( 35/* literal */,52 ),
	/* State 26 */ new Array(  ),
	/* State 27 */ new Array( 37/* propExpr */,55 , 38/* simplePropertyRef */,7 , 32/* expression */,56 , 34/* propertyReference */,4 , 39/* modifiedPropertyRef */,8 ),
	/* State 28 */ new Array(  ),
	/* State 29 */ new Array( 38/* simplePropertyRef */,57 ),
	/* State 30 */ new Array( 38/* simplePropertyRef */,58 ),
	/* State 31 */ new Array(  ),
	/* State 32 */ new Array(  ),
	/* State 33 */ new Array( 36/* literalList */,59 , 35/* literal */,60 ),
	/* State 34 */ new Array(  ),
	/* State 35 */ new Array(  ),
	/* State 36 */ new Array(  ),
	/* State 37 */ new Array(  ),
	/* State 38 */ new Array(  ),
	/* State 39 */ new Array(  ),
	/* State 40 */ new Array(  ),
	/* State 41 */ new Array(  ),
	/* State 42 */ new Array(  ),
	/* State 43 */ new Array(  ),
	/* State 44 */ new Array(  ),
	/* State 45 */ new Array(  ),
	/* State 46 */ new Array(  ),
	/* State 47 */ new Array(  ),
	/* State 48 */ new Array(  ),
	/* State 49 */ new Array(  ),
	/* State 50 */ new Array(  ),
	/* State 51 */ new Array(  ),
	/* State 52 */ new Array(  ),
	/* State 53 */ new Array(  ),
	/* State 54 */ new Array(  ),
	/* State 55 */ new Array(  ),
	/* State 56 */ new Array(  ),
	/* State 57 */ new Array(  ),
	/* State 58 */ new Array(  ),
	/* State 59 */ new Array(  ),
	/* State 60 */ new Array(  ),
	/* State 61 */ new Array(  ),
	/* State 62 */ new Array(  ),
	/* State 63 */ new Array(  ),
	/* State 64 */ new Array( 35/* literal */,66 ),
	/* State 65 */ new Array(  ),
	/* State 66 */ new Array(  )
);



/* Symbol labels */
var labels = new Array(
	"where_expression'" /* Non-terminal symbol */,
	"WHITESPACE" /* Terminal symbol */,
	"AND" /* Terminal symbol */,
	"OR" /* Terminal symbol */,
	"NOT" /* Terminal symbol */,
	"LIKE" /* Terminal symbol */,
	"IN" /* Terminal symbol */,
	"IS" /* Terminal symbol */,
	"NULL" /* Terminal symbol */,
	"UPPER" /* Terminal symbol */,
	"LOWER" /* Terminal symbol */,
	"(" /* Terminal symbol */,
	")" /* Terminal symbol */,
	"{" /* Terminal symbol */,
	"}" /* Terminal symbol */,
	"[" /* Terminal symbol */,
	"]" /* Terminal symbol */,
	"=" /* Terminal symbol */,
	"," /* Terminal symbol */,
	"<>" /* Terminal symbol */,
	"<" /* Terminal symbol */,
	">" /* Terminal symbol */,
	"<=" /* Terminal symbol */,
	">=" /* Terminal symbol */,
	"NOT_EQUAL" /* Terminal symbol */,
	"FIELD_TOKEN" /* Terminal symbol */,
	"INTEGER_LITERAL" /* Terminal symbol */,
	"DECIMAL_LITERAL" /* Terminal symbol */,
	"FLOAT_LITERAL" /* Terminal symbol */,
	"STRING_LITERAL" /* Terminal symbol */,
	"DATE_LITERAL" /* Terminal symbol */,
	"NAMESPACE_URI" /* Terminal symbol */,
	"expression" /* Non-terminal symbol */,
	"where_expression" /* Non-terminal symbol */,
	"propertyReference" /* Non-terminal symbol */,
	"literal" /* Non-terminal symbol */,
	"literalList" /* Non-terminal symbol */,
	"propExpr" /* Non-terminal symbol */,
	"simplePropertyRef" /* Non-terminal symbol */,
	"modifiedPropertyRef" /* Non-terminal symbol */,
	"$" /* Terminal symbol */
);


	
	info.offset = 0;
	info.src = src;
	info.att = new String();
	
	if( !err_off )
		err_off	= new Array();
	if( !err_la )
	err_la = new Array();
	
	sstack.push( 0 );
	vstack.push( 0 );
	
	la = __lex( info );
			
	while( true )
	{
		act = 68;
		for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
		{
			if( act_tab[sstack[sstack.length-1]][i] == la )
			{
				act = act_tab[sstack[sstack.length-1]][i+1];
				break;
			}
		}

		
		if( _dbg_withtrace && sstack.length > 0 )
		{
			__dbg_print( "\nState " + sstack[sstack.length-1] + "\n" +
							"\tLookahead: " + labels[la] + " (\"" + info.att + "\")\n" +
							"\tAction: " + act + "\n" + 
							"\tSource: \"" + info.src.substr( info.offset, 30 ) + ( ( info.offset + 30 < info.src.length ) ?
									"..." : "" ) + "\"\n" +
							"\tStack: " + sstack.join() + "\n" +
							"\tValue stack: " + vstack.join() + "\n" );
			
			if( _dbg_withstepbystep )
				__dbg_wait();
		}
		
			
		//Panic-mode: Try recovery when parse-error occurs!
		if( act == 68 )
		{
			if( _dbg_withtrace )
				__dbg_print( "Error detected: There is no reduce or shift on the symbol " + labels[la] );
			
			err_cnt++;
			err_off.push( info.offset - info.att.length );			
			err_la.push( new Array() );
			for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
				err_la[err_la.length-1].push( labels[act_tab[sstack[sstack.length-1]][i]] );
			
			//Remember the original stack!
			var rsstack = new Array();
			var rvstack = new Array();
			for( var i = 0; i < sstack.length; i++ )
			{
				rsstack[i] = sstack[i];
				rvstack[i] = vstack[i];
			}
			
			while( act == 68 && la != 40 )
			{
				if( _dbg_withtrace )
					__dbg_print( "\tError recovery\n" +
									"Current lookahead: " + labels[la] + " (" + info.att + ")\n" +
									"Action: " + act + "\n\n" );
				if( la == -1 )
					info.offset++;
					
				while( act == 68 && sstack.length > 0 )
				{
					sstack.pop();
					vstack.pop();
					
					if( sstack.length == 0 )
						break;
						
					act = 68;
					for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
					{
						if( act_tab[sstack[sstack.length-1]][i] == la )
						{
							act = act_tab[sstack[sstack.length-1]][i+1];
							break;
						}
					}
				}
				
				if( act != 68 )
					break;
				
				for( var i = 0; i < rsstack.length; i++ )
				{
					sstack.push( rsstack[i] );
					vstack.push( rvstack[i] );
				}
				
				la = __lex( info );
			}
			
			if( act == 68 )
			{
				if( _dbg_withtrace )
					__dbg_print( "\tError recovery failed, terminating parse process..." );
				break;
			}


			if( _dbg_withtrace )
				__dbg_print( "\tError recovery succeeded, continuing" );
		}
		
		
		
		//Shift
		if( act > 0 )
		{
			//Parse tree generation
			if( _dbg_withparsetree )
			{
				var node = new treenode();
				node.sym = labels[ la ];
				node.att = info.att;
				node.child = new Array();
				tree.push( treenodes.length );
				treenodes.push( node );
			}
			
			if( _dbg_withtrace )
				__dbg_print( "Shifting symbol: " + labels[la] + " (" + info.att + ")" );
		
			sstack.push( act );
			vstack.push( info.att );
			
			la = __lex( info );
			
			if( _dbg_withtrace )
				__dbg_print( "\tNew lookahead symbol: " + labels[la] + " (" + info.att + ")" );
		}
		//Reduce
		else
		{		
			act *= -1;
			
			if( _dbg_withtrace )
				__dbg_print( "Reducing by producution: " + act );
			
			rval = void(0);
			
			if( _dbg_withtrace )
				__dbg_print( "\tPerforming semantic action..." );
			
switch( act )
{
	case 0:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 1:
	{
		 this.parsedValue = typeof(vstack[ vstack.length - 1 ].parseNode=="function")?vstack[ vstack.length - 1 ].parseNode(this.mappingHandler):vstack[ vstack.length - 1 ]; 
	}
	break;
	case 2:
	{
		 rval = new CompositExpNode(vstack[ vstack.length - 3 ] , "&" , vstack[ vstack.length - 1 ]); 
	}
	break;
	case 3:
	{
		 rval = new CompositExpNode(vstack[ vstack.length - 3 ] , "|" , vstack[ vstack.length - 1 ]); 
	}
	break;
	case 4:
	{
		 rval = new NotExprNode(vstack[ vstack.length - 1 ]); 
	}
	break;
	case 5:
	{
		 rval = new ExpressionNode(vstack[ vstack.length - 3 ] , "=" , vstack[ vstack.length - 1 ]); 
	}
	break;
	case 6:
	{
		 rval = new ExpressionNode(vstack[ vstack.length - 3 ] , "<>" , vstack[ vstack.length - 1 ]); 
	}
	break;
	case 7:
	{
		 rval = new ExpressionNode(vstack[ vstack.length - 3 ] , "<>" , vstack[ vstack.length - 1 ]); 
	}
	break;
	case 8:
	{
		 rval = new ExpressionNode(vstack[ vstack.length - 3 ] , "<" , vstack[ vstack.length - 1 ]); 
	}
	break;
	case 9:
	{
		 rval = new ExpressionNode(vstack[ vstack.length - 3 ] , "<=" , vstack[ vstack.length - 1 ]); 
	}
	break;
	case 10:
	{
		 rval = new ExpressionNode(vstack[ vstack.length - 3 ] , ">" , vstack[ vstack.length - 1 ]); 
	}
	break;
	case 11:
	{
		 rval = new ExpressionNode(vstack[ vstack.length - 3 ] , ">=" , vstack[ vstack.length - 1 ]); 
	}
	break;
	case 12:
	{
		 rval = new ExpressionNode(vstack[ vstack.length - 3 ] , "=" , parseToSCDate(vstack[ vstack.length - 1 ])); 
	}
	break;
	case 13:
	{
		 rval = new ExpressionNode(vstack[ vstack.length - 3 ] , "<>" , parseToISODate(vstack[ vstack.length - 1 ])); 
	}
	break;
	case 14:
	{
		 rval = new ExpressionNode(vstack[ vstack.length - 3 ] , "<>" , parseToISODate(vstack[ vstack.length - 1 ])); 
	}
	break;
	case 15:
	{
		 rval = new ExpressionNode(vstack[ vstack.length - 3 ] , "<" , parseToISODate(vstack[ vstack.length - 1 ])); 
	}
	break;
	case 16:
	{
		 rval = new ExpressionNode(vstack[ vstack.length - 3 ] , "<=" , parseToISODate(vstack[ vstack.length - 1 ])); 
	}
	break;
	case 17:
	{
		 rval = new ExpressionNode(vstack[ vstack.length - 3 ] , ">" , parseToISODate(vstack[ vstack.length - 1 ])); 
	}
	break;
	case 18:
	{
		 rval = new ExpressionNode(vstack[ vstack.length - 3 ] , ">=" , parseToISODate(vstack[ vstack.length - 1 ])); 
	}
	break;
	case 19:
	{
		 rval = new ExpressionNode( vstack[ vstack.length - 3 ], " like ", vstack[ vstack.length - 1 ]); 
	}
	break;
	case 20:
	{
		 rval = new IsNullExprNode(vstack[ vstack.length - 3 ]); 
	}
	break;
	case 21:
	{
		 rval = new InClauseExprNode(vstack[ vstack.length - 5 ],vstack[ vstack.length - 2 ]); 
	}
	break;
	case 22:
	{
		 rval = new ParenthesisExprNode( vstack[ vstack.length - 2 ]); 
	}
	break;
	case 23:
	{
		 rval = new ParenthesisExprNode( vstack[ vstack.length - 1 ]); 
	}
	break;
	case 24:
	{
		 rval = new PropertyExprNode(vstack[ vstack.length - 4 ], vstack[ vstack.length - 2 ]); 
	}
	break;
	case 25:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 26:
	{
		 rval = createLiteralList(vstack[ vstack.length - 1 ]); 
	}
	break;
	case 27:
	{
		 rval = addToLiteralList(vstack[ vstack.length - 3 ], vstack[ vstack.length - 1 ]); 
	}
	break;
	case 28:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 29:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 30:
	{
		 rval = vstack[ vstack.length - 2 ] + vstack[ vstack.length - 1 ]; 
	}
	break;
	case 31:
	{
		 rval = vstack[ vstack.length - 1 ];  
	}
	break;
	case 32:
	{
		 rval = new ModifiedPropertyRef("toupper",vstack[ vstack.length - 2 ]); 
	}
	break;
	case 33:
	{
		 rval = new ModifiedPropertyRef("tolower",vstack[ vstack.length - 2 ]); 
	}
	break;
	case 34:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 35:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 36:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 37:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
}


			
			if( _dbg_withparsetree )
				tmptree = new Array();

			if( _dbg_withtrace )
				__dbg_print( "\tPopping " + pop_tab[act][1] + " off the stack..." );
				
			for( var i = 0; i < pop_tab[act][1]; i++ )
			{
				if( _dbg_withparsetree )
					tmptree.push( tree.pop() );
					
				sstack.pop();
				vstack.pop();
			}
									
			go = -1;
			for( var i = 0; i < goto_tab[sstack[sstack.length-1]].length; i+=2 )
			{
				if( goto_tab[sstack[sstack.length-1]][i] == pop_tab[act][0] )
				{
					go = goto_tab[sstack[sstack.length-1]][i+1];
					break;
				}
			}
			
			if( _dbg_withparsetree )
			{
				var node = new treenode();
				node.sym = labels[ pop_tab[act][0] ];
				node.att = new String();
				node.child = tmptree.reverse();
				tree.push( treenodes.length );
				treenodes.push( node );
			}
			
			if( act == 0 )
				break;
				
			if( _dbg_withtrace )
				__dbg_print( "\tPushing non-terminal " + labels[ pop_tab[act][0] ] );
				
			sstack.push( go );
			vstack.push( rval );			
		}
	}

	if( _dbg_withtrace )
		__dbg_print( "\nParse complete." );

	if( _dbg_withparsetree )
	{
		if( err_cnt == 0 )
		{
			__dbg_print( "\n\n--- Parse tree ---" );
			__dbg_parsetree( 0, treenodes, tree );
		}
		else
		{
			__dbg_print( "\n\nParse tree cannot be viewed. There where parse errors." );
		}
	}
	
	return err_cnt;
}


function __dbg_parsetree( indent, nodes, tree )
{
	var str = new String();
	for( var i = 0; i < tree.length; i++ )
	{
		str = "";
		for( var j = indent; j > 0; j-- )
			str += "\t";
		
		str += nodes[ tree[i] ].sym;
		if( nodes[ tree[i] ].att != "" )
			str += " >" + nodes[ tree[i] ].att + "<" ;
			
		__dbg_print( str );
		if( nodes[ tree[i] ].child.length > 0 )
			__dbg_parsetree( indent + 1, nodes, nodes[ tree[i] ].child );
	}
}


var arrayRegexp = / /.compile("([^\\[]+)\\s*\\[[0-9]*\\]");
function parseToSMField(mappingHandler,bdmFieldName){
	var r = mappingHandler.map2smField( bdmFieldName, true);
	var matcher = r.match(arrayRegexp);
	if(matcher!=null){
		r = matcher[1];
	}
	debug("parseToSMField():"+bdmFieldName+" -> "+r);
	return r;
}

function parseToSMValue(mappingHandler,bdmFieldName,bdmValue){
	var result;
	var q = bdmValue.charAt(0);
	q = ( q == '\'' || q == '"' ? q : '' );
	bdmValue = ( q == '' ? bdmValue : bdmValue.substring( 1, bdmValue.length-1 ) );
	var fv = mappingHandler.map2smFieldValue( bdmFieldName, bdmValue,true);
	if(fv[0]==''){
		throw new Error("BDM Query parse error: the BDM field \""+bdmFieldName+"\" doesn't exist!");
	}
	if( q == '\'' || q == '"' ) {
		var mapping = mappingHandler.getMappingConfigItemBySmField( fv[0], BDM2SM );
		if(mapping == null){
			debug("__new_TrimFieldHandler() invert");
			mapping = mappingHandler.getMappingConfigItemBySmField( fv[0], SM2BDM );
		}
		if( lib.BDM_Mapping.isSMFieldType_String( mapping )
			|| lib.BDM_Mapping.isSMFieldType_Datetime( mapping ) ) {
			result = q + ( lib.BDM_Mapping.isSMFieldType_Datetime( mapping ) ? bdmValue : fv[1] ) + q;
		}else {
			result = fv[1];
		}
	}else {
		result = fv[1];
	}
	
	debug("parseToSMValue():"+bdmValue+" -> "+result);
	return result;
}

var likeClauseRegexp = / /.compile("\"([^%_]+)(%|_)?\"");
function likeClauseTrim(likeClause){
	var d = likeClause.match(likeClauseRegexp);
	if(d!=null){
		return "\""+d[1]+"\"";
	}else{
		throw new Error("SM Query only supports using LIKE operator in \"LIKE 'XXX%'\" or LIKE 'XXX' format. ");
	}
}

var ModifiedPropertyRef  = function ModifiedPropertyRef(functionName,field){
	this.func = functionName;
	this.field = field;
}
ModifiedPropertyRef.prototype = {
	parseNode:function parseNode(mh){
		return this.func+"("+parseToSMField(mh,this.field)+")";
	},
	setAsSubProperty:function setAsSubProperty(parentName){
		this.field = parentName+"/"+this.field;
	}
}
//-------- NotExprNode ------------

var NotExprNode = function NotExprNode(subExpressionNode){
	this.childNode = subExpressionNode;
};
NotExprNode.prototype = {
	parseNode:function parseNode(mappingHandler){
		var expr;
		if(this.childNode.parseNode instanceof Function){
			expr = this.childNode.parseNode(mappingHandler);
		}else{
			expr = this.childNode;
		}
		
		return " not ("+expr+")";
	},
	
	setAsSubProperty:function setAsSubProperty(parentName){
		if(this.childNode.setAsSubProperty){
			this.childNode.setAsSubProperty(parentName);
		}
	}
};
// ------- PropertyExprNode -------------
var PropertyExprNode = function PropertyExprNode(simplePropertyRef,subPropExpression){
	this.ref = simplePropertyRef;
	this.expressionNode = subPropExpression;
	this.isRootProperty = true;
};
PropertyExprNode.prototype = {
	setExpNode:function setExpNode(node){
		this.expressionNode = node;
	},
	parseNode:function parseNode(mappingHandler){
		
		if(this.isRootProperty){
			debug("PropertyExprNode.parseNode() "+this.ref);
			if(typeof(this.expressionNode.setAsSubProperty)=="function"){
				this.expressionNode.setAsSubProperty(this.ref);
			}
		}
		if(typeof(this.expressionNode.parseNode)=="function"){
			return this.expressionNode.parseNode(mappingHandler);
		}
	},
	setAsSubProperty:function setAsSubProperty(parentName){
		if(typeof(this.expressionNode.setAsSubProperty)=="function"){
			this.expressionNode.setAsSubProperty(parentName+"/"+this.ref);
		}
		this.isRootProperty = false;
	},
	findExpression:function (){
		var node = this;
		while(node instanceof PropertyExprNode){
			node = node.expressionNode;
		}
		return node;
	},
	invert:function invert(){
		this.findExpression().invert();
	}
};
//--------- InClauseExprNode --------------

var InClauseExprNode = function InClauseExprNode(field,list){
	this.field = field;
	this.inList = list;
	this.andOperator = '|';
	
};
InClauseExprNode.prototype = {
	parseNode:function parseNode(mh){
		var result = [];
			//use SM native operator isin {...}
			if(this.field.parseNode instanceof Function){
				result.push(this.field.parseNode(mh));
			}else{
				result.push(parseToSMField(mh,this.field));
			}
			result.push(" isin {");
			for(var i = 0,l=this.inList.length;i<l;i++){
				if(i!=0){
					result.push(",");
				}
				if(typeof(this.field) =="string"){
					result.push(parseToSMValue(mh,this.field,this.inList[i]));
				}else{
					result.push(this.inList[i]);
				}
			}
			result.push("}");
		return result.join("");
		
	},
	setAsSubProperty:function setAsSubProperty(parentName){
		if(this.field.setAsSubProperty instanceof Function){
			this.field.setAsSubProperty(parentName);
		}else{
			this.field = parentName+"/"+this.field;
		}
	},
	invert:function invert(){
		if(this.andOperator == "|")
			this.andOperator = "&";
		else
			this.andOperator = "|";
		for(var i = 0,l=this.exprList.length;i<l;i++){
			this.exprList[i].invert();
		}
	}
};

//--------- IsNullExprNode ----------------
var IsNullExprNode = function IsNullExprNode(field){
	this.field = field;
}
IsNullExprNode.prototype = {
	parseNode:function parseNode(mh){
		if(this.field.parseNode instanceof Function){
			return "("+this.field.parseNode(mh)+") = NULL";
		}else{
			return parseToSMField(mh,this.field)+" = NULL";
		}
	},
	setAsSubProperty:function setAsSubProperty(parentName){
		this.field = parentName+"/"+this.field;
	}
}
//--------- ParenthesisExprNode ------------

var ParenthesisExprNode = function ParenthesisExprNode(subnode){
	this.childNode = subnode;
};
ParenthesisExprNode.prototype={
	parseNode:function parseNode(mappingHandler){
		var type = typeof(this.childNode);
		var parsedString;
		if(type!= "string" && type!="number"){
			parsedString = this.childNode.parseNode(mappingHandler);
		}else{
			parsedString = this.childNode;
		}
		return "("+parsedString+")";
	},
	setAsSubProperty:function setAsSubProperty(parentName){
		if(this.childNode.setAsSubProperty){
			this.childNode.setAsSubProperty(parentName);
		}
	},
	invert:function invert(){
		this.childNode.invert();
	}
};

//---------- ExpressionNode -----------
var ExpressionNode = function ExpressionNode(propertyReference, operator, literal){
	debug(" new ExpressionNode "+propertyReference+", "+operator+", "+literal);
	this.ref = propertyReference;
	this.operator = operator;
	this.literal = literal;
};
ExpressionNode.prototype={
	getFieldName:function getFieldName(){
		return this.ref;
	},
	setFieldName:function setFieldName(s){
		this.ref = s;
	},
	setAsSubProperty:function setAsSubProperty(parentName){
		if(typeof(this.getFieldName())=="string"){
			this.setFieldName(parentName+"/"+this.getFieldName());
		}else{
			this.getFieldName().setAsSubProperty(parentName);
		}
	},
	setOperator:function(o){
		this.operator = o;
	},
	getOperator:function(){
		return this.operator;
	},
	parseNode:function parseNode(mappingHandler){
		var result;
		if(this.operator!="#"){
			if(typeof( this.ref) == "string"){
				result = parseToSMField(mappingHandler,this.ref) +" "+ this.operator+" "+ parseToSMValue(mappingHandler,this.ref,this.literal);
			}else{
				result = this.ref.parseNode(mappingHandler) +" "+ this.operator+" "+ this.literal;
			}
		}else{
			result = parseToSMField(mappingHandler,this.ref) +" "+ this.operator+" "+ this.literal;
		}
		return result;
	},
	invert:function invert(){
		switch(this.operator){
		case "=":
			this.operator = "<>";
			break;
		case "<":
			this.operator = ">=";
			break;
		case ">":
			this.operator = "<=";
			break;
		case "<=":
			this.operator = ">";
			break;
		case ">=":
			this.operator = "<";
			break;
		case "<>":
		case "!=":
			this.operator = "=";
			break;
		}
	}
};
//------- CompositExpNode ---------
var CompositExpNode = function CompositExpNode(expression1, andOperator, expression2){
	this.expr1 = expression1;
	this.expr2 = expression2;
	this.operator = andOperator;
};
CompositExpNode.prototype = {
	setAsSubProperty:function setAsSubProperty(parentName){
		if(typeof(this.expr1.setAsSubProperty)=="function"){
			this.expr1.setAsSubProperty(parentName);
		}
		if(typeof(this.expr2.setAsSubProperty)=="function"){
			this.expr2.setAsSubProperty(parentName);
		}
	},
	parseNode:function parseNode(mappingHandler){
		var e1,e2;
		if(typeof(this.expr1.parseNode)=="function"){
			e1 = this.expr1.parseNode(mappingHandler);
		}else{
			e1 = this.expr1;
		}
		if(typeof(this.expr2.parseNode)=="function"){
			e2 = this.expr2.parseNode(mappingHandler);
		}else{
			e2 = this.expr2;
		}
		return e1+" "+this.operator+" "+e2;
	},
	invert:function invert(){
		switch(this.operator){
		case "&":
			this.operator = "|";
			break;
		case "|":
			this.operator = "&";
			break;
		}
		if(typeof(this.expr1.invert)=="function"){
			this.expr1.invert();
		}else{
			this.expr1 = (this.expr1=="false"?"true":"false");
		}
		if(typeof(this.expr2.invert)=="function"){
			this.expr2.invert();
		}else{
			this.expr2 = (this.expr2=="false"?"true":"false");
		}
	}
};




function __trimString( str, c ) {
	if( str == null || str == "" ) {
		return "";
	}
	return str.replace(new RegExp('\^' + c + '+|' + c + '+$', 'g'), '');
}



/* TODO: This is the context for the properties that will be evaluated. An object should
	be pushed onto this array before calling parse with the expression. The object
	might be an XML element, a database table and row, or some other object that provides
	the context for the properties. LookupProperty and lookupNamespaceProperty will use
	this context to find the property values.
 */
var propertyContext = new Array();

function parseToSCDate(str){
	return "\""+new XMLDate(str).getSCDateTimeString()+"\"";
}

var replaceDateRegex = /([\d\-:]+)T([\d:]+).*/.compile("([\\d\\-:]+)T([\\d:]+).*");

function parseToISODate(str){
	var d = str.match(replaceDateRegex);
	return "\""+d[1]+" "+d[2]+"\"";
}


function numToString(d)
{
  var s = new String(d);
  if (s.length < 2) s = "0" + s;
  return s;
}

function parseString(s)
{
  // Change single quotes to double quotes
  return "\"" + s.slice(1, s.length - 1) + "\"";
}

function createLiteralList(obj)
{
	var list = new Array(1);
	list[0] = obj;
	return list;
}

function addToLiteralList(list, obj)
{
	list.push(obj);
	return list;
}

function literalListContains(list, obj)
{
  if (list.length < 1)
    return "";
  var response = "isMemberOf({ ";
  for (var i = 0; i < list.length; ++i)
  {
    if (i > 0) response += ", ";
    response += list[i];
  }
  response += "}, " + obj + ")";
  return response;
}

function pushContext(property)
{
	propertyContext.push(property);
}

function popContext()
{
	propertyContext.pop();
}



/* Switching one of these variables on will enable debug facilities
	of the various parser drivers */
function BDMQueryParser(){
    this.error_offsets = new Array();
    this.error_lookaheads = new Array();
    this.error_count = 0;
    this._parse = __parse;
	this.__trimFieldHandlers = new Array();
}

BDMQueryParser.prototype={
    parse:function parse( _mappingHandler, str ) {
	this.mappingHandler = _mappingHandler;
	if( ( this.error_count = this._parse( str, this.error_offsets, this.error_lookaheads ) ) > 0 )
	{
	    this._storeErrorMessage(str);
	}
	return this.parsedValue;
    },
    
    _storeErrorMessage:function(str){
	var message = [];
	for( var i = 0; i < this.error_count; i++ ){
	    var m = "Parse error near \"" + str.substr( this.error_offsets[i] ) +
		"\", expecting \"" + this.error_lookaheads[i].join() + "\"";
	    alert(m);
	    message.push(m);
	}
	this.errorMessage = message.join("\n");
    },
    
    getErrorMessages:function(){
	return this.errorMessage;
    },
    
    getParsedValue:function(){
	return this.parsedValue;
    }

};

function debug(a){
}
function alert(a){
	print(a);
}


