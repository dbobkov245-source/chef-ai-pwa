import { NextRequest, NextResponse } from 'next/server';

// Use Gemini 2.0 Flash experimental for image generation
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

export async function POST(req: NextRequest) {
    try {
        const { dishName, description } = await req.json();

        if (!dishName) {
            return NextResponse.json({ error: "Dish name is required" }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "API key not configured" }, { status: 500 });
        }

        // Create a detailed prompt for food photography
        const prompt = `Generate a beautiful, appetizing photograph of "${dishName}". 
    ${description ? `Description: ${description}.` : ''} 
    Style: Professional food photography, top-down view on a white ceramic plate, 
    soft natural lighting from the side, shallow depth of field, 
    garnished elegantly with fresh herbs, high-end restaurant presentation, 
    vibrant colors, steam rising if it's a hot dish, 4K quality.
    Make it look absolutely delicious and Instagram-worthy.`;

        // Try multiple models for image generation
        const models = [
            'gemini-2.0-flash-exp',
            'gemini-2.0-flash-preview-image-generation'
        ];

        for (const model of models) {
            try {
                console.log(`Trying image generation with model: ${model}`);

                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{ text: prompt }]
                            }],
                            generationConfig: {
                                responseModalities: ["TEXT", "IMAGE"]
                            }
                        }),
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error(`Model ${model} error:`, errorData);
                    continue; // Try next model
                }

                const data = await response.json();

                // Extract image from response
                if (data.candidates && data.candidates[0]?.content?.parts) {
                    for (const part of data.candidates[0].content.parts) {
                        if (part.inlineData?.data) {
                            const mimeType = part.inlineData.mimeType || 'image/png';
                            return NextResponse.json({
                                success: true,
                                image: `data:${mimeType};base64,${part.inlineData.data}`
                            });
                        }
                    }
                }
            } catch (modelError) {
                console.error(`Model ${model} failed:`, modelError);
                continue;
            }
        }

        // If all models fail, return placeholder message
        console.log('All image generation models failed, returning placeholder');
        return NextResponse.json({
            success: false,
            placeholder: true,
            message: "Генерация изображений временно недоступна"
        });

    } catch (error) {
        console.error("Image generation error:", error);
        return NextResponse.json({
            success: false,
            placeholder: true,
            error: "Failed to generate image"
        });
    }
}
