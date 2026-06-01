import OpenAI from 'openai';
import { SYSTEM_INSTRUCTION } from '../config/systemInstructions.js';
import dotenv from 'dotenv';

dotenv.config();

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export const generateComponentController = async (req, res) => {
  const { userPrompt, currentCode } = req.body;
  const timestamp = () => new Date().toLocaleTimeString();

  // 1. INPUT VALIDATION & REAL-TIME LOGGING GATE
  if (!userPrompt) {
    console.error(`[${timestamp()}] ❌ ERROR: Request rejected. Reason: Empty userPrompt.`);
    return res.status(400).json({ error: 'A user prompt is required.' });
  }

  console.log(`[${timestamp()}] 📝 User Prompt received: "${userPrompt}"`);

  // 2. FAST BYPASS GATE: Catch casual greetings before making a cloud network request
  const cleanPrompt = userPrompt.trim().toLowerCase();
  const greetings = ['hi', 'hii', 'hello', 'hey', 'yo', 'whats up', 'what\'s up'];

  if (greetings.includes(cleanPrompt)) {
    console.log(`[${timestamp()}] ⚡ BYPASS: Casual greeting detected. Returning fallback JSON instantly.`);
    return res.json({
      layoutSummary: "Hello! I am initialized, open-source, and ready. Please provide a description of the layout or component you want to design.",
      componentTarget: "N/A",
      code: ""
    });
  }

  // 3. SCOPE OPTIMIZATION INTERCEPTOR GATE
  let optimizedPrompt = userPrompt;
  const broadRequests = ['make a website', 'build a website', 'create a website', 'website for a', 'website for'];

  if (broadRequests.some(phrase => cleanPrompt.includes(phrase))) {
    console.log(`[${timestamp()}] 🔍 INTERCEPT: Broad request detected. Optimizing prompt layout parameters...`);
    optimizedPrompt = `${userPrompt} - Focus on building a comprehensive, high-conversion homepage layout component including a gorgeous navbar, interactive hero section, feature highlights, and a modern aesthetic. Combine these sections into a single production-ready component asset. Avoid hardcoding rigid 'h-screen' properties; lean heavily on relative padding utilities (e.g., py-20, py-32) for fluid iframe nesting.`;
  }

  // 4. ENVIRONMENT INTEGRITY CHECK
  if (!process.env.GROQ_API_KEY) {
    console.error(`[${timestamp()}] ❌ CRITICAL: Groq API Key missing from configuration environment!`);
    return res.status(500).json({ error: 'Backend Configuration Error: Missing API Key.' });
  }

  try {
    console.log(`[${timestamp()}] 🚀 Forwarding request token stream to Groq (Llama 3.3 70B Core)...`);

    // 5. CALL CLOUD OPEN-SOURCE INFERENCE SERVICE
    const chatCompletion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      response_format: { type: "json_object" }, // Enforces strict JSON compliance matching system template
      messages: [
        {
          role: 'system',
          content: `${SYSTEM_INSTRUCTION}
    
    CRITICAL LAYER - INTENT PARSING & TYPO CORRECTION:
    1. You are running in JSON Mode. Your entire output MUST be a single, valid JSON object matching the requested schema.
    2. Humans make typos. If the user input contains misspelled words (e.g., 'restatent', 'restrunt', 'ketchin', 'prtfilo'), you must use semantic processing to deduce their true intent (e.g., 'restaurant', 'kitchen', 'portfolio') and generate the correct component. Do NOT return an empty code block or fail because of spelling.
    3. If the user prompt is broad (e.g., 'make a website' or 'write code for a restaurant'), automatically assume they need a comprehensive, high-conversion landing page or homepage component layout.
    
    You must return exactly this JSON schema:
    {
      "layoutSummary": "Brief description of the layout, calling out any typos you automatically corrected for the user",
      "componentTarget": "PascalCaseComponentName",
      "code": "Pure React functional component with Tailwind CSS utilities"
    }`
        },
        {
          role: 'user',
          content: `
            Context of existing webpage canvas code: 
            ${currentCode || 'No existing code. Building a completely fresh component from scratch.'}

            User Request: 
            ${optimizedPrompt}
          `
        }
      ],
    });

    const rawText = chatCompletion.choices[0].message.content;

    if (!rawText) {
      throw new Error('Cloud inference engine returned an empty data stream.');
    }

    let agentData = JSON.parse(rawText.trim());

    // 6. VALIDATION GATE: Clean up rogue markdown code blocks if the model leaked them
    if (agentData.code && agentData.code.includes('```')) {
      agentData.code = agentData.code.replace(/```jsx|```javascript|```/g, '').trim();
    }

    // 7. VALIDATION GATE: Append missing react exports dynamically for compilation runtime safety
    if (agentData.code && !agentData.code.includes('export default') && agentData.componentTarget !== "N/A") {
      agentData.code += `\n\nexport default ${agentData.componentTarget};`;
    }

    // SUCCESS METRIC LOGGING
    console.log(`[${timestamp()}] ✅ SUCCESS: Component [${agentData.componentTarget || 'N/A'}] compiled flawlessly.`);
    console.log(`[${timestamp()}] 📝 AI Engine Diagnostics Summary: "${agentData.layoutSummary}"`);

    return res.json(agentData);
  } catch (error) {
    // REAL-TIME SYSTEM ERROR LOGGING PANEL
    console.error(`\n==================================================`);
    console.error(`[${timestamp()}] 🚨 ERROR IN AI INFERENCE ROUTING PIPELINE 🚨`);
    console.error(`Details: ${error.message}`);
    console.error(`Stack Trace context follows below:`);
    console.error(error);
    console.error(`==================================================\n`);

    return res.status(500).json({
      error: 'The hosted open-source AI platform encountered an operational error.',
      details: error.message
    });
  }
};  