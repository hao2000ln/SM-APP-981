---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.1.8.6 .. 1.1.8.6
printed_pages: 578-607
---

# 1.1.8.6 Case Exchange reference material

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.8.6. Case Exchange reference material

This section provides the Case Exchange reference material.
Edit the query and pagination query
Specify additional path
Entity path
Technical hints
Dealing with HTML tags from Service Anywhere
Out-of-box functions for additional scripts
Limitations


1.1.8.6.1. Edit the query and pagination query
strings

This topic provides specifications to explain how to configure the strings for the query
parameter and pagination query parameter under the Inbound tab when you set up a Case
Exchange integration instance. This topic includes the following collections.

Filter

The filter query parameter specifies a filtering condition for a resource collection. The service
must return only resources that meet the specified condition. The following table lists the
operators.


Logical operator                        General Variables      Example
${object}
                  Boolean operator Description
Service Manager
records           ${object}             A placeholder for all  ${param.lastPulling
End point                               parameters in SMIS     Time}
Parameters                              configuration, in
                                        which the value        ${vars.$epfieldsAlia
                                        can't be predefined    s}
                                        but during running
                                        time or depends on
                                        other parameters.

                                        The object
                                        placeholder can be
                                        sm, ep, param,
                                        context,or vars. For
                                        more information
                                        about these objects,
                                        see Placeholder
                                        objects.

                  sm                    Query the record in    Get the description
                                        Service Manager.       of an incident in

                                                               Service Manager:

                                                               ${sm.action}

                  ep                    Query the record in    Get the description
                                        the end point.         of an incident in the

                                                               end point:

                                                               ${ep[‘properties.de
                                                               scription’]}

                  param                 Query all              Get the object
                                        parameters defined     defined in the
                                        in the Service         Service Manager
                                        Manager                configuration:
                                        configuration.
                                                               ${param.object}


Logical operator Boolean operator        Description                  Example
Context information context
                                         Query all task-              Get the incident Id
                                         related information          in Service Manager:
                                         such as internal ID
                                         and external ID. For         ${context.internalId
                                         more information,            }
                                         see Placeholder
                                         objects.

Variables            vars                Query all variables          Get the current
                                         in Service Manager.          login users:

                                                                      ${vars.$lo_operator
                                                                      }

Logical operator                 Special variables for Case Exchange  Example

                     Boolean operator Description                     ${vars.$currentPag
                                                                      eOffset}
Current page offset  $currentPageOffset  Query the index of
                                         the first record on
                                         the current page in
                                         all records. This
                                         variable is defined
                                         in the Case
                                         Exchange
                                         framework and is
                                         only used by the
                                         pagination
                                         parameter.


Logical operator                        Logical Operators     Example
And
                  Boolean operator Description                http://domain/resou
Or                                                            rce?filter=Id gt 1000
                  and                   Evaluates to true if  and Name eq ‘Jake’
                                        the left and right
                                                              http://domain/resou
                                        operands evaluate     rce?filter=Id > 1000
                                                              and Name = ‘Jake’
                                        to true, otherwise

                                        evaluates to false.

                  or                    Evaluates to true if  http://domain/resou
                                        at least one of the   rce?filter=Id gt 1000
                                        left and right        or Name eq ‘Jane’
                                        operands evaluates

                                        to true, otherwise http://domain/resou

                                        evaluates to false. rce?filter=Id > 1000

                                                              or Name = ‘Jane’


Logical operator                      Comparison Operators    Example
Equals
Not Equals         Boolean operator Description
Greater Than
                   eq                   Evaluates to true if http://domain/resou
Greater or Equals
                                        the left and right    rce?filter=Rank eq 2
Less Than
Less or Equal      =                    operands are equal,   http://domain/resou
                                        otherwise evaluates   rce?filter=Rank = 2
                                        to false.

                   ne                   Evaluates to true if http://domain/resou

                                        the left and right    rce?filter=Rank ne 2

                   !=                   operands aren't       http://domain/resou
                                        equal, otherwise      rce?filter=Rank != 2
                                        evaluates to false.

                   gt                   Evaluates to true if http://domain/resou
                                        the left operand is rce?filter=Rank gt 2

                   >                    greater than the      http://domain/resou
                                        right operand,        rce?filter=Rank > 2
                                        otherwise evaluates

                                        to false.

                   ge                   Evaluates to true if http://domain/resou
                                        the left operand is rce?filter=Rank ge 2

                   >=                   greater than or       http://domain/resou
                                        equals to the right   rce?filter=Rank >= 2
                                        operand, otherwise

                                        evaluates to false.

                   lt                   Evaluates to true if  http://domain/resou
                   <                    the left operand is   rce?filter=Rank lt 2
                                        less than the right

                                        operand, otherwise http://domain/resou

                                        evaluates to false. rce?filter=Rank < 2

                   le                   Evaluates to true if  http://domain/resou
                   <=                   the left operand is   rce?filter=Rank le 2
                                        less than or equals

                                        to the right operand, http://domain/resou

                                        otherwise evaluates rce?filter=Rank <= 2

                                        to false.


Logical operator  Boolean operator      Description            Example
Between           btw
                                        Evaluates to true if   http://domain/resou
Not Between       not btw               the leftmost           rce?
                                        operand is in the      filter=LastUpdate
                                        range defined by       btw(2012.01.01,
                                        the two comma-         2013.01.01)
                                        separated operands
                                        in the parenthesis,
                                        otherwise evaluates
                                        to false. The first
                                        operand in the
                                        parenthesis
                                        represents the low
                                        limit of the range
                                        and the second
                                        operand represents
                                        the high limit of the
                                        range.

                                        Evaluates to true if   http://domain/resou
                                        the leftmost           rce?
                                        operand is not in      filter=LastUpdate
                                        the range defined      not btw(2012.01.01,
                                        by the two comma-      2013.01.01)
                                        separated operands
                                        in the parenthesis,
                                        otherwise evaluates
                                        to false. The first
                                        operand in the
                                        parenthesis
                                        represents the low
                                        limit of the range
                                        and the second
                                        operand represents
                                        the high limit of the
                                        range. Range
                                        boundaries are
                                        inclusive.


Logical operator  Boolean operator      Description           Example
In                in
                                        Evaluates to true if  http://domain/resou
Not In            not in                the leftmost          rce?filter=Id
                                        operand is equal to   in(1,2,3)
                                        one of the
                                        expressions in the
                                        parenthesis,
                                        otherwise evaluates
                                        to false.

                                        Evaluates to true if  http://domain/resou
                                        the leftmost          rce?filter=Id not
                                        operand is not equal  in(1, 2, 3)
                                        to any of the
                                        expressions in the
                                        parenthesis,
                                        otherwise evaluates
                                        to false.


Logical operator                      Arithmetic Operators    Example
Add
                  Boolean operator Description                http://domain/resou
Subtract                                                      rce?
                  add                   Evaluates to the      filter=PreviousRank
Multiply                                sum of the left       gt (CurrentRank add
                                                              3)
                  +                     operand and the
                                                              http://domain/resou
                                        right operand in the  rce?
                                                              filter=PreviousRank
                                        parenthesis.          > (CurrentRank + 3)

                  sub                   Evaluates to the      http://domain/resou
                  -                     value that the left   rce?
                                        operand minus the     filter=PreviousRank
                                        right operand in the  gt (CurrentRank sub
                                        parenthesis.          3)

                                                              http://domain/resou
                                                              rce?
                                                              filter=PreviousRank
                                                              > (CurrentRank - 3)

                  mul                   Evaluates to the      http://domain/resou

                                        product that the left rce?

                  *                     operand multiplies filter=PreviousRank

                                        the right operand in lt (CurrentRank mul

                                        the parenthesis.      3)

                                                              http://domain/resou
                                                              rce?
                                                              filter=PreviousRank
                                                              < (CurrentRank * 3)


Logical operator  Boolean operator      Description           Example
Modulo            mod
                  %                     Evaluates to the      http://domain/resou
Divide                                  remainder that the    rce?filter=Actual gt
                  div                   left operand divides  Planned and
Logical operator  /                     the right operand in  (Planned mod
Parenthesis                             the parenthesis.      Actual) gt 5

                                                              http://domain/resou
                                                              rce?filter=Actual >
                                                              Planned and
                                                              (Planned % Actual)
                                                              >5

                                        Evaluates to the      http://domain/resou
                                        value that the left   rce?
                                        operand divides the   filter=PlannedHours
                                        right operand in the  div 10
                                        parenthesis.
                                                              http://domain/resou
                                                              rce?
                                                              filter=PlannedHours
                                                              / 10

                                      Parenthesis Operator    Example

                  Boolean operator Description                http://domain/resou
                                                              rce?filter=(x add y)
                  ()                    Like in math,         mul (x sub z)

                                        parenthesis can be    http://domain/resou
                                                              rce?filter=(x + y) *
                                        used around           (x - z)

                                        conditions and

                                        expressions to

                                        define priority.

Logical operator                         Unary Operators          Service Manager 9.81
Unary Plus
                  Boolean operator Description            Example
Unary Minus                                               N/A
                  +                     Syntax: +number   N/A

                  -                     Syntax: -number

Layout

The layout query parameter specifies which properties or sub-structure of a data resource
should be returned by a service. Similar to SQL, this parameter provides a comma-separated
list of properties or multipart properties. The following table lists the operators.


Operator                                Description                  Example
Selecting Resource
Properties                              Resource properties are      http://domain/resource?
                                        specified by a property      layout=Id,Name,Description
Selecting Related Resource              name directly.
Properties                                                           http://domain/Person?
                                        Related resource properties  layout=PrimaryAddress.City
Selecting a Sub-Structure               are specified by a
Using Multipart Properties              relationship name and a      Query a resource named
                                        property name.               “UserSetting” for a “Select”
                                                                     object, which is a sub-
                                        Resources that hold          structure of a “Filter” object,
                                        complex object structures    which is a sub-structure of
                                        can be queried for a sub-    a “UserSetting” object.
                                        structure using multi-part   http://domain/UserSetting?
                                        property conventions.        layout=Settings.Filter.Select


Operator                                Description            Example

Selecting Calculated Values             The query protocol                 Note
                                        supports function and
                                        Arithmetic operators.             Functions listed
                                                                          in examples
                                                                          below have to
                                                                          be supported by
                                                                          concrete
                                                                          services in
                                                                          order to be valid
                                                                          – these are only
                                                                          examples.

                                                               Query a “Formula”
                                                               resource for the
                                                               product of a property
                                                               named “X” and a
                                                               property named “Y”:

                                                               http://domain/Formula
                                                               ?layout=X mul Y

                                                               Query a “Person”
                                                               resource for
                                                               “FirstName” and
                                                               “LastName” and return
                                                               a concatenation so
                                                               “FirstName”, space (“
                                                               “) and “LastName”:

                                                               http://domain/Person?
                                                               layout=Concat(FirstNa
                                                               me, Concat(‘ ’,
                                                               LastName))

Size

The size parameter specifies the maximum number of resources requested to be returned.

Syntax: size=<integer>

Example: Fetch the first 10 persons with age lower than 30 in ascending order.

http://domain/Person?layout=FirstName,LastName,Email&filter=Age<30&order=Age
asc&size=10


Skip

The skip parameter specifies how many resources should be skipped. In other words, it
specifies the starting index of the returned result. When not specified, it is assumed to be zero,
meaning that the first resource returned from the data-store is the first resource returned by
the queried service.
Syntax: skip=<integer>
Example: Fetch persons, starting from person number 51.
http://domain/Person?layout=FirstName,LastName,Email&skip=50


1.1.8.6.2. Specify additional path

In case the outbound JSON request contains a path or element that's mandatory but is
undefined in field mapping or entity path, you need to specify this path or element in the
Additional path field.
For example, in the following scenario:

     An outbound JSON request contains the following content:

          {
                        "entities": [{
                                       "properties": {
                                                     "DisplayLabel": "sadf",
                                                     "Description": "sdf",
                                                     "ImpactScope": "Enterprise",
                                                     "Status": "Ready",
                                                     "Urgency": "TotalLossOfService",
                                                     "RegisteredForActualService": "10874",
                                                     "Category": "10707"
                                       },
                                       "entity_type": "Incident"
                        }],
                        "operation": "CREATE"

          }

     The SMIS field mapping defines all the fields under properties : DisplayLabel ,
      Description , ImpactScope , Status , Urgency , RegisteredForActualService , and
      Category .
     Field mapping and entity path don't define entity_type and operation .
In this scenario, you must define the entity_type and operation fields in the Additional path
field by using the following string:

  {"entities":[{"properties":{},
  "entity_type":"Incident"}],"operation":"CREATE"}

            Note

          RESTful protocols other than JSON are not supported.


1.1.8.6.3. Entity path

In an outbound JSON request, entity path is the path above the endpoint field defined in the
field mapping.
For example, in a Case Exchange integration instance, all endpoint fields are defined as
properties.**** in the field mapping. The following example is an outbound request body in
the endpoint:

  {
                 "entities": [{
                               "properties": {
                                              "DisplayLabel": "Create New Incident",
                                              "Description": "create the new incident

  record",
                                              "ImpactScope": "MultipleUsers",
                                              "Urgency": "SlightDisruption",
                                              "Solution": "",
                                              "Id": "IM118216"

                               },
                               "ext_properties": {

                                              "Operation": "Update",
                                              "ExternalStatus": "Open",
                                              "ExternalId": "IM45167",
                                              "ExternalSystem": "SM",
                                              "ExternalEntityType": "Incident"
                               },
                               "Comments": [{
                                              "Body": "IM45167",
                                              "CreatedTime": 1402038076398
                               }],
                               "entity_type": "Incident"
                 }]
  }

In this particular example, one of the endpoint fields is properties.Displaylabel , so the entity
path is entities[0] .


Note

RESTful protocols other than JSON are not supported.


1.1.8.6.4. Technical hints

This section provides technical information that helps you better understand Case Exchange.

The $G.CEOwnershipSM variable

The $G.CEOwnershipSM variable is proprietary for Case Exchange. This variable identifies
whether the native system has ownership of a record.

If Process Designer is not implemented, this variable is set in the im.view.init process record,
and used in the I/O (If RIO) field of the apm.edit.problem display screen record.

If Process Designer is implemented, this variable is set in the im.CEUpdate.init Rule Set, which
is injected to the Incident workflow under Workflow Based Rule Sets > On display.

Functions used in rule conditions

The example condition configurations in this document call the following functions:

CaseExchangeExternalReferencesDAO.getExternalID: This function judges if the record is
exchanged to the external system. If the record is exchanged to the external system, the
following expression returns true:

  jscall("CaseExchangeExternalReferencesDAO.getExternalID",number in

  $L.file) ~=""

CaseExchangeExternalReferencesDAO.isExternalActive: If a record is in an active Case
Exchange life cycle, this function returns TRUE; otherwise, this function returns FALSE.

Time difference issue

In the Pull mechanism, date and time of the last Pull activity is the conclusive query filter to
distinguish the new updates in the endpoint system, which will be retrieved in the next Pull
activity.

Even the same time zone is applied for the integration, the time difference can occur between
the two systems (for example, one system is one minute ahead of another system). Therefore,
the system that initiates the Pull request must compensate the time difference between the two
systems so that each Pull activity can retrieve the exact updates after the last Pull activity from
the endpoint system.

To achieve this goal, you can configure the Time difference (s) setting in the integration
instance.


            Note

           For each Pull activity, the time for the query filter is the time in the Pulling From
           field plus the time (in seconds) defined in the Time difference (s) field.

Contents

     1 The $G.CEOwnershipSM variable
     2 Functions used in rule conditions
     3 Time difference issue


1.1.8.6.5. Dealing with HTML tags from SMAX

SMAX uses HTML tags for rich text in the Description, Solution, and Discussion fields of an
Incident, for example, <p> , <strong> , <ul> , and so on. By default, Service Manager
doesn't parse these tags, but displays these tags directly. To improve the readability of these
fields in Service Manager, the out-of-box integration template (CaseExchangeSM_SAW) uses
pre script to handle these tags in the following manner:
Inbound exchange:

     Automatically removes HTML tags.
     If the content contains an image and the address of the image doesn't start with "http://"
     or "https://", the image is downloaded and stored as an attachment, and the following
     description is appended:

          And Images are referenced as:
          (1 embedded image(s) <i><image_name></i> were downloaded as
          attachment, please check attachment section)

     If the download of an image fails, the following description is appended :

          And Images are referenced as:
          (1 embedded image(s) <i><image_name></i> were downloaded failed)

     If the content contains an image and the address of the image starts with "http://" or
     "https://", the image is not downloaded and the following description is appended:

          And Images are referenced as:
          (Images http://<i><domain_name_or_IP_address></i>/<i><image_name>
          </i> are from internet)

Outbound exchange:
If the content of a field is modified in Service Manager, then all the text in this field will be
appended after the original content in SMAX as follows:

  This is the original text in Service Anywhere.
  #####SM START#####
  This is the modified text in Service Manager.
  #####SM END#####

The following example illustrates how this mechanism works in each Case Exchange transfer:


1. The Description field of an Incident has the following content in SMAX.

2. After the Incident is exchanged, the Description field has the following content in Service
  Manager.

  And you can find the image in the Attachments section.

3. You modify this field in Service Manager as follows.

4. After your update is exchanged to SMAX, the Description field in SMAX contains the
  following information.


If you want to remove or modify this mechanism from the out-of-box integration template,
remove or modify the following code in pre script:

  //remove html tags from SAW
         if(ep['properties.Description']) ep['properties.Description'] =

  lib.CaseExchange_SAWUtil.processHtmlText(param, context, 'description',
  ep['properties.Description']);

         if(ep['properties.Solution']) ep['properties.Solution'] =
  lib.CaseExchange_SAWUtil.processHtmlText(param, context, 'solution',
  ep['properties.Solution']);

         if (ep['Comments'] && ep['Comments'].length > 0) {
                 for (var i = 0; i < ep['Comments'].length; i++) {
                        ep['Comments'][i]['Body'] =

  lib.CaseExchange_SAWUtil.processHtmlText(param, context, 'comment',
  ep['Comments'][i]['Body']);

                 }
         }

  //process the value which will be posted to SAW rich text field

  if(sm['action'] && sm['action'] !== "") { if(sm['oldvalues']['action'])
  sm['action'] = lib.CaseExchange_SAWUtil.processOutboundText(context,
  'description', sm['action']); if(sm['oldvalues']['action'] ===
  undefined) sm['action'] = null; } if(sm['resolution'] &&
  sm['resolution'] !== "") { if(sm['oldvalues']['resolution'])
  sm['resolution'] =
  lib.CaseExchange_SAWUtil.processOutboundText(context, 'solution',
  sm['resolution']); if(sm['oldvalues']['resolution'] === undefined)
  sm['resolution'] = null; }


1.1.8.6.6. Out-of-box functions for additional
scripts

When you set up the Case Exchange integration, you can specify functions in the Additional
Script tab in the Integration Instance Parameters page to customize the Case Exchange
integration in various different environments. This section explains the out-of-box functions
that you can specify in the Additional Script tab.

Set the HTTP header - for authentication

Besides username and password , the endpoint system (SMAX) also requires cookie in the
request header to perform authentication. The Javascript function below has the following
purposes:

     Set cookie to the header for inbound requests
     Set additional 'Content-type' into the header for outbound requests

Out-of-box function:

CaseExchange_SAWUtil.getHttpHeader

The function has the following parameters:

      direction : The direction of the action. This parameter has only two values:

          • lib.smis_Constants.MAPPING_DIRECTION_LEFTRIGHT()
          • lib.smis_Constants.MAPPING_DIRECTION_RIGHTLEFT()

     You can call the lib.CaseExchange_CommonLib.isOutbound(direction) or
      lib.CaseExchange_CommonLib.isInbound(direction) function to judge if the action is
     inbound or outbound.

      param : All parameters defined in the SMIS configuration. You can get a specific
     parameter value by using the param['object'] syntax. If you change any value in this
     parameter, the change is saved to the SMIS configuration.

The function returns the following result:

Object: The HTTP Header object

Sign in to the external system

Besides user name and password, the endpoint system (SMAX) also requires a cookie in the
request header to perform authentication. This cookie comes from another URL of a Software
as a Service (SAAS) portal.

The function below performs the following tasks:

   1. Sign in to the SAAS portal by using the username and password


   2. Extract the cookie from the response
   3. Set the cookie to param .

The Case Exchange framework then saves the cookie to the SMIS configuration. The
succeeding calls can directly retrieve the cookie from the SMIS configuration until the cookie
expires.

Out-of-box function:

CaseExchange_SAWUtil.doLoginRequest

The function has the following parameters:

      param : All parameters defined in the SMIS configuration. You can get a specific
     parameter value by using the param['object'] syntax. If you change any value in this
     parameter, the change is saved to the SMIS configuration.

The function returns the following result:

N/A

Validate inbound response

Besides the HTTP code in the GET REST response from SMAX, the HTTP body also contains
the information of whether the current request is successful. The function below checks the
response body to validate this request.

Out-of-box function:

CaseExchange_SAWUtil.validateInboundResponse

The function has the following parameters:

      param : All parameters defined in the SMIS configuration. You can get a specific
     parameter value by using the param['object'] syntax. The change to any value in this
     parameter is not saved to the SMIS configuration.
      response : The HTTP body of the REST response from endpoint.

The function returns the following result:

Boolean or String:

      false (Boolean): if the request is invalidated
     Id of the record in the endpoint (String): if the request is validated

Validate and parse outbound response

Besides the HTTP code in the POST REST response from SMAX, the HTTP body also contains
information of whether the current request is successful. The function below checks the
response body to validate this request and extract the Id if the request is validated.

Out-of-box function:


CaseExchange_SAWUtil.validateOutboundResponse

The function has the following parameters:

      param : All parameters defined in the SMIS configuration. You can get a specific
     parameter value by using the param['object'] syntax. The change to any value in this
     parameter is not saved to the SMIS configuration.
      response : The HTTP body of the REST response from endpoint.

The function returns the following result:

Object: The HTTP Header object

Inbound post-processing activities

The function below retrieves comments of an Incident record from SMAX and insert these
comments into the activity log in Service Manager right after the Incident record is exchanged.

Out-of-box function:

CaseExchange_SAW_PostProcessing.postInbound

The function has the following parameters:

      mapObj : Final Service Manager value object after field mapping and value mapping.
      sm : Temporary Service Manager value object after copying basic data from end point
     according to field mapping.
      ep : Original value object from the end point.
      context : Context of the SMIS task. You can get a specific value by using the
      context['internalId'] syntax.
      param : All parameters defined in SMIS configuration. You can get a specific parameter
     value by using the param['object'] syntax.

For more information about these parameters, see Placeholder objects.

The function returns the following result:

N/A

Outbound post-processing activities

The function below sends the activity log of the current Incident record to SMAX right after the
Incident record is exchanged.

Out-of-box function:

CaseExchange_SAW_PostProcessing.postOutbound

The function has the following parameters:

      mapObj : Final Service Manager value object after field mapping and value mapping.


      sm : Temporary Service Manager value object after copying basic data from end point
     according to field mapping.
      ep : Original value object from the end point.
      context : Context of the SMIS task. You can get a specific value by using the
      context['internalId'] syntax.
      param : All parameters defined in SMIS configuration. You can get a specific parameter
     value by using the param['object'] syntax.

For more information about these parameters, see Placeholder objects.

The function returns the following result:

N/A

Set the HTTP header - for attachment

Besides cookie in the HTTP header, the endpoint system (SMAX) also requires fs_filename
to perform attachment exchange. The function below adds cookie and fs_filename into the
HTTP header.

Out-of-box function:

CaseExchange_SAWUtil.getAttachHttpHeader

The function has the following parameters:

      direction : The direction of the action. This parameter has only two values:

          • lib.smis_Constants.MAPPING_DIRECTION_LEFTRIGHT()
          • lib.smis_Constants.MAPPING_DIRECTION_RIGHTLEFT()

     You can call the lib.CaseExchange_CommonLib.isOutbound(direction) or
      lib.CaseExchange_CommonLib.isInbound(direction) function to judge if the action is
     inbound or outbound.

      param : All parameters defined in the SMIS configuration. You can get a specific
     parameter value by using the param['object'] syntax. If you change any value in this
     parameter, the change is saved to the SMIS configuration.
      attachObj : For inbound activities, this is an instance of CEAttachment . For outbound
     activities, this is an instance of the Attachment object in Service Manager.

The function returns the following result:

Object: The HTTP Header object

Retrieve and parse attachment info

The function below performs the following tasks:

     Retrieves attachment information from the endpoint, such as file name, extension, size,
     and mime_type.


     Set all this information to the CEAttachmentInfor object and return the
      CEAttachmentInfor object in an array.

For SMAX, all attachment information comes from the REST response of Incident. For other
endpoints, an additional REST request may be required to retrieve the information.

Out-of-box function:

CaseExchange_SAWUtil.getAttachmentInfor

The function has the following parameters:

      mapObj : Final Service Manager value object after field mapping and value mapping.
      sm : Temporary Service Manager value object after copying basic data from endpoint
     according to field mapping.
      ep : Original value object from the endpoint.
      context : Context of the SMIS task. You can get a specific value by using the
      context['internalId'] syntax.
      param : All parameters defined in SMIS configuration. You can get a specific parameter
     value by using the param['object'] syntax.

For more information about these parameters, see Placeholder objects.

The function returns the following result:

Array: Array of the CEAttachmentInfo object

Parse response of attachment creation

Because the endpoint system (SMAX) needs an additional REST request to update attachment
information after the creation of the attachment, the function below parses the endpoint
response to the outbound attachment creation request.

Out-of-box function:

CaseExchange_SAWUtil.parseSAWCreateAttachResponse

The function has the following parameters:

      response : The HTTP body of the REST response from the endpoint.
      action : Action type to process attachment. Currently this parameter has only two values:
      FETCH_ATTACHMENT and CREATE_ATTACHMENT .
      param : All parameters defined in SMIS configuration. You can get a specific parameter
     value by using the param['object'] syntax.

The function returns the following result:

CEAttachmentInfo: An instance of CEAttachmentInfo parsed from the response

Update outbound Attachment Info


The function below calls the REST request to update attachment information. Before sending
the information to the endpoint system (SMAX), new information should be merged to the
existing one.

Out-of-box function:

CaseExchange_SAWUtil.updateAttachmentInfo

The function has the following parameters:

      mapObj : Final Service Manager value object after field mapping and value mapping.
      sm : Temporary Service Manager value object after copying basic data from endpoint
     according to field mapping.
      ep : Original value object from the endpoint.
      context : Context of the SMIS task. You can get a specific value by using the
      context['internalId'] syntax.
      param : All parameters defined in SMIS configuration. You can get a specific parameter
     value by using the param['object'] syntax.

For more information about these parameters, see Placeholder objects.

The function returns the following result:

Array: Array of the CEAttachmentInfo object


1.1.8.6.7. Limitations and known issues

This section introduces the limitations and known issues of the Case Exchange integration.

Insufficient message for a failed Case Exchange task

The SMIS task log doesn't contain sufficient information for a failed Case Exchange task
(QCCR1E114322)

When a Case Exchange task fails, the SMIS task log doesn't contain sufficient information for
you to troubleshoot the root cause of the failure.

Workaround

Use the following workaround if the SMIS task log doesn't contain sufficient information:

            Note

           Remember to adjust the Log Level setting in the SMIS integration instance before
           you debug the error. For more information about how to configure this setting, see
           Integration Instance Information fields.

     For an inbound task, the native system internally handles the exchange request from the
     endpoint system. In this scenario, you can find more information by using one of the
     following methods:

           Check the latest message in the sm.log log file. For more information about how to
           view the sm.log file, see Review log file.

           Run the failed task again and then check the messages in the message history box.

     For an outbound task, the native system sends the exchange request to the endpoint
     system and the endpoint system handles the request through RESTful APIs. In this
     scenario, you need a third-party tool (for example, SoapUI or Postman) to simulate and
     debug the exchange request.

     You need to collect the following information from the Task Log Detail page of the failed
     task to simulate and debug the exchange request in the third-party tool:

           The request URL. You can find this URL in the latest message in the Journal
           Messages field.
           The request data in the Task Request Data field.

     For more information about how to access the Task Log Detail page, see Monitor SMIS
     task log.
````
