---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.24.26 .. 1.2.24.31
printed_pages: 782-795
---

# 1.2.24.26 Parameter: reportgroup

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.24.26. Parameter: reportgroup

Parameter

reportgroup

Description

This parameter displays the status of ports, processes, and threads in horizontal and
vertical scaling servlet implementations.

Important: The reportgroup process requires every other process to send it a report.
This means that every process must consume some amount of system memory to
generate its report, which decreases the amount of memory available to run the
system. While the reporting information may be valuable, you need to balance your
data tracking requirements with the amount of memory being used. To reduce the
performance impact of running this process, you may want to run it on a development
or testing system, or choose a longer interval between running reports.

            Note

           If you have opted to run this process continuously (for example, every
           minute non-stop), you have the option to shut down the process. To shut
           down a specific Service Manager process, specify the hostname of the
           Service Manager server and system process (PID) you want to shut down.
           On a command line, enter sm -shutdown -host:myhost.myserver.com -
           PID:1234.

Some examples of the information that's reported include:

     Service Manager locks that are currently being held.
     Service Manager threads waiting to acquire locks. This is useful for lock
     analysis.
     Thread dumps of all Service Manager processes on all hosts. This is useful for
     detecting deadlocks, if any. Thread dumps repeat for each process and host.

The information is sent to a separate log file.

Valid if set from

Server's operating system command prompt


Requires restart of the Service Manager server?

No

Default values

Run the report every 20 seconds.
Repeat the process 15 times.

Possible values

Number of seconds between reports and the number of times to run a report.

Example usage

Run the report every 20 seconds and repeat the process 15 times.
sm -reportgroup
sm -reportgroup:20,15
Recommended: Run the report every minute and repeat the process 20 times. This
provides less load on the cluster.
sm -reportgroup:60,20

Log File Examples

The following sample is an example of the information that's displayed in a log file for
a vertical scaling servlet implementation on one host.

            Note

                This example report has been reformatted for printed display.
                The output in this example has been truncated (this is not the full
                output from the command).


Load Balancer Status:Sat Jun 23 09:58:52 PDT 2012

HP Service Manager LoadBalancer Running on

Host:myhost.myserver.com Port:34567

List of Hosts:

HostName: myhost.myserver.com

----------------------------------------------------------------

---Server Instances

ProcessID  ClusterAddress               HttpPort HttpsPort Sessions

DbgMode QMode LB

7872    15.178.177.72:33285 34568            0                         (3/50)

N       N  N

7881    15.178.177.72:33283 34569            0                         (1/50)

N       N  N

7837    15.178.177.72:33278 34567            0                         (0/50)

N       N  Y

-------------------------------------------------

State      LowMem                       JAVA_USED/MAX/PERCENT

WR[6d22h39m] N                          (4404408/238616576/1.8458097)

QR[9m]     N                            (2983152/238616576/1.2501864)

RUN        N                            (2601080/238616576/1.0900668)

----------------------------------------------------------Non

Server Instances---

ProcessID  ClusterAddress               State LowMem

JAVA_USED/MAX/PERCENT

8510    15.178.177.72:33329             RUN                    N

(0/89522176/0.0)

7931    15.178.177.72:33299             RUN                    N

(1502256/59703296/2.5162027)

7880    15.178.177.72:33280             RST                    N

(1539248/59703296/2.5781624)

7930    15.178.177.72:33291             SHT                    N

(1514024/59703296/2.5359137)

--------------------------------------

Command Line parameters

-reportgroup:1,1

-sync -log:../logs/sm.sync.log

system.start -log:../logs/sm.start.log


  Locks from all nodes in the cluster.
  Waiting locks
  Thread Dumps from all nodes In the cluster
  Thread Dump from process: Host: myhost.myserver.com PID: 7872
  ChannelAddress: 15.178.177.72:33285
  SM_LowMemoryHandler
  java.lang.Thread.sleep(Native Method)
  comp.hp.ov.sm.common.oom.LowMemoryHandler.run(LowMemoryHandler.j
  ava:181)
  java.lang.Thread.run(Thread.java:619

Related topics

Servlet implementation
System parameters
Startup parameter: shutdown
Connection parameters
Servlet parameters


1.2.24.27. Parameter: threadsperprocess

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

threadsperprocess

Description

This parameter defines the number of threads that you want the Service Manager
server to start when it starts a new process. Each thread can support one client
connection or one background process.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

250

Possible values

Number of threads to start

Example usage

Command line: sm -httpPort:13080 -threadsperprocess: 250
Initialization file: threadsperprocess:250

Related topics

System parameters
Enter a parameter in the sm.ini file


1.2.24.28. Parameter:
ssl_trustedClientsJKS

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

ssl_trustedClientsJKS

Description

This parameter defines the path and file name to the Java keystore containing the list
of trusted client certificates from which the Service Manager server allows
connection requests. When you enable the ssl_reqClientAuth parameter with any of
the servlet implementations, only the clients with signed certificates in this keystore
can connect to the Service Manager server. This keystore contains a copy of each
client's signed certificate. All servlet implementation options require access to
certificates stored in Java keystore formats.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

None

Possible values

Path and file name of the Java keystore containing the list of trusted client certificates

Example usage

Command line: sm -httpPort:13080 -httpsPort:13081 -
ssl_trustedClientsJKS:trusted.jks -ssl_trustedClientsPwd:<password>

Initialization file: ssl_trustedClientsJKS:trusted.jks

Related topics


System parameters
Enter a parameter in the sm.ini file
SSL parameters
Servlet parameters


1.2.24.29. Parameter:
ssl_trustedClientsPwd

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

ssl_trustedClientsPwd

Description

This parameter defines the password to the Java keystore containing the list of
trusted client certificates from which the Service Manager server allows connection
requests. When you enable the ssl_reqClientAuth parameter with any of the servlet
implementations, only the clients with signed certificates in this keystore can connect
to the Service Manager server. This keystore contains a copy of each client's signed
certificate. All servlet implementation options require access to certificates stored in
Java keystore formats.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

The keystorePass value

Possible values

Password to the Java keystore containing the signed client certificates of trusted
clients

Example usage

Command line: sm -httpPort:13080 -httpsPort:13081 -
ssl_trustedClientsJKS:trusted.jks -ssl_trustedClientsPwd:<password>

Initialization file: keystorePass:<password>

Related topics


System parameters
Enter a parameter in the sm.ini file
SSL parameters
Servlet parameters


1.2.24.30. Parameter: truststoreFile

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

truststoreFile

Description

This parameter defines the path and file name of the Java keystore containing the list
of trusted certificate authorities. Service Manager requires this keystore to validate
the server and client certificates in servlet implementations only. Service Manager
implementations using classic listeners can't use this parameter and must use the
cacertpem parameter instead.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

A null value causes the Service Manager server to look for the trusted keystore file
JAVA HOME\lib\security\cacerts

Possible values

Path and file name of the Java keystore containing the list of trusted CA certificates
relative to the Service Manager RUN folder

Example usage

Command line: sm -httpPort:13080 -httpsPort:13081 -truststoreFile:mycacerts -
truststorePass:changeme

Initialization file: truststoreFile:mycacerts

Related topics

System parameters
Enter a parameter in the sm.ini file


SSL parameters
Servlet parameters


1.2.24.31. Parameter: truststorePass

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

truststorePass

Description

This parameter defines the password to the Java keystore containing the list of
trusted CA certificates. Service Manager uses this keystore to validate server and
client certificates in servlet implementations. All servlet implementation options
require access to trusted certificates stored in Java keystore formats.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

changeit

Possible values

Password to the Java keystore containing the Service Manager server's signed
certificate

Example usage

Command line: sm -httpPort:13080 -httpsPort:13081 -truststoreFile:mycacerts -
truststorePass:changeme

Initialization file: truststorePass:<password>

Related topics

System parameters
Enter a parameter in the sm.ini file
SSL parameters
Servlet parameters
````
