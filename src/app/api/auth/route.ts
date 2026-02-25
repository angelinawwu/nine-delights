import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "nine-delights-edit-token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const editPassword = process.env.EDIT_PASSWORD;

    if (!editPassword) {
      return NextResponse.json(
        { error: "Edit password not configured" },
        { status: 500 }
      );
    }

    if (password !== editPassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    const token = Buffer.from(`${Date.now()}:${editPassword}`).toString("base64");

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME);

  if (!token?.value) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const decoded = Buffer.from(token.value, "base64").toString();
    const storedPassword = decoded.split(":").slice(1).join(":");
    const isValid = storedPassword === process.env.EDIT_PASSWORD;
    return NextResponse.json({ authenticated: isValid });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  return response;
}
