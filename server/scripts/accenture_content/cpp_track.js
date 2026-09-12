module.exports = [
  {
    "dayNumber": 1,
    "title": "C++ Track: Pointers, References & Memory Layout",
    "category": "C++",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# C++ Track: Pointers, References & Memory Layout\n\nAccenture evaluates C++ memory architecture, stack vs heap allocation, pointer arithmetic, references vs pointers, and dangling/wild pointer diagnostics.\n\n---\n\n## 1. Process Memory Layout in C++\n\n```text\nHigh Memory  +-------------------------------------+\n             |         Stack Segment               |  (Local vars, function frames - grows DOWN)\n             |               |                     |\n             |               v                     |\n             |               ^                     |\n             |               |                     |\n             |         Heap Segment                |  (new / malloc - grows UP)\n             +-------------------------------------+\n             |   BSS Segment (Uninitialized data)  |  (Static / global vars initialized to 0)\n             +-------------------------------------+\n             |   Data Segment (Initialized data)   |  (Explicitly initialized global/static)\n             +-------------------------------------+\nLow Memory   |   Text Segment (Code)               |  (Binary machine instructions, Read-only)\n             +-------------------------------------+\n```\n\n---\n\n## 2. Pointers vs References: Key Differences\n\n| Feature | Pointer (`int*`) | Reference (`int&`) |\n| :--- | :--- | :--- |\n| **Definition** | An independent variable storing a memory address | An **alias** (alternative name) for an existing variable |\n| **Nullability** | Can be `nullptr` or point to invalid memory | **Cannot be null**; must bind to a valid object upon creation |\n| **Re-seating** | Can change target address anytime (`p = &b`) | **Cannot be re-seated**; once bound, always refers to that target |\n| **Initialization**| Can be uninitialized (Wild pointer) | **Must be initialized** immediately upon declaration |\n| **Syntax** | Requires dereference operator (`*p`) | Transparent access (used like standard variable: `ref = 10`) |\n| **Arithmetic** | Supports pointer arithmetic (`p++`, `p + 5`) | No arithmetic operations on the reference itself |\n\n---\n\n## 3. Pointer Types & Dangerous Pitfalls\n\n### A. Dangling Pointer\nOccurs when a pointer continues pointing to memory that has already been deallocated:\n```cpp\nint* ptr = new int(42);\ndelete ptr;       // Memory freed, but ptr still holds that address!\n// ptr is now a DANGLING POINTER.\nptr = nullptr;    // Best Practice: Reset immediately to nullptr!\n```\n\n### B. Wild Pointer\nAn uninitialized pointer pointing to arbitrary, unknown memory:\n```cpp\nint* ptr; // Wild pointer! Reading/writing *ptr causes undefined behavior / segfault.\n```\n\n### C. Void Pointer (`void*`)\nA generic pointer pointing to raw memory with no associated data type:\n- Cannot be dereferenced directly without explicit type casting:\n```cpp\nvoid* vPtr = &x;\ncout << *(int*)vPtr; // Cast required\n```\n\n---\n\n## 4. Parameter Passing Performance\n- **Pass-by-Value (`void func(string s)`)**: Deep copies the argument. Slow for large objects.\n- **Pass-by-Reference (`void func(string& s)`)**: Passes original object without copying. Modifies original.\n- **Pass-by-Const-Reference (`void func(const string& s)`)**: **Accenture Gold Standard**. Zero copying overhead + guarantees original object cannot be modified.",
    "mcqs": [
      {
        "question": "Which of the following statements about C++ references is FALSE?",
        "options": [
          "A reference must be initialized when it is declared",
          "A reference can be re-bound to point to a different variable later in its lifetime",
          "A reference cannot be null",
          "A reference acts as an alias for an existing object"
        ],
        "correctOption": 1
      },
      {
        "question": "What is a \"Dangling Pointer\" in C++?",
        "options": [
          "A pointer that was never initialized",
          "A pointer that points to a memory location that has already been freed or deallocated",
          "A pointer that points to another pointer",
          "A pointer to a virtual function"
        ],
        "correctOption": 1
      },
      {
        "question": "What happens when you increment an integer pointer int* ptr on a 64-bit architecture where sizeof(int) is 4 bytes?",
        "options": [
          "The memory address increases by 1 byte",
          "The memory address increases by 4 bytes (sizeof(int))",
          "The memory address increases by 8 bytes",
          "A segmentation fault occurs"
        ],
        "correctOption": 1
      },
      {
        "question": "Why is nullptr strongly preferred over NULL in modern C++ (C++11 and beyond)?",
        "options": [
          "nullptr is an integer 0",
          "nullptr is of type std::nullptr_t, providing type-safety and preventing ambiguity in function overloading between pointer and integer types",
          "nullptr allocates 16 bytes of memory",
          "NULL was removed from C++"
        ],
        "correctOption": 1
      },
      {
        "question": "Which memory segment in a C++ process layout stores dynamically allocated memory created using the new operator or malloc()?",
        "options": [
          "Stack Segment",
          "Heap Segment",
          "Data Segment",
          "Text Segment"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the most efficient parameter passing convention in C++ for large, read-only objects (such as std::vector<int> or std::string)?",
        "options": [
          "Pass by value (T val)",
          "Pass by pointer (T* val)",
          "Pass by const reference (const T& val)",
          "Pass by rvalue reference (T&& val)"
        ],
        "correctOption": 2
      },
      {
        "question": "Can a void* pointer be directly dereferenced in C++ (e.g. *vptr)?",
        "options": [
          "Yes, it defaults to dereferencing as char",
          "No, the compiler does not know the size or type of the underlying data; it must be explicitly cast to a typed pointer first",
          "Only in C++20",
          "Yes, if using constexpr"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the operator used to deallocate an array of objects dynamically allocated with new int[50] in C++?",
        "options": [
          "delete",
          "delete[]",
          "free()",
          "dealloc()"
        ],
        "correctOption": 1
      },
      {
        "question": "What is a \"Wild Pointer\" in C++?",
        "options": [
          "A pointer that points to private member variables",
          "An uninitialized pointer variable that holds an arbitrary garbage memory address",
          "A smart pointer with multiple owners",
          "A function pointer with variadic arguments"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the value of *p after the following code executes?\nint arr[] = {10, 20, 30, 40};\nint* p = arr;\np = p + 2;",
        "options": [
          "10",
          "20",
          "30",
          "40"
        ],
        "correctOption": 2
      }
    ]
  },
  {
    "dayNumber": 2,
    "title": "C++ Track: Multiple Inheritance, Diamond Problem & Virtual Destructors",
    "category": "C++",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# C++ Track: Multiple Inheritance, Diamond Problem & Virtual Destructors\n\nAccenture assesses C++ inheritance mechanics, resolving the Diamond Problem via virtual base classes, vtable layout, and virtual destructors.\n\n---\n\n## 1. Multiple Inheritance & The Diamond Problem\n\nWhen class `D` inherits from both `B` and `C`, and both `B` and `C` inherit from base class `A`:\n\n```text\n         [ A ]\n        /     \\\n     [ B ]   [ C ]\n        \\     /\n         [ D ]\n```\n\n### Without Virtual Inheritance (The Issue)\n- Class `D` inherits **two distinct copies** of class `A`'s member variables (one via `B`, one via `C`).\n- Ambiguity error: `d.x` fails to compile because the compiler cannot determine whether you mean `B::x` or `C::x`.\n- Memory waste: Object `D` contains duplicate base state in RAM.\n\n### The Solution: Virtual Base Inheritance\n```cpp\nclass A {\npublic:\n    int x;\n};\n\nclass B : virtual public A { /* ... */ };\nclass C : virtual public A { /* ... */ };\n\n// Now D contains only a SINGLE shared instance of A!\nclass D : public B, public C {\npublic:\n    void print() { cout << x; } // Unambiguous!\n};\n```\n\n---\n\n## 2. Virtual Destructors: Preventing Undefined Behavior & Leaks\n\n### Rule of Polymorphism in C++\nWhenever a class has **at least one virtual function**, its **destructor must be declared `virtual`**!\n\n```cpp\nclass Base {\npublic:\n    virtual ~Base() { cout << \"Base Destructor\n\"; } // VIRTUAL!\n};\n\nclass Derived : public Base {\n    int* buffer;\npublic:\n    Derived() { buffer = new int[1000]; }\n    ~Derived() override {\n        delete[] buffer;\n        cout << \"Derived Destructor\n\";\n    }\n};\n\n// Usage:\nBase* ptr = new Derived();\ndelete ptr; \n```\n\n### What Happens if Base Destructor is NOT Virtual?\n- When calling `delete ptr;`, the compiler performs **static binding** based on the pointer type (`Base*`).\n- Only `~Base()` executes!\n- **`~Derived()` is NEVER invoked**, permanently leaking `buffer` (memory leak and undefined behavior!).\n- With a `virtual ~Base()`, the call is dispatched through the **vtable**, correctly executing `~Derived()` first, then `~Base()`.",
    "mcqs": [
      {
        "question": "Why must a base class destructor be declared virtual in C++ if derived class objects are deleted via base class pointers?",
        "options": [
          "To make derived classes abstract",
          "To ensure the derived class destructor is called through the vtable, preventing resource leaks of derived class members",
          "To enable multiple inheritance",
          "To prevent memory fragmentation in the heap"
        ],
        "correctOption": 1
      },
      {
        "question": "How is the Diamond Problem resolved in C++ to ensure a single shared instance of the common ancestor class?",
        "options": [
          "By using multiple interface keywords",
          "By declaring the intermediate derived classes with virtual inheritance (e.g. class B : virtual public A)",
          "By making all methods static",
          "By using reinterpret_cast"
        ],
        "correctOption": 1
      },
      {
        "question": "In C++, what does the vptr (virtual pointer) of an object point to?",
        "options": [
          "The derived class constructor",
          "The Virtual Method Table (vtable) of the object's actual runtime type",
          "The top of the execution stack",
          "The first member variable"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the size of an empty class in C++ (class Empty {}; sizeof(Empty))?",
        "options": [
          "0 bytes",
          "At least 1 byte (to ensure unique memory addresses for distinct instances)",
          "4 bytes",
          "8 bytes"
        ],
        "correctOption": 1
      },
      {
        "question": "What occurs during object construction in an inheritance hierarchy in C++?",
        "options": [
          "Derived constructor executes before Base constructor",
          "Base class constructor executes first, followed by Derived class constructor",
          "Both constructors run concurrently in separate threads",
          "Only the most derived constructor executes"
        ],
        "correctOption": 1
      },
      {
        "question": "In what order do destructors execute when a derived class object is destroyed?",
        "options": [
          "Base destructor executes first, followed by Derived destructor",
          "Derived destructor executes first, followed by Base destructor",
          "The execution order is random",
          "Destructors do not execute unless explicitly invoked"
        ],
        "correctOption": 1
      },
      {
        "question": "What specifier in C++11 ensures that a virtual function cannot be overridden any further in subsequent derived classes?",
        "options": [
          "override",
          "final",
          "sealed",
          "const"
        ],
        "correctOption": 1
      },
      {
        "question": "What specifier in C++11 explicitly tells the compiler that a member function is intended to override a virtual function in a base class?",
        "options": [
          "virtual",
          "override",
          "implements",
          "extends"
        ],
        "correctOption": 1
      },
      {
        "question": "What happens if a class defines a constructor with parameters, but does NOT define a default parameterless constructor?",
        "options": [
          "The compiler generates an implicit default constructor automatically",
          "The class has no default constructor; instantiating it without parameters causes a compilation error",
          "All member variables are initialized to zero",
          "The class becomes abstract"
        ],
        "correctOption": 1
      },
      {
        "question": "Can a constructor be declared as virtual in C++?",
        "options": [
          "Yes, to enable runtime object instantiation",
          "No, a constructor cannot be virtual because an object must be fully constructed before a vtable pointer can exist",
          "Only in abstract classes",
          "Only if marked inline"
        ],
        "correctOption": 1
      }
    ]
  },
  {
    "dayNumber": 3,
    "title": "C++ Track: STL Containers, Iterators & std::vector Internals",
    "category": "C++",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# C++ Track: STL Containers, Iterators & std::vector Internals\n\nAccenture deeply tests STL container mechanics, `std::vector` geometric expansion, iterator invalidation rules, and `std::map` (Red-Black tree) vs `std::unordered_map` (Hash table).\n\n---\n\n## 1. `std::vector` Internal Architecture\n\n`std::vector` is a dynamically resizable contiguous array governed by three internal pointers:\n```text\n[ First Element ] ... [ Last Element ] ... [ Capacity Boundary ]\n       ^                      ^                         ^\n       |                      |                         |\n   _Myfirst                _Mylast                   _Myend\n (begin pointer)        (end pointer)          (capacity pointer)\n```\n\n- **`size()`**: Number of currently active elements (`_Mylast - _Myfirst`).\n- **`capacity()`**: Total allocated slots before a re-allocation is forced (`_Myend - _Myfirst`).\n- **Growth Factor**: When full, vector allocates a new memory block **(2 \times)** (GCC/Clang) or **(1.5 \times)** (MSVC), copies/moves elements over, and frees old memory.\n  - Guarantees **Amortized (O(1))** insertion time for `push_back()`.\n- **Optimization Trick**: Use **`v.reserve(N)`** in advance if (N) is known! Eliminates costly re-allocations and copies.\n\n---\n\n## 2. Iterator Invalidation Rules\n\nModifying a container can render active iterators, pointers, and references invalid (causing segmentation faults):\n\n1. **`std::vector`**:\n   - If `push_back()` causes a capacity reallocation (\rightarrow) **ALL iterators, pointers, and references are invalidated**!\n   - If no reallocation occurs (\rightarrow) iterators after insertion point are invalidated.\n2. **`std::deque`**:\n   - Insertion at either end invalidates iterators, but references to existing elements remain valid.\n3. **`std::list` / `std::map` / `std::set` / `std::unordered_map`**:\n   - Node-based containers: Inserting or erasing an element **NEVER invalidates iterators to other elements** (only iterators pointing to the deleted node are invalidated!).\n\n---\n\n## 3. Ordered Map (`std::map`) vs Hash Map (`std::unordered_map`)\n\n| Feature | `std::map` | `std::unordered_map` |\n| :--- | :--- | :--- |\n| **Underlying Structure**| Self-balancing **Red-Black Tree** | **Hash Table** with buckets |\n| **Search Time** | **(O(log N))** guaranteed | **(O(1))** average; (O(N)) worst-case |\n| **Element Order** | Strictly sorted by key (in-order traversal) | Arbitrary order |\n| **Key Requirements** | Requires `operator<` (Strict Weak Ordering) | Requires `std::hash<K>` and `operator==` |\n| **Memory Overhead** | 3 pointers (`left`, `right`, `parent`) + color per node | Bucket array + collision linked-list pointers |",
    "mcqs": [
      {
        "question": "What is the internal data structure used by std::map in the C++ Standard Template Library?",
        "options": [
          "Hash Table",
          "Balanced Red-Black Tree",
          "Doubly Linked List",
          "Dynamic Array"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the amortized time complexity of inserting an element at the end of a std::vector using push_back()?",
        "options": [
          "O(1)",
          "O(log N)",
          "O(N)",
          "O(N log N)"
        ],
        "correctOption": 0
      },
      {
        "question": "What happens to iterators pointing to a std::vector when push_back() causes its size to exceed its current capacity?",
        "options": [
          "Only the end() iterator is updated",
          "All existing iterators, pointers, and references to vector elements are invalidated because memory is reallocated",
          "Iterators remain permanently valid",
          "The vector converts into a std::deque"
        ],
        "correctOption": 1
      },
      {
        "question": "Which method should be used to pre-allocate memory for a std::vector to avoid multiple costly reallocations when the element count is known?",
        "options": [
          "v.resize(n)",
          "v.reserve(n)",
          "v.assign(n)",
          "v.shrink_to_fit()"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the average and worst-case time complexity of searching for a key in a std::unordered_map?",
        "options": [
          "Average O(log N), Worst O(N)",
          "Average O(1), Worst O(N)",
          "Average O(1), Worst O(log N)",
          "Average O(N), Worst O(N^2)"
        ],
        "correctOption": 1
      },
      {
        "question": "Which STL container provides O(1) constant time insertion and deletion at BOTH the front and back?",
        "options": [
          "std::vector",
          "std::deque",
          "std::priority_queue",
          "std::stack"
        ],
        "correctOption": 1
      },
      {
        "question": "In node-based STL containers like std::set and std::map, does inserting a new element invalidate existing iterators pointing to other nodes?",
        "options": [
          "Yes, all iterators are invalidated",
          "No, iterators to other elements remain completely valid because nodes are allocated independently on the heap",
          "Only const iterators remain valid",
          "Only the root iterator is invalidated"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the default underlying container used by std::priority_queue in C++?",
        "options": [
          "std::list",
          "std::deque",
          "std::vector",
          "std::set"
        ],
        "correctOption": 2
      },
      {
        "question": "What operator must a custom class implement to be used as a key in std::set or std::map?",
        "options": [
          "operator==",
          "operator< (Strict Weak Ordering)",
          "operator!=",
          "operator>="
        ],
        "correctOption": 1
      },
      {
        "question": "What is the difference between vector.resize(n) and vector.reserve(n)?",
        "options": [
          "reserve changes the capacity without creating elements; resize alters both size and capacity, initializing new elements",
          "resize only changes capacity",
          "reserve initializes elements to zero",
          "Both methods are completely identical"
        ],
        "correctOption": 0
      }
    ]
  },
  {
    "dayNumber": 4,
    "title": "C++ Track: Smart Pointers (unique_ptr, shared_ptr, weak_ptr) & RAII",
    "category": "C++",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# C++ Track: Smart Pointers (unique_ptr, shared_ptr, weak_ptr) & RAII\n\nAccenture tests modern C++ memory management, the RAII (Resource Acquisition Is Initialization) idiom, ownership semantics, and circular reference resolution.\n\n---\n\n## 1. The RAII Idiom (Resource Acquisition Is Initialization)\n- **Core Principle**: Bind the lifecycle of a resource (heap memory, file descriptor, database connection, mutex lock) to the **lifetime of a stack-allocated object**.\n- **Constructor**: Acquires the resource.\n- **Destructor**: Automatically releases the resource when the object falls out of scope (even during exceptions!).\n\n---\n\n## 2. The Three Modern Smart Pointers (`<memory>`)\n\n### A. `std::unique_ptr<T>` (Exclusive Ownership)\n- Owns and manages another object through a pointer and disposes of that object when the `unique_ptr` goes out of scope.\n- **Zero Overhead**: Same memory footprint and speed as a raw pointer (`sizeof(unique_ptr) == sizeof(void*)`).\n- **Non-Copyable, Move-Only**: Copy constructor is `= delete`. Ownership is transferred via **`std::move()`**:\n```cpp\nauto p1 = std::make_unique<int>(100);\n// auto p2 = p1;            // COMPILE ERROR! Cannot copy.\nauto p2 = std::move(p1);    // OK: p1 is now nullptr, p2 owns the memory.\n```\n\n### B. `std::shared_ptr<T>` (Shared Reference-Counted Ownership)\n- Multiple `shared_ptr` instances can share ownership of the same resource.\n- Uses a **Control Block** containing:\n  - **Strong Reference Count**: Number of active `shared_ptr` instances.\n  - **Weak Reference Count**: Number of active `weak_ptr` instances.\n- Memory is released when the strong reference count reaches **zero**.\n- Always instantiate via **`std::make_shared<T>()`** (allocates object and control block in a single contiguous memory chunk!).\n\n### C. `std::weak_ptr<T>` (Non-Owning Observer)\n- Holds a non-owning reference to an object managed by `std::shared_ptr`.\n- Does NOT increment the strong reference count.\n- **Critical Use Case: Breaking Circular References!**\n  - If Object A holds `shared_ptr<B>` and Object B holds `shared_ptr<A>`, their reference counts will never drop to 0 (\rightarrow) permanent memory leak!\n  - Changing one reference to `std::weak_ptr` breaks the cycle.\n- Accessing value: Must call **`wp.lock()`** which returns a `std::shared_ptr<T>` (or `nullptr` if object was deleted).",
    "mcqs": [
      {
        "question": "What is the primary characteristic of std::unique_ptr in C++?",
        "options": [
          "It allows shared ownership using reference counting",
          "It enforces exclusive ownership; it cannot be copied, only moved using std::move()",
          "It has a 32-byte overhead over raw pointers",
          "It requires manual invocation of delete"
        ],
        "correctOption": 1
      },
      {
        "question": "Why should you prefer std::make_shared<T>() over std::shared_ptr<T>(new T())?",
        "options": [
          "make_shared creates an immutable pointer",
          "make_shared allocates both the managed object and the reference-counting control block in a single contiguous memory block, improving cache locality and performance",
          "make_shared allows circular references",
          "make_shared bypasses thread synchronization"
        ],
        "correctOption": 1
      },
      {
        "question": "What happens when two objects managed by std::shared_ptr hold shared_ptr references to each other (Circular Reference)?",
        "options": [
          "The compiler detects it and throws an error",
          "A memory leak occurs because neither object's reference count can ever reach zero",
          "The objects are automatically deleted when main() terminates",
          "A segmentation fault occurs during instantiation"
        ],
        "correctOption": 1
      },
      {
        "question": "How does std::weak_ptr resolve the Circular Reference problem between std::shared_ptr instances?",
        "options": [
          "By destroying the object immediately",
          "By referencing the managed object without incrementing the strong reference count, allowing the reference count to reach zero and deallocate normally",
          "By converting heap memory to stack memory",
          "By using raw C pointers internally"
        ],
        "correctOption": 1
      },
      {
        "question": "How do you safely access and use the object referenced by a std::weak_ptr wp?",
        "options": [
          "*wp directly",
          "By calling wp.lock(), which returns a valid std::shared_ptr if the object is still alive",
          "wp.get()",
          "wp.release()"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the memory size overhead of a std::unique_ptr with a default deleter compared to a raw pointer on a 64-bit architecture?",
        "options": [
          "Zero overhead (both are 8 bytes)",
          "8 bytes extra",
          "16 bytes extra",
          "32 bytes extra"
        ],
        "correctOption": 0
      },
      {
        "question": "What fundamental C++ design idiom ties resource management (memory, file handles, locks) directly to object lifetime and stack scope?",
        "options": [
          "PIMPL Idiom",
          "RAII (Resource Acquisition Is Initialization)",
          "Curiously Recurring Template Pattern (CRTP)",
          "Dynamic Binding"
        ],
        "correctOption": 1
      },
      {
        "question": "What does the method uniquePtr.release() do?",
        "options": [
          "Deallocates the managed memory immediately",
          "Relinquishes ownership and returns the raw pointer without deleting the underlying object",
          "Resets the pointer to nullptr and calls the destructor",
          "Throws an exception"
        ],
        "correctOption": 1
      },
      {
        "question": "What does uniquePtr.reset(newPtr) perform?",
        "options": [
          "Destroys the currently managed object and takes ownership of newPtr",
          "Creates a duplicate copy of the object",
          "Shares ownership with newPtr",
          "Sets memory bytes to zero"
        ],
        "correctOption": 0
      },
      {
        "question": "Can std::unique_ptr be stored inside a standard STL container like std::vector<std::unique_ptr<T>>?",
        "options": [
          "No, STL containers require all elements to be copyable",
          "Yes, provided elements are moved into the vector using std::move() or created directly with emplace_back()",
          "Only if T is an integer",
          "Only with custom allocators"
        ],
        "correctOption": 1
      }
    ]
  },
  {
    "dayNumber": 5,
    "title": "C++ Track: Concurrency, std::thread, std::mutex & std::atomic",
    "category": "C++",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# C++ Track: Concurrency, std::thread, std::mutex & std::atomic\n\nAccenture AEH evaluates C++11 multithreading, `std::thread` lifecycle (`join` vs `detach`), RAII lock management (`std::lock_guard` vs `std::unique_lock`), race conditions, and lock-free programming with `std::atomic`.\n\n---\n\n## 1. `std::thread` Basics: `join()` vs `detach()`\n\n```cpp\n#include <thread>\nvoid worker(int id) { /* do work */ }\n\nint main() {\n    std::thread t(worker, 1);\n    \n    // Rule: Every std::thread MUST be either joined or detached before its destructor executes!\n    // If neither is called, std::terminate is invoked -> program crashes!\n    t.join(); // Blocks caller until thread t terminates.\n    // OR: t.detach(); // Separates thread of execution from object; runs in background.\n}\n```\n\n---\n\n## 2. Synchronization: `std::mutex` and RAII Locks\n\nA **Race Condition** occurs when two or more threads access shared data concurrently and at least one access is a write.\n\n### A. `std::lock_guard<std::mutex>`\n- Lightweight RAII wrapper. Locks mutex on construction; automatically unlocks on destruction (when exiting scope).\n```cpp\nstd::mutex mtx;\nint counter = 0;\n\nvoid increment() {\n    std::lock_guard<std::mutex> lock(mtx); // Unlocks automatically on return/throw!\n    counter++;\n}\n```\n\n### B. `std::unique_lock<std::mutex>`\n- More flexible than `lock_guard`: supports explicit `.lock()`, `.unlock()`, deferred locking, and is **mandatory for `std::condition_variable`**!\n\n---\n\n## 3. `std::atomic<T>` & Lock-Free Programming\nFor primitive scalar variables, mutex locking has heavy kernel context-switch overhead:\n- **`std::atomic<T>`** utilizes hardware CPU atomic instructions (e.g. `CMPXCHG` / Compare-And-Swap):\n```cpp\n#include <atomic>\nstd::atomic<int> counter{0};\n\nvoid increment() {\n    counter++; // Thread-safe, lock-free atomic increment!\n}\n```\n\n---\n\n## 4. Condition Variables (`std::condition_variable`)\nEnables threads to synchronize based on state conditions (Producer-Consumer pattern):\n```cpp\nstd::condition_variable cv;\nstd::mutex mtx;\nbool ready = false;\n\nvoid consumer() {\n    std::unique_lock<std::mutex> lock(mtx);\n    // Predicate guards against spurious wakeups!\n    cv.wait(lock, [] { return ready; });\n    // Process data...\n}\n\nvoid producer() {\n    {\n        std::lock_guard<std::mutex> lock(mtx);\n        ready = true;\n    }\n    cv.notify_one(); // or notify_all()\n}\n```",
    "mcqs": [
      {
        "question": "What happens if a std::thread object is destroyed without either join() or detach() being called on it?",
        "options": [
          "The thread continues running silently in background",
          "std::terminate is invoked, terminating the entire application",
          "The thread automatically joins",
          "A compilation error occurs"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the primary advantage of std::lock_guard over manually invoking mtx.lock() and mtx.unlock()?",
        "options": [
          "It runs on a separate GPU core",
          "It uses RAII to guarantee that the mutex is always unlocked when leaving scope, even if an exception is thrown",
          "It allows recursive locking of the same mutex",
          "It converts mutexes to spinlocks"
        ],
        "correctOption": 1
      },
      {
        "question": "Why must std::unique_lock (rather than std::lock_guard) be used in conjunction with std::condition_variable::wait()?",
        "options": [
          "lock_guard cannot accept mutexes",
          "condition_variable needs the ability to unlock the mutex while waiting and re-lock it upon waking up, which only unique_lock supports",
          "unique_lock does not allocate memory",
          "lock_guard causes deadlocks with atomic variables"
        ],
        "correctOption": 1
      },
      {
        "question": "How does std::atomic achieve thread-safety without using mutex locks?",
        "options": [
          "By queuing requests in a disk buffer",
          "By leveraging low-level hardware CPU atomic instructions such as Compare-And-Swap (CAS)",
          "By pausing all other threads",
          "By duplicating the variable across all CPU caches"
        ],
        "correctOption": 1
      },
      {
        "question": "What is a \"Race Condition\" in concurrent programming?",
        "options": [
          "Two threads running at different CPU clock speeds",
          "A flaw where the output depends on the non-deterministic execution order or timing of concurrent threads accessing shared mutable data",
          "A thread running in an infinite loop",
          "A deadlock caused by circular wait"
        ],
        "correctOption": 1
      },
      {
        "question": "What does cv.notify_all() perform on a std::condition_variable cv?",
        "options": [
          "Wakes up all threads currently waiting on the condition variable",
          "Wakes up only the highest priority thread",
          "Resets the mutex state to unlocked",
          "Destroys the condition variable"
        ],
        "correctOption": 0
      },
      {
        "question": "Which mutex type in C++ allows the SAME thread to acquire the lock multiple times recursively without deadlocking?",
        "options": [
          "std::mutex",
          "std::recursive_mutex",
          "std::shared_mutex",
          "std::timed_mutex"
        ],
        "correctOption": 1
      },
      {
        "question": "Which C++17 mutex type allows multiple threads to hold a shared read lock simultaneously while providing exclusive access for writes?",
        "options": [
          "std::mutex",
          "std::shared_mutex",
          "std::atomic_mutex",
          "std::recursive_mutex"
        ],
        "correctOption": 1
      },
      {
        "question": "Why should condition_variable::wait() always be used with a predicate (or inside a while loop)?",
        "options": [
          "To prevent memory fragmentation",
          "To guard against spurious wakeups where a waiting thread unblocks without receiving an explicit notification signal",
          "To increase CPU cache hits",
          "Because wait() requires a boolean return"
        ],
        "correctOption": 1
      },
      {
        "question": "What header file must be included to utilize std::thread and std::mutex in C++?",
        "options": [
          "<concurrency> and <locks>",
          "<thread> and <mutex>",
          "<parallel> and <atomic>",
          "<pthread.h> exclusively"
        ],
        "correctOption": 1
      }
    ]
  },
  {
    "dayNumber": 6,
    "title": "C++ Track: Move Semantics, Rvalue References (&&) & std::move",
    "category": "C++",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# C++ Track: Move Semantics, Rvalue References (&&) & std::move\n\nAccenture AEH rounds test C++11 Move Semantics, Lvalues vs Rvalues, `std::move` cast mechanics, Rule of 0/3/5, and Perfect Forwarding.\n\n---\n\n## 1. Lvalues vs Rvalues\n\n- **Lvalue (Locator Value)**: An expression with an identifiable memory address (can appear on the left of an assignment `=`). Has a name and persistent storage:\n  ```cpp\n  int x = 10;      // x is an lvalue\n  int& ref = x;    // lvalue reference\n  ```\n- **Rvalue**: A temporary, expiring value that has no persistent memory address (appears on the right of `=`):\n  ```cpp\n  int y = x + 5;   // (x + 5) is a temporary rvalue\n  string s = string(\"temp\"); // temporary object\n  ```\n- **Rvalue Reference (`T&&`)**: Binds strictly to temporary rvalues, enabling **resource stealing**!\n\n---\n\n## 2. Move Semantics: Stealing Resources\nInstead of performing an expensive deep copy of heap buffers:\n- **Move Constructor**: Transfers (steals) the pointer from the source object and sets the source's pointer to `nullptr`!\n```cpp\nclass MyVector {\n    int* data;\n    size_t size;\npublic:\n    // Copy Constructor: Expensive O(N) heap allocation and copy\n    MyVector(const MyVector& other) : size(other.size) {\n        data = new int[size];\n        std::copy(other.data, other.data + size, data);\n    }\n\n    // Move Constructor: Ultra-fast O(1) pointer swap!\n    MyVector(MyVector&& other) noexcept : data(other.data), size(other.size) {\n        other.data = nullptr; // Leave source in valid destructible state!\n        other.size = 0;\n    }\n};\n```\n\n---\n\n## 3. What does `std::move` Actually Do?\n> **Key Accenture Exam Fact:** `std::move` does **NOT move anything**!\n> `std::move` is simply an unconditional **static_cast to an rvalue reference (`static_cast<T&&>(var)`)**!\n> It tells the compiler: *\"Treat this lvalue as a temporary rvalue so its move constructor can be invoked.\"*\n\n---\n\n## 4. The Rule of 0 / 3 / 5\nIf your class directly manages a raw resource:\n- **Rule of 3 (C++98)**: If you define any of: **Destructor**, **Copy Constructor**, or **Copy Assignment Operator**, you must define all three.\n- **Rule of 5 (Modern C++)**: Add the **Move Constructor** and **Move Assignment Operator**.\n- **Rule of 0 (Best Practice)**: Use standard types (`std::vector`, `std::string`, `std::unique_ptr`) so you don't need to write custom destructors or copy/move operators at all!",
    "mcqs": [
      {
        "question": "What does std::move(x) actually perform in C++?",
        "options": [
          "It copies memory bytes in the background",
          "It performs an unconditional cast of x to an rvalue reference (static_cast<T&&>(x)) without copying any data",
          "It deletes the variable x from memory immediately",
          "It moves the object to CPU cache"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the performance advantage of a Move Constructor over a Copy Constructor for classes managing dynamic heap memory?",
        "options": [
          "Move Constructor executes on multiple threads",
          "Move Constructor transfers ownership of raw pointers in O(1) time without allocating new heap memory or copying buffer elements",
          "Move Constructor eliminates the destructor call",
          "Move Constructor avoids using registers"
        ],
        "correctOption": 1
      },
      {
        "question": "What state must the source object be left in after its resources are stolen by a Move Constructor or Move Assignment operator?",
        "options": [
          "A corrupted state",
          "A valid, destructible (and typically empty) state, such as setting pointers to nullptr",
          "The exact same state as before",
          "Deallocated immediately"
        ],
        "correctOption": 1
      },
      {
        "question": "Which of the following expressions is an Rvalue in C++?",
        "options": [
          "int x = 5; (variable x)",
          "A temporary result: (a + b)",
          "A named global variable",
          "A function returning an lvalue reference (T&)"
        ],
        "correctOption": 1
      },
      {
        "question": "What constitutes the \"Rule of 5\" in modern C++ resource management?",
        "options": [
          "Destructor, Copy Constructor, Copy Assignment, Move Constructor, Move Assignment",
          "Constructor, Virtual Destructor, Clone, Equals, Hash",
          "Public, Private, Protected, Virtual, Friend",
          "New, Delete, Malloc, Free, Calloc"
        ],
        "correctOption": 0
      },
      {
        "question": "Why should Move Constructors and Move Assignment Operators almost always be marked noexcept?",
        "options": [
          "To prevent compiler warnings",
          "To allow standard library containers (like std::vector) to safely use move operations during reallocation instead of falling back to copying",
          "Because move operations cannot throw hardware faults",
          "noexcept is mandatory for all constructors in C++11"
        ],
        "correctOption": 1
      },
      {
        "question": "What type of reference is declared using double ampersands (T&&)?",
        "options": [
          "Pointer to reference",
          "Rvalue reference",
          "Const reference",
          "Universal pointer"
        ],
        "correctOption": 1
      },
      {
        "question": "What does std::forward<T>(arg) perform in template programming?",
        "options": [
          "Always converts arg to an rvalue",
          "Performs perfect forwarding: casts arg to an rvalue if T is an rvalue, preserving the original value category (lvalue vs rvalue)",
          "Moves arg to the next function frame",
          "Prints arg to std::cout"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the \"Rule of Zero\" in C++ software design?",
        "options": [
          "Classes should have zero member variables",
          "Classes should rely on RAII wrapper types (like smart pointers and STL containers) so they do not need to declare custom destructors, copy, or move operations",
          "Classes cannot have virtual functions",
          "Pointers must be initialized to 0"
        ],
        "correctOption": 1
      },
      {
        "question": "Can an rvalue reference (T&&) bind directly to an lvalue variable without using std::move()?",
        "options": [
          "Yes, automatically",
          "No, binding an rvalue reference to an lvalue causes a compilation error",
          "Only if the variable is const",
          "Only in C++98"
        ],
        "correctOption": 1
      }
    ]
  },
  {
    "dayNumber": 7,
    "title": "C++ Track: Software Design Patterns & Idioms (Meyers Singleton, Factory)",
    "category": "C++",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# C++ Track: Software Design Patterns & Idioms (Meyers Singleton, Factory)\n\nAccenture tests C++ specific idioms: Meyers Singleton (thread-safe static local), Factory Pattern, PIMPL (Pointer to Implementation) idiom for compilation firewalls, and RAII wrappers.\n\n---\n\n## 1. Meyers Singleton (The C++11 Gold Standard)\n\nIn C++11 and later, initialization of function-local static variables is **guaranteed to be thread-safe by the language standard**:\n\n```cpp\nclass Singleton {\nprivate:\n    Singleton() { /* private constructor */ }\n    ~Singleton() = default;\n\npublic:\n    // Delete copy and move operations!\n    Singleton(const Singleton&) = delete;\n    Singleton& operator=(const Singleton&) = delete;\n    Singleton(Singleton&&) = delete;\n    Singleton& operator=(Singleton&&) = delete;\n\n    static Singleton& getInstance() {\n        // Initialized ONCE upon first execution in a thread-safe manner!\n        static Singleton instance;\n        return instance;\n    }\n};\n```\n\n---\n\n## 2. Factory Pattern with Smart Pointers\n\nEncapsulates object creation and returns `std::unique_ptr` to enforce clean polymorphic ownership:\n\n```cpp\n#include <memory>\nclass Shape {\npublic:\n    virtual void draw() = 0;\n    virtual ~Shape() = default;\n};\n\nclass Circle : public Shape {\npublic:\n    void draw() override { cout << \"Drawing Circle\n\"; }\n};\n\nclass Square : public Shape {\npublic:\n    void draw() override { cout << \"Drawing Square\n\"; }\n};\n\nclass ShapeFactory {\npublic:\n    static std::unique_ptr<Shape> createShape(const string& type) {\n        if (type == \"circle\") return std::make_unique<Circle>();\n        if (type == \"square\") return std::make_unique<Square>();\n        return nullptr;\n    }\n};\n```\n\n---\n\n## 3. The PIMPL Idiom (Pointer to Implementation)\nAlso known as the **Compilation Firewall**:\n- **Problem in C++**: Modifying a private member variable in `Widget.h` requires recompiling **every single file** that includes `Widget.h`!\n- **Solution**: Move all private implementation details and third-party headers into a separate struct `Impl` defined strictly in `Widget.cpp`. `Widget.h` holds only a forward declaration and a `std::unique_ptr<Impl>`:\n\n```cpp\n// Widget.h\nclass Widget {\n    struct Impl;                     // Forward declaration\n    std::unique_ptr<Impl> pImpl;     // Pointer to implementation\npublic:\n    Widget();\n    ~Widget();\n    void doWork();\n};\n```",
    "mcqs": [
      {
        "question": "Why is Meyers Singleton implementation guaranteed to be thread-safe in C++11 without requiring explicit mutex locks?",
        "options": [
          "It runs in a critical section managed by the OS",
          "The C++11 standard mandates that static local variables inside functions must be initialized in a thread-safe manner with compiler-generated guard variables",
          "It uses hardware transactional memory",
          "It cannot be called by multiple threads"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the primary architectural benefit of using the PIMPL (Pointer to Implementation) idiom in C++?",
        "options": [
          "It eliminates virtual function call overhead",
          "It acts as a compilation firewall, decoupling implementation details and preventing widespread recompilation when private members change",
          "It enables garbage collection",
          "It allows private variables to be accessed globally"
        ],
        "correctOption": 1
      },
      {
        "question": "What return type is recommended for modern C++ factory methods that instantiate polymorphic objects?",
        "options": [
          "Raw pointer (T*)",
          "std::unique_ptr<Base>",
          "std::vector<Base>",
          "void*"
        ],
        "correctOption": 1
      },
      {
        "question": "Why must the copy constructor and copy assignment operator be explicitly deleted (= delete) in a Singleton class in C++?",
        "options": [
          "To prevent memory fragmentation",
          "To prevent callers from cloning or making duplicate instances of the single object",
          "Because C++ does not allow copying classes with private constructors",
          "To save stack space"
        ],
        "correctOption": 1
      },
      {
        "question": "Why must the destructor of a class utilizing the PIMPL idiom with std::unique_ptr<Impl> be defined in the .cpp file where Impl is complete?",
        "options": [
          "To avoid duplicate symbol linker errors",
          "Because std::unique_ptr's default deleter requires the full definition of Impl to invoke sizeof and delete; in the header, Impl is an incomplete type",
          "Because destructors cannot be inlined",
          "To prevent circular inheritance"
        ],
        "correctOption": 1
      },
      {
        "question": "Which design pattern provides an interface for creating families of related or dependent objects without specifying their concrete classes?",
        "options": [
          "Abstract Factory Pattern",
          "Adapter Pattern",
          "Singleton Pattern",
          "State Pattern"
        ],
        "correctOption": 0
      },
      {
        "question": "In C++, what does the keyword explicit do when applied to a single-argument constructor?",
        "options": [
          "Makes the constructor inline",
          "Prevents implicit type conversions and copy-initialization",
          "Permits multiple inheritance",
          "Makes the class abstract"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the Curiously Recurring Template Pattern (CRTP) primarily used for in C++?",
        "options": [
          "Static (compile-time) polymorphism without the vtable runtime performance overhead",
          "Handling exception handling in threads",
          "Creating circular linked lists",
          "Dynamic downcasting"
        ],
        "correctOption": 0
      },
      {
        "question": "What pattern encapsulates a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations?",
        "options": [
          "Command Pattern",
          "Facade Pattern",
          "Decorator Pattern",
          "Proxy Pattern"
        ],
        "correctOption": 0
      },
      {
        "question": "Which C++ smart pointer is typically used to manage the pImpl pointer in a class implementing the PIMPL idiom?",
        "options": [
          "std::weak_ptr",
          "std::shared_ptr",
          "std::unique_ptr",
          "std::auto_ptr"
        ],
        "correctOption": 2
      }
    ]
  },
  {
    "dayNumber": 8,
    "title": "C++ Track: Templates, Generic Programming & Type Traits",
    "category": "C++",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# C++ Track: Templates, Generic Programming & Type Traits\n\nAccenture assesses C++ function and class templates, template specialization (full vs partial), `constexpr`, SFINAE, and `type_traits`.\n\n---\n\n## 1. Function & Class Templates\n\nTemplates allow writing code independent of any particular data type:\n```cpp\n// Function Template:\ntemplate <typename T>\nT myMax(T a, T b) {\n    return (a > b) ? a : b;\n}\n\n// Class Template:\ntemplate <typename T, int Capacity = 100>\nclass Stack {\n    T arr[Capacity];\n    int top = -1;\npublic:\n    void push(T val) { arr[++top] = val; }\n    T pop() { return arr[top--]; }\n};\n```\n\n---\n\n## 2. Template Specialization\n\n### A. Full (Explicit) Specialization\nCustom implementation for a specific concrete type:\n```cpp\ntemplate <>\nclass Stack<bool> {\n    // Bit-vector optimization for booleans (like std::vector<bool>)!\n};\n```\n\n### B. Partial Specialization\nSpecializing only a subset of template parameters or matching patterns (pointers, references):\n```cpp\n// Primary template:\ntemplate <typename T>\nstruct Printer {\n    static void print(T val) { cout << val; }\n};\n\n// Partial Specialization for any pointer type (T*):\ntemplate <typename T>\nstruct Printer<T*> {\n    static void print(T* ptr) {\n        if (ptr) cout << *ptr;\n    }\n};\n```\n> **Rule:** C++ allows **partial specialization for Class templates**, but **NOT for Function templates**! Function templates use standard function overloading.\n\n---\n\n## 3. Compile-Time Computation: `constexpr`\nEvaluates expressions and functions at **compile-time**, embedding results directly into the binary:\n```cpp\nconstexpr int factorial(int n) {\n    return (n <= 1) ? 1 : (n * factorial(n - 1));\n}\n\nint arr[factorial(5)]; // Valid! Array of size 120 compiled at compile time!\n```\n\n---\n\n## 4. Type Traits (`<type_traits>`) & SFINAE\n- Inspects and modifies types at compile time:\n  - `std::is_integral<T>::value`\n  - `std::is_pointer<T>::value`\n  - `std::is_same<T, U>::value`\n- **SFINAE (Substitution Failure Is Not An Error)**: If a substituted template argument fails to compile for a specific overload, the compiler simply discards that candidate without throwing a compilation error.",
    "mcqs": [
      {
        "question": "Does C++ allow Partial Specialization of Function Templates?",
        "options": [
          "Yes, fully supported",
          "No, C++ supports partial specialization only for Class templates; function templates must use function overloading instead",
          "Only if the return type is void",
          "Only with C++20 concepts"
        ],
        "correctOption": 1
      },
      {
        "question": "What does the constexpr specifier indicate when applied to a function in C++?",
        "options": [
          "The function can only be called from a single thread",
          "The function can be evaluated at compile time if its arguments are compile-time constants",
          "The function is private to the file",
          "The function has constant execution time O(1)"
        ],
        "correctOption": 1
      },
      {
        "question": "What does the acronym SFINAE stand for in C++ template metaprogramming?",
        "options": [
          "Static Function Inlining And Namespace Allocation Error",
          "Substitution Failure Is Not An Error",
          "Standard Format Interface Network Access Engine",
          "Stack Frame Instruction Node Address Execution"
        ],
        "correctOption": 1
      },
      {
        "question": "Which header in standard C++ provides compile-time type inspection tools like std::is_integral and std::is_same?",
        "options": [
          "<typeinfo>",
          "<type_traits>",
          "<templates>",
          "<concepts>"
        ],
        "correctOption": 1
      },
      {
        "question": "What is the syntax for declaring a Full (Explicit) Template Specialization of a class template TemplateName<T> for type int?",
        "options": [
          "template <typename int> class TemplateName",
          "template <> class TemplateName<int>",
          "template <class int> class TemplateName",
          "specialized template TemplateName<int>"
        ],
        "correctOption": 1
      },
      {
        "question": "Where must template definitions typically be placed in C++ projects to avoid linker errors?",
        "options": [
          "Inside .cpp implementation files exclusively",
          "Inside header files (.h or .hpp) so the compiler can instantiate the template code when parsing each translation unit",
          "Inside makefiles",
          "In shared dynamic libraries (.so / .dll)"
        ],
        "correctOption": 1
      },
      {
        "question": "What does std::decay<T>::type perform in C++ type traits?",
        "options": [
          "Deallocates heap memory",
          "Applies the conversions that take place when arguments are passed by value: strips const/volatile and converts array/function types to pointers",
          "Converts integers to floats",
          "Reduces precision"
        ],
        "correctOption": 1
      },
      {
        "question": "What C++20 feature provides named compile-time predicates to constrain template arguments with clean, readable compiler error messages?",
        "options": [
          "Concepts",
          "Macros",
          "Virtual templates",
          "Dynamic traits"
        ],
        "correctOption": 0
      },
      {
        "question": "What is a Non-Type Template Parameter (NTTP) in C++?",
        "options": [
          "A template parameter that is a value (e.g. template <int N>) rather than a type",
          "A parameter that accepts any pointer",
          "A template that does not accept arguments",
          "A void template"
        ],
        "correctOption": 0
      },
      {
        "question": "What does static_assert perform in C++?",
        "options": [
          "Runtime assertion check",
          "Compile-time assertion check that fails compilation with a custom message if the constant expression evaluates to false",
          "Enforces static memory allocation",
          "Prevents thread switching"
        ],
        "correctOption": 1
      }
    ]
  },
  {
    "dayNumber": 9,
    "title": "C++ Track: Fast I/O, Lambda Comparators & Competitive Tricks",
    "category": "C++",
    "taskType": "reading",
    "priority": "High",
    "estimatedMinutes": 70,
    "readingContent": "# C++ Track: Fast I/O, Lambda Comparators & Competitive Tricks\n\nAccenture AEH coding assessments enforce strict 1-second time limits. Standard `cin`/`cout` with `endl` easily triggers Time Limit Exceeded (TLE) on large datasets ((N = 10^5)).\n\n---\n\n## 1. High-Performance Fast I/O\n\nAdd these lines at the beginning of `main()`:\n```cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // 1. Untie C++ streams from standard C streams (printf/scanf):\n    ios_base::sync_with_stdio(false);\n    \n    // 2. Untie cin from cout (prevents automatic flush before every input read):\n    cin.tie(NULL);\n\n    // 3. ALWAYS use '\\n' instead of endl!\n    // endl forces a physical flush of the output buffer on every line, which is extremely slow!\n    cout << \"Answer\n\";\n    \n    return 0;\n}\n```\n\n---\n\n## 2. Lambda Comparators for `std::sort` & `std::priority_queue`\n\n### A. Sorting with Lambdas\n```cpp\nvector<pair<int, int>> intervals = {{1, 3}, {2, 6}, {1, 5}};\n\n// Sort by start ascending; if equal, by end descending:\nsort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {\n    if (a.first != b.first) return a.first < b.first;\n    return a.second > b.second; // Descending\n});\n```\n\n### B. Custom Comparator for `std::priority_queue`\n`std::priority_queue` is a Max-Heap by default. To create a Min-Heap or custom ordering:\n```cpp\nauto comp = [](const pair<int, int>& a, const pair<int, int>& b) {\n    return a.second > b.second; // Min-Heap based on second element\n};\n\npriority_queue<pair<int, int>, vector<pair<int, int>>, decltype(comp)> minHeap(comp);\n```\n\n---\n\n## 3. GCC Built-in Bitwise Intrinsics (Ultra-Fast Hardware Instructions)\nAccenture coding problems frequently feature binary bit manipulation:\n\n- **`__builtin_popcount(unsigned int x)`**: Returns number of set bits (1s) in (O(1)) CPU cycle.\n- **`__builtin_popcountll(unsigned long long x)`**: 64-bit version.\n- **`__builtin_clz(x)`**: Count Leading Zeros from most significant bit.\n- **`__builtin_ctz(x)`**: Count Trailing Zeros (finds position of lowest set bit).\n- **`__builtin_parity(x)`**: Returns parity (1 if odd number of set bits; 0 if even).",
    "mcqs": [
      {
        "question": "Why does std::endl drastically degrade performance compared to '\\n' in C++ competitive programming?",
        "options": [
          "endl allocates dynamic heap memory",
          "endl inserts a newline AND forces an immediate physical flush of the output stream buffer on every call",
          "endl is an abstract template",
          "endl does not support integers"
        ],
        "correctOption": 1
      },
      {
        "question": "What does ios_base::sync_with_stdio(false) achieve in C++?",
        "options": [
          "Enables asynchronous multi-threaded I/O",
          "Disables the synchronization between C++ standard streams (cin/cout) and C standard streams (scanf/printf), providing a massive speedup to cin/cout",
          "Converts standard I/O to read from disk files",
          "Redirects error streams"
        ],
        "correctOption": 1
      },
      {
        "question": "What does cin.tie(NULL) accomplish in C++ fast I/O setup?",
        "options": [
          "Closes standard input",
          "Unties cin from cout, preventing cout from being automatically flushed before every cin read operation",
          "Allocates an 8MB memory buffer",
          "Encrypts terminal input"
        ],
        "correctOption": 1
      },
      {
        "question": "Which GCC built-in function counts the number of set bits (ones) in an integer in a single hardware CPU instruction?",
        "options": [
          "__builtin_popcount(x)",
          "__builtin_clz(x)",
          "__builtin_ctz(x)",
          "__builtin_parity(x)"
        ],
        "correctOption": 0
      },
      {
        "question": "What does __builtin_clz(x) return for a 32-bit unsigned integer x?",
        "options": [
          "Count of trailing zeros",
          "Count of leading zeros starting from the most significant bit (undefined if x == 0)",
          "Number of prime factors",
          "Total byte count"
        ],
        "correctOption": 1
      },
      {
        "question": "How do you instantiate a std::priority_queue as a Min-Heap of integers in standard C++?",
        "options": [
          "std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;",
          "std::priority_queue<int> minHeap(MIN_MODE);",
          "std::priority_queue<int, std::less<int>> minHeap;",
          "std::priority_queue<int>::min() minHeap;"
        ],
        "correctOption": 0
      },
      {
        "question": "In C++, what does the function std::lower_bound(begin, end, val) return on a sorted vector?",
        "options": [
          "An iterator pointing to the first element that does not compare less than val (element >= val)",
          "An iterator pointing to the first element strictly greater than val",
          "The integer index of the exact match",
          "A boolean flag"
        ],
        "correctOption": 0
      },
      {
        "question": "What does std::upper_bound(begin, end, val) return on a sorted vector in C++?",
        "options": [
          "An iterator pointing to the first element that is strictly greater than val (element > val)",
          "An iterator pointing to the exact match",
          "The maximum value in the vector",
          "The last element of the vector"
        ],
        "correctOption": 0
      },
      {
        "question": "Which standard header file provides algorithms such as std::sort, std::binary_search, and std::reverse in C++?",
        "options": [
          "<algorithm>",
          "<utility>",
          "<numeric>",
          "<functional>"
        ],
        "correctOption": 0
      },
      {
        "question": "What is the return type requirement for a custom comparator passed to std::sort in C++?",
        "options": [
          "It must return a boolean representing a Strict Weak Ordering (true if first argument comes strictly before second argument)",
          "It must return -1, 0, or 1 like strcmp",
          "It must return void",
          "It must return an integer index"
        ],
        "correctOption": 0
      }
    ]
  }
];
