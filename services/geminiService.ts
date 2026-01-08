
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getGeminiResponse = async (prompt: string, systemInstruction?: string) => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is configured.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are PamOut, the proprietary AI engine of ABADA Inc., a premier software outsourcing specialist company. Your role is to assist clients and developers in architecting, estimating, and building high-quality software solutions. Provide technical, precise, and professional insights tailored to software development outsourcing.",
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      },
    });

    return response.text || "No response received from AI.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const getGeminiStream = async (prompt: string, callback: (chunk: string) => void) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const result = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    for await (const chunk of result) {
      callback(chunk.text || "");
    }
  } catch (error) {
    console.error("Gemini Streaming Error:", error);
    throw error;
  }
};
