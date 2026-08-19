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

    // Extract JSON array from response
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

    // Validate structure
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

module.exports = router;
