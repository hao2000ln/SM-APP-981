---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.6.5 .. 1.6.5
printed_pages: 1412-1413
---

# 1.6.5 CMS Gateway

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.5. CMS Gateway

UCMDB Gateway consists of new high-performance APIs based on the GraphQL technology. It
allows dynamic, high-performance, and highly backward-compatible API calls into more than
one system to merge the responses in one JSON payload. As of version 9.72, Service Manager
implements integration with the UCMDB Gateway to display the CI Topology graph and the CI
Impact Service graph. This integration uses the UCMDB Gateway API to access the data and
embedded the graphic widgets for CI Topology and Impact representation.

How to integrate Service Manager with the UCMDB
Gateway

You can enable integration to the UCMDB Gateway when enabling integration to UCMDB. For
details, see How to add UCMDB connection information.

Supported use cases

When integrated with the UCMDB Gateway, Service Manager provides the following out-of-
the-box features.

Visualizing CI

Service Manager displays the CI Topology widget. You can visualize the CIs that are pushed
from UCMDB on a Configuration Item form, a Change form, an Incident form, or an Interaction
form.

Visualizing Impact

Service Manager displays the Show Impact widget. You can visualize impacts that are pushed
from UCMDB on a Change form, an Incident form, or an Interaction form.

Related topics

Universal CMDB
````
