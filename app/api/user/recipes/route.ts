import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// MOCK DATABASE (In-memory store)
// In a real app, this would be MongoDB, Postgres, etc.
// Structure: { "user_email": [Recipe, Recipe, ...] }
const MOCK_DB: Record<string, any[]> = {};

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRecipes = MOCK_DB[session.user.email] || [];
  return NextResponse.json(userRecipes);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const recipe = await req.json();

  // Initialize user storage if not exists
  if (!MOCK_DB[session.user.email]) {
    MOCK_DB[session.user.email] = [];
  }

  // Check if already exists (simple check by title for demo)
  const exists = MOCK_DB[session.user.email].some((r) => r.title === recipe.title);

  if (!exists) {
    // Add ID and Timestamp if missing
    const newRecipe = {
      ...recipe,
      id: recipe.id || Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    MOCK_DB[session.user.email].unshift(newRecipe); // Add to top
    return NextResponse.json(newRecipe);
  }

  return NextResponse.json({ message: "Recipe already saved" }, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updatedRecipe = await req.json();
  const email = session.user.email;

  if (!MOCK_DB[email]) {
    return NextResponse.json({ error: "No recipes found" }, { status: 404 });
  }

  const index = MOCK_DB[email].findIndex(r => r.id === updatedRecipe.id);

  if (index !== -1) {
    // Merge updates
    MOCK_DB[email][index] = { ...MOCK_DB[email][index], ...updatedRecipe };
    return NextResponse.json(MOCK_DB[email][index]);
  }

  return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  if (MOCK_DB[session.user.email]) {
    MOCK_DB[session.user.email] = MOCK_DB[session.user.email].filter(r => r.id !== id);
  }

  return NextResponse.json({ success: true });
}