

function parseData( condition, sourceTable )
{
	var i = 1;
	var xml = new XML();

	if ( xml.setContent( condition ) )
	{
		vars.$L_sourceTable = sourceTable;
		
		var expressions = xml.getFirstChildElement();
		
		if ( expressions != null )
		{
			var expr = expressions.getFirstChildElement();
			
			while ( expr != null )
			{
				var fieldName = "vars.$L_sourceOperand" + i;
				var operatorName = "vars.$L_operator" + i;
				var targetName = "vars.$L_targetOperand" + i;
				var compoundCond	= "vars.$L_condition" + i;
				eval( fieldName + "=\"" +expr.getAttributeValue( "sourceOperand" )+"\"" );
				eval( operatorName + "=\"" + expr.getAttributeValue( "operator" )+"\"" );
				eval( targetName + "=\"" + expr.getAttributeValue( "targetOperand" )+"\"" );
				eval( compoundCond + "=\"" + expr.getAttributeValue( "compound" )+"\"" );
				
				i++;
				expr = expr.getNextSiblingElement();
				
			}
		}
	}
	return i;
}

function setCondition( )
{
	var condition = new XML("condtion");
	condition.setAttributeValue("type", "simple");
	condition.setAttributeValue("sourceTable", vars.$L_sourceTable );

	var expressions = new XML("expressions");

	
	for (var i=0; i<10; i++ )
	{
		var position = i + 1;
		var compound = vars.$L_condition_type;

		var field = eval( "vars.$L_sourceOperand"+ position  );
		var compound = eval( "vars.$L_condition" + position );
		if ( field != null && field !="" && field !=" " || compound == ")" )
		{
			var expr = new XML("expression");
			var operator = eval( "vars.$L_operator" + position );
			var target = eval( "vars.$L_targetOperand" + position );
			
			if ( compound == null )
			{
				compound = "" ;
				if ( position > 1 )
				{
					compound = "and";
				}
			}
			expr.setAttributeValue( "sourceOperand", field );
			expr.setAttributeValue( "operator", operator );
			expr.setAttributeValue( "targetOperand", target );
			expr.setAttributeValue( "compound", compound );
			
			expressions = lib.xmlHelpers.addChildElement( expressions, expr );
			
		}
	}
	condition = lib.xmlHelpers.addChildElement( condition, expressions );
	
	return condition.toXMLString();
}

function getDescription( condition )
{
	var xml = new XML();
	var desc = "";
	if ( condition == null )
	{
		return "Always";
	}
	
	if ( xml.setContent( condition ) )
	{
		var sourceTable = xml.getAttributeValue( "sourceTable" );

		var expressions = xml.getFirstChildElement();

		var expr = expressions.getFirstChildElement();
		var operatorType;
		var i = 1;
		var compound;
		
		
		while ( expr != null )
		{
			var field;
			var operator;
			var target;
			
			field = expr.getAttributeValue( "sourceOperand" );
			operator = expr.getAttributeValue( "operator" );
			target = expr.getAttributeValue( "targetOperand" );
	
			if ( field != null && field !="" && field !=" " )
			{
				if ( i == 1 )
				{
					compound =  expr.getAttributeValue( "compound" );
					
				}
				else
				{
					compound =  expr.getAttributeValue( "compound" );
					desc += " " + compound + " ";
				}
				
				if ( compound != ")" )
				{
					desc += lib.tableFunctions.getFieldCaption( field, sourceTable ) 
							+ " " + getOperatorDesc( operator ) + " " + getTarget( target, field, sourceTable );
				}
			}
			i++;
			expr = expr.getNextSiblingElement();	
		}
	}
	
	return desc;
}

function getConditionExpression( condition )
{
	var xml = new XML();
	var condExpr = "";
	
	if ( condition == null )
	{
		return "true";
	}
	
	if ( xml.setContent( condition ) )
	{
		var sourceTable = xml.getAttributeValue( "sourceTable" );

		var expressions = xml.getFirstChildElement();

		var expr = expressions.getFirstChildElement();
		var operatorType;
		var i = 1;
		var compound;
		
		while ( expr != null )
		{
			var field;
			var operator;
			var target;
			
			field = expr.getAttributeValue( "sourceOperand" );
			operator = expr.getAttributeValue( "operator" );
			target = expr.getAttributeValue( "targetOperand" );
	
			if ( i == 1 )
			{
				compound =  expr.getAttributeValue( "compound" );

			}
			else
			{
				compound =  expr.getAttributeValue( "compound" );
				condExpr += " " + compound + " ";
			}
			
			if ( compound != ")" )
			{
				condExpr +=  field +" in $L.file " + getOperator( operator ) + getTarget( target, field, sourceTable );
			}
			i++;
			expr = expr.getNextSiblingElement();
			
		}
		
	}
	
	return condExpr;
}


function getOperatorDesc( oper )
{
	
	
	return getOperator( oper );
}

function getOperator( oper )
{
	if ( oper == "notEquals" )
	{
		return "~="
	}
	if ( oper == "greaterThan" )
	{
		return ">"
	}
	if ( oper == "lessThan" )
	{
		return "<"
	}
	if ( oper == "startsWith" )
	{
		return "#"
	}
	if ( oper == "notStartsWith" )
	{
		return "~#"
	}
	return "=";
}

function getTarget( target, field, table )
{
	var type = lib.tableFunctions.getAbsFieldType( field, table);
	
	if ( target == "NULL" )
	{
	 	return target;
	}
	if ( type == 1 || type == 4 )
	{
		return target;
	}
	if ( type == 3 )
	{
		return "'"+target+"'";
	}
	return "\""+target+"\"";
}

function updateFormat( format )
{
	var xml = format.getXML();
	var instance = lib.xmlHelpers.getElement( xml, "instance", null );

	if ( instance != null )
	{	
		var fields = lib.xmlHelpers.getElement( instance, "field", null );
		
		if ( fields != null )
		{
			var tab = "\t";
			
			var newField = new XML("field");
			newField.setAttributeValue( "sctype", "structure" );
			
			var flags = new XML("flags");
			flags.setAttributeValue( "type", "decimal" );
			flags.setValue( "0" );
			
			var line = new XML("line");
			line.setAttributeValue( "type", "decimal" );
			line.setValue( "12" );
			
			var column = new XML("column");
			column.setAttributeValue( "type", "decimal" );
			column.setValue( "15" );
			
			var length = new XML("length");
			length.setAttributeValue( "type", "decimal" );
			length.setValue( "10" );	
			
			var window = new XML("window");
			window.setAttributeValue( "type", "decimal" );
			window.setValue( "1" );
			
			var graph = new XML("graph");
			graph.setAttributeValue( "sctype", "array" );
			
			var output = new XML("output");
			output.setAttributeValue( "type", "string" );		
			
			var input = new XML("input");
			input.setAttributeValue( "type", "string");
			input.setValue( "$L.condition4" );
			
			var property = new XML("property");
			property.setAttributeValue( "type", "string");
			var temp;
			
			temp="ComboBox;BoxLines=6"+tab+"ValueList="+tab+"Height=2"+tab+"Name="+tab+"SelectOnly=1"+tab
			    +"Width=20"+tab+"X=28"+tab+"Y=22"+tab+"Input=$L.condition4"+tab
			    +"DisplayList=and;or;and (;or (;(;)"+tab
			    +"ValueList=and;or;and (;or (;(;)";
			
			property.setValue( temp );
			
			newField = lib.xmlHelpers.addChildElement( newField, flags);
			newField = lib.xmlHelpers.addChildElement( newField, line);
			newField = lib.xmlHelpers.addChildElement( newField, column);
			newField = lib.xmlHelpers.addChildElement( newField, length);
			newField = lib.xmlHelpers.addChildElement( newField, window);
			newField = lib.xmlHelpers.addChildElement( newField, graph);
			newField = lib.xmlHelpers.addChildElement( newField, output);
			newField = lib.xmlHelpers.addChildElement( newField, input);
			newField = lib.xmlHelpers.addChildElement( newField, property);
			
			fields = lib.xmlHelpers.addChildElement( fields, newField );
			
			format.setRecord(xml.toXMLString());
		}
	}
	
	
	return format;
}


function getTestCondition()
{
	var xml = "<condition type=\"simple\" sourceTable=\"probsummary\" condDesc=\"Test Description\"><expressions>"
	         +"<expression compound=\"and\" sourceOperand=\"status\" operator=\"equals\" targetOperand=\"Open\">"
	         +"</expression>"
	         +"<expression compound=\"and\" sourceOperand=\"flag\" operator=\"equals\""
	         +" targetOperand=\"true\"></expression>"
	         +"</expressions></condition>"
	       
	//xml = "<condition sourceTable=\"probsummary\"></condition>"
	return xml;
	         
}

function hasLink( filename, fieldName, link )
{
	if ( link == null )
	{
	 	link = new SCFile( "link" );
	}
	var sql = "name=\"" + filename +"\"";
	
	if ( link.doSelect( sql ) == RC_SUCCESS )
	{
		var index = system.functions.index( fieldName, link.source_fields );
		if ( index > 0 )
		{
			return true;
		}
	}
	
	return false;
}

function setGlobalList( filename, fieldName, position, datadict )
{
	if ( datadict == null )
	{
	 	datadict = new SCFile( "datadict" );
	 	var sql = "name=\""+filename+"\"";
	 	
	 	if ( datadict.doSelect( sql ) != RC_SUCCESS )
	 	{
	 		eval( "vars.$L_valueList"+position+"= null" );
	 		eval( "vars.$L_displayList"+position+"= null" );
	 		eval( "vars.$L_hasCombo"+position+"=false");
	 		return;
	 	}
	 	
	 	var dPos = system.functions.index( fieldName, datadict.fields );
	 	if ( dPos > 0 )
	 	{
	 		var listName = datadict.globallist[ dPos - 1 ] ;
	 		if ( listName != null )
	 		{
	 			var list = new SCFile( "globallists" );
	 			var lsql = "name=\""+listName+"\""
	 			if ( list.doSelect( lsql ) == RC_SUCCESS )
	 			{
	 				eval( "vars.$L_hasCombo"+position+"=true");
	 				eval( "vars.$L_valueList"+position+"="+getVariableName( list.list_variable ) );
	 				if ( list.display_variable != null )
	 				{
	 					eval( "vars.$L_displayList"+position+"="+getVariableName( list.display_variable ) );
	 				}
	 				else
	 				{
	 					eval( "vars.$L_displayList"+position+"="+getVariableName( list.list_variable ) );
	 				}
	 			}
	 		}
	 	}

	 	
	 	return;
	}
}

function getVariableName( variable )
{
	var temp = variable;
	var exp = /\./g;
	temp = temp.replace( exp, "_" );
	
	return "vars."+temp;
}


