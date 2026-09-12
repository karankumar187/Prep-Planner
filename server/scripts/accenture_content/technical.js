module.exports = [
  // ==================== DAY 1: TECHNICAL (MS OFFICE & EXCEL) ====================
  {
    dayNumber: 1,
    title: 'MS Office & Excel Formulas Mastery for Accenture Assessment',
    category: 'Technical',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 70,
    readingContent: `# MS Office & Excel Formulas Mastery for Accenture Assessment

Accenture's Technical Assessment includes a dedicated section on Common Applications and MS Office (typically 12 questions). Scoring 100% in this section is a key differentiator for the AEH high-value package.

---

## 1. Cell Reference Types & Freezing Mechanics

When formulas are copied across rows or columns, Excel dynamically calculates target coordinates based on reference anchoring using the dollar sign (\`$\`):

\`\`\`text
Reference Syntax:
  A1    -> Relative: Both column (A) and row (1) shift when formula is moved.
  $A$1  -> Absolute: Both column and row remain completely fixed.
  $A1   -> Mixed: Column A is locked; row shifts vertically.
  A$1   -> Mixed: Row 1 is locked; column shifts horizontally.
\`\`\`

> **Keyboard Shortcut:** Highlight the cell reference in the formula bar and press **\`F4\`** to cycle through all four reference formats.

### Example Walkthrough
If cell \`C2\` contains \`=$A2*B$1\` and is copied down to cell \`C3\`:
- \`$A2\` becomes \`$A3\` (column locked, row increases by 1).
- \`B$1\` stays \`B$1\` (row locked, column unchanged).
- Result in \`C3\`: \`=$A3*B$1\`.

---

## 2. Core Lookup & Reference Functions

### A. VLOOKUP (Vertical Lookup)
Searches the first (leftmost) column of a range and retrieves a value from the same row in a designated column.

\`\`\`excel
=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])
\`\`\`

- **\`lookup_value\`**: The search key (e.g. Employee ID or Product Code).
- **\`table_array\`**: The table range. The lookup value **must be in the first column** of this range.
- **\`col_index_num\`**: 1-based column number from which to return the result.
- **\`range_lookup\`**:
  - \`FALSE\` (or \`0\`): Exact match (mandatory for text/IDs).
  - \`TRUE\` (or \`1\`): Approximate match (requires table to be sorted ascending).

### B. HLOOKUP (Horizontal Lookup)
Searches the first row horizontally and returns the value from a designated row index below:
\`\`\`excel
=HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])
\`\`\`

### C. INDEX & MATCH (Enterprise Standard)
Overcomes VLOOKUP's critical limitation (inability to look to the left) and operates faster on large sheets:
\`\`\`excel
=INDEX(return_column, MATCH(lookup_value, lookup_column, 0))
\`\`\`
- \`MATCH("Emp102", A1:A50, 0)\`: Scans column A and returns the row number (e.g., row 5).
- \`INDEX(D1:D50, 5)\`: Returns the value at row 5 in column D.

---

## 3. Conditional Aggregations & Formulas

| Function | Syntax | Behavior |
| :--- | :--- | :--- |
| **COUNT** | \`=COUNT(A1:A10)\` | Counts cells containing **numerical values only**. |
| **COUNTA** | \`=COUNTA(A1:A10)\` | Counts all **non-empty cells** (text, numbers, booleans, errors). |
| **COUNTBLANK**| \`=COUNTBLANK(A1:A10)\`| Counts strictly empty cells. |
| **COUNTIF** | \`=COUNTIF(range, criteria)\` | Counts cells matching a condition, e.g. \`=COUNTIF(B2:B20, ">75")\`. |
| **COUNTIFS** | \`=COUNTIFS(range1, c1, range2, c2)\` | Evaluates multiple criteria simultaneously (AND logic). |
| **SUMIF** | \`=SUMIF(range, criteria, [sum_range])\` | Sums cells where \`range\` meets condition. |
| **SUMIFS** | \`=SUMIFS(sum_range, r1, c1, r2, c2)\` | **Notice:** In \`SUMIFS\`, the \`sum_range\` comes **FIRST**! |

---

## 4. Excel Error Codes Diagnostics

Accenture frequently asks diagnostic questions based on Excel error outputs:

- **\`#N/A\` (Value Not Available)**: Occurs when \`VLOOKUP\`, \`HLOOKUP\`, or \`MATCH\` cannot locate an exact match.
- **\`#VALUE!\` (Wrong Argument Type)**: Occurs when mathematical operations receive text (e.g. \`="Accenture" * 10\`).
- **\`#REF!\` (Invalid Reference)**: Occurs when rows/columns referred to by an active formula have been deleted.
- **\`#DIV/0!\` (Division by Zero)**: Formula attempts to divide by zero or an empty cell.
- **\`#NAME?\` (Unrecognized Name)**: Formula contains an unquoted string or a misspelled function name (e.g. \`=SUMM(A1:A5)\`).
- **\`#NUM!\` (Invalid Number)**: Calculation yields a value exceeding Excel limits (\(10^{308}\)) or invalid math (e.g. \`=SQRT(-9)\`).
- **\`###\` (Display Overflow)**: Cell width is too narrow to display the formatted date or numeric value.

---

## 5. Pivot Tables & Formatting Tools
- **Pivot Tables**: Interactive data summarization engine. Components: *Rows*, *Columns*, *Values* (aggregations like Sum, Average), and *Filters*.
- **Slicers**: Visual graphic buttons to filter Pivot Table data with a single click.
- **Conditional Formatting**: Automatically changes cell background or font based on cell values (e.g., highlighting marks \(< 40\) in red).

---

## 6. High-Yield Shortcuts for the Exam
- **\`Ctrl + Shift + L\`**: Enable / Disable AutoFilters.
- **\`Alt + =\`**: Insert AutoSum formula automatically.
- **\`Ctrl + \`\` (Backtick)**: Toggle between showing formulas and calculated values.
- **\`Ctrl + D\`**: Fill down from above cell; **\`Ctrl + R\`**: Fill right.
- **\`Ctrl + 1\`**: Open Format Cells dialog.`,
    mcqs: [
      {
        question: 'In Microsoft Excel, what does the formula =VLOOKUP("Emp45", A2:D100, 3, FALSE) do?',
        options: [
          'Searches column C for "Emp45" and returns the row number',
          'Searches column A for "Emp45" and returns the value in column C from the same row using an exact match',
          'Searches the entire range and returns the count of "Emp45" occurrences',
          'Returns FALSE if "Emp45" is not located in column 3'
        ],
        correctOption: 1
      },
      {
        question: 'Which of the following Excel errors is displayed when a cell referenced in an existing formula is deleted?',
        options: ['#NULL!', '#VALUE!', '#REF!', '#NAME?'],
        correctOption: 2
      },
      {
        question: 'What is the key syntactical difference between the arguments of SUMIF and SUMIFS?',
        options: [
          'SUMIF requires sum_range as its first argument',
          'SUMIFS specifies sum_range as its first argument, whereas SUMIF takes sum_range as its optional final argument',
          'SUMIFS only supports a single criteria range',
          'SUMIF cannot evaluate numeric comparisons'
        ],
        correctOption: 1
      },
      {
        question: 'What is the result of COUNTA(A1:A10) if the range contains 4 numbers, 3 text entries, 1 formula error (#N/A), and 2 blank cells?',
        options: ['4', '7', '8', '10'],
        correctOption: 2
      },
      {
        question: 'If cell B2 contains the formula =$A$1+B1 and is copied horizontally to cell C2, what does the formula become in C2?',
        options: ['=$A$1+C1', '=$B$1+C1', '=$A$2+B2', '=$B$2+C2'],
        correctOption: 0
      },
      {
        question: 'Which keyboard shortcut in MS Excel immediately applies or removes AutoFilters from the active table headers?',
        options: ['Ctrl + F', 'Ctrl + Shift + L', 'Alt + F4', 'Ctrl + Alt + T'],
        correctOption: 1
      },
      {
        question: 'Why is the INDEX-MATCH formula combination widely preferred over VLOOKUP in enterprise financial models?',
        options: [
          'It can search and return values to the left of the lookup column and does not break when columns are inserted or deleted',
          'It executes on a multi-threaded GPU core',
          'VLOOKUP does not support exact string matching',
          'INDEX-MATCH automatically encrypts cell contents'
        ],
        correctOption: 0
      },
      {
        question: 'What error will Excel return if a user inputs the formula =SQRT(-49)?',
        options: ['#VALUE!', '#NUM!', '#N/A', '#DIV/0!'],
        correctOption: 1
      },
      {
        question: 'What keyboard shortcut automatically injects a SUM formula for adjacent continuous cells?',
        options: ['Ctrl + S', 'Alt + =', 'Shift + F3', 'Ctrl + Shift + S'],
        correctOption: 1
      },
      {
        question: 'What does the error #NAME? indicate when encountered in an Excel cell?',
        options: [
          'A cell was divided by zero',
          'The column is too narrow to display the number',
          'Excel does not recognize text in the formula, such as a misspelled function name or missing quotation marks around a string',
          'A circular reference was created'
        ],
        correctOption: 2
      }
    ]
  },

  // ==================== DAY 9: TECHNICAL (ACCENTURE PSEUDOCODE) ====================
  {
    dayNumber: 9,
    title: 'Accenture Pseudocode Mastery & Bitwise Operations',
    category: 'Technical',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 70,
    readingContent: `# Accenture Pseudocode Mastery & Bitwise Operations

Accenture AEH includes an 18-question Pseudocode section. Questions evaluate loop control variables, bitwise logic (\`&\`, \`|\`, \`^\`, \`~\`, \`<<\`, \`>>\`), operator precedence, and recursive dry-runs.

---

## 1. Bitwise Operators Core Reference
Bitwise operations operate on numbers at their binary representation:

| Operator | Symbol | Rule | Identity Trick |
| :--- | :---: | :--- | :--- |
| **AND** | \`&\` | 1 only if **both** bits are 1 | \`a & 0 = 0\`, \`a & a = a\` |
| **OR** | \`\|\` | 1 if **either or both** bits are 1 | \`a \| 0 = a\`, \`a \| a = a\` |
| **XOR** | \`^\` | 1 if bits are **different**; 0 if identical | \`a ^ a = 0\`, \`a ^ 0 = a\`, \`a ^ b ^ a = b\` |
| **NOT** | \`~\` | Inverts all bits (two's complement) | \`~x = -(x + 1)\` |
| **LEFT SHIFT** | \`<<\` | Multiplies by \(2^k\) | \`x << 1 = x * 2\`, \`x << 2 = x * 4\` |
| **RIGHT SHIFT**| \`>>\` | Integer divides by \(2^k\) | \`x >> 1 = floor(x / 2)\` |

### Key Accenture Bitwise Properties
1. **Check if \(n\) is power of 2:** \`(n > 0) && ((n & (n - 1)) == 0)\`.
2. **Clear lowest set bit:** \`n & (n - 1)\`.
3. **XOR Swap without temp:**
\`\`\`text
a = a ^ b
b = a ^ b   // b becomes original a
a = a ^ b   // a becomes original b
\`\`\`

---

## 2. Pseudocode Operator Precedence Hierarchy
When evaluating expressions without parentheses, follow this strict precedence:
1. **Bitwise NOT (\`~\`)**, Unary minus (\`-\`)
2. **Multiplication (\`*\`), Division (\`/\`), Modulo (\`mod\` or \`%\`)**
3. **Addition (\`+\`), Subtraction (\`-\`)**
4. **Bitwise Shifts (\`<<\`, \`>>\`)**
5. **Relational Operators (\`<\`, \`<=\`, \`>\`, \`>=\`)**
6. **Equality (\`==\`, \`!=\`)**
7. **Bitwise AND (\`&\`)**
8. **Bitwise XOR (\`^\`)**
9. **Bitwise OR (\`\|\`)**
10. **Logical AND (\`&&\` / \`AND\`)**
11. **Logical OR (\`\|\|\` / \`OR\`)**
12. **Assignment (\`=\`)**

> **Exam Trap:** Addition (\`+\`) binds tighter than bitwise shifts and bitwise AND/OR/XOR!
> In \`a = 5 & 3 + 2\`, evaluate \`3 + 2 = 5\` first, then \`5 & 5 = 5\`!

---

## 3. Loop Trace Table Strategy
Never execute loops mentally. Use a scratch trace table:

\`\`\`text
Integer a, b, c
Set a = 2, b = 4
for (each c from 1 to 3)
    a = a + 1
    if (a + b < c * 3)
        b = b + 2
    else
        b = b - 1
    end if
end for
Print a + b
\`\`\`

**Trace Table:**
- **Initial:** \`a = 2, b = 4\`
- **Iteration 1 (\`c = 1\`):**
  - \`a = 2 + 1 = 3\`
  - Condition: \`3 + 4 < 1 * 3\` -> \`7 < 3\` (False)
  - Else: \`b = 4 - 1 = 3\`
- **Iteration 2 (\`c = 2\`):**
  - \`a = 3 + 1 = 4\`
  - Condition: \`4 + 3 < 2 * 3\` -> \`7 < 6\` (False)
  - Else: \`b = 3 - 1 = 2\`
- **Iteration 3 (\`c = 3\`):**
  - \`a = 4 + 1 = 5\`
  - Condition: \`5 + 2 < 3 * 3\` -> \`7 < 9\` (True)
  - If: \`b = 2 + 2 = 4\`
- **Result:** \`a + b = 5 + 4 = 9\`.

---

## 4. Recursive Pseudocode Tracing
\`\`\`text
Function fun(Integer n)
    if (n <= 1)
        return 1
    end if
    return n + fun(n - 2)
End Function
\`\`\`
For \`fun(5)\`:
- \`fun(5) = 5 + fun(3)\`
- \`fun(3) = 3 + fun(1)\`
- \`fun(1) = 1\`
- Backtrack: \`fun(3) = 3 + 1 = 4\` -> \`fun(5) = 5 + 4 = 9\`.`,
    mcqs: [
      {
        question: 'What is the output of the bitwise expression: 12 & 10 ^ 6?',
        options: ['14', '2', '8', '4'],
        correctOption: 0
      },
      {
        question: 'If integer variable x = 7, what is the value of the bitwise NOT expression ~x in standard two\'s complement arithmetic?',
        options: ['-7', '-8', '8', '-6'],
        correctOption: 1
      },
      {
        question: 'In pseudocode operator precedence, which operation is performed first in the expression: 4 + 2 << 1 ^ 3?',
        options: ['2 << 1', '4 + 2', '1 ^ 3', '2 ^ 3'],
        correctOption: 1
      },
      {
        question: 'What is the output of the following pseudocode?\nInteger a = 8, b = 5\na = a ^ b\nb = a ^ b\na = a ^ b\nPrint a - b',
        options: ['3', '-3', '0', '13'],
        correctOption: 1
      },
      {
        question: 'What is the return value of fun(4) for:\nInteger fun(Integer n)\n  if (n <= 0) return 0\n  return (n mod 2) + fun(n - 1)\nEnd fun',
        options: ['1', '2', '3', '4'],
        correctOption: 1
      },
      {
        question: 'What is the result of evaluated bitwise expression: (16 >> 2) | (5 << 1)?',
        options: ['14', '10', '12', '15'],
        correctOption: 0
      },
      {
        question: 'What is the output of the following loop?\nInteger p = 1, q = 5\nwhile (q > 0)\n  p = p * 2\n  q = q - 2\nend while\nPrint p + q',
        options: ['8', '7', '9', '6'],
        correctOption: 1
      },
      {
        question: 'Which of the following expressions checks whether a positive integer n is a power of 2?',
        options: ['(n & (n - 1)) == 0', '(n | (n - 1)) == 0', '(n ^ (n + 1)) == 0', '(n & ~n) == 0'],
        correctOption: 0
      },
      {
        question: 'What is the value of variable sum after the loop executes?\nInteger sum = 0\nfor (i = 1 to 4)\n  for (j = 1 to i)\n    sum = sum + 1\n  end for\nend for',
        options: ['10', '16', '6', '12'],
        correctOption: 0
      },
      {
        question: 'What will be printed by the following pseudocode?\nInteger a = 15, b = 27\nPrint a & b, a | b',
        options: ['11, 31', '9, 31', '11, 29', '15, 27'],
        correctOption: 0
      }
    ]
  },

  // ==================== DAY 10: TECHNICAL (MS OFFICE ADVANCED & CLOUD) ====================
  {
    dayNumber: 10,
    title: 'MS Office Advanced & Cloud Architecture Concepts',
    category: 'Technical',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 70,
    readingContent: `# MS Office Advanced & Cloud Architecture Concepts

Accenture AEH covers MS PowerPoint/Word formatting in the common applications section alongside Enterprise Cloud Architecture fundamentals (IaaS, PaaS, SaaS, virtualization, and the shared responsibility model).

---

## 1. MS PowerPoint & Word Advanced Features

### A. PowerPoint Slide Master
- **Slide Master**: The top slide in the hierarchy that controls themes, fonts, colors, background styles, and positioning of placeholders for all subsequent layout slides.
- Modifying the Slide Master globally updates all associated slides instantly.
- **Presenter View**: Allows the speaker to view speaker notes, upcoming slides, and a presentation timer on their monitor while attendees view only the full-screen slide on the projector.
- Key Shortcuts:
  - **\`F5\`**: Start slideshow from slide 1.
  - **\`Shift + F5\`**: Start slideshow from the **current active slide**.
  - **\`B\` / \`W\`**: Toggle black screen / white screen during a presentation.

### B. MS Word Features
- **Mail Merge**: Merges a master document (template letter/envelope) with a data source (Excel spreadsheet, Access database) to generate personalized bulk correspondence.
- **Section Breaks vs Page Breaks**:
  - *Page Break*: Moves text to the top of the next page without altering document formatting.
  - *Section Break (Continuous / Next Page)*: Permits distinct page setups (e.g. portrait vs landscape, header/footer changes, multi-column layouts) within different portions of the same file.

---

## 2. Cloud Computing Service Models

| Model | Full Name | Definition | Customer Manages | Cloud Provider Manages | Examples |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **IaaS** | Infrastructure as a Service | Rents raw computing resources (VMs, storage, network) | OS, Middleware, Runtime, Data, Applications | Physical hardware, Hypervisors, Data centers | AWS EC2, Azure VMs, GCE |
| **PaaS** | Platform as a Service | Managed hardware + software environment for building apps | Applications, Data | OS, Runtime, Middleware, Patching, Virtualization | AWS Elastic Beanstalk, Heroku |
| **SaaS** | Software as a Service | End-user web applications delivered over the internet | Minimal configurations & user data | Entire stack (hardware, OS, application, security) | Google Workspace, Microsoft 365 |

---

## 3. Cloud Deployment Models
- **Public Cloud**: Shared multitenant physical infrastructure owned and operated by a third-party CSP over the public internet (AWS, Azure, GCP).
- **Private Cloud**: Infrastructure provisioned exclusively for a single organization; hosted on-premises or by a dedicated vendor.
- **Hybrid Cloud**: Connects private on-premises infrastructure with public cloud platforms via secure VPN/Direct Connect to enable workload portability.
- **Community Cloud**: Shared by multiple organizations with common regulatory or mission goals (e.g. healthcare, federal government).

---

## 4. Virtualization & Containers
- **Hypervisor Type 1 (Bare-Metal)**: Runs directly on bare physical server hardware without an underlying host OS (e.g. VMware ESXi, Microsoft Hyper-V). Low latency, high enterprise performance.
- **Hypervisor Type 2 (Hosted)**: Runs as an application on top of an existing host OS (e.g. VirtualBox, VMware Workstation).
- **Containers vs Virtual Machines**:
  - *Virtual Machines (VMs)*: Virtualize physical hardware. Each VM includes a full guest OS, binaries, and virtual hardware (heavyweight, minutes to boot).
  - *Containers (Docker)*: Virtualize the **OS kernel**. Containers share the host kernel and isolate user spaces (lightweight, megabytes in size, sub-second boot).

---

## 5. Cloud Shared Responsibility Model
- In **On-Premises**: Customer owns 100% of the stack (from physical facilities to application data).
- In **IaaS**: Provider owns physical datacenter, servers, and hypervisor; Customer secures OS, firewalls, and application.
- In **SaaS**: Provider owns infrastructure, OS, runtime, and software; Customer is responsible only for **user credentials and data classification**.`,
    mcqs: [
      {
        question: 'Which PowerPoint feature allows you to modify the font, color, and logo styling globally across every layout slide in a deck?',
        options: ['Slide Transition Manager', 'Slide Master', 'Presenter Console', 'Design Inspector'],
        correctOption: 1
      },
      {
        question: 'What is the keyboard shortcut in MS PowerPoint to launch a slideshow starting directly from the currently selected slide?',
        options: ['F5', 'Ctrl + F5', 'Shift + F5', 'Alt + F5'],
        correctOption: 2
      },
      {
        question: 'In Microsoft Word, what must be inserted if you wish to change page orientation from Portrait to Landscape for a single page in the middle of a document?',
        options: ['Page Break', 'Continuous Section Break or Next Page Section Break', 'Column Break', 'Paragraph Delimiter'],
        correctOption: 1
      },
      {
        question: 'Under the Cloud Shared Responsibility Model, which layer is ALWAYS the customer\'s responsibility across IaaS, PaaS, and SaaS?',
        options: ['Hypervisor patch management', 'Data governance and client access credentials', 'Physical data center cooling', 'Operating system updates'],
        correctOption: 1
      },
      {
        question: 'Which cloud service model does AWS Elastic Beanstalk and Google App Engine represent?',
        options: ['IaaS (Infrastructure as a Service)', 'PaaS (Platform as a Service)', 'SaaS (Software as a Service)', 'FaaS (Function as a Service) exclusively'],
        correctOption: 1
      },
      {
        question: 'What differentiates a Type 1 (Bare-Metal) hypervisor from a Type 2 hypervisor?',
        options: [
          'Type 1 runs directly on the host hardware without a conventional host OS; Type 2 runs on top of an existing host OS',
          'Type 1 is only used for container orchestration',
          'Type 2 does not allow running Windows operating systems',
          'Type 1 cannot virtualize network interfaces'
        ],
        correctOption: 0
      },
      {
        question: 'How do Docker containers achieve significantly faster startup times compared to traditional Virtual Machines?',
        options: [
          'Containers emulate hardware using software BIOS',
          'Containers share the host operating system kernel and avoid bundling a full guest OS',
          'Containers run exclusively in CPU L1 cache',
          'Containers bypass network stack configuration entirely'
        ],
        correctOption: 1
      },
      {
        question: 'Which cloud deployment model enables an organization to run sensitive customer data on on-premises private servers while bursting web traffic onto AWS during peak hours?',
        options: ['Community Cloud', 'Hybrid Cloud', 'Public Cloud', 'Distributed Sovereign Cloud'],
        correctOption: 1
      },
      {
        question: 'During an active PowerPoint presentation in slideshow mode, which key can the presenter tap to turn the projection screen completely black?',
        options: ['Esc', 'B', 'Alt + Tab', 'Ctrl + B'],
        correctOption: 1
      },
      {
        question: 'Which MS Word feature allows automated creation of hundreds of personalized certificates or letters using names stored in an Excel spreadsheet?',
        options: ['AutoText Engine', 'Mail Merge', 'Data Consolidation', 'Track Changes'],
        correctOption: 1
      }
    ]
  },

  // ==================== DAY 10: MOCK TEST (ACCENTURE AEH COMPREHENSIVE) ====================
  {
    dayNumber: 10,
    title: 'Accenture AEH Full Readiness Mock Assessment',
    category: 'Mock Test',
    taskType: 'assessment',
    priority: 'High',
    estimatedMinutes: 70,
    readingContent: `# Accenture AEH Full Readiness Mock Assessment Guide

This comprehensive 10-question assessment simulates the technical assessment section of the Accenture AEH on-campus drive. Topics evaluate core Computer Science pillars, algorithmic reasoning, and enterprise systems.

### Test Structure & Guidelines
- **Total Questions:** 10 Questions
- **Time Allocated:** 40 Minutes
- **Passing Benchmark:** 80% (8/10 correct)
- **Topics Evaluated:**
  1. Data Structures & Algorithm Complexity
  2. SQL Indexing & Join Constraints
  3. OOP Polymorphism & Memory Design
  4. DBMS Serializability & Normalization
  5. OS Page Replacement & Thrashing
  6. Computer Networks TCP 3-Way Handshake & Subnetting
  7. Java/C++ Memory Management
  8. Pseudocode & Bitwise Mechanics
  9. Cloud Architecture & Shared Security
  10. System Design & Scalability Patterns`,
    mcqs: [
      {
        question: 'What is the tightest worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST) containing N nodes?',
        options: ['O(log N)', 'O(N)', 'O(1)', 'O(N log N)'],
        correctOption: 1
      },
      {
        question: 'In SQL, which join type will return all matching rows between two tables plus all non-matching rows from BOTH tables filled with NULL values?',
        options: ['LEFT OUTER JOIN', 'CROSS JOIN', 'FULL OUTER JOIN', 'INNER JOIN'],
        correctOption: 2
      },
      {
        question: 'In Object-Oriented Programming, what mechanism enables runtime (dynamic) method dispatch in C++ when invoking a method through a base class pointer?',
        options: ['Static symbol binding', 'Virtual Method Table (vtable) and virtual pointer (vptr)', 'Template specialization', 'Preprocessor macro expansion'],
        correctOption: 1
      },
      {
        question: 'Which of the following database isolation levels completely prevents Dirty Reads, Non-Repeatable Reads, and Phantom Reads?',
        options: ['Read Committed', 'Repeatable Read', 'Serializable', 'Read Uncommitted'],
        correctOption: 2
      },
      {
        question: 'What phenomenon occurs in an operating system when excessive paging causes the CPU to spend more time swapping pages between RAM and disk than executing user instructions?',
        options: ['Deadlock', 'Thrashing', 'Starvation', 'Belady\'s Anomaly'],
        correctOption: 1
      },
      {
        question: 'During the standard TCP 3-Way Handshake connection establishment, which sequence of packet flags is exchanged between client (C) and server (S)?',
        options: [
          'C -> S: SYN; S -> C: SYN-ACK; C -> S: ACK',
          'C -> S: ACK; S -> C: SYN; C -> S: FIN',
          'C -> S: SYN; S -> C: ACK; C -> S: SYN-ACK',
          'C -> S: RST; S -> C: ACK; C -> S: SYN'
        ],
        correctOption: 0
      },
      {
        question: 'In Java, what happens to String objects created via the String literal syntax (e.g. String s = "Accenture")?',
        options: [
          'They are placed in the JVM Stack frame',
          'They are pooled in the String Constant Pool (SCP) inside the Heap for reuse',
          'They are deleted immediately when the function terminates',
          'They bypass Garbage Collection permanently'
        ],
        correctOption: 1
      },
      {
        question: 'What is the output of the bitwise expression: (18 ^ 6) & 15?',
        options: ['4', '14', '0', '12'],
        correctOption: 0
      },
      {
        question: 'In a Cloud SaaS model (e.g. Microsoft 365 or Salesforce), who is responsible for application security, infrastructure maintenance, and operating system patches?',
        options: ['Exclusively the corporate client', 'The Cloud Service Provider (CSP)', 'The end-user ISP', 'Shared 50/50 through on-premise hypervisors'],
        correctOption: 1
      },
      {
        question: 'Which normalization form requires that all non-key attributes be strictly functionally dependent on the ENTIRE primary key (no partial dependencies)?',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        correctOption: 1
      }
    ]
  }
];
