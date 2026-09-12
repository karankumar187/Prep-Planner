/**
 * Comprehensive Network Security Track for Accenture AEH Technical Assessment
 * 3 Modules across Days 3, 6, and 9
 * Each module features in-depth Markdown notes + exactly 10 rigorous MCQs.
 */

const networkSecurityModules = [
  // ==================== DAY 3: CRYPTOGRAPHY & SECURE PROTOCOLS ====================
  {
    dayNumber: 3,
    title: 'Network Security Fundamentals: Cryptography (AES vs RSA), Hashing (SHA-256) & SSL/TLS Handshake',
    category: 'Network Security',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 70,
    readingContent: `# Network Security Fundamentals: Cryptography, Hashing & SSL/TLS

Information security is built on the **CIA Triad** (Confidentiality, Integrity, Availability). In Accenture's technical assessment, cryptography questions test key exchange algorithms, mathematical distinction between symmetric and asymmetric ciphers, cryptographic hashing, and the exact packet sequence of the **SSL/TLS Handshake**.

---

## 1. The Core Security Principles: CIA Triad

1. **Confidentiality**: Ensuring data is accessible solely to authorized entities. Enforced via **Encryption**.
2. **Integrity**: Guaranteeing data is not tampered with, altered, or corrupted in transit. Enforced via **Cryptographic Hashes & Digital Signatures**.
3. **Availability**: Guaranteeing authorized users have timely, dependable access to services. Defended via **Redundancy, Anti-DDoS, and Load Balancing**.
4. **Non-Repudiation**: Preventing a sender from denying they transmitted a message (achieved via **Asymmetric Digital Signatures**).

---

## 2. Encryption vs Hashing vs Encoding

This distinction is tested in almost every corporate OA:

| Technique | Purpose | Key Required? | Reversible? | Primary Algorithms / Standards |
| :--- | :--- | :--- | :--- | :--- |
| **Encryption** | Protect data confidentiality | Yes (Secret key or Key-pair) | **Yes** (Decryption returns original plaintext) | AES-256, RSA-2048, ChaCha20, DES/3DES (deprecated) |
| **Hashing** | Verify data integrity | No | **No** (One-way mathematical trapdoor function) | SHA-256, SHA-3, MD5 (insecure), SHA-1 (broken) |
| **Encoding** | Transform format for safe data transport | No | **Yes** (Anyone can decode without any secret) | Base64, ASCII, URL Encoding, Hexadecimal |

> **Hashing Rule:** A small change in input completely changes the output hash. This is called the **Avalanche Effect**.
> Salting passwords (\`hash(password + random_salt)\`) thwarts pre-computed **Rainbow Table** attacks.

---

## 3. Symmetric vs Asymmetric Encryption

\`\`\`text
Symmetric Encryption (Single Secret Key)
  [Plaintext] ---> (Encrypt with Key K) ---> [Ciphertext] ---> (Decrypt with Key K) ---> [Plaintext]

Asymmetric Encryption (Public + Private Key Pair)
  [Plaintext] ---> (Encrypt with Bob's Public Key) ---> [Ciphertext] ---> (Decrypt with Bob's Private Key) ---> [Plaintext]
\`\`\`

### Detailed Comparison Table

| Attribute | Symmetric Encryption | Asymmetric Encryption (Public Key) |
| :--- | :--- | :--- |
| **Keys Used** | Single shared secret key for both encryption and decryption | Key Pair: **Public Key** (distributed freely) and **Private Key** (kept strictly secret) |
| **Computation Speed** | Extremely fast (hardware-accelerated via AES-NI instructions) | Computationally heavy (100x to 1000x slower due to large prime factor modular arithmetic) |
| **Key Distribution Problem** | High risk: How to securely share the secret key over an untrusted network? | Solved: Public key can be sent openly over public channels |
| **Key Length Standard** | AES-128, AES-192, AES-256 | RSA-2048, RSA-4096, ECC (Elliptic Curve 256-bit) |
| **Primary Use Case** | Bulk data encryption (hard drives, TLS payload session data) | Key exchange, digital signatures, identity authentication |

---

## 4. Digital Signatures & Public Key Infrastructure (PKI)

How does a receiver verify the sender's true identity?

\`\`\`text
Alice Signs Message:
  [Message] ---> [Hash SHA-256] ---> [Encrypt with Alice's Private Key] ---> [Digital Signature]

Bob Verifies Signature:
  [Decrypt Signature with Alice's Public Key] === [Calculate Hash of received Message]
  If matches -> 1. Alice undeniably sent it (Authenticity) & 2. Message was not altered (Integrity)
\`\`\`

- **Digital Certificate (X.509)**: Binds an entity's identity (domain name, organization) to their public key.
- **Certificate Authority (CA)**: A trusted third party (e.g., DigiCert, Let's Encrypt) that signs digital certificates. Browsers trust root CAs pre-installed in the OS trust store.

---

## 5. The SSL/TLS 1.2 & 1.3 Handshake Protocol

When a client navigates to \`https://example.com\`, the TLS handshake establishes a secure, encrypted tunnel:

\`\`\`text
Client                                                   Server
  |                                                        |
  |  1. ClientHello (TLS version, Cipher Suites, Random C) |
  | -----------------------------------------------------> |
  |                                                        |
  |  2. ServerHello (Selected Cipher Suite, Random S)      |
  |  3. Server Certificate (X.509 Certificate with PubKey) |
  |  4. ServerKeyExchange (Diffie-Hellman parameters)      |
  |  5. ServerHelloDone                                    |
  | <----------------------------------------------------- |
  |                                                        |
  |  6. ClientKeyExchange (Pre-Master Secret / DH params)  |
  |  7. ChangeCipherSpec                                   |
  |  8. Client Finished (Encrypted Handshake verification) |
  | -----------------------------------------------------> |
  |                                                        |
  |  9. ChangeCipherSpec                                   |
  | 10. Server Finished (Encrypted Handshake verification) |
  | <----------------------------------------------------- |
  |                                                        |
  | <======== [Secure Encrypted Symmetric Session AES] ===> |
\`\`\`

- **Hybrid Encryption**: TLS uses **asymmetric cryptography** during the handshake to authenticate the server and securely agree on a shared secret. Once agreed, it switches to **symmetric AES encryption** for fast bulk data transmission.`,
    mcqs: [
      {
        question: 'What is the primary operational difference between symmetric and asymmetric encryption algorithms?',
        options: [
          'Symmetric encryption uses one shared secret key for both encryption and decryption; asymmetric uses a public/private key pair',
          'Symmetric encryption can only be used on text files; asymmetric encryption works on binary files',
          'Asymmetric encryption is 1000 times faster than symmetric encryption for bulk streaming data',
          'Symmetric encryption is an irreversible one-way mathematical function'
        ],
        correctOption: 0
      },
      {
        question: 'Why is Base64 encoding NOT considered an encryption mechanism?',
        options: [
          'It is only supported on Linux operating systems',
          'It requires no secret key and can be trivially reversed by anyone back into the original data',
          'It converts binary data into hexadecimal rather than ASCII',
          'It changes the underlying data integrity unpredictably'
        ],
        correctOption: 1
      },
      {
        question: 'When creating a Digital Signature to prove message authenticity and non-repudiation, the sender encrypts the message hash using their own:',
        options: ['Public Key', 'Private Key', 'Symmetric Session Key', 'Certificate Authority Root Key'],
        correctOption: 1
      },
      {
        question: 'In the SSL/TLS Handshake protocol, why does the connection switch to symmetric encryption (such as AES) after the handshake concludes?',
        options: [
          'Because asymmetric encryption cannot encrypt HTTP traffic',
          'Symmetric encryption is computationally much faster and efficient for bulk data streaming compared to asymmetric ciphers',
          'To allow third-party routers to inspect packet payloads',
          'Because asymmetric keys expire after 30 seconds'
        ],
        correctOption: 1
      },
      {
        question: 'What security technique is used when storing passwords to protect against pre-computed Rainbow Table dictionary attacks?',
        options: ['Base64 encoding', 'Salting with a unique cryptographic random string before hashing', 'Converting the password to lower case', 'Symmetric XOR shifting'],
        correctOption: 1
      },
      {
        question: 'Which of the following algorithms is an asymmetric public-key cryptographic cipher?',
        options: ['AES-256', 'DES', 'RSA', 'ChaCha20'],
        correctOption: 2
      },
      {
        question: 'What is the property called where a change in a single bit of the input text produces an unpredictable, drastic change in the resulting hash digest?',
        options: ['Avalanche Effect', 'Diffie-Hellman Expansion', 'Symmetric Cascade', 'Collision Entropy'],
        correctOption: 0
      },
      {
        question: 'Which component of an X.509 digital certificate enables client web browsers to trust the legitimacy of an HTTPS website?',
        options: [
          'The customer\'s local Windows user account credentials',
          'A cryptographic digital signature signed by a trusted Certificate Authority (CA)',
          'The website owner\'s secret private key',
          'The router\'s default gateway MAC address'
        ],
        correctOption: 1
      },
      {
        question: 'Which of the following hash functions is mathematically compromised and considered cryptographically INSECURE for modern security applications?',
        options: ['SHA-256', 'SHA-3', 'MD5', 'BLAKE3'],
        correctOption: 2
      },
      {
        question: 'The Diffie-Hellman (DH) algorithm is specifically designed to perform which critical cryptographic task?',
        options: [
          'Encrypting hard drive partitions at rest',
          'Securely establishing a shared secret key between two parties over an unencrypted public channel',
          'Compressing video streams before transmission',
          'Generating randomized alphanumeric passwords'
        ],
        correctOption: 1
      }
    ]
  },

  // ==================== DAY 6: NETWORK ATTACKS & WEB VULNERABILITIES ====================
  {
    dayNumber: 6,
    title: 'Network Attacks & Web Vulnerabilities: DDoS/DoS, MitM, ARP/DNS Spoofing, SQL Injection, XSS & CSRF',
    category: 'Network Security',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 70,
    readingContent: `# Network Attacks & Web Application Vulnerabilities

Accenture's technical assessment tests network attack vectors at both the infrastructure level (Layer 3/4) and web application layer (Layer 7). Understanding how attacks operate—and their exact software remediations—is vital.

---

## 1. Denial of Service: DoS vs Distributed DoS (DDoS)

- **DoS (Denial of Service)**: A single attacking machine overwhelms target system resources (CPU, RAM, network bandwidth) to render services unavailable to legitimate users.
- **DDoS (Distributed Denial of Service)**: The attacker harnesses a **Botnet** (thousands of infected zombie IoT devices or compromised servers coordinated via Command & Control servers) to flood the target simultaneously.

### Common DDoS Attack Variants

| Attack Type | OSI Layer | Mechanism | Mitigation |
| :--- | :---: | :--- | :--- |
| **SYN Flood** | Layer 4 (Transport) | Exploits TCP 3-Way Handshake. Attacker sends flood of \`TCP SYN\` packets with spoofed source IPs; server allocates TCB memory and waits with \`SYN-ACK\`, exhausting the connection backlog queue. | **SYN Cookies**, Reducing SYN-RECEIVED timeout, Anycast routing. |
| **UDP Amplification** | Layer 4 (Transport) | Attacker sends small DNS or NTP requests with spoofed victim source IP to open reflection servers; servers reply with massive response payloads (50x larger) directed at the victim. | Disabling open recursive resolvers, egress source IP verification (BCP 38). |
| **HTTP Flood** | Layer 7 (Application) | High volume of seemingly legitimate \`HTTP GET\` or \`POST\` requests targeting expensive database queries (e.g., search endpoints). | Web Application Firewall (WAF), Cloudflare / AWS Shield, Rate Limiting, CAPTCHA. |

---

## 2. Eavesdropping & Interception: Man-in-the-Middle (MitM)

In a **MitM attack**, the attacker secretly intercepts and relays communications between two parties who believe they are communicating directly.

\`\`\`text
Victim (Alice) <======== [Unencrypted Link] ========> Attacker (Eve) <========> Legitimate Bank Server
Alice sends: "Transfer $100"                       Eve alters: "Transfer $10,000"
\`\`\`

### Common MitM Vectors
- **ARP Spoofing / Poisoning**: On a local LAN (Layer 2), attacker broadcasts falsified ARP messages linking their own MAC address with the IP address of the default gateway. All LAN traffic routes through the attacker's NIC.
  - *Remediation*: Dynamic ARP Inspection (DAI), Static ARP tables.
- **DNS Spoofing / Cache Poisoning**: Attacker injects fraudulent DNS records into a recursive resolver's cache, redirecting users navigating to \`bank.com\` to a malicious phishing server IP.
  - *Remediation*: DNSSEC (DNS Security Extensions).
- **Rogue Wi-Fi Hotspot ("Evil Twin")**: An open, unencrypted Wi-Fi access point broadcasting a familiar SSID (e.g., "Airport_Free_WiFi") to sniff unencrypted HTTP traffic.
  - *Remediation*: Strict HTTPS, VPN usage.

---

## 3. Web Application Attacks (OWASP Top 10)

Accenture OA frequently presents code snippets or scenarios testing vulnerabilities and remediations:

### A. SQL Injection (SQLi)
- **Vulnerability**: Attacker injects malicious SQL syntax via unvalidated user inputs (form fields, URL parameters).
- **Example**:
\`\`\`sql
-- Vulnerable Code:
query = "SELECT * FROM users WHERE username = '" + userInput + "' AND password = '" + pass + "'";

-- Attacker enters username: ' OR '1'='1' --
-- Executed Query:
SELECT * FROM users WHERE username = '' OR '1'='1' --' AND password = ''
\`\`\`
- **Remediation**:
  1. **Prepared Statements / Parameterized Queries** (mandatory):
     \`\`\`java
     PreparedStatement pstmt = conn.prepareStatement("SELECT * FROM users WHERE username = ? AND password = ?");
     pstmt.setString(1, username);
     pstmt.setString(2, password);
     \`\`\`
  2. Use Object-Relational Mappings (ORM) with parameterized bindings.

### B. Cross-Site Scripting (XSS)
- **Vulnerability**: Malicious JavaScript is injected into trusted websites and executed in the victim's web browser.
- **Types**:
  - *Stored XSS*: Injected script permanently saved in database (e.g., comment forum); executed whenever users load the page.
  - *Reflected XSS*: Script embedded into a link query parameter and reflected off the web server immediately.
  - *DOM-based XSS*: Vulnerability exists purely in client-side JavaScript modifying the DOM without sanitization.
- **Remediation**: Context-aware HTML entity encoding, Content Security Policy (CSP), \`HttpOnly\` flag on session cookies (prevents \`document.cookie\` theft via JS).

### C. Cross-Site Request Forgery (CSRF)
- **Vulnerability**: Forces an authenticated victim to transmit unauthorized HTTP requests (e.g., money transfer, password change) to a web application where they are currently logged in.
- **Remediation**: Synchronizer Anti-CSRF Tokens (cryptographic unpredictable token validated on each state-changing POST/PUT), \`SameSite=Strict\` or \`SameSite=Lax\` cookie attributes.`,
    mcqs: [
      {
        question: 'Which of the following techniques is the most effective and industry-standard defense against SQL Injection (SQLi) attacks?',
        options: [
          'Using Parameterized Queries (Prepared Statements)',
          'Client-side JavaScript form input validation',
          'Converting all database table names to uppercase',
          'Increasing database connection pool timeout'
        ],
        correctOption: 0
      },
      {
        question: 'What vulnerability allows an attacker to steal session cookies by executing arbitrary JavaScript code within a victim\'s browser?',
        options: ['Cross-Site Scripting (XSS)', 'Cross-Site Request Forgery (CSRF)', 'Buffer Overflow', 'SYN Flood'],
        correctOption: 0
      },
      {
        question: 'Setting the "HttpOnly" flag on an HTTP response Set-Cookie header helps mitigate which attack vector?',
        options: [
          'Prevents client-side scripts from reading the session cookie via document.cookie during an XSS attack',
          'Encrypts the cookie using AES-256 on the client machine',
          'Prevents SQL injection inside URL parameters',
          'Stops network packet sniffing on public Wi-Fi'
        ],
        correctOption: 0
      },
      {
        question: 'How does a TCP SYN Flood Denial of Service attack exhaust the resources of a target server?',
        options: [
          'It downloads massive video files repeatedly until disk storage is full',
          'It sends a deluge of SYN packets with spoofed IPs, leaving server TCP half-open connection queues saturated',
          'It cracks the SSH private key using dictionary brute force',
          'It floods the router with ICMP redirect packets'
        ],
        correctOption: 1
      },
      {
        question: 'What is the primary mechanism used to protect web applications against Cross-Site Request Forgery (CSRF) attacks?',
        options: [
          'Validating unique, unpredictable Anti-CSRF tokens on state-changing requests and using SameSite cookie attributes',
          'Installing an SSL certificate on the client browser',
          'Converting all GET requests into POST requests',
          'Using Base64 encoding on incoming form parameters'
        ],
        correctOption: 0
      },
      {
        question: 'In an ARP Spoofing attack on a local Ethernet subnet, what false information does the attacker broadcast?',
        options: [
          'Falsified ARP replies linking the attacker\'s MAC address to the IP address of the default gateway',
          'Fraudulent DNS MX records to intercept email',
          'Rogue DHCP lease packets offering public IP addresses',
          'Malformed TCP window size acknowledgments'
        ],
        correctOption: 0
      },
      {
        question: 'What differentiates a Distributed Denial of Service (DDoS) attack from a standard Denial of Service (DoS) attack?',
        options: [
          'DDoS attacks utilize a coordinated network of thousands of distributed machines (Botnet) rather than a single source',
          'DDoS only affects wireless mobile networks',
          'DDoS attacks can only target DNS root servers',
          'DDoS attacks require physical access to the target datacenter'
        ],
        correctOption: 0
      },
      {
        question: 'Which type of Cross-Site Scripting (XSS) attack stores malicious script permanently inside the application database (e.g. within a user review or blog comment)?',
        options: ['Stored (Persistent) XSS', 'Reflected XSS', 'DOM-based XSS', 'Blind SQLi'],
        correctOption: 0
      },
      {
        question: 'What security enhancement on authoritative name servers validates DNS responses using cryptographic digital signatures to prevent DNS Cache Poisoning?',
        options: ['DNSSEC (DNS Security Extensions)', 'Dynamic DNS (DDNS)', 'DNS Round Robin', 'Anycast BGP routing'],
        correctOption: 0
      },
      {
        question: 'In a UDP Amplification attack (such as NTP or DNS amplification), why is UDP chosen by attackers instead of TCP?',
        options: [
          'UDP is connectionless, making it trivial to spoof the victim\'s source IP address without needing a handshake',
          'UDP packets are encrypted by default',
          'TCP does not support transmission of binary data',
          'UDP is immune to firewall packet inspection'
        ],
        correctOption: 0
      }
    ]
  },

  // ==================== DAY 9: DEFENSIVE ARCHITECTURE & ACCESS CONTROL ====================
  {
    dayNumber: 9,
    title: 'Defensive Architecture & Access Control: Firewalls, IDS vs IPS, DMZ, Zero Trust & Authentication (OAuth 2.0, JWT)',
    category: 'Network Security',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 70,
    readingContent: `# Defensive Architecture, Firewalls, Zero Trust & Modern Authentication

Securing modern distributed systems requires defense-in-depth: firewalls, intrusion detection systems, network segmentation (DMZ), identity verification (Zero Trust, MFA), and modern stateless token authentication (OAuth 2.0 and JSON Web Tokens).

---

## 1. Firewalls Evolution: Packet Filtering vs Stateful vs WAF

Firewalls inspect and filter inbound/outbound network traffic according to established security rules:

\`\`\`text
Generation 1: Packet Filtering (Layers 3 & 4)
  Inspects Source IP, Dest IP, Protocol, Port. Stateless (treats every packet independently).

Generation 2: Stateful Inspection (Layers 3 & 4)
  Tracks active TCP connection states in a state table (SYN, ESTABLISHED, FIN).
  Automatically allows legitimate return traffic.

Generation 3: Application / Next-Gen Firewall (NGFW) & WAF (Layer 7)
  Deep Packet Inspection (DPI). Analyzes HTTP headers, URL paths, payloads, and SQLi/XSS signatures.
\`\`\`

### Web Application Firewall (WAF)
- Operates at **Layer 7 (Application)**.
- Specialized in inspecting HTTP/HTTPS traffic to prevent OWASP Top 10 web exploits (SQLi, XSS, CSRF, rate abuse).
- Deployed in front of web servers or load balancers (e.g., AWS WAF, Cloudflare).

---

## 2. Intrusion Detection (IDS) vs Intrusion Prevention (IPS)

\`\`\`text
Network Traffic Flow:
  Internet ---> [Firewall] ---> [Inline IPS] ---> [Internal Switch] ---> [Servers]
                                      |
                                  (Drops Attack Packets)
                                      
  (Out-of-band SPAN port) ---> [Passive IDS] ---> (Sends Alert Notification to SOC)
\`\`\`

| Dimension | Intrusion Detection System (IDS) | Intrusion Prevention System (IPS) |
| :--- | :--- | :--- |
| **Placement** | **Out-of-Band (Passive)** via network SPAN/mirror port | **In-Line (Active)** directly in the traffic flow path |
| **Action Taken** | Detects malicious traffic, logs events, and **issues alerts** (does NOT stop packets) | Detects malicious traffic and **actively drops/blocks packets** in real-time |
| **Latency Impact**| Zero latency impact on live network traffic | Minor processing latency introduced to all through traffic |
| **False Positive Risk**| Low consequence: produces an unnecessary alert for analysts | High consequence: can drop legitimate corporate transactions |

### Detection Methodologies
- **Signature-Based**: Matches incoming traffic against a database of known exploit signatures (fast, high accuracy, but fails against novel **Zero-Day** vulnerabilities).
- **Anomaly / Heuristic-Based**: Establishes a baseline of normal network behavior. Triggers when deviations exceed a threshold (effective for zero-days, but higher false positives).

---

## 3. Demilitarized Zone (DMZ) Architecture

A **DMZ** (Perimeter Network) is a physical or logical subnet that isolates an organization's public-facing services from its internal private network:

\`\`\`text
Internet ===> [External Firewall] ===> [DMZ: Web Servers, Mail Servers] ===> [Internal Firewall] ===> [Private LAN: DBs, HR, Active Directory]
\`\`\`

- If a public web server in the DMZ is compromised, the **Internal Firewall** blocks the attacker from moving laterally into internal databases and proprietary employee systems.

---

## 4. The Zero Trust Security Model

Legacy network security operated on the **"Castle-and-Moat"** perimeter model: anyone inside the corporate intranet was implicitly trusted. Modern distributed cloud environments require **Zero Trust**:

- **Core Mantra**: *"Never Trust, Always Verify."*
- **3 Foundational Principles**:
  1. **Verify Explicitly**: Authenticate and authorize every transaction based on all available data points (identity, location, device health, service classification).
  2. **Use Least Privilege Access**: Limit user access with Just-In-Time (JIT) and Just-Enough-Access (JEA), Role-Based Access Control (RBAC).
  3. **Assume Breach**: Segment networks, encrypt end-to-end (both at rest and in transit), and continuously monitor telemetry.

---

## 5. Modern Authentication: OAuth 2.0 vs OIDC vs JWT

Corporate systems rely on token-based federated identity:

- **OAuth 2.0**: An **Authorization framework** allowing third-party applications to obtain limited access to user resources without exposing user credentials (e.g., "Allow App X to read your Google Calendar"). Uses **Access Tokens**.
- **OpenID Connect (OIDC)**: An **Authentication layer** built on top of OAuth 2.0 to verify user identity ("Log in with Google"). Issues an **ID Token**.

### JSON Web Token (JWT) Anatomy
A JWT is a compact, URL-safe string structured into three dot-separated components:

\`\`\`text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxODciLCJyb2xlIjoiQWRtaW4ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
[--------- Header (Base64) ---------].[--------- Payload (Claims) ---------].[------------- Signature -------------]
\`\`\`

1. **Header**: Specifies token type (\`JWT\`) and signing algorithm (\`HS256\` or \`RS256\`).
2. **Payload (Claims)**: Contains statements about the entity (e.g., \`userId\`, \`role\`, expiration \`exp\`). Encoded in Base64 (visible to anyone, NOT encrypted!).
3. **Signature**: Computed by taking \`HMACSHA256(Base64(Header) + "." + Base64(Payload), secretKey)\`. Ensures token cannot be forged or tampered with.`,
    mcqs: [
      {
        question: 'What is the primary functional difference between an Intrusion Detection System (IDS) and an Intrusion Prevention System (IPS)?',
        options: [
          'An IDS actively drops malicious packets inline; an IPS only monitors traffic out-of-band',
          'An IDS sits passively out-of-band to log and alert on suspicious activity; an IPS sits inline and actively blocks or drops malicious packets',
          'An IDS is a hardware device; an IPS can only run as software',
          'An IDS only protects against physical console attacks'
        ],
        correctOption: 1
      },
      {
        question: 'Which of the following best summarizes the core philosophical foundation of the Zero Trust Architecture?',
        options: [
          'Trust any device or user connected inside the internal corporate LAN',
          'Never trust, always verify every access request explicitly regardless of network location',
          'Rely exclusively on perimeter firewalls without internal endpoint security',
          'Disable multi-factor authentication for internal developers'
        ],
        correctOption: 1
      },
      {
        question: 'What are the three dot-separated components of a standard JSON Web Token (JWT)?',
        options: [
          'Header, Payload (Claims), Signature',
          'Username, Password, Salt',
          'Source IP, Destination IP, Checksum',
          'Public Key, Private Key, Certificate'
        ],
        correctOption: 0
      },
      {
        question: 'Why are public-facing web servers and mail servers typically hosted inside a Demilitarized Zone (DMZ)?',
        options: [
          'To boost web server clock speed',
          'To prevent a compromised public server from providing direct, unfettered access into internal private databases and corporate networks',
          'Because public servers cannot run on Ethernet switches',
          'To avoid using IP addresses'
        ],
        correctOption: 1
      },
      {
        question: 'Which type of firewall is specifically designed to inspect Layer 7 HTTP/HTTPS payloads to detect SQL Injection and Cross-Site Scripting patterns?',
        options: ['Stateless Packet Filter', 'Web Application Firewall (WAF)', 'Layer 2 Bridge Firewall', 'Circuit-level Gateway'],
        correctOption: 1
      },
      {
        question: 'What is the distinct role of OAuth 2.0 compared to OpenID Connect (OIDC)?',
        options: [
          'OAuth 2.0 is designed for Authorization (granting permission to access resources); OIDC is designed for Authentication (verifying user identity)',
          'OAuth 2.0 verifies user biometric fingerprints; OIDC provides hard drive encryption',
          'OAuth 2.0 is only for mobile applications; OIDC is only for desktop applications',
          'There is no difference; they are interchangeable terms for the same protocol'
        ],
        correctOption: 0
      },
      {
        question: 'What is a major limitation of Signature-Based Intrusion Detection Systems compared to Anomaly-Based systems?',
        options: [
          'Signature-based systems cannot detect novel, previously unknown Zero-Day attacks because no signature exists yet',
          'Signature-based systems consume 100% of network bandwidth',
          'Signature-based systems produce excessive false positives for standard traffic',
          'Signature-based systems only inspect Layer 1 physical fiber signals'
        ],
        correctOption: 0
      },
      {
        question: 'In a JSON Web Token (JWT), why can the server trust that the payload data has not been modified by a malicious client?',
        options: [
          'The payload is encrypted with military-grade AES-512',
          'The cryptographic signature is verified by the server using its secret key; any payload modification invalidates the signature',
          'The client is legally prevented from inspecting Base64 strings',
          'The browser automatically locks the JWT in read-only memory'
        ],
        correctOption: 1
      },
      {
        question: 'What is a Stateful Inspection firewall capable of doing that a simple stateless packet filtering firewall cannot?',
        options: [
          'Tracking the active state of TCP sessions and automatically permitting return response traffic without explicit outbound rules',
          'Executing server-side JavaScript scripts inside packets',
          'Encrypting the physical copper cables',
          'Converting IPv4 packets to IPv6 on the fly'
        ],
        correctOption: 0
      },
      {
        question: 'Which access control model assigns permissions to users strictly based on their job functions (such as "Developer", "Billing Admin", or "Auditor") rather than individual user identity?',
        options: ['Discretionary Access Control (DAC)', 'Role-Based Access Control (RBAC)', 'Mandatory Access Control (MAC)', 'Biometric Access Control (BAC)'],
        correctOption: 1
      }
    ]
  }
];

module.exports = networkSecurityModules;
