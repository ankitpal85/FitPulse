import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Map file extensions to MIME types
const getMimeType = (filePath: string): string => {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".bmp": "image/bmp",
  };
  return mimeTypes[ext] || "image/jpeg";
};

export const analyzeImage = async (filePath: string) => {
  try {
    const base64ImageFile = fs.readFileSync(filePath, {
      encoding: "base64",
    });

    const mimeType = getMimeType(filePath);

    const contents = [
      {
        inlineData: {
          mimeType,
          data: base64ImageFile,
        },
      },
      {
        text: "Analyze this food image. Extract the food name and estimated calories. Return a JSON object with 'name' (string) and 'calories' (number) fields only.",
      },
    ];

    const config = {
      responseMimeType: "application/json" as const,
      responseSchema: {
        type: "object" as const,
        properties: {
          name: { type: "string" as const },
          calories: { type: "number" as const },
        },
        required: ["name", "calories"],
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config,
    });

    const text = response.text;
    if (!text) {
      throw new Error("Gemini returned empty response");
    }

    const parsed = JSON.parse(text);

    // Validate the parsed response
    if (!parsed.name || typeof parsed.calories !== "number") {
      throw new Error("Invalid response format from Gemini");
    }

    return parsed;
  } catch (error) {
    console.error("Gemini analysis error:", error);
    throw error;
  } finally {
    // Clean up temp file
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch {
      // Ignore cleanup errors
    }
  }
};