import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // TODO: Connect to database when DATABASE_URL is configured
    // For now, mock login for development - accept any credentials
    const userId = `user_${Date.now()}`;
    const token = generateToken(userId, email);

    return NextResponse.json({
      user: {
        id: userId,
        email: email,
        name: email.split("@")[0],
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
