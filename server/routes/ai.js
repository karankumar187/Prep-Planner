const express = require('express');
const router = express.Router();

// Robust Fisher-Yates Option Shuffler - Guarantees uniform 25% distribution across A, B, C, D
const shuffleOptionsAndDistribute = (mcq) => {
  if (!mcq) return null;

  const qText = mcq.question || mcq.q || '';
  const rawOpts = mcq.options || mcq.opts || [];

  if (!Array.isArray(rawOpts) || rawOpts.length < 4) return null;

  const validCorrectIdx = (typeof mcq.correctOption === 'number' && mcq.correctOption >= 0 && mcq.correctOption < 4) 
    ? mcq.correctOption 
    : (typeof mcq.correct === 'number' && mcq.correct >= 0 && mcq.correct < 4)
    ? mcq.correct
    : 0;

  const correctText = rawOpts[validCorrectIdx] || rawOpts[0];
  const shuffled = [...rawOpts.slice(0, 4)];

  // Fisher-Yates Shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const newCorrectIndex = shuffled.indexOf(correctText);

  return {
    question: String(qText).trim(),
    options: shuffled.map(opt => String(opt || '').trim()),
    correctOption: newCorrectIndex !== -1 ? newCorrectIndex : Math.floor(Math.random() * 4)
  };
};

// Deduplication filter to prevent repeated questions
const deduplicateMCQs = (mcqs) => {
  const seenStems = new Set();
  const uniqueList = [];

  for (const item of mcqs) {
    if (!item) continue;
    const shuffled = shuffleOptionsAndDistribute(item);
    if (!shuffled || !shuffled.question || !Array.isArray(shuffled.options) || shuffled.options.length !== 4) continue;
    
    const normalizedStem = shuffled.question.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 45);
    if (!seenStems.has(normalizedStem)) {
      seenStems.add(normalizedStem);
      uniqueList.push(shuffled);
    }
  }

  return uniqueList;
};

// Comprehensive Fallback Question Bank covering diverse topics
const generateDiverseFallbackMCQs = (prompt, numQuestions) => {
  const topic = prompt.trim();
  const bank = [
    {
      question: `What is the primary architectural purpose of ${topic} in modern software engineering?`,
      options: [
        `To decouple components, optimize scalability, and maintain predictable system behavior`,
        `To enforce linear sequential processing without asynchronous capabilities`,
        `To bypass data validation rules for faster input execution`,
        `To convert runtime errors into unhandled silent warnings`
      ],
      correctOption: 0
    },
    {
      question: `When analyzing computational complexity related to ${topic}, which characteristic is typical?`,
      options: [
        `Optimal implementations target logarithmic O(log N) or linearithmic O(N log N) bounds`,
        `All operations unconditionally require exponential O(2^N) runtime`,
        `Memory allocation is strictly constant regardless of input scale`,
        `Processing speed decreases linearly with CPU clock cycles`
      ],
      correctOption: 0
    },
    {
      question: `Which design pattern or methodology is most effective when implementing ${topic}?`,
      options: [
        `Modular encapsulation with clear interface separation and dependency injection`,
        `Direct global state mutation across independent threads`,
        `Unchecked recursive loops with dynamic termination criteria`,
        `Tight coupling of presentation logic with data persistence layers`
      ],
      correctOption: 0
    },
    {
      question: `What is the standard behavior when handling edge cases or boundary conditions in ${topic}?`,
      options: [
        `Gracefully capturing exceptions and returning sanitized fallback responses`,
        `Terminating the parent thread without freeing allocated resources`,
        `Ignoring invalid inputs and writing corrupted payloads to disk`,
        `Reinitializing the entire database connection pool unconditionally`
      ],
      correctOption: 0
    },
    {
      question: `In technical placement assessments, what is a key pitfall candidates make regarding ${topic}?`,
      options: [
        `Overlooking space complexity trade-offs and memory leak risks in long-running processes`,
        `Writing modular helper functions instead of monolithic scripts`,
        `Using standardized data structures from the language standard library`,
        `Adding comprehensive input validation and type checking`
      ],
      correctOption: 0
    },
    {
      question: `How does concurrency or multi-threading impact ${topic}?`,
      options: [
        `Requires synchronization primitives or atomic operations to avoid race conditions`,
        `Automatically prevents deadlocks without locks or mutexes`,
        `Disables all asynchronous I/O operations entirely`,
        `Forces memory pages to be duplicated across all core caches`
      ],
      correctOption: 0
    },
    {
      question: `Which of the following metrics is most crucial when benchmarking ${topic}?`,
      options: [
        `Throughput (QPS/TPS), latency percentiles (p95/p99), and resource utilization`,
        `Source code line count and file size on disk`,
        `Number of comments written per function definition`,
        `Alphabetical ordering of exported variable identifiers`
      ],
      correctOption: 0
    },
    {
      question: `What role does caching or memoization play in optimizing ${topic}?`,
      options: [
        `Reduces redundant calculations and roundtrip database queries for expensive operations`,
        `Increases network packet size to accelerate data transmission`,
        `Eliminates the requirement for persistent database storage`,
        `Bypasses operating system security permissions dynamically`
      ],
      correctOption: 0
    },
    {
      question: `When refactoring legacy implementations of ${topic}, what is the recommended practice?`,
      options: [
        `Writing regression unit tests before restructuring core algorithm logic`,
        `Deleting existing test suites to prevent build failures during migration`,
        `Merging separate modules into a single shared execution block`,
        `Hardcoding configuration constants directly into production binaries`
      ],
      correctOption: 0
    },
    {
      question: `What security consideration must be addressed when exposing APIs related to ${topic}?`,
      options: [
        `Sanitizing user inputs to mitigate injection attacks and enforcing rate limiting`,
        `Disabling CORS policies for all external cross-origin domains`,
        `Exposing detailed internal stack traces in public error responses`,
        `Using unencrypted HTTP protocols to reduce encryption overhead`
      ],
      correctOption: 0
    },
    {
      question: `How should database transactions interacting with ${topic} be handled?`,
      options: [
        `Adhering to ACID properties and using appropriate isolation levels`,
        `Committing partial updates without rollback mechanisms`,
        `Executing schema migrations directly within user request lifecycles`,
        `Disabling foreign key constraints to speed up batch inserts`
      ],
      correctOption: 0
    },
    {
      question: `What is the impact of excessive nesting and high cyclomatic complexity in ${topic}?`,
      options: [
        `Degrades code readability, increases bug probability, and complicates unit testing`,
        `Improves JIT compiler optimization across all architectures`,
        `Reduces the physical RAM required during application execution`,
        `Guarantees deterministic execution across distributed nodes`
      ],
      correctOption: 0
    },
    {
      question: `In terms of fault tolerance, what mechanism best ensures high availability for ${topic}?`,
      options: [
        `Automated health checks, circuit breakers, and graceful degradation strategies`,
        `Restarting the entire operating system on every caught exception`,
        `Storing all critical state in ephemeral single-node local memory`,
        `Ignoring network timeout thresholds during peak traffic hours`
      ],
      correctOption: 0
    },
    {
      question: `Which data structure is typically most suitable for efficient lookups in ${topic}?`,
      options: [
        `Hash Map / Hash Table providing average O(1) time complexity`,
        `Singly Linked List requiring O(N) linear search for all operations`,
        `Unsorted Array requiring full scan for every query`,
        `Fixed-size queue with FIFO eviction policies`
      ],
      correctOption: 0
    },
    {
      question: `What is the primary trade-off when optimizing ${topic} for space over time?`,
      options: [
        `Memory consumption is minimized at the cost of additional compute iterations`,
        `CPU cycles are decreased while RAM footprint expands indefinitely`,
        `Network bandwidth is multiplied by redundant packet retransmissions`,
        `Database indices are duplicated across all read replicas`
      ],
      correctOption: 0
    },
    {
      question: `How do modern frameworks manage lifecycle events related to ${topic}?`,
      options: [
        `Through declarative hooks, event loops, and cleanup callbacks`,
        `By creating unbounded background worker threads for every function call`,
        `By forcing developers to manually deallocate heap memory`,
        `By halting application execution until all pending promises reject`
      ],
      correctOption: 0
    },
    {
      question: `What does idempotency mean in the context of operations for ${topic}?`,
      options: [
        `Executing the operation multiple times produces the same result as a single execution`,
        `The operation can only be triggered once in the entire application lifetime`,
        `The function executes in zero milliseconds without side effects`,
        `The operation requires multiple concurrent threads to complete successfully`
      ],
      correctOption: 0
    },
    {
      question: `Which approach is best for debugging subtle state synchronization issues in ${topic}?`,
      options: [
        `Structured logging, distributed tracing, and reproducible test cases`,
        `Adding arbitrary sleep delays throughout the codebase`,
        `Increasing database connection limits without investigating queries`,
        `Suppressing console error output in staging environments`
      ],
      correctOption: 0
    },
    {
      question: `When designing scalable microservices around ${topic}, how should data communication occur?`,
      options: [
        `Using asynchronous message queues or standardized REST/gRPC interfaces with versioning`,
        `Sharing a single monolithic SQL table directly between all services`,
        `Relying on hardcoded local IP addresses without service discovery`,
        `Transmitting uncompressed raw memory dumps across network sockets`
      ],
      correctOption: 0
    },
    {
      question: `What distinguishes a clean production-grade implementation of ${topic} from a prototype?`,
      options: [
        `Robust error boundaries, automated CI/CD tests, monitoring, and thorough documentation`,
        `Minimizing the number of files by putting all code in a single file`,
        `Avoiding dependency managers and hand-copying library files`,
        `Skipping input validation to maximize raw execution throughput`
      ],
      correctOption: 0
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
      question: `[Advanced Analysis] ${base.question}`,
      options: base.options,
      correctOption: base.correctOption
    }));
    idx++;
  }

  return selected.filter(Boolean);
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

// 1. Google Gemini API caller (Gemini 2.5 Flash with strict JSON Schema output)
const callGeminiMCQ = async ({ apiKey, prompt, count, focusDomain }) => {
  const startTime = Date.now();
  console.log(`🤖 [Gemini AI] Requesting ${count} MCQs (Focus: ${focusDomain}) on "${prompt}"...`);

  const systemPrompt = `You are a Principal Technical Interviewer creating authentic placement questions.
Generate exactly ${count} UNIQUE, non-repeating multiple choice questions for topic: "${prompt}".
Focus domain: ${focusDomain}.
RULES:
1. NO DUPLICATES. Each question must test a distinct concept, syntax, or edge case.
2. PLAUSIBLE OPTIONS: All 4 options (A, B, C, D) must be realistic technical terms.
3. BALANCED ANSWER KEYS: Randomly distribute correct answers across indices 0, 1, 2, 3.
4. Output valid JSON array matching the schema:
[
  {
    "question": "Question statement?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctOption": 2
  }
]`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nTask: Generate exactly ${count} MCQs for ${prompt}` }] }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.5,
          maxOutputTokens: 8192
        }
      })
    });

    const elapsed = Date.now() - startTime;
    if (!response.ok) {
      const errText = await response.text();
      console.error(`❌ [Gemini Error HTTP ${response.status}] (${elapsed}ms):`, errText);
      return [];
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log(`✅ [Gemini AI] Received response (${elapsed}ms, ${rawText.length} chars)`);

    let parsed = [];
    const jsonStart = rawText.indexOf('[');
    const jsonEnd = rawText.lastIndexOf(']');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      parsed = JSON.parse(rawText.substring(jsonStart, jsonEnd + 1));
    } else {
      parsed = JSON.parse(rawText);
    }

    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error(`⚠️ [Gemini Exception] (${Date.now() - startTime}ms):`, err.message);
    return [];
  }
};

// 2. Hugging Face API caller
const callHuggingFaceMCQBatch = async ({ hfKey, modelName, modelUrl, prompt, count, focusDomain, batchId }) => {
  const startTime = Date.now();
  console.log(`📡 [HuggingFace Batch ${batchId}] Requesting ${count} questions (Focus: ${focusDomain}) on "${prompt}"...`);

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
      console.error(`❌ [HuggingFace Batch ${batchId}] Error HTTP ${response.status} (${elapsed}ms):`, errText);
      return [];
    }

    const hfData = await response.json();
    const generatedText = hfData.choices?.[0]?.message?.content || '';
    console.log(`✅ [HuggingFace Batch ${batchId}] Received response (${elapsed}ms, ${generatedText.length} chars)`);

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
    console.error(`⚠️ [HuggingFace Batch ${batchId}] Exception (${Date.now() - startTime}ms):`, err.message);
    return [];
  }
};

// 3. Groq API caller
const callGroqMCQ = async ({ apiKey, prompt, count, focusDomain }) => {
  const startTime = Date.now();
  console.log(`⚡ [Groq AI] Requesting ${count} MCQs (Focus: ${focusDomain}) on "${prompt}"...`);

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
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: `Generate ${count} diverse MCQs on ${prompt}.` }
        ],
        temperature: 0.6,
        max_tokens: 3000
      })
    });

    const elapsed = Date.now() - startTime;
    if (!response.ok) {
      const errText = await response.text();
      console.error(`❌ [Groq Error HTTP ${response.status}] (${elapsed}ms):`, errText);
      return [];
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || '';
    console.log(`✅ [Groq AI] Received response (${elapsed}ms, ${rawText.length} chars)`);

    let parsed = [];
    const jsonStart = rawText.indexOf('[');
    const jsonEnd = rawText.lastIndexOf(']');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      parsed = JSON.parse(rawText.substring(jsonStart, jsonEnd + 1));
    } else {
      parsed = JSON.parse(rawText);
    }

    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error(`⚠️ [Groq Exception] (${Date.now() - startTime}ms):`, err.message);
    return [];
  }
};

// @route   POST /api/ai/generate-mcq
// @desc    Fast & Accountable MCQ Generator (Priority: 1. Gemini -> 2. Hugging Face -> 3. Groq -> Fallback)
router.post('/generate-mcq', async (req, res) => {
  const reqStart = Date.now();
  try {
    const { prompt, numQuestions = 5, timeLimit = 10, apiKey } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt/Topic is required' });
    }

    const count = Math.min(Math.max(Number(numQuestions) || 5, 1), 30);
    const geminiKey = process.env.GEMINI_API_KEY;
    const hfKey = apiKey || process.env.HUGGINGFACE_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    console.log(`\n======================================================`);
    console.log(`🚀 [AI-MCQ Request] Topic: "${prompt}" | Requested: ${count} Qs | Time: ${timeLimit}m`);
    console.log(`======================================================`);

    let allGeneratedMCQs = [];
    let providerUsed = 'none';

    // 1. PRIORITY 1: Google Gemini 2.5 Flash
    if (geminiKey && allGeneratedMCQs.length < count) {
      try {
        if (count > 10) {
          const half = Math.ceil(count / 2);
          const [b1, b2] = await Promise.all([
            callGeminiMCQ({ apiKey: geminiKey, prompt, count: half, focusDomain: 'Core Concepts, Syntax & Complexity' }),
            callGeminiMCQ({ apiKey: geminiKey, prompt, count: count - half, focusDomain: 'Practical Code, Edge Cases & Architecture' })
          ]);
          allGeneratedMCQs = [...b1, ...b2];
        } else {
          allGeneratedMCQs = await callGeminiMCQ({ apiKey: geminiKey, prompt, count, focusDomain: 'Comprehensive Concepts & Code Analysis' });
        }
        if (allGeneratedMCQs.length > 0) providerUsed = 'google-gemini-2.5-flash';
      } catch (gemErr) {
        console.error('Gemini attempt failed, falling back to Hugging Face...');
      }
    }

    // 2. PRIORITY 2: Hugging Face LLaMA-3.1
    if (hfKey && allGeneratedMCQs.length < count) {
      const modelName = process.env.HUGGINGFACE_MODEL || 'meta-llama/Llama-3.1-8B-Instruct';
      const modelUrl = 'https://router.huggingface.co/v1/chat/completions';

      try {
        if (count > 10) {
          const half = Math.ceil(count / 2);
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
        if (allGeneratedMCQs.length > 0) providerUsed = 'huggingface-llama3.1';
      } catch (hfErr) {
        console.error('Hugging Face attempt failed, falling back to Groq...');
      }
    }

    // 3. PRIORITY 3: Groq AI
    if (groqKey && allGeneratedMCQs.length < count) {
      try {
        if (count > 10) {
          const half = Math.ceil(count / 2);
          const [b1, b2] = await Promise.all([
            callGroqMCQ({ apiKey: groqKey, prompt, count: half, focusDomain: 'Core Concepts, Syntax & Complexity' }),
            callGroqMCQ({ apiKey: groqKey, prompt, count: count - half, focusDomain: 'Practical Code, Edge Cases & Architecture' })
          ]);
          allGeneratedMCQs = [...b1, ...b2];
        } else {
          allGeneratedMCQs = await callGroqMCQ({ apiKey: groqKey, prompt, count, focusDomain: 'Comprehensive Concepts & Code Analysis' });
        }
        if (allGeneratedMCQs.length > 0) providerUsed = 'groq-ai';
      } catch (groqErr) {
        console.error('Groq attempt failed, falling back to curated question bank...');
      }
    }

    console.log(`🔀 [AI-MCQ] Deduplicating & applying Fisher-Yates option shuffler across ${allGeneratedMCQs.length} questions...`);
    let processedMCQs = deduplicateMCQs(allGeneratedMCQs);

    // If all providers failed or returned fewer questions, top up with diverse question bank
    if (processedMCQs.length < count) {
      console.log(`ℹ️ [AI-MCQ] Topping up ${count - processedMCQs.length} questions from curated question bank...`);
      const topUp = generateDiverseFallbackMCQs(prompt, count - processedMCQs.length);
      processedMCQs = [...processedMCQs, ...topUp];
      if (providerUsed === 'none') providerUsed = 'smart-placement-bank';
    }

    const finalMCQs = processedMCQs.slice(0, count);
    const totalElapsed = Date.now() - reqStart;

    console.log(`🎉 [AI-MCQ] Completed via [${providerUsed}] in ${totalElapsed}ms! Returning ${finalMCQs.length} questions.`);
    console.log(`======================================================\n`);

    res.json({
      title: `${prompt} — MCQ Assessment`,
      estimatedMinutes: timeLimit,
      mcqs: finalMCQs,
      source: providerUsed,
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
      source: 'smart-fallback'
    });
  }
});

// @route   POST /api/ai/generate-reading
// @desc    Generate structured study reading material with AI (Priority: 1. Gemini -> 2. Hugging Face -> 3. Groq -> Fallback)
router.post('/generate-reading', async (req, res) => {
  const reqStart = Date.now();
  try {
    const { prompt, estimatedMinutes = 20, apiKey } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Topic/Prompt is required' });
    }

    console.log(`📖 [AI-Reading Request] Topic: "${prompt}" | Reading Time: ${estimatedMinutes}m`);
    const geminiKey = process.env.GEMINI_API_KEY;
    const hfKey = apiKey || process.env.HUGGINGFACE_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    let generatedContent = '';
    let providerUsed = 'fallback';

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

    // 1. PRIORITY 1: Google Gemini 2.5 Flash
    if (geminiKey && !generatedContent) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${systemInstruction}\n\nTask: Explain ${prompt} in detail with practical examples and code.` }] }
            ],
            generationConfig: { temperature: 0.4, maxOutputTokens: 8192 }
          })
        });
        if (response.ok) {
          const data = await response.json();
          generatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (generatedContent) providerUsed = 'google-gemini-2.5-flash';
        }
      } catch (err) {
        console.error('Gemini reading generation failed, trying Hugging Face...');
      }
    }

    // 2. PRIORITY 2: Hugging Face LLaMA-3.1
    if (hfKey && !generatedContent) {
      try {
        const modelName = process.env.HUGGINGFACE_MODEL || 'meta-llama/Llama-3.1-8B-Instruct';
        const modelUrl = 'https://router.huggingface.co/v1/chat/completions';
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
        if (response.ok) {
          const data = await response.json();
          generatedContent = data.choices?.[0]?.message?.content || '';
          if (generatedContent) providerUsed = 'huggingface-llama3.1';
        }
      } catch (err) {
        console.error('Hugging Face reading generation failed, trying Groq...');
      }
    }

    // 3. PRIORITY 3: Groq AI
    if (groqKey && !generatedContent) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'openai/gpt-oss-120b',
            messages: [
              { role: 'system', content: systemInstruction },
              { role: 'user', content: `Explain ${prompt} in detail with practical examples, code blocks, and interview notes.` }
            ],
            temperature: 0.35,
            max_tokens: 3000
          })
        });
        if (response.ok) {
          const data = await response.json();
          generatedContent = data.choices?.[0]?.message?.content || '';
          if (generatedContent) providerUsed = 'groq-ai';
        }
      } catch (err) {
        console.error('Groq reading generation failed...');
      }
    }

    if (!generatedContent) {
      generatedContent = generateFallbackReading(prompt);
    }

    const totalElapsed = Date.now() - reqStart;
    console.log(`🎉 [AI-Reading] Generated study notes via [${providerUsed}] in ${totalElapsed}ms.`);

    res.json({
      title: `${prompt} Study Notes`,
      estimatedMinutes,
      readingContent: generatedContent,
      source: providerUsed,
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
