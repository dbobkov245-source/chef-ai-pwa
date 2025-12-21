import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { dishName } = await req.json();

        if (!dishName) {
            return NextResponse.json({ error: "Dish name is required" }, { status: 400 });
        }

        // Generate a consistent but unique seed based on dish name
        const seed = hashCode(dishName);

        // Use Lorem Picsum - reliable, fast, no redirects
        // Returns beautiful random images
        const imageUrl = `https://picsum.photos/seed/${seed}/800/600`;

        return NextResponse.json({
            success: true,
            imageUrl: imageUrl
        });

    } catch (error) {
        console.error("Image generation error:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to generate image"
        }, { status: 500 });
    }
}

// Simple hash function to generate consistent seed from dish name
function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}
