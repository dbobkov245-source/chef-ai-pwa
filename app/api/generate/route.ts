import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini on the server side
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Schema Definition
const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Название рецепта на русском языке" },
    description: { type: Type.STRING, description: "Краткое описание блюда на русском" },
    ingredients: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Список ингредиентов с количеством" 
    },
    instructions: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Пошаговая инструкция приготовления" 
    },
    cookingTime: { type: Type.STRING, description: "Время приготовления (например, '30 минут')" },
    difficulty: { type: Type.STRING, description: "Сложность (Легко, Средне, Сложно)" },
    calories: { type: Type.STRING, description: "Примерная калорийность на порцию" }
  },
  required: ["title", "description", "ingredients", "instructions", "cookingTime", "difficulty"],
};

const SYSTEM_INSTRUCTION = `
You are an expert chef assistant named "Шеф ИИ". 
Your goal is to provide culinary advice and recipes.
CRITICAL: ALL OUTPUT MUST BE IN THE RUSSIAN LANGUAGE.
Return the response strictly as a JSON object matching the provided schema.
Do not wrap the JSON in markdown code blocks.
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, image, mimeType, cuisine1, cuisine2, creativity } = body;

    let model = "gemini-2.5-flash";
    let promptParts: any[] = [];

    if (mode === 'PHOTO_ANALYSIS') {
      if (!image) {
        return NextResponse.json({ error: "Image data is required" }, { status: 400 });
      }
      
      promptParts = [
        {
          inlineData: {
            mimeType: mimeType || "image/png",
            data: image, // Expecting base64 string without data: prefix
          },
        },
        {
          text: "Analyze this image. If it contains food ingredients or a dish, identify them and generate a delicious, complete recipe that uses these ingredients. If it's a finished dish, tell me how to cook it. Ensure the recipe is detailed and in Russian."
        },
      ];
    } else if (mode === 'FUSION_LAB') {
      const prompt = `
        Create a unique fusion recipe combining ${cuisine1} and ${cuisine2} cuisines.
        Creativity level: ${creativity}/10. 
        (Low creativity = traditional mix, High creativity = experimental/avant-garde).
        The result must be edible and delicious.
        Respond strictly in Russian.
      `;
      promptParts = [{ text: prompt }];
    } else {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: promptParts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        temperature: mode === 'FUSION_LAB' ? 0.7 + (Number(creativity) / 20) : 0.4,
      },
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    const recipeData = JSON.parse(response.text);
    return NextResponse.json(recipeData);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}