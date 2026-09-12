require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Schedule = require('../models/Schedule');
const ScheduleTask = require('../models/ScheduleTask');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const TaskProgress = require('../models/TaskProgress');

const TARGET_EMAIL = 'karankumar23@lpu.in';
const SCHEDULE_ID = '6aa45b7c82d03cff80899ac6';

const technicalTasks = require('./accenture_content/technical');
const coreCSTasks = require('./accenture_content/core_cs');
const javaTasks = require('./accenture_content/java_track');
const cppTasks = require('./accenture_content/cpp_track');

const tasksData = [
  // ==================== DAY 1 ====================
  {
    dayNumber: 1,
    title: 'LeetCode 3: Longest Substring Without Repeating Characters',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    priority: 'High',
    estimatedMinutes: 35,
    readingContent: 'High-frequency Accenture AEH problem. Use sliding window with a hash set or map tracking character indices. When encountering a duplicate, move the left window pointer past the previous occurrence. Time Complexity: O(N), Space: O(min(N, M)).'
  },
  {
    dayNumber: 1,
    title: 'LeetCode 15: 3Sum',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/3sum/',
    priority: 'High',
    estimatedMinutes: 40,
    readingContent: 'Accenture favorites sorting and two-pointer combinations. Sort the array first, iterate with index i, and use two pointers (left and right) to find pairs summing to -nums[i]. Crucial: Skip duplicate elements for both i, left, and right to avoid TLE and duplicate triplets.'
  },
  {
    dayNumber: 1,
    title: 'LeetCode 11: Container With Most Water',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/container-with-most-water/',
    priority: 'Medium',
    estimatedMinutes: 30,
    readingContent: 'Two-pointer greedy optimization. Start pointers at both extremes. Calculate current area = min(height[l], height[r]) * (r - l). Advance the pointer with the smaller height because keeping it cannot yield a larger area with narrower width.'
  },
  {
    dayNumber: 1,
    title: 'LeetCode 76: Minimum Window Substring',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/minimum-window-substring/',
    priority: 'High',
    estimatedMinutes: 45,
    readingContent: 'Hard-level AEH benchmark problem. Use sliding window with two frequency maps: target string count and current window count. Maintain a "have" vs "need" counter to check validity in O(1) time before contracting left.'
  },
  {
    dayNumber: 1,
    title: 'LeetCode 175: Combine Two Tables',
    category: 'SQL',
    taskType: 'task',
    link: 'https://leetcode.com/problems/combine-two-tables/',
    priority: 'Medium',
    estimatedMinutes: 20,
    readingContent: 'Accenture SQL round tests outer joins. Report firstName, lastName, city, and state for each person in Person table regardless of whether an address exists. Pattern: SELECT p.firstName, p.lastName, a.city, a.state FROM Person p LEFT JOIN Address a ON p.personId = a.personId;'
  },
  {
    dayNumber: 1,
    title: 'LeetCode 181: Employees Earning More Than Their Managers',
    category: 'SQL',
    taskType: 'task',
    link: 'https://leetcode.com/problems/employees-earning-more-than-their-managers/',
    priority: 'Medium',
    estimatedMinutes: 20,
    readingContent: 'Self-join problem. Join the Employee table with itself on e.managerId = m.id and filter WHERE e.salary > m.salary. Alternatively solve using a correlated subquery.'
  },
  {
    dayNumber: 1,
    title: 'MS Office & Excel Formulas Mastery for Accenture Assessment',
    category: 'Technical',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 25,
    readingContent: 'Accenture has a dedicated 12-question section on MS Office and Common Applications. Essential focus areas: VLOOKUP syntax (=VLOOKUP(lookup_value, table_array, col_index, [range_lookup])), INDEX/MATCH vs VLOOKUP, Pivot Table creation, Excel error types (#N/A, #VALUE!, #REF!), and essential keyboard shortcuts (Ctrl+Shift+L for filters, F4 to freeze cell references $A$1).',
    mcqs: [
      {
        question: 'In Microsoft Excel, what does the formula =VLOOKUP("Apple", A2:C10, 3, FALSE) do?',
        options: [
          'Searches for "Apple" in row 3 and returns the column header',
          'Searches for "Apple" in column A and returns the value from column C in the same row with an exact match',
          'Searches for "Apple" anywhere in A2:C10 and returns 3 matches',
          'Returns FALSE if Apple is found in column 3'
        ],
        correctOption: 1
      },
      {
        question: 'Which Excel keyboard shortcut applies or removes filters on a selected dataset?',
        options: ['Ctrl + F', 'Ctrl + Shift + L', 'Alt + F4', 'Ctrl + Alt + V'],
        correctOption: 1
      },
      {
        question: 'What does the #REF! error indicate in MS Excel?',
        options: [
          'A formula contains an invalid cell reference (e.g. deleted cells)',
          'A value is divided by zero',
          'The column width is too small',
          'Text is used where a number is expected'
        ],
        correctOption: 0
      }
    ]
  },
  {
    dayNumber: 1,
    title: 'Java Track: JVM Architecture, Memory Model & String Pool',
    category: 'Java',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 30,
    readingContent: 'Core Java fundamentals for AEH: JVM Structure (Classloader, JVM Memory: Method Area, Heap, Stack, PC Registers, Native Method Stack). String immutability and the String Constant Pool. Differences between == (reference comparison) and .equals() (content comparison). StringBuilder vs StringBuffer vs String.',
    mcqs: [
      {
        question: 'In Java, where are String literals stored in memory?',
        options: [
          'In the Thread Call Stack',
          'Inside the String Constant Pool in the Heap',
          'In CPU registers',
          'In native OS memory only'
        ],
        correctOption: 1
      },
      {
        question: 'String s1 = new String("Test"); String s2 = "Test"; What is the output of s1 == s2 and s1.equals(s2)?',
        options: [
          'true, true',
          'false, true',
          'false, false',
          'true, false'
        ],
        correctOption: 1
      },
      {
        question: 'Why is String immutable in Java?',
        options: [
          'For Security, Thread Safety, and Caching in the String Pool',
          'Because Java has no pointers',
          'To prevent garbage collection',
          'Because all objects in Java are immutable by default'
        ],
        correctOption: 0
      }
    ]
  },
  {
    dayNumber: 1,
    title: 'C++ Track: Pointers, References & Memory Layout',
    category: 'C++',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 30,
    readingContent: 'Core C++ fundamentals for AEH: Stack vs Heap allocation. Pointers vs References (references cannot be NULL, cannot be reseated). Pointer arithmetic, const pointers (int* const vs const int*). Memory segments: Text/Code, Data (Initialized), BSS (Uninitialized), Heap (dynamic new/delete), and Stack (local variables).',
    mcqs: [
      {
        question: 'What is the key difference between a C++ reference and a pointer?',
        options: [
          'A pointer can be NULL and reassigned; a reference must be initialized and cannot be reseated',
          'Pointers consume no memory, references consume 8 bytes',
          'References can be manipulated with pointer arithmetic',
          'Pointers can only point to primitive data types'
        ],
        correctOption: 0
      },
      {
        question: 'What does "const int * ptr" signify in C++?',
        options: [
          'ptr is a constant pointer to a mutable integer',
          'ptr points to a constant integer (the value cannot be modified through ptr)',
          'Both ptr and the value it points to are constant',
          'ptr is stored in read-only memory'
        ],
        correctOption: 1
      },
      {
        question: 'What happens if you allocate memory with "new int[10]" but deallocate with "delete ptr" instead of "delete[] ptr"?',
        options: [
          'Undefined behavior; only the first element destructs properly, leading to resource leaks',
          'Compiler automatically frees the entire array correctly',
          'A compile-time error is generated',
          'The OS reclaims memory without issue'
        ],
        correctOption: 0
      }
    ]
  },

  // ==================== DAY 2 ====================
  {
    dayNumber: 2,
    title: 'LeetCode 56: Merge Intervals',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/merge-intervals/',
    priority: 'High',
    estimatedMinutes: 35,
    readingContent: 'Top Accenture AEH interval question. Sort intervals by start time intervals.sort((a,b) => a[0] - b[0]). Maintain a merged list; if current interval start <= previous interval end, merge them by updating end = max(prev.end, curr.end). Else, append current interval. Complexity: O(N log N).'
  },
  {
    dayNumber: 2,
    title: 'LeetCode 57: Insert Interval',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/insert-interval/',
    priority: 'High',
    estimatedMinutes: 35,
    readingContent: 'Interval insertion into an already sorted list in O(N) time without sorting. Three phases: 1) Add all intervals ending before newInterval starts. 2) Merge all overlapping intervals into newInterval. 3) Add remaining intervals.'
  },
  {
    dayNumber: 2,
    title: 'LeetCode 739: Daily Temperatures',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/daily-temperatures/',
    priority: 'High',
    estimatedMinutes: 35,
    readingContent: 'Classic monotonic decreasing stack pattern. Store indices in a stack. When current temp is greater than stack top temp, pop and compute difference in indices: result[prevIndex] = currentIndex - prevIndex. Time Complexity: O(N).'
  },
  {
    dayNumber: 2,
    title: 'LeetCode 84: Largest Rectangle in Histogram',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
    priority: 'High',
    estimatedMinutes: 45,
    readingContent: 'Advanced AEH monotonic stack problem. Maintain stack of indices with increasing heights. When a smaller bar is met, pop and calculate area with height of popped bar and width = (current_index - new_top - 1). Time Complexity: O(N).'
  },
  {
    dayNumber: 2,
    title: 'LeetCode 182: Duplicate Emails',
    category: 'SQL',
    taskType: 'task',
    link: 'https://leetcode.com/problems/duplicate-emails/',
    priority: 'Medium',
    estimatedMinutes: 20,
    readingContent: 'Accenture SQL grouping test. Find all duplicate emails in table Person. Query: SELECT email FROM Person GROUP BY email HAVING COUNT(email) > 1;'
  },
  {
    dayNumber: 2,
    title: 'LeetCode 183: Customers Who Never Order',
    category: 'SQL',
    taskType: 'task',
    link: 'https://leetcode.com/problems/customers-who-never-order/',
    priority: 'Medium',
    estimatedMinutes: 20,
    readingContent: 'Outer join / anti-join pattern. SELECT c.name AS Customers FROM Customers c LEFT JOIN Orders o ON c.id = o.customerId WHERE o.customerId IS NULL;'
  },
  {
    dayNumber: 2,
    title: 'Object-Oriented Programming (OOP) Core Principles & Design',
    category: 'OOP',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 25,
    readingContent: 'Master the 4 pillars: Encapsulation (data hiding via private variables + getters/setters), Abstraction (hiding implementation details via interfaces/abstract classes), Inheritance (reusability via extends/public inheritance), Polymorphism (Compile-time via method overloading, Runtime via virtual methods/overriding). SOLID Principles: Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.',
    mcqs: [
      {
        question: 'Which OOP principle states that derived classes must be substitutable for their base classes without altering program correctness?',
        options: ['Open-Closed Principle', 'Liskov Substitution Principle', 'Interface Segregation', 'Single Responsibility'],
        correctOption: 1
      },
      {
        question: 'What type of polymorphism is achieved through method overloading?',
        options: ['Compile-time (Static) Polymorphism', 'Runtime (Dynamic) Polymorphism', 'Ad-hoc Inheritance', 'Late Binding'],
        correctOption: 0
      },
      {
        question: 'Why is Composition favored over Inheritance ("Favor composition over inheritance")?',
        options: [
          'Composition allows dynamic behavior change at runtime and prevents fragile base class hierarchies',
          'Inheritance is not supported in modern languages',
          'Composition executes faster in bytecode',
          'Composition avoids using classes entirely'
        ],
        correctOption: 0
      }
    ]
  },
  {
    dayNumber: 2,
    title: 'Java Track: Interfaces, Abstract Classes & Method Overriding',
    category: 'Java',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 30,
    readingContent: 'Java OOP deep dive: An abstract class can have constructors, state (instance variables), and implemented methods. An interface specifies behavior. Since Java 8, interfaces support default and static methods, and Java 9 supports private methods. Method Overriding rules: Cannot narrow access modifier, cannot throw broader checked exceptions, return type can be covariant.',
    mcqs: [
      {
        question: 'Can an abstract class in Java have a constructor?',
        options: [
          'Yes, invoked via super() when a subclass is instantiated',
          'No, abstract classes cannot be instantiated so constructors are forbidden',
          'Only if marked private',
          'Only if all methods are abstract'
        ],
        correctOption: 0
      },
      {
        question: 'What happens if a class implements two interfaces that contain the exact same default method signature?',
        options: [
          'The code compiles and picks the first interface listed',
          'Compile-time error: the class must explicitly override the conflicting method',
          'Runtime exception is thrown when invoked',
          'Both methods execute sequentially'
        ],
        correctOption: 1
      },
      {
        question: 'Can an overriding method in a subclass declare a broader checked exception than the base method?',
        options: [
          'No, overriding methods can only declare fewer, narrower checked exceptions, or unchecked exceptions',
          'Yes, any exception can be declared',
          'Only if declared public',
          'Only if the base method threw Throwable'
        ],
        correctOption: 0
      }
    ]
  },
  {
    dayNumber: 2,
    title: 'C++ Track: Multiple Inheritance, Diamond Problem & Virtual Destructors',
    category: 'C++',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 30,
    readingContent: 'C++ OOP specifics: Multiple inheritance leading to the Diamond Problem (Class D inherits from B and C, both inheriting from A). Solved using "virtual inheritance" (class B : virtual public A). Why base classes must have a virtual destructor: deleting a derived object through a base pointer without a virtual destructor causes undefined behavior and memory leaks.',
    mcqs: [
      {
        question: 'How is the Diamond Problem resolved in C++?',
        options: [
          'Using virtual base classes (virtual inheritance)',
          'Using multiple public inheritance without virtual',
          'By making all methods static',
          'C++ does not allow multiple inheritance'
        ],
        correctOption: 0
      },
      {
        question: 'Why should a base class destructor always be declared virtual in polymorphic class hierarchies?',
        options: [
          'To ensure the derived class destructor is called when an object is deleted via a base pointer',
          'To allocate the object on the heap instead of the stack',
          'To enable copy constructor generation',
          'To allow pure virtual function declarations'
        ],
        correctOption: 0
      },
      {
        question: 'What is a pure virtual function in C++?',
        options: [
          'A virtual function assigned = 0 that makes the class abstract',
          'A function written in C syntax',
          'A function with no arguments',
          'A function marked inline'
        ],
        correctOption: 0
      }
    ]
  },

  // ==================== DAY 3 ====================
  {
    dayNumber: 3,
    title: 'LeetCode 560: Subarray Sum Equals K',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/subarray-sum-equals-k/',
    priority: 'High',
    estimatedMinutes: 35,
    readingContent: 'Accenture AEH high-probability question. Negative numbers exist, so sliding window fails. Use prefix sums with a hash map storing frequency of seen prefix sums: if (prefixSum - k) is in the map, add its frequency to total count. Initialize map with {0: 1}. Time: O(N), Space: O(N).'
  },
  {
    dayNumber: 3,
    title: 'LeetCode 42: Trapping Rain Water',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/trapping-rain-water/',
    priority: 'High',
    estimatedMinutes: 45,
    readingContent: 'High-Value Benchmark. Two-pointer solution: maintain left and right pointers with leftMax and rightMax. Water trapped at position i depends on min(leftMax, rightMax) - height[i]. If height[left] < height[right], process left; otherwise process right. Space Complexity: O(1).'
  },
  {
    dayNumber: 3,
    title: 'LeetCode 238: Product of Array Except Self',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/product-of-array-except-self/',
    priority: 'Medium',
    estimatedMinutes: 30,
    readingContent: 'Compute prefix products in first pass into output array. Compute running suffix product in second pass moving backwards and multiply. Time: O(N), Auxiliary Space: O(1).'
  },
  {
    dayNumber: 3,
    title: 'LeetCode 525: Contiguous Array',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/contiguous-array/',
    priority: 'Medium',
    estimatedMinutes: 35,
    readingContent: 'Find maximum length of a contiguous subarray with equal number of 0 and 1. Transform 0 into -1. Now find longest subarray summing to 0 using prefix sum and hash map storing earliest index of each sum.'
  },
  {
    dayNumber: 3,
    title: 'LeetCode 176: Second Highest Salary',
    category: 'SQL',
    taskType: 'task',
    link: 'https://leetcode.com/problems/second-highest-salary/',
    priority: 'High',
    estimatedMinutes: 25,
    readingContent: 'Accenture classic SQL. Must return NULL if no second highest salary exists. SELECT (SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1) AS SecondHighestSalary;'
  },
  {
    dayNumber: 3,
    title: 'LeetCode 178: Rank Scores',
    category: 'SQL',
    taskType: 'task',
    link: 'https://leetcode.com/problems/rank-scores/',
    priority: 'Medium',
    estimatedMinutes: 25,
    readingContent: 'Window functions in SQL. Rank scores without gaps between consecutive ranks: SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) AS `rank` FROM Scores ORDER BY score DESC;'
  },
  {
    dayNumber: 3,
    title: 'DBMS: Relational Model, Keys & Normalization (1NF to BCNF)',
    category: 'DBMS',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 30,
    readingContent: 'Keys: Super Key, Candidate Key, Primary Key, Foreign Key. Normal forms: 1NF (Atomic values, no repeating groups). 2NF (In 1NF + No partial dependency: non-prime attributes fully dependent on every candidate key). 3NF (In 2NF + No transitive dependency). BCNF (In 3NF + For every functional dependency X -> Y, X must be a super key).',
    mcqs: [
      {
        question: 'A table is in 2NF if it is in 1NF and contains no what?',
        options: ['Partial Functional Dependencies', 'Transitive Dependencies', 'Foreign Keys', 'Composite Keys'],
        correctOption: 0
      },
      {
        question: 'In BCNF (Boyce-Codd Normal Form), for every functional dependency X -> Y, what condition must X satisfy?',
        options: ['X must be a Super Key', 'X must be a Foreign Key', 'Y must be a Super Key', 'X must be a non-prime attribute'],
        correctOption: 0
      },
      {
        question: 'What is the minimum number of candidate keys every relation must possess?',
        options: ['At least 1', 'At least 2', '0', 'Exactly equal to the number of attributes'],
        correctOption: 0
      }
    ]
  },
  {
    dayNumber: 3,
    title: 'Java Track: Collections Internals (HashMap, ArrayList, Set)',
    category: 'Java',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 30,
    readingContent: 'Internal workings of HashMap: Array of Nodes (buckets). Hash function calculates hashcode -> index. In case of collision: LinkedList used. Since Java 8, if bucket length exceeds TREEIFY_THRESHOLD (8) and table capacity >= 64, converted to Red-Black Tree (TreeMap) reducing lookup from O(N) to O(log N). Load factor default: 0.75.',
    mcqs: [
      {
        question: 'In Java 8, when does a HashMap bucket convert its linked list into a balanced Red-Black tree?',
        options: [
          'When bucket length exceeds 8 and total map capacity is at least 64',
          'Whenever a second collision occurs',
          'When load factor reaches 1.0',
          'HashMap never uses trees in Java'
        ],
        correctOption: 0
      },
      {
        question: 'What is the contract between equals() and hashCode() in Java?',
        options: [
          'If two objects are equal by equals(), they MUST return the same hashCode()',
          'If two objects have the same hashCode(), they MUST be equal by equals()',
          'Both methods must return positive integers',
          'equals() and hashCode() are completely independent'
        ],
        correctOption: 0
      },
      {
        question: 'What is the difference between ArrayList and LinkedList when accessing an element by index get(i)?',
        options: [
          'ArrayList is O(1) random access; LinkedList is O(N) sequential traversal',
          'Both are O(1)',
          'LinkedList is O(1); ArrayList is O(N)',
          'Both are O(log N)'
        ],
        correctOption: 0
      }
    ]
  },
  {
    dayNumber: 3,
    title: 'C++ Track: STL Containers, Iterators & std::vector Internals',
    category: 'C++',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 30,
    readingContent: 'std::vector: dynamic contiguous array. size() vs capacity(). When capacity is exceeded, allocates 2x memory, copies elements, frees old memory (amortized O(1) push_back). Iterator invalidation on vector reallocation. std::unordered_map (hash table with buckets, O(1) average) vs std::map (Red-Black tree, sorted, O(log N)).',
    mcqs: [
      {
        question: 'What underlying data structure is used by std::map in C++ STL?',
        options: ['Red-Black Tree (Self-balancing BST)', 'Hash Table', 'B+ Tree', 'Doubly Linked List'],
        correctOption: 0
      },
      {
        question: 'What happens to existing iterators and pointers to vector elements when a push_back causes a reallocation?',
        options: [
          'All existing iterators, pointers, and references become invalid',
          'They remain valid and are automatically updated',
          'Only the end() iterator is invalidated',
          'A segfault occurs immediately'
        ],
        correctOption: 0
      },
      {
        question: 'What is the average time complexity of insertion and search in std::unordered_map?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correctOption: 0
      }
    ]
  },

  // ==================== DAY 4 ====================
  {
    dayNumber: 4,
    title: 'LeetCode 33: Search in Rotated Sorted Array',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    priority: 'High',
    estimatedMinutes: 35,
    readingContent: 'Binary search variant. Check whether the left half [low...mid] is normally sorted (nums[low] <= nums[mid]). If sorted, check if target lies within [nums[low], nums[mid]]. If yes, search left; else search right. If right half is sorted, do symmetric check. Time Complexity: O(log N).'
  },
  {
    dayNumber: 4,
    title: 'LeetCode 81: Search in Rotated Sorted Array II',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/search-in-rotated-sorted-array-ii/',
    priority: 'Medium',
    estimatedMinutes: 35,
    readingContent: 'Same as LC 33 but contains duplicates (nums[low] == nums[mid] == nums[high]). In this ambiguous case, we cannot determine which half is sorted; shrink search space with low++ and high--. Worst case: O(N).'
  },
  {
    dayNumber: 4,
    title: 'LeetCode 1011: Capacity To Ship Packages Within D Days',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/',
    priority: 'High',
    estimatedMinutes: 40,
    readingContent: 'Binary search on answer space. Minimum possible capacity = max(weights), maximum capacity = sum(weights). Binary search between low and high: write a feasible(capacity) function that checks if packages can be shipped in <= D days.'
  },
  {
    dayNumber: 4,
    title: 'LeetCode 875: Koko Eating Bananas',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/koko-eating-bananas/',
    priority: 'Medium',
    estimatedMinutes: 35,
    readingContent: 'Binary search predicate range [1, max(piles)]. For speed k, hours needed = sum(ceil(pile / k)). If total hours <= h, valid speed -> try smaller speed (high = mid); else low = mid + 1.'
  },
  {
    dayNumber: 4,
    title: 'LeetCode 184: Department Highest Salary',
    category: 'SQL',
    taskType: 'task',
    link: 'https://leetcode.com/problems/department-highest-salary/',
    priority: 'High',
    estimatedMinutes: 25,
    readingContent: 'Find employees who have the highest salary in each department. Solve using subquery: WHERE (departmentId, salary) IN (SELECT departmentId, MAX(salary) FROM Employee GROUP BY departmentId) or window DENSE_RANK().'
  },
  {
    dayNumber: 4,
    title: 'LeetCode 180: Consecutive Numbers',
    category: 'SQL',
    taskType: 'task',
    link: 'https://leetcode.com/problems/consecutive-numbers/',
    priority: 'High',
    estimatedMinutes: 25,
    readingContent: 'Find all numbers that appear at least three times consecutively. Pattern using LEAD: SELECT DISTINCT num AS ConsecutiveNums FROM (SELECT num, LEAD(num, 1) OVER () AS next1, LEAD(num, 2) OVER () AS next2 FROM Logs) t WHERE num = next1 AND num = next2;'
  },
  {
    dayNumber: 4,
    title: 'Computer Networks: OSI 7-Layer Model & TCP/IP Protocol Stack',
    category: 'CN',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 25,
    readingContent: 'OSI 7 Layers: Physical (Bits/Cables), Data Link (Frames, MAC, Ethernet switches), Network (Packets, IP addressing, Routers), Transport (Segments, TCP/UDP, Port numbers), Session, Presentation, Application (HTTP, DNS, FTP, SMTP). TCP vs UDP: Connection-oriented, reliable, 3-way handshake, flow/congestion control vs Connectionless, unreliable, fast, header size 8 bytes vs 20-60 bytes.',
    mcqs: [
      {
        question: 'Which OSI layer is responsible for end-to-end communication, flow control, and error recovery?',
        options: ['Transport Layer', 'Network Layer', 'Data Link Layer', 'Session Layer'],
        correctOption: 0
      },
      {
        question: 'What is the default header size of a UDP packet compared to a standard TCP packet?',
        options: ['8 bytes for UDP, 20 bytes for TCP', '20 bytes for UDP, 8 bytes for TCP', '40 bytes for both', '4 bytes for UDP, 16 bytes for TCP'],
        correctOption: 0
      },
      {
        question: 'At which layer of the OSI model does an IP router operate?',
        options: ['Layer 3 (Network Layer)', 'Layer 2 (Data Link Layer)', 'Layer 4 (Transport Layer)', 'Layer 7 (Application Layer)'],
        correctOption: 0
      }
    ]
  },
  {
    dayNumber: 4,
    title: 'Java Track: Exception Hierarchy & Garbage Collection Mechanics',
    category: 'Java',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 30,
    readingContent: 'Throwable hierarchy: Error (OutOfMemoryError, StackOverflowError - unchecked, unrecoverable) vs Exception (Checked: IOException, SQLException must be handled or declared; Unchecked: RuntimeException, NullPointerException). Garbage Collection: Mark and Sweep, Generational hypothesis (Young Gen: Eden, S0, S1; Old Gen/Tenured). G1GC vs ZGC.',
    mcqs: [
      {
        question: 'Which of the following is a checked exception in Java?',
        options: ['IOException', 'NullPointerException', 'ArrayIndexOutOfBoundsException', 'IllegalArgumentException'],
        correctOption: 0
      },
      {
        question: 'What memory space in JVM stores objects that survive multiple minor garbage collection cycles?',
        options: ['Old (Tenured) Generation', 'Eden Space', 'Survivor Space S0', 'Thread Stack'],
        correctOption: 0
      },
      {
        question: 'Does the finally block always execute in Java?',
        options: [
          'Yes, unless System.exit(0) is called or JVM crashes',
          'Only if an exception is thrown',
          'Only if no exception is thrown',
          'Never if there is a return statement in the try block'
        ],
        correctOption: 0
      }
    ]
  },
  {
    dayNumber: 4,
    title: 'C++ Track: Smart Pointers (unique_ptr, shared_ptr, weak_ptr) & RAII',
    category: 'C++',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 30,
    readingContent: 'Resource Acquisition Is Initialization (RAII). std::unique_ptr (exclusive ownership, non-copyable, movable via std::move). std::shared_ptr (shared ownership with reference count in control block). std::weak_ptr (non-owning observer, breaks circular dependency between shared_ptrs, use lock() to convert to shared_ptr).',
    mcqs: [
      {
        question: 'How do you break a circular reference between two objects holding std::shared_ptr?',
        options: [
          'Replace one of the references with std::weak_ptr',
          'Call delete manually',
          'Use raw void pointers',
          'Use std::auto_ptr'
        ],
        correctOption: 0
      },
      {
        question: 'Can std::unique_ptr be copied to another unique_ptr using the copy constructor?',
        options: [
          'No, copy constructor is deleted; ownership must be transferred using std::move()',
          'Yes, both will point to the same object',
          'Yes, it performs a deep copy automatically',
          'Only if initialized with std::make_unique'
        ],
        correctOption: 0
      },
      {
        question: 'What does std::weak_ptr::lock() return?',
        options: [
          'A std::shared_ptr sharing ownership, or empty shared_ptr if expired',
          'A boolean flag indicating lock status',
          'A raw pointer to the object',
          'A mutex lock guard'
        ],
        correctOption: 0
      }
    ]
  },

  // ==================== DAY 5 ====================
  {
    dayNumber: 5,
    title: 'LeetCode 198: House Robber',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/house-robber/',
    priority: 'High',
    estimatedMinutes: 35,
    readingContent: 'Fundamental 1D DP. Cannot rob adjacent houses. Recurrence: dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Space optimization: Notice we only need the last two values (prev1 and prev2), reducing space complexity from O(N) to O(1).'
  },
  {
    dayNumber: 5,
    title: 'LeetCode 213: House Robber II',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/house-robber-ii/',
    priority: 'High',
    estimatedMinutes: 35,
    readingContent: 'Houses arranged in a circle. First and last houses are neighbors. Solution: run standard House Robber twice: 1) for houses from index 0 to n-2 (excluding last), 2) for houses from index 1 to n-1 (excluding first). Return max of both.'
  },
  {
    dayNumber: 5,
    title: 'LeetCode 300: Longest Increasing Subsequence',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/longest-increasing-subsequence/',
    priority: 'High',
    estimatedMinutes: 40,
    readingContent: 'Classic AEH DP problem. Standard DP: O(N^2). Optimal solution: Patience Sorting with Binary Search (std::lower_bound or binary search on tails array). If x > tails.back(), push x; else replace smallest element >= x. Final length of tails = LIS length. Time: O(N log N).'
  },
  {
    dayNumber: 5,
    title: 'LeetCode 322: Coin Change',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/coin-change/',
    priority: 'High',
    estimatedMinutes: 40,
    readingContent: 'Unbounded Knapsack / BFS. Initialize dp array of size amount + 1 with infinity, dp[0] = 0. For each coin: for i from coin to amount: dp[i] = min(dp[i], dp[i - coin] + 1). If dp[amount] is infinity, return -1.'
  },
  {
    dayNumber: 5,
    title: 'LeetCode 177: Nth Highest Salary',
    category: 'SQL',
    taskType: 'task',
    link: 'https://leetcode.com/problems/nth-highest-salary/',
    priority: 'High',
    estimatedMinutes: 25,
    readingContent: 'Writing a MySQL function with parameters: CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT BEGIN DECLARE M INT; SET M = N - 1; RETURN (SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET M); END'
  },
  {
    dayNumber: 5,
    title: 'LeetCode 196: Delete Duplicate Emails',
    category: 'SQL',
    taskType: 'task',
    link: 'https://leetcode.com/problems/delete-duplicate-emails/',
    priority: 'Medium',
    estimatedMinutes: 20,
    readingContent: 'DELETE with self-join: DELETE p1 FROM Person p1, Person p2 WHERE p1.email = p2.email AND p1.id > p2.id;'
  },
  {
    dayNumber: 5,
    title: 'Operating Systems: Process Management, Threads & CPU Scheduling',
    category: 'OS',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 25,
    readingContent: 'Process States: New, Ready, Running, Waiting/Blocked, Terminated. Process Control Block (PCB). Context Switching overhead. Threads: lightweight process sharing code, data, open files; private registers and stack. Scheduling Algorithms: FCFS (Convoy effect), SJF (Optimal average waiting time, starvation possible), Priority Scheduling, Round Robin (Time quantum selection, preemption).',
    mcqs: [
      {
        question: 'What data structure is saved and restored during a process context switch?',
        options: ['Process Control Block (PCB)', 'File Allocation Table (FAT)', 'Page Directory Base Register only', 'Virtual File System (VFS)'],
        correctOption: 0
      },
      {
        question: 'Which CPU scheduling algorithm guarantees minimal average waiting time for a given set of stationary processes?',
        options: ['Shortest Job First (SJF / Shortest Remaining Time First)', 'Round Robin', 'First Come First Served', 'Priority Scheduling'],
        correctOption: 0
      },
      {
        question: 'What is shared between threads belonging to the same process?',
        options: [
          'Code, Global Data, and Open Files (Heap and Static data)',
          'Stack memory and CPU registers',
          'Program counter and stack pointer',
          'Thread ID and private local variables'
        ],
        correctOption: 0
      }
    ]
  },
  {
    dayNumber: 5,
    title: 'Java Track: Multithreading, Synchronization & Concurrency',
    category: 'Java',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 30,
    readingContent: 'Thread creation: extending Thread vs implementing Runnable vs Callable (returns Future). Synchronization: synchronized keyword (intrinsic monitor lock on object or Class), wait() and notify() must be in synchronized block. volatile keyword: guarantees memory visibility across threads (flushes CPU cache to main memory) without atomic compound operations. ThreadPoolExecutor.',
    mcqs: [
      {
        question: 'What does the "volatile" keyword guarantee in Java?',
        options: [
          'Visibility of changes across threads (reads/writes directly to main memory)',
          'Mutual exclusion and lock acquisition',
          'Atomicity of compound operations like i++',
          'Immutability of the object reference'
        ],
        correctOption: 0
      },
      {
        question: 'What is the main difference between Callable and Runnable in Java?',
        options: [
          'Callable can return a value and throw checked exceptions; Runnable cannot return a value',
          'Runnable can only be run in thread pools',
          'Callable is synchronized by default',
          'Runnable returns an Object while Callable returns void'
        ],
        correctOption: 0
      },
      {
        question: 'What state does a thread enter when waiting for a synchronized lock held by another thread?',
        options: ['BLOCKED', 'WAITING', 'TIMED_WAITING', 'TERMINATED'],
        correctOption: 0
      }
    ]
  },
  {
    dayNumber: 5,
    title: 'C++ Track: Concurrency, std::thread, std::mutex & std::atomic',
    category: 'C++',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 30,
    readingContent: 'C++ Concurrency: std::thread t(func, args...). Must call t.join() or t.detach() before destructor. Data race protection using std::mutex, std::lock_guard (RAII wrapper) and std::unique_lock (can be unlocked manually). std::atomic for lock-free atomic primitive operations (fetch_add, compare_exchange_strong).',
    mcqs: [
      {
        question: 'What happens if a std::thread object is destroyed while still joinable (neither join() nor detach() was called)?',
        options: [
          'std::terminate() is called and the program aborts',
          'The thread continues executing silently in background',
          'The thread is cleanly killed',
          'A warning is printed to stderr'
        ],
        correctOption: 0
      },
      {
        question: 'Why is std::lock_guard preferred over calling mutex.lock() and mutex.unlock() directly?',
        options: [
          'It automatically unlocks the mutex when it goes out of scope, even if an exception is thrown (RAII)',
          'It allows multiple threads to write simultaneously',
          'It converts normal mutex to reader-writer lock',
          'It consumes zero memory'
        ],
        correctOption: 0
      },
      {
        question: 'What header provides lock-free atomic primitives in C++?',
        options: ['<atomic>', '<thread>', '<mutex>', '<future>'],
        correctOption: 0
      }
    ]
  },

  // ==================== DAY 6 ====================
  {
    dayNumber: 6,
    title: 'LeetCode 62: Unique Paths',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/unique-paths/',
    priority: 'Medium',
    estimatedMinutes: 30,
    readingContent: '2D Grid DP. Robot can only move right or down. Base cases: edges are 1. Recurrence: dp[i][j] = dp[i-1][j] + dp[i][j-1]. Can be optimized to a single 1D array of size n in O(N) space, or calculated in O(m) time using combinatorics: C(m+n-2, m-1).'
  },
  {
    dayNumber: 6,
    title: 'LeetCode 64: Minimum Path Sum',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/minimum-path-sum/',
    priority: 'Medium',
    estimatedMinutes: 30,
    readingContent: '2D Grid cost optimization. Recurrence: grid[i][j] += min(grid[i-1][j], grid[i][j-1]). Modify input grid in-place for O(1) extra space.'
  },
  {
    dayNumber: 6,
    title: 'LeetCode 1143: Longest Common Subsequence',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/longest-common-subsequence/',
    priority: 'High',
    estimatedMinutes: 40,
    readingContent: 'Classic 2D String DP. If text1[i-1] == text2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]. Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1]). Space optimization: only current and previous rows needed -> O(min(m, n)) space.'
  },
  {
    dayNumber: 6,
    title: 'LeetCode 416: Partition Equal Subset Sum',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/partition-equal-subset-sum/',
    priority: 'High',
    estimatedMinutes: 40,
    readingContent: '0/1 Knapsack Boolean DP. If sum(nums) is odd, return false immediately. Target = sum / 2. dp[j] indicates if subset sum j is achievable. Iterate reverse from target down to num: dp[j] = dp[j] || dp[j - num]. Time: O(N * Target), Space: O(Target).'
  },
  {
    dayNumber: 6,
    title: 'LeetCode 185: Department Top Three Salaries',
    category: 'SQL',
    taskType: 'task',
    link: 'https://leetcode.com/problems/department-top-three-salaries/',
    priority: 'High',
    estimatedMinutes: 30,
    readingContent: 'Advanced Accenture SQL problem: SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary FROM (SELECT departmentId, name, salary, DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC) as `rank` FROM Employee) e JOIN Department d ON e.departmentId = d.id WHERE e.`rank` <= 3;'
  },
  {
    dayNumber: 6,
    title: 'LeetCode 626: Exchange Seats',
    category: 'SQL',
    taskType: 'task',
    link: 'https://leetcode.com/problems/exchange-seats/',
    priority: 'Medium',
    estimatedMinutes: 25,
    readingContent: 'Conditional seat swap with CASE WHEN: SELECT CASE WHEN id % 2 != 0 AND id = (SELECT COUNT(*) FROM Seat) THEN id WHEN id % 2 != 0 THEN id + 1 ELSE id - 1 END AS id, student FROM Seat ORDER BY id;'
  },
  {
    dayNumber: 6,
    title: 'DBMS: Transactions, Indexing & ACID Properties',
    category: 'DBMS',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 25,
    readingContent: 'ACID: Atomicity (All or nothing - undo logs), Consistency (State validity), Isolation (Independent execution), Durability (Write-ahead logs, committed changes persist). Isolation Levels: Read Uncommitted (Dirty read possible), Read Committed (Non-repeatable read possible), Repeatable Read (Phantom read possible in MySQL InnoDB solved by Next-Key locks), Serializable. B-Tree vs Hash indexing.',
    mcqs: [
      {
        question: 'Which transaction anomaly describes reading uncommitted data written by a concurrent uncommitted transaction?',
        options: ['Dirty Read', 'Non-repeatable Read', 'Phantom Read', 'Lost Update'],
        correctOption: 0
      },
      {
        question: 'What type of index in RDBMS physically dictates the order in which rows are stored on disk?',
        options: ['Clustered Index', 'Non-Clustered (Secondary) Index', 'Hash Index', 'Composite Index'],
        correctOption: 0
      },
      {
        question: 'Why are B+ Trees favored over Binary Search Trees or Hash Tables for disk storage in relational databases?',
        options: [
          'High fan-out minimizes disk I/O operations and leaf nodes linked together support fast range queries',
          'B+ Trees require zero disk memory',
          'Hash tables cannot store numbers',
          'Binary search trees are faster on disk'
        ],
        correctOption: 0
      }
    ]
  },
  {
    dayNumber: 6,
    title: 'Java Track: Modern Java (Java 8/11/17) Streams & Functional Interfaces',
    category: 'Java',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 30,
    readingContent: 'Java 8+ features: Lambda expressions, Functional Interfaces (@FunctionalInterface: Consumer, Supplier, Predicate, Function). Streams API: Intermediate operations (lazy: filter, map, sorted, flatMap) vs Terminal operations (eager: collect, forEach, reduce, findFirst). Optional<T> preventing NPEs.',
    mcqs: [
      {
        question: 'What is the functional interface representing a function that takes an argument of type T and returns a boolean?',
        options: ['Predicate<T>', 'Consumer<T>', 'Function<T, R>', 'Supplier<T>'],
        correctOption: 0
      },
      {
        question: 'Are Stream intermediate operations in Java executed eagerly or lazily?',
        options: [
          'Lazily; they are only executed when a terminal operation is invoked',
          'Eagerly; they execute immediately line by line',
          'Depends on whether parallelStream is used',
          'Intermediate operations do not exist in Streams'
        ],
        correctOption: 0
      },
      {
        question: 'What does map() vs flatMap() do in the Java Streams API?',
        options: [
          'map transforms each element into a single value (1-to-1); flatMap flattens multiple collections/streams into a single stream (1-to-many)',
          'map works on lists; flatMap works on maps',
          'map is terminal; flatMap is intermediate',
          'Both are identical aliases'
        ],
        correctOption: 0
      }
    ]
  },
  {
    dayNumber: 6,
    title: 'C++ Track: Move Semantics, Rvalue References (&&) & std::move',
    category: 'C++',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 30,
    readingContent: 'Lvalues (objects with an identifiable memory address) vs Rvalues (temporary objects without persistent address). Rvalue reference: Type&&. Move constructor & move assignment operator: transfers ownership of resources (pointers, file handles) without deep copying. std::move: static_cast to rvalue reference.',
    mcqs: [
      {
        question: 'What does std::move actually do at runtime?',
        options: [
          'It performs an unconditional cast to an rvalue reference (does not move anything by itself)',
          'It physically copies memory bytes in RAM',
          'It deletes the original object',
          'It creates a new thread to copy the data'
        ],
        correctOption: 0
      },
      {
        question: 'What rule describes the necessity of implementing Destructor, Copy Constructor, Copy Assignment, Move Constructor, and Move Assignment together in C++?',
        options: ['Rule of Five', 'Rule of Three', 'SOLID Principle', 'Zero-overhead Principle'],
        correctOption: 0
      },
      {
        question: 'What is an lvalue in C++?',
        options: [
          'An expression that identifies an object residing at a specific memory location (can take its address &)',
          'A temporary literal constant like 42',
          'A function that returns void',
          'A variable declared on the left side of a comment'
        ],
        correctOption: 0
      }
    ]
  },

  // ==================== DAY 7 ====================
  {
    dayNumber: 7,
    title: 'LeetCode 236: Lowest Common Ancestor of a Binary Tree',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/',
    priority: 'High',
    estimatedMinutes: 35,
    readingContent: 'Essential Accenture Tree question. Post-order DFS recursion: if root is null or root == p or root == q, return root. Recurse left and right. If both left and right return non-null, root is LCA. If only one returns non-null, return that non-null node. Time: O(N).'
  },
  {
    dayNumber: 7,
    title: 'LeetCode 102: Binary Tree Level Order Traversal',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    priority: 'Medium',
    estimatedMinutes: 30,
    readingContent: 'BFS using a Queue. Push root. While queue is not empty, get current level size = queue.size(). Pop that many nodes, append their values to current level array, and push their non-null left and right children. Time: O(N), Space: O(N).'
  },
  {
    dayNumber: 7,
    title: 'LeetCode 98: Validate Binary Search Tree',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/validate-binary-search-tree/',
    priority: 'High',
    estimatedMinutes: 35,
    readingContent: 'Common trap: checking only parent vs direct children is NOT enough. Pass down valid range (minVal, maxVal). Every node in left subtree must be < node.val, and right subtree > node.val. Alternatively: in-order traversal of a valid BST must be strictly monotonically increasing.'
  },
  {
    dayNumber: 7,
    title: 'LeetCode 124: Binary Tree Maximum Path Sum',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
    priority: 'High',
    estimatedMinutes: 45,
    readingContent: 'Hard-level AEH tree challenge. Path can start and end at any node. In post-order DFS, compute max gain from left child (clamped to 0) and right child. Current path through root = root.val + leftGain + rightGain. Update global max. Return to caller: root.val + max(leftGain, rightGain).'
  },
  {
    dayNumber: 7,
    title: 'LeetCode 1179: Reformat Department Table',
    category: 'SQL',
    taskType: 'task',
    link: 'https://leetcode.com/problems/reformat-department-table/',
    priority: 'Medium',
    estimatedMinutes: 25,
    readingContent: 'Pivoting rows to columns using conditional aggregation: SELECT id, SUM(CASE WHEN month = "Jan" THEN revenue END) AS Jan_Revenue, SUM(CASE WHEN month = "Feb" THEN revenue END) AS Feb_Revenue, ... FROM Department GROUP BY id;'
  },
  {
    dayNumber: 7,
    title: 'LeetCode 262: Trips and Users',
    category: 'SQL',
    taskType: 'task',
    link: 'https://leetcode.com/problems/trips-and-users/',
    priority: 'High',
    estimatedMinutes: 35,
    readingContent: 'Calculate cancellation rate among unbanned clients and drivers over a specific date range. Multi-table join filtering c.banned = "No" AND d.banned = "No", computing ROUND(SUM(status != "completed") / COUNT(*), 2).'
  },
  {
    dayNumber: 7,
    title: 'Computer Networks: Protocols, DNS & Web Security (SSL/TLS)',
    category: 'CN',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 25,
    readingContent: 'TCP 3-Way Handshake: SYN -> SYN-ACK -> ACK. TCP 4-Way Teardown: FIN -> ACK -> FIN -> ACK. DNS resolution flow: Browser cache -> OS cache -> Resolving Name Server -> Root Server (.) -> TLD Server (.com) -> Authoritative Server. HTTP vs HTTPS (Port 80 vs 443). SSL/TLS Handshake: Asymmetric encryption for key exchange, symmetric encryption for data transfer.',
    mcqs: [
      {
        question: 'What are the flags exchanged in order during a standard TCP 3-way connection handshake?',
        options: ['SYN, SYN-ACK, ACK', 'ACK, SYN, SYN-ACK', 'SYN, ACK, FIN', 'HELLO, READY, CONNECT'],
        correctOption: 0
      },
      {
        question: 'Why does HTTPS use asymmetric encryption during the initial handshake, but switches to symmetric encryption for payload data transfer?',
        options: [
          'Asymmetric encryption is computationally slow; symmetric encryption is fast and efficient for bulk data',
          'Symmetric encryption cannot encrypt text',
          'Browsers do not support public keys',
          'Asymmetric encryption only works on port 80'
        ],
        correctOption: 0
      },
      {
        question: 'What type of DNS record maps a domain name to an IPv4 address?',
        options: ['A Record', 'AAAA Record', 'CNAME Record', 'MX Record'],
        correctOption: 0
      }
    ]
  },
  {
    dayNumber: 7,
    title: 'Java Track: Software Design Patterns (Creational & Structural)',
    category: 'Java',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 30,
    readingContent: 'Design Patterns in Java: Singleton (thread-safe double-checked locking with volatile instance), Factory Pattern (encapsulating object instantiation), Builder Pattern (fluent API for complex objects with many parameters), Observer Pattern (event listeners, Subject-Observer relationship).',
    mcqs: [
      {
        question: 'In Java double-checked locking Singleton, why must the instance variable be declared volatile?',
        options: [
          'To prevent instruction reordering during object creation (allocation, constructor call, assignment)',
          'To make the instance garbage-collection proof',
          'To allow multiple instances',
          'To serialize the singleton object'
        ],
        correctOption: 0
      },
      {
        question: 'Which design pattern is best suited for constructing complex objects with numerous optional parameters without telescoping constructors?',
        options: ['Builder Pattern', 'Adapter Pattern', 'Decorator Pattern', 'Prototype Pattern'],
        correctOption: 0
      },
      {
        question: 'What pattern does Java`s java.awt.event.ActionListener exemplify?',
        options: ['Observer Pattern', 'Singleton Pattern', 'Facade Pattern', 'Bridge Pattern'],
        correctOption: 0
      }
    ]
  },
  {
    dayNumber: 7,
    title: 'C++ Track: Software Design Patterns & Idioms (Meyers Singleton, Factory)',
    category: 'C++',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 30,
    readingContent: 'Meyers Singleton in modern C++: thread-safe static local variable initialization guaranteed by C++11 standard. Factory pattern returning std::unique_ptr<Base>. PIMPL (Pointer to Implementation) idiom decoupling headers and compilation dependencies.',
    mcqs: [
      {
        question: 'Why is "Meyers Singleton" inherently thread-safe in C++11 and beyond?',
        options: [
          'C++11 guarantees that static local variables are initialized in a thread-safe manner upon first execution',
          'It automatically injects a hidden mutex lock',
          'It disables multithreading during compilation',
          'Static variables are allocated on the GPU'
        ],
        correctOption: 0
      },
      {
        question: 'What is the main benefit of the PIMPL (Pointer to Implementation) idiom in C++?',
        options: [
          'Reduces compile times and hides implementation details by minimizing header includes',
          'Allows multiple inheritance without virtual tables',
          'Enables garbage collection in C++',
          'Eliminates pointer overhead'
        ],
        correctOption: 0
      },
      {
        question: 'What return type is recommended for a modern C++ Factory function that produces exclusive instances?',
        options: ['std::unique_ptr<Base>', 'raw Base*', 'std::weak_ptr<Base>', 'Base&'],
        correctOption: 0
      }
    ]
  },

  // ==================== DAY 8 ====================
  {
    dayNumber: 8,
    title: 'LeetCode 200: Number of Islands',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/number-of-islands/',
    priority: 'High',
    estimatedMinutes: 35,
    readingContent: 'Top Accenture AEH Graph problem. Iterate through grid. When grid[r][c] == "1", increment island count and trigger DFS/BFS to sink the island by changing connected "1"s to "0"s in 4 directions (up, down, left, right). Time: O(M * N).'
  },
  {
    dayNumber: 8,
    title: 'LeetCode 994: Rotting Oranges',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/rotting-oranges/',
    priority: 'High',
    estimatedMinutes: 35,
    readingContent: 'Multi-source BFS. Put all initial rotten oranges into a queue and count fresh oranges. In each round (minute), pop all currently rotten oranges and rot their adjacent fresh neighbors, decrementing fresh count. When queue is empty, if fresh > 0 return -1; else return minutes.'
  },
  {
    dayNumber: 8,
    title: 'LeetCode 207: Course Schedule',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/course-schedule/',
    priority: 'High',
    estimatedMinutes: 40,
    readingContent: 'Topological Sort / Cycle Detection in Directed Graph. Kahn\'s Algorithm: compute in-degree of all nodes. Push nodes with in-degree 0 to queue. While queue not empty, pop node, decrement in-degree of neighbors. If neighbor in-degree becomes 0, push to queue. If processed count == numCourses, valid topological sort exists.'
  },
  {
    dayNumber: 8,
    title: 'LeetCode 210: Course Schedule II',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/course-schedule-ii/',
    priority: 'High',
    estimatedMinutes: 40,
    readingContent: 'Extension of LC 207. Using Kahn\'s Algorithm, append each popped node with in-degree 0 to a result array. If result.length == numCourses, return result array; otherwise return empty array [].'
  },
  {
    dayNumber: 8,
    title: 'LeetCode 601: Human Traffic of Stadium',
    category: 'SQL',
    taskType: 'task',
    link: 'https://leetcode.com/problems/human-traffic-of-stadium/',
    priority: 'High',
    estimatedMinutes: 35,
    readingContent: 'Display records with 3 or more consecutive rows having people >= 100. Use window functions: SELECT id - ROW_NUMBER() OVER (ORDER BY id) as grp to cluster consecutive rows together, then filter HAVING COUNT(*) >= 3.'
  },
  {
    dayNumber: 8,
    title: 'LeetCode 586: Customer Placing the Largest Number of Orders',
    category: 'SQL',
    taskType: 'task',
    link: 'https://leetcode.com/problems/customer-placing-the-largest-number-of-orders/',
    priority: 'Medium',
    estimatedMinutes: 20,
    readingContent: 'Aggregation and ranking: SELECT customer_number FROM Orders GROUP BY customer_number ORDER BY COUNT(*) DESC LIMIT 1;'
  },
  {
    dayNumber: 8,
    title: 'Operating Systems: Deadlocks, Banker\'s Algorithm & Virtual Memory',
    category: 'OS',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 25,
    readingContent: '4 Coffman Conditions for Deadlock: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. Deadlock prevention, avoidance (Banker\'s Algorithm checking for Safe State). Virtual Memory: Paging (Logical to physical address translation via Page Table and TLB). Page fault. Thrashing (CPU spends more time swapping pages than executing instructions, solved by Working Set Model). Page replacement: FIFO, LRU, Optimal.',
    mcqs: [
      {
        question: 'Which of the following is NOT one of the four Coffman conditions required for a deadlock to occur?',
        options: ['Paging', 'Mutual Exclusion', 'Hold and Wait', 'Circular Wait'],
        correctOption: 0
      },
      {
        question: 'What hardware cache accelerates virtual-to-physical address translation in modern CPUs?',
        options: ['Translation Lookaside Buffer (TLB)', 'L1 Instruction Cache', 'Direct Memory Access (DMA)', 'Disk Controller Cache'],
        correctOption: 0
      },
      {
        question: 'What is Thrashing in an Operating System?',
        options: [
          'A state where the CPU spends significantly more time swapping pages in and out of disk than executing processes',
          'A hardware failure of the CPU clock',
          'Simultaneous deletion of multiple files',
          'A process monopolizing the CPU without context switching'
        ],
        correctOption: 0
      }
    ]
  },
  {
    dayNumber: 8,
    title: 'Java Track: String Performance, Immutability & Memory Optimization',
    category: 'Java',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 30,
    readingContent: 'String vs StringBuilder vs StringBuffer. StringBuilder is mutable and not synchronized (fastest in single-threaded loops). StringBuffer is synchronized (thread-safe). Compact Strings in Java 9+ (byte[] instead of char[] with coder LATIN1 vs UTF16). Avoiding string concatenation + inside loops.',
    mcqs: [
      {
        question: 'Why is using "+" operator inside a loop with 10,000 iterations inefficient in Java?',
        options: [
          'It creates multiple temporary StringBuilder and String objects, leading to O(N^2) complexity and heavy GC pressure',
          'It throws a StackOverflowError',
          'It cannot handle strings longer than 255 characters',
          'It forces the thread to sleep between iterations'
        ],
        correctOption: 0
      },
      {
        question: 'Between StringBuilder and StringBuffer, which one is thread-safe?',
        options: ['StringBuffer', 'StringBuilder', 'Both are equally thread-safe', 'Neither is thread-safe'],
        correctOption: 0
      },
      {
        question: 'What internal array representation did Java 9 introduce for Strings to reduce heap footprint?',
        options: ['byte[] with LATIN1 / UTF-16 encoding (Compact Strings)', 'int[]', 'short[]', 'LinkedList of characters'],
        correctOption: 0
      }
    ]
  },
  {
    dayNumber: 8,
    title: 'C++ Track: Templates, Generic Programming & Type Traits',
    category: 'C++',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 30,
    readingContent: 'Function templates and class templates. Template specialization (full vs partial specialization). Compile-time code generation (monomorphization). Type traits (<type_traits>: std::is_same, std::enable_if). Template errors readability in modern C++ with concepts (C++20).',
    mcqs: [
      {
        question: 'When is template code compiled into actual machine instructions in C++?',
        options: [
          'At compile time when the template is instantiated with a specific type',
          'At runtime when the function is first invoked',
          'During the linking phase only',
          'Template code is interpreted at runtime'
        ],
        correctOption: 0
      },
      {
        question: 'Can class templates in C++ be partially specialized?',
        options: [
          'Yes, class templates can be partially specialized, but function templates cannot (only fully specialized)',
          'No, only full specialization is allowed in C++',
          'Both function and class templates can be partially specialized',
          'Templates cannot be specialized at all'
        ],
        correctOption: 0
      },
      {
        question: 'What happens if a template is never instantiated in any translation unit?',
        options: [
          'The compiler generates no binary code for that template',
          'A compilation error is raised',
          'The linker fails with undefined reference',
          'It is compiled as void*'
        ],
        correctOption: 0
      }
    ]
  },

  // ==================== DAY 9 ====================
  {
    dayNumber: 9,
    title: 'LeetCode 55: Jump Game',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/jump-game/',
    priority: 'High',
    estimatedMinutes: 30,
    readingContent: 'Greedy algorithm tracking the maximum reachable index (maxReach). Iterate through array: if current index i > maxReach, return false. Update maxReach = max(maxReach, i + nums[i]). If maxReach >= n - 1, return true. Time: O(N), Space: O(1).'
  },
  {
    dayNumber: 9,
    title: 'LeetCode 45: Jump Game II',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/jump-game-ii/',
    priority: 'High',
    estimatedMinutes: 35,
    readingContent: 'Greedy BFS approach. Track current window [curEnd] and farthest reach [farthest]. When loop index reaches curEnd, increment jump count and update curEnd = farthest. Return jumps when end is reached. Time: O(N).'
  },
  {
    dayNumber: 9,
    title: 'LeetCode 78: Subsets',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/subsets/',
    priority: 'Medium',
    estimatedMinutes: 35,
    readingContent: 'Backtracking power set generation. At each index, decide whether to include or exclude nums[i]. Add a copy of current path to results. Can also be solved iteratively by bitmasking from 0 to 2^N - 1. Time: O(N * 2^N).'
  },
  {
    dayNumber: 9,
    title: 'LeetCode 46: Permutations',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/permutations/',
    priority: 'High',
    estimatedMinutes: 35,
    readingContent: 'Backtracking permutations of distinct integers. Maintain a boolean visited array, or in-place recursive swap between start and i from start to n-1. Total permutations: N!. Time: O(N * N!).'
  },
  {
    dayNumber: 9,
    title: 'LeetCode 607: Sales Person',
    category: 'SQL',
    taskType: 'task',
    link: 'https://leetcode.com/problems/sales-person/',
    priority: 'Medium',
    estimatedMinutes: 20,
    readingContent: 'Find all salespersons who did not have any orders related to company "RED": SELECT s.name FROM SalesPerson s WHERE s.sales_id NOT IN (SELECT o.sales_id FROM Orders o JOIN Company c ON o.com_id = c.com_id WHERE c.name = "RED");'
  },
  {
    dayNumber: 9,
    title: 'LeetCode 511: Game Play Analysis I',
    category: 'SQL',
    taskType: 'task',
    link: 'https://leetcode.com/problems/game-play-analysis-i/',
    priority: 'Medium',
    estimatedMinutes: 20,
    readingContent: 'Find first login date for each player: SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id;'
  },
  {
    dayNumber: 9,
    title: 'Accenture Pseudocode Mastery & Bitwise Operations',
    category: 'Technical',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 30,
    readingContent: 'Accenture includes an 18-question Pseudocode section. Major themes: Bitwise operators (a ^ b for XOR, a & b for AND, a | b for OR, ~a bitwise NOT). XOR properties: a ^ a = 0, a ^ 0 = a, a ^ b ^ a = b. Nested while loops tracing variables, short-circuit evaluation in logical conditions (&& and ||), and recursive call stack traces.',
    mcqs: [
      {
        question: 'In Accenture pseudocode, what is the output of the expression: (7 ^ 5) & (7 | 5)?',
        options: ['2', '7', '5', '0'],
        correctOption: 0
      },
      {
        question: 'What does the bitwise operation (n & (n - 1)) do to an integer n?',
        options: [
          'Clears the lowest (rightmost) set bit (1) in n',
          'Doubles the value of n',
          'Checks if n is odd',
          'Inverts all bits of n'
        ],
        correctOption: 0
      },
      {
        question: 'If a recursive function is defined as: function f(n) { if (n <= 1) return 1; return n * f(n - 2); }, what is f(6)?',
        options: ['48 (6 * 4 * 2 * 1)', '720', '36', '120'],
        correctOption: 0
      }
    ]
  },
  {
    dayNumber: 9,
    title: 'Java Track: Fast I/O, Custom Comparators & Exam Best Practices',
    category: 'Java',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 30,
    readingContent: 'Accenture AEH test platform optimization in Java: Avoid Scanner for large inputs; use BufferedReader and StringTokenizer. Custom comparators with lambda: (a, b) -> Integer.compare(a[0], b[0]). Beware of integer subtraction in comparator (a - b can overflow if values have different signs!). BigInteger for huge factorial/modulo problems.',
    mcqs: [
      {
        question: 'Why is using (a - b) inside a Comparator dangerous in Java?',
        options: [
          'If a is a large positive number and b is a large negative number, (a - b) overflows to negative, corrupting sort order',
          'It is slower than division',
          'Java does not allow minus signs in lambdas',
          'It only works for floating-point numbers'
        ],
        correctOption: 0
      },
      {
        question: 'Which class provides the fastest input parsing in Java for competitive programming test platforms?',
        options: ['BufferedReader with custom fast reader', 'Scanner', 'System.console().readLine()', 'DataInputStream'],
        correctOption: 0
      },
      {
        question: 'How do you sort a List of pairs by first element ascending, then second element descending in Java 8?',
        options: [
          'list.sort(Comparator.comparingInt((int[] a) -> a[0]).thenComparing((int[] a) -> -a[1]))',
          'Collections.sort(list)',
          'list.stream().sorted()',
          'Arrays.sort(list)'
        ],
        correctOption: 0
      }
    ]
  },
  {
    dayNumber: 9,
    title: 'C++ Track: Fast I/O, Lambda Comparators & Competitive Tricks',
    category: 'C++',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 30,
    readingContent: 'Accenture online assessment optimization in C++: Fast I/O via "ios_base::sync_with_stdio(false); cin.tie(NULL);". Avoid std::endl (forces flush); use "\n". Custom lambda comparator with std::sort: std::sort(vec.begin(), vec.end(), [](const auto& a, const auto& b) { return a.first == b.first ? a.second > b.second : a.first < b.first; }).',
    mcqs: [
      {
        question: 'What does "ios_base::sync_with_stdio(false);" do in C++?',
        options: [
          'Disables synchronization between C standard streams (printf/scanf) and C++ streams (cin/cout), drastically accelerating I/O',
          'Disables multi-threading in C++',
          'Enables binary I/O',
          'Flushes stdout after every character'
        ],
        correctOption: 0
      },
      {
        question: 'Why should "\n" be preferred over std::endl in time-sensitive competitive programming loops?',
        options: [
          'std::endl inserts a newline AND explicitly flushes the output buffer, which causes massive I/O bottlenecks',
          'std::endl does not work on Linux',
          'std::endl consumes 8 bytes of stack memory',
          '"\n" is automatically converted to ASCII 0'
        ],
        correctOption: 0
      },
      {
        question: 'In C++ std::sort, what property must a custom comparator satisfy to prevent undefined behavior and crashes?',
        options: ['Strict Weak Ordering (cmp(x, x) must be false)', 'Total Equality', 'Symmetric Reflexivity', 'Equivalence Closure'],
        correctOption: 0
      }
    ]
  },

  // ==================== DAY 10 ====================
  {
    dayNumber: 10,
    title: 'LeetCode 146: LRU Cache (Design Problem)',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/lru-cache/',
    priority: 'High',
    estimatedMinutes: 45,
    readingContent: 'Top High-Value Accenture AEH design question. Implement Least Recently Used (LRU) Cache with get(key) and put(key, value) in O(1) average time. Data structure: Hash Map pointing to nodes in a Doubly Linked List with dummy head and dummy tail. Most recently used nodes moved to head; least recently used evicted from tail.'
  },
  {
    dayNumber: 10,
    title: 'LeetCode 152: Maximum Product Subarray',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/maximum-product-subarray/',
    priority: 'High',
    estimatedMinutes: 35,
    readingContent: 'Dynamic Programming tracking both max_so_far and min_so_far (because multiplying two negative numbers creates a positive product!). When nums[i] is negative, swap max_so_far and min_so_far before calculating. Update global_max.'
  },
  {
    dayNumber: 10,
    title: 'LeetCode 137: Single Number II',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/single-number-ii/',
    priority: 'High',
    estimatedMinutes: 35,
    readingContent: 'Every element appears three times except one. Solution 1: Count set bits at each of the 32 bit positions modulo 3. Solution 2: Digital logic bitmask state machine using variables "ones" and "twos". Time: O(N), Space: O(1).'
  },
  {
    dayNumber: 10,
    title: 'LeetCode 260: Single Number III',
    category: 'DSA',
    taskType: 'task',
    link: 'https://leetcode.com/problems/single-number-iii/',
    priority: 'High',
    estimatedMinutes: 35,
    readingContent: 'Two numbers appear once, all others twice. XOR all numbers -> xorAll = a ^ b. Find any set bit in xorAll (diff = xorAll & (-xorAll)). Partition array into two groups based on whether that bit is set. XORing each group reveals a and b respectively. Time: O(N), Space: O(1).'
  },
  {
    dayNumber: 10,
    title: 'LeetCode 197: Rising Temperature',
    category: 'SQL',
    taskType: 'task',
    link: 'https://leetcode.com/problems/rising-temperature/',
    priority: 'Medium',
    estimatedMinutes: 20,
    readingContent: 'Find all dates with higher temperatures compared to their previous dates: SELECT w1.id FROM Weather w1 JOIN Weather w2 ON DATEDIFF(w1.recordDate, w2.recordDate) = 1 WHERE w1.temperature > w2.temperature;'
  },
  {
    dayNumber: 10,
    title: 'LeetCode 1741: Find Total Time Spent by Each Employee',
    category: 'SQL',
    taskType: 'task',
    link: 'https://leetcode.com/problems/find-total-time-spent-by-each-employee/',
    priority: 'Medium',
    estimatedMinutes: 20,
    readingContent: 'Aggregation and grouping: SELECT event_day AS day, emp_id, SUM(out_time - in_time) AS total_time FROM Employees GROUP BY event_day, emp_id;'
  },
  {
    dayNumber: 10,
    title: 'MS Office Advanced & Cloud Architecture Concepts',
    category: 'Technical',
    taskType: 'reading',
    priority: 'High',
    estimatedMinutes: 25,
    readingContent: 'Accenture Cloud & MS Office wrap-up: Cloud service delivery models: IaaS (Infrastructure as a Service: EC2, Azure VMs), PaaS (Platform as a Service: Heroku, Elastic Beanstalk), SaaS (Software as a Service: Google Workspace, Salesforce). Cloud deployment models: Public, Private, Hybrid. Excel nested IF statements and XLOOKUP advantages over VLOOKUP (works in any direction, no column index count).',
    mcqs: [
      {
        question: 'Which cloud service model provides virtualized computing resources over the internet where the customer manages the OS, middleware, and applications?',
        options: ['IaaS (Infrastructure as a Service)', 'SaaS (Software as a Service)', 'PaaS (Platform as a Service)', 'FaaS (Function as a Service)'],
        correctOption: 0
      },
      {
        question: 'What major advantage does the Excel XLOOKUP function offer over traditional VLOOKUP?',
        options: [
          'It can search in any direction (left or right) and defaults to an exact match',
          'It only works on numbers',
          'It requires sorting the data alphabetically first',
          'It runs on the GPU'
        ],
        correctOption: 0
      },
      {
        question: 'In Microsoft PowerPoint, what feature allows you to define universal formatting, slide fonts, and logos across all slides in a presentation?',
        options: ['Slide Master', 'Transition Wizard', 'Animation Pane', 'SmartArt'],
        correctOption: 0
      }
    ]
  },
  {
    dayNumber: 10,
    title: 'Accenture AEH Full Readiness Mock Assessment',
    category: 'Mock Test',
    taskType: 'assessment',
    priority: 'High',
    estimatedMinutes: 60,
    readingContent: 'Full simulation of the Accenture Advanced Application Engineering High-Value (AEH) Drive. Test yourself on time complexity analysis, algorithm selection, SQL joins, and core CS fundamentals.',
    mcqs: [
      {
        question: 'What is the optimal time complexity to find the Kth largest element in an unsorted array of size N using Quickselect?',
        options: ['O(N) average time', 'O(N log N) worst time', 'O(K log N)', 'O(N^2) average time'],
        correctOption: 0
      },
      {
        question: 'Which algorithm detects cycles in a directed graph using in-degree counts?',
        options: ['Kahn\'s Algorithm (Topological Sort BFS)', 'Kruskal\'s Algorithm', 'Dijkstra\'s Algorithm', 'Bellman-Ford Algorithm'],
        correctOption: 0
      },
      {
        question: 'In SQL, what is the key difference between RANK() and DENSE_RANK() window functions?',
        options: [
          'RANK() skips rank numbers after duplicates (e.g. 1, 2, 2, 4); DENSE_RANK() leaves no gaps (e.g. 1, 2, 2, 3)',
          'DENSE_RANK() cannot be partitioned',
          'RANK() only works with strings',
          'There is no difference'
        ],
        correctOption: 0
      },
      {
        question: 'In Operating Systems, what does a Page Fault indicate?',
        options: [
          'The requested page is not currently loaded in physical RAM (present bit is 0 in page table)',
          'The hard disk has crashed',
          'The process has performed an illegal memory access and must terminate',
          'The CPU registers are full'
        ],
        correctOption: 0
      },
      {
        question: 'Which design pattern ensures a class has only one instance while providing a global point of access?',
        options: ['Singleton Pattern', 'Factory Pattern', 'Observer Pattern', 'Strategy Pattern'],
        correctOption: 0
      }
    ]
  }
];

async function seed() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas!');

    // 1. Find User
    const user = await User.findOne({ email: TARGET_EMAIL });
    if (!user) {
      console.error(`❌ User with email ${TARGET_EMAIL} not found!`);
      process.exit(1);
    }
    console.log(`👤 Found User: ${user.name} (${user.email}, ID: ${user._id})`);

    // 2. Find or Update Schedule
    let schedule = await Schedule.findById(SCHEDULE_ID);
    if (!schedule) {
      console.log('Creating new schedule for Accenture AEH...');
      schedule = new Schedule({
        _id: new mongoose.Types.ObjectId(SCHEDULE_ID),
        creatorId: user._id,
        companyName: 'Accenture',
        title: 'Accenture Quick Revision (AEH Advanced Track)',
        description: 'Comprehensive 10-day preparation roadmap for Accenture Advanced Application Engineering High-Value (AEH) on-campus drive. Includes daily 4 LeetCode DSA problems, 2 LeetCode SQL queries, core technical topics (MS Office, OOPs, DBMS, CN, OS, Pseudocode), and dual Java & C++ programming tracks.',
        totalDays: 10,
        color: '#8b5cf6',
        isPublic: true,
        followerCount: 1
      });
      await schedule.save();
    } else {
      schedule.title = 'Accenture Quick Revision (AEH Advanced Track)';
      schedule.description = 'Comprehensive 10-day preparation roadmap for Accenture Advanced Application Engineering High-Value (AEH) on-campus drive. Includes daily 4 LeetCode DSA problems, 2 LeetCode SQL queries, core technical topics (MS Office, OOPs, DBMS, CN, OS, Pseudocode), and dual Java & C++ programming tracks.';
      schedule.creatorId = user._id;
      schedule.totalDays = 10;
      schedule.color = '#8b5cf6';
      await schedule.save();
      console.log(`📋 Updated Schedule: ${schedule.title} (${schedule._id})`);
    }

    // 3. Clear existing tasks for this schedule
    const deletedTasks = await ScheduleTask.deleteMany({ scheduleId: schedule._id });
    console.log(`🗑️ Cleared ${deletedTasks.deletedCount} existing tasks for schedule.`);

    // 4. Insert all curated tasks (60 DSA/SQL + 29 Rich Technical/Core CS/Java/C++ modules with 10 MCQs each)
    const codingTasks = tasksData.filter(t => t.category === 'DSA' || t.category === 'SQL');
    const richNonCoding = [...technicalTasks, ...coreCSTasks, ...javaTasks, ...cppTasks];
    const combinedTasks = [...codingTasks, ...richNonCoding].sort((a, b) => a.dayNumber - b.dayNumber);

    const tasksToInsert = combinedTasks.map(t => ({
      ...t,
      scheduleId: schedule._id
    }));

    const insertedTasks = await ScheduleTask.insertMany(tasksToInsert);
    console.log(`🎉 Successfully seeded ${insertedTasks.length} tasks across 10 days!`);

    // Summary of tasks by category
    const catCounts = {};
    insertedTasks.forEach(t => {
      catCounts[t.category] = (catCounts[t.category] || 0) + 1;
    });
    console.log('📊 Tasks distribution by category:', catCounts);

    // 5. Ensure Enrollment for Karan Kumar starts TODAY in IST (Asia/Kolkata)
    const today = new Date();
    const istStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(today);
    const [y, m, d] = istStr.split('-').map(Number);
    const istToday = new Date(Date.UTC(y, m - 1, d));
    const targetDate = new Date(istToday);
    targetDate.setDate(targetDate.getDate() + 10);

    let enrollment = await Enrollment.findOne({ userId: user._id, scheduleId: schedule._id });
    if (!enrollment) {
      enrollment = new Enrollment({
        userId: user._id,
        scheduleId: schedule._id,
        startDate: today,
        targetDate,
        label: 'My Schedule',
        isActive: true
      });
      await enrollment.save();
      console.log(`🎓 Created active enrollment for ${user.name} starting today (Day 1)`);
    } else {
      enrollment.startDate = today;
      enrollment.targetDate = targetDate;
      await enrollment.save();
      console.log(`🎓 Updated active enrollment for ${user.name} starting today (Day 1)`);
    }

    // 6. Clear any task progress so student starts fresh from Day 1 with 0/89
    const clearedProgress = await TaskProgress.deleteMany({ userId: user._id, enrollmentId: enrollment._id });
    console.log(`✨ Cleared ${clearedProgress.deletedCount} progress records. Student starts fresh at Day 1 (0/${insertedTasks.length})!`);

    console.log('\n✅ ACCENTURE AEH SEEDING COMPLETED SUCCESSFULLY!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
}

seed();
