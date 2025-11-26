import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// Initialize Gemini on the server side
const ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// Schema Definition
const recipeSchema: any = {
  type: SchemaType.OBJECT,
  properties: {
    title: { type: SchemaType.STRING, description: "Название рецепта на русском языке" },
    description: { type: SchemaType.STRING, description: "Краткое описание блюда на русском" },
    ingredients: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Список ингредиентов с количеством"
    },
    instructions: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Пошаговая инструкция приготовления"
    },
    cookingTime: { type: SchemaType.STRING, description: "Время приготовления (например, '30 минут')" },
    difficulty: { type: SchemaType.STRING, description: "Сложность (Легко, Средне, Сложно)" },
    calories: { type: SchemaType.STRING, description: "Примерная калорийность на порцию" }
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

    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        temperature: mode === 'FUSION_LAB' ? 0.7 + (Number(creativity) / 20) : 0.4,
      },
    });

    const response = await model.generateContent({
      contents: [{ role: "user", parts: promptParts }],
    });

    const responseText = response.response.text();
    if (!responseText) {
      throw new Error("Empty response from AI");
    }

    const recipeData = JSON.parse(responseText);
    return NextResponse.json(recipeData);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}