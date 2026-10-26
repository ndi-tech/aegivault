import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

const SYSTEM_PROMPT = `You are a Senior Enterprise Document Auditor. Perform a comprehensive analysis.
Format exactly like this:
### 📄 Executive Summary
(1 paragraph)
### 🔑 Key Entities
(3-5 bullets)
### ⚠️ Risk Assessment
(1 paragraph)`;

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    const truncatedContent = content.slice(0, 6000);
    let result = null;

    // --- ATTEMPT 1: GROQ (PRIMARY) ---
    if (groq) {
      try {
        console.log("Attempting Groq (Primary)...");
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: truncatedContent }
          ],
          model: "openai/gpt-oss-20b", // <-- UPDATED: Llama 3.1 was decommissioned
          temperature: 0.3,
          max_tokens: 1000,
        });
        result = chatCompletion.choices[0]?.message?.content;
        console.log("✅ Groq Success!");
      } catch (groqError) {
        console.error("❌ Groq Failed. Reason:", groqError);
      }
    }

    // --- ATTEMPT 2: GEMINI (FALLBACK) ---
    if (!result) {
      try {
        console.log("Attempting Gemini (Fallback)...");
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: `${SYSTEM_PROMPT}\n\nDocument Text:\n${truncatedContent}`,
        });
        result = response.text;
        console.log("✅ Gemini Success!");
      } catch (geminiError) {
        console.error("❌ Gemini Fallback also failed:", geminiError);
      }
    }

    if (!result) {
      return NextResponse.json({ error: "All AI providers failed." }, { status: 500 });
    }

    return NextResponse.json({ result });

  } catch (error) {
    console.error("❌ Unexpected Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}