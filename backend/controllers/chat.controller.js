import Solution from '../models/Solution.js';
import Project from '../models/Project.js';
import ChatbotLog from '../models/ChatbotLog.js';
import { config } from '../config/config.js';

export const handleChat = async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ message: 'Messages array is required.' });
  }

  try {
    // Fetch dynamic context from Database
    const solutions = await Solution.find({}, 'title description');
    const projects = await Project.find({}, 'title description clientName');

    const solutionsContext = solutions.map(s => `- ${s.title}: ${s.description}`).join('\n');
    const projectsContext = projects.map(p => `- ${p.title} for ${p.clientName}: ${p.description}`).join('\n');

    const systemPrompt = `You are the professional AI Assistant for 'AI-Solutions', a premium software consulting company.
Use the following database context to answer user queries:

Services/Solutions We Offer:
${solutionsContext || 'Predictive Analytics, Custom Software, Cybersecurity audits.'}

Recent Projects/Case Studies:
${projectsContext || 'Smart Logistics Engine, Decentralized Payment API.'}

Contact Office Info:
- Address: 100 Technology Way, Silicon Valley, CA
- Email: support@ai-solutions.com
- Phone: +1 (555) 019-2831
- Business Hours: Mon - Fri: 9:00 AM - 6:00 PM PST

Guidelines:
1. Provide accurate, professional, and friendly answers.
2. Keep your answers concise (strictly under 3 sentences).
3. If they ask about services or projects, recommend relevant ones and suggest visiting the "Services" or "Projects" pages.
4. If they want to speak to an engineer, get a quote, or schedule a consultation, recommend filling out the inquiry form on the "Contact Us" page.
5. If they ask generic questions, align your answers with AI-Solutions' expertise.`;

    const apiKey = config.GEMINI_API_KEY;

    if (!apiKey) {
      // Intelligent fallback when GEMINI_API_KEY is not defined
      const lastUserMsg = messages[messages.length - 1]?.text || '';
      const textLower = lastUserMsg.toLowerCase();
      let reply = '';

      if (textLower.includes('faq') || textLower.includes('hours') || textLower.includes('location') || textLower.includes('where')) {
        reply = 'AI-Solutions is open Monday - Friday, 9:00 AM - 6:00 PM PST. Our engineering headquarters is located at 100 Technology Way, Silicon Valley, CA.';
      } else if (textLower.includes('service') || textLower.includes('solution') || textLower.includes('software') || textLower.includes('build') || textLower.includes('offer')) {
        const solTitles = solutions.map(s => s.title).join(', ');
        reply = `We build tailored software architectures. Our services include: ${solTitles || 'Predictive Analytics, Custom Software, and Cybersecurity'}. Please check out our Services page for details!`;
      } else if (textLower.includes('contact') || textLower.includes('talk') || textLower.includes('phone') || textLower.includes('email') || textLower.includes('inquir')) {
        reply = 'To speak with a lead engineer or get a consultation quote, please visit our Contact Us page and fill out the inquiry form.';
      } else if (textLower.includes('project') || textLower.includes('case') || textLower.includes('work') || textLower.includes('done')) {
        const projTitles = projects.map(p => p.title).join(', ');
        reply = `We have completed projects such as: ${projTitles || 'Smart Logistics Engine, Decentralized Payment API'}. Check out our Projects page for the full list!`;
      } else {
        reply = "Hello! I am the AI-Solutions Assistant. (To enable full AI power, add GEMINI_API_KEY to the backend .env file). How can I help you explore our services, projects, or schedule a consultation today?";
      }

      // Log chatbot interaction
      try {
        const chatLog = new ChatbotLog({
          user_question: lastUserMsg || "Hello",
          bot_response: reply
        });
        await chatLog.save();
      } catch (logErr) {
        console.error('Failed to save chatbot log:', logErr);
      }

      return res.json({ reply });
    }

    // Convert messages to Gemini API format (only 'user' or 'model' roles allowed)
    const contents = messages
      .filter(msg => !msg.isOptions && msg.text) // filter options prompts
      .map(msg => ({
        role: msg.isBot ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

    // If contents array is empty, default it
    if (contents.length === 0) {
      contents.push({ role: 'user', parts: [{ text: 'Hello' }] });
    }

    // Call Gemini API using fetch
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API Error:', errText);
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble processing that right now. Please try again.";
    const replyText = reply.trim();

    // Log chatbot interaction
    try {
      const lastUserMsg = messages[messages.length - 1]?.text || 'Hello';
      const chatLog = new ChatbotLog({
        user_question: lastUserMsg,
        bot_response: replyText
      });
      await chatLog.save();
    } catch (logErr) {
      console.error('Failed to save chatbot log:', logErr);
    }

    res.json({ reply: replyText });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ message: 'Error communicating with AI Chatbot', error: err.message });
  }
};
