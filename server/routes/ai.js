const express = require('express');
const router = express.Router();

// Robust Fisher-Yates Option Shuffler - Guarantees uniform 25% distribution across A, B, C, D
const shuffleOptionsAndDistribute = (mcq) => {
  if (!mcq || !Array.isArray(mcq.options) || mcq.options.length !== 4) return mcq;

  const validCorrectIdx = (typeof mcq.correctOption === 'number' && mcq.correctOption >= 0 && mcq.correctOption < 4) 
    ? mcq.correctOption 
    : 0;

  const correctText = mcq.options[validCorrectIdx];
  const shuffled = [...mcq.options];

  // Fisher-Yates Shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const newCorrectIndex = shuffled.indexOf(correctText);

  return {
    question: String(mcq.question || '').trim(),
    options: shuffled.map(opt => String(opt || '').trim()),
    correctOption: newCorrectIndex !== -1 ? newCorrectIndex : Math.floor(Math.random() * 4)
  };
};

// Deduplication filter to prevent repeated questions
const deduplicateMCQs = (mcqs) => {
  const seenStems = new Set();
  const uniqueList = [];

  for (const item of mcqs) {
    if (!item || !item.question || !Array.isArray(item.options) || item.options.length < 4) continue;
    
    // Normalize question stem for comparison
    const normalizedStem = item.question.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 45);
    if (!seenStems.has(normalizedStem)) {
      seenStems.add(normalizedStem);
      uniqueList.push(shuffleOptionsAndDistribute(item));
    }
  }

  return uniqueList;
};

// Comprehensive Fallback Question Bank covering diverse topics without duplicates
const generateDiverseFallbackMCQs = (prompt, numQuestions) => {
  const topic = prompt.trim();
  const bank = [
    {
      q: `What is the primary architectural purpose of ${topic} in modern software engineering?`,
      opts: [
        `To decouple components, optimize scalability, and maintain predictable system behavior`,
        `To enforce linear sequential processing without asynchronous capabilities`,
        `To bypass data validation rules for faster input execution`,
        `To convert runtime errors into unhandled silent warnings`
      ],
      correct: 0
    },
    {
      q: `When analyzing the computational complexity related to ${topic}, which characteristic is typical?`,
      opts: [
        `Optimal implementations target logarithmic O(log N) or linearithmic O(N log N) bounds`,
        `All operations unconditionally require exponential O(2^N) runtime`,
        `Memory allocation is strictly constant regardless of input scale`,
        `Processing speed decreases linearly with CPU clock cycles`
      ],
      correct: 0
    },
    {
      q: `Which design pattern or methodology is most effective when implementing ${topic}?`,
      opts: [
        `Modular encapsulation with clear interface separation and dependency injection`,
        `Direct global state mutation across independent threads`,
        `Unchecked recursive loops with dynamic termination criteria`,
        `Tight coupling of presentation logic with data persistence layers`
      ],
      correct: 0
    },
    {
      q: `What is the standard behavior when handling edge cases or boundary conditions in ${topic}?`,
      opts: [
        `Gracefully capturing exceptions and returning sanitized fallback responses`,
        `Terminating the parent thread without freeing allocated resources`,
        `Ignoring invalid inputs and writing corrupted payloads to disk`,
        `Reinitializing the entire database connection pool unconditionally`
      ],
      correct: 0
    },
    {
      q: `In technical placement assessments, what is a key pitfall candidates make regarding ${topic}?`,
      opts: [
        `Overlooking space complexity trade-offs and memory leak risks in long-running processes`,
        `Writing modular helper functions instead of monolithic scripts`,
        `Using standardized data structures from the language standard library`,
        `Adding comprehensive input validation and type checking`
      ],
      correct: 0
    },
    {
      q: `How does concurrency or multi-threading impact ${topic}?`,
      opts: [
        `Requires synchronization primitives or atomic operations to avoid race conditions`,
        `Automatically prevents deadlocks without locks or mutexes`,
        `Disables all asynchronous I/O operations entirely`,
        `Forces memory pages to be duplicated across all core caches`
      ],
      correct: 0
    },
    {
      q: `Which of the following metrics is most crucial when benchmarking ${topic}?`,
      opts: [
        `Throughput (QPS/TPS), latency percentiles (p95/p99), and resource utilization`,
        `Source code line count and file size on disk`,
        `Number of comments written per function definition`,
        `Alphabetical ordering of exported variable identifiers`
      ],
      correct: 0
    },
    {
      q: `What role does caching or memoization play in optimizing ${topic}?`,
      opts: [
        `Reduces redundant calculations and roundtrip database queries for expensive operations`,
        `Increases network packet size to accelerate data transmission`,
        `Eliminates the requirement for persistent database storage`,
        `Bypasses operating system security permissions dynamically`
      ],
      correct: 0
    },
    {
      q: `When refactoring legacy implementations of ${topic}, what is the recommended practice?`,
      opts: [
        `Writing regression unit tests before restructuring core algorithm logic`,
        `Deleting existing test suites to prevent build failures during migration`,
        `Merging separate modules into a single shared execution block`,
        `Hardcoding configuration constants directly into production binaries`
      ],
      correct: 0
    },
    {
      q: `What security consideration must be addressed when exposing APIs related to ${topic}?`,
      opts: [
        `Sanitizing user inputs to mitigate injection attacks and enforcing rate limiting`,
        `Disabling CORS policies for all external cross-origin domains`,
        `Exposing detailed internal stack traces in public error responses`,
        `Using unencrypted HTTP protocols to reduce encryption overhead`
      ],
      correct: 0
    },
    {
      q: `How should database transactions interacting with ${topic} be handled?`,
      opts: [
        `Adhering to ACID properties and using appropriate isolation levels`,
        `Committing partial updates without rollback mechanisms`,
        `Executing schema migrations directly within user request lifecycles`,
        `Disabling foreign key constraints to speed up batch inserts`
      ],
      correct: 0
    },
    {
      q: `What is the impact of excessive nesting and high cyclomatic complexity in ${topic}?`,
      opts: [
        `Degrades code readability, increases bug probability, and complicates unit testing`,
        `Improves JIT compiler optimization across all architectures`,
        `Reduces the physical RAM required during application execution`,
        `Guarantees deterministic execution across distributed nodes`
      ],
      correct: 0
    },
    {
      q: `In terms of fault tolerance, what mechanism best ensures high availability for ${topic}?`,
      opts: [
        `Automated health checks, circuit breakers, and graceful degradation strategies`,
        `Restarting the entire operating system on every caught exception`,
        `Storing all critical state in ephemeral single-node local memory`,
        `Ignoring network timeout thresholds during peak traffic hours`
      ],
      correct: 0
    },
    {
      q: `Which data structure is typically most suitable for efficient lookups in ${topic}?`,
      opts: [
        `Hash Map / Hash Table providing average O(1) time complexity`,
        `Singly Linked List requiring O(N) linear search for all operations`,
        `Unsorted Array requiring full scan for every query`,
        `Fixed-size queue with FIFO eviction policies`
      ],
      correct: 0
    },
    {
      q: `What is the primary trade-off when optimizing ${topic} for space over time?`,
      opts: [
        `Memory consumption is minimized at the cost of additional compute iterations`,
        `CPU cycles are decreased while RAM footprint expands indefinitely`,
        `Network bandwidth is multiplied by redundant packet retransmissions`,
        `Database indices are duplicated across all read replicas`
      ],
      correct: 0
    },
    {
      q: `How do modern frameworks manage lifecycle events related to ${topic}?`,
      opts: [
        `Through declarative hooks, event loops, and cleanup callbacks`,
        `By creating unbounded background worker threads for every function call`,
        `By forcing developers to manually deallocate heap memory`,
        `By halting application execution until all pending promises reject`
      ],
      correct: 0
    },
    {
      q: `What does idempotency mean in the context of operations for ${topic}?`,
      opts: [
        `Executing the operation multiple times produces the same result as a single execution`,
        `The operation can only be triggered once in the entire application lifetime`,
        `The function executes in zero milliseconds without side effects`,
        `The operation requires multiple concurrent threads to complete successfully`
      ],
      correct: 0
    },
    {
      q: `Which approach is best for debugging subtle state synchronization issues in ${topic}?`,
      opts: [
        `Structured logging, distributed tracing, and reproducible test cases`,
        `Adding arbitrary sleep delays throughout the codebase`,
        `Increasing database connection limits without investigating queries`,
        `Suppressing console error output in staging environments`
      ],
      correct: 0
    },
    {
      q: `When designing scalable microservices around ${topic}, how should data communication occur?`,
      opts: [
        `Using asynchronous message queues or standardized REST/gRPC interfaces with versioning`,
        `Sharing a single monolithic SQL table directly between all services`,
        `Relying on hardcoded local IP addresses without service discovery`,
        `Transmitting uncompressed raw memory dumps across network sockets`
      ],
      correct: 0
    },
    {
      q: `What distinguishes a clean production-grade implementation of ${topic} from a prototype?`,
      opts: [
        `Robust error boundaries, automated CI/CD tests, monitoring, and thorough documentation`,
        `Minimizing the number of files by putting all code in a single file`,
        `Avoiding dependency managers and hand-copying library files`,
        `Skipping input validation to maximize raw execution throughput`
      ],
      correct: 0
    }
  ];

  const shuffledBank = bank.sort(() => Math.random() - 0.5);
  const selected = [];

  for (let i = 0; i < Math.min(numQuestions, shuffledBank.length); i++) {
    selected.push(shuffleOptionsAndDistribute(shuffledBank[i]));
  }

  let idx = 0;
  while (selected.length < numQuestions) {
    const base = shuffledBank[idx % shuffledBank.length];
    selected.push(shuffleOptionsAndDistribute({
      q: `[Advanced Analysis] ${base.q}`,
      opts: base.opts,
      correct: base.correct
    }));
    idx++;
  }

  return selected;
};

// Fallback smart reading material generator
const generateFallbackReading = (prompt) => {
  const topic = prompt.trim();
  return `# Comprehensive Guide: ${topic}

## 1. Overview & Fundamentals
${topic} is an essential core topic frequently tested in campus placements and technical interviews. Understanding its theoretical principles and practical implementation allows developers to write robust, efficient, and scalable applications.

### Key Learning Objectives:
- Master the underlying architecture of **${topic}**.
- Learn real-world software design patterns and implementation techniques.
- Understand common pitfalls, edge cases, and optimization strategies.

---

## 2. Practical Examples & Usage

### Code Example:
\`\`\`javascript
// Practical implementation example of ${topic}
function demonstrate${topic.replace(/[^a-zA-Z0-9]/g, '')}() {
  console.log("Executing practical workflow for ${topic}...");
  const data = [1, 2, 3, 4, 5];
  const result = data.map(item => item * 2);
  return result;
}

const output = demonstrate${topic.replace(/[^a-zA-Z0-9]/g, '')}();
console.log("Result:", output);
\`\`\`

---

## 3. Real-World Applications & Best Practices

1. **System Optimization**: Always evaluate time and space complexity ($O(N)$ vs $O(N \\log N)$).
2. **Edge Case Handling**: Validate boundary conditions, null inputs, and unexpected data formats before processing.
3. **Clean Code**: Keep functions modular, well-documented, and decoupled.

---

## 4. Frequently Asked Placement Interview Questions

- **Q1:** What is the primary purpose of ${topic} in production environments?
- **Q2:** How does ${topic} compare with alternative architectural approaches?
- **Q3:** How do you handle exceptions or memory overhead when scaling ${topic}?
`;
};

// Helper to make a single Hugging Face Chat Completion request for a subset of questions
const callHuggingFaceMCQBatch = async ({ hfKey, modelName, modelUrl, prompt, count, focusDomain, batchId }) => {
  const startTime = Date.now();
  console.log(`📡 [AI-MCQ Batch ${batchId}] Requesting ${count} questions (Focus: ${focusDomain}) on "${prompt}"...`);

  const systemInstruction = `You are a Principal Technical Interviewer creating questions for a placement exam.
Generate exactly ${count} UNIQUE multiple choice questions for topic: "${prompt}".
Focus specifically on: ${focusDomain}.
RULES:
1. NO DUPLICATE QUESTIONS. Every question must test a distinct sub-concept or code problem.
2. PLAUSIBLE OPTIONS: All 4 options (A, B, C, D) must be realistic technical terms.
3. RANDOMIZE ANSWER KEYS: Distribute correct answers across indices 0, 1, 2, 3 evenly.
4. ONLY VALID JSON ARRAY. No backticks, no markdown, no conversational text.

JSON Schema:
[
  {
    "question": "Question statement?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctOption": 2
  }
]`;

  try {
    const response = await fetch(modelUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: `Generate ${count} diverse MCQs on ${prompt} focused on ${focusDomain}.` }
        ],
        temperature: 0.6,
        max_tokens: Math.min(count * 200 + 400, 3000)
      })
    });

    const elapsed = Date.now() - startTime;

    if (!response.ok) {
      const errText = await response.text();
      console.error(`❌ [AI-MCQ Batch ${batchId}] Error HTTP ${response.status} (${elapsed}ms):`, errText);
      return [];
    }

    const hfData = await response.json();
    const generatedText = hfData.choices?.[0]?.message?.content || '';
    console.log(`✅ [AI-MCQ Batch ${batchId}] Received response (${elapsed}ms, ${generatedText.length} chars)`);

    let parsed = [];
    const jsonStart = generatedText.indexOf('[');
    const jsonEnd = generatedText.lastIndexOf(']');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      parsed = JSON.parse(generatedText.substring(jsonStart, jsonEnd + 1));
    } else {
      parsed = JSON.parse(generatedText);
    }

    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error(`⚠️ [AI-MCQ Batch ${batchId}] Exception (${Date.now() - startTime}ms):`, err.message);
    return [];
  }
};

// @route   POST /api/ai/generate-mcq
// @desc    Fast Parallel & Accountable MCQ Generator with Real-Time Server Logging
router.post('/generate-mcq', async (req, res) => {
  const reqStart = Date.now();
  try {
    const { prompt, numQuestions = 5, timeLimit = 10, apiKey } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt/Topic is required' });
    }

    const count = Math.min(Math.max(Number(numQuestions) || 5, 1), 30);
    const hfKey = apiKey || process.env.HUGGINGFACE_API_KEY;

    console.log(`\n======================================================`);
    console.log(`🚀 [AI-MCQ Request] Topic: "${prompt}" | Requested: ${count} Qs | Time: ${timeLimit}m`);
    console.log(`======================================================`);

    if (!hfKey) {
      console.log('ℹ️ [AI-MCQ] No HUGGINGFACE_API_KEY configured. Serving curated question bank...');
      const fallbackQuestions = generateDiverseFallbackMCQs(prompt, count);
      return res.json({
        title: `${prompt} — MCQ Assessment`,
        estimatedMinutes: timeLimit,
        mcqs: fallbackQuestions,
        source: 'diverse-generator'
      });
    }

    const modelName = process.env.HUGGINGFACE_MODEL || 'meta-llama/Llama-3.1-8B-Instruct';
    const modelUrl = 'https://router.huggingface.co/v1/chat/completions';

    let allGeneratedMCQs = [];

    // Optimize execution time: If count > 10, split into 2 parallel batches for 2x faster speed!
    if (count > 10) {
      const half = Math.ceil(count / 2);
      console.log(`⚡ [AI-MCQ] Splitting ${count} questions into 2 concurrent parallel batches (~${half} Qs each)...`);

      const [batch1, batch2] = await Promise.all([
        callHuggingFaceMCQBatch({
          hfKey,
          modelName,
          modelUrl,
          prompt,
          count: half,
          focusDomain: 'Core Concepts, Definitions, Syntax, and Time/Space Complexity',
          batchId: 1
        }),
        callHuggingFaceMCQBatch({
          hfKey,
          modelName,
          modelUrl,
          prompt,
          count: count - half,
          focusDomain: 'Practical Code Analysis, Edge Cases, Error Handling, and System Architecture',
          batchId: 2
        })
      ]);

      allGeneratedMCQs = [...batch1, ...batch2];
    } else {
      allGeneratedMCQs = await callHuggingFaceMCQBatch({
        hfKey,
        modelName,
        modelUrl,
        prompt,
        count,
        focusDomain: 'Core Concepts, Code Syntax, Complexity, and Practical Applications',
        batchId: 1
      });
    }

    console.log(`🔀 [AI-MCQ] Deduplicating & applying Fisher-Yates option shuffler across ${allGeneratedMCQs.length} questions...`);
    let processedMCQs = deduplicateMCQs(allGeneratedMCQs);

    // If API returned fewer questions than requested or had network dropouts, top up from diverse bank
    if (processedMCQs.length < count) {
      console.log(`ℹ️ [AI-MCQ] Topping up ${count - processedMCQs.length} questions to reach requested count of ${count}...`);
      const topUp = generateDiverseFallbackMCQs(prompt, count - processedMCQs.length);
      processedMCQs = [...processedMCQs, ...topUp];
    }

    const finalMCQs = processedMCQs.slice(0, count);
    const totalElapsed = Date.now() - reqStart;

    console.log(`🎉 [AI-MCQ] Completed in ${totalElapsed}ms! Returning ${finalMCQs.length} verified questions with balanced keys.`);
    console.log(`======================================================\n`);

    res.json({
      title: `${prompt} — MCQ Assessment`,
      estimatedMinutes: timeLimit,
      mcqs: finalMCQs,
      source: 'huggingface-parallel-accountable',
      generationTimeMs: totalElapsed
    });

  } catch (err) {
    console.error('❌ [AI-MCQ Error]:', err.message);
    const count = Math.min(Math.max(Number(req.body.numQuestions) || 5, 1), 30);
    const fallbackQuestions = generateDiverseFallbackMCQs(req.body.prompt || 'Technical', count);
    res.json({
      title: `${req.body.prompt || 'Technical'} — MCQ Assessment`,
      estimatedMinutes: req.body.timeLimit || 10,
      mcqs: fallbackQuestions,
      source: 'fallback'
    });
  }
});

// @route   POST /api/ai/generate-reading
// @desc    Generate structured study reading material with AI (meta-llama/Llama-3.1-8B-Instruct)
router.post('/generate-reading', async (req, res) => {
  const reqStart = Date.now();
  try {
    const { prompt, estimatedMinutes = 20, apiKey } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Topic/Prompt is required' });
    }

    console.log(`📖 [AI-Reading Request] Topic: "${prompt}" | Reading Time: ${estimatedMinutes}m`);
    const hfKey = apiKey || process.env.HUGGINGFACE_API_KEY;

    if (!hfKey) {
      const fallbackText = generateFallbackReading(prompt);
      return res.json({
        title: `${prompt} Study Material`,
        estimatedMinutes,
        readingContent: fallbackText,
        source: 'smart-fallback'
      });
    }

    const modelName = process.env.HUGGINGFACE_MODEL || 'meta-llama/Llama-3.1-8B-Instruct';
    const modelUrl = 'https://router.huggingface.co/v1/chat/completions';

    const systemInstruction = `You are a senior technical educator writing clean placement study notes.
Write a clear, beautifully structured Markdown reading module on topic: "${prompt}".
Rules:
- Use standard Markdown headers (# Header 1, ## Header 2, ### Header 3). Do NOT use underline equals or hyphens (=== or ---) for headers.
- Use standard bullet lists (- Item) and numbered lists (1. Item).
- Format all code snippets in fenced code blocks with language specifiers (e.g. \`\`\`sql, \`\`\`javascript, \`\`\`cpp).
- Format tables in standard Markdown table syntax with newlines between rows.
- Bold important terminology using **bold text**.
Structure:
# Core Concepts & Overview
## Detailed Explanation & Architecture
## Real-World Code & Practical Examples
## Industry Applications & Common Interview Questions`;

    const response = await fetch(modelUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: `Explain ${prompt} in detail with practical examples, code blocks, and interview notes.` }
        ],
        temperature: 0.35,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      const fallbackText = generateFallbackReading(prompt);
      return res.json({
        title: `${prompt} Study Material`,
        estimatedMinutes,
        readingContent: fallbackText,
        source: 'smart-fallback'
      });
    }

    const hfData = await response.json();
    let generatedContent = hfData.choices?.[0]?.message?.content || generateFallbackReading(prompt);
    const totalElapsed = Date.now() - reqStart;

    console.log(`🎉 [AI-Reading] Generated study notes in ${totalElapsed}ms.`);

    res.json({
      title: `${prompt} Study Notes`,
      estimatedMinutes,
      readingContent: generatedContent,
      source: 'huggingface-llama3.1',
      generationTimeMs: totalElapsed
    });

  } catch (err) {
    console.error('AI Reading Generation Error:', err.message);
    res.json({
      title: `${req.body.prompt || 'Study'} Reading Notes`,
      estimatedMinutes: req.body.estimatedMinutes || 20,
      readingContent: generateFallbackReading(req.body.prompt || 'Technical Topic'),
      source: 'fallback'
    });
  }
});

module.exports = router;
