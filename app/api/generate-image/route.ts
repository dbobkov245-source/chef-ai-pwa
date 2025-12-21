import { NextRequest, NextResponse } from 'next/server';

// Unsplash API for food images (free, no auth required for source URLs)
const UNSPLASH_FOOD_SEARCH = 'https://source.unsplash.com/featured/800x800/?';

export async function POST(req: NextRequest) {
    try {
        const { dishName, description } = await req.json();

        if (!dishName) {
            return NextResponse.json({ error: "Dish name is required" }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_API_KEY;

        // Try Gemini first if API key exists and quota not exceeded
        if (apiKey) {
            try {
                const prompt = `Generate a beautiful, appetizing photograph of "${dishName}". 
        ${description ? `Description: ${description}.` : ''} 
        Style: Professional food photography, top-down view on a white ceramic plate, 
        soft natural lighting, shallow depth of field, high-end restaurant presentation.`;

                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                            generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
                        }),
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    if (data.candidates?.[0]?.content?.parts) {
                        for (const part of data.candidates[0].content.parts) {
                            if (part.inlineData?.data) {
                                const mimeType = part.inlineData.mimeType || 'image/png';
                                return NextResponse.json({
                                    success: true,
                                    source: 'gemini',
                                    image: `data:${mimeType};base64,${part.inlineData.data}`
                                });
                            }
                        }
                    }
                }
            } catch (geminiError) {
                console.log('Gemini image generation failed, falling back to Unsplash');
            }
        }

        // Fallback: Use Unsplash for beautiful food photos
        // Create search terms from dish name
        const searchTerms = extractFoodTerms(dishName);
        const unsplashUrl = `${UNSPLASH_FOOD_SEARCH}${encodeURIComponent(searchTerms)},food,dish,cuisine,delicious`;

        // Fetch the image from Unsplash
        try {
            const imageResponse = await fetch(unsplashUrl, { redirect: 'follow' });

            if (imageResponse.ok) {
                // Get the final redirected URL (actual image)
                const finalUrl = imageResponse.url;

                // Return the URL instead of base64 (more efficient)
                return NextResponse.json({
                    success: true,
                    source: 'unsplash',
                    imageUrl: finalUrl,
                    // Also provide a direct Unsplash source URL as backup
                    fallbackUrl: `https://source.unsplash.com/800x800/?${encodeURIComponent(searchTerms)},food`
                });
            }
        } catch (unsplashError) {
            console.error('Unsplash fetch failed:', unsplashError);
        }

        // Final fallback: Return a generic food image URL
        return NextResponse.json({
            success: true,
            source: 'fallback',
            imageUrl: `https://source.unsplash.com/800x800/?food,dish,restaurant`,
            message: 'Using generic food image'
        });

    } catch (error) {
        console.error("Image generation error:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to generate image"
        }, { status: 500 });
    }
}

// Extract food-related terms from dish name for better Unsplash search
function extractFoodTerms(dishName: string): string {
    // Common food keywords to look for
    const foodKeywords: Record<string, string> = {
        'паста': 'pasta',
        'пицца': 'pizza',
        'суп': 'soup',
        'салат': 'salad',
        'мясо': 'meat,steak',
        'курица': 'chicken',
        'рыба': 'fish,seafood',
        'торт': 'cake,dessert',
        'пирог': 'pie',
        'блины': 'pancakes',
        'борщ': 'borscht,soup',
        'плов': 'pilaf,rice',
        'шашлык': 'kebab,grill',
        'суши': 'sushi,japanese',
        'роллы': 'sushi,rolls',
        'бургер': 'burger',
        'стейк': 'steak',
        'десерт': 'dessert',
        'завтрак': 'breakfast',
        'фрукт': 'fruit',
        'овощ': 'vegetables',
    };

    let terms: string[] = [];
    const lowerName = dishName.toLowerCase();

    // Check for known food keywords
    for (const [ru, en] of Object.entries(foodKeywords)) {
        if (lowerName.includes(ru)) {
            terms.push(en);
        }
    }

    // If no specific terms found, use generic food terms
    if (terms.length === 0) {
        terms = ['gourmet', 'cuisine', 'plated'];
    }

    return terms.slice(0, 3).join(',');
}
