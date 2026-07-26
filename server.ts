import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // AI Assistant Endpoint using Gemini API
  app.post('/api/ai/generate', async (req, res) => {
    try {
      const { prompt, category } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY environment variable is not configured. Please add it in the Secrets panel.'
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      const categoryPrompts: Record<string, string> = {
        lesson_plan: 'Focus on clear learning objectives, step-by-step activities, materials required, and assessment strategies for primary school students.',
        homework: 'Create engaging, age-appropriate practice exercises, creative tasks, and clear instructions.',
        quiz: 'Generate 5-10 multiple choice questions, short answer questions, and answer key with clear explanations.',
        parent_notice: 'Draft a polite, professional, and clear notice for parents with date, time, action items, and school contact info.',
        activity: 'Provide interactive, collaborative classroom games and energizing hands-on group learning activities.',
        exam: 'Structure a comprehensive exam paper with section instructions, point values, and varied question types.'
      };

      const systemInstruction = `You are BrightStart AI Assistant, an elite educational copilot for primary school teachers and principals.
Your goal is to provide inspiring, accurate, well-structured, and ready-to-use classroom content.
Format your response using rich Markdown with headings, bullet points, bold highlights, and code/quote blocks where appropriate.
${category ? categoryPrompts[category] || '' : ''}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });

      const text = response.text || 'I apologize, but I could not generate a response at this moment. Please try rephrasing your prompt.';
      res.json({ text });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({
        error: error.message || 'Failed to communicate with Gemini AI API. Check your network or API key.'
      });
    }
  });

  // Vite middleware in dev, static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
