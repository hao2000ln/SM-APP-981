---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.3.1.2.9 .. 1.1.3.1.2.9
printed_pages: 214-233
---

# 1.1.3.1.2.9 Building a graph diagram

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.3.1.2.9. Building a graph diagram

The graph control enables you to display and interact with a graph that consists of a
set of nodes connected by edges that represent a network of interrelated objects.
The following is a summary of the diagram's capabilities:

     Supports hierarchical graphs. Since it's not feasible to draw all possible nodes
     on one diagram, the graph represents a subset of these as a single node. The
     user can then drill down to see the node or edge of interest.
     Supports inter-edges. An inter-edge is a virtual edge between two group nodes
     that represent the many edges that actually run between the two groups.
     Supports advanced layout algorithms that minimize edge crossover.
     Supports a client/server model. The application partitions between the client and
     the server.
     Supports the ability to bind compound rendering methods to nodes and edges.
     For example, a node may include an icon, two labels, and a circle around it.
     Supports user-definable actions on nodes and edges by double-clicking and/or
     right mouse click.
     Supports scaling.
     Supports scrolling and scaling.
     Supports printing and output in common file formats.
     Supports modifications to the diagram such as adding, moving, and deleting
     nodes and edges.

Components of the graph

The graph diagram provides a comprehensive visualization solution that enables the
ability to easily visualize relationships between different components. An extensive
library of graphics display the relationship in a variety of views. You can customize
the views to fit your organization, including using your own graphics for display. You
can view, add, or update relationships using the graphical interface. The main
components of the graph diagram are:

     Graph
     A mathematical structure used to model relationships between objects from a
     certain collection.
     Node
     Representation of an entity. Nodes are defined by an ID and at a minimum
     require that either a bounding shape or an icon be defined so they are visible in
     the graph. Nodes can be joined by an edge (which also has an ID) by specifying


     the IDs of the joined nodes as the "to" and "from" attribute values of the node
     edge. Line styles and colors are optional.
     Edge
     Represents a relationship between two nodes. An edge is usually depicted as a
     line connecting its end nodes. An arrowhead at the target end of the line
     indicates the destination of a directed edge.

Defining the graph in XML format

The XML used to define a graph for Service Manager is an extension of a graph
definition standard GXL. The GXL standard defines the basic structure for defining
nodes and edges, but is lacking in specifics about graph visualization. The primary
extension is the addition of an attr element for conveying visualization specific
properties of the nodes and edges. The diagram below illustrates the primary
elements involved in the definition. For more detail about the proper structure of the
XML, see the link to the schema in the related topics.


W3C schema for graph diagram XML        Page 32 of 369

This PDF was generated on May 23, 2026

This is the schema for validating a well formed graph definition. The schema is
available as dv/gxl-1.--dvd.xsd in the war file.




Valid values for graph elements and attributes


These are the valid values for the elements and attributes.  Page 37 of 369

This PDF was generated on May 23, 2026
Element/attribute name                                                                          Service Manager 9.81
action
action/balloon                          Type
action/forcemenu
                                        String specifying an action acted on by
action/label                            the associated action handler.
action/type
balloon                                 String specifying tooltip to display if
edge/from                               action is shown in a menu.
edge/id
edge/to                                 If set to true, indicates the pop-up
icon                                    should be display when only one
icon/group                              labeled action is defined.

                                        String specifying a label to display if
                                        action is shown in a menu.

                                        String specifying the type of action
                                        invoked by the action handler.

                                        String specifying the balloon text to
                                        show for the item.

                                        String specifying the ID of the
                                        originating node.

                                        String specifying a unique ID for the
                                        edge.

                                        String specifying the ID of the target
                                        node.

                                        String specifying relative or absolute
                                        URL or relative resource path.

                                        String specifying a display group name.

 Element/attribute name                                                                         Service Manager 9.81
 icon/position
                                        Type
 label/font
 label/style                            String specifying icon position from
 label/size                             one of the possible values relative to
 line/color                             the node center. The default is C.
 line/end
                                        N = North or above
 line/highlightcolor                    NE = Northeast or upper right
                                        E = East or right
This PDF was generated on May 23, 2026  SE = Southeast or lower right
                                        S = South or below
                                        SW = Southwest or lower left
                                        W = West or left
                                        NW = Northwest or upper left
                                        C = Center

                                        String specifying font name per Java
                                        Font class.

                                        Integer specifying font style per Java
                                        Font class.

                                        Integer specifying font size per Java
                                        Font class.

                                        String specifying color name or Hex
                                        RGB color value prefixed with #. The
                                        default is black.

                                        Integer specifying the type of line end.
                                        The default is 0.
                                        NO ARROW = 0
                                        SOURCE_ARROW = 1 TARGET_ARROW
                                        =2
                                        SOURCE_AND_TARGET_ARROW = 3

                                        String specifying highlight color name
                                        or Hex RGB color value prefixed with #.
                                        The default is none.

                                                                                                                          Page 39 of 369
 Element/attribute name                                                                         Service Manager 9.81
 line/style
                                        Type
 line/weight
 node/id                                Integer specifying line style. The
 shape/color                            default is 0.
 shape/height                           SOLID = 0
 shape/type                             LONG_DASH = 1
                                        SHORT_DASH = 2
 shape/width                            DOT = 3
 shape/x                                DASH_DOT = 4
 shape/y                                DASH_DOT_DOT = 5
 state/expanded
                                        Integer specifying the line weight. The
This PDF was generated on May 23, 2026  default is 2.

                                        String specifying a unique id for the
                                        node.

                                        String specifying fill-color name or Hex
                                        RGB color value prefixed with #. The
                                        default is none.

                                        Integer specifying height.

                                        Integer specifying the type of shape.
                                        The default is -1.
                                        NONE= -1
                                        RECTANGLE = 0
                                        ELLIPSE = 1
                                        DIAMOND = 2
                                        ROUNDED_RECT = 3

                                        Integer specifying width.

                                        Integer specifying x coordinate.

                                        Integer specifying y coordinate.

                                        If set to true, indicates the node is
                                        currently expanded.

                                                                                                                          Page 40 of 369

Element/attribute name                  Type
state/hidden
state/opened                            If set to true, indicates the node or
                                        edge is currently hidden.
state/root
url                                     If set to true, indicates the node has
url/balloon                             been opened by reading the associated
url/label                               XMLADD action or URL.
url/urltype
                                        If set to true, indicates the node is the
                                        root node for the graph.

                                        String specifying a relative or absolute
                                        URL path

                                        String specifying tooltip to display if
                                        URL is shown in a menu.

                                        String specifying a label to display if
                                        URL is shown in a menu.

                                        String specifying the type of URL. The
                                        default is HTML.

                                        HTML = new HTML page
                                        XML = new XML defining graph
                                        XML_ADD = XML content to add to
                                        current graph

Referencing images in the XML for the graph
control

When you are building an application that includes a graph diagram, you can
reference an image that's attached to a record in Service Manager. The graph uses
the attached image to display the icon for that node. You can also display portrait
icons that are attached to contact records in the graph diagram.

This is an example of a schema definition for an icon.


The syntax to reference an image from the database and display it in the graph is:
scattach://{type}:{uid}:{attachmentname}:{table}:{record} , where type equals img
or file .
The unique identifier for each image is located on the corresponding
SYSATTACHMENTS record.
The following is an example of how to reference an image that's an attachment to a
record.
scattach://file:45c0dfd600245044034b76c8:max_manager_small.gif:contacts:MANA
GER, MAX
The following is an example of how to reference a portrait image on a contacts
record.
scattach://img:45afb84a002d42c403030d48:MANAGER, MAX:contacts:MANAGER,
MAX
Here is an example of a complete and valid XML statement that references an image.
This particular statement references an image that's attached to Max Manager's
contacts record. This displays as an icon for the node in the graph diagram.


Icons with larger position values appear on top of smaller position values unless the
images specify the same value for the position attribute. In that case, the icons are
rendered in document order so that icons later in the document for the same node
overlay those preceding them. The origin for all icons is the center. When you specify
a group attribute for an icon, it includes items that contain duplicate group attributes.

Defining actions on nodes and edges in the XML for
the graph control

When you are building an application that includes a graph diagram, you can define
the actions on nodes and edges.
Following is the pertinent part of the schema definition for an action on a node or an
edge. The type attribute is required and can be any value if a custom action handler is
provided. If the default action handler is used, then the possible values are the same
as the urltype attribute for the url element. If a label attribute is present, the action
appears on the popup action menu when more than one labeled action is available.
Providing a value of true with the forcemenu attribute causes the popup to appear
even when there is only a single possible action.

The following is an example of a complete and valid XML statement that defines an
expand action on the first node and two additional actions on each node and edge. It
also references the images that are attached to the contacts records of Max Manager
and Steve Supervisor. These display as icons for each node in the graph diagram.


Graph toolbar icons

The following table describes the icons available for use on the graph diagram:

Name                                    Icon                          Service Manager 9.81

Zoom In                                       Description

Zoom Out                                      Decreases the size of
                                              the current visualization
Fit Content                                   diagram.
Select Mode
Window Area Mode                              Enlarges the size of the
                                              current visualization
View Drag Mode                                diagram.
Drill Down Mode
Show Overview                                 Fits the content of the
                                              diagram to the view.
This PDF was generated on May 23, 2026
                                              Highlights an item in the
                                              visualization diagram.

                                              Clicking and dragging
                                              the cursor to highlight
                                              one or more items will
                                              zoom in and fit the
                                              selection to the current
                                              view.

                                              Clicking the mouse and
                                              dragging the cursor will
                                              pan the diagram within
                                              the current viewable
                                              area.

                                              Drills down further into a
                                              node and its
                                              relationships.

                                              Turns on the overview
                                              window displaying an
                                              overview of the entire
                                              graph contents
                                              highlighting what's
                                              displayed in the working
                                              window.

                                                                                            Page 45 of 369

Name                                    Icon  Description

Show Node Labels                              Shows or hides the
                                              labels on nodes.

Show Edge Labels                              Shows or hides the
                                              labels on edges.

Print Preview                                 Displays a print preview
                                              of the visualization
                                              diagram in the current
                                              focus. You can then
                                              select Print from the
                                              Print Preview dialog.

Select Layout                                 Filter the view of the
                                              graph using one of the
                                              available layouts.

Functions and displayevent definitions for actions
in the graph diagram

These functions enable users to interact with a graph that represents a network of
interrelated objects. Both RAD and JavaScript functions are supported.

Graph event

The following are the functions and displayevent definition that are required to get
and display more information in a graph diagram. When a user requests more
information in the graph diagram, the applications generate additional XML that's
routed through the server to the client for re-rendering.

Displayevent
     OnGraphEvent (32105)

RAD functions
     get.graph.id()
     get.graphnode.id()
     add.graphnodes(xml)

JavaScript functions
     get_graph_id()
     get_graphnode_id()


     add_graphnodes(String strXML)

Graph action

The following are the functions and displayevent definition that are required to
activate an action that's defined for a node. When a user selects an action from the
pop-up menu for a node, the application can access the Graph ID, Action, and Target
by using the functions below. This information can be used in the displayevent to call
additional application logic.

Displayevent
     OnGraphAction (32100)

RAD functions
     get.graph.action()
     get.graph.target()

JavaScript functions
     get_graph_action()
     get_graph_target()

Activate an action on a node or edge in a graph

Applies to User Roles: System Administrator

To activate an action on a node or edge in a graph:

   1. Click once on a node or edge inside of a graph diagram.
     A pop-up menu opens with a list of available actions.

   2. Click on a node or edge action from the pop-up menu.
     The action and target run.

Note: Right-click or left-click any of the toolbar controls to activate an action.

Set the focus on the graph

Applies to User Roles: System Administrator

To set the focus on the graph:

   1. Type fd on the Service Manager command line and press Enter to start Forms
     Designer.

   2. Type a form name and click Search or create a new form.
   3. Once in design mode, click the Graph control in the form.

     This highlights the Graph control and enables you to edit its properties.


   4. In the Properties view, set the Input property value to a database field or
     variable. For example, $L.graph .
     This sets the focus on the graph and enables the end user to perform an action
     on the graph (such as view a node detail) and then return to the tab with the
     graph.

Related topics

Graph control
````
