// frontend/app/api/ml/get-questions/route.js
export async function POST(req) {
  const body = await req.json();
  const res = await fetch(process.env.ML_API_URL + '/get_questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return Response.json(data);
}
