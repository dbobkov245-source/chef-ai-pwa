import { NextRequest, NextResponse } from 'next/server';

const IMAGEN_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict';

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
        const prompt = `Professional food photography of ${dishName}. ${description || ''} 
    Styled beautifully on a white plate, top-down view, soft natural lighting, 
    garnished elegantly, appetizing presentation, high-end restaurant quality, 
    4K food photography, delicious looking, macro lens, shallow depth of field`;

        const response = await fetch(`${IMAGEN_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                instances: [{ prompt }],
                parameters: {
                    sampleCount: 1,
                    aspectRatio: "1:1",
                    personGeneration: "dont_allow"
                }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Imagen API error:', errorData);

            // If Imagen fails, return a placeholder
            return NextResponse.json({
                success: false,
                placeholder: true,
                message: "Image generation unavailable, using placeholder"
            });
        }

        const data = await response.json();

        if (data.predictions && data.predictions[0]?.bytesBase64Encoded) {
            return NextResponse.json({
                success: true,
                image: `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`
            });
        }

        // Fallback for different response formats
        if (data.generatedImages && data.generatedImages[0]?.image?.imageBytes) {
            return NextResponse.json({
                success: true,
                image: `data:image/png;base64,${data.generatedImages[0].image.imageBytes}`
            });
        }

        return NextResponse.json({
            success: false,
            placeholder: true,
            message: "No image generated"
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
