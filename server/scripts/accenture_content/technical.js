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

  // ==================== DAY 10: TECHNICAL (MS OFFICE ADVANCED & AUTOMATION) ====================
  {
    dayNumber: 10,
    title: 'MS Office Advanced: Word, PowerPoint & Excel Automation Mastery',
    category: 'Technical',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 70,
    readingContent: `# MS Office Advanced: Word, PowerPoint & Excel Automation Mastery

The Common Applications & Technical Assessment section of Accenture AEH extensively tests advanced workplace software workflows, formatting automation, keyboard efficiency, and cross-application data integration across MS Word, PowerPoint, and Excel.

---

## 1. MS PowerPoint Architecture & Delivery

### A. The Slide Master Hierarchy
- **Slide Master**: The top-level slide in the hierarchy hierarchy tree that controls the theme, fonts, background styling, color palettes, and positional placeholders for all descendant layout slides in a presentation deck.
- **Global Inheritance**: Changing a font or adding a company logo on the Slide Master immediately propagates to every slide utilizing that master.
- **Layout Slides**: Individual layout variations (Title Slide, Title & Content, Two Content, Blank) inherit master properties but allow specialized formatting.

### B. Presenter View & Delivery Shortcuts
- **Presenter View**: Allows the speaker to view upcoming slides, speaker notes, and an elapsed presentation timer on their private display while the audience sees only the full-screen slide on the primary projection monitor.
- **Critical Shortcuts**:
  - \`F5\`: Launch presentation starting from **Slide 1**.
  - \`Shift + F5\`: Launch presentation starting directly from the **current active slide**.
  - \`B\`: Blank screen to pure **Black** (pauses audience focus).
  - \`W\`: Blank screen to pure **White**.
  - \`Ctrl + P\`: Convert cursor to an active **Pen tool** during presentation.
  - \`Ctrl + E\`: Convert cursor to an **Eraser**.
  - \`Esc\`: Immediately terminate the slideshow.

---

## 2. MS Word Advanced Document Automation

### A. Mail Merge Pipeline
Mail Merge automates mass production of personalized correspondence (offer letters, invoices, certificates) by linking two files:
1. **Main Document**: The template letter containing fixed text and contextual placeholders known as **Merge Fields** (e.g., \`«First_Name»\`, \`«Annual_CTC»\`).
2. **Data Source**: A structured table (Excel workbook, Access database, or CSV file) containing records with column headers matching merge fields.
3. **Merged Result**: Generates a unified output file or sends customized emails directly via Outlook.

### B. Page Breaks vs Section Breaks
- **Page Break (\`Ctrl + Enter\`)**: Force-terminates the current page and moves subsequent text to the top of the next page. Document headers, margins, and page orientations remain identical across pages.
- **Section Breaks**: Divide a document into independent formatting zones:
  - *Next Page Section Break*: Starts a new section on the subsequent page. **Mandatory** when switching between Portrait and Landscape orientations in the middle of a document, or when restarting page numbers (e.g. Roman numerals \`i, ii, iii\` for preface, Arabic numerals \`1, 2, 3\` for chapters).
  - *Continuous Section Break*: Starts a new section on the exact same page. Used to switch between standard single-column text and multi-column magazine layouts without starting a new page.

---

## 3. Advanced Excel Formulas & Data Analysis

### A. Dynamic Array Formulas & Lookup Matrix
- **XLOOKUP**: Replaces \`VLOOKUP\` and \`HLOOKUP\`. Supports left-lookups, exact match by default, and custom missing values:
  \`\`\`text
  =XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode])
  \`\`\`
- **INDEX & MATCH**: The legacy enterprise gold standard for 2D matrix lookups:
  \`\`\`text
  =INDEX(return_range, MATCH(lookup_val, lookup_col, 0))
  \`\`\`
- **SUMIFS / COUNTIFS**: Evaluates multiple simultaneous criteria using boolean AND logic across column ranges:
  \`\`\`text
  =SUMIFS(sum_range, criteria_range1, ">=100", criteria_range2, "Bangalore")
  \`\`\`

### B. Pivot Tables, Slicers & Macros
- **Pivot Table**: An interactive data summarization engine that rapidly sorts, counts, totals, or averages data stored in a table without altering raw dataset rows.
- **Slicers**: Visual graphical filter buttons connected to Pivot Tables for executive dashboards.
- **Macros (VBA)**: Automated recording of repetitive action sequences compiled into Visual Basic for Applications scripts (saved with \`.xlsm\` extension). Shortcut to open VBA editor: \`Alt + F11\`.`,
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
        question: 'During an active PowerPoint presentation in slideshow mode, which key can the presenter tap to turn the projection screen completely black?',
        options: ['Esc', 'B', 'Alt + Tab', 'Ctrl + B'],
        correctOption: 1
      },
      {
        question: 'Which MS Word feature allows automated creation of hundreds of personalized letters or certificates using names stored in an Excel spreadsheet?',
        options: ['AutoText Engine', 'Mail Merge', 'Data Consolidation', 'Track Changes'],
        correctOption: 1
      },
      {
        question: 'Which keyboard shortcut immediately opens the Visual Basic for Applications (VBA) macro editor in Microsoft Excel?',
        options: ['Alt + F11', 'Ctrl + Shift + M', 'F12', 'Ctrl + Alt + V'],
        correctOption: 0
      },
      {
        question: 'In Microsoft Excel, how does the modern XLOOKUP function improve upon traditional VLOOKUP?',
        options: [
          'It can look to the left of the lookup column and defaults to an exact match without needing column index numbers',
          'It can only search text strings and cannot search numeric values',
          'It requires data in the lookup table to be sorted in ascending order',
          'It cannot return arrays of values'
        ],
        correctOption: 0
      },
      {
        question: 'In Microsoft Word, what is the key difference between a Page Break and a Continuous Section Break?',
        options: [
          'A Page Break moves text to a new page; a Continuous Section Break creates an independent formatting zone on the same page',
          'A Page Break can change header/footer numbering; a Section Break cannot',
          'A Continuous Section Break deletes paragraph formatting',
          'There is no difference between them'
        ],
        correctOption: 0
      },
      {
        question: 'During a presentation in PowerPoint Presenter View, what information is visible to the speaker that audience members cannot see?',
        options: [
          'Speaker notes, elapsed presentation timer, and preview of upcoming slides',
          'Audience member email addresses',
          'Operating system registry settings',
          'Network router IP traffic'
        ],
        correctOption: 0
      },
      {
        question: 'What file extension is used to save a Microsoft Excel workbook that contains executable Visual Basic (VBA) macros?',
        options: ['.xlsx', '.xlsm', '.xltx', '.csv'],
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
