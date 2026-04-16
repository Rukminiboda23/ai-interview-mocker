export async function POST(req) {
  try {
    const body = await req.json();
    const res = await fetch(process.env.ML_API_URL + '/analyze_answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json({ error: "Failed to analyze answers." }, { status: 500 });
  }
}
