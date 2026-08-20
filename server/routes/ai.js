const express = require('express');
const router = express.Router();

// Fallback smart question generator if Hugging Face key is missing or network fails
const generateFallbackMCQs = (prompt, numQuestions) => {
  const topic = prompt.trim();
  const templates = [
    {
      q: `Which of the following best describes the core concept of ${topic}?`,
      opts: [
        `It provides an efficient mechanism for processing data and managing state in ${topic}`,
        `It is a deprecated protocol no longer used in modern software development`,
        `It restricts execution to a single synchronous thread with no data persistence`,
        `It converts high-level code directly into hardware machine instructions`
      ],
      correct: 0
    },
    {
      q: `What is the primary advantage of utilizing ${topic} in technical assessments?`,
      opts: [
        `Ensures linear time complexity for all recursive function calls`,
        `Optimizes system performance, scalability, and code maintainability`,
        `Completely eliminates memory consumption during execution`,
        `Bypasses all security and authentication checks automatically`
      ],
      correct: 1
    },
    {
      q: `In the context of ${topic}, what occurs when an invalid input or edge case is passed?`,
      opts: [
        `The system ignores the error and continues without logging`,
        `An exception or error handling branch is triggered to ensure safety`,
        `The database schema is automatically dropped and recreated`,
        `The operating system terminates all running background processes`
      ],
      correct: 1
    },
    {
      q: `Which component or keyword is standard when implementing ${topic}?`,
      opts: [
        `Standard library methods and structured modular patterns`,
        `Unconditional GOTO statements across all modules`,
        `Hardcoded global variables with no access control`,
        `Direct raw memory manipulation without validation`
      ],
      correct: 0
    },
    {
      q: `What is the typical time complexity expectation when solving problems related to ${topic}?`,
      opts: [
        `O(1) Constant or O(N log N) Log-Linear time`,
        `O(N^4) Exponential time`,
        `O(N!) Factorial time`,
        `O(2^N) Combinatorial time`
      ],
      correct: 0
    }
  ];

  const questions = [];
  for (let i = 0; i < numQuestions; i++) {
    const t = templates[i % templates.length];
    questions.push({
      question: `${t.q}`,
      options: t.opts,
      correctOption: t.correct
    });
  }
  return questions;
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

// @route   POST /api/ai/generate-mcq
// @desc    Generate MCQ questions using Hugging Face Router API (meta-llama/Llama-3.1-8B-Instruct)
router.post('/generate-mcq', async (req, res) => {
  try {
    const { prompt, numQuestions = 5, timeLimit = 10, apiKey } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt/Topic is required' });
    }

    const hfKey = apiKey || process.env.HUGGINGFACE_API_KEY;

    if (!hfKey) {
      console.log('ℹ️ HUGGINGFACE_API_KEY not set. Using smart placement question generator...');
      const fallbackQuestions = generateFallbackMCQs(prompt, numQuestions);
      return res.json({
        title: `${prompt} — MCQ Assessment`,
        estimatedMinutes: timeLimit,
        mcqs: fallbackQuestions,
        source: 'smart-generator'
      });
    }

    const modelName = process.env.HUGGINGFACE_MODEL || 'meta-llama/Llama-3.1-8B-Instruct';
    const modelUrl = 'https://router.huggingface.co/v1/chat/completions';

    const systemInstruction = `You are a senior technical interviewer crafting a placement prep quiz.
Generate exactly ${numQuestions} multiple choice questions (MCQs) on topic: "${prompt}".
You MUST reply with ONLY a JSON array of objects, with no markdown backticks, no code blocks, and no extra prose.
JSON Schema:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctOption": 0
  }
]`;

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
          { role: 'user', content: `Generate ${numQuestions} MCQs for topic: ${prompt}` }
        ],
        temperature: 0.2,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Hugging Face API Error HTTP:', response.status, errText);
      const fallbackQuestions = generateFallbackMCQs(prompt, numQuestions);
      return res.json({
        title: `${prompt} — MCQ Assessment`,
        estimatedMinutes: timeLimit,
        mcqs: fallbackQuestions,
        source: 'smart-fallback'
      });
    }

    const hfData = await response.json();
    let generatedText = hfData.choices?.[0]?.message?.content || '';

    let mcqs = [];
    try {
      const jsonStart = generatedText.indexOf('[');
      const jsonEnd = generatedText.lastIndexOf(']');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonStr = generatedText.substring(jsonStart, jsonEnd + 1);
        mcqs = JSON.parse(jsonStr);
      } else {
        mcqs = JSON.parse(generatedText);
      }
    } catch (parseErr) {
      console.log('Failed to parse HF output as JSON, using smart fallback questions.');
      mcqs = generateFallbackMCQs(prompt, numQuestions);
    }

    const validMCQs = mcqs.slice(0, numQuestions).map((q, idx) => ({
      question: q.question || `Question ${idx + 1} on ${prompt}`,
      options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
      correctOption: typeof q.correctOption === 'number' && q.correctOption >= 0 && q.correctOption <= 3 ? q.correctOption : 0
    }));

    res.json({
      title: `${prompt} — MCQ Assessment`,
      estimatedMinutes: timeLimit,
      mcqs: validMCQs,
      source: 'huggingface-llama3.1'
    });

  } catch (err) {
    console.error('AI Generation Error:', err.message);
    const fallbackQuestions = generateFallbackMCQs(req.body.prompt || 'Technical', req.body.numQuestions || 5);
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
  try {
    const { prompt, estimatedMinutes = 20, apiKey } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Topic/Prompt is required' });
    }

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
          { role: 'user', content: `Explain ${prompt} in detail with practical examples and interview notes.` }
        ],
        temperature: 0.3,
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

    res.json({
      title: `${prompt} Study Notes`,
      estimatedMinutes,
      readingContent: generatedContent,
      source: 'huggingface-llama3.1'
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
