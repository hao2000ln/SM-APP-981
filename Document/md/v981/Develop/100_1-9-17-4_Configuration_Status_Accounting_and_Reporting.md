---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.9.17.4 .. 1.9.17.6
printed_pages: 2668-2693
---

# 1.9.17.4 Configuration Status Accounting and Reporting (process ST 3.4)

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9.17.4. Configuration Status Accounting
and Reporting (process ST 3.4)

Configuration Status Accounting and Reporting ensures that all configuration data
and documentation are recorded as each CI progresses through its life cycle from test
to production to retirement. Configuration information should be kept current and
made available for planning, decision making, and managing changes to the defined
configurations.

Configuration Status Accounting and Reporting keeps track of the following CI status
changes:

     New items received (as evidenced by a goods receipt procedure or from
     development)
     Installation of items
     Transition from test to production
     System down (based upon events)
     Retired or disposed items
     Lost or stolen items
     Unauthorized CIs and Version changes of CIs

Current and accurate configuration records should be maintained to reflect changes
in the status, location, and versions of CIs. The history of each CI must be maintained.
Changes to CIs are tracked through various states, such as ordered, received, in
acceptance test, live, under change, withdrawn, or disposed.

Where required, configuration information should be accessible to users, customers,
suppliers, and partners to assist them in their planning and decision making. For
example, an external service provider may make configuration information accessible
to the customer and other parties to support the other service management
processes in an end-to-end service. Archiving procedures should be defined for data
related to retired or disposed CIs.

Configuration Management reports should be available to all relevant parties. The
reports should cover the identification and status of the CIs, including their versions
and associated documentation. A large set of different reports are needed for the
different stakeholders (for example, audit reports, software compliance reports, and
charge back reports).

Details for this process can be seen in the following figure and table.


The Configuration Status Accounting and Reporting workflow is illustrated in the
following figure:


            Configuration Status Accounting and Reporting process

Process ID  Procedure or                Description                Role

            Decision


Process ID  Procedure or                Description          Role
ST 3.4.1    Decision
                                        Modifications of     Configuration
            Review CI update            key attributes of    Auditor
                                        the CI are logged
                                        in the history log
                                        and verified.
                                        During
                                        Configuration
                                        Identification and
                                        control activities,
                                        configuration
                                        status records are
                                        created. These
                                        records enable
                                        key changes to
                                        be visible and
                                        traceable. CI
                                        attributes that can
                                        be logged
                                        include:

                                        status (for
                                        example,
                                        system
                                        down)
                                        version
                                        number
                                        serial
                                        number
                                        installation
                                        date
                                        audit status
                                        (for
                                        example,
                                        missing or
                                        lost)
                                        removed
                                        from a


Process ID  Procedure or                Description          Role
ST 3.4.2    Decision
                                             contract
            Key policy
            change?                     Critical CI
                                        changes are
                                        logged with
                                        entries for
                                        reason, date
                                        stamp, time
                                        stamp, and
                                        person recording
                                        the status
                                        change.

                                        Determine            Configuration
                                        whether the          Auditor
                                        policy must be
                                        reviewed or
                                        validated, based
                                        on the
                                        documented
                                        Configuration
                                        Management
                                        policies (and
                                        policies related to
                                        finance,
                                        procurement,
                                        Contract
                                        Management, and
                                        security).


Process ID  Procedure or                Description         Role
ST 3.4.3    Decision
                                        Specific changes    Configuration
            Inform                      must be reported    Auditor
            stakeholders of             to the
            policy change?              stakeholders.
                                        These include:

                                        Procurement
                                        Finance (for
                                        example, by
                                        linking to the
                                        general
                                        ledger)
                                        Contract
                                        Manager

                                        Verify that the
                                        event must be
                                        reported. If not,
                                        go to ST 3.4.5. If
                                        yes, continue with
                                        ST 3.4.4.

Process ID  Procedure or                Description              Service Manager 9.81
ST 3.4.4    Decision
                                                          Role
            Inform
            stakeholders                Inform            Configuration
                                        stakeholders of   Auditor
                                        the event (for
                                        example, the
                                        Contract Manager
                                        when an asset is
                                        included in the
                                        contract, or
                                        procurement
                                        when an item is
                                        received).
                                        Examples of
                                        events that
                                        should trigger
                                        stakeholder
                                        notification
                                        include:

                                        Received
                                        and
                                        accepted
                                        items
                                        Installation
                                        of the asset
                                        (for
                                        example, for
                                        depreciation
                                        start date)
                                        Lost or
                                        stolen item
                                        Retirement
                                        or disposal
                                        of an item
                                        (for finance)


Process ID  Procedure or                Description          Role
ST 3.4.5    Decision
                                        Confirm that all     Configuration
ST 3.4.6    Validate CI                 relevant status      Auditor
ST 3.4.7    update                      data documented
                                        in the CI is
                                        complete and
                                        correct,
                                        according to
                                        Configuration
                                        Management
                                        policies derived
                                        from agreements,
                                        relevant
                                        legislation, and
                                        standards.

                                        Ensure that the
                                        status change or
                                        version update is
                                        a result of an
                                        authorized
                                        change.

            Exception                   If the CI update or  Configuration
            detected?                   CI details aren't    Auditor
                                        correct or
            Create exception            complete
            report                      according to the
                                        Configuration
                                        policies, continue
                                        with SO3.4.7.

                                        Create a new         Configuration
                                        incident (see SO     Auditor
                                        2.1.11).


Process ID  Procedure or                Description            Role
ST 3.4.8    Decision
ST 3.4.9    Review report               The Configuration      Configuration
            request                     Administrator          Administrator
ST 3.4.10                               reviews the
            Standard report?            request for
                                        Configuration
            Collect data for            Management
            status reports              information.

                                        Configuration          Configuration
                                        Management has         Administrator
                                        defined a number
                                        of standard
                                        reports (for
                                        example,
                                        overview of CIs in
                                        stock or by
                                        status). If this is a
                                        standard report,
                                        continue with ST
                                        3.4.12. If not, go
                                        to ST 3.4.11.

                                        Periodically,          Configuration
                                        Configuration          Administrator
                                        Management
                                        procedures
                                        provide reports
                                        for the different
                                        stakeholders,
                                        such as financial
                                        asset managers,
                                        contract
                                        managers, or
                                        procurement.


Process ID  Procedure or                Description         Role
ST 3.4.11   Decision
            Configure CI                If a standard       Configuration
ST 3.4.12   report                      report doesn't      Administrator
ST 3.4.13                               exist, the
            Run CI report               Configuration
                                        Administrator
            Distribute report           creates a query to
            to stakeholders             select the data to
                                        display from the
                                        CMS.

                                        The report or       Configuration
                                        query is run        Administrator
                                        against the
                                        database. The
                                        data is collected
                                        in a standard
                                        format.

                                        Provide the         Configuration
                                        requested data to   Administrator
                                        the stakeholders.
                                        Close the request
                                        (if applicable).


1.9.17.5. Configuration Verification and
Audit (process ST 3.5)

Verification and auditing is responsible for ensuring that information in Configuration
Management is accurate and that all Configuration Items (CIs) are identified and
recorded in Configuration Management. The process can be conducted manually, or
by using automated inventory and discovery tools.

Verification includes routine checks that are part of other processes (for example,
verifying the serial number of a desktop PC when a user logs an incident). Audit is a
periodic, formal check. You should verify and audit your configurations regularly to
ensure proper functioning of the entire Configuration Management process, and for
related IT service management processes.

The objective of verification and auditing for Configuration Management is to detect
and manage all exceptions to configuration policies, processes, and procedures,
including security and license use rights. The verification process ensures that
configuration records are accurate and complete, and that any recorded changes are
approved. Configuration audits help to maintain the integrity of the Configuration
Management System (CMS).

Also included in the configuration and audit process is the periodic review of installed
software against the policy for software usage to identify personal or unlicensed
software or any software instances in excess of current license agreements.

Configuration Verification and Audit activities include:

     Make sure that baselines and standards match the actual components in the IT
     environment
     Verify that services and products are built and documented, according to
     documented requirements, standards, or contractual agreements
     Verify that the correct and authorized versions of any CI exists and is correctly
     identified and described
     Verify the physical existence of CIs (for example, in the organization, in the
     Definitive Media Library, or in stock)
     Check that release documentation and configuration administration are present
     before making a release
     Confirm that the current environment is as expected and documented in the
     CMS, and that any Change requests are resolved


     Check that configuration modifications are implemented through authorized
     changes
     Validate the existence of a SLA against each CI
     Verify that CI specifications are compliant with defined configuration policies
     and baselines
     Validate that all required documentation for each CI is available (for example,
     maintenance contracts, license records, or warranties)
     Check data quality for accuracy and completeness
     Initiate an incident for discovered unauthorized changes

The following are examples of discrepancies:

     Unauthorized software installed
     Unauthorized access to resources and services (for example, access rights not
     reflected in subscriptions)
     Discrepancy of status or configuration details, as registered in the CMS,
     compared with the actual status.

Configuration Verification and Audit processes, both physical and functional, should
be scheduled and a check performed to ensure that adequate processes and
resources are in place. Benefits of this process include:

     Protection of the physical configurations and the intellectual capital of the
     organization
     Verification that the service provider is in control of its configurations, master
     copies, and licenses
     Confidence that configuration information is accurate, controlled, and visible
     Conformance of changes, releases, systems, and IT environments to contracted
     or specified requirements.
     Accuracy and completeness of configuration records

Configuration audits should be carried out regularly, before and after a major change
(or release), after a disaster, and at random intervals. Deficiencies and
nonconformities should be recorded, assessed and corrective action initiated, acted
on, and reported back to the relevant parties and plan for improving the service.
Unauthorized and unregistered items that are discovered during the audit should be
investigated and corrective action taken to address possible issues with procedures
and the behavior of personnel. All exceptions are logged and reported as incidents.
Details for this process can be seen in the following figure and table.

The Configuration Verification and Audit workflow is illustrated in the following figure:


                                        Configuration Verification and Audit process         Service Manager 9.81

Process   Procedure                     Description                                   Role
ID
ST 3.5.1  or Decision

ST 3.5.2  Audit required?               Configuration                                 Configuration
          Conduct CI audit              audits should be                              Auditor
                                        considered
                                        before and after a
                                        major change or
                                        release.

                                        Configuration                                 Configuration
                                        audits (manual or                             Auditor
                                        automated) are
                                        scheduled
                                        periodically. The
                                        audit verifies
                                        each individual
                                        CI. It uses an
                                        automated
                                        inventory tool that
                                        scans the system.
                                        Another method
                                        is to scan the IT
                                        environment and
                                        discover the
                                        component
                                        connected to the
                                        enterprise. New
                                        components may
                                        be discovered,
                                        requiring
                                        management in
                                        the CMS.

Process   Procedure                     Description                Service Manager 9.81
ID        or Decision
ST 3.5.3  Reconcile and                                     Role
          verify data
ST 3.5.4                                Collected data      Configuration
          Unregistered                  from the audit      Auditor
          component                     must be
          detected?                     reconciled and
                                        compared with
                                        the data already
                                        stored in the
                                        CMS. Different
                                        reconciliation
                                        keys and rules
                                        can be applied to
                                        match the
                                        discovered item
                                        with the CI in the
                                        CMS.

                                        An unregistered     Configuration
                                        component may       Auditor
                                        be detected in
                                        cases where the
                                        item can't be
                                        matched and
                                        found in the CMS.
                                        If an unregistered
                                        component is
                                        detected, go to
                                        ST 3.5.5. If not,
                                        continue with ST
                                        3.5.8.


Process   Procedure                     Description          Role
ID
ST 3.5.5  or Decision

ST 3.5.6  Component                     Determine            Configuration
          needs to be                   whether the new      Auditor
ST 3.5.7  managed?                      component needs
                                        to be registered in
                                        the CMS, based
                                        on the scope of
                                        the CMS. If yes,
                                        continue with ST
                                        3.5.6. If no, go to
                                        ST 3.5.13.

          Determine CI type             The CI type is       Configuration
                                        selected, based      Auditor
                                        on the properties
                                        of the discovered
                                        component (for
                                        example, model
                                        name or type of
                                        device).

          Register new CI               Create a new CI.     Configuration
                                        Enter the            Auditor
                                        additional
                                        attributes of the
                                        CI, based on the
                                        audit data. Go to
                                        ST 3.5.13.

Process   Procedure                     Description                Service Manager 9.81
ID        or Decision
ST 3.5.8  Component                                         Role
          missing?
ST 3.5.9                                If a component      Configuration
          Discrepancy                   can't be            Auditor
          found?                        discovered during
                                        an audit, it may
                                        be lost or stolen
                                        (for example, the
                                        CI has not been
                                        connected to the
                                        network for some
                                        period of time).
                                        The audit status
                                        is updated to
                                        Lost. If yes,
                                        continue with ST
                                        3.5.13. If no,
                                        continue with ST
                                        3.5.9.

                                        Based upon the      Configuration
                                        comparison          Auditor
                                        between the CMS
                                        administration
                                        and the actual
                                        data from the
                                        audit, one or
                                        more
                                        discrepancies
                                        may be detected.
                                        If yes, continue
                                        with ST 3.5.10. If
                                        not, continue with
                                        ST 3.5.15.

Process    Procedure                    Description                  Service Manager 9.81
ID         or Decision
ST 3.5.10  Investigate                                        Role
           discrepancy
ST 3.5.11                               The mismatch          Configuration
           Update CI                    between the CMS       Auditor
           allowed?                     administration
                                        and the actual
                                        configuration is
                                        investigated in
                                        more detail. For
                                        each
                                        discrepancy,
                                        attribute
                                        differences and
                                        relationships are
                                        investigated.

                                        To reduce the         Configuration
                                        number of manual      Auditor
                                        activities, some
                                        fields are
                                        populated by
                                        discovery and
                                        auditing tools.
                                        These attributes
                                        will not be
                                        maintained
                                        manually.
                                        Determine
                                        whether the
                                        differences can
                                        be updated
                                        directly without a
                                        formal change
                                        procedure. If yes,
                                        continue with ST
                                        3.6.12. If no, go to
                                        ST 3.5.13.


Process    Procedure                    Description          Role
ID
ST 3.5.12  or Decision

ST 3.5.13  Update CI details            The configuration    Configuration
                                        details are          Auditor
           Unauthorized                 updated, based
           change and/or                on the audit date
           needs                        to ensure that the
           investigation?               administration is
                                        correctly
                                        reflecting the
                                        actual situation.

                                        Determine            Configuration
                                        whether the          Auditor
                                        mismatch
                                        between the audit
                                        and the CMS
                                        administration
                                        requires further
                                        investigation (for
                                        example,
                                        detection of
                                        unauthorized
                                        software). If yes,
                                        go to ST 3.5.14. If
                                        no, continue with
                                        ST 3.5.15.


Process    Procedure                    Description          Role
ID
ST 3.5.14  or Decision

ST 3.5.15  Determine                    Document the         Configuration
           corrective                   discrepancy and      Auditor
           action                       determine the
                                        appropriate
           Update audit log             actions (for
                                        example,
                                        additional
                                        investigation is
                                        needed). An
                                        incident must be
                                        created and
                                        assigned to the
                                        person
                                        responsible for
                                        executing the
                                        actions. Follow
                                        SO 2.1.11 to create
                                        a new incident.

                                        The CI is updated
                                        with the audit
                                        status and last
                                        audit date.


1.9.17.6. Master data management
(process ST 3.6)

Master reference data is key data that the Configuration Management System (CMS)
depends on and is often provided by different organizational functions, such as
human resources management, finance, and facilities. For example, master data can
include details about organization units, cost centers, employee data, and locations.

The objective of the Master data management process is to reconcile master
reference data managed in other administrations. Modification of this reference data
is processed in CMS.

Changes in organizational structures, locations, and employee data might result in
exceptions or incidents, because existing Configuration Items (CIs) and contracts
remain associated with these entities (for example, the retirement of an employee
who still has a laptop or mobile phone assigned). Modification of this data must be
reviewed and appropriate actions should be initiated.

Details for this process can be seen in the following figure and table.

Master data management workflows is illustrated in the following figure:


                                        Master data management process

Process ID  Procedure or                Description                     Role
ST 3.6.1
            Decision
ST 3.6.2
ST 3.6.3    Validate data sets          Periodically data               System
ST 3.6.4                                sets are received               Administrator
ST 3.6.5                                from trusted                    Configuration
                                        sources. The                    Administrator
                                        Configuration
                                        Administrator
                                        checks the format
                                        and content
                                        against the
                                        defined
                                        specifications.

            Import location             If you want to                  System
            data?                       import location                 Administrator
                                        data, continue                  Configuration
                                        with ST 3.6.3. If               Administrator
                                        not, go to ST
                                        3.6.4.

            Reconcile                   Import and load                 System
            location data               location data into              Administrator
                                        the CMS.                        Configuration
                                                                        Administrator

            Import                      If you want to                  System
            organizational              import                          Administrator
            data?                       organizational                  Configuration
                                        data, continue                  Administrator
                                        with ST 3.6.5. If
                                        not, go to ST
                                        3.6.6.

            Reconcile                   Import and load                 System
            organizational              organizational                  Administrator
            data                        data into the                   Configuration
                                        CMS.                            Administrator


Process ID  Procedure or                Description         Role
ST 3.6.6    Decision
            Import employee             If you want to      System
ST 3.6.7    data?                       import employee     Administrator
ST 3.6.8                                data, continue      Configuration
            Reconcile                   with ST 3.6.7. If   Administrator
            employee data               not, stop.

            Item retired or             Import and load     System
            obsolete?                   employee data       Administrator
                                        into the CMS.       Configuration
                                                            Administrator

                                        Verify that one or  System
                                        more items in the   Administrator
                                        data set are        Configuration
                                        retired or no       Administrator
                                        longer present.
                                        Be sure to update
                                        the status of
                                        items in the CMS.


Process ID  Procedure or                Description         Role
ST 3.6.9
            Decision

            Check related CIs           Verify that one or  System
                                        more CIs are still  Administrator
                                        related to retired  Configuration
                                        items in the        Administrator
                                        modified master
                                        data record. For
                                        example, a retired
                                        user may still
                                        have one or more
                                        subscriptions or
                                        CIs for which that
                                        user is
                                        responsible.
                                        Updates of
                                        interest include:

                                             Status
                                             updates (for
                                             example,
                                             retirement)
                                             Job profile
                                             changes (for
                                             validating
                                             access
                                             rights and
                                             related
                                             current
                                             subscription
                                             s)
                                             Reorganizati
                                             ons (for
                                             example,
                                             merge or
                                             split of
                                             departments
                                             )


Process ID  Procedure or                Description            Role
            Decision
ST 3.6.10
ST 3.6.11                                    Cost center
ST 3.6.12                                    changes

                                        Master data
                                        modifications
                                        must be verified
                                        to ensure that
                                        these updates
                                        don't conflict with
                                        configuration
                                        administration.

            Related active CI?          If there is a          System
                                        related active CI,     Administrator
                                        continue with ST       Configuration
                                        3.6.11. If not, go to  Administrator
                                        ST 3.6.12.

            Determine                   Follow the             System
            corrective actions          procedure to           Administrator
                                        create a new           Configuration
                                        incident (see SO       Administrator
                                        2.1.11).

            Create data                 Create a report        System
            reconciliation              with a summary         Administrator
            report                      of data
                                        modifications and
                                        reconciliation
                                        errors, which
                                        includes statistics
                                        of the number of
                                        modifications (for
                                        example, new
                                        items and retired
                                        items).
````
