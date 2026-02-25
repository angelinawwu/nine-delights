import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getEntries, addEntry, updateEntry, deleteEntry, getAllEntries } from "@/lib/sheets";
import { DelightType } from "@/lib/types";

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const all = searchParams.get("all");

    if (all === "true") {
      const entries = await getAllEntries();
      return NextResponse.json(entries);
    }

    if (!start || !end) {
      return NextResponse.json(
        { error: "start and end date params required" },
        { status: 400 }
      );
    }

    const entries = await getEntries(start, end);
    return NextResponse.json(entries);
  } catch (error: unknown) {
    console.error("Error fetching delights:", error);
    return NextResponse.json(
      { error: "Failed to fetch delights", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { date, delight, description, wildcardName, imageUrl } = body;

    if (!date || !delight) {
      return NextResponse.json(
        { error: "date and delight are required" },
        { status: 400 }
      );
    }

    await addEntry({
      date,
      delight: delight as DelightType,
      description: description || "",
      wildcardName,
      imageUrl,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding delight:", error);
    return NextResponse.json(
      { error: "Failed to add delight" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { rowIndex, date, delight, description, wildcardName, imageUrl } = body;

    if (!rowIndex || !date || !delight) {
      return NextResponse.json(
        { error: "rowIndex, date, and delight are required" },
        { status: 400 }
      );
    }

    await updateEntry(rowIndex, {
      date,
      delight: delight as DelightType,
      description: description || "",
      wildcardName,
      imageUrl,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating delight:", error);
    return NextResponse.json(
      { error: "Failed to update delight" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { rowIndex } = body;

    if (!rowIndex) {
      return NextResponse.json(
        { error: "rowIndex is required" },
        { status: 400 }
      );
    }

    await deleteEntry(rowIndex);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting delight:", error);
    return NextResponse.json(
      { error: "Failed to delete delight" },
      { status: 500 }
    );
  }
}
