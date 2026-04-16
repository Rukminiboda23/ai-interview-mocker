import { NextResponse } from "next/server";
import { db } from "@/utils/db"; // Adjust the path to your Drizzle db instance
import { FeedbackDetail } from "@/utils/schema"; // Adjust path as needed
import { eq } from "drizzle-orm";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const mockIdRef = searchParams.get("mockIdRef");

    if (!mockIdRef) {
      return NextResponse.json({ error: "mockIdRef is required" }, { status: 400 });
    }

    // Query the feedback table for the given mockIdRef
    const result = await db
      .select()
      .from(FeedbackDetail)
      .where(eq(FeedbackDetail.mockIdRef, mockIdRef));

    // Optionally, parse the feedback JSON string
    const parsed = result.map(row => ({
      ...row,
      // feedback: row.feedback ? JSON.parse(row.feedback) : null,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("API /api/feedback error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
