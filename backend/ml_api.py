from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import Optional, Dict, List
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer, util
from nltk.tokenize import sent_tokenize, word_tokenize
from fastapi import HTTPException
from fastapi.responses import JSONResponse
# In ml_api.py, near the top with other imports
from transformers import pipeline

model = SentenceTransformer('all-MiniLM-L6-v2')
# Load sentiment analysis model - this will download it the first time
sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "AI Mock Interview ML API is running!"}

# Load your dataset once at startup
df = pd.read_excel("dataset.xlsx")


def map_experience(years):
    if years < 0:
        raise ValueError("Experience cannot be negative")
    elif 0 <= years <= 1:
        return "junior"
    elif 2 <= years <= 6:
        return "mid"
    else:  # years >= 7
        return "senior"

def generate_ideal_answer(question):
    # Try to fetch from dataset, else fallback
    row = df[df["Question"] == question]
    if not row.empty and "Answer" in row.columns:
        return row.iloc[0]["Answer"]
    return f"(Sample correct answer for: {question})"

def get_similarity_score(answer, correct_answer):
    if not answer or not correct_answer:
        print(f"Missing answer or correct_answer: answer={answer}, correct_answer={correct_answer}")
        # Option 1: Return a default similarity score (safe, but may hide missing data issues)
        return 0.0
        # Option 2: If you want to stop processing and inform the client, uncomment the next line:
        # raise HTTPException(status_code=400, detail="Missing answer or correct_answer in input.")
    emb1 = model.encode(answer, convert_to_tensor=True)
    emb2 = model.encode(correct_answer, convert_to_tensor=True)
    return util.cos_sim(emb1, emb2).item()

def analyze_response(answer, response_time):
    sentences = sent_tokenize(answer)
    words = word_tokenize(answer)
    avg_sentence_len = np.mean([len(word_tokenize(s)) for s in sentences]) if sentences else 0
    filler_words = ['um', 'uh', 'like', 'you know']
    filler_count = sum(answer.lower().count(w) for w in filler_words)
    return {
        "sentence_count": len(sentences),
        "word_count": len(words),
        "avg_sentence_length": avg_sentence_len,
        "filler_count": filler_count,
        "response_time": response_time
    }

# def analyze_response(user_answer: str, response_time: float) -> Dict:
#     # Basic fluency (words per second) - handling empty answer case
#     fluency = len(word_tokenize(user_answer)) / response_time if response_time > 0 and user_answer else 0

#     # Sentiment analysis: Use the loaded model
#     # The model gives a label (POSITIVE/NEGATIVE/NEUTRAL) and a score
#     sentiment_result = sentiment_analyzer(user_answer)[0] if user_answer else {'label': 'NEUTRAL', 'score': 0.5}

#     # Adjust sentiment score: If it's negative, we want a lower score for our rating
#     sentiment_score = sentiment_result['score']
#     if sentiment_result['label'] == 'NEGATIVE':
#         sentiment_score = 1 - sentiment_score # Invert score for negative sentiment

#     # Placeholder for confidence (ideally from speech-to-text system metadata)
#     confidence = 0.5

#     # Check for inappropriate words (simple keyword check, or use a dedicated toxicity model if integrated)
#     contains_inappropriate_words = False
#     if user_answer:
#         # You can add common inappropriate words here or use your specialized toxicity model
#         inappropriate_keywords = ["damn", "hell", "stupid", "idiot"] # ADD MORE AS NEEDED!
#         if any(keyword in user_answer.lower() for keyword in inappropriate_keywords):
#             contains_inappropriate_words = True
#         # If you integrated a toxicity model:
#         # toxicity_output = toxicity_analyzer(user_answer)[0]
#         # if toxicity_output['label'] == 'toxic' and toxicity_output['score'] > 0.7: # Adjust threshold
#         #     contains_inappropriate_words = True

#     return {
#         "fluency": fluency,
#         "sentiment": sentiment_score, # Now uses the actual sentiment from the model
#         "confidence": confidence,
#         "technical_depth": 0.5, # This would ideally come from more advanced NLP
#         "contains_inappropriate_words": contains_inappropriate_words # New flag
#     }

def generate_scores(similarity, analysis):
    fluency_score = max(10 - min(analysis["filler_count"], 5), 5)
    communication_score = 8 if analysis["avg_sentence_length"] < 20 else 6
    confidence_score = 8 if analysis["filler_count"] < 2 else 6
    tech_score = round(similarity * 10)
    response_time_score = 8 if 3 <= analysis["response_time"] <= 10 else 6
    return {
        "communication": communication_score,
        "response_time": response_time_score,
        "fluency": fluency_score,
        "confidence": confidence_score,
        "technical_depth": tech_score
    }

def generate_suggestions(scores):
    suggestions = {}
    if scores["communication"] <= 6:
        suggestions["communication"] = "Try to be more clear and concise in your explanations."
    elif scores["communication"] >= 7:
        suggestions["communication"] = "Great job! Your communication was clear and concise."
    if scores["response_time"] <= 6:
        suggestions["response_time"] = "Aim to answer more promptly and avoid long pauses."
    elif scores["response_time"] >= 7:
        suggestions["response_time"] = "Excellent response time! You answered promptly."
    if scores["fluency"] <= 6:
        suggestions["fluency"] = "Work on speaking more smoothly and avoiding filler words."
    elif scores["fluency"] >= 7:
        suggestions["fluency"] = "Your speech was fluent and easy to follow."
    if scores["confidence"] <= 6:
        suggestions["confidence"] = "Try to sound more confident in your answers."
    elif scores["confidence"] >= 7:
        suggestions["confidence"] = "You sounded confident and assured in your responses."
    if scores["technical_depth"] <= 6:
        suggestions["technical_depth"] = "Include more technical details and examples in your answers."
    elif scores["technical_depth"] >= 7:
        suggestions["technical_depth"] = "Great technical depth! You provided strong, detailed answers."
    return suggestions

def summarize_feedback(suggestions: Dict[str, str]) -> str:
    return " ".join(suggestions.values())

# ------------------- NEW: Get 5 questions based on user input -------------------

@app.post("/get_questions")
async def get_questions(req: Request):
    data = await req.json()
    jobrole = data.get("jobrole")
    try:
        years = int(data.get("years", 0))
    except (TypeError, ValueError):
        return JSONResponse({"questions": [], "error": "Invalid experience value"}, status_code=400)

    if years < 0:
        return JSONResponse({"questions": [], "error": "Experience cannot be negative"}, status_code=400)

    exp_level = map_experience(years)
    filtered = df[
        (df["Domain"].str.lower() == jobrole.lower()) &
        (df["Experience"].str.lower() == exp_level)
    ]
    # Remove duplicates, then sample
    unique_questions = filtered.drop_duplicates(subset="Question")
    questions = unique_questions.sample(min(5, len(unique_questions))).to_dict(orient="records")
    return {"questions": [
        {"question": q["Question"], "id": q.get("id", idx)} for idx, q in enumerate(questions)
    ]}


# ------------------- NEW: Analyze multiple answers and return rubric feedback -------------------
class AnalyzeAnswersRequest(BaseModel):
    mockIdRef: str
    questions: List[Dict]
    user_answers: List[str]
    response_times: List[float]

@app.post("/analyze_answers")
async def analyze_answers(req: Request):
    data = await req.json()
    questions = data["questions"]
    user_answers = data["user_answers"]
    response_times = data["response_times"]
    mockIdRef = data["mockIdRef"]

    feedback = []
    for i, q in enumerate(questions):
        question_text = q["question"]
        user_answer = user_answers[i]
        response_time = response_times[i]
        correct_answer = generate_ideal_answer(question_text)

        # Rule-based checks for bad answers
        bad_phrases = [
            "i don't know", "i am stupid", "i am a mad person", "no idea", "not sure", "i should get penalty"
        ]
        if not user_answer or user_answer.strip() == "":
            # Handle skipped question
            feedback.append({
                "question": question_text,
                "user_answer": "You did not answer this question.",
                "correct_answer": correct_answer,
                "feedback": "Please try to answer all questions for better assessment.",
                "rating": 0,
                "scores": None,
                "suggestions": None,
                "response_time": response_time
            })
        elif len(user_answer.strip()) < 10 or any(phrase in user_answer.lower() for phrase in bad_phrases):
            # Handle nonsense, negative, or too-short answers
            feedback.append({
                "question": question_text,
                "user_answer": user_answer,
                "correct_answer": correct_answer,
                "feedback": "Your answer was incomplete or inappropriate for a professional interview. Please provide a relevant and detailed response.",
                "rating": 1,
                "scores": {
                    "Communication": 2,
                    "Fluency": 2,
                    "Confidence": 2,
                    "Response Time": 6 if response_time > 0 else 0,
                    "Technical Depth": 1
                },
                "suggestions": {
                    "Communication": "Provide a clear, relevant answer.",
                    "Fluency": "Try to answer in complete sentences.",
                    "Confidence": "Maintain a professional tone.",
                    "Response Time": "Aim to answer promptly.",
                    "Technical Depth": "Include technical details and examples."
                },
                "response_time": response_time
            })
        else:
            # Handle answered question
            try:
                similarity = get_similarity_score(user_answer, correct_answer)
                analysis = analyze_response(user_answer, response_time)
                scores = generate_scores(similarity, analysis)
                suggestions = generate_suggestions(scores)
                feedback_text = summarize_feedback(suggestions)
                rating = round(np.mean(list(scores.values())), 2)
                
                feedback.append({
                    "question": question_text,
                    "user_answer": user_answer,
                    "correct_answer": correct_answer,
                    "rating": rating,
                    "feedback": feedback_text,
                    "scores": scores,
                    "suggestions": suggestions,
                    "response_time": response_time
                })
            except Exception as e:
                print(f"Error processing question {i}: {str(e)}")
                feedback.append({
                    "question": question_text,
                    "user_answer": user_answer,
                    "correct_answer": correct_answer,
                    "feedback": "Error analyzing this answer",
                    "rating": 0,
                    "scores": None,
                    "suggestions": None,
                    "response_time": response_time
                })

    # Calculate total rating excluding skipped questions
    valid_ratings = [f["rating"] for f in feedback if f.get("rating") is not None]
    total_rating = round(np.mean(valid_ratings), 2) if valid_ratings else 0.0

    # Here you would save to your database
    # Example with Drizzle:
    # await save_feedback_to_db(mockIdRef, feedback, total_rating)

    return {
        "mockIdRef": mockIdRef,
        "total_rating": total_rating,
        "feedback": feedback
    }

# ------------------- (Your existing single-question analysis endpoint) -------------------
class AnalyzeRequest(BaseModel):
    question: str
    user_answer: str
    response_time: Optional[float] = 5.0

@app.post("/analyze_one")
def analyze_one(req: AnalyzeRequest):
    question = req.question
    user_answer = req.user_answer
    response_time = req.response_time or 5.0

    correct_answer = generate_ideal_answer(question)
    similarity = get_similarity_score(user_answer, correct_answer)
    analysis = analyze_response(user_answer, response_time)
    scores = generate_scores(similarity, analysis)
    suggestions = generate_suggestions(scores)
    feedback = summarize_feedback(suggestions)
    rating = round(np.mean(list(scores.values())), 2)

    return {
        "question": question,
        "user_answer": user_answer,
        "correct_answer": correct_answer,
        "rating": rating,
        "feedback": feedback,
        "scores": scores,
        "suggestions": suggestions
    }
