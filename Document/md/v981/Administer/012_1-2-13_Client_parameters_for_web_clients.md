---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.13 .. 1.2.13.4
printed_pages: 270-303
---

# 1.2.13 Client parameters for web clients

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.13. Client parameters for web clients

These parameters override web client preferences. Any client parameter that you set
on the server overrides the local client preference and prevents users from changing
it. You can set some of these parameters from the web client login URL, some from
the web tier configuration file (web.xml), and some from the webtier.properties file. In
the following table, a check mark (√) indicates that you can set the parameter from
the URL or web.xml file, and an em dash (-) indicates the opposite.


Web          URL                        web.xml  webtier.prop Description
                                                 erties
parameter                               √

Web          -                          √        √  Specifies if

parameter:                              √           the browser's

acceptBrows                                         language

erLang                                              preference is

                                                    used for

                                                    trusted sign-

                                                    on login

                                                    when the

                                                    lang

                                                    parameter is

                                                    not set in the

                                                    web client

                                                    login URL

Web          -                                   -  Specifies the

parameter:                                          allowed list of

allowed                                             file

                                                    extensions

                                                    that may be

                                                    attached to a

                                                    Service

                                                    Manager

                                                    record, such

                                                    as an

                                                    Incident

                                                    record.

Web          -                                   √  Enables

parameter:                                          tokenization

antiCSRFEna                                         for the web

bled                                                client


Web            URL                      web.xml  webtier.prop Description
                                                 erties
parameter                               √

Web            -                        √        √  Enables you
                                        √
parameter:                              √           to modify the

applicationIc                                       company's

on                                                  logo to

                                                    display a

                                                    custom

                                                    company

                                                    icon in the

                                                    URL address

                                                    bar

Web            -                                 √  Defines the

parameter:                                          delay in

autoCloseMa                                         seconds

skDelay                                             before the

                                                    web tier

                                                    mask is

                                                    automatically

                                                    closed

Web            -                                 √  Defines the

parameter:                                          delay time in

autoComplet                                         milliseconds

eDelayTime                                          to trigger

                                                    auto

                                                    complete

                                                    after the user

                                                    stops typing

                                                    characters

Web            -                                 √  Indicates the

parameter:                                          record

autoComplet                                         number size

eListSize                                           fetched from

                                                    the server

                                                    side at the

                                                    first time


Web           URL                       web.xml  webtier.prop Description
                                                 erties
parameter                               √

Web           -                         -        √  Indicates the

parameter:                              √           number of
                                        √
autoComplet                                         characters

eMinChars                                           that are

                                                    required to

                                                    trigger the

                                                    auto

                                                    complete

                                                    feature

Web           -                                  √  Defines the

parameter:                                          Auto

combo.autoC                                         Complete

ompleteMode                                         mode in

                                                    Combo Box

                                                    fields.

Web           -                                  √  The previous

parameter:                                          response will

autoComplet                                         not be

eSkipCaching                                        cached if this

Char                                                character is

                                                    included in

                                                    the user input

Web           √                                  √  Enables

parameter:                                          users to

autoSubmit                                          submit forms

                                                    when they

                                                    press the

                                                    Enter key


Web           URL                       web.xml  webtier.prop Description
                                                 erties
parameter                               √
                                        √
Web           -                                  √  Defines the
                                        √
parameter:                              √           path to the

cacerts                                             cacerts file

                                                    required for

                                                    Web clients

                                                    to make SSL

                                                    connections

                                                    to the Web

                                                    tier

Web           -                                  √  Enabling this

parameter:                                          parameter

CACLogin                                            causes all

                                                    Web clients

                                                    to present a

                                                    Common

                                                    Access Card

                                                    (CAC)

                                                    certificate as

                                                    authenticatio

                                                    n information

                                                    and use SSL

                                                    connections

                                                    to the Web

                                                    tier.

Web           -                                  √  Enables the

parameter:                                          auto

comfillAutoC                                        complete for

omplete                                             the comfill

                                                    widgets

                                                    globally

Web           -                                  √  Enables the

parameter:                                          compact

compactLayo                                         layout of the

ut                                                  web client


Web           URL                       web.xml  webtier.prop Description
                                                 erties
parameter                               √

Web           -                         -        √  Requires the

parameter:                              -           Web tier to

compress_so                             √           compress

ap                                                  SOAP

                                                    messages to

                                                    Web clients

Web           -                                  √  Defines

parameter:                                          whether to

cookie.httpO                                        set the

nly                                                 HttpOnly flag

                                                    for HTTP

                                                    cookies

                                                    (such as

                                                    JSESSIONID,

                                                    mode, and

                                                    lang).

Web           -                                  √  Defines

parameter:                                          whether to

cookie.secur                                        set the

e                                                   Secure flag

                                                    for HTTP

                                                    cookies

                                                    (such as

                                                    JSESSIONID,

                                                    mode, and

                                                    lang).

Web           -                                  √  Defines the

parameter:                                          location to

customize-                                          save the

folder                                              branding

                                                    configuration

                                                    s


Web           URL                       web.xml  webtier.prop Description
                                        -        erties
parameter
                                        √
Web           √                         √        -  Increases the
                                        √
parameter:                                          min-width

detailViewMi                                        value of a

nWidth                                              web page if

                                                    the system

                                                    displays

                                                    some texts

                                                    incompletely

                                                    after you

                                                    enlarge the

                                                    browser text

                                                    size or font

                                                    size.

Web           -                                  √  Enables use

parameter:                                          of the Quick

disableJump                                         Jump

Address                                             component

                                                    on the

                                                    toolbar

Web           -                                  √  Allows to

parameter:                                          disable the

disableKeyHe                                        contextual

lp                                                  help.

Web           -                                  √  Controls

parameter:                                          password

disableLogin                                        auto-

AutoComplet                                         complete for

e                                                   the web

                                                    client login

                                                    page.


Web            URL                      web.xml  webtier.prop Description
                                                 erties
parameter                               √

Web            -                        √        √  Displays a

parameter:                              √           confirmation

enableExitCo                                        message

nfirmMessag                                         when users

e                                                   click the

                                                    Close (x)

                                                    button of the

                                                    SM web

                                                    client page or

                                                    manually

                                                    refresh the

                                                    entire web

                                                    client page.

Web            -                                 √  Enables the

parameter:                                          web tier to

enableGetOri                                        obtain the

ginalUrl                                            original URL

                                                    from the

                                                    browser

                                                    before a user

                                                    logs in (in

                                                    TSO or

                                                    LWSSO

                                                    mode).

Web            -                                 √  Enables the

parameter:                                          list detail

enableListFra                                       page to retain

meStateRetai                                        the expand-

n                                                   collapse state

                                                    of the List

                                                    Pane when

                                                    the list detail

                                                    page

                                                    refreshes.


Web           URL                       web.xml  webtier.prop Description
                                                 erties
parameter                               √

Web           -                         √        √  Enables a

parameter:                              √           contextual

enableMoreC                                         "More" menu

ontextMenu                                          that's

                                                    displayed

                                                    when you

                                                    right-click

                                                    lists on the

                                                    details pane

                                                    of a record in

                                                    the web

                                                    client.

Web           -                                  √  This

parameter:                                          parameter

enableRecord                                        determines if

listOddEvenR                                        the odd rows

owStyle                                             and the even

                                                    rows in the

                                                    record list

                                                    have the

                                                    same

                                                    background

                                                    color or not.

Web           -                                  √  This

parameter:                                          parameter

enableSideba                                        specifies if

rMenu                                               the System

                                                    Navigator of

                                                    the web

                                                    client can use

                                                    the sidebar

                                                    mode and

                                                    icons.


Web            URL                      web.xml  webtier.prop Description
                                                 erties
parameter                               √
                                        √
Web            -                                 √  Specifies
                                        -
parameter:                                          whether the

enableTable                                         Magnify

Magnify                                             button

                                                    appears for

                                                    editable

                                                    tables in the

                                                    web client.

Web            -                                 √  For certain

parameter:                                          read-only

enableTableEl                                       controls in

lipsis                                              record details

                                                    area, you can

                                                    enable this

                                                    parameter to

                                                    display '...' at

                                                    the end of

                                                    the text fields

                                                    when the

                                                    input value is

                                                    too long to be

                                                    shown

                                                    completely.

Web            -                                 √  Determines

parameter:                                          whether to

encryptPass                                         encrypt the

wordInBrows                                         user

er                                                  password in

                                                    the web

                                                    browser

                                                    before the

                                                    system sends

                                                    it to the web

                                                    tier.


Web            URL                      web.xml  webtier.prop Description
                                        -        erties
parameter
                                        -
Web            -                                 √  Specifies
                                        √
parameter:                                          whether the

expandCom                                           command/se

mandLine                                            arch line is

                                                    expanded by

                                                    default or

                                                    not.

Web            -                                 √  Specifies

parameter:                                          whether the

expandSmart                                         Smart Search

Search                                              field is

                                                    expanded by

                                                    default or

                                                    not.

Web            -                                 √  Defines an

parameter:                                          external

externalForgo                                       forgot

tPasswordUrl                                        password

                                                    URL for the

                                                    Forgot

                                                    Password link

                                                    on the

                                                    Service

                                                    Manager web

                                                    client login

                                                    page.


Web           URL                       web.xml  webtier.prop Description
                                                 erties
parameter                               √

Web           -                         √        √  Defines the
                                        √
parameter:                                          context path
                                        √
helpServerCo                                        when

ntext                                               deploying the

                                                    Service

                                                    Manager help

                                                    on a web

                                                    server (for

                                                    example,

                                                    Apache)

Web           √                                  √  Defines the

parameter:                                          name of the

helpServerHo                                        Help server

st                                                  host listening

                                                    for client

                                                    requests

Web           √                                  √  Defines the

parameter:                                          communicati

helpServerPo                                        ons port

rt                                                  number on

                                                    which the

                                                    Help server

                                                    listens to

                                                    client

                                                    requests

Web           -                                  √  Determines

parameter:                                          whether Web

honorUrlHost                                        client users

                                                    can specify

                                                    the name of

                                                    the Service

                                                    Manager

                                                    server from

                                                    the URL


Web            URL                      web.xml  webtier.prop Description
                                                 erties
parameter                               √

Web            -                        √        √  Determines
                                        √
parameter:                                          whether Web

honorUrlPort                                        client users

                                                    can specify

                                                    the

                                                    communicati

                                                    ons port of

                                                    the Service

                                                    Manager

                                                    server from

                                                    the URL

Web            -                                 √  Determines

parameter:                                          how web

isCustomAut                                         client users

henticationUs                                       are

ed                                                  authenticated

Web            -                                 √  The class

parameter:                                          name of a

JCEProvider                                         third-party

ClassName                                           JCE provider

                                                    that you want

                                                    to use when

                                                    the web tier

                                                    is running in

                                                    non-FIPS

                                                    mode.


Web            URL                      web.xml  webtier.prop Description
                                                 erties
parameter                               √
                                        √
Web            -                        √        √  The name of

parameter:                              √           a third-party

JCEProvider                                         JCE provider

Name                                                that you want

                                                    to use when

                                                    the web tier

                                                    is running in

                                                    non-FIPS

                                                    mode.

Web            -                                 √  Enables the

parameter:                                          web client to

jsDebug                                             display to

                                                    end users an

                                                    error

                                                    message that

                                                    includes full

                                                    stack trace.

Web            -                                 √  Specifies the

parameter:                                          time after

lockWaitTime                                        which a Web

out                                                 tier

                                                    application

                                                    server thread

                                                    will cease

                                                    trying to

                                                    acquire a

                                                    lock

Web            -                                 √  Defines the

parameter:                                          path to the

log4jConfigur                                       Web tier's

ation                                               logging

                                                    properties file


Web            URL                      web.xml  webtier.prop Description
                                                 erties
parameter                               √

Web            -                        √        √  Defines the

parameter:                              √           form-level

labelbgunderl                                       label

ine                                                 background

                                                    display if a

                                                    color other

                                                    than white

                                                    was selected

                                                    but the

                                                    Background

                                                    Style

                                                    property was

                                                    left blank

Web            -                                 √  Specifies the

parameter:                                          number of

maskMessag                                          seconds

eDelay                                              before the

                                                    Web tier

                                                    mask

                                                    message is

                                                    displayed

                                                    after the

                                                    mask is

                                                    shown.

Web            -                                 √  Specifies the

parameter:                                          maximum

maxattachupl                                        size limit for

oadsize                                             individual

                                                    attachments

                                                    in a record.


Web            URL                      web.xml  webtier.prop Description
                                                 erties
parameter                               √
                                        √
Web            -                                 √  Specifies the
                                        -
parameter:                                          maximum
                                        √
maxtotalattac                                       total size of

huploadsize                                         all the

                                                    attachments

                                                    in a record.

Web            -                                 √  Defines the

parameter:                                          maximum

maxGroupCa                                          number of

cheSize                                             records that

                                                    can be

                                                    cached in the

                                                    user's web

                                                    browser

                                                    when the

                                                    user

                                                    navigates

                                                    through the

                                                    groups in a

                                                    record list

Web            -                                 √  Defines the

parameter:                                          maximum

maxMessage                                          number of

Number                                              messages

                                                    displayed in

                                                    Messages

                                                    And Alerts.

Web            -                                 √  Indicate how

parameter:                                          different

message                                             types of

display                                             messages

properties                                          are displayed


Web           URL                       web.xml  webtier.prop Description
                                                 erties
parameter                               √

Web           -                         √        √  Defines the

parameter:                              √           maximum

openTabsSoft                                        number of

Limit                                               tabs a user

                                                    can open in a

                                                    browser

                                                    before a

                                                    warning

                                                    message

                                                    displays to

                                                    advise them

                                                    to close

                                                    some tabs.

Web           -                                  √  This

parameter:                                          parameter

preventDupli                                        controls

catedAttach                                         whether to

mentName                                            prevent an

                                                    attachment

                                                    that has the

                                                    same file

                                                    name with

                                                    existing ones

                                                    from being

                                                    uploaded to

                                                    Service

                                                    Manager.

Web           -                                  √  Embeds a

parameter:                                          security key

querySecurit                                        in all queries

y                                                   generated by

                                                    the Web

                                                    client


Web            URL                      web.xml  webtier.prop Description
                                                 erties
parameter                               √
                                        √
Web            -                        √        √  Defines how

parameter:                              √           array column

recordListArr                                       values are

ayDisplayStyl                                       displayed in

e                                                   record lists

Web            -                                 √  Defines the

parameter:                                          maximum

recordListArr                                       allowed field

ayMaxChars                                          length of any

                                                    array fields

                                                    that appear in

                                                    record lists

Web            √                                 √  Enables the

parameter:                                          Web client to

refreshMessa                                        query the

ges                                                 Service

                                                    Manager

                                                    server for

                                                    messages at

                                                    a regular

                                                    interval

Web            √                                 √  Defines the

parameter:                                          interval the

refreshMessa                                        Web client

gesInterval                                         waits before

                                                    checking for

                                                    messages on

                                                    the Service

                                                    Manager

                                                    server


Web          URL                        web.xml  webtier.prop Description
                                        -        erties
parameter                               -

Web          -                          √        √  Enables the

parameter:                              √           Web client to

rememberLa                                          remember

ng                                                  the browser's

                                                    language

                                                    preference

Web          -                                   √  Defines the

parameter:                                          minimum

searchMinCh                                         number of

ars                                                 characters

                                                    you must

                                                    type in the

                                                    search field

                                                    to trigger a

                                                    System

                                                    Navigator

                                                    search.

Web          -                                   √  Controls the

parameter:                                          encryption of

secureLogin                                         network

                                                    communicati

                                                    on between

                                                    the Web

                                                    application

                                                    server and

                                                    the Web

                                                    browser

Web          √                                   √  Defines the

parameter:                                          name of the

serverHost                                          Service

                                                    Manager host

                                                    listening for

                                                    client

                                                    requests


Web         URL                         web.xml  webtier.prop Description
                                                 erties
parameter                               √
                                        √
Web         √                                    √  Defines the
                                        √
parameter:                                          communicati

serverPort                                          ons port

                                                    number on

                                                    which the

                                                    Service

                                                    Manager

                                                    server listens

                                                    to client

                                                    requests

Web         -                                    √  Defines the

parameter:                                          number of

session-                                            minutes that

timeout                                             the server

                                                    waits for a

                                                    client

                                                    heartbeat

                                                    signal before

                                                    the server

                                                    assumes that

                                                    the client

                                                    session has

                                                    timed out and

                                                    closes the

                                                    connection

Web         -                                    √  Enables use

parameter:                                          of the Add

showAddFav                                          Favorite

Button                                              button to add

                                                    favorites in

                                                    Favorites and

                                                    Dashboards


Web           URL                       web.xml  webtier.prop Description
                                                 erties
parameter                               √
                                        √
Web           -                         √        √  Enables use

parameter:                              √           of the

showFavMgr                                          Favorite

Button                                              Manager

                                                    button to

                                                    manage

                                                    favorites in

                                                    Favorites and

                                                    Dashboards

Web           -                                  √  Displays the

parameter:                                          Online Help

showHelp                                            option when

                                                    you click the

                                                    Help button,

                                                    which allows

                                                    you to access

                                                    the help

                                                    server

Web           -                                  √  Enables use

parameter:                                          of the Reload

showReloadN                                         button on the

avButton                                            navigator

                                                    toolbar. The

                                                    Reload button

                                                    refreshes the

                                                    list of

                                                    favorites in

                                                    Favorites and

                                                    Dashboards

Web           -                                  √  Defines the

parameter:                                          number of

sideBarButto                                        side bar

nNumberToC                                          buttons to be

ollapse                                             collapsed.


Web           URL                       web.xml  webtier.prop Description
                                                 erties
parameter                               √

Web           -                         √        √  Specifies the
                                        √
parameter:                              √           time that a
                                        √
socketReadTi                                        thread on the

meout                                               Web tier

                                                    application

                                                    server will

                                                    wait for a

                                                    socket IO

                                                    operation.

Web           -                                  √  Defines the

parameter:                                          sort order of

sortNavItems                                        the System

                                                    Navigator

                                                    menu items.

Web           -                                  -  Defines the

parameter:                                          sort order of

sortNavFavor                                        the favorites.

ites

Web           -                                  √  Requires all

parameter:                                          Web clients

ssl                                                 to use SSL

                                                    connections

                                                    to the Web

                                                    tier.

Web           -                                  √  Defines the

parameter:                                          SSL port of

sslPort                                             the Web

                                                    application

                                                    server;

                                                    required only

                                                    when

                                                    secureLogin

                                                    is set to true.


Web              URL                    web.xml  webtier.prop Description
                                                 erties
parameter                               √
                                        √
Web              -                               √  Specifies the

parameter:                                          HTTP status

sso.failure.htt                                     code to be

pStatus                                             returned

                                                    when TSO,

                                                    LW-SSO, IdM

                                                    or CAC fails.

Web              -                               √  Defines the

parameter:                                          first day of

startDayOfW                                         the week in

eek                                                 the date

                                                    picker.

Web              √                               √  Controls

parameter:                                          whether to

tooltipAutoHi                                       automatically

de                                                  hide a tooltip

                                                    after the

                                                    pointer

                                                    leaves the

                                                    target

                                                    element. Only

                                                    the tooltip

                                                    that is

                                                    triggered by

                                                    pointer hover

                                                    and is not

                                                    controlled by

                                                    the browser

                                                    (that is, not

                                                    the tooltip by

                                                    the title

                                                    attribute) is

                                                    controlled by

                                                    this

                                                    parameter.


Web           URL                       web.xml  webtier.prop Description
                                                 erties
parameter                               √

Web           √                         √        √  Logs SOAP
                                        √
parameter:                                          messages in
                                        √
tracesoap                                           the Web

                                                    server's

                                                    sm.log file

                                                    (< Web

                                                    server home

                                                    directory>/s

                                                    m.log )

Web           -                                  √  Defers the

parameter:                                          unmasking of

unmaskDefer                                         a browser

Millis                                              window after

                                                    an unmask

                                                    request is

                                                    issued.

Web           -                                  √  Enables use

parameter:                                          of the system

useJavaDyna                                         registry to

micVersionin                                        locate the

g                                                   latest version

                                                    of Java

                                                    installed on a

                                                    user's

                                                    system.

Web           √                                  √  Displays tabs

parameter:                                          in the order

useservertab                                        the server

s                                                   has them

                                                    saved on the

                                                    form


Web            URL                      web.xml  webtier.prop Description
                                                 erties
parameter                               √
                                        √
Web            √                                 √  Displays
                                        √
parameter:                              √           messages in

viewactivenot                                       a message

es                                                  box as well

                                                    as in the

                                                    status bar

Web            √                                 √  Displays the

parameter:                                          same

viewcontexth                                        context-

elp                                                 sensitive help

                                                    debug

                                                    information

                                                    (field) in field

                                                    help as the

                                                    Windows

                                                    client does.

Web            √                                 √  Displays a

parameter:                                          warning

viewpromptfo                                        message

rsave                                               when users

                                                    cancel

                                                    records with

                                                    unsaved

                                                    changes

Web            √                                 √  Displays the

parameter:                                          record

viewrecordlis                                       list/detail

t                                                   view for

                                                    search

                                                    results


Web             URL                     web.xml  webtier.prop Description
                                                 erties
parameter                               √

Web             -                                √  Defines the

parameter:                                          number of

virtualGroupS                                       records that

ize                                                 are displayed

                                                    as one virtual

                                                    group in

                                                    inbox views.

Web             -                       -        √  Describes the

parameter:                                          full URL used

webtierFullUrl                                      to access the

                                                    web tier.

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file


1.2.13.1. Web parameter:
acceptBrowserLang

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

acceptBrowserLang

Description

This parameter specifies if the browser’s language preference is used for single sign-
on (including TSO, SAML SSO, and LW-SSO) and CAC Sign-On when the lang
parameter is not set in the web client login URL. By default, the browser’s language
preference has a higher priority than the language defined in the operator's profile. If
you want to use the operator's profile language setting instead of the browser’s
language preference in this case, set this parameter to false.

            Note

           If the user includes the "lang" parameter in the Web client URL, the URL
           language setting take precedence over the acceptBrowserLang setting.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

true

Possible values

true (enabled)
false (disabled)

Example usage


  <init-param>
  <param-name>acceptBrowserLang</param-name>
  <param-value>true</param-value>
  </init-param>

Related topics

Client parameters for web clients


1.2.13.2. Web parameter: allowed

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

allowed

Description

During attachment file processing on the Service Manager Web tier client, it is
possible to configure a white list (allowed list) of file extensions that may be uploaded
by users. This parameter specifies the allowed list of file extensions that may be
attached to a Service Manager record, for example, an Incident record.

            Note

           This parameter only takes effect when the server-side attachment
           allowlist is disabled. However, it is a recommended best practice to
           enable the server-side attachment allowlist.

This parameter exists in the following servlets in the web tier configuration file
(web.xml) file:

     File upload servlet
     Image upload servlet
     Attachment upload servlet
     Attachment upload servlet for AJAX request
     Attachment upload servlet for HTML editor AJAX request
     Unique attachment upload servlet

Valid if set from

Web tier configuration file (web.xml)

Requires restart of the web applications server?

Yes

Default value

bmp,jpg,jpeg,png,gif,txt,log,unl,csv


            Note

           The default value of the Image upload servlet is a subset of this list.

Possible values

A list of comma-separated file extensions
     To deny all file extensions, set the value to empty.
     To allow all file extensions, set the value to * or remove this parameter.

Example usage

The following example allows only the listed file types. As a result, other file types (for
example, JSP files) are disallowed.

  <init-param>
                 <param-name>allowed</param-name>
                 <param-

  value>bmp,jpg,jpeg,png,gif,doc,xls,rtf,txt,docx,xlsx,ppt,pptx,pd
  f,msg,zip,tar,gz,tgz</param-value>
  </init-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.3. Web parameter:
antiCSRFEnabled

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

antiCSRFEnabled

Description

This parameter enables tokenization for the web client. By default, this parameter is
enabled.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

true

Possible values

true or false

Example usage

  <init-param>
         <param-name>antiCSRFEnabled</param-name>
         <param-value>true</param-value>

  </init-param>

Related topics

Tokenization
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.4. Web parameter: applicationIcon

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

applicationIcon

Description

By default, the Service Manager application displays the company logo icon. This
parameter enables you to modify the company logo to display a custom company
icon in the URL address bar.
Using the ICO file format for icons, you can publish an icon that contains at least one
16x16 bitmap with a bit depth of 8, 16, 24, or 32. You can provide a relative URL
(without the context root) and save it in your Favorites.
When not specified in this parameter, the default icon displayed in the Service
Manager application will be the company logo icon.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Refer to your web server documentation

Default value

/cwc/images/HPLogoSolidBlue.ico

Possible values

Relative path to the company icon file

Example usage

  <init-param>
      <param-name>applicationIcon</param-name>
      <param-value>/cwc/images/MyCompanyIcon.ico</param-value>

  </init-param>

In this example, <MyCompanyIcon.ico> represents your company logo image.


Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients
````
