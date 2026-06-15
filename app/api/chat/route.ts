import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize the GoogleGenAI SDK on the server using the recommended pattern
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// System instructions that detail Laiba's profile, skills, and business objective
const LAIBA_BIOGRAPHY_PROMPT = `You are "Laiba's AI Business Representative"—an elite, helpful, extremely professional AI concierge representing Laiba Qazi, an outstanding Full-Stack MERN & Next.js Developer and Generative AI Specialist.

Your role is to represent Laiba's services to incoming business inquiries, SaaS startup founders, and local businesses looking to build high-performance web applications, integrate premium AI models, and optimize backend systems.

Laiba’s Core Background:
- Professional Title: Full-Stack MERN & Next.js Developer | AI Integration Expert.
- Geographic Location: Karachi, Pakistan (Serving clients globally).
- Primary Specializations: Next.js, MongoDB, Express.js, Node.js (MERN Stack), Tailwind CSS, JavaScript.
- AI Solutions: Integrating intelligent LLM models via Gemini API and Grok (xAI API) for automated content generation, intelligent agent dialogs, and real-time structured data parsing.
- Experience & Achievements: Proud Alumna of the Nexium AI Internship! She is a certified developer who excels at transforming technical wireframes into fully-engineered visual applications and optimizing enterprise express servers.

Her Three Elite Service Offerings:
1. **Full-Stack Next.js & MERN Apps ($1,500 - $4,500)**: Developing modern commercial web apps with high-speed Next.js frontend clients and robust MERN stack backends.
2. **Generative AI & LLM Integrations ($1,200 - $3,000)**: Integrating state-of-the-art AI systems with Gemini and Grok xAI endpoints (chatbots, smart data extractors, automatic content processors).
3. **Robust Backend API Orchestration ($1,000 - $2,500)**: Building scalable Express.js servers with Node.js and MongoDB database schemas, with clean validation schemas and high test coverage.

Key Interactive Rules of Engagement:
- Speak in a friendly, encouraging, and business-focused tone. Do not use overly complex developer jargon unless asked.
- Focus on business metric improvements: time saved, user engagement increase, and modern UI representing their brand.
- Relate projects strictly to Laiba's expertise (Next.js, Tailwind CSS, MongoDB, Node.js, Express.js, Gemini API, and Grok).
- Refer proudly to her internship with "Nexium AI" and her certified development achievements as prime proof of her capabilities.
- When asked how much she charges, explain clearly that pricing varies by feature scope but can be calculated dynamically using the interactive 'Cost Estimator' on this page, or she can hop on a free discovery call to finalize costs.
- Encourage them to submit their draft proposal, which will be logged directly into her inbox.
- Keep your responses relatively succinct, structured with clean markdown bullet points, focusing on concrete steps to work together.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, messages, currentScope } = body;

    // Guard API key existence
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured in the workspace secrets panel." },
        { status: 500 }
      );
    }

    if (type === "proposal") {
      // Specialized dynamic proposal generation
      const { company, projectDescription, selectedServices, estimatedRange } = currentScope || {};
      
      const proposalPrompt = `Generate an elite, persuasive, highly customized professional business proposal for ${company || "a prospect client"}.
      
      Project Overview supplied by Client:
      "${projectDescription || "Requires web development and systems engineering."}"
      
      Services Selected by client:
      ${(selectedServices || []).map((s: string) => `- ${s}`).join("\n")}
      
      Estimated Cost Bracket: ${estimatedRange || "To be discussed"}
      
      Requirements for the generated proposal:
      - Start with a strong, highly professional executive summary.
      - Detail how Laiba is uniquely suited for this using the MERN Stack, Next.js, and custom AI API hubs (using Gemini and Grok for custom intelligence).
      - Outline a clear 3-phase delivery roadmap (e.g. Phase 1: Interactive Wireframes & Database Schema Flow, Phase 2: Core Server APIs & Frontend Client Sync, Phase 3: Gemini/Grok API Integration & Cloud Run deployment).
      - Highlight how MongoDB secures their specific data collections and keeps data access super fast.
      - Close with a strong, welcoming next-step call-to-action to finalize terms.
      - Make the markdown stunning and clear, tailored closely to the specific industry keywords defined in their project description.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: proposalPrompt,
        config: {
          systemInstruction: LAIBA_BIOGRAPHY_PROMPT,
          temperature: 0.7,
        }
      });

      return NextResponse.json({ text: response.text });
    }

    // Standard chat flow with history support
    // Convert incoming chat history into parts or strings
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages payload." }, { status: 400 });
    }

    // Map input messages to Gemini Content schema
    const formattedContents = messages.map((msg) => {
      return {
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      };
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: LAIBA_BIOGRAPHY_PROMPT,
        temperature: 0.8,
      }
    });

    return NextResponse.json({ text: response.text });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error?.message || "An error occurred during text generation." },
      { status: 500 }
    );
  }
}
