import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { dishName, description } = await req.json();

        if (!dishName) {
            return NextResponse.json({ error: "Dish name is required" }, { status: 400 });
        }

        // Extract food terms for better search
        const searchTerms = extractFoodTerms(dishName);

        // Use Unsplash Source API - returns actual image URL directly
        // Adding random parameter to avoid caching same image
        const randomSeed = Math.random().toString(36).substring(7);
        const unsplashUrl = `https://source.unsplash.com/800x800/?${encodeURIComponent(searchTerms)},food,delicious&sig=${randomSeed}`;

        return NextResponse.json({
            success: true,
            source: 'unsplash',
            imageUrl: unsplashUrl
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
    const foodKeywords: Record<string, string> = {
        'паста': 'pasta,italian',
        'пицца': 'pizza',
        'суп': 'soup,bowl',
        'салат': 'salad,fresh',
        'мясо': 'meat,steak',
        'курица': 'chicken,poultry',
        'рыба': 'fish,seafood',
        'торт': 'cake,dessert',
        'пирог': 'pie,pastry',
        'блины': 'pancakes,breakfast',
        'борщ': 'borscht,soup,red',
        'плов': 'pilaf,rice',
        'шашлык': 'kebab,grill,bbq',
        'суши': 'sushi,japanese',
        'роллы': 'sushi,rolls',
        'бургер': 'burger,hamburger',
        'стейк': 'steak,beef',
        'десерт': 'dessert,sweet',
        'завтрак': 'breakfast',
        'фрукт': 'fruit,fresh',
        'овощ': 'vegetables,fresh',
        'зажарка': 'sauteed,vegetables,cooking',
        'лук': 'onion,cooking',
        'морковь': 'carrot,vegetables',
        'картофель': 'potato',
        'картошка': 'potato,fries',
        'рис': 'rice,bowl',
        'гречка': 'buckwheat,grain',
        'каша': 'porridge,oatmeal',
        'омлет': 'omelette,eggs',
        'яйца': 'eggs,breakfast',
    };

    let terms: string[] = [];
    const lowerName = dishName.toLowerCase();

    for (const [ru, en] of Object.entries(foodKeywords)) {
        if (lowerName.includes(ru)) {
            terms.push(en);
        }
    }

    // If no specific terms found, use generic
    if (terms.length === 0) {
        terms = ['gourmet,cuisine,restaurant'];
    }

    return terms.slice(0, 2).join(',');
}
