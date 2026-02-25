import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { put } from "@vercel/blob";

function isAuthenticated(): boolean {
  const cookieStore = cookies();
  const token = cookieStore.get("nine-delights-edit-token");

  if (!token?.value) return false;

  try {
    const decoded = Buffer.from(token.value, "base64").toString();
    const storedPassword = decoded.split(":").slice(1).join(":");
    return storedPassword === process.env.EDIT_PASSWORD;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const blob = await put(`delights/${Date.now()}-${file.name}`, file, {
      access: "public",
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
