---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.6 .. 1.6.2
printed_pages: 2014-2017
---

# 1.6 Introduction to tailoring best practices

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6. Introduction to tailoring best practices

The purpose of this document is to provide customers with best practices to successfully tailor Service
Manager. This document describes the most common tailoring activities and how to best accomplish them
to meet particular use case goals. These best practices represent the collective experience of both our
organization and other customers. By following these best practices you should realize the following
benefits.

     Less need for support to complete a Service Manager implementation
     Improved system performance and efficiency
     Improved customer experience with your implementation
     Easier upgrades with more opportunity to review new features and functions

The following chapters provide information on how to accomplish common tailoring activities, tips and
tricks from experts, and examples of how to meet particular use case goals. These best practices aren't the
only ways to implement Service Manager, nor are all tailoring scenarios covered.

Related topics

Assumptions
Mapping rights
Array mapping options
Valid data type changes
When are RDBMS mappings added or updated?


1.6.1. Assumptions

The information in this document is most useful if all of the following criteria are met.

     You are implementing Service Manager version 9.20 or greater
     You are a system implementer with general knowledge of Service Manager tailoring tools and
     techniques
     You have a design based on a clearly-defined and agreed-upon business plan or system model to
     direct your tailoring efforts
     You have an understanding of Service Manager's out-of-box data model and ITIL work flows

This document assumes you have access to features available since the Service Manager version 9.20
release. Some of these best practices can also apply to earlier versions, but some performance benefits
and user experience features require you have access to newer application versions.In general, best
practices that rely on a particular tool or control will have the most benefit when implemented with the
newest version of the applications.

System implementers will gain the most benefit from this document as it assumes you are already familiar
with basic tailoring activities and have access to all the tools referred to within. At a minimum, you will need
administrative access to all of Service Manager's tailoring tools. It is also recommended that you have
earned an Accredited Integration Specialist certificate.

Having a business plan or system model will help you determine which parts of Service Manager you will
need to tailor. Furthermore, having a list of objectives will help you decide between competing goals. For
example, if your overall tailoring goal is to provide the best user experience for your Service Manager
users, then you may choose options that maximize usability rather than the best practices that are easiest
to implement or maintain. Lastly, a business plan allows you to get prior approval for your implementation
from your business process owners. The more agreement there is on the business plan, the more likely
your business process owners will accept the tailored implementation.

Many of the suggestions in this document assume you either know or have access to the Service Manager
data model and work flows. This document doesn't describe the out-of-box data model or workflow in
detail. If you need to change the out-of-box data model or workflow, see the Service Manager help.

Related topics

Introduction to tailoring best practices
What's tailoring?


1.6.2. What's tailoring?

Tailoring is any change to the out-of-box system data. Tailoring never changes the actual Service Manager
code or program. Service Manager allows you to change almost any record value. The following are
examples of tailoring changes you can make by changing the underlying record values.

     Change the look and operation of forms by changing the form definition in the format table.
     Change how fields are mapped in the back-end database by changing the value of the field mapping
     in the data dictionary.
     Change the workflow of a particular change by changing the values of the underlying phase and task
     records.
     Change what records a favorite or view displays by changing the value of the underlying query.

            Tip

           Since tailoring involves changing record values, you should create a back-up of your system
           data before tailoring your system. Having a backup available gives you the option to revert to a
           working system should your tailoring changes cause a system outage.

Related topics

Assumptions
Mapping rights
Array mapping options
Valid data type changes
When are RDBMS mappings added or updated?
````
