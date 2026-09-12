module.exports = [
  {
    "dayNumber": 2,
    "title": "Object-Oriented Programming (OOP) Core Principles & Design",
    "category": "OOP",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# Object-Oriented Programming (OOP) Core Principles & Design\n\nAccenture's Technical round focuses heavily on OOP principles, runtime dispatch mechanics, inheritance trade-offs, and SOLID architectural patterns.\n\n---\n\n## 1. The Four Fundamental OOP Pillars\n\n### A. Encapsulation\n- Bundling data (state) and methods (behavior) operating on that data into a single autonomous unit (class).\n- Enforces **Data Hiding** via access specifiers (`private`, `protected`, `public`).\n- Exposes access only through calibrated getters and setters with validation logic.\n\n### B. Abstraction\n- Hiding internal implementation complexities and exposing only essential interfaces to users.\n- Implemented via:\n  - **Abstract Classes**: Incomplete class templates containing abstract methods (at least one pure virtual function `virtual void func() = 0` in C++).\n  - **Interfaces**: Contracts establishing signatures without state or implementations (pre-Java 8).\n\n### C. Inheritance\n- Mechanism where a child class acquires attributes and behaviors from a parent class.\n- Promotes code reuse and establishes an **\"IS-A\"** relationship.\n- Types: Single, Multilevel, Hierarchical, Multiple (supported in C++, achieved via Interfaces in Java), Hybrid.\n- **Diamond Problem**: When class D inherits from B and C, both inheriting from A. Resolved in C++ using **`virtual` base classes**.\n\n### D. Polymorphism\nAbility of a message/call to take many forms.\n1. **Compile-Time (Static) Polymorphism**:\n   - Resolved during compilation. Fast, no runtime overhead.\n   - Examples: **Method Overloading** (same method name, different parameter types/count) and **Operator Overloading**.\n2. **Runtime (Dynamic) Polymorphism**:\n   - Resolved during execution via late binding.\n   - Example: **Method Overriding** (child class redefines a parent method with identical signature).\n   - Mechanism: Executed using a **Virtual Method Table (vtable)** and Virtual Table Pointer (**vptr**).\n\n---\n\n## 2. Dynamic Dispatch: How Vtable & Vptr Work\n\nWhen a class declares or inherits at least one `virtual` function:\n1. The compiler generates a static **vtable** containing function pointers for all virtual methods.\n2. An internal hidden pointer (**`vptr`**) is prepended to the object layout, pointing to its class's vtable.\n3. Invocation: `basePtr->render()` dereferences `vptr` at runtime to resolve the most-derived implementation.\n\n```text\nObject in RAM:\n+-------------------+\n|  vptr  (8 bytes)  | ----> [ VTable in Data Segment ]\n+-------------------+       | 0: &Derived::render()  |\n|  member variables |       +------------------------+\n+-------------------+\n```\n\n---\n\n## 3. Class Relationships: Association vs Aggregation vs Composition\n\n- **Association (\"Uses-A\")**: Generic relationship between independent objects (e.g., Doctor and Patient).\n- **Aggregation (\"Has-A\" - Weak)**: Whole-part relationship where parts survive without the whole (e.g., Department and Teachers; teachers still exist if department closes).\n- **Composition (\"Part-of\" - Strong)**: Whole-part relationship with strict ownership lifecycle (e.g., House and Rooms; destroying house destroys rooms).\n\n---\n\n## 4. SOLID Design Principles\n\n| Principle | Meaning | Violation Example | Solution |\n| :--- | :--- | :--- | :--- |\n| **S** - Single Responsibility | A class should have one, and only one, reason to change. | `User` class handles user data AND generates PDF reports AND sends emails. | Split into `User`, `PDFReportGenerator`, and `EmailService`. |\n| **O** - Open/Closed | Open for extension, closed for modification. | Modifying a central `switch(shapeType)` method to add a new shape. | Use a polymorphic `Shape` interface with `draw()` implemented in each subclass. |\n| **L** - Liskov Substitution | Subclasses must be substitutable for their base classes without breaking behavior. | A `Square` subclass of `Rectangle` throws errors when height and width change independently. | Separate hierarchy into independent abstractions or immutable shapes. |\n| **I** - Interface Segregation | Clients should not be forced to depend on methods they do not use. | A giant `Worker` interface with `code()`, `test()`, and `manageTeam()`. | Break into fine-grained interfaces: `Developer`, `Tester`, `Manager`. |\n| **D** - Dependency Inversion | High-level modules should depend on abstractions, not concrete implementations. | A `NotificationManager` directly instantiating `new TwilioSmsSender()`. | Pass a `MessageSender` interface into `NotificationManager` constructor. |",
    "mcqs": [
      {
        "question": "Which OOP principle is demonstrated when an internal private field balance is only updated through a deposit() method containing validation logic?",
        "options": [
          "Inheritance",
          "Encapsulation",
          "Polymorphism",
          "Composition"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the primary technical mechanism that enables runtime method overriding and dynamic binding in C++?",
        "options": [
          "Preprocessor macros",
          "Virtual Method Table (vtable) and virtual pointer (vptr)",
          "Template argument deduction",
          "Link-time static symbol substitution"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the \"Diamond Problem\" in object-oriented programming?",
        "options": [
          "A compilation error caused by circular dependency imports",
          "Ambiguity when a class inherits from two classes that both inherit from the same common base class",
          "Memory leak caused by unclosed recursive constructors",
          "An issue where an interface extends two abstract classes simultaneously"
        ],
        "correctOption": 1
      },
      {
        "question": "How does C++ prevent duplicate copies of base class members when resolving the Diamond Problem?",
        "options": [
          "Using friend functions",
          "Using virtual base inheritance (e.g. class B : virtual public A)",
          "By disallowing multiple inheritance",
          "Using static casting"
        ],
        "correctOption": 1
      },
      {
        "question": "Which of the following describes an Aggregation relationship between two classes?",
        "options": [
          "Strong ownership where child objects are destroyed when parent object is destroyed",
          "Weak \"Has-A\" relationship where child objects can exist independently of the parent container",
          "An \"IS-A\" inheritance relationship",
          "Compile-time method overloading"
        ],
        "correctOption": 1
      },
      {
        "question": "According to the Liskov Substitution Principle (LSP), which of the following must hold true?",
        "options": [
          "Subclasses must always contain fewer methods than base classes",
          "Objects of a superclass should be replaceable with objects of its subclasses without breaking program correctness",
          "Every class must implement an interface",
          "Inheritance hierarchies cannot exceed 3 levels"
        ],
        "correctOption": 1
      },
      {
        "question": "Why should the destructor of a base class almost always be declared as virtual if derived classes are deleted via a base pointer?",
        "options": [
          "To enable automatic memory pooling",
          "To ensure the derived class destructor executes first, preventing resource leaks of derived members",
          "To make the base class abstract",
          "To prevent derived classes from overriding methods"
        ],
        "correctOption": 1
      },
      {
        "question": "Which SOLID principle is violated if a class contains logic for business payroll calculation, database persistence, and sending Slack alerts?",
        "options": [
          "Single Responsibility Principle (SRP)",
          "Interface Segregation Principle (ISP)",
          "Open/Closed Principle (OCP)",
          "Liskov Substitution Principle (LSP)"
        ],
        "correctOption": 0
      },
      {
        "question": "What distinguishes compile-time method overloading from runtime method overriding?",
        "options": [
          "Overloading occurs in the same class with different parameters; overriding occurs in subclasses with identical signatures",
          "Overloading requires the virtual keyword; overriding does not",
          "Overloading uses a vtable; overriding is resolved statically",
          "Overriding can only change the return type"
        ],
        "correctOption": 0
      },
      {
        "question": "What constitutes a Pure Virtual Function in C++?",
        "options": [
          "A virtual function declared with \"= 0\" in its signature, making the declaring class abstract",
          "A function that cannot be overridden in derived classes",
          "A function defined inside a private namespace",
          "A method implemented with inline assembly"
        ],
        "correctOption": 0
      }
    ]
  },
  {
    "dayNumber": 3,
    "title": "DBMS: Relational Model, Keys & Normalization (1NF to BCNF)",
    "category": "DBMS",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# DBMS: Relational Model, Keys & Normalization (1NF to BCNF)\n\nAccenture's DBMS questions evaluate functional dependencies, closure sets, normal forms (1NF, 2NF, 3NF, BCNF), and anomaly detection.\n\n---\n\n## 1. Key Terminology in Relational Databases\n- **Super Key (SK)**: Any set of attributes that uniquely identifies a tuple in a relation.\n- **Candidate Key (CK)**: A **minimal Super Key** (no proper subset of it is a Super Key).\n- **Primary Key (PK)**: The chosen Candidate Key designated by the database designer. Cannot contain `NULL` values.\n- **Alternate Key**: Any Candidate Key not chosen as the Primary Key.\n- **Foreign Key (FK)**: An attribute in a table that references the Primary Key (or unique key) of another table, enforcing **Referential Integrity**.\n- **Prime Attribute**: An attribute that is a member of *any* Candidate Key.\n- **Non-Prime Attribute**: An attribute that is NOT part of any Candidate Key.\n\n---\n\n## 2. Functional Dependencies & Attribute Closure\nA functional dependency (X \rightarrow Y) states that if two tuples agree on attribute (X), they must agree on attribute (Y).\n- **Trivial FD**: If (Y subseteq X) (e.g. (AB \rightarrow A)). Always valid.\n- **Non-Trivial FD**: If (Y \notsubseteq X) (e.g. (\text{EmpID} \rightarrow \text{Salary})).\n\n### Algorithm to Compute Attribute Closure ((X^+))\n1. Initialize (\text{Closure} = X).\n2. For each FD (A \rightarrow B), if (A subseteq \text{Closure}), then (\text{Closure} = \text{Closure} cup B).\n3. Repeat step 2 until no new attributes can be added.\n4. If (X^+) contains **all attributes of the relation**, then (X) is a **Super Key**!\n\n---\n\n## 3. Database Anomalies Caused by Redundancy\n- **Insertion Anomaly**: Inability to record certain facts without recording other unrelated facts (e.g. cannot add a new department without first hiring an employee).\n- **Deletion Anomaly**: Unintended loss of data when deleting unrelated records (e.g. deleting the last employee in a department deletes the department itself).\n- **Update/Modification Anomaly**: Updating a fact in one tuple leaves duplicate records inconsistent if not all copies are altered.\n\n---\n\n## 4. Normal Forms Step-by-Step\n\n### A. First Normal Form (1NF)\n- **Rule**: Every attribute must hold **atomic (indivisible) values**.\n- Disallows repeating groups, multi-valued attributes (e.g. storing multiple phone numbers comma-separated in a single cell), or nested tables.\n\n### B. Second Normal Form (2NF)\n- **Rule**: Relation must be in **1NF** AND have **NO Partial Dependencies**.\n- *Partial Dependency*: When a non-prime attribute depends on a **proper subset** of a composite candidate key ((A \rightarrow B) where (A subset \text{CK}) and (B) is non-prime).\n- *Note*: If every Candidate Key consists of a single attribute, the table is **automatically in 2NF**!\n\n### C. Third Normal Form (3NF)\n- **Rule**: Relation must be in **2NF** AND have **NO Transitive Dependencies**.\n- Formally, for every non-trivial functional dependency (X \rightarrow Y):\n  1. (X) is a **Super Key**, OR\n  2. (Y) is a **Prime Attribute**.\n\n### D. Boyce-Codd Normal Form (BCNF / 3.5NF)\n- **Rule**: Stricter version of 3NF.\n- For every non-trivial functional dependency (X \rightarrow Y):\n  - (X) **MUST be a Super Key**! (No exceptions for prime attributes on the right-hand side).\n- **Trade-off**: Every BCNF decomposition is guaranteed to be Lossless, but it may **not always preserve functional dependencies**. 3NF always guarantees both lossless join and dependency preservation!",
    "mcqs": [
      {
        "question": "Which normal form eliminates partial dependencies where a non-prime attribute depends on a proper subset of a composite candidate key?",
        "options": [
          "1NF",
          "2NF",
          "3NF",
          "BCNF"
        ],
        "correctOption": 1
      },
      {
        "question": "If every candidate key in a relation contains only a single attribute, what normal form is the relation guaranteed to be in (assuming 1NF)?",
        "options": [
          "2NF",
          "3NF",
          "BCNF",
          "4NF"
        ],
        "correctOption": 0
      },
      {
        "question": "What is the formal requirement for every non-trivial functional dependency X -> Y to satisfy Boyce-Codd Normal Form (BCNF)?",
        "options": [
          "Y must be a prime attribute",
          "X must be a Super Key of the relation",
          "Both X and Y must be foreign keys",
          "The relation cannot contain more than 3 attributes"
        ],
        "correctOption": 1
      },
      {
        "question": "What type of database anomaly occurs when deleting a student record unintentionally erases the course offering details from the database?",
        "options": [
          "Insertion anomaly",
          "Deletion anomaly",
          "Update anomaly",
          "Concurrency deadlock"
        ],
        "correctOption": 1
      },
      {
        "question": "Given relation R(A, B, C, D) with FDs: {A -> B, B -> C, C -> D}. What is the attribute closure of A (A+)?",
        "options": [
          "{A, B}",
          "{A, B, C}",
          "{A, B, C, D}",
          "{A, D}"
        ],
        "correctOption": 2
      },
      {
        "question": "What is the definition of a Candidate Key in relational database theory?",
        "options": [
          "Any attribute that accepts NULL values",
          "A minimal Super Key such that no proper subset is a Super Key",
          "The largest set of attributes in a table",
          "A key that must reference another table"
        ],
        "correctOption": 1
      },
      {
        "question": "In 3NF, what condition allows a functional dependency X -> Y to be valid even if X is NOT a super key?",
        "options": [
          "X is a foreign key",
          "Y is a prime attribute (part of a candidate key)",
          "Y contains only numerical values",
          "X contains no NULL entries"
        ],
        "correctOption": 1
      },
      {
        "question": "What key guarantee does 3NF decomposition maintain that BCNF decomposition cannot always preserve?",
        "options": [
          "Lossless join",
          "Dependency preservation",
          "Zero redundancy",
          "Elimination of multi-valued attributes"
        ],
        "correctOption": 1
      },
      {
        "question": "Which of the following violates First Normal Form (1NF)?",
        "options": [
          "A table containing duplicate rows with identical primary keys",
          "A column storing multiple comma-separated phone numbers in a single record",
          "A table with composite candidate keys",
          "A column storing boolean values"
        ],
        "correctOption": 1
      },
      {
        "question": "What is an Alternate Key?",
        "options": [
          "A Foreign Key pointing to a surrogate key",
          "Any Candidate Key that was not chosen as the Primary Key",
          "A Super Key containing all attributes of a table",
          "An index created on non-unique columns"
        ],
        "correctOption": 1
      }
    ]
  },
  {
    "dayNumber": 4,
    "title": "Computer Networks: OSI 7-Layer Model & TCP/IP Protocol Stack",
    "category": "CN",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# Computer Networks: OSI 7-Layer Model & TCP/IP Protocol Stack\n\nAccenture assesses protocol encapsulation, layer responsibilities, PDU naming, TCP vs UDP tradeoffs, and flow control mechanisms.\n\n---\n\n## 1. OSI 7-Layer Reference Model vs TCP/IP\n\n| Layer # | OSI Layer | Primary Responsibility | Protocol Data Unit (PDU) | Protocols / Devices |\n| :---: | :--- | :--- | :--- | :--- |\n| **7** | **Application** | Network interface for end-user apps | Data | HTTP, HTTPS, FTP, DNS, SMTP, SSH |\n| **6** | **Presentation**| Data formatting, encryption, compression | Data | SSL/TLS, JPEG, ASCII, MPEG |\n| **5** | **Session** | Session setup, maintenance, checkpointing | Data | NetBIOS, RPC, PPTP |\n| **4** | **Transport** | End-to-end host process delivery, flow/error control | **Segment** (TCP) / **Datagram** (UDP) | TCP, UDP (Ports) |\n| **3** | **Network** | Logical addressing & best path routing across subnets | **Packet** | IP (IPv4/IPv6), ICMP, ARP, Routers |\n| **2** | **Data Link** | Node-to-node hop delivery, framing, physical addressing | **Frame** | Ethernet, MAC, Switches, Bridges |\n| **1** | **Physical** | Transmission of raw unstructured bit streams | **Bits** | Cables, Repeaters, Hubs, Modems |\n\n> **Mnemonic for OSI Layers (7 to 1):** **A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing.\n\n---\n\n## 2. TCP vs UDP Protocol Comparison\n\n| Feature | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |\n| :--- | :--- | :--- |\n| **Connection** | Connection-Oriented (3-way handshake required) | Connectionless (fire and forget) |\n| **Reliability** | Guaranteed delivery via ACKs & retransmissions | Best-effort; packets may be lost/duplicated |\n| **Ordering** | In-order delivery guaranteed by sequence numbers | No ordering guarantees |\n| **Header Size** | **20 - 60 Bytes** | **8 Bytes** fixed |\n| **Speed** | Slower (protocol overhead, windowing) | Extremely fast with minimal latency |\n| **Flow/Congestion** | Yes (Sliding window, Slow Start, AIMD) | None |\n| **Use Cases** | Web (HTTP/S), File Transfer (FTP), Email (SMTP) | DNS, VoIP, Video Streaming, Gaming |\n\n---\n\n## 3. Flow Control Mechanisms (Transport & Data Link)\nFlow control prevents a fast sender from overwhelming a slow receiver buffer:\n\n1. **Stop-and-Wait**:\n   - Sender transmits 1 frame and waits for ACK before sending the next.\n   - Low bandwidth utilization: (\text{Efficiency} = \frac{1}{1 + 2a}) where (a = \frac{T_{prop}}{T_{trans}}).\n2. **Go-Back-N (Sliding Window)**:\n   - Sender window size (W_s = 2^k - 1); Receiver window size (W_r = 1).\n   - If a frame is damaged or lost, the receiver discards all subsequent out-of-order frames. Sender retransmits the entire window of (N) frames!\n3. **Selective Repeat**:\n   - Sender window (W_s = 2^{k-1}); Receiver window (W_r = 2^{k-1}) ((W_s = W_r)).\n   - Receiver has buffer memory and accepts out-of-order frames. Sender only retransmits the single lost frame. Most bandwidth efficient.\n\n---\n\n## 4. Error Detection Methods\n- **Parity Check**: Single-bit parity detects odd number of bit errors; fails on even errors.\n- **Checksum**: One's complement sum of message segments; receiver inverts and checks for zero. Used in IP and TCP headers.\n- **CRC (Cyclic Redundancy Check)**: Uses polynomial division over GF(2). Highly robust against burst transmission errors. Standard in Ethernet.",
    "mcqs": [
      {
        "question": "What is the Protocol Data Unit (PDU) at the Transport Layer of the OSI Model when using TCP?",
        "options": [
          "Frame",
          "Packet",
          "Segment",
          "Bit"
        ],
        "correctOption": 2
      },
      {
        "question": "Which layer of the OSI model handles data encryption, decryption, compression, and character code translation (e.g. ASCII to Unicode)?",
        "options": [
          "Application Layer",
          "Presentation Layer",
          "Session Layer",
          "Transport Layer"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the standard fixed header size of a User Datagram Protocol (UDP) packet?",
        "options": [
          "8 Bytes",
          "20 Bytes",
          "32 Bytes",
          "40 Bytes"
        ],
        "correctOption": 0
      },
      {
        "question": "In a Go-Back-N sliding window protocol with a 3-bit sequence number, what is the maximum sender window size (Ws)?",
        "options": [
          "8",
          "7",
          "4",
          "16"
        ],
        "correctOption": 1
      },
      {
        "question": "Which error detection mechanism performs binary polynomial division and is implemented on Ethernet Data Link frames?",
        "options": [
          "Cyclic Redundancy Check (CRC)",
          "Single-bit Parity Check",
          "Two's Complement Checksum",
          "Hamming Distance"
        ],
        "correctOption": 0
      },
      {
        "question": "Why does DNS primarily utilize UDP port 53 for standard client lookups instead of TCP?",
        "options": [
          "UDP provides stronger cryptographic protection",
          "DNS requests fit within a single packet and UDP avoids the latency overhead of a 3-way connection handshake",
          "Routers block TCP on port 53",
          "UDP packets cannot be spoofed"
        ],
        "correctOption": 1
      },
      {
        "question": "At which OSI layer do network Routers make forwarding decisions based on logical IP addresses?",
        "options": [
          "Data Link Layer (Layer 2)",
          "Network Layer (Layer 3)",
          "Transport Layer (Layer 4)",
          "Session Layer (Layer 5)"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the receiver window size (Wr) in the Selective Repeat ARQ flow control protocol with m-bit sequence numbers?",
        "options": [
          "1",
          "2^(m-1)",
          "2^m - 1",
          "2^m"
        ],
        "correctOption": 1
      },
      {
        "question": "Which of the following protocols operates at the Application Layer of the OSI stack?",
        "options": [
          "ICMP",
          "ARP",
          "SMTP",
          "BGP"
        ],
        "correctOption": 2
      },
      {
        "question": "What protocol resolves an IP address into a corresponding physical MAC address on a local area network?",
        "options": [
          "DHCP",
          "ARP (Address Resolution Protocol)",
          "RARP",
          "DNS"
        ],
        "correctOption": 1
      }
    ]
  },
  {
    "dayNumber": 5,
    "title": "Operating Systems: Process Management, Threads & CPU Scheduling",
    "category": "OS",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# Operating Systems: Process Management, Threads & CPU Scheduling\n\nAccenture tests process lifecycle states, Process Control Blocks (PCB), user vs kernel threads, context switching overhead, and scheduling algorithms.\n\n---\n\n## 1. Process vs Thread\n- **Process**: A program in execution. Contains its own address space:\n  - **Text Section**: Compiled machine instructions.\n  - **Data Section**: Global and static variables.\n  - **Heap**: Dynamically allocated memory at runtime (`malloc` / `new`).\n  - **Stack**: Local variables, function parameters, return addresses.\n- **Thread**: A lightweight unit of CPU utilization within a process.\n  - Threads belonging to the same process share: **Code segment, Data segment, Open OS resources (files/sockets)**.\n  - Each thread maintains its own private: **Thread ID, Program Counter (PC), Register set, Stack**.\n\n---\n\n## 2. Process State Lifecycle\n```text\n  [NEW] ---> [READY] <=======> [RUNNING] ---> [TERMINATED]\n                ^                   |\n                |                   v\n                +---- [WAITING] <---+\n```\n1. **New**: Being created.\n2. **Ready**: Loaded into main memory, waiting to be allocated a CPU core by the dispatcher.\n3. **Running**: Instructions being executed by CPU.\n4. **Waiting / Blocked**: Waiting for an I/O event or signal.\n5. **Terminated**: Finished execution; OS reclaims resources.\n\n- **Process Control Block (PCB)**: OS data structure storing Process ID (PID), State, Program Counter, CPU registers, scheduling priority, and I/O status.\n\n---\n\n## 3. CPU Scheduling Metrics\n- **Arrival Time ((AT))**: Moment the process enters the Ready Queue.\n- **Burst Time ((BT))**: Total CPU execution time required.\n- **Completion Time ((CT))**: Moment execution terminates.\n- **Turnaround Time ((TAT))**: Total time spent from arrival to termination:\n  [\n  TAT = CT - AT\n  ]\n- **Waiting Time ((WT))**: Time spent waiting in the ready queue:\n  [\n  WT = TAT - BT\n  ]\n- **Response Time**: Time from arrival until the first time the process gets the CPU.\n\n---\n\n## 4. Scheduling Algorithms Overview\n\n### A. First-Come, First-Served (FCFS)\n- Non-preemptive. Simple FIFO queue.\n- **Convoy Effect**: When a long CPU-burst process arrives first, holding up many short I/O-bound processes, drastically degrading average waiting time.\n\n### B. Shortest Job First (SJF)\n- Assigns CPU to process with smallest Burst Time.\n- Provably optimal for minimizing average waiting time.\n- **Preemptive SJF (Shortest Remaining Time First - SRTF)**: If a new process arrives with a burst time less than the remaining time of current running process, CPU is preempted.\n- **Drawback**: Vulnerable to **Starvation** of long processes if shorter jobs continuously arrive.\n\n### C. Round Robin (RR)\n- Preemptive FCFS with a fixed **Time Quantum ((q))**.\n- Ready queue treated as a circular FIFO queue.\n- Quantum trade-off:\n  - If (q) is extremely large (\rightarrow) degenerates to **FCFS**.\n  - If (q) is extremely small (\rightarrow) high **context-switching overhead** dominates CPU utilization.\n\n### D. Priority Scheduling & Starvation\n- Processes assigned priority integer. CPU allocated to highest priority.\n- Problem: Low-priority jobs may wait indefinitely (**Indefinite Blocking / Starvation**).\n- **Solution - Aging**: Gradually increasing the priority of processes that wait in the system for a long time.",
    "mcqs": [
      {
        "question": "Which of the following resources is NOT shared among threads belonging to the same parent process?",
        "options": [
          "Address space and open file descriptors",
          "Global and static data variables",
          "Private execution Stack and CPU registers",
          "Heap memory allocations"
        ],
        "correctOption": 2
      },
      {
        "question": "What is the \"Convoy Effect\" in operating system CPU scheduling?",
        "options": [
          "Multiple threads deadlocking over shared semaphores",
          "A situation in FCFS where short processes wait prolonged periods behind a single heavy CPU-bound process",
          "Operating system kernel thrashing virtual memory",
          "A round-robin quantum set smaller than 1 millisecond"
        ],
        "correctOption": 1
      },
      {
        "question": "Which CPU scheduling algorithm is mathematically proven to produce the minimal average waiting time for a given set of stationary processes?",
        "options": [
          "Round Robin (RR)",
          "Shortest Job First (SJF)",
          "First-Come First-Served (FCFS)",
          "Multilevel Feedback Queue"
        ],
        "correctOption": 1
      },
      {
        "question": "What technique is utilized in priority scheduling systems to prevent starvation of low-priority processes?",
        "options": [
          "Belady's substitution",
          "Aging (gradually increasing priority of waiting processes over time)",
          "Decreasing time quantum",
          "Strict two-phase locking"
        ],
        "correctOption": 1
      },
      {
        "question": "What happens when the Round Robin scheduling time quantum is configured to be arbitrarily large?",
        "options": [
          "It degenerates into First-Come First-Served (FCFS)",
          "It causes processor thrashing",
          "It automatically converts to Shortest Remaining Time First",
          "Context switching overhead approaches 100%"
        ],
        "correctOption": 0
      },
      {
        "question": "If a process arrives at time AT = 2 and finishes execution at CT = 10 with a burst time BT = 5, what is its Waiting Time (WT)?",
        "options": [
          "8",
          "5",
          "3",
          "2"
        ],
        "correctOption": 2
      },
      {
        "question": "Where is the execution context (Program Counter, CPU registers, Process ID) of an interrupted process saved during a context switch?",
        "options": [
          "In the Translation Lookaside Buffer (TLB)",
          "In the Process Control Block (PCB)",
          "In the swap partition on disk",
          "In the L1 Instruction Cache"
        ],
        "correctOption": 1
      },
      {
        "question": "What process state transition occurs when a running process issues a blocking I/O request (such as reading a file from disk)?",
        "options": [
          "Running to Ready",
          "Running to Waiting (Blocked)",
          "Running to Terminated",
          "Waiting to Ready"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the preemptive version of Shortest Job First (SJF) scheduling commonly designated as?",
        "options": [
          "Round Robin (RR)",
          "Shortest Remaining Time First (SRTF)",
          "Highest Response Ratio Next (HRRN)",
          "Earliest Deadline First (EDF)"
        ],
        "correctOption": 1
      },
      {
        "question": "What formula correctly computes the Turnaround Time (TAT) of a process?",
        "options": [
          "TAT = Completion Time - Arrival Time",
          "TAT = Burst Time - Waiting Time",
          "TAT = Arrival Time + Waiting Time",
          "TAT = Completion Time - Burst Time"
        ],
        "correctOption": 0
      }
    ]
  },
  {
    "dayNumber": 6,
    "title": "DBMS: Transactions, Indexing & ACID Properties",
    "category": "DBMS",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# DBMS: Transactions, Indexing & ACID Properties\n\nAccenture's technical round frequently tests transaction serializability, concurrency anomalies, isolation levels, and B+ Tree indexing mechanics.\n\n---\n\n## 1. ACID Properties of Database Transactions\n- **Atomicity (\"All or Nothing\")**: Entire transaction completes successfully or rolls back completely. Managed by the **Recovery Manager (Write-Ahead Logging / WAL)**.\n- **Consistency**: Transaction transforms the database from one valid state to another, preserving all schema constraints.\n- **Isolation**: Concurrent transactions execute without interfering with one another. Managed by the **Concurrency Control Manager (Locking/Timestamping)**.\n- **Durability**: Once committed, updates persist permanently in storage even during power failures. Ensured by the **Log Manager and Redo logs**.\n\n---\n\n## 2. Concurrency Anomalies & Isolation Levels\n\n### Anomalies\n1. **Dirty Read (Write-Read Conflict)**: Transaction (T_2) reads uncommitted data written by (T_1). If (T_1) subsequently rolls back, (T_2) operated on bogus data.\n2. **Non-Repeatable Read (Read-Write Conflict)**: (T_1) reads a row. (T_2) updates that row and commits. (T_1) rereads the row and sees altered values.\n3. **Phantom Read**: (T_1) queries a range of rows. (T_2) inserts new rows satisfying the range and commits. (T_1) re-executes the query and sees new \"phantom\" rows.\n\n### SQL Isolation Levels Matrix\n\n| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read |\n| :--- | :---: | :---: | :---: |\n| **Read Uncommitted** | Allowed | Allowed | Allowed |\n| **Read Committed** | **Prevented** | Allowed | Allowed |\n| **Repeatable Read** | **Prevented** | **Prevented** | Allowed |\n| **Serializable** | **Prevented** | **Prevented** | **Prevented** |\n\n---\n\n## 3. Concurrency Control: Two-Phase Locking (2PL)\n- **Growing Phase**: Transaction may acquire locks (Shared or Exclusive) but cannot release any lock.\n- **Shrinking Phase**: Transaction may release locks but cannot acquire new ones.\n- **Strict 2PL**: Holds all **Exclusive (X) locks** until transaction commits/aborts. Prevents cascading rollbacks.\n- **Rigorous 2PL**: Holds **ALL locks (Shared and Exclusive)** until commit. Guarantees strict serializability.\n\n---\n\n## 4. Indexing: Clustered vs Non-Clustered & B+ Trees\n- **Clustered Index**:\n  - Dictates the **physical storage order** of table rows on disk.\n  - Can only have **ONE clustered index per table** (typically the Primary Key).\n- **Non-Clustered (Secondary) Index**:\n  - Stores index keys and pointers (row addresses / RID) pointing to physical data blocks.\n  - A table can have multiple non-clustered indexes.\n\n### Why B+ Trees are the Database Standard over B-Trees\n1. **Data Pointers Reside Only in Leaf Nodes**: Internal nodes store only search keys and child pointers, allowing massive fan-out and a very low tree height (typically 3 to 4 levels for millions of rows).\n2. **Linked Leaves**: All leaf nodes are linked sequentially via a **doubly-linked list**, providing lightning-fast (O(K)) range queries (`WHERE age BETWEEN 20 AND 30`).",
    "mcqs": [
      {
        "question": "Which database isolation level prevents both Dirty Reads and Non-Repeatable Reads, but may still permit Phantom Reads?",
        "options": [
          "Read Uncommitted",
          "Read Committed",
          "Repeatable Read",
          "Serializable"
        ],
        "correctOption": 2
      },
      {
        "question": "What occurs during a \"Dirty Read\" anomaly in a database management system?",
        "options": [
          "A transaction reads data written by an uncommitted concurrent transaction that subsequently rolls back",
          "Two transactions deadlock over the same index page",
          "A query returns different numbers of rows on repeated executions",
          "Data is corrupted due to hardware disk failures"
        ],
        "correctOption": 0
      },
      {
        "question": "Why can a relational database table have at most ONE clustered index?",
        "options": [
          "Database engines enforce a single index per schema rule",
          "A clustered index defines the actual physical storage order of the rows on disk, and data can only be sorted one way physically",
          "Clustered indexes cannot index integer columns",
          "B+ Trees do not support duplicate values"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the primary architectural advantage of B+ Trees over standard B-Trees for database indexing?",
        "options": [
          "B+ Trees store data records in all internal nodes to save memory",
          "B+ Trees store actual data only at the leaf level and connect leaf nodes with a linked list, enabling ultra-fast range scans",
          "B+ Trees operate without needing balance invariants",
          "B+ Trees require zero disk I/O operations"
        ],
        "correctOption": 1
      },
      {
        "question": "Which ACID property guarantees that database updates persist permanently in storage even if an immediate hardware crash or power outage occurs after commit?",
        "options": [
          "Atomicity",
          "Consistency",
          "Isolation",
          "Durability"
        ],
        "correctOption": 3
      },
      {
        "question": "In Two-Phase Locking (2PL), what characterizes the \"Shrinking Phase\"?",
        "options": [
          "The transaction acquires locks but cannot release any",
          "The transaction can release existing locks but is prohibited from acquiring any new locks",
          "The database dynamically decreases page allocation sizes",
          "Index depth is reduced"
        ],
        "correctOption": 1
      },
      {
        "question": "What database mechanism guarantees Atomicity and durability by writing log records to non-volatile disk before changes are flushed to table pages?",
        "options": [
          "Write-Ahead Logging (WAL)",
          "Dynamic Query Optimization",
          "Two-Phase Commit",
          "Snapshot Materialization"
        ],
        "correctOption": 0
      },
      {
        "question": "What problem is avoided by implementing Strict 2PL instead of basic 2PL?",
        "options": [
          "Deadlocks entirely",
          "Cascading rollbacks / aborts",
          "Phantom reads",
          "CPU context switches"
        ],
        "correctOption": 1
      },
      {
        "question": "What type of lock allows multiple concurrent transactions to read a data item simultaneously but prevents any transaction from modifying it?",
        "options": [
          "Exclusive Lock (X)",
          "Shared Lock (S)",
          "Intent Exclusive Lock (IX)",
          "Update Lock (U)"
        ],
        "correctOption": 1
      },
      {
        "question": "In a B+ tree of order m, what is the maximum number of children any internal node can possess?",
        "options": [
          "m",
          "m - 1",
          "m / 2",
          "2m"
        ],
        "correctOption": 0
      }
    ]
  },
  {
    "dayNumber": 7,
    "title": "Computer Networks: Protocols, DNS & Web Security (SSL/TLS)",
    "category": "CN",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# Computer Networks: Protocols, DNS & Web Security (SSL/TLS)\n\nAccenture tests TCP handshake steps, termination sequences, congestion control phases, hierarchical DNS resolution, and SSL/TLS asymmetric/symmetric encryption.\n\n---\n\n## 1. TCP Connection Lifecycle\n\n### A. 3-Way Handshake (Connection Establishment)\n```text\nClient                                Server\n  | -------- SYN (seq = x) ----------> |  (Server enters SYN_RCVD)\n  | <--- SYN-ACK (seq = y, ack = x+1)- |  (Client enters ESTABLISHED)\n  | -------- ACK (ack = y+1) --------->|  (Server enters ESTABLISHED)\n```\n1. **SYN**: Client picks an initial sequence number (`x`) and requests connection.\n2. **SYN-ACK**: Server acknowledges `x+1` and sends its own initial sequence number (`y`).\n3. **ACK**: Client acknowledges `y+1`. Data transmission can begin.\n\n### B. 4-Way Handshake (Connection Termination)\n```text\nClient                                Server\n  | -------- FIN (seq = u) ----------> |\n  | <------- ACK (ack = u+1) --------- |  (Server may still send pending data)\n  | <------- FIN (seq = v) ----------- |\n  | -------- ACK (ack = v+1) --------->|  (Client enters TIME_WAIT)\n```\n- **TIME_WAIT State (2 * MSL)**: Client waits (typically 1–2 minutes) to ensure server received the final ACK and to prevent stale duplicate packets from interfering with future connections.\n\n---\n\n## 2. TCP Congestion Control\nOperates using the **Congestion Window ((CWND))**:\n\n1. **Slow Start**:\n   - Starts with (CWND = 1 \text{ MSS}).\n   - Doubles exponentially every Round Trip Time (RTT): (1 \rightarrow 2 \rightarrow 4 \rightarrow 8 dots) until reaching **Slow Start Threshold ((ssthresh))**.\n2. **Congestion Avoidance**:\n   - After (CWND ge ssthresh), window grows **linearly**: (CWND = CWND + 1 \text{ MSS}) per RTT (Additive Increase).\n3. **Congestion Event**:\n   - **Triple Duplicate ACKs**: Fast Retransmit triggers. (ssthresh = CWND / 2); enters Fast Recovery.\n   - **Timeout (Severe)**: (ssthresh = CWND / 2); resets (CWND = 1 \text{ MSS}); restarts Slow Start! (Multiplicative Decrease).\n\n---\n\n## 3. Domain Name System (DNS) Hierarchical Resolution\nDNS converts human-readable domain names (`accenture.com`) into 32-bit/128-bit IP addresses:\n1. **Browser / OS Cache**: Checked first.\n2. **Recursive Resolver (ISP / 8.8.8.8)**: Handles resolution on behalf of client.\n3. **Root DNS Servers (`.`)**: 13 root server clusters globally; directs query to TLD servers.\n4. **Top-Level Domain (TLD) Servers (`.com`, `.in`)**: Directs query to the authoritative server.\n5. **Authoritative DNS Server**: Has the actual zone file record. Returns the **A Record** (IPv4) or **AAAA Record** (IPv6).\n\n### Common DNS Record Types\n- **A**: Maps hostname to IPv4 address.\n- **AAAA**: Maps hostname to IPv6 address.\n- **CNAME**: Canonical name (alias for another domain).\n- **MX**: Mail exchange server for domain.\n\n---\n\n## 4. Web Security: SSL/TLS Handshake\nHTTPS operates over **Port 443** (combines HTTP with TLS encryption):\n1. **ClientHello**: Client sends supported cipher suites and a random number ((R_C)).\n2. **ServerHello**: Server responds with chosen cipher suite, its own random number ((R_S)), and its **Digital Certificate** (signed by a trusted Certificate Authority / CA).\n3. **Authentication**: Client validates CA signature on certificate and extracts server's **Public Key**.\n4. **Key Exchange**:\n   - Client generates a **Pre-Master Secret**, encrypts it using server's Public Key, and transmits it.\n   - Server decrypts it using its secret **Private Key** (Asymmetric Encryption).\n5. **Symmetric Session Key**: Both parties derive identical **Symmetric Session Keys** (AES-256) from the pre-master secret.\n6. **Bulk Data Transfer**: All subsequent application data is encrypted using high-speed **Symmetric Encryption**.",
    "mcqs": [
      {
        "question": "During the TCP 3-Way Handshake, what sequence number does the server acknowledge when responding to a client SYN with sequence number x?",
        "options": [
          "x",
          "x + 1",
          "x - 1",
          "0"
        ],
        "correctOption": 1
      },
      {
        "question": "Why does the client endpoint enter the TIME_WAIT state after sending the final ACK in a TCP connection termination sequence?",
        "options": [
          "To flush CPU L2 cache lines",
          "To ensure the server received the final ACK and allow lingering duplicate network packets to expire safely",
          "To negotiate a new SSL session ticket",
          "To prevent SYN flood attacks"
        ],
        "correctOption": 1
      },
      {
        "question": "What growth rate does the TCP Congestion Window (CWND) exhibit during the Slow Start phase?",
        "options": [
          "Linear (increments by 1 MSS per RTT)",
          "Exponential (doubles every RTT)",
          "Logarithmic",
          "Quadratic"
        ],
        "correctOption": 1
      },
      {
        "question": "Which DNS record type maps an alias domain name to another canonical domain name?",
        "options": [
          "A Record",
          "MX Record",
          "CNAME Record",
          "PTR Record"
        ],
        "correctOption": 2
      },
      {
        "question": "In the SSL/TLS protocol, why is Asymmetric encryption used only during the initial handshake, while Symmetric encryption is used for subsequent data transfer?",
        "options": [
          "Asymmetric encryption is mathematically incapable of encrypting HTTP payloads",
          "Asymmetric encryption is computationally expensive; symmetric encryption is orders of magnitude faster for high-throughput data transfer",
          "Symmetric keys cannot be shared over public networks",
          "Certificate Authorities prohibit symmetric handshakes"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the standard port used for secure HTTPS web traffic?",
        "options": [
          "80",
          "8080",
          "443",
          "22"
        ],
        "correctOption": 2
      },
      {
        "question": "What occurs when a TCP connection experiences a packet loss detected by a retransmission Timeout?",
        "options": [
          "CWND resets to 1 MSS and the connection drops back to Slow Start",
          "CWND remains constant and enters Fast Recovery",
          "The connection switches immediately to UDP",
          "The socket buffer size is doubled"
        ],
        "correctOption": 0
      },
      {
        "question": "Which DNS server is queried first by a recursive resolver when resolving an unknown domain name from scratch?",
        "options": [
          "Authoritative Name Server",
          "Top-Level Domain (TLD) Server",
          "Root Name Server",
          "ISP Gateway Router"
        ],
        "correctOption": 2
      },
      {
        "question": "What does a digital certificate signed by a trusted Certificate Authority (CA) guarantee to a web browser?",
        "options": [
          "The server is immune to SQL injections",
          "The public key belongs genuinely to the authenticated domain owner",
          "The web server runs on Linux",
          "Network bandwidth is at least 1 Gbps"
        ],
        "correctOption": 1
      },
      {
        "question": "What TCP flag is used to abruptly reject or reset an invalid or unrequested connection attempt?",
        "options": [
          "SYN",
          "FIN",
          "RST",
          "PSH"
        ],
        "correctOption": 2
      }
    ]
  },
  {
    "dayNumber": 8,
    "title": "Operating Systems: Deadlocks, Banker's Algorithm & Virtual Memory",
    "category": "OS",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# Operating Systems: Deadlocks, Banker's Algorithm & Virtual Memory\n\nAccenture's OS assessment tests Coffman's 4 deadlock conditions, Banker's Safety Algorithm, Paging mechanics, TLB hit ratio calculations, page replacement algorithms, and Belady's Anomaly.\n\n---\n\n## 1. Deadlocks: The Four Coffman Conditions\nA deadlock occurs when a set of processes are blocked because each process holds a resource and waits for another resource held by some other process in the set.\n**All 4 conditions must hold simultaneously for a deadlock to exist**:\n1. **Mutual Exclusion**: At least one resource must be held in a non-shareable mode.\n2. **Hold and Wait**: A process must currently hold at least one resource and be waiting to acquire additional resources held by other processes.\n3. **No Preemption**: Resources cannot be forcibly confiscated; they can only be released voluntarily by the holding process.\n4. **Circular Wait**: A closed chain of processes exists: (P_0) waits for (P_1), (P_1) waits for (P_2 dots P_n) waits for (P_0).\n\n---\n\n## 2. Deadlock Handling Strategies\n- **Deadlock Ignorance (Ostrich Algorithm)**: Stick head in the sand; assume deadlocks never occur (default in Windows/Linux due to low frequency and high prevention overhead).\n- **Deadlock Prevention**: Invalidate at least **one of the 4 Coffman conditions** (e.g. impose total ordering on all resources to prevent Circular Wait).\n- **Deadlock Avoidance (Banker's Algorithm)**: Dynamically checks resource allocation state to ensure the system remains in a **Safe State**.\n\n### Banker's Safety Algorithm\n- Vectors: (\text{Available}[m])\n- Matrices: (\text{Max}[n \times m]), (\text{Allocation}[n \times m]), (\text{Need}[n \times m])\n- Formula:\n  [\n  \text{Need}[i][j] = \text{Max}[i][j] - \text{Allocation}[i][j]\n  ]\n- System is in a **Safe State** if there exists at least one execution sequence (langle P_1, P_2, dots, P_n \rangle) such that for each (P_i), its maximum need can be satisfied by the currently available resources plus the resources released by earlier processes.\n\n---\n\n## 3. Virtual Memory & Paging Mechanics\n- **Paging**: Memory management scheme eliminating the need for contiguous allocation of physical memory.\n  - Logical address space divided into fixed-size blocks called **Pages**.\n  - Physical memory (RAM) divided into identical fixed-size blocks called **Frames**.\n- **Logical Address Structure**: (\text{Logical Address} = langle p, d \rangle)\n  - (p): Page number (used as index into the Page Table).\n  - (d): Page offset within the page.\n- **Translation Lookaside Buffer (TLB)**: High-speed associative hardware cache storing recently translated Page (\rightarrow) Frame mappings.\n- **Effective Memory Access Time (EMAT)**:\n  [\n  \text{EMAT} = h \times (t_{TLB} + t_{RAM}) + (1 - h) \times (t_{TLB} + 2 \times t_{RAM})\n  ]\n  where (h) is the TLB hit ratio.\n\n---\n\n## 4. Page Replacement Algorithms & Belady's Anomaly\n\n1. **FIFO (First-In, First-Out)**:\n   - Replaces the oldest page loaded in memory.\n   - **Belady's Anomaly**: Phenomenon where increasing the number of physical page frames results in an **INCREASE in page faults**! (Affects FIFO).\n2. **Optimal Page Replacement (OPT / MIN)**:\n   - Replaces the page that will not be used for the longest period of time in the future.\n   - Provably optimal lowest page fault rate. Impossible to implement in general-purpose OS because future memory references cannot be known in advance.\n3. **Least Recently Used (LRU)**:\n   - Replaces the page that has not been referenced for the longest period of time in the past.\n   - Stack-based algorithm (\rightarrow) **immune to Belady's Anomaly**.\n\n### Thrashing\nWhen a system spends more time swapping pages between RAM and disk than executing user instructions. Occurs when (sum \text{Working Set Sizes} > \text{Total RAM}). Resolved by reducing the degree of multiprogramming.",
    "mcqs": [
      {
        "question": "Which of the following is NOT one of Coffman's four necessary conditions for a deadlock to occur?",
        "options": [
          "Mutual Exclusion",
          "Hold and Wait",
          "Preemptive Resource Allocation",
          "Circular Wait"
        ],
        "correctOption": 2
      },
      {
        "question": "What is Belady's Anomaly in operating systems virtual memory management?",
        "options": [
          "A page fault rate that drops to zero unexpectedly",
          "A phenomenon where allocating more page frames to a process leads to an increase in page faults under FIFO replacement",
          "A memory leak caused by unreferenced heap pointers",
          "TLB cache misses exceeding 99%"
        ],
        "correctOption": 1
      },
      {
        "question": "Which page replacement algorithm is mathematically immune to Belady's Anomaly?",
        "options": [
          "FIFO",
          "Least Recently Used (LRU)",
          "Second-Chance (Clock)",
          "Random Replacement"
        ],
        "correctOption": 1
      },
      {
        "question": "In Banker's Algorithm, how is the Need matrix calculated for process Pi and resource Rj?",
        "options": [
          "Need = Max + Allocation",
          "Need = Max - Allocation",
          "Need = Allocation - Available",
          "Need = Max - Available"
        ],
        "correctOption": 1
      },
      {
        "question": "What condition causes Operating System Thrashing?",
        "options": [
          "The CPU clock speed is throttled due to overheating",
          "Excessive paging where total working set sizes exceed physical RAM, causing processes to spend more time swapping than executing",
          "Deadlock between disk controller and network card",
          "A recursive function overflowing the user stack"
        ],
        "correctOption": 1
      },
      {
        "question": "If the TLB search time is 10 ns, main memory access time is 100 ns, and the TLB hit ratio is 90%, what is the Effective Memory Access Time (EMAT) assuming single-level paging?",
        "options": [
          "110 ns",
          "120 ns",
          "100 ns",
          "130 ns"
        ],
        "correctOption": 1
      },
      {
        "question": "How can the Circular Wait condition be effectively prevented in an operating system?",
        "options": [
          "By imposing a strict global linear ordering on all resources and requiring processes to request resources in ascending order",
          "By banning multithreading",
          "By using virtual memory instead of physical RAM",
          "By doubling the time quantum"
        ],
        "correctOption": 0
      },
      {
        "question": "What is the purpose of the Translation Lookaside Buffer (TLB)?",
        "options": [
          "A disk swap partition cache",
          "A fast hardware cache that stores recent virtual page to physical frame number translations",
          "A buffer for network packets",
          "A queue for CPU ready processes"
        ],
        "correctOption": 1
      },
      {
        "question": "What constitutes a Safe State in deadlock avoidance theory?",
        "options": [
          "A state where no process holds any resources",
          "A state where there exists at least one sequential ordering of processes that allows every process to complete without deadlocking",
          "A state where deadlocks are ignored",
          "A state where all processes run in kernel space"
        ],
        "correctOption": 1
      },
      {
        "question": "Why is the Optimal Page Replacement algorithm not used in real-world general-purpose operating systems?",
        "options": [
          "It suffers from Belady's Anomaly",
          "It requires exact future knowledge of page reference strings, which cannot be predicted in advance",
          "It requires hardware registers for every byte of RAM",
          "It is slower than FIFO on all workloads"
        ],
        "correctOption": 1
      }
    ]
  }
];
