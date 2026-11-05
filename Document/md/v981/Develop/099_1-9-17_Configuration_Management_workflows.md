---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.9.17 .. 1.9.17.3
printed_pages: 2640-2668
---

# 1.9.17 Configuration Management workflows

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9.17. Configuration Management
workflows

The Configuration Management process manages service assets to support other
Service Management processes. Effective Configuration Management facilitates
greater system availability, minimizes production issues, and resolves issues more
efficiently.

The Configuration Management process consists of the following processes, which
are included in this chapter:

     Configuration Management Planning (process ST 3.1)
     Configuration Identification (process ST 3.2)
     Configuration Control (process ST 3.3)
     Configuration Status Accounting and Reporting (process ST 3.4)
     Configuration Verification and Audit (process ST 3.5)
     Master data management (process ST 3.6)


1.9.17.1. Configuration Management
Planning (process ST 3.1)

Infrastructure and services should have an up-to-date Configuration Management
plan, which can stand alone or form part of other planning documents. The
Configuration Management plan should include or describe the following:

     Scope, objectives, policies, standards, roles, and responsibilities
     Configuration Management processes to provide the following services:
     ** Define the Configuration Items that comprise related service(s) and
     infrastructure

           Control changes to configurations
           Record and report the status of Configuration Items
           Verify the completeness and correctness of Configuration Items according
           to the requirements for accountability, traceability, and auditability
     Configuration Control (access, protection, version, build, and release controls)
     Interface control process for identifying, recording, and managing CIs and
     information at the common boundary of two or more organizations (for example,
     system interfaces and releases)
     Planning and establishing the resources to bring assets and configurations
     under control and maintain the Configuration Management system (for example,
     training)
     Management of suppliers and subcontractors performing Configuration
     Management

Details for this process can be seen in the following figure and table.

The Configuration Management Planning workflow is illustrated in the following
figure:



                                        Configuration Management Planning process

Process ID  Procedure or                Description                                Role
ST 3.1.1
            Decision

            Maintain                    The Configuration                          Configuration
            Configuration               Manager                                    Manager
            Management plan             maintains the
                                        Configuration
                                        Management
                                        policies,
                                        objectives, scope,
                                        and principles.
                                        Periodically, this
                                        plan is reviewed
                                        to determine
                                        improvements.
                                        The Configuration
                                        Management plan
                                        (ACM plan) also
                                        defines the scope
                                        and level of detail
                                        of Configuration
                                        Item (CI) data to
                                        be maintained in
                                        the CMS. A
                                        Configuration
                                        Management plan
                                        provides the
                                        guidelines for
                                        documenting and
                                        modeling IT
                                        services in the
                                        CMS
                                        (identification of
                                        CIs).

Process ID  Procedure or                Description                 Service Manager 9.81
ST 3.1.2    Decision
            Configuration                                    Role
ST 3.1.3    model update
            required?                   Determine            Configuration
                                        whether the          Manager
            Review CMS                  Configuration
            change task                 model should be
                                        updated. If yes,
                                        go to ST 3.1.4. If
                                        no, go to ST 3.1.9.

                                        The Configuration    Configuration
                                        Manager receives     Manager
                                        a task from
                                        Configuration
                                        Management to
                                        update the CMS
                                        data model (for
                                        example, when a
                                        new type of CI is
                                        introduced in the
                                        IT infrastructure
                                        as a result of a
                                        release).


Process ID  Procedure or                Description          Role
ST 3.1.4
            Decision

            Update CMS data             The data model       CMS/Tools
            model                       defines the          Administrator
                                        structure and
                                        information model
                                        of the CMS. This
                                        includes:

                                             Model of IT
                                             services
                                             (breakdown
                                             of services
                                             into service
                                             components
                                             )
                                             CI
                                             relationships
                                             types
                                             Definition of
                                             CI types
                                             Definition of
                                             CI attributes
                                             Identificatio
                                             n of data
                                             sources
                                             (such as
                                             HR-system
                                             or ERP)

                                        The Configuration
                                        Manager
                                        determines the
                                        type of
                                        modification
                                        that's required for
                                        the CMS model.


Process ID  Procedure or                Description          Role
ST 3.1.5
ST 3.1.6    Decision

ST 3.1.7    New CI type                 If a new CI type is  CMS/Tools
            needed?                     needed, go to ST     Administrator
                                        3.1.7. If not,
                                        continue with ST
                                        3.1.6.

            Modification of CI          If a modification    CMS/Tools
            type required?              of the CI type is    Administrator
                                        required, go to ST
                                        3.1.8. If not,
                                        continue with ST
                                        3.1.9.

            Create new CI               The CMS/Tools        CMS/Tools
            type                        Administrator        Administrator
                                        adds a new CI
                                        type (device
                                        type). This
                                        includes the
                                        definition of CI
                                        attributes and
                                        screen design.


Process ID  Procedure or                Description          Role
ST 3.1.8    Decision
                                        Create or modify     CMS/Tools
ST 3.1.9    Configure CI                the definition of    Administrator
            types                       the CI type. This
                                        includes:

                                        CI subtypes
                                        Attribute
                                        definitions
                                        Screen
                                        design
                                        CI
                                        relationships
                                        types
                                        Naming
                                        conventions
                                        Business
                                        rules on
                                        required
                                        fields

            Configuration               The Configuration    Configuration
            Management                  Administrator        Manager
            policies update             determines
            required?                   whether the
                                        Configuration
                                        Management
                                        policies must be
                                        updated (to
                                        reflect the SCAM
                                        plan). If so, go to
                                        ST 3.1.12.

Process ID  Procedure or                Description                Service Manager 9.81
ST 3.1.10   Decision
                                                            Role
            Maintain
            Configuration               The Configuration   Configuration
            Management                  Manager             Manager
            policies                    maintains the
                                        Configuration
                                        Management
                                        policies. Policies
                                        may be applicable
                                        for specific asset
                                        types (or CI
                                        Types) or
                                        services. Policies
                                        may include
                                        business rules
                                        and requirements
                                        for specific
                                        information to be
                                        maintained in the
                                        CMS (for
                                        example, for
                                        compliance
                                        purposes or to
                                        monitor
                                        contracts).
                                        Policies
                                        determine how
                                        often a
                                        configuration
                                        audit is required.
                                        Policies also
                                        designate which
                                        data in a CI may
                                        be updated by
                                        inventory tools,
                                        as well as what
                                        actions must be
                                        performed if


Process ID  Procedure or                Description         Role
ST 3.1.11   Decision
                                        unauthorized
            Configure                   software is
            Configuration               detected. Other
            Management                  items covered by
            policies                    policies and
                                        business rules
                                        include:

                                             Naming
                                             conventions
                                             Labeling
                                             rules
                                             Asset
                                             capitalizatio
                                             n rules (for
                                             example, to
                                             set the
                                             depreciation
                                             start date)
                                             Procedures
                                             for lost or
                                             stolen items

                                        Configuration
                                        Management
                                        policies and
                                        requirements are
                                        translated into
                                        tool settings (for
                                        example, required
                                        fields, schedule
                                        for automated
                                        inventory and
                                        discovery, and
                                        reconciliation
                                        rules).

Process ID  Procedure or                Description                Service Manager 9.81
ST 3.1.12   Decision
                                                            Role
            CMS update?
                                        If yes, go to ST    Configuration
                                        3.3.1. If not, the  Manager
                                        process is
                                        finished.


1.9.17.2. Configuration Identification
(process ST 3.2)

In the Configuration Identification process, the Configuration Administrator selects
Configuration Items (CIs), records their identifying characteristics, and assigns unique
identifiers to the selected items. This process helps to ensure efficient data storage
and retrieval.
Configuration Identification process is enables you to do the following:

     Identify and register CIs
     Assign unique labels
     Record relationship information

Configuration Identification is responsible for collecting information about CIs and
their relationships, and for loading this information into Configuration Management.
Configuration Identification is also responsible for labeling the CIs, which enables the
corresponding configuration records to be found.
Details for this process can be seen in the following figure and table.
The Configuration Identification workflow is illustrated in the following figure:



                                        Configuration Identification process

Process ID  Procedure or                Description                           Role
ST 3.2.1
            Decision
ST 3.2.2
            Validate task for           The Configuration                     Configuration
            CI creation                 Administrator                         Administrator
                                        reviews the task
                                        to verify that all
                                        required
                                        information to
                                        create a new
                                        configuration item
                                        is complete and
                                        correct.
                                        Configuration
                                        describes a group
                                        of CIs that work
                                        together to
                                        deliver an IT
                                        Service, or a
                                        recognizable part
                                        of an IT Service.
                                        The term
                                        configuration can
                                        also refer to the
                                        parameter
                                        settings for one
                                        or more CIs.

            Information                 If the information                    Configuration
            correct and                 is correct and                        Administrator
            complete?                   complete,
                                        continue with ST
                                        3.2.3. If not, go to
                                        ST 3.2.15 (reject
                                        task).

Process ID  Procedure or                Description                 Service Manager 9.81
ST 3.2.3    Decision
                                                             Role
            Determine CI
            type(s) of                  Determine the CI     Configuration
            configuration               type(s) needed to    Administrator
                                        register the CIs. A
                                        CI type is used as
                                        a template to
                                        document the CI,
                                        including,
                                        attributes and
                                        required fields.

Process ID  Procedure or                Description                  Service Manager 9.81
ST 3.2.4    Decision
                                                              Role
            Appropriate CI
            type(s) exist?              A CI can only be      Configuration
                                        registered if the     Administrator
                                        CI type is known
                                        and a
                                        Configuration
                                        Management
                                        policy is available
                                        for these types.
                                        Existing types
                                        must match the
                                        attributes that
                                        need to be
                                        managed and
                                        allow designation
                                        of a person who
                                        is responsible for
                                        maintaining the
                                        CI.

                                        CIs of a
                                        registered type
                                        can be used as
                                        templates for new
                                        CIs. If there are
                                        existing CI types,
                                        continue with ST
                                        3.2.5. If not, go to
                                        ST 3.2.11.


Process ID  Procedure or                Description         Role
ST 3.2.5
            Decision
ST 3.2.6
ST 3.2.7    Existing reference          Verify that the     Configuration
            data?                       reference data      Administrator
                                        (the product
                                        definition from
                                        the manufacturer
                                        or supplier) for
                                        the configuration
                                        exist. If there is
                                        no reference
                                        data, go to ST
                                        3.2.6. If yes,
                                        continue with ST
                                        3.2.7.

            Create new                  Create a            Configuration
            reference data              reference data.     Administrator

            Create new CI               Create the CIs      Configuration
                                        part of the         Administrator
                                        configuration.
                                        One or more CIs
                                        can be created.
                                        Select the CI type
                                        (template). Select
                                        the model.

Process ID  Procedure or                Description                Service Manager 9.81
ST 3.2.8    Decision
                                                            Role
            Populate
            configuration               Enter the required  Configuration
            details                     CI attributes,      Administrator
                                        according to the
                                        Configuration
                                        Management
                                        policies. Capture
                                        relationships and
                                        dependencies
                                        between the CIs.
                                        Depending upon
                                        the CI type and
                                        business rules,
                                        examples of
                                        details include:

                                             Serial
                                             number
                                             location (for
                                             example, on
                                             stock)
                                             Purchase
                                             order
                                             number
                                             Receipt date
                                             warranty
                                             conditions
                                             and
                                             warranty
                                             end date
                                             CI specific
                                             attributes


Process ID  Procedure or                Description         Role
ST 3.2.9    Decision
                                        All CIs must be     Configuration
            Register                    assigned to an      Administrator
            ownership and               owner (that is, a
            support groups              reference to an
                                        organizational
                                        entity such as a
                                        cost center) and
                                        an administrator
                                        (the group
                                        responsible for
                                        managing the CI
                                        during its life
                                        cycle). Activities
                                        include:

                                             Assign
                                             owner
                                             Assign
                                             Configuratio
                                             n
                                             Administrato
                                             r (group)
                                             Assign
                                             support
                                             group for
                                             incident
                                             assignment
                                             (for
                                             example, if
                                             needed for
                                             automated
                                             assignment
                                             in case of
                                             events
                                             detected on
                                             the device)

Process ID  Procedure or                Description                Service Manager 9.81
ST 3.2.10   Decision
                                                            Role
            Relate to
            contract?                   Determine related   Configuration
                                        contracts for the   Administrator
                                        components,
                                        such as:

                                        Maintenanc
                                        e or support
                                        contracts
                                        Financial
                                        contracts
                                        (for
                                        example,
                                        lease or
                                        rental)
                                        License
                                        contract or
                                        service
                                        contracts
                                        (for
                                        example,
                                        SLA, UC,
                                        and OLA)

                                        If no contracts
                                        are relevant for
                                        this
                                        Configuration, go
                                        to ST 3.2.12. If
                                        yes, continue with
                                        ST 3.2.11 to link
                                        the items to the
                                        contract.


Process ID  Procedure or                Description           Role
ST 3.2.11
            Decision
ST 3.2.12
            Match and relate            Link the CIs to       Configuration
ST 3.2.13   to contract(s)              one or more           Administrator
ST 3.2.14                               contracts.
                                        Capture the
                                        inclusion date of
                                        the CI to the
                                        contract. If
                                        needed, inform
                                        the Contract
                                        Manager of the
                                        new items
                                        attached to the
                                        contract.

            Labeling of CI              Determine             Configuration
            required?                   whether CIs need      Administrator
                                        to be labeled
                                        according to the
                                        Configuration
                                        Management
                                        policies. If not, go
                                        to ST 3.2.14. If
                                        yes, continue with
                                        ST 3.2.13.

            Create and attach           Create and print a    Configuration
            label                       label. Physically     Administrator
                                        attach the label to
                                        the CI.

            Close                       After completion,     Configuration
            Configuration               the task can be       Administrator
            Management task             closed. Update
                                        closure code.


Process ID  Procedure or                Description         Role
ST 3.2.15
            Decision
ST 3.2.16
ST 3.2.17   Reject task                 If the task can't   Configuration
                                        be completed,       Administrator
                                        reject the task.
                                        Update the task
                                        with reasons and
                                        details of any
                                        issues found.

            Assess reason for           The Change          Change
            rejection                   Coordinator         Coordinator
                                        assesses the
                                        reason for the
                                        rejection.

            Gather and                  The Change          Change
            document                    Coordinator         Coordinator
            required details            documents the
                                        details related to
                                        the rejected task.


1.9.17.3. Configuration Control (process
ST 3.3)

In the Configuration Control process, the Configuration Administrator reviews the
Configuration Management task for updating the Configuration Management system
(CMS) and evaluates the configuration in its premodification and postmodification
state. The Configuration Administrator verifies the information is correct and
complete, and contains a description of attributes to be modified; the proposed
modifications comply with Configuration Management policies; and that the
configuration details are updated in the Configuration Management database.
Details for this process can be seen in the following figure and table.
The Configuration Control workflow is illustrated in the following figure:

                                        Configuration Control process         Service Manager 9.81

Process   Procedure or                  Description                    Role
ID        Decision
ST 3.3.1
          Review CMS                    The Configuration              Configuration
ST 3.3.2  Change task                   Administrator                  Administrator
                                        reviews the task
          New CI?                       for updating the
                                        Configuration
                                        Management
                                        System (CMS).

                                        If the task refers             Configuration
                                        to the creation of             Administrator
                                        one or more new
                                        CIs, go to ST 3.2.1
                                        and follow the
                                        procedure to
                                        validate a task for
                                        CI creation. If the
                                        task is related to
                                        the modification
                                        of an existing CI,
                                        continue with ST
                                        3.3.3.

Process   Procedure or                  Description                 Service Manager 9.81
ID        Decision
ST 3.3.3                                                     Role

ST 3.3.4  Information                   Verify that all      Configuration
ST 3.3.5  complete and                  information to       Administrator
          correct?                      update the CIs is
                                        available and
                                        correct. The task
                                        should refer to at
                                        least one CI that
                                        must be updated.
                                        The task contains
                                        a description of
                                        the attributes to
                                        be modified. If
                                        not all information
                                        is complete and
                                        correct, go to ST
                                        3.3.4 (reject
                                        task). If yes,
                                        continue with ST
                                        3.3.7.

          Reject task                   If the               Configuration
                                        configuration        Administrator
                                        update can't be
                                        completed, the
                                        task is rejected. A
                                        reason and
                                        recommended
                                        actions must be
                                        provided.

          Assess reason for             The Change           Change
          rejection                     Coordinator          Coordinator
                                        assesses the
                                        reason for the
                                        rejection.

Process   Procedure or                  Description                Service Manager 9.81
ID        Decision
                                                            Role
ST 3.3.6
          Gather and                    The Change          Change
          document                      Coordinator         Coordinator
          required details              documents the
                                        details related to
                                        the rejected task.

Process   Procedure or                  Description               Service Manager 9.81
ID        Decision
                                                           Role
ST 3.3.7
          Adjust CI details             Modify the         Configuration
                                        configuration      Administrator
                                        details in the
                                        Configuration
                                        Management
                                        database.
                                        Configuration
                                        modifications can
                                        include:

                                        Status
                                        (items
                                        transferred
                                        from test to
                                        production
                                        or to
                                        retirement)
                                        Location
                                        (moves)
                                        Relationship
                                        s and
                                        dependenci
                                        es
                                        Installation
                                        of software
                                        on the item
                                        Transfer of
                                        ownership
                                        Assign
                                        contract to a
                                        CI

Process   Procedure or                  Description               Service Manager 9.81
ID        Decision
                                                           Role
ST 3.3.8
          Close CMS task                After completion   Configuration
                                        of the             Administrator
                                        configuration
                                        updates, the task
                                        can be closed.
````
