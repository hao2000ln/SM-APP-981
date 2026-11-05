---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.9.18 .. 1.9.18
printed_pages: 2693-2722
---

# 1.9.18 Configuration Management Details

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9.18. Configuration Management Details

Service Manager uses the Configuration Management application to enable the
Configuration Management process. The main function of Configuration Management
is to identify, baseline, and maintain the Configuration Items (CIs) and to control
changes to them. It also ensures that formal approvals guide releases into controlled
environments and operational uses.

This section explains to the administrator or developer how selected Configuration
Management fields are implemented in the out-of-box Service Manager system.
Topics in this section include:

     MyDevices configuration item form
     Configuration Management form details


1.9.18.1. MyDevices configuration item
form

The Configuration Manager can view and edit details about a CI on the Configuration
item form.
The MyDevices configuration item form is illustrated in the following screenshot:


1.9.18.2. Configuration Management form
details

The following table identifies and describes the fields on the Configuration
Management forms.

Label                                                                                                                                      Service Manager 9.81
CI Identifier
CI Name                                 Configuration Management field descriptions
Asset Tag
Status                                                      Description

Owner                                                       The name of the CI. This is a required
                                                            field.

                                                            System-generated field that specifies
                                                            the unique ID of the configuration item
                                                            (CI).

                                                            This is a legacy field intended for
                                                            customers migrating from previous
                                                            versions of Service Manager to track
                                                            the label or tag placed on physical
                                                            assets, such as for example, a bar
                                                            code.

                                                            This field specifies the status of the CI.
                                                            The out-of-box data is:

                                                                  Available
                                                                  Planned/On order
                                                                  Received
                                                                  In Stock
                                                                  Reserved
                                                                  In use
                                                                  Maintenance
                                                                  Disposed/Retired
                                                                  Installed

                                                            The field is updated manually to reflect
                                                            the current status of the CI. This is a
                                                            required field. The Installed status is
                                                            the default status.

                                                            This field identifies the department that
                                                            owns the CI, for example, the HR
                                                            department could own the laptops that
                                                            its employees use.

 Label                                                                                          Service Manager 9.81
 Config admin group
                                        Description
 Support Groups
 Support Remarks                        This field identifies the group
 Part Number                            responsible for supporting the CI while
                                        the Owner identifies the department
 Service Contract                       that owns the CI. For example, a PC is
 Manufacturer                           owned by the HR department, but IT is
                                        the Config admin group responsible for
This PDF was generated on May 23, 2026  supporting the CI. It is the assignment
                                        group responsible for handling
                                        interactions or incidents for the CI. This
                                        is a required field.

                                        This field identifies what assignment
                                        groups receive when this CI is part of
                                        an interaction as well as when
                                        escalating to an incident.

                                        This field is a comment field intended
                                        to describe or provide notes for the
                                        support groups.

                                        This field specifies the inventory
                                        component number for the CI as
                                        defined by the company-defined CI
                                        inventory number in the model table.
                                        The system uses this number to
                                        provide data on the Manufacturer,
                                        Model, and Version fields if available.

                                        This field specifies the service contract
                                        covering the CI.

                                        This is a system-generated field that
                                        specifies the manufacturer of the CI if
                                        one is associated with the Part
                                        Number. This field along with model
                                        and serial number uniquely identify the
                                        CI.

                                                                                                                          Page 80 of 387
Label                                                                                           Service Manager 9.81
Model
                                        Description
Version
Serial Number                           This is a system-generated field that
Title                                   specifies the manufacturer’s model if
Description                             one is associated with the Part
                                        Number. This field along with
                                        manufacturer and serial number
                                        uniquely identify the item.

                                        This field specifies the manufacturer’s
                                        version number for the CI.

                                        This field specifies the manufacturer’s
                                        serial number for the CI.

                                        This field specifies the title of the CI
                                        owner; for example Mr. or Mrs.

                                        This field is a free-form text field to add
                                        additional information about the CI.

Label                                                                                           Service Manager 9.81
CI Type
                                        Description
CI Subtype
                                        This field identifies the type of CI. The
                                        out-of-box data is:

                                             Application
                                             Business Service
                                             CI Group
                                             Computer
                                             Display Device
                                             Example
                                             Furnishings
                                             Hand Held Devices
                                             Mainframe
                                             Network Components
                                             Office Electronics
                                             Software License
                                             Storage
                                             Telecommunications

                                        The Managed State section displays
                                        different fields depending on the CI
                                        type selected.

                                        This field identifies the subtype of CI.
                                        The list of available subtypes depends
                                        upon the CI Type the user selected. For
                                        more information, see the
                                        Configuration Item types and subtypes
                                        table.

Label                                                                                           Service Manager 9.81
Environment
                                        Description
Security classification
                                        This field specifies if a CI belongs to a
SOX classification                      particular environment. The out-of-box
                                        data is:

                                             Development
                                             Test
                                             Production
                                             Failover
                                             None

                                        This field specifies if the CI has any
                                        security restrictions. The out-of-box
                                        data is:

                                             Unrestricted
                                             Restricted
                                             Confidential
                                             Most Confidential

                                        This field specifies if the CI has a
                                        Sarbanes Oxley (SOX) classification
                                        that applies to the CI. The out-of-box
                                        data is:

                                             Critical
                                             Non Critical

Label                                                                                           Service Manager 9.81
Export control classification
                                        Description
IT service continuity plan enabled
Critical CI                             This field specifies if the CI has an
                                        Export Control classification. The out-
                                        of-box data is:

                                             EAR99 (Non Controlled)
                                             4D994
                                             5D991
                                             5D002
                                             5D992

                                        This field specifies if the CI has an IT
                                        service continuity plan enabled for it.

                                        This field specifies if the CI is critical
                                        for day-to-day operation, such as an E-
                                        mail server or RDBMS server. If you
                                        open an incident on a critical CI, the
                                        incident indicates that this is a critical
                                        CI.

Label                                                                                           Service Manager 9.81
Priority
                                        Description

                                        This field specifies the default priority
                                        of any related records opened against
                                        the CI. The information in this field is
                                        used to prepopulate the priority in an
                                        incident or interaction. When a user
                                        selects the CI in an incident or
                                        interaction, it populates the incident or
                                        interaction priority based on the CI
                                        priority field. The out-of-box data is:

                                             1 - Critical
                                             2 - High
                                             3 - Average
                                             4 - Low

                                        For additional information, see the
                                        Incident Management form details
                                        table.

Label                                                                                           Service Manager 9.81
Default Impact
                                        Description
Calculate Related Record Counts
User Base                               This field specifies the default impact
System Down                             of any related record opened against
                                        the CI. The information in this field is
                                        used to prepopulate the impact in an
                                        incident or interaction. When a user
                                        selects the CI in an incident or the
                                        interaction, it populates the incident or
                                        interaction impact based on the CI
                                        Default Impact field. The out-of-box
                                        data is:

                                             1 - Enterprise
                                             2 - Site/Dept
                                             3 - Multiple Users
                                             4 - User

                                        For additional information, see the
                                        Incident Management form details
                                        table.

                                        Clicking this button displays a count of
                                        related incidents, problems, known
                                        errors, and changes that were opened
                                        against this CI.

                                        This field displays a count of the
                                        number of users who use the CI.

                                        This field indicates whether the CI is
                                        currently operational or has an open
                                        incident related to it causing it to be
                                        non-operational. When you close the
                                        incident for the CI, this action clears
                                        the flag. The CI is no longer marked as
                                        down.

 Label                                                                                          Service Manager 9.81
 Pending Change
 Allow Subscribe                        Description
 Baseline > Baseline
 Baseline >                             This field indicates whether or not
 Baseline Version                       there are any changes pending against
                                        this CI.
 Managed State
                                        This field determines if the CI is
 Actual State                           available for subscriptions from the
                                        Service Catalog.
This PDF was generated on May 23, 2026
                                        This field indicates if the CI has an
                                        associated baseline and if the CI is in
                                        compliance.

                                        This field indicates the baseline version
                                        that the CI is tracked against. Baseline
                                        Versions enable you to have CIs with
                                        the same baseline configuration but
                                        slight differences. You can have several
                                        versions of that baseline, or if you have
                                        updates for a new version of a software
                                        installed, then you can select a specific
                                        version of a baseline for a CI.

                                        This section lists the expected values
                                        of CI attributes. All changes to fields in
                                        the Managed State section require a
                                        Change Management record. See the
                                        Managed State subsections table for
                                        the Managed State subsection field
                                        descriptions.

                                        This section lists the actual values of CI
                                        attributes if the Service Manager
                                        system has an integration to Universal
                                        CMDB. It shows the latest discovered
                                        information from the UCMDB or its
                                        sources.

                                                                                                                          Page 87 of 387

Label                                   Description

CI Changes > Pending Attribute          This field lists the attributes that are
Changes                                 waiting to be changed through a
                                        Change Management record or
                                        changes requested through an
                                        Unplanned Change (requires an
                                        Universal CMDB integration). The data
                                        in this field can only be modified
                                        through Change Management. Each CI
                                        has a set of managed attributes that
                                        can be changed through Change
                                        Management.

CI Changes > Historic Attribute         This field lists the attributes that are
Changes                                 have already been changed through a
                                        Change Management record or
                                        changes requested through an
                                        Unplanned Change (requires an
                                        Universal CMDB integration).

Relationships > Upstream Relationships  This field shows information about
>                                       which upstream CIs are dependent on
                                        the selected CI. Upstream CIs depend
Upstream Configuration Item,            on the current CI. For example, the
Relationship Name, Relationship Type,   upstream E-mail service depends on
Relationship Subtype                    the downstream E-mail server, the
                                        network, and your E-mail program.

Relationships > Upstream Relationships  This option links to the add a new CI
> Add                                   relationship record that enables you to
                                        add a new upstream relationship to this
                                        CI.


Label                                   Description

Relationships > Upstream Relationships  This option provides different views of
>                                       upstream CI relationships for the
                                        specified CI.
View Relationship Type (All, Logical,
Physical)                                    All: displays all upstream CI
                                             relationships for this CI that are
                                             either physical or logical.
                                             Logical: displays all upstream
                                             logical CI relationships for the
                                             specified CI. A logical connection
                                             means that you can access the CI
                                             but there is no direct physical
                                             connections to other CIs. For
                                             example, a network printer that
                                             you use.
                                             Physical: displays all upstream
                                             physical CI relationships for the
                                             specified CI. A physical
                                             connection is when a CI is directly
                                             attached to another device. For
                                             example, a PC connected to a
                                             dedicated printer with printer
                                             cable.

                                        To view ALL/Logical/Physical upstream
                                        relationships of the specified CI, select
                                        an option in the View Relationship Type
                                        field and then click Filter. A list of CI
                                        relationship records displays. Click
                                        Cancel in a CI relationship record to
                                        return to the specified CI.


Label                                   Description

Relationships >                         This option shows the CIs that have a
Downstream Relationships >              downstream dependency on this CI.
Relationship Name, Relationship Type,   For example, the upstream E-mail
Relationship Subtype                    service depends on the downstream E-
                                        mail server, the network, and your E-
Relationships >                         mail program.
Downstream Relationships >
Add                                     This option links to the add a new CI
                                        relationship record that enables you to
                                        add a new downstream relationship to
                                        this CI.

Label                                                                                           Service Manager 9.81
Relationships > Downstream
Relationships >                         Description
View Relationship Type (All, Logical,
Physical)                               This option provides different views of
                                        downstream CI relationships for the
Relationship Graph                      specified CI.

                                             All: displays all downstream CI
                                             relationships for this CI that are
                                             either physical or logical.
                                             Logical: displays all downstream
                                             logical CI relationships for the
                                             specified CI. A logical connection
                                             means that you can access the CI
                                             but there is no direct physical
                                             connections to other CIs. For
                                             example, a network printer that
                                             you use.
                                             Physical: displays all downstream
                                             physical CI relationships for the
                                             specified CI. A physical
                                             connection is when a CI is directly
                                             attached to another device. For
                                             example, a PC connected to a
                                             dedicated printer with printer
                                             cable.

                                        To view ALL/Logical/Physical
                                        downstream relationships of the
                                        specified CI, select an option in the
                                        View Relationship Type field and then
                                        click Filter. A list of CI relationship
                                        records displays. Click Cancel in a CI
                                        relationship record to return to the
                                        specified CI.

                                        This section displays a graphical
                                        representation of the upstream and
                                        downstream relationships for the CI.

Label                                                                                           Service Manager 9.81
Software >
Applications & Drivers                  Description

CI Owner >                              This section displays information about
Primary Contact & Support Contacts      the software and drivers installed on
                                        the CI. For example, a PC might list
Subscribers >                           Microsoft Office and Adobe Reader
Subscriber, Type, Status                along with the version, install date, and
                                        license ID for each. An Administrator
                                        enters this data using the Managed
                                        Software menu.

                                        This field displays the CI owner who is
                                        the person assigned the CI and uses it
                                        on a day-to-day basis. Support
                                        contacts are secondary contacts who
                                        may have access to the CI. For
                                        example, a subscriber would be a
                                        department for a printer, but the users
                                        would be all the people who use the
                                        printer to print. The CI owner is the
                                        person who is responsible for the
                                        printer, such as the department
                                        manager.

                                        This is a system-generated section that
                                        shows all the subscriptions (people or
                                        departments) made against the CI, and
                                        the status of the subscription. Example:
                                        People and departments can subscribe
                                        to Services or CIs. When looking at an
                                        interaction, the Service Desk Agent
                                        views a list of all the CIs the caller is
                                        subscribed to, and their current status.

Label                                                                                           Service Manager 9.81
Location >
Location Information &                  Description
Location Comments
                                        This section describes the physical
Vendor >                                location of the CI and may include
Vendor Information &                    information such as special access
Contract and Response Information       requirements (for example, you may
                                        require badge access or you may need
Audit >                                 to be accompanied by authorized
Audit Policy, Audit Status,             personnel in some locations). For
Audit Discrepancy, Last Audit Date,     example, the location information might
Next Scheduled Audit,                   contain, Australia, Home Site, main
Last Audited By                         building, second floor, room 3.

Metrics >                               This section provides Vendor
Outage History, Uptime Objectives,      Information and Contract and
Max Duration Objectives                 Response Information about the CI for
                                        support and maintenance. When the
Financial >                             user enters the vendor name, the
Contracts, Expense Lines,               system automatically provides the
Labor, Parts                            additional details.

                                        These fields display auditing
                                        information and are only enabled for
                                        those users who have the capability to
                                        audit CIs. The user role is Configuration
                                        Auditor.

                                        This section displays information
                                        related to the SLA and SLO availability
                                        data for the CI.

                                        This section displays information for
                                        the service contracts, parts, labor, and
                                        expenses for the CI.

Label                                                                                           Service Manager 9.81
Attachments
                                        Description

                                        This section displays the Filename and
                                        Size of each attachment of the CI
                                        record. Users can add new
                                        attachments using the Add File button
                                        and remove any existing attachments
                                        by clicking the remove links.


1.9.18.2.1. Configuration Item types and
subtypes

The following table lists the types and subtypes available for the out-of box
Configuration Item (CI) Names.


                                        Configuration Item types and subtypes

CI Name                                 CI Type                                CI Subtype
Application
                                        application                            Anti-Virus / Security
Business Service
CI Group                                                                       Back-up
Computer                                                                       Business
                                                                               Development Tools
                                                                               Entertainment
                                                                               Graphics
                                                                               Internet/Web
                                                                               Networking
                                                                               Operating System
                                                                               Reference
                                                                               Other

                                        bizservice                             Business Service

                                                                               Application Service
                                                                               Infrastructure Service

                                        cigroup                                Ad Hoc
                                                                               Baseline

                                        computer                               Desktop
                                                                               Dumb Terminal
                                                                               Laptop

                                                                               Tower
                                                                               MAC
                                                                               Server
                                                                               Host
                                                                               VAX
                                                                               Windows
                                                                               Unix
                                                                               Mainframe
                                                                               Logical Partition
                                                                               Terminal Server

CI Name                                 CI Type                                Service Manager 9.81
Display Device                          displaydevice
                                                       CI Subtype
Example                                 example
Furnishings                             furnishings    Monitor
                                                       Projector
Hand Held Devices                       handhelds
                                                       Artwork
Mainframe                               mainframe      Armoire
                                                       Bookcase
                                                       Chair
                                                       Computer Desk
                                                       Desk Collection
                                                       File Cabinet
                                                       Meeting Table

                                                       PDA
                                                       Cell Phone
                                                       Pager
                                                       Blackberry Device
                                                       GPS Device

                                                       Controller
                                                       Host CPU
                                                       FEP
                                                       NCP
                                                       LPAR

CI Name                                 CI Type                                    Service Manager 9.81
Network Components                      networkcomponents
                                                           CI Subtype
Office Electronics                      officeelectronics
                                                           Router

                                                           Hub
                                                           Switch
                                                           Modem
                                                           Network Interface Card
                                                           Gateway
                                                           Firewall
                                                           Network Component
                                                           ATM Switch
                                                           RAS
                                                           LB
                                                           Concentrator
                                                           Net Device
                                                           Switch Router

                                                           Copy Machine

                                                           Printer
                                                           Fax Machine
                                                           Paper Shredder
                                                           Camera
                                                           Speaker
                                                           Calculator
                                                           Multifunction
                                                           Word Processor
                                                           Typewriter
                                                           VCR
                                                           Television
                                                           UPS
                                                           Net Printer

CI Name                                 CI Type                                  Service Manager 9.81
Software License                        softwarelicense
                                                         CI Subtype
Storage                                 storage
                                                         DBMS License
Telecommunications                      telcom
                                                         Development Tool
                                                         License
                                                         Enterprise Management
                                                         License
                                                         Operating System
                                                         License
                                                         Outlook
                                                         Productivity Tools
                                                         License
                                                         Project Management
                                                         License
                                                         Utility Software License

                                                         CDRW

                                                         Direct Attached Storage
                                                         (DAS)
                                                         HDD
                                                         Network Attached
                                                         Storage (NAS)
                                                         Storage Area Network
                                                         (SAN)
                                                         ZIP
                                                         CD Burner

                                                         Desk Phone

                                                         Flush Wall Mount
                                                         Headsets & Accessories
                                                         NBX
                                                         PBX
                                                         Paging Solution
                                                         Surface Mount


1.9.18.2.2. Managed State subsections

The Managed State section uses subsections to display data about each CI. There are
three subsections for this purpose. The Network subsection and the Additional
subsection are used for all CI types. The third subsection depends upon the CI and CI
type selected. For example, the Adobe Reader is an application CI type and therefore
includes the Application subsection in the Managed State section.
The following table outlines the subsections and fields available for the different CI
types.


Sub-Tab                Managed State subsections            Field Name
Hardware
          Visible Condition Field Label                     machine.name
Network
          Type: computer                Machine Name        mac.address
          or                                                addlMacAddress
                                        Primary MAC         operating.system
          Type:                         Address             os.manufacturer
          networkcompone                Additional MAC      os.version
          nts or                        Addresses           bios.id
          Type:                         OS Name             bios.manufacture
          officeelectronics             OS Manufacturer     r
                                        OS Version          bios.model
                                        Bios ID             physical.mem.tot
                                        Bios                al
                                        Manufacturer
                                        Bios Model
                                        Physical Memory
                                        (Kb)

          true                          Network Name network.name

                                        Primary IP          ip.address
                                        Address             subnet.mask
                                        Subnet Mask         default.gateway
                                        Default Gateway     config.file
                                        Configuration File  addlIPAddress
                                        Addl IP Address     addlSubnet
                                        Addl Subnet
                                        Mask


Sub-Tab      Visible Condition Field Label                 Field Name
Application
             Type: application          Application Name   ci.name
Database
                                        Administration     admin.urlport
                                        URL/Port           business.import.
                                        Business Import    level
                                        Level              disaster.coverage
                                        Disaster/Recover   recorvery.tier
                                        y Coverage         primary.path
                                        Disaster/Recover   data.classification
                                        y Tier             product.version
                                        Primary Directory  license.type
                                        Path               service.hours
                                        Data               notification.group
                                        Classification     s
                                        Product Version
                                        License Type
                                        Service Hours
                                        Notification
                                        Group

             Type: database             Data Privacy       data.privacy

                                        Data               recorvery.tier
                                        Classification     port.number
                                        Port Number        NULL
                                        Disaster/Recover   recorvery.tier
                                        y Coverage         admin.urlport
                                        Disaster/Recover   product.version
                                        y Tier             listener.port
                                        Administration     notification.group
                                        URL/Port
                                        Product Version
                                        Listener Access
                                        Port
                                        Notification
                                        Group


Sub-Tab  Visible Condition Field Label                     Field Name
Telecom
         Type: telecom                  Admin ID           admin.id
Service
                                        Admin Password     admin.password
                                        Remote Access      remote.phone
                                        Phone              remote.ip
                                        Remote Access IP   NULL
                                        Voice type         disaster.recovery
                                        Disaster/Recover   recorvery.tier
                                        y Coverage         grid
                                        Disaster/Recover   login.server.name
                                        y Tier             monitored
                                        Grid
                                        Login Server
                                        Name
                                        Monitored

         Type: bizservice               Service Name       ci.name

                                        Service Type       subtype
                                        Service Status     service.status
                                        Allow              allowSubscription
                                        Subscriptions      admin.urlport
                                        Administration     NULL
                                        URL/Port           NULL
                                        Business Import    recorvery.tier
                                        Level              primary.path
                                        Disaster/Recover
                                        y Coverage
                                        Disaster/Recover
                                        y Tier
                                        Primary Directory
                                        Path

Sub-Tab     Visible Condition Field Label                    Service Manager 9.81
Additional
            true                        Manufacturer  Field Name

                                        Name          addl.manufacture
                                        Type          r
                                        Description   addl.name
                                                      addl.type
                                                      addl.description
````
