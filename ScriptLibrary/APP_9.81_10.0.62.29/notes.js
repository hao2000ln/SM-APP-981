function formatNotes( note )
{
	var html;
	var strColumnWidth = "width=\"33%\"";
	var	 strRowClass;
	var detail = "";
	var date;
	var row = 0;
	var user;
	if ( note.notes != null )
	{
		html = lib.htmlTemplates.getBasicListTemplate() +
				"<DIV class=\"resultTable\"><TABLE class=\"listTable\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">";
		
		html += "<TR valign=top CLASS=\"oddRow\">"+
				"<TD><B>" + system.functions.scmsg(2, "notes" ) + "</TD>"+
				"<TD><B>" + system.functions.scmsg(3, "notes" ) + "</TD>"+
				"<TD><B>" + system.functions.scmsg(1, "notes" ) + "</TD></TR>";

		for ( i=0; i < note.notes.length(); i++ )
		{
			user = note.notes[i].user;
			date = system.functions.str( note.notes[i].date );
			detail = "";
			for ( j=0; j< note.notes[i].detail.length(); j++ )
			{
				if ( note.notes[i].detail[j] != null )
				{
					detail += note.notes[i].detail[j]+ "<br>";
				}
				else
				{
					detail += "<br>";
				}
			}
			

			strRowClass = i%2==0 ? "evenRow" : "oddRow";
			html += "<TR valign=top CLASS=\""+ strRowClass +"\">";
			html += "<TD width=\"20%\" >" + user  + " </TD>";
			html += "<TD width=\"20%\" >" + date + "</TD>";
			html += "<TD>" + detail + "</TD>";
			html += "</TR>";

		}
	
		
		html += "</TABLE>";	
	}
	return html;
}