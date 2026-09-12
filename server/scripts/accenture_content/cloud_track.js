/**
 * Comprehensive Cloud Computing Track for Accenture AEH Technical Assessment
 * 3 Modules across Days 2, 5, and 8
 * Each module features in-depth Markdown notes + exactly 10 rigorous MCQs.
 */

const cloudTrackModules = [
  // ==================== DAY 2: CLOUD FOUNDATIONS & SERVICE MODELS ====================
  {
    dayNumber: 2,
    title: 'Cloud Computing Foundations: Service Models (IaaS, PaaS, SaaS, FaaS), Deployment Models & Shared Responsibility',
    category: 'Cloud',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 70,
    readingContent: `# Cloud Computing Foundations: Service Models & Shared Responsibility

Cloud computing is the on-demand delivery of computing power, database storage, applications, and other IT resources via the internet with pay-as-you-go pricing. For Accenture's AEH Technical Assessment, cloud architecture questions emphasize service models, tenant isolation, deployment models, and the exact ownership boundary in the **Shared Responsibility Model**.

---

## 1. The 5 Essential Characteristics of Cloud (NIST Definition)

The National Institute of Standards and Technology (NIST) outlines five core traits that define authentic cloud architectures:

1. **On-Demand Self-Service**: Consumers provision computing resources (server time, storage) automatically without requiring human intervention from service providers.
2. **Broad Network Access**: Capabilities are available across standard networks and accessed through heterogeneous thin or thick client platforms (smartphones, laptops, tablets).
3. **Resource Pooling**: The provider's computing resources are pooled to serve multiple consumers using a **multi-tenant model**, dynamically assigning physical and virtual resources according to demand.
4. **Rapid Elasticity**: Resources can be elastically provisioned and released, in some cases automatically, to scale rapidly outward and inward commensurate with demand.
5. **Measured Service**: Cloud systems automatically control and optimize resource use by leveraging metering capabilities appropriate to the service type (storage, processing, bandwidth, active user accounts).

---

## 2. Cloud Service Models: IaaS vs PaaS vs SaaS vs FaaS

The cloud computing pyramid consists of layers representing increasing degrees of abstraction:

\`\`\`text
+-------------------------------------------------------------+
|               SaaS (Software as a Service)                  |
|       End-user applications (Google Workspace, M365)        |
+-------------------------------------------------------------+
|                PaaS (Platform as a Service)                 |
|       Application deployment runtimes (Beanstalk, Heroku)   |
+-------------------------------------------------------------+
|               FaaS (Function as a Service)                  |
|       Event-driven micro-code execution (AWS Lambda)        |
+-------------------------------------------------------------+
|             IaaS (Infrastructure as a Service)              |
|       Raw virtual compute, storage & networking (AWS EC2)   |
+-------------------------------------------------------------+
\`\`\`

### Comprehensive Comparison Matrix

| Dimension | IaaS | PaaS | SaaS | FaaS (Serverless) |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Consumer** | Sysadmins, DevOps, Cloud Architects | Software Developers, Application Teams | Business End-Users | Modern Cloud Developers |
| **What You Manage** | OS, Middleware, Runtime, Data, Apps | Applications, Code, Data | Configurations & User Access | Application Code & Triggers only |
| **What Cloud Vendor Manages**| Physical HW, Hypervisor, Datacenter | OS, Runtime, Patching, HW, Network | Entire Application Stack, Security, HW | Infrastructure, Runtime, Server scaling |
| **Core Value** | Maximum infrastructure control | Accelerated time-to-market; zero OS ops | Ready-to-use software without hosting | Pay only per millisecond of compute |
| **Enterprise Examples** | AWS EC2, Azure VMs, GCP Compute Engine | AWS Elastic Beanstalk, Google App Engine | Salesforce, Google Workspace, ServiceNow | AWS Lambda, Azure Functions, Cloudflare Workers |

---

## 3. The Cloud Shared Responsibility Model

A central topic in the Accenture OA is determining **who is responsible for security and operational tasks** under each cloud model:

| Layer / Component | On-Premises | IaaS | PaaS | SaaS |
| :--- | :---: | :---: | :---: | :---: |
| **Data Classification & Governance** | Customer | Customer | Customer | Customer |
| **Client Access & IAM Policies** | Customer | Customer | Customer | Customer |
| **Application Logic & Code** | Customer | Customer | Customer | **Cloud Provider** |
| **Runtime & Middleware** | Customer | Customer | **Cloud Provider** | **Cloud Provider** |
| **Operating System & Kernel Patches** | Customer | Customer | **Cloud Provider** | **Cloud Provider** |
| **Virtualization & Hypervisor** | Customer | **Cloud Provider** | **Cloud Provider** | **Cloud Provider** |
| **Physical Hardware & Datacenter** | Customer | **Cloud Provider** | **Cloud Provider** | **Cloud Provider** |

> **Key Takeaway for Exam:** The customer **ALWAYS** owns their data and access management (IAM credentials), regardless of whether they choose IaaS, PaaS, or SaaS!

---

## 4. Cloud Deployment Models

- **Public Cloud**: Multitenant infrastructure owned and operated by a third-party CSP over the public internet (AWS, Azure, GCP). Features lowest CapEx and near-infinite scale.
- **Private Cloud**: Infrastructure provisioned exclusively for a single enterprise. Can be hosted on-premises in corporate datacenters or managed by a specialized vendor. Delivers highest regulatory compliance and strict isolation.
- **Hybrid Cloud**: Integrates private infrastructure with public cloud platforms using encrypted tunnels (IPSec VPN, AWS Direct Connect, Azure ExpressRoute). Allows **Cloud Bursting** (handling traffic spikes on public cloud while retaining sensitive databases on-premises).
- **Community Cloud**: Shared by multiple distinct organizations that share common missions, compliance standards, or security requirements (e.g., healthcare research consortia, federal defense agencies).

---

## 5. Economic Principles: CapEx vs OpEx

- **CapEx (Capital Expenditure)**: Upfront, fixed capital invested in physical infrastructure (purchasing servers, building server rooms, cooling systems, long-term depreciation over 3–5 years).
- **OpEx (Operational Expenditure)**: Ongoing operational costs where expenses correlate directly to current consumption (monthly cloud bill, utility-based billing, no stranded capacity).`,
    mcqs: [
      {
        question: 'Under the Cloud Shared Responsibility Model, which operational responsibility ALWAYS belongs to the customer across IaaS, PaaS, and SaaS?',
        options: [
          'Operating system kernel patching and security updates',
          'Physical security of the server racks and diesel backup generators',
          'Customer data classification, identity management, and access controls',
          'Hypervisor configuration and network switch maintenance'
        ],
        correctOption: 2
      },
      {
        question: 'Which of the following is considered an Infrastructure as a Service (IaaS) offering?',
        options: ['Google App Engine', 'AWS Elastic Compute Cloud (EC2)', 'Salesforce Sales Cloud', 'Microsoft Office 365'],
        correctOption: 1
      },
      {
        question: 'An enterprise maintains sensitive customer financial records in a secure on-premises datacenter, but spins up public cloud virtual instances during peak holiday traffic. What deployment architecture is this?',
        options: ['Multi-tenant Community Cloud', 'Hybrid Cloud with Cloud Bursting', 'Isolated Private Cloud', 'Distributed Edge Cloud'],
        correctOption: 1
      },
      {
        question: 'Which cloud computing paradigm charges customers strictly for execution duration in milliseconds without requiring persistent server instances to be provisioned?',
        options: ['IaaS (Infrastructure as a Service)', 'FaaS (Function as a Service / Serverless)', 'PaaS (Platform as a Service)', 'BaaS (Backend as a Service)'],
        correctOption: 1
      },
      {
        question: 'According to the NIST definition of cloud computing, what characteristic describes the capability of computing resources to dynamically expand and contract commensurate with demand?',
        options: ['Broad Network Access', 'Rapid Elasticity', 'Resource Pooling', 'On-Demand Self-Service'],
        correctOption: 1
      },
      {
        question: 'Which financial shift represents the primary economic advantage of migrating from legacy on-premises datacenters to public cloud providers?',
        options: [
          'Transitioning from predictable OpEx to high upfront CapEx',
          'Transitioning from heavy upfront CapEx to variable, pay-as-you-go OpEx',
          'Eliminating software engineering operational labor completely',
          'Locking in 10-year depreciating physical asset depreciation'
        ],
        correctOption: 1
      },
      {
        question: 'In which cloud service model does the customer have direct responsibility for installing security patches on the underlying operating system (such as Windows Server or Ubuntu Linux)?',
        options: ['SaaS', 'PaaS', 'IaaS', 'FaaS'],
        correctOption: 2
      },
      {
        question: 'A community cloud is most appropriately selected when:',
        options: [
          'A single company requires full proprietary ownership of bare-metal machines',
          'Multiple organizations with shared regulatory or security compliance requirements collaborate',
          'A startup wants the cheapest possible multitenant public website hosting',
          'A developer needs local offline unit testing'
        ],
        correctOption: 1
      },
      {
        question: 'What mechanism allows public cloud providers to serve thousands of diverse customers on shared physical hardware while keeping their data isolated?',
        options: ['Hypervisor-driven multi-tenancy and hardware virtualization', 'Manual air-gapping of individual physical motherboards', 'Single-tenant physical blade servers per customer', 'Time-slice batch processing overnight'],
        correctOption: 0
      },
      {
        question: 'Which of the following describes AWS Elastic Beanstalk and Google App Engine?',
        options: [
          'IaaS: provides raw virtual machines and leaves OS installation to the user',
          'PaaS: provides a managed execution platform where developers upload code and the platform manages scaling and runtimes',
          'SaaS: provides turn-key end-user web applications without code modification',
          'DaaS: provides hosted virtual desktop workspaces'
        ],
        correctOption: 1
      }
    ]
  },

  // ==================== DAY 5: CLOUD INFRASTRUCTURE & NETWORKING ====================
  {
    dayNumber: 5,
    title: 'Cloud Infrastructure & Networking: Virtualization, Containers (Docker), VPC, Subnets, Security Groups vs NACLs',
    category: 'Cloud',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 70,
    readingContent: `# Cloud Infrastructure & Networking: Virtualization, VPC & Cloud Security

Enterprise cloud applications depend on secure, isolated software-defined networks (SDN). In the Accenture AEH assessment, infrastructure questions test **Virtual Private Cloud (VPC)** topology, public vs private subnets, NAT Gateways, and the critical distinction between **Security Groups** and **Network Access Control Lists (NACLs)**.

---

## 1. Virtualization: Hypervisors vs Containers

Virtualization enables multiple isolated software environments to share the same physical server:

### A. Type 1 (Bare-Metal) vs Type 2 (Hosted) Hypervisors

| Feature | Type 1 Hypervisor (Bare-Metal) | Type 2 Hypervisor (Hosted) |
| :--- | :--- | :--- |
| **Architecture** | Installs directly on physical hardware | Installs as an app on a host OS |
| **Performance** | Near bare-metal speed; lowest overhead | Moderate latency due to host OS abstraction |
| **Enterprise Use** | Enterprise cloud datacenters (AWS Nitro, VMware ESXi, Hyper-V, KVM) | Developer desktops (VirtualBox, VMware Workstation) |

### B. Virtual Machines (VMs) vs Docker Containers

\`\`\`text
+-------------------+   +-------------------+
|  App A  |  App B  |   |  App A  |  App B  |
+-------------------+   +-------------------+
|  Bins / Libraries |   |  Bins / Libraries |
+-------------------+   +-------------------+
|     Guest OS      |   |  Container Engine |
+-------------------+   +-------------------+
|    Hypervisor     |   |      Host OS      |
+-------------------+   +-------------------+
| Physical Server   |   | Physical Server   |
+-------------------+   +-------------------+
  [Virtual Machine]       [Docker Container]
\`\`\`

- **Virtual Machines**: Virtualize physical hardware. Every VM runs a dedicated, full guest OS kernel. Heavy memory footprint (several GBs) and takes minutes to boot.
- **Containers**: Virtualize the **operating system kernel**. Containers share the host OS kernel while isolating user space processes, root filesystems, and networking. Super lightweight (megabytes) with millisecond startup.

---

## 2. Virtual Private Cloud (VPC) Architecture

A **VPC** is an isolated software-defined private virtual network dedicated to your cloud account:

- **CIDR Block (Classless Inter-Domain Routing)**: Defines the private IP address range of the VPC (e.g., \`10.0.0.0/16\` provides \(2^{16} = 65,536\) private IP addresses).
- **Public Subnet**: A subnet whose route table has a direct route (\`0.0.0.0/0\`) to an **Internet Gateway (IGW)**. Resources (like public Load Balancers) receive public IPs.
- **Private Subnet**: Has no direct route to the Internet Gateway. Back-end application servers and databases live here to prevent direct inbound internet access.
- **NAT Gateway (Network Address Translation)**: Positioned in a *public* subnet. Allows outbound internet access for instances in private subnets (e.g., to download OS security patches) while blocking unauthorized inbound internet connections.

---

## 3. Cloud Firewalls: Security Groups vs NACLs

This is one of the **most frequently tested topics** in corporate cloud assessments:

| Feature | Security Group (SG) | Network Access Control List (NACL) |
| :--- | :--- | :--- |
| **Layer of Operation** | Instance level (Virtual NIC of VM) | Subnet level (Boundary of subnet) |
| **State Tracking** | **Stateful** (Return traffic is automatically permitted regardless of inbound rules) | **Stateless** (Return traffic must be explicitly allowed by an outbound rule) |
| **Rule Types** | **ALLOW rules only** (Everything else is denied by default) | **ALLOW and DENY rules** |
| **Rule Evaluation** | All rules evaluated together | Evaluated in strict chronological order by rule number (lowest number wins) |
| **Defense-in-Depth Role**| Acts as virtual firewall on instance | Acts as perimeter firewall on subnet boundary |

> **Stateful Example:** If an inbound request on port 443 is permitted by a Security Group, the outbound response on an ephemeral port is **automatically allowed**, even if no outbound rules exist!

---

## 4. High Availability: Regions vs Availability Zones (AZs)

- **Region**: A distinct geographic area in the world (e.g., \`us-east-1\` N. Virginia, \`ap-south-1\` Mumbai). Each region is physically isolated from other regions.
- **Availability Zone (AZ)**: One or more discrete physical datacenters within a Region, equipped with redundant power, networking, and connectivity. Connected via ultra-low-latency fiber.
- **Fault-Tolerant Design**: Deploying EC2 instances or databases across multiple AZs within a region ensures that an electrical fire or flood in one datacenter does not cause service outage.`,
    mcqs: [
      {
        question: 'Which statement accurately describes the fundamental difference between Security Groups and Network Access Control Lists (NACLs)?',
        options: [
          'Security Groups operate at the subnet level and are stateless; NACLs operate at the instance level and are stateful',
          'Security Groups are stateful firewalls at the instance level; NACLs are stateless firewalls at the subnet level',
          'NACLs support ALLOW rules only, whereas Security Groups support both ALLOW and DENY rules',
          'Security Groups evaluate rules sequentially by numeric order; NACLs evaluate all rules concurrently'
        ],
        correctOption: 1
      },
      {
        question: 'If a Security Group allows inbound traffic on port 80, what outbound rule is required to allow the server to send the HTTP response back to the client?',
        options: [
          'An explicit outbound rule permitting port 80',
          'An outbound rule permitting the dynamic ephemeral port range (1024-65535)',
          'No outbound rule is needed because Security Groups are stateful',
          'An outbound ICMP echo-reply rule'
        ],
        correctOption: 2
      },
      {
        question: 'What is the primary function of a NAT Gateway in a cloud VPC architecture?',
        options: [
          'Allows instances in private subnets to initiate outbound internet traffic for updates while preventing inbound internet connections',
          'Distributes incoming HTTP traffic across a fleet of healthy web servers',
          'Resolves domain names to IP addresses inside the private subnet',
          'Encrypts network traffic traveling between two distinct cloud regions'
        ],
        correctOption: 0
      },
      {
        question: 'How do Docker containers differ architecturally from Type 1 hypervisor virtual machines?',
        options: [
          'Containers bundle a complete independent guest OS kernel for every container',
          'Containers share the host operating system kernel and isolate user space environments, making them much lighter',
          'Containers require hardware-assisted nested virtualization enabled in the BIOS',
          'Containers run slower than VMs because of dual OS layers'
        ],
        correctOption: 1
      },
      {
        question: 'Which CIDR block notation represents an IP range with exactly 256 total IP addresses?',
        options: ['10.0.0.0/16', '10.0.0.0/24', '10.0.0.0/8', '10.0.0.0/32'],
        correctOption: 1
      },
      {
        question: 'What defines a public subnet within an Amazon VPC or Azure Virtual Network?',
        options: [
          'It has a dedicated hardware firewall appliance attached directly to its switch',
          'Its route table contains an entry directing default traffic (0.0.0.0/0) to an Internet Gateway',
          'It only contains databases and private caching servers',
          'It cannot have any Security Groups attached'
        ],
        correctOption: 1
      },
      {
        question: 'Which hypervisor type runs directly on the bare physical server hardware without an underlying host operating system?',
        options: ['Type 1 Bare-Metal Hypervisor (e.g. VMware ESXi, KVM)', 'Type 2 Hosted Hypervisor (e.g. Oracle VirtualBox)', 'Application-level interpreter', 'Container runtime daemon'],
        correctOption: 0
      },
      {
        question: 'In a stateless firewall such as a cloud NACL, what happens if an inbound packet is allowed on port 443, but no outbound rule exists for ephemeral ports?',
        options: [
          'The response packet is automatically allowed because TCP tracks session state',
          'The return traffic packet is dropped, breaking the connection',
          'The firewall falls back to DNS port 53',
          'The packet is routed to the default gateway automatically'
        ],
        correctOption: 1
      },
      {
        question: 'An Availability Zone (AZ) in public cloud architecture consists of:',
        options: [
          'A single rack inside a public telecommunication office',
          'One or more discrete physical data centers with independent redundant power, networking, and cooling in a region',
          'A global CDN edge location that caches static media',
          'A virtual subnet spanning multiple continents'
        ],
        correctOption: 1
      },
      {
        question: 'Why should enterprise production databases (such as PostgreSQL or MySQL) be placed in private subnets rather than public subnets?',
        options: [
          'Private subnets increase SQL query execution speed by 10x',
          'To prevent direct unauthorized access from the public internet, restricting access to internal backend application servers',
          'Because private subnets do not require storage backups',
          'Public subnets cannot support relational databases'
        ],
        correctOption: 1
      }
    ]
  },

  // ==================== DAY 8: CLOUD STORAGE, SCALABILITY & HIGH AVAILABILITY ====================
  {
    dayNumber: 8,
    title: 'Cloud Storage, Scalability & High Availability: S3, EBS, EFS, Auto-Scaling, Load Balancers & Disaster Recovery',
    category: 'Cloud',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 70,
    readingContent: `# Cloud Storage, Scalability, Load Balancing & High Availability

Building enterprise-grade cloud applications requires selecting the right storage architecture, designing stateless compute tiers that scale horizontally, and implementing automated health checking via Load Balancers.

---

## 1. Cloud Storage Triad: Object vs Block vs File Storage

Choosing the wrong storage engine causes catastrophic performance bottlenecks and high cloud bills:

| Storage Type | Cloud Service Example | Architecture | Access Method | Best Used For |
| :--- | :--- | :--- | :--- | :--- |
| **Object Storage** | AWS S3, Azure Blob, GCS | Flat address space; data stored as objects with unique IDs and custom metadata | REST API (HTTP GET, PUT, DELETE) | Static assets, image uploads, data lake analytics, backups, unformatted video files |
| **Block Storage** | AWS EBS, Azure Managed Disk | Storage split into fixed-size blocks (sectors) with raw filesystem formatting | Low-level block I/O protocol (Fibre Channel, NVMe, iSCSI) | Operating system boot disks, high-performance database files (PostgreSQL, Oracle) |
| **File Storage** | AWS EFS, Azure Files | Hierarchical folder tree with POSIX permissions | Network protocols (NFSv4, SMB) | Multi-instance shared directories, legacy enterprise CMS, shared home folders |

### Key Object Storage Characteristics (AWS S3)
- **Durability**: 99.999999999% (11 9's of durability) achieved by replicating data across multiple physical facilities.
- **Immutability & Versioning**: Objects are modified by replacing the entire object; object versioning retains historical revisions for compliance.
- **Storage Classes**: Standard (frequent access) \(\to\) Infrequent Access (IA) \(\to\) Glacier / Archive (deep storage, hours retrieval, ultra-low cost).

---

## 2. Scalability: Vertical (Scale-Up) vs Horizontal (Scale-Out)

\`\`\`text
Vertical Scaling (Scale-Up)        Horizontal Scaling (Scale-Out)
      +--------------+                   +----+  +----+  +----+
      |  Larger VM   |                   | VM |  | VM |  | VM |
      | 64 CPU/256GB |                   | 1  |  | 2  |  | 3  |
      +--------------+                   +----+  +----+  +----+
   (Hardware limit reached)         (Infinite theoretical elasticity)
\`\`\`

- **Vertical Scaling (Scale-Up)**: Adding more CPU cores, RAM, or storage to a single instance. Limited by physical hardware constraints; requires server downtime to resize.
- **Horizontal Scaling (Scale-Out)**: Adding more server instances in parallel behind a load balancer. Eliminates single point of failure; enables true elasticity (scaling down to save costs when traffic recedes).

---

## 3. Load Balancers: Application (ALB) vs Network (NLB)

Load balancers distribute incoming application traffic across a fleet of healthy targets (EC2 instances, containers, IP addresses):

- **Application Load Balancer (ALB) - Layer 7 (HTTP/HTTPS)**:
  - Inspects HTTP headers, cookies, query parameters, and URL paths.
  - **Path-based routing**: e.g., \`/api/*\` routes to API microservice target group; \`/images/*\` routes to static media service.
  - Supports SSL/TLS termination and WebSocket protocols.
- **Network Load Balancer (NLB) - Layer 4 (TCP/UDP/TLS)**:
  - Operates at the transport layer with ultra-high throughput and ultra-low latency (millions of requests per second).
  - Preserves client source IP without HTTP header modification; ideal for gaming, VoIP, and financial transactions.

---

## 4. Auto-Scaling Groups (ASG)

An **Auto-Scaling Group (ASG)** automatically adjusts the number of compute instances in response to changing traffic demands:

1. **Minimum Size**: Lowest number of instances the ASG will ever run (e.g., 2 instances for high availability across 2 AZs).
2. **Maximum Size**: Upper ceiling to prevent runaway cloud billing during DDoS attacks or bugs.
3. **Desired Capacity**: Target number of healthy instances currently provisioned.
4. **Scaling Policies**:
   - *Target Tracking*: Maintain average fleet CPU utilization at 65%.
   - *Step Scaling*: Add 2 instances if CPU exceeds 75%; add 4 instances if CPU exceeds 90%.
   - *Health Check Replacement*: If an instance fails the ALB health check, ASG automatically terminates it and launches a fresh instance.

---

## 5. Disaster Recovery Strategies (RPO vs RTO)

Two metrics govern business continuity planning:
- **RPO (Recovery Point Objective)**: Maximum acceptable period of data loss measured in time (e.g., if backup runs hourly, maximum RPO is 1 hour).
- **RTO (Recovery Time Objective)**: Maximum acceptable time to restore system operations after a disaster occurs.

\`\`\`text
Cost / Complexity Scale:
Backup & Restore  --->  Pilot Light  --->  Warm Standby  --->  Multi-Site Active-Active
(Highest RTO/RPO)                                            (Near-Zero RTO/RPO)
\`\`\``,
    mcqs: [
      {
        question: 'Which cloud storage type is best suited for hosting static media assets (such as user avatar PNGs and video files) accessible directly over HTTP REST APIs?',
        options: ['Block Storage (e.g. AWS EBS)', 'Object Storage (e.g. AWS S3)', 'File Storage (e.g. AWS EFS)', 'Ephemeral Swap Storage'],
        correctOption: 1
      },
      {
        question: 'What is the key advantage of Horizontal Scaling (Scale-Out) over Vertical Scaling (Scale-Up)?',
        options: [
          'Horizontal scaling allows scaling by adding commodity instances without physical hardware ceiling or service downtime',
          'Horizontal scaling requires only one large server, reducing software licenses',
          'Horizontal scaling eliminates the need for any Load Balancers',
          'Horizontal scaling only works for stateful monolithic applications'
        ],
        correctOption: 0
      },
      {
        question: 'An Application Load Balancer (ALB) operates at which OSI layer and enables which routing capability?',
        options: [
          'Layer 4 (Transport); routes based on destination TCP port only',
          'Layer 7 (Application); routes based on HTTP request paths, headers, and hostnames',
          'Layer 3 (Network); routes packets using BGP routing tables',
          'Layer 2 (Data Link); routes based on MAC addresses'
        ],
        correctOption: 1
      },
      {
        question: 'Which cloud storage option can be mounted simultaneously to dozens of Linux EC2 instances to provide a shared POSIX-compliant filesystem?',
        options: ['AWS Elastic Block Store (EBS) General Purpose gp3', 'AWS Elastic File System (EFS)', 'AWS S3 Glacier Deep Archive', 'Instance Store ephemeral disk'],
        correctOption: 1
      },
      {
        question: 'What does a Recovery Point Objective (RPO) of 15 minutes indicate in a disaster recovery plan?',
        options: [
          'The system must be fully restored and operational within 15 minutes of a failure',
          'The business can tolerate losing at most 15 minutes worth of transactional data in the event of a disaster',
          'The load balancer checks instance health every 15 minutes',
          'Datacenter cooling fans can stay off for 15 minutes'
        ],
        correctOption: 1
      },
      {
        question: 'How does an Auto-Scaling Group (ASG) handle an EC2 instance that repeatedly fails its Load Balancer HTTP health checks?',
        options: [
          'It reboots the instance repeatedly for 24 hours',
          'It automatically marks the instance unhealthy, terminates it, and provisions a replacement instance',
          'It disables the load balancer and routes all traffic to the unhealthy instance',
          'It sends an email to the customer without taking any automated remediation'
        ],
        correctOption: 1
      },
      {
        question: 'What is the standard durability rating advertised for Amazon S3 Standard object storage?',
        options: ['99.9%', '99.99%', '99.999999999% (11 Nines)', '100.000%'],
        correctOption: 2
      },
      {
        question: 'Which load balancer type is designed to handle millions of requests per second with ultra-low latency by operating at Layer 4 (Transport layer)?',
        options: ['Application Load Balancer (ALB)', 'Network Load Balancer (NLB)', 'Classic HTTP Proxy', 'API Gateway WebSocket route'],
        correctOption: 1
      },
      {
        question: 'Which Disaster Recovery (DR) strategy maintains a live, fully operational clone of the production environment running simultaneously in a second region with near-zero RTO and RPO?',
        options: ['Backup and Restore', 'Pilot Light', 'Warm Standby', 'Multi-Site Active-Active'],
        correctOption: 3
      },
      {
        question: 'Why are Block Storage volumes (like AWS EBS) mandatory for hosting relational database data directories (such as MySQL or PostgreSQL)?',
        options: [
          'Relational databases require low-latency, block-level read/write random access and consistent file locking',
          'Databases cannot run on SSD storage',
          'Object storage does not support storing numbers',
          'Block storage is completely free of cost'
        ],
        correctOption: 0
      }
    ]
  }
];

module.exports = cloudTrackModules;
