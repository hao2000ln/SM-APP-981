---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.3.1.10 .. 1.3.1.14
printed_pages: 713-748
---

# 1.3.1.10 Incident exchange details

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3.1.10. Incident exchange details

This chapter provides incident exchange details.


1.3.1.10.1. Database Tables

The database tables required to operate the exchange service are created with the SQL scripts
create_tables_oracle.sql or create_tables_sqlserver.sql .

Table                                   Field                               Service Manager 9.81
systemguid                              systemguid
                                                    Description
                                                    Unique system web service
                                                    GUID

Table                                   Field                                           Service Manager 9.81
tasklist                                ovhdid
                                        action                  Description

                                        startTimestamp          ID of incident that triggered
                                        enqueueTimestamp        the action
                                        earliestReadyTimestamp
                                                                Action for the incident (state
                                        state                   transitions of status
                                        tries                   diagram). Can be
                                        guid                    ProcessIncident, AddInfo,
                                        sapid                   AcceptIncidentProcessing,
                                                                RejectIncidentSolution,
                                                                VerifyIncidentSolution, or
                                                                CloseIncident.

                                                                Creation timestamp of
                                                                entry.

                                                                Timestamp for ordering of
                                                                tasks. Initial value is
                                                                startTimestamp.

                                                                Timestamp that specifies
                                                                the earliest time when this
                                                                entry can be processed.
                                                                Empty means

                                                                immediately. Task becomes
                                                                ready only after this time.

                                                                Task state. Can be 1=READY
                                                                or 2=INPROCESS (task is
                                                                processed already).

                                                                Number of attempts to
                                                                complete this task.

                                                                GUID of the task to delete
                                                                the correct entry in
                                                                database.

                                                                Name of external help desk
                                                                instance that incident is
                                                                exchanged with.

Table                                   Field                                    Service Manager 9.81
runtimedata                             incidentguid
                                        ovhdincidentid   Description
                                        exthdincidentid
                                        requesterguid    GUID of exchanged incident
                                        providerguid
                                        metadata         ID of incident in helpdesk
                                                         managed by web service
                                        infologid
                                        attachmentid     ID of incident in the external
                                        lastchange       helpdesk

                                                         System GUID of requester
                                                         helpdesk for that incident

                                                         System GUID of provider
                                                         helpdesk for that incident

                                                         Incident state in statement
                                                         diagram and role the
                                                         ServiceDesk has for this
                                                         incident

                                                         (Requester or Provider).
                                                         Stored in the same format
                                                         used for
                                                         the Hidden_Meta_Data

                                                         field in ServiceDesk (such
                                                         as Requester:RequesterPro
                                                         cessing , Provider:Solution
                                                         Provided ).

                                                         Reference to multiple
                                                         entries in
                                                         runtimedata_infolog.

                                                         Reference to multiple
                                                         entries in
                                                         runtimedata_attachments.

                                                         Timestamp of last change
                                                         of entry.

Table                                   Field                                   Service Manager 9.81
runtimedata_infolog                     infologid
                                                        Description
                                        infologblock
                                                        Key referenced from
runtimedata_attachments attachmentid                    runtimedata.

                                        filename        Number of infolog block
                                                        sent already.
                                        attachmentguid
                                                        Key referenced from
                                                        runtimedata.

                                                        Filename of an attachment
                                                        for incident.

                                                        GUID for attachment (also
                                                        known by external
                                                        helpdesk) to delete
                                                        attachment.


1.3.1.10.2. Tools

There are several configuration tools in the installation \bin directory. Tool scripts are available
for Windows (.bat) and Linux (.sh):

      encryptPasswords encrypts the passwords in the configuration file. All properties
     ending with .password must be configured with this tool. Use -global or <instance
     key> as a parameter.

            global
           Encrypt a password in the global properties file ( ovictex.properties ). For example:
            encryptPasswords.bat -global

            <instance key>
           Encrypt a password in the configuration file of a specific instance. For example:

            encryptPasswords.bat exthd
      setup is the setup script for Tomcat start/stop. For Tomcat:

           Start: Setup startup
           Shutdown: Setup shutdown
           Start with debug mode: Setup debug startup
      checker checks the configuration in ovictex.properties and Service Manager
     configuration (see Verifying configuration for more information) .


1.3.1.10.3. Field mapping configuration

Incident exchange web service exchanges incident data as XML documents between Service
Manager and the external Help Desk SAP Solution Manager. Incident exchange transforms the
incident data in Service Manager to an XML message for SAP Solution Manager, and
transforms Solution Manager data to an XML message for Service Manager. The
transformation maps the field name in Service Manager to XML elements in Solution Manager
while taking into account the following:

     Field names in Service Manager are usually different from the message element name.
     Service Manager field data type can differ from the message element data type.
     Not all message elements have corresponding data fields in Service Manager. Such fields
     are usually combined into a single log field called Journal .
     Some fields also require value mapping. For example, the possible values for the Priority
     field in Service Manager are 1 - Critical , 2 - High , 3 - Average , 4 - Low . The Solution
     Manager Priority can be 5 , 4 , 3 , 2 , 1 . These values must be specified in the
      FieldValueMapping configuration.
     Service Manager can assign customized fields to an Incident. These fields can be
     mapped to message elements.

A declarative field mapping file defines the mapping outlined above and :

     Enables the exchange of incident data between two helpdesks with reduced code size
     (the same code can handle any number of fields)
     Improves flexibility (mapping can be changed without changing code)
     Improves extensibility and customizability (a deployment-specific mapping can be added
     without changing code)
     Used to map incident data with an external help desk other than Solution Manager


1.3.1.10.3.1. Types of Mapping

The mapping file supports field mapping and field value mapping. Field mapping is simple
(XML message element is a single value) or composite (multiple values such as an array).


1.3.1.10.3.2. Structure of FieldMapping XML file

The field mapping configuration is related to the ICT_SERVICE_DESK_API WSDL scheme
defined by SAP Solution Manager. The mapping consists of field mapping and value mapping.

Field mapping includes:

      IctHead
      IctIncidentAttachment
      IctIncidentSapNotes
      IctIncidentSolutions
      IctIncidentUrls
      IctIncidentStatement
      IctIncidentAdditionalInfo

The following is a mapping file example:

<FieldMapping ExtHDField="IctHead/AgentId" >
  <OutOvHDField>Assignee</OutOvHDField>
  <OutDataType>Person</OutDataType>
  <InOvHDField>Assignee</InOvHDField>
  <InDataType>Person</InDataType>
</FieldMapping>

In the above example:

     Element IctHead/AgentId of SAP Solution Manager (sub-element AgentId of top level
     element IctHead ) maps to the field Assignee exposed by the Service Manager
     IncidentManagement Web Service.
     Data types for the IN and OUT exchange modes are specified in the InDataType and
      OutDataType tags.
      Person type indicates that the Exchange must convert incoming data (to/from the
     Service Manager) to/from an internal Person type that corresponds with the
      IctIncidentPerson type of the SAP SolutionManager web service.
      InDataType and OutDataType tags declare types on the Service Manager side.


1.3.1.10.3.3. Composite Field Mapping

Composite field mapping maps a message element to a OvHD field depending upon the value
of a sub-element (key) of the element ExtHDKeyField ( OvHD and ExtHD are old terms; in
this document, OvHD correspond to Service Manager and ExtHD correspond to SAP
Solution Manager ). A different value for the key defines mapping to a different Service
Manager field. The following is a composite field mapping example.


  <CompositeFieldMapping ExtHDField="IctIncidentStatement"
  ExtHDKeyField="IctIncidentStatement/TextType">
  <!-- For exchanging information log -->
  <FieldMapping ExtHDField="IctIncidentStatement/Text" >

                 <InDataType>InformationLog</InDataType>
                 <OutDataType>InformationLog</OutDataType>
                 <KeyFieldOutVal>SU99</KeyFieldOutVal>
                 <KeyFieldInVal>SU99</KeyFieldInVal>
  </FieldMapping>
  <!-- for exchanging Solution Provided -->
  <FieldMapping ExtHDField="IctIncidentStatement/Text">
                 <OutOvHDField>Solution</OutOvHDField>
                 <InOvHDField>Solution</InOvHDField>
                 <KeyFieldOutVal>SU99</KeyFieldOutVal>
                 <KeyFieldInVal>SU01</KeyFieldInVal>
  </FieldMapping>
  <!-- for exchanging CustomText01 (as example) -->
  <FieldMapping ExtHDField="IctIncidentStatement/Text" >
                 <InOvHDField>CustomText01</InOvHDField>
                 <OutOvHDField>CustomText01</OutOvHDField>
                 <KeyFieldOutVal>SU99</KeyFieldOutVal>
                 <KeyFieldInVal>SU77</KeyFieldInVal>
  </FieldMapping>
  <!-- For sending custom fields from OVHD to external HD create an entry
  as
  the example below. Replace the place holder strings as per your
  configuration -->
  <!--
  <FieldMapping ExtHDField="IctIncidentStatement/Text" >
                 <OutOvHDField>USER_VISIBLE_FIELDNAME_FOR_THAT_CUSTOM_FIELD
                 </OutOvHDField>
                 <KeyFieldOutVal>TEXT_TYPE_AS_DEFINED_BY_USER_FOR_THIS_FIELD
                 </KeyFieldOutVal>
  </FieldMapping>
  -->
  </CompositeFieldMapping>

Element IctIncidentStatement/Text is mapped to the information log if the key element
IctIncidentStatement/TextType is SU99 or to Resolution field if the key element is SU01
(for an incoming message).
This is used when a message has multiple occurrences of the same element that have different
sub-element values. The sub-element is referred to as the key field. In the example above the


IctIncidentStatement/TextType element is the key field. For a composite field mapping, every
instance of FieldMapping has a unique KeyFieldInVal .


1.3.1.10.3.4. Field Value Mapping

Field value mapping maps the values of a message element to the corresponding value of an
OvHD field. The following is an example.

  <FieldValueMapping Id="IctHead/Priority">
  <ValueMapping OvHDValue="4" ExtHDValue="5"/>
  <ValueMapping OvHDValue="4" ExtHDValue="4"/>
  <ValueMapping OvHDValue="3" ExtHDValue="3"/>
  <ValueMapping OvHDValue="2" ExtHDValue="2"/>
  <ValueMapping OvHDValue="1" ExtHDValue="1"/>
  </FieldValueMapping>

            Note

           Since both helpdesks priority lists can be configured, check the actual values in
           the field value mapping.


1.3.1.10.3.5. Field Mapping Schema

The RelaxNG Compact Schema of the mapping file is shown below.


  default namespace =
      "http://schemas.hp.com/openview/incidentExchange/mapping"

  start =
      element IncidentExchMapping {
         attribute targetNamespace { xsd:anyURI },
         element FieldMappings {
             (FieldMapping
               | element CompositeFieldMapping {
                      attribute ExtHDField { string },
                      attribute ExtHDKeyField { string },
                      FieldMapping+
                   })+
         }&
         element ValueMappings {
             element FieldValueMapping {
                 attribute Id { string },
                 element ValueMapping {
                    attribute ExtHDValue { string },
                    attribute OvHDValue { string }
                 }+
             }
         }
      }

  FieldMapping =
      element FieldMapping {
      ## field accessor in XML document using XPath like notation.
           Example:
      ## ExtHDField="IctHead/AgentId"
         attribute ExtHDField { string },
         attribute ValueMappingId { string }?,
         (element InOvHDField { string } &
         (element DefaultOutOvHDField { string }
           | element OutOvHDField { string })? &
         element InDataType { "InformationLog" | "Priority" | "Date" |
               "Attachment" | “OvCISearchKey” }? &
         element OutDataType { "Person" | "Priority" | "Date" |
               "Attachment" | “OvCISearchKey” }? &
         element KeyFieldOutVal { string }? &
         element KeyFieldInVal { string }? )
      }

The schema elements are described in the following table.

 Schema element                                                                                  Service Manager 9.81
 IncidentExchMapping
 FieldMappings                          Function
 ValueMappings
 FieldMapping                           Top-level element of the mapping schema.

 CompositeFieldMapping                  Container element for all FieldMapping
                                        and CompositeFieldMapping elements.
 ValueMapping
 ExtHDField                             Container element for FieldValueMapping
 InOvHDField                            elements.

This PDF was generated on May 23, 2026  Maps a message element to an OvHD field
                                        and includes type information for storing to
                                        and loading from OvHD. Optionally contains
                                        a reference to a FieldValueMapping
                                        element through attribute ValueMappingId .
                                        The value of this attribute must match the
                                        value of attribute Id in a
                                        FieldValueMapping element. When this
                                        reference is present, the information in the
                                        FieldValueMapping must be used to map
                                        field value.

                                        Maps a message element to a OvHD field
                                        depending upon the value of a sub-element
                                        (key) of the element. A different key value
                                        defines mapping to a different OvHD field.
                                        The keyFieldInVal must be unique for each
                                        individual field mapping within a composite
                                        field mapping.

                                        Maps the OvHD value of a message
                                        element to an ExtHD value.

                                        Field accessor in XML message document
                                        in XPATH like expression that identifies a
                                        specific field of exchanged incident
                                        information.

                                        Indicates the OvHD field name where
                                        information received from the external
                                        helpdesk is written for a specific
                                        ExtHDField .

                                                                                                                      Page 729 of 1727
 Schema element                                                                                  Service Manager 9.81
 OutOvHDField
 DefaultOutOvHDField                    Function

 InDataType                             Indicates the OvHD field name whose
 OutDataType                            value is sent to the external helpdesk for a
 InDataType and OutDataType             specific ExtHDField .

 OvCISearchKey                          If this element appears in a field mapping
 InformationLog                         then the value of this element is taken as
                                        the default value sent to the external
This PDF was generated on May 23, 2026  helpdesk for a specific ExtHDField . For
                                        example, if a mapping
                                        DefaultOutOvHDField is specified as
                                        DefaultUserId and OutDataType is
                                        specified as Person , the default user ID
                                        will be sent to the external helpdesk for a
                                        specific ExtHDField .

                                        Datatype for storing the field value to
                                        OvHD .

                                        Datatype for loading the field value from
                                        OvHD .

                                        Specifies the method to call for
                                        reading/writing information from/to the
                                        incident using the OvHDAccess layer.
                                        InDataType and OutDataType are optional
                                        elements. If not specified, then the field
                                        types are assumed to be String. Otherwise
                                        the following data types can be specified:

                                             Priority: Priority of an incident
                                             Date: A date field
                                             Attachment: Refers to an attachment
                                             Person: Indicates that the information
                                             is a person detail.

                                        Indicates the information is used as a
                                        search key for CI in OvHD.

                                        Applicable only for InDataType. Indicates
                                        the information should be appended to the
                                        Information Log.

                                                                                                                      Page 730 of 1727
Schema element                                                                                   Service Manager 9.81
KeyFieldInVal
                                        Function
KeyFieldOutVal                          Value stored in OvHD for the element used
                                        as the key field.
                                        Value sent to ExtHD for the element used as
                                        the key field.


1.3.1.10.3.6. Default field mapping file and
customization

This section provides default field mapping file and customization information.

Prerequisites

SMSSMEX operates with Service Manager based on the extended IncidentManagement Web
Service and supports only the fields listed below (exposed in the Service Manager
IncidentManagement WS).


Field                Type               Field              type
IncidentID           Text               Subcategory        Text
Category             Text               SLAAgreementID     Decimal
OpenTime             Datetime           PlannedEnd         Datetime
OpenedBy             Text               SiteCategory       Text
PriorityCode         Text               ProductType        Text
Severity             Text               ProblemType        Text
UpdatedTime          Datetime           ResolutionFixType  Text
PrimaryAssignment    Text               UserPriority       Text
Group
ClosedTime           Datetime           Solution           Text
ClosedBy             Text
ClosureCode          Text               InitialImpact      Text
ConfigurationItem    Text
Location             Text               CustomText01       Text
IncidentDescription
Resolution           Resolution         CustomText02       Text
Assignee             Text(OperatorID)
Contact              Text(ContactID)    CustomText03       Text
JournalUpdates
AlertStatus          Text               CustomText04       Text
ContactLastName      Text
ContactFirstName     Text               CustomText05       Text
Company              Text
                                        CustomText06       Text

                                        CustomText07       Text

                                        CustomText08       Text

                                        CustomText09       Text

                                        CustomText10       Text

                                        SapSid             Text

                                        SapClient          Text


Field           Type                    Field        type

Title           Text                    SapInstallationNum Text

                                        ber

TicketOwner     Text                    HiddenMetaData Text

UpdatedBy       Text                    IsIncidentExchange Boolean

IMTicketStatus  Text                    attachments  Attachments

Add fields to fieldMapping.xml

The default field mapping file (provided with the incident exchange web service) doesn't
include all fields from the web service and can be extended. Any additional field mapping can
be included in section IctIncidentStatement . The following is an example:

<FieldMapping ExtHDField="IctIncidentStatement/Text">
  <OutOvHDField>SC_WS_FIELDNAME</OutOvHDField>
  <KeyFieldOutVal>SOLMAN_FIELD_TYPE </KeyFieldOutVal>
</FieldMapping>
<FieldMapping ExtHDField="IctIncidentStatement/Text">
  <OutOvHDField>CustomText09</OutOvHDField>
  <KeyFieldOutVal>SU99 </KeyFieldOutVal>
</FieldMapping>

In the above example, the custom field defined in Service Manager is sent to the external HD,
so KeyFieldOutVal is defined at the external helpdesk. No InOvHDField or KeyFieldInVal is
specified since the example only sends to the external helpdesk.

IN/OUT data exchange requires definition of IN and OUT :

<FieldMapping ExtHDField="IctIncidentStatement/Text">
  <OutOvHDField>SC_WS_FIELDNAME1</OutOvHDField>
  <InOvHDField>SC_WS_FIELDNAME2</InOvHDField>
  <KeyFieldOutVal> SOLMAN_FIELD_TYPE1 </KeyFieldOutVal>
  <KeyFieldInVal> SOLMAN_FIELD_TYPE2 </KeyFieldInVal>
</FieldMapping>

In this example, if the values of SC_WS_FIELDNAME1 and C_WS_FIELDNAME2 are the same,
then the OvHD field is overwritten when information is sent from external helpdesk (1:1 field
synchronization). For example:

<FieldMapping ExtHDField="IctIncidentStatement/Text">
  <OutOvHDField>CustomText09</OutOvHDField>
  <InOvHDField>CustomText09</InOvHDField>
  <KeyFieldOutVal SU01</KeyFieldOutVal>


  <KeyFieldInVal>SU01</KeyFieldInVal>
</FieldMapping>

In the following example, CustomText08 updates field ZZ08 in SAP Solution Manager, but
ZZ08 updates CustomText09 in Service Manager (doesn't overwrite CustomText08).

<FieldMapping ExtHDField="IctIncidentStatement/Text">
  <OutOvHDField>CustomText08</OutOvHDField>
  <InOvHDField>CustomText09</InOvHDField>
  <KeyFieldOutVal ZZ08</KeyFieldOutVal>
  <KeyFieldInVal>ZZ08</KeyFieldInVal>
</FieldMapping>

Additional information

Section IctIncidentAdditionalInfo defines synchronization of CIs between SAP Solution
Manager and Service Manager and defines the method for sending SAP Attributes from SAP
Solution Manager.

            Note

           The first part of the mapping describes CI mapping handling and must not be
           changed.

<FieldMapping ExtHDField="IctIncidentAdditionalInfo/AddInfoValue" >
  <OutDataType>OvCISearchKey</OutDataType>
  <InDataType>OvCISearchKey</InDataType>
  <KeyFieldOutVal>SAPSystemID</KeyFieldOutVal>
  <KeyFieldInVal>SAPSystemID</KeyFieldInVal>
</FieldMapping>
<FieldMapping ExtHDField="IctIncidentAdditionalInfo/AddInfoValue" >
  <OutDataType>OvCISearchKey</OutDataType>
  <InDataType>OvCISearchKey</InDataType>
  <KeyFieldOutVal>SAPSystemClient</KeyFieldOutVal>
  <KeyFieldInVal>SAPSystemClient</KeyFieldInVal>
</FieldMapping>
<FieldMapping ExtHDField="IctIncidentAdditionalInfo/AddInfoValue" >
  <OutDataType>OvCISearchKey</OutDataType>
  <InDataType>OvCISearchKey</InDataType>
  <KeyFieldOutVal>SAPInstNo</KeyFieldOutVal>
  <KeyFieldInVal>SAPInstNo</KeyFieldInVal>
</FieldMapping>

The following two attributes are used only when Solution Manager forwards an Incident to SAP
Solution Manager.


<FieldMapping ExtHDField="IctIncidentAdditionalInfo/AddInfoValue" >
  <InDataType>InformationLog</InDataType>
  <KeyFieldInVal>SAPIncidentID</KeyFieldInVal>
</FieldMapping>
<FieldMapping ExtHDField="IctIncidentAdditionalInfo/AddInfoValue"
 ValueMappingId="IctIncidentAdditionalInfo/AddInfoValue /SAPIncidentStatus" >
  <InDataType>InformationLog</InDataType>
  <KeyFieldInVal>SAPIncidentStatus</KeyFieldInVal>
</FieldMapping>

The only attributes that don't have read-only status in the SAP Solution Manager are CI
attributes, allowing IN-mode mapping (from SAP Solution Manager to Service Manager). The
following table defines the available attributes:


AttributeType                           Description
SAPComponent                            SAP Component (e.g. SV-SMG-SUP)
SAPSystemID                             SAP System ID
SAPSystemClient                         Client of SAP System
SAPCategory                             Category of the Incident
SAPSystemType                           SAP System Type
SAPInstNo                               SAP Installation Number
SAPSubject                              Subject of the Incident
SAPOperatingSystem                      Operating System of SAP System
SAPDatabase                             Database of SAP System
SAPFrontend                             Frontendsystem and Version
SAPSoftwareComponent                    Software Component
SAPSoftwareComponentRelease             Software Component Release
SAPSoftwareComponentPatch               Software Component Patch
SAPIncidentID                           ID of the Incident at SAP (when forwarded
                                        to SAP)
SAPIncidentStatus                       Status of the Incident at SAP (when
                                        forwarded to SAP)

In the SAP GUI most attributes are in the SAP Attributes tab.


The following example writes all incoming additional values of type SAPDatabase to the
Journal in Service Manager:

<FieldMapping ExtHDField="IctIncidentAdditionalInfo/AddInfoValue" >
  <InDataType>InformationLog</InDataType>
  <KeyFieldInVal>SAPDatabase</KeyFieldInVal>
</FieldMapping>

The following example updates field CustomText03 .

<FieldMapping ExtHDField="IctIncidentAdditionalInfo/AddInfoValue" >
  <InOvHDField>CustomText03</InOvHDField>
  <KeyFieldInVal>SAPDatabase</KeyFieldInVal>
</FieldMapping>

Changeable mappings

The following mappings can be modified.

Mapping                                 Description

IctHead/AgentID                         OutOvHDField/InOvHDField field name
IctHead/ReporterID                      can be modified if the replacement field
IctIncidentAttachment/PersonId
IctIncidentStatement/PersonId           contains the ID of a Contact joined with a
                                        contact table that's exposed via
                                        ConfigurationManagement Web Service
                                        (defined in the default configuration).
                                        The AssigneeName field contains the
                                        operator name of Service
                                        Manager instead of the contacts name.

IctHead/ShortDescription                OutOvHDField/InOvHDField can be
                                        modified with any text field from Service
IctHead/RequestedBegin                  Manager.
IctHead/RequestedEnd
                                        Can be modified with any datetime field in
                                        the Service Manager.


Note

Required Mappings: The following mappings are required and must not be
changed.

      IctHead/Priority (the value mapping for this field mapping can be changed)
      IctIncidentSapNotes/item
      IctIncidentSolutions/item
      IctIncidentUrls/item
      IctIncidentAdditionalInfo/AddInfo Value (first 3 mappings)


1.3.1.10.4. Person Synchronization Details

SAP Solution Manager to Service Manager

Persons sent from SAP Service Manager can be mapped to person fields in Service Manager.
When Person details are received, the corresponding contact record is found in Service
Manager by querying the Configuration Management Web Service. The resolved contact ID
must be set in the mapped field. The exchange web service describes persons with the
following fields:

      Sex
      First name
      Last name
      Telephone
      Mobile phone
      Fax
      Email

Fields that are used to find persons in Service Manager:

      Email
      First name
      Last name

Persons are searched by all three fields. If no matching person is found in Service Manager or
duplicates are found, then a notification is added to the Journal. For example, an empty email
causes the following message in response to Journal updates:

Warning! Contact can't be found. Firstname,Lastname,Email fields should not be empty.
Invalid contact: FirstName: "Nicholas" LastName: "Brown" Phone number: "(770) 954-4588"
Fax number: "(770) 954-4590" …

SMSSMEX doesn't create Persons or Contacts. An operator-type lookup is enforced only for
the AssigneeName field.

Mapping from Service Manager to SAP Solution Manager is performed in the same way. The ID
of the Person field in the Service Manager is used to make an additional call to Configuration
Management WS to get all details about the Person. The collected data is forwarded to the
Solution Manager. In SAP Solution Manager the ID of the Person is checked. If the ID is

     Known: Solution Manager assigns an existing record to the Incident.
     Not known: Solution Manager tries to resolve a Person via the email field. If this is
     impossible, a new Person is created.

Contents


1 SAP Solution Manager to Service Manager


1.3.1.10.5. SMSSMEX Version

To find out the version of the SMSSMEX service in Tomcat, do one of the following:

     Open <SMSSMEX_installDir>\tomcat\webapps\ovictex\WEB-INF\lib\ovictex.war with a
     zip tool. The war file MANIFEST.MF file contains the version information.
     Go to the Status page.


1.3.1.11. Installing and Configuring
SAPCRYPLIB

To install SAP Common Crypto Library (SAPCRYPLIB), do the following:
   1. Download SAPCRYLIB from the SAP Software Downloads website.
   2. Use sapcar.exe to extract the *.sar file:

          sapcar -xvf sarfile_name

   3. Copy the extra files to \usr\sap\[Instance folder]\DVEBMGS00\exe .
   4. In transaction /nrz10 in the Profile field, select the profile with prof.type of "Instance

     profile".
   5. Select Extended maintenance in Edit Profile.
   6. Click Change.
   7. Add the following parameters:

          ssf/name = SAPSECULIB
          ssf/ssfapi_lib = $(DIR_EXECUTABLE)\sapcrypto.dll

   8. Restart the system.
   9. Go to transaction /nsmicm .
 10. Select the menu entry GOTO and select Services or press SHIFT+F1.
 11. If the HTTPS port isn't listed, then configure the profile. Add or change the following

     parameter.

          icm/server_port_2 PROT=HTTPS,PORT=[SSL Port]

 12. In the /nsmicm transaction, restart Internet Communication Manager (ICM) by
     selecting Administration > ICM > Restart > Yes.


1.3.1.12. Logging

The following describes the location of log files.
If you start SMSSMEX from Windows:

     setup -startup
      %SMSSMEX_HOME%/logs/smssmex.log.<date>
     Tomcat
      %SMSSMEX_HOME%/tomcat/logs/smssmex.log.<date>
If you start SMSSMEX from Linux:
     setup.sh -startup
      %SMSSMEX_HOME%/logs/smssmex.log.<date>
     Tomcat
      %SMSSMEX_HOME%/tomcat/logs/smssmex.log.<date>


1.3.1.13. Deploying Button Icons

SMSSMEX enhances the functionality of Service Manager by adding some buttons in incident
form to trigger message exchange related actions. The icons for the buttons are provided
additionally in the release package (under <SMSSMEX Release Package>\icons folder). You
can deploy them to the Service Manager Client manually.

Service Manager has two client applications: Windows Client and Web Client. For each of the
clients, the icons should be deployed separately.

Windows Client

Copy button icons from <SMSSMEX Release Package>\icons folder to
<Client_Home>\plugins\com.hp.ov.sm.client.eclipse.user_9.xx\src\resources\icons\obj16

For more information, see Install.

Web Client

Copy the button icons from <SMSSMEX Release Package>\icons folder to
<WebApps_Root>\webtier-<version>\images\toolbar directory.


1.3.1.14. SAP System Landscape Directory
Registration

System Landscape Directory is the central information repository for your system landscape
(Software Catalogue). It contains information about all installable and installed components in a
system landscape. This section decribes how to register this integration into System
Landscape Directory.

            Note

           The SAP System Landscape Directory Registration is a new feature in SMSSMEX
           v1.02. However, this feature is optional. If you don't deploy the SAP System
           Landscape Directory, the functionality of SMSSMEX v1.40 will not be affected.

Prerequisites

Service Landscape Directory is running.

Registering System Landscape Directory

   1. Browse to the <SMSSMEX Release Package and copy the SLDReg folder to your
     computer.

   2. Open the SLDReg folder. Modify the HPSMISystem.properties file according to the
     parameter descriptions in the file. For example, update the ComputerName variable to
     the host name which is running SMSSMEX.

      ComputerName = <your computer name>

   3. Run the following command to compile XML file:

     java -cp SLDReg.jar com.hp.sm.sld.XMLGenerator
     After execution, HPSMI.xml is generated.

   4. Run the following command to register System Landscape Directory:

     java -cp SLDReg.jar com.hp.sm.sld.Register <SLD_HOST> <SLD_HTTPPORT>
     <UserName> <Password>

     In this command:
            <SLD_HOST> is the host name of the Service Landscape Directory server.
            <SLD_HTTPPORT> is the http port of the service landscape directory service.
            <UserName> is the name that you use to log in to the server.
            <Password> is the password that you use to log in to the server.

Contents


1 Prerequisites
2 Registering System Landscape Directory
````
