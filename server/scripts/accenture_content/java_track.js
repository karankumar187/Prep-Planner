module.exports = [
  {
    "dayNumber": 1,
    "title": "Java Track: JVM Architecture, Memory Model & String Pool",
    "category": "Java",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# Java Track: JVM Architecture, Memory Model & String Pool\n\nAccenture's Technical and Core Programming rounds place strong emphasis on Java internals, JVM execution flow, memory segments, and the String Constant Pool.\n\n---\n\n## 1. JVM Internal Architecture\n\n```text\n+-------------------------------------------------------------+\n|                     CLASSLOADER SUBSYSTEM                   |\n| Loading (Bootstrap, Extension/Platform, Application)        |\n| Linking (Verification, Preparation, Resolution)             |\n| Initialization                                              |\n+-------------------------------------------------------------+\n                              |\n+-----------------------------v-------------------------------+\n|                      JVM RUNTIME DATA AREAS                 |\n|  [Method Area]    [Heap Area]    [JVM Stack]   [PC]  [Native]|\n|  (Class Metadata, (All Objects,  (Frames,      Regs   Method |\n|   Static vars)     Arrays, SCP)   Locals)             Stack  |\n+-------------------------------------------------------------+\n                              |\n+-----------------------------v-------------------------------+\n|                      EXECUTION ENGINE                       |\n|   [Interpreter]  +  [JIT Compiler (HotSpot)]  +  [GC Engine]|\n+-------------------------------------------------------------+\n```\n\n### A. Runtime Data Areas\n1. **Method Area / Metaspace**:\n   - Stores class-level data: runtime constant pool, field/method metadata, static variables, and bytecode.\n   - *Since Java 8*: PermGen was replaced by **Metaspace**, which resides in **native off-heap memory** (prevents `java.lang.OutOfMemoryError: PermGen space`).\n2. **Heap Memory**:\n   - Shared across all threads. Stores all instantiated **Objects and Arrays**.\n   - Subject to automatic Garbage Collection.\n3. **JVM Stack**:\n   - Private to each thread. Created when a thread starts.\n   - Holds Stack Frames. Each frame contains: **Local Variable Array**, **Operand Stack**, and **Frame Data** (runtime resolution & return values).\n4. **Program Counter (PC) Register**:\n   - Holds address of currently executing JVM instruction for each thread.\n5. **Native Method Stack**:\n   - Holds native C/C++ method invocations via JNI (Java Native Interface).\n\n---\n\n## 2. JIT (Just-In-Time) Compiler & HotSpot\n- The JVM interpreter executes bytecode line-by-line.\n- The **JIT Compiler** profiles execution to detect frequently executed code (\"Hotspots\").\n- Compiles hotspot bytecode directly into optimized **native machine code** and caches it in the Code Cache.\n\n---\n\n## 3. String Immutability & String Constant Pool (SCP)\n\n```java\nString s1 = \"Accenture\";                   // Stored in String Constant Pool (SCP)\nString s2 = \"Accenture\";                   // Reuses existing SCP reference! s1 == s2 is TRUE\nString s3 = new String(\"Accenture\");       // Creates explicit object in Heap outside SCP! s1 == s3 is FALSE\nString s4 = s3.intern();                   // Returns canonical reference from SCP! s1 == s4 is TRUE\n```\n\n### Why are Strings Immutable in Java?\n1. **Security**: Strings carry sensitive parameters (database credentials, network URLs, reflection class names). Immutability prevents tampering.\n2. **Thread-Safety**: Immutable objects can be freely shared across concurrent threads without synchronization overhead.\n3. **Caching & SCP Efficiency**: If Strings were mutable, changing one reference would silently corrupt all other variables sharing that literal in the pool.\n4. **HashCode Caching**: The hash code is computed once during creation and cached lazily, making `String` exceptionally fast as a key in `HashMap` and `HashSet`.\n\n---\n\n## 4. String vs StringBuilder vs StringBuffer\n\n| Feature | `String` | `StringBuffer` | `StringBuilder` |\n| :--- | :--- | :--- | :--- |\n| **Mutability** | Immutable | Mutable | Mutable |\n| **Thread-Safety**| Thread-safe (immutable) | **Thread-safe** (synchronized methods) | **Not Thread-safe** (unsynchronized) |\n| **Performance** | Slow for repeated concatenation | Moderate (locking overhead) | **Fastest** (recommended for single-thread) |\n| **Introduction**| Java 1.0 | Java 1.0 | Java 1.5 |\n\n```java\n// Best Practice in loops:\nStringBuilder sb = new StringBuilder();\nfor (int i = 0; i < 1000; i++) {\n    sb.append(i).append(\",\"); // Modifies internal char[] in-place; O(N) total\n}\nString result = sb.toString();\n```",
    "mcqs": [
      {
        "question": "Where are String literals (e.g. String s = \"Accenture\") stored in Java memory since Java 7 and 8?",
        "options": [
          "In the Thread Stack frame",
          "Inside the String Constant Pool (SCP), which resides within the Java Heap",
          "In CPU hardware registers",
          "In the Native Operating System Swap file"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the output of the following Java snippet?\nString s1 = \"Hello\";\nString s2 = new String(\"Hello\");\nSystem.out.println((s1 == s2) + \" \" + (s1.equals(s2)));",
        "options": [
          "true true",
          "false true",
          "true false",
          "false false"
        ],
        "correctOption": 1
      },
      {
        "question": "What does the intern() method do when called on a Java String object?",
        "options": [
          "Deletes the string from memory",
          "Converts the string to lowercase",
          "Returns a canonical representation from the String Constant Pool, placing it there if not already present",
          "Encrypts the string using SHA-256"
        ],
        "correctOption": 2
      },
      {
        "question": "What memory area replaced the legacy PermGen space starting with Java 8?",
        "options": [
          "Eden Space",
          "Metaspace (allocated in native process memory)",
          "Young Generation",
          "Code Cache exclusively"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the primary technical difference between StringBuffer and StringBuilder in Java?",
        "options": [
          "StringBuffer is thread-safe with synchronized methods; StringBuilder is unsynchronized and faster for single-threaded usage",
          "StringBuilder is immutable; StringBuffer is mutable",
          "StringBuffer cannot allocate more than 16 characters",
          "StringBuilder belongs to java.util; StringBuffer belongs to java.lang"
        ],
        "correctOption": 0
      },
      {
        "question": "Which of the following is NOT a reason for Java Strings to be designed as immutable objects?",
        "options": [
          "Thread-safety without synchronization locks",
          "Safe sharing of literals in the String Constant Pool",
          "Allowing the string size to exceed physical RAM limits automatically",
          "Security in passing database URLs and file paths"
        ],
        "correctOption": 2
      },
      {
        "question": "In JVM architecture, which memory area is allocated privately for EACH individual thread rather than shared globally?",
        "options": [
          "Heap Area",
          "Method Area / Metaspace",
          "JVM Stack",
          "String Constant Pool"
        ],
        "correctOption": 2
      },
      {
        "question": "What is the role of the JIT (Just-In-Time) compiler within the HotSpot JVM execution engine?",
        "options": [
          "Compiles Java source code (.java) into bytecode (.class) on disk",
          "Detects frequently executed bytecode routines (\"hot spots\") and compiles them into native machine code at runtime",
          "Performs static code linting",
          "Manages thread priority queues"
        ],
        "correctOption": 1
      },
      {
        "question": "What happens when two String references are compared using the \"==\" operator in Java?",
        "options": [
          "It checks whether the character contents are lexicographically identical",
          "It checks whether both references point to the exact same memory address",
          "It always evaluates to true for strings with equal lengths",
          "It throws an UnsupportedOperationException"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the default initial character capacity of a newly instantiated StringBuilder (new StringBuilder()) in Java?",
        "options": [
          "0",
          "8",
          "16",
          "32"
        ],
        "correctOption": 2
      }
    ]
  },
  {
    "dayNumber": 2,
    "title": "Java Track: Interfaces, Abstract Classes & Method Overriding",
    "category": "Java",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# Java Track: Interfaces, Abstract Classes & Method Overriding\n\nAccenture tests contract design, Java 8/9 interface extensions (`default` and `static` methods), covariance, and method overriding constraint rules.\n\n---\n\n## 1. Abstract Classes vs Interfaces (Modern Java)\n\n| Feature | Abstract Class | Interface (Java 8+) |\n| :--- | :--- | :--- |\n| **Keyword** | `abstract class` | `interface` |\n| **Inheritance** | Single class inheritance (`extends`) | Multiple interface implementation (`implements`) |\n| **State / Fields**| Can have instance fields with any access modifier | Only **`public static final`** constants |\n| **Constructors** | Has constructors (called via `super()`) | **No constructors** allowed |\n| **Concrete Methods**| Supported (`abstract` or concrete) | Can have **`default`** and **`static`** methods (since Java 8); **`private`** methods (since Java 9) |\n| **Speed** | Slightly faster (direct vtable index lookup) | Interface method dispatch via itable |\n\n---\n\n## 2. Java 8 Default & Static Methods in Interfaces\nBefore Java 8, adding a method to an interface broke all implementing classes. `default` methods solved this by providing backward compatibility:\n\n```java\npublic interface PaymentGateway {\n    void processPayment(double amount);\n    \n    // Default method: provides default fallback implementation\n    default void logTransaction(String txId) {\n        System.out.println(\"Default TX Log: \" + txId);\n    }\n    \n    // Static utility method: invoked via PaymentGateway.version()\n    static String version() {\n        return \"v2.4\";\n    }\n}\n```\n\n### Resolving Multiple Interface Conflicts (The Ambiguity Rule)\nIf class `C` implements interfaces `A` and `B` that declare identical default methods:\n```java\ninterface A { default void hello() { System.out.println(\"A\"); } }\ninterface B { default void hello() { System.out.println(\"B\"); } }\n\nclass C implements A, B {\n    // Compiler error unless explicitly overridden in C!\n    @Override\n    public void hello() {\n        A.super.hello(); // Disambiguates explicitly\n    }\n}\n```\n\n---\n\n## 3. Strict Rules of Method Overriding in Java\n\nWhen a child class overrides a method from its parent class:\n1. **Method Signature**: Method name, parameter types, and parameter ordering **must be exactly identical**.\n2. **Access Specifier Rule**: The child method **cannot be more restrictive** than the parent method:\n   - `public` (\rightarrow) must stay `public`.\n   - `protected` (\rightarrow) can be `protected` or `public`.\n   - `default (package-private)` (\rightarrow) can be default, protected, or public.\n3. **Return Type Rule (Covariant Returns)**:\n   - Child method return type must be the **same type or a subclass** of the parent return type.\n4. **Exception Handling Rule**:\n   - Child method cannot throw **new or broader checked exceptions** than the parent method. It may throw fewer checked exceptions, or any `RuntimeException` (unchecked).\n5. **Methods that CANNOT be overridden**:\n   - **`final`** methods (prohibits overriding).\n   - **`static`** methods (static methods are hidden via **Method Hiding**, not overridden).\n   - **`private`** methods (not visible outside the parent class).",
    "mcqs": [
      {
        "question": "What access modifier constraints apply when overriding a protected method from a superclass in Java?",
        "options": [
          "The overriding method must be private or package-private",
          "The overriding method must be protected or public",
          "The overriding method must strictly remain protected only",
          "The overriding method cannot declare any access modifier"
        ],
        "correctOption": 1
      },
      {
        "question": "Which feature was introduced in Java 8 to allow adding new methods to interfaces without breaking existing implementations?",
        "options": [
          "Native methods",
          "Default methods (declared with the default keyword)",
          "Abstract properties",
          "Package-level constructors"
        ],
        "correctOption": 1
      },
      {
        "question": "What is a \"Covariant Return Type\" in Java method overriding?",
        "options": [
          "The overriding method in the subclass returns a subtype of the return type declared in the superclass method",
          "The return type must always be void",
          "The return type is dynamically converted to a primitive integer",
          "The method accepts a variable number of arguments"
        ],
        "correctOption": 0
      },
      {
        "question": "What occurs if a subclass declares a static method with the exact same name and signature as a static method in its superclass?",
        "options": [
          "Compilation error",
          "Runtime dynamic polymorphism with vtable dispatch",
          "Method Hiding (the subclass method hides the superclass method without polymorphism)",
          "The superclass method is permanently deleted"
        ],
        "correctOption": 2
      },
      {
        "question": "Why can an interface NOT contain a constructor in Java?",
        "options": [
          "Interfaces are converted to C structs during compilation",
          "Interfaces cannot maintain independent object state or be instantiated directly; all fields are static constants",
          "Constructors can only be defined in packages",
          "The Java compiler does not support constructors without parameters"
        ],
        "correctOption": 1
      },
      {
        "question": "If a superclass method throws IOException, what checked exceptions is an overriding subclass method allowed to throw?",
        "options": [
          "Exception (broader than IOException)",
          "IOException, FileNotFoundException (subclass of IOException), or no checked exceptions at all",
          "Throwable",
          "ClassNotFoundException (unrelated checked exception)"
        ],
        "correctOption": 1
      },
      {
        "question": "How does a class resolve the conflict when implementing two interfaces that both define an identical default method signature?",
        "options": [
          "The JVM picks the interface loaded first",
          "The class must explicitly override the method and provide its own implementation or use InterfaceName.super.method()",
          "The class automatically converts the method to abstract",
          "The code fails at runtime with AmbiguousMethodException"
        ],
        "correctOption": 1
      },
      {
        "question": "Can a class in Java implement multiple interfaces and extend multiple abstract classes simultaneously?",
        "options": [
          "Yes, Java supports full multiple inheritance for both",
          "No, Java permits implementing multiple interfaces, but only extending a single superclass (abstract or concrete)",
          "Only if all classes belong to java.lang",
          "Only if the class is marked final"
        ],
        "correctOption": 1
      },
      {
        "question": "All fields declared in a standard Java interface are implicitly:",
        "options": [
          "private and volatile",
          "public, static, and final",
          "protected and transient",
          "package-private and atomic"
        ],
        "correctOption": 1
      },
      {
        "question": "Can a private method in a superclass be overridden by a subclass in Java?",
        "options": [
          "Yes, if the subclass marks it public",
          "No, private methods are invisible to subclasses and cannot participate in polymorphism",
          "Only if using reflection",
          "Yes, if both classes are in the same package"
        ],
        "correctOption": 1
      }
    ]
  },
  {
    "dayNumber": 3,
    "title": "Java Track: Collections Internals (HashMap, ArrayList, Set)",
    "category": "Java",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# Java Track: Collections Internals (HashMap, ArrayList, Set)\n\nAccenture AEH rounds deeply test HashMap internals, hash collisions, treeification thresholds, dynamic resizing, and fail-fast vs fail-safe iterators.\n\n---\n\n## 1. HashMap Internal Architecture (Java 8+)\n\nA `HashMap` is an array of hash buckets (nodes).\n```text\ntable = Node<K,V>[16]\nIndex 0 -> Node(k1, v1) -> Node(k2, v2)\nIndex 1 -> null\nIndex 2 -> TreeNode (Red-Black Tree when bucket size >= 8)\n```\n\n### Key Internal Constants\n- **Default Initial Capacity**: **16** (always a power of 2: (2^n)).\n- **Default Load Factor**: **0.75** (balance between time and space).\n- **Threshold**: (\text{Capacity} \times \text{Load Factor}) (e.g. (16 \times 0.75 = 12)). When entries exceed 12, the table doubles in size (32).\n- **TREEIFY_THRESHOLD**: **8**. When a single bucket chain reaches 8 nodes (and total capacity (ge 64)), the linked list converts to a **Red-Black Tree**!\n  - Drops search complexity from (O(N)) down to **(O(log N))**.\n- **UNTREEIFY_THRESHOLD**: **6**. If nodes in a tree shrink to 6 during resizing/removal, it converts back to a linked list.\n\n### Bucket Index Formula\nInstead of slow modulo (`hash % capacity`), Java uses bitwise masking (valid because capacity is a power of 2):\n```java\nindex = (n - 1) & hash;  // e.g. (16 - 1) & hash = 15 & hash\n```\n\n---\n\n## 2. The Contract between `equals()` and `hashCode()`\nIf you use custom objects as keys in a `HashMap` or elements in a `HashSet`:\n1. If `o1.equals(o2) == true`, then `o1.hashCode() == o2.hashCode()` **MUST be true**.\n2. If two objects have the same `hashCode()`, they are **NOT necessarily equal** (Hash Collision).\n3. If you override `equals()`, you **MUST override `hashCode()`**!\n   - *Failure to do so*: `map.get(new Key(1))` returns `null` even if `new Key(1)` was stored, because different default `Object.hashCode()` memory addresses are queried!\n\n---\n\n## 3. ArrayList vs LinkedList Internals\n- **`ArrayList`**:\n  - Backed by dynamic array `Object[] elementData`.\n  - Default initial capacity: **10**.\n  - Growth factor: Increases by **50%** ((1.5 \times)): `newCapacity = oldCapacity + (oldCapacity >> 1)`.\n  - Random access: (O(1)). Insertion/deletion at arbitrary position: (O(N)).\n- **`LinkedList`**:\n  - Doubly-linked list of `Node<E>` with `prev`, `data`, `next`.\n  - No capacity concept. Higher memory overhead (24 bytes per node for pointers).\n\n---\n\n## 4. Fail-Fast vs Fail-Safe Iterators\n\n| Feature | Fail-Fast Iterators | Fail-Safe (Concurrent) Iterators |\n| :--- | :--- | :--- |\n| **Collections** | `ArrayList`, `HashMap`, `HashSet` | `ConcurrentHashMap`, `CopyOnWriteArrayList` |\n| **Mechanism** | Checks internal `modCount`. If structure changes during iteration, immediately throws **`ConcurrentModificationException`**. | Iterates over a **clone / snapshot** of the collection at the time the iterator was created. |\n| **Modification** | Modifying directly via `list.remove()` fails; must use `iterator.remove()`. | Can modify underlying collection concurrently without exception. |",
    "mcqs": [
      {
        "question": "What is the default initial capacity and load factor of a standard Java HashMap?",
        "options": [
          "Capacity: 10, Load Factor: 0.5",
          "Capacity: 16, Load Factor: 0.75",
          "Capacity: 32, Load Factor: 0.8",
          "Capacity: 8, Load Factor: 0.75"
        ],
        "correctOption": 1
      },
      {
        "question": "In Java 8+, at what threshold of nodes in a single bucket does a HashMap convert a linked list into a balanced Red-Black Tree?",
        "options": [
          "4",
          "6",
          "8",
          "16"
        ],
        "correctOption": 2
      },
      {
        "question": "What bitwise calculation does Java HashMap utilize to determine the bucket index for an object hash in a table of size n?",
        "options": [
          "index = hash % n",
          "index = (n - 1) & hash",
          "index = hash ^ (n - 1)",
          "index = hash << 2"
        ],
        "correctOption": 1
      },
      {
        "question": "What happens if you override equals() in a custom class but fail to override hashCode(), and then use instances as keys in a HashMap?",
        "options": [
          "The code fails at compilation",
          "Calling map.get() with an equal key object will typically return null because the hashCodes differ and target different buckets",
          "The HashMap automatically converts to a TreeMap",
          "Memory leak crashes the JVM"
        ],
        "correctOption": 1
      },
      {
        "question": "By what factor does the capacity of an ArrayList expand when its current storage array becomes full?",
        "options": [
          "Doubles (100% / 2.0x)",
          "Grows by 50% (1.5x)",
          "Grows by 10 elements linearly",
          "Quadruples (4.0x)"
        ],
        "correctOption": 1
      },
      {
        "question": "What exception is thrown by a Fail-Fast iterator when it detects that the underlying collection was modified structurally during iteration?",
        "options": [
          "IllegalStateException",
          "ConcurrentModificationException",
          "IndexOutOfBoundsException",
          "UnsupportedOperationException"
        ],
        "correctOption": 1
      },
      {
        "question": "Which of the following classes provides a Fail-Safe iterator that works on a snapshot copy of the array?",
        "options": [
          "ArrayList",
          "Vector",
          "CopyOnWriteArrayList",
          "LinkedList"
        ],
        "correctOption": 2
      },
      {
        "question": "What is the internal data structure used to implement a Java HashSet?",
        "options": [
          "A balanced AVL Tree",
          "An internal backing HashMap instance where elements are stored as keys with a dummy object as value",
          "A dynamic contiguous array",
          "A doubly-linked list"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the worst-case search time complexity in a Java 8+ HashMap where extreme hash collisions occur in a bucket?",
        "options": [
          "O(N)",
          "O(log N)",
          "O(1)",
          "O(N^2)"
        ],
        "correctOption": 1
      },
      {
        "question": "How can you safely remove an element from an ArrayList while actively iterating through it using an Iterator?",
        "options": [
          "Calling list.remove(item)",
          "Calling iterator.remove()",
          "Setting the element to null",
          "Using a synchronized block around list.remove()"
        ],
        "correctOption": 1
      }
    ]
  },
  {
    "dayNumber": 4,
    "title": "Java Track: Exception Hierarchy & Garbage Collection Mechanics",
    "category": "Java",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# Java Track: Exception Hierarchy & Garbage Collection Mechanics\n\nAccenture questions target checked vs unchecked exceptions, `try-with-resources` (`AutoCloseable`), Generational Garbage Collection, Eden/Survivor spaces, and Stop-The-World pauses.\n\n---\n\n## 1. Java Exception Class Hierarchy\n\n```text\n                 java.lang.Throwable\n                     /                             /                java.lang.Error           java.lang.Exception\n    (Fatal system failures)    (Application recoverable)\n    - StackOverflowError          /                        - OutOfMemoryError      Checked Exceptions      Unchecked (RuntimeException)\n                          - IOException             - NullPointerException\n                          - SQLException            - ArithmeticException\n                          - ClassNotFoundException  - ArrayIndexOutOfBoundsException\n```\n\n- **Checked Exceptions**: Subclasses of `Exception` excluding `RuntimeException`. Checked at **compile-time**. The developer **must** handle them via `try-catch` or declare with `throws`.\n- **Unchecked Exceptions**: Subclasses of `RuntimeException`. Indicate logical programming defects (null dereferences, illegal arguments). Not enforced by compiler.\n- **Errors**: Severe hardware or environmental issues (memory exhaustion, stack exhaustion). Should not be caught.\n\n---\n\n## 2. `try-with-resources` & `AutoCloseable`\nIntroduced in Java 7 to eliminate manual cleanup in `finally` blocks:\n```java\n// Automatically calls br.close() even if exceptions are thrown:\ntry (BufferedReader br = new BufferedReader(new FileReader(\"file.txt\"))) {\n    return br.readLine();\n} // Closes automatically here!\n```\n- Any class implementing **`java.lang.AutoCloseable`** or `java.io.Closeable` can be used in the try parenthesis.\n\n---\n\n## 3. Generational Garbage Collection Mechanics\nThe **Weak Generational Hypothesis** states that *most objects die young*. The Java Heap is partitioned accordingly:\n\n```text\n+------------------------------------+-------------------------+\n|          YOUNG GENERATION          |     OLD GENERATION      |\n|  [ Eden Space ] [ S0 ] [ S1 ]      |       (Tenured)         |\n+------------------------------------+-------------------------+\n```\n\n1. **Young Generation**:\n   - **Eden Space**: All newly instantiated objects (`new`) are allocated here.\n   - **Survivor Spaces (S0 / S1)**: Two identical-sized buffers. At any given moment, one survivor space is active while the other is completely empty.\n   - **Minor GC**: Collects dead objects from Eden. Surviving objects are copied to the active Survivor space with their age counter incremented by 1.\n2. **Tenuring / Promotion**:\n   - When an object survives multiple Minor GCs (default threshold = **15**, configurable via `-XX:MaxTenuringThreshold`), it is promoted to the **Old (Tenured) Generation**.\n3. **Old Generation & Major / Full GC**:\n   - Holds long-lived objects (e.g. spring beans, caches, connection pools).\n   - Collected via **Major GC / Full GC** (Stop-The-World pause across the entire JVM).\n\n---\n\n## 4. Modern GC Collectors\n- **Serial GC**: Single-threaded, basic desktop apps.\n- **Parallel GC**: Multi-threaded for Young Gen; maximizes raw throughput.\n- **G1 GC (Garbage-First)**: Default since Java 9. Divides heap into equal-sized regions. Prioritizes regions with the most garbage first to minimize pause times.\n- **ZGC / Shenandoah**: Ultra-low latency collectors with pauses (< 1) millisecond, executing concurrent marking and compaction.",
    "mcqs": [
      {
        "question": "Which of the following is a Checked Exception in Java that must be handled or declared with throws at compile-time?",
        "options": [
          "NullPointerException",
          "IllegalArgumentException",
          "IOException",
          "ClassCastException"
        ],
        "correctOption": 2
      },
      {
        "question": "Which interface must a class implement to be used within a Java try-with-resources statement?",
        "options": [
          "java.io.Serializable",
          "java.lang.AutoCloseable",
          "java.lang.Cloneable",
          "java.util.Disposable"
        ],
        "correctOption": 1
      },
      {
        "question": "In Java generational garbage collection, where are newly instantiated objects initially allocated in memory?",
        "options": [
          "Old / Tenured Generation",
          "Eden Space in Young Generation",
          "Survivor Space S1",
          "Metaspace"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the default JVM tenuring threshold for an object to be promoted from Young to Old Generation?",
        "options": [
          "5",
          "8",
          "15",
          "32"
        ],
        "correctOption": 2
      },
      {
        "question": "What occurs during a \"Stop-The-World\" (STW) pause in JVM Garbage Collection?",
        "options": [
          "The JVM terminates permanently",
          "All application worker threads are temporarily suspended while the GC inspects and moves object references",
          "The disk controller freezes",
          "Memory is flushed to network sockets"
        ],
        "correctOption": 1
      },
      {
        "question": "Which Garbage Collector became the default in Java starting with Java 9?",
        "options": [
          "Serial GC",
          "Parallel throughput collector",
          "G1 GC (Garbage-First)",
          "ZGC"
        ],
        "correctOption": 2
      },
      {
        "question": "Which block in a Java try-catch statement is guaranteed to execute regardless of whether an exception is thrown or caught (unless System.exit(0) is invoked)?",
        "options": [
          "catch",
          "finally",
          "try",
          "default"
        ],
        "correctOption": 1
      },
      {
        "question": "What type of error is java.lang.OutOfMemoryError classified as in the Java hierarchy?",
        "options": [
          "Checked Exception",
          "Unchecked Exception (RuntimeException)",
          "java.lang.Error (unrecoverable JVM failure)",
          "Compile-time syntax warning"
        ],
        "correctOption": 2
      },
      {
        "question": "Does invoking System.gc() in Java guarantee that the garbage collector will run immediately?",
        "options": [
          "Yes, it forces an immediate synchronous Full GC",
          "No, it is merely a non-binding hint to the JVM that garbage collection may be beneficial",
          "It only runs on the Thread Stack",
          "It throws an UnsupportedOperationException in modern Java"
        ],
        "correctOption": 1
      },
      {
        "question": "What happens to the finalize() method in modern Java (Java 9+)?",
        "options": [
          "It was enhanced with asynchronous threading",
          "It was deprecated (and subsequently removed/phased out) due to unpredictable performance, deadlocks, and safety issues",
          "It is now mandatory for all objects",
          "It runs before the constructor"
        ],
        "correctOption": 1
      }
    ]
  },
  {
    "dayNumber": 5,
    "title": "Java Track: Multithreading, Synchronization & Concurrency",
    "category": "Java",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# Java Track: Multithreading, Synchronization & Concurrency\n\nAccenture AEH evaluates thread lifecycle states, `volatile` visibility mechanics, intrinsic locks (`synchronized`), `wait()`/`notify()` protocols, deadlocks, and `java.util.concurrent` primitives.\n\n---\n\n## 1. Thread Creation: Three Approaches\n\n```java\n// 1. Extending Thread\nclass MyThread extends Thread {\n    public void run() { System.out.println(\"Thread running\"); }\n}\n\n// 2. Implementing Runnable (Preferred: preserves single-inheritance capability)\nRunnable task = () -> System.out.println(\"Runnable task\");\nnew Thread(task).start();\n\n// 3. Implementing Callable<V> (Returns a value and can throw checked exceptions)\nExecutorService executor = Executors.newSingleThreadExecutor();\nFuture<Integer> future = executor.submit(() -> 42);\nInteger result = future.get(); // Blocks until complete\n```\n\n---\n\n## 2. The `volatile` Keyword & Java Memory Model (JMM)\nIn multi-core CPUs, threads cache shared variables in CPU L1/L2 caches:\n- **Visibility Problem**: Thread A updates variable (x), but writes it only to its CPU cache. Thread B running on core 2 continues reading stale value from its own cache.\n- **The Solution**: Declaring `volatile boolean flag = true;` ensures:\n  1. **Direct RAM Write**: All writes are immediately flushed to main memory.\n  2. **Direct RAM Read**: All reads fetch directly from main memory.\n  3. **Instruction Reordering Prevention**: Enforces a happens-before memory barrier.\n- **Limitation**: `volatile` provides **visibility**, but does **NOT guarantee atomicity** (e.g. `count++` is 3 distinct assembly operations: read, increment, write). For atomic operations, use **`AtomicInteger`** or **`synchronized`**.\n\n---\n\n## 3. Synchronization & Intrinsic Locks (Monitors)\nEvery Java object has an internal **intrinsic lock (monitor lock)**.\n- **Synchronized Instance Method**: Locks on `this` instance.\n- **Synchronized Static Method**: Locks on the `Class` object (`MyClass.class`).\n- **Synchronized Block**: Locks on a specific target object:\n```java\npublic void updateBalance(int amount) {\n    synchronized(this) {\n        this.balance += amount;\n    }\n}\n```\n\n---\n\n## 4. Inter-Thread Communication: `wait()`, `notify()`, `notifyAll()`\n- Must ALWAYS be invoked from inside a **`synchronized` block/method** on the monitored object, or a **`IllegalMonitorStateException`** is thrown.\n- `wait()`: Releases the lock and puts thread in `WAITING` state until notified.\n- `notify()`: Wakes up a single waiting thread.\n- `notifyAll()`: Wakes up all waiting threads.\n- **Best Practice**: Always check the waiting condition inside a **`while` loop**, not an `if` statement (protects against spurious wakeups):\n```java\nsynchronized(lock) {\n    while (!ready) {\n        lock.wait();\n    }\n    // Proceed\n}\n```\n\n---\n\n## 5. Deadlock Demonstration & Prevention\n\n```text\nThread 1 holds Lock A, requests Lock B\nThread 2 holds Lock B, requests Lock A\n==> Circular wait condition -> DEADLOCK!\n```\n**Prevention**: Always acquire multiple locks in a **consistent, predefined global order** (e.g., always lock resource with smaller ID first).",
    "mcqs": [
      {
        "question": "What does the volatile keyword guarantee in Java when applied to a variable?",
        "options": [
          "Mutual exclusion and lock acquisition",
          "Memory visibility (reads/writes directly to main memory) and prevention of instruction reordering",
          "Thread starvation elimination",
          "Automatic Garbage Collection immunity"
        ],
        "correctOption": 1
      },
      {
        "question": "Why does the expression count++ fail to be thread-safe even if count is declared as volatile?",
        "options": [
          "Volatile cannot be applied to integers",
          "count++ is a compound operation consisting of 3 separate steps (read, modify, write) and lacks atomicity",
          "The JVM converts ++ into multiplication",
          "Volatile variables cannot be altered inside loops"
        ],
        "correctOption": 1
      },
      {
        "question": "What exception is thrown if wait() or notify() is called on an object without first holding its monitor lock inside a synchronized block?",
        "options": [
          "InterruptedException",
          "IllegalMonitorStateException",
          "NullPointerException",
          "ThreadDeath"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the primary difference between Runnable and Callable interfaces in Java?",
        "options": [
          "Runnable can return a value; Callable cannot",
          "Callable can return a generic value V and throw checked exceptions; Runnable returns void and cannot throw checked exceptions",
          "Runnable runs asynchronously; Callable runs synchronously only",
          "Callable is an abstract class"
        ],
        "correctOption": 1
      },
      {
        "question": "Why should wait() always be invoked inside a while loop rather than an if statement?",
        "options": [
          "To prevent deadlocks",
          "To guard against spurious wakeups where a thread wakes up without receiving an explicit notify signal",
          "To increase execution priority",
          "Because wait() returns a boolean"
        ],
        "correctOption": 1
      },
      {
        "question": "What does a synchronized static method lock on in Java?",
        "options": [
          "The \"this\" instance reference",
          "The Class object corresponding to the declaring class (e.g. MyClass.class)",
          "The JVM root classloader",
          "The operating system kernel thread table"
        ],
        "correctOption": 1
      },
      {
        "question": "Which class from java.util.concurrent provides thread-safe atomic operations on integers without using synchronized blocks?",
        "options": [
          "VolatileInteger",
          "AtomicInteger",
          "SynchronizedInteger",
          "IntegerWrapper"
        ],
        "correctOption": 1
      },
      {
        "question": "What happens when calling thread.run() directly instead of thread.start()?",
        "options": [
          "A new thread is spawned in the background",
          "The run() code executes synchronously in the caller's current thread without spawning a new thread",
          "Compilation error",
          "A deadlock occurs immediately"
        ],
        "correctOption": 1
      },
      {
        "question": "What technique prevents deadlocks when two threads must acquire locks on two shared resources A and B?",
        "options": [
          "Increasing thread priority",
          "Enforcing an identical lock acquisition order across all threads (e.g. always acquire lock A before lock B)",
          "Making both objects volatile",
          "Using Thread.sleep()"
        ],
        "correctOption": 1
      },
      {
        "question": "What thread state is an active thread placed in when it is waiting to acquire an intrinsic monitor lock held by another thread?",
        "options": [
          "WAITING",
          "BLOCKED",
          "TIMED_WAITING",
          "TERMINATED"
        ],
        "correctOption": 1
      }
    ]
  },
  {
    "dayNumber": 6,
    "title": "Java Track: Modern Java (Java 8/11/17) Streams & Functional Interfaces",
    "category": "Java",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# Java Track: Modern Java (Java 8/11/17) Streams & Functional Interfaces\n\nAccenture's AEH coding assessments test lambda expressions, built-in functional interfaces, intermediate vs terminal Stream operations, and collectors.\n\n---\n\n## 1. Core Built-In Functional Interfaces (`java.util.function`)\n\nA functional interface contains **exactly one abstract method** (marked with `@FunctionalInterface`):\n\n| Interface | Method Signature | Purpose | Example |\n| :--- | :--- | :--- | :--- |\n| **`Predicate<T>`** | `boolean test(T t)` | Evaluates a condition; returns boolean | `x -> x % 2 == 0` |\n| **`Function<T, R>`** | `R apply(T t)` | Transforms input of type (T) to output of type (R) | `s -> s.length()` |\n| **`Consumer<T>`** | `void accept(T t)` | Consumes input; performs side-effects; no return | `s -> System.out.println(s)` |\n| **`Supplier<T>`** | `T get()` | Takes no input; supplies a value of type (T) | `() -> Math.random()` |\n| **`BiFunction<T, U, R>`**| `R apply(T t, U u)`| Takes two inputs; returns result | `(a, b) -> a + b` |\n\n---\n\n## 2. Stream Pipeline Architecture\nA Stream is a sequence of elements supporting sequential and parallel aggregate operations.\nStreams are **lazy**: Intermediate operations are not executed until a **terminal operation** is triggered!\n\n```text\n[ Source ] ---> [ Intermediate Ops (Lazy) ] ---> [ Terminal Op (Eager Execution) ]\n(Collection)    (filter, map, sorted, flatMap)   (collect, forEach, reduce, count)\n```\n\n### A. Intermediate Operations (Return `Stream<T>`)\n- `.filter(Predicate)`: Retains elements matching the condition.\n- `.map(Function)`: Transforms each element to another value.\n- `.flatMap(Function<T, Stream<R>>)`: Flattens nested streams (e.g. `List<List<Integer>>` to `Stream<Integer>`).\n- `.sorted()`: Sorts elements naturally or via `Comparator`.\n- `.distinct()`: Eliminates duplicates using `equals()`.\n- `.limit(n)` / `.skip(n)`: Short-circuiting slice operators.\n\n### B. Terminal Operations (Trigger Execution & Close Stream)\n- `.collect(Collectors.toList() / toSet() / groupingBy())`: Collects into data structures.\n- `.reduce(identity, BinaryOperator)`: Folds elements into a single summary value.\n- `.forEach(Consumer)`: Iterates over each element.\n- `.count()`: Returns number of elements.\n- `.anyMatch()` / `.allMatch()` / `.noneMatch()`: Short-circuiting booleans.\n\n---\n\n## 3. Advanced Stream Examples for Accenture AEH\n\n### Grouping Employees by Department\n```java\nMap<String, List<Employee>> byDept = employees.stream()\n    .collect(Collectors.groupingBy(Employee::getDepartment));\n```\n\n### Counting Occurrences / Frequency Map\n```java\nMap<String, Long> frequencyMap = words.stream()\n    .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));\n```\n\n### Finding Second Highest Salary\n```java\nOptional<Integer> secondHighest = salaries.stream()\n    .distinct()\n    .sorted(Comparator.reverseOrder())\n    .skip(1)\n    .findFirst();\n```",
    "mcqs": [
      {
        "question": "Which of the following built-in functional interfaces in java.util.function accepts an argument of type T and returns a boolean value?",
        "options": [
          "Function<T, R>",
          "Predicate<T>",
          "Consumer<T>",
          "Supplier<T>"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the key characteristic of Intermediate operations in the Java Stream API?",
        "options": [
          "They execute immediately and store results in a new List",
          "They are lazy and do not execute until a terminal operation is called on the stream pipeline",
          "They permanently modify the source collection",
          "They cannot be chained"
        ],
        "correctOption": 1
      },
      {
        "question": "What does the flatMap operation perform on a Stream of collections (e.g. Stream<List<String>>)?",
        "options": [
          "Filters out null elements",
          "Flattens nested streams into a single unified stream of individual elements",
          "Sorts elements in reverse order",
          "Converts strings to uppercase"
        ],
        "correctOption": 1
      },
      {
        "question": "Which of the following is a Terminal operation that triggers execution of a Java Stream pipeline?",
        "options": [
          "filter()",
          "map()",
          "sorted()",
          "collect()"
        ],
        "correctOption": 3
      },
      {
        "question": "What is the return type of the functional method in a Supplier<T>?",
        "options": [
          "void",
          "T",
          "boolean",
          "Stream<T>"
        ],
        "correctOption": 1
      },
      {
        "question": "Can a Java Stream be reused or re-traversed once a terminal operation has executed on it?",
        "options": [
          "Yes, streams can be consumed unlimited times",
          "No, a stream is closed once a terminal operation completes; re-operating on it throws an IllegalStateException",
          "Only if parallelStream() is used",
          "Yes, if reset() is called"
        ],
        "correctOption": 1
      },
      {
        "question": "What Collector groups stream elements into a Map based on a classification function?",
        "options": [
          "Collectors.partitioningBy()",
          "Collectors.groupingBy()",
          "Collectors.toMap()",
          "Collectors.summarizingInt()"
        ],
        "correctOption": 1
      },
      {
        "question": "What does the short-circuiting operation findFirst() return from an empty stream?",
        "options": [
          "null",
          "Optional.empty()",
          "Throws NoSuchElementException",
          "0"
        ],
        "correctOption": 1
      },
      {
        "question": "What does the method reference System.out::println translate to in standard lambda expression syntax?",
        "options": [
          "() -> System.out.println()",
          "x -> System.out.println(x)",
          "(a, b) -> System.out.println(a + b)",
          "System.out.println"
        ],
        "correctOption": 1
      },
      {
        "question": "How many abstract methods can an interface annotated with @FunctionalInterface contain?",
        "options": [
          "0",
          "Exactly 1",
          "At least 2",
          "Unlimited as long as they are public"
        ],
        "correctOption": 1
      }
    ]
  },
  {
    "dayNumber": 7,
    "title": "Java Track: Software Design Patterns (Creational & Structural)",
    "category": "Java",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# Java Track: Software Design Patterns (Creational & Structural)\n\nAccenture assesses enterprise design patterns: Thread-safe Singleton (Double-Checked Locking, Bill Pugh), Factory, Builder, Adapter, and Decorator.\n\n---\n\n## 1. Singleton Pattern (Thread-Safe Implementations)\n\nEnsures a class has **only one instance** and provides a global access point.\n\n### A. Double-Checked Locking (DCL)\n```java\npublic class DatabaseConnection {\n    // volatile is MANDATORY to prevent instruction reordering during instantiation!\n    private static volatile DatabaseConnection instance;\n\n    private DatabaseConnection() { /* Private constructor */ }\n\n    public static DatabaseConnection getInstance() {\n        if (instance == null) { // 1st Check (no lock)\n            synchronized (DatabaseConnection.class) {\n                if (instance == null) { // 2nd Check (with lock)\n                    instance = new DatabaseConnection();\n                }\n            }\n        }\n        return instance;\n    }\n}\n```\n\n### B. Bill Pugh Singleton (Inner Static Helper - Best Practice)\nUses JVM class loading mechanics; 100% thread-safe and lazily initialized without locks:\n```java\npublic class BillPughSingleton {\n    private BillPughSingleton() {}\n\n    private static class SingletonHelper {\n        // Loaded into memory ONLY when getInstance() is invoked!\n        private static final BillPughSingleton INSTANCE = new BillPughSingleton();\n    }\n\n    public static BillPughSingleton getInstance() {\n        return SingletonHelper.INSTANCE;\n    }\n}\n```\n\n---\n\n## 2. Factory Method Pattern\nDefines an interface for creating an object, but lets subclasses decide which class to instantiate:\n```java\npublic interface Notification { void notifyUser(); }\npublic class SMSNotification implements Notification { public void notifyUser() { ... } }\npublic class EmailNotification implements Notification { public void notifyUser() { ... } }\n\npublic class NotificationFactory {\n    public static Notification createNotification(String channel) {\n        if (channel.equalsIgnoreCase(\"SMS\")) return new SMSNotification();\n        if (channel.equalsIgnoreCase(\"EMAIL\")) return new EmailNotification();\n        throw new IllegalArgumentException(\"Unknown channel: \" + channel);\n    }\n}\n```\n\n---\n\n## 3. Builder Pattern\nSolves the \"Telescoping Constructor\" anti-pattern when an object has many optional parameters:\n```java\nUser user = new User.Builder(\"John\", \"john@accenture.com\")\n    .age(28)\n    .department(\"Cloud First\")\n    .phone(\"9876543210\")\n    .build();\n```\n\n---\n\n## 4. Adapter Pattern (Structural)\nConverts the interface of a class into another interface that clients expect:\n- Example: Java's `Arrays.asList(array)` adapts an array to the `List` interface.\n\n---\n\n## 5. Decorator Pattern (Structural)\nAttaches additional responsibilities to an object dynamically without modifying the underlying class:\n- Standard Example: Java I/O streams!\n```java\nBufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(\"data.txt\")));\n// FileInputStream decorated with InputStreamReader, decorated with BufferedReader!\n```",
    "mcqs": [
      {
        "question": "Why is the instance variable in a Double-Checked Locking Singleton implementation declared as volatile?",
        "options": [
          "To make the instance serializable",
          "To prevent CPU instruction reordering during object construction so other threads do not see a half-initialized object",
          "To enable automatic garbage collection",
          "To allow subclassing"
        ],
        "correctOption": 1
      },
      {
        "question": "How does the Bill Pugh Singleton approach achieve thread-safety without explicit synchronization locks?",
        "options": [
          "It runs on a single CPU core",
          "It utilizes a private static inner class that is only loaded into memory by the JVM when getInstance() is first called",
          "It uses atomic hardware flags",
          "It relies on Java serialization hooks"
        ],
        "correctOption": 1
      },
      {
        "question": "Which design pattern is utilized by Java I/O classes such as new BufferedReader(new FileReader(\"file.txt\"))?",
        "options": [
          "Factory Method Pattern",
          "Decorator Pattern",
          "Adapter Pattern",
          "Observer Pattern"
        ],
        "correctOption": 1
      },
      {
        "question": "What problem does the Builder Pattern solve in object creation?",
        "options": [
          "Ensuring only a single instance exists globally",
          "Eliminating the \"Telescoping Constructor\" anti-pattern where classes require numerous complex optional constructor parameters",
          "Translating incompatible interfaces",
          "Executing algorithms in parallel"
        ],
        "correctOption": 1
      },
      {
        "question": "Which design pattern defines a factory method for creating objects while delegating the concrete instantiation logic to subclasses?",
        "options": [
          "Factory Method Pattern",
          "Singleton Pattern",
          "Facade Pattern",
          "Proxy Pattern"
        ],
        "correctOption": 0
      },
      {
        "question": "What type of design pattern is the Adapter Pattern classified as?",
        "options": [
          "Creational Pattern",
          "Structural Pattern",
          "Behavioral Pattern",
          "Concurrency Pattern"
        ],
        "correctOption": 1
      },
      {
        "question": "Which GoF design pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified automatically?",
        "options": [
          "Observer Pattern",
          "Strategy Pattern",
          "Factory Pattern",
          "Command Pattern"
        ],
        "correctOption": 0
      },
      {
        "question": "What is the most effective and simplest way to create a serialization-safe, reflection-proof Singleton in Java according to Joshua Bloch?",
        "options": [
          "Double-Checked Locking",
          "Static synchronization block",
          "Using a single-element Enum (e.g. public enum Singleton { INSTANCE; })",
          "Using transient fields"
        ],
        "correctOption": 2
      },
      {
        "question": "Which design pattern provides a unified, simplified higher-level interface to a complex subsystem of classes?",
        "options": [
          "Facade Pattern",
          "Decorator Pattern",
          "Flyweight Pattern",
          "Bridge Pattern"
        ],
        "correctOption": 0
      },
      {
        "question": "In the Strategy Pattern, what is encapsulated within interchangeable classes?",
        "options": [
          "Class instances",
          "Algorithms or behaviors that can be swapped dynamically at runtime",
          "Database connections",
          "UI themes"
        ],
        "correctOption": 1
      }
    ]
  },
  {
    "dayNumber": 8,
    "title": "Java Track: String Performance, Immutability & Memory Optimization",
    "category": "Java",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# Java Track: String Performance, Immutability & Memory Optimization\n\nAccenture tests String internal representation, Compact Strings (Java 9+), String deduplication in G1 GC, and common enterprise memory leak vectors.\n\n---\n\n## 1. Compact Strings Representation (Java 9+)\nBefore Java 9:\n- Strings were stored internally as `char[]` where each `char` consumed **16 bits (2 bytes)** using UTF-16 encoding.\n- Wasteful because over 75% of production Strings contain only Latin-1 (ASCII) characters that fit into 1 byte.\nSince Java 9:\n- Strings use **`byte[]`** with a single `coder` byte:\n  - If all characters fit in Latin-1 (\rightarrow) `coder = 0`, allocates **1 byte per character** (50% memory savings!).\n  - If any character requires UTF-16 (\rightarrow) `coder = 1`, allocates **2 bytes per character**.\n\n---\n\n## 2. G1 GC String Deduplication\n- Enabled via `-XX:+UseStringDeduplication`.\n- G1 GC scans the heap during background collection.\n- If it detects two distinct `String` objects sharing identical character contents, it updates their internal `value[]` byte array references to point to the **same backing byte array**, freeing the duplicate array from RAM.\n\n---\n\n## 3. Common Java Memory Leak Traps\nEven with Garbage Collection, memory leaks occur when unused objects remain reachable via unintended references:\n\n### A. Static Collections\n```java\npublic class CacheManager {\n    // Static references live for the entire lifetime of the JVM process!\n    private static final List<Transaction> history = new ArrayList<>();\n    \n    public void add(Transaction t) {\n        history.add(t); // Without eviction policy (LRU/TTL), causes OutOfMemoryError\n    }\n}\n```\n\n### B. Unclosed Resources (Streams, DB Connections)\n- Unclosed database connections, sockets, and file streams leak native OS file descriptors. Always use `try-with-resources`.\n\n### C. Non-Static Inner Classes\n- A non-static inner class holds an implicit hidden reference to its enclosing outer class instance (`Outer.this`).\n- If the inner instance is held in a long-lived cache, the entire outer class cannot be garbage collected! Solution: Use **`static` nested classes**.\n\n### D. Improper `equals()` and `hashCode()` in Hash Collections\n- Adding objects to a `HashSet` or `HashMap` and subsequently mutating their fields alters their `hashCode()`.\n- The object can never be found or removed via `set.remove(obj)`, causing a permanent silent memory leak!",
    "mcqs": [
      {
        "question": "How does Java 9+ implement \"Compact Strings\" to reduce heap memory footprint by up to 50%?",
        "options": [
          "By compressing all strings using GZIP algorithms in RAM",
          "By replacing the internal char[] array with a byte[] array and an encoding coder byte (Latin-1 vs UTF-16)",
          "By restricting string length to 256 characters",
          "By forcing all strings into native C memory"
        ],
        "correctOption": 1
      },
      {
        "question": "What does the G1 GC String Deduplication feature (-XX:+UseStringDeduplication) perform?",
        "options": [
          "Deletes duplicate strings from disk",
          "Points multiple distinct String objects with identical character contents to the same backing byte array in heap memory",
          "Enforces that all strings must be interned manually",
          "Converts strings to uppercase"
        ],
        "correctOption": 1
      },
      {
        "question": "Why can non-static inner classes cause subtle memory leaks in Java applications?",
        "options": [
          "They cannot implement Serializable",
          "They maintain an implicit reference to their enclosing outer class instance, preventing the outer object from being garbage collected",
          "They are always allocated on the Stack",
          "They allocate twice the memory of normal classes"
        ],
        "correctOption": 1
      },
      {
        "question": "Why does a static collection (e.g. static List<Object> cache = new ArrayList<>()) present a major memory leak risk?",
        "options": [
          "Static references are roots in GC reachability analysis and are never collected until the ClassLoader is unloaded",
          "Static collections cannot exceed 100 elements",
          "Static collections throw OutOfMemoryError upon creation",
          "Static variables bypass JVM heap allocation"
        ],
        "correctOption": 0
      },
      {
        "question": "What happens if you mutate an object that is already stored as a key in a HashMap, altering the fields used in its hashCode() calculation?",
        "options": [
          "The HashMap automatically updates its bucket position",
          "The object cannot be found or removed using map.get() or map.remove(), creating a memory leak",
          "A ConcurrentModificationException is thrown",
          "The JVM triggers a Full GC immediately"
        ],
        "correctOption": 1
      },
      {
        "question": "Which Java class should be used to hold weak references that do not prevent their referents from being reclaimed by the Garbage Collector?",
        "options": [
          "java.lang.ref.WeakReference",
          "java.lang.ref.StrongReference",
          "java.util.AtomicReference",
          "java.lang.ThreadLocal"
        ],
        "correctOption": 0
      },
      {
        "question": "What happens when ThreadLocal variables are not cleaned up via ThreadLocal.remove() when using Thread Pools (e.g. in web servers)?",
        "options": [
          "The JVM crashes with StackOverflowError",
          "Since worker threads in a thread pool are reused across requests, stale ThreadLocal values persist, causing data leaks and memory leaks",
          "The thread pool doubles in size",
          "The socket closes abruptly"
        ],
        "correctOption": 1
      },
      {
        "question": "In Java, what does the method String.intern() return?",
        "options": [
          "A new copy on the thread stack",
          "A reference to the pooled string instance in the String Constant Pool",
          "The string hash code as a string",
          "A byte array representation"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the space complexity advantage of using char[] over String when handling passwords in memory?",
        "options": [
          "char[] allocates zero bytes of memory",
          "char[] can be explicitly overwritten with zeros (cleared) immediately after use, whereas an immutable String lingers in memory until GC runs",
          "char[] is encrypted by default",
          "Strings cannot hold special symbols"
        ],
        "correctOption": 1
      },
      {
        "question": "Which JVM tool command generates a heap memory dump (.hprof) from a running Java process PID for leak analysis?",
        "options": [
          "jcmd <PID> GC.heap_dump <file.hprof> or jmap -dump:format=b,file=heap.bin <PID>",
          "javap -c <PID>",
          "jstack -l <PID>",
          "javac -dump <PID>"
        ],
        "correctOption": 0
      }
    ]
  },
  {
    "dayNumber": 9,
    "title": "Java Track: Fast I/O, Custom Comparators & Exam Best Practices",
    "category": "Java",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# Java Track: Fast I/O, Custom Comparators & Exam Best Practices\n\nAccenture AEH coding benchmarks enforce strict 1.0s to 2.0s execution time limits. Standard `Scanner` and `System.out.println` often cause Time Limit Exceeded (TLE) on large test cases ((N = 10^5)).\n\n---\n\n## 1. High-Performance Fast I/O Template\nReplace `java.util.Scanner` with **`BufferedReader`** and **`StringTokenizer`**:\n\n```java\nimport java.io.*;\nimport java.util.*;\n\npublic class FastIO {\n    static class FastReader {\n        BufferedReader br;\n        StringTokenizer st;\n\n        public FastReader() {\n            br = new BufferedReader(new InputStreamReader(System.in));\n        }\n\n        String next() {\n            while (st == null || !st.hasMoreElements()) {\n                try {\n                    String line = br.readLine();\n                    if (line == null) return null;\n                    st = new StringTokenizer(line);\n                } catch (IOException e) {\n                    e.printStackTrace();\n                }\n            }\n            return st.nextToken();\n        }\n\n        int nextInt() { return Integer.parseInt(next()); }\n        long nextLong() { return Long.parseLong(next()); }\n        double nextDouble() { return Double.parseDouble(next()); }\n    }\n\n    public static void main(String[] args) throws IOException {\n        FastReader in = new FastReader();\n        // Use BufferedWriter or PrintWriter for fast outputs!\n        PrintWriter out = new PrintWriter(new BufferedOutputStream(System.out));\n        \n        // Solve problem...\n        out.println(\"Answer\");\n        out.flush(); // Crucial: Flush buffer before exit!\n    }\n}\n```\n\n---\n\n## 2. Custom Sorting: Comparable vs Comparator\n\n### A. `Comparable<T>` (Natural Ordering)\n- Belongs to `java.lang`. Modifies the target class.\n- Implements `public int compareTo(T other)`.\n- Contract:\n  - Return **negative** if `this < other`.\n  - Return **zero** if `this == other`.\n  - Return **positive** if `this > other`.\n\n### B. `Comparator<T>` (Multiple Custom Orderings)\n- Belongs to `java.util`. Does NOT modify target class.\n- Modern lambda syntax:\n```java\n// Sort intervals by start ascending; if equal, by end descending:\nArrays.sort(intervals, (a, b) -> {\n    if (a[0] != b[0]) return Integer.compare(a[0], b[0]);\n    return Integer.compare(b[1], a[1]); // Descending\n});\n\n// PriorityQueue Max-Heap:\nPriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());\n```\n\n> **Exam Trap:** Never use `return a - b;` for sorting if values can be negative or large!\n> `Integer.MIN_VALUE - 1` overflows to positive numbers, corrupting the sort order! Always use **`Integer.compare(a, b)`**!",
    "mcqs": [
      {
        "question": "Why is BufferedReader preferred over Scanner for competitive programming and online coding tests in Java?",
        "options": [
          "Scanner is an abstract class",
          "BufferedReader has a large 8KB default buffer and reads raw strings directly, whereas Scanner uses regex parsing and synchronized scans which is significantly slower",
          "BufferedReader cannot read integers",
          "Scanner does not support UTF-8"
        ],
        "correctOption": 1
      },
      {
        "question": "Why should you avoid using (a, b) -> a - b as a Comparator for sorting integers?",
        "options": [
          "It is rejected by the Java compiler",
          "Subtraction can cause integer arithmetic overflow when comparing numbers with opposite signs, leading to incorrect sort orders",
          "It runs in O(N^2) time complexity",
          "Lambda expressions cannot return integers"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the correct, overflow-safe method to compare two integers in a Java Comparator?",
        "options": [
          "Integer.compare(a, b)",
          "a.compareTo(b)",
          "Math.subtract(a, b)",
          "a > b ? 1 : -1 (without handling equality)"
        ],
        "correctOption": 0
      },
      {
        "question": "What is the contract return value of compareTo(T other) in java.lang.Comparable when \"this\" object is smaller than \"other\"?",
        "options": [
          "Positive integer (> 0)",
          "Zero (0)",
          "Negative integer (< 0)",
          "boolean false"
        ],
        "correctOption": 2
      },
      {
        "question": "How do you configure a Java PriorityQueue to act as a Max-Heap instead of its default Min-Heap behavior?",
        "options": [
          "new PriorityQueue<>(Collections.reverseOrder())",
          "new PriorityQueue<>(PriorityQueue.MAX_MODE)",
          "PriorityQueue cannot function as a Max-Heap",
          "new PriorityQueue<>(-1)"
        ],
        "correctOption": 0
      },
      {
        "question": "What must be called on a PrintWriter or BufferedWriter before the main method terminates to ensure all buffered output is written?",
        "options": [
          "out.flush()",
          "out.clear()",
          "out.reset()",
          "out.rewind()"
        ],
        "correctOption": 0
      },
      {
        "question": "What sorting algorithm does Arrays.sort() utilize when sorting an array of primitive integers (int[]) in Java?",
        "options": [
          "TimSort",
          "Dual-Pivot QuickSort",
          "HeapSort",
          "BubbleSort"
        ],
        "correctOption": 1
      },
      {
        "question": "What sorting algorithm does Arrays.sort() utilize when sorting an array of Objects (Object[]) in Java?",
        "options": [
          "TimSort (stable adaptive hybrid of merge sort and insertion sort)",
          "Standard QuickSort",
          "RadixSort",
          "ShellSort"
        ],
        "correctOption": 0
      },
      {
        "question": "Which method in java.lang.Integer counts the number of one-bits (set bits) in the two's complement binary representation of an int?",
        "options": [
          "Integer.bitCount(n)",
          "Integer.popCount(n)",
          "Integer.countOnes(n)",
          "Integer.getBits(n)"
        ],
        "correctOption": 0
      },
      {
        "question": "In Java, how do you convert an array of primitive characters char[] back into a String in O(N) time without overhead?",
        "options": [
          "new String(charArray)",
          "charArray.toString()",
          "Arrays.toString(charArray)",
          "String.valueOf(charArray[0])"
        ],
        "correctOption": 0
      }
    ]
  }
];
