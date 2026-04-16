// File: app/api/feedback/route.js
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { NextResponse } from 'next/server'

// Helper to call your Python ML model API
async function analyzeWithML({ question, user_answer, response_time }) {
  const resp = await fetch('http://localhost:8000/analyze_one', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, user_answer, response_time })
  });
  if (!resp.ok) throw new Error('ML model API error');
  return await resp.json();
}

export async function POST(req) {
  try {
    const { mockIdRef, question, user_answer, response_time } = await req.json();

    // Call ML model (Python API)
    const mlFeedback = await analyzeWithML({ question, user_answer, response_time });

    // Save feedback in NeonDB (Postgres)
    const saved = await db.insert(UserAnswer).values({
      mockIdRef,
      question,
      userAns: user_answer,
      correctAns: mlFeedback.correct_answer,
      rating: mlFeedback.rating,
      feedback: mlFeedback.feedback,
      scores: JSON.stringify(mlFeedback.scores),
      suggestions: JSON.stringify(mlFeedback.suggestions),
      createdAt: new Date().toISOString()
    }).returning();

    return NextResponse.json(saved[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// (Optional) GET handler to fetch all feedback for a mockIdRef
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mockIdRef = searchParams.get('mockIdRef');
  if (!mockIdRef) return NextResponse.json({ error: "mockIdRef required" }, { status: 400 });

  const answers = await db.select().from(UserAnswer).where(UserAnswer.mockIdRef.eq(mockIdRef));
  return NextResponse.json(answers);
}
