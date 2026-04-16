"use client"

import { db } from '@/utils/db'
import { MockInterview, FeedbackDetail } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation';
import QuestionsSection from "./component/QuestionsSection";
import Link from 'next/link'
import dynamic from "next/dynamic"; // <-- Add this

const RecordAnswerSection = dynamic(
  () => import('./component/RecordAnswerSection'),
  { ssr: false }
);

function StartInterview() {
    const params = useParams();
    const interviewId = params.interviewId;
    const router = useRouter();

    const [interviewData, setInterviewData] = useState({});
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    // NEW: Store user answers and response times
    const [userAnswers, setUserAnswers] = useState([]);
    const [responseTimes, setResponseTimes] = useState([]);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());

    useEffect(() => {
        GetInterviewDetails();
    }, []);

    const GetInterviewDetails = async () => {
        const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, interviewId))
        const jsonMockResp = JSON.parse(result[0].jsonMockResp)
        setMockInterviewQuestion(jsonMockResp);
        setInterviewData(result[0]);
    }

    // NEW: Handle answer submission from RecordAnswerSection
    const handleAnswer = (answerText) => {
        const timeTaken = (Date.now() - questionStartTime) / 1000;
        setUserAnswers(prev => {
            const updated = [...prev];
            updated[activeQuestionIndex] = answerText;
            return updated;
        });
        setResponseTimes(prev => {
            const updated = [...prev];
            updated[activeQuestionIndex] = timeTaken;
            return updated;
        });
        setQuestionStartTime(Date.now());
    };

 // NEW: End interview, send answers to ML, save feedback, redirect
const handleEndInterview = async () => {
    // Send to ML API
    const res = await fetch("/api/ml/analyze-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            mockIdRef: interviewId,
            questions: mockInterviewQuestion,
            user_answers: userAnswers,
            response_times: responseTimes
        })
    });
    const feedbackResponse = await res.json();
    const feedbackArray = feedbackResponse.feedback; // <-- Extract the array!

    // Save each feedback item as a separate row
    if (Array.isArray(feedbackArray)) {
        for (const item of feedbackArray) {
            await db.insert(FeedbackDetail).values({
                mockIdRef: interviewId,
                userEmail: interviewData.userEmail, // or item.userEmail if present
                question: item.question,
                user_answer: item.user_answer,
                correct_answer: item.correct_answer,
                feedback: item.feedback,
                rating: item.rating,
                communication_score: item.scores?.communication,
                fluency_score: item.scores?.fluency,
                confidence_score: item.scores?.confidence,
                response_time_score: item.scores?.response_time,
                technical_depth_score: item.scores?.technical_depth,
                communication_suggestion: item.suggestions?.communication,
                fluency_suggestion: item.suggestions?.fluency,
                confidence_suggestion: item.suggestions?.confidence,
                response_time_suggestion: item.suggestions?.response_time,
                technical_depth_suggestion: item.suggestions?.technical_depth,
                response_time: item.response_time,
                created_at: new Date(),
            });
        }
    } else {
        // fallback for single feedback object (should rarely happen)
        await db.insert(FeedbackDetail).values({
            mockIdRef: feedbackResponse.mockIdRef,
            userEmail: interviewData.userEmail,
            question: feedbackResponse.question,
            user_answer: feedbackResponse.user_answer,
            correct_answer: feedbackResponse.correct_answer,
            feedback: feedbackResponse.feedback,
            rating: feedbackResponse.rating,
            communication_score: feedbackResponse.communication_score,
            fluency_score: feedbackResponse.fluency_score,
            confidence_score: feedbackResponse.confidence_score,
            response_time_score: feedbackResponse.response_time_score,
            technical_depth_score: feedbackResponse.technical_depth_score,
            communication_suggestion: feedbackResponse.communication_suggestion,
            fluency_suggestion: feedbackResponse.fluency_suggestion,
            confidence_suggestion: feedbackResponse.confidence_suggestion,
            response_time_suggestion: feedbackResponse.response_time_suggestion,
            technical_depth_suggestion: feedbackResponse.technical_depth_suggestion,
            response_time: feedbackResponse.response_time,
            created_at: new Date(),
        });
    }

    // Redirect to feedback page
    router.push(`/dashboard/interview/${interviewId}/feedback`);
};

    return (
        <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-2 gap-10" style={{ justifyItems: 'center', marginTop: '30px' }}>
            <div className=" rounded-lg border shadow" style={{ width: '600px', height: '480px', borderColor: 'blue', fontWeight: '20px' }}>
                {/* Questions */}
                <QuestionsSection
                    mockInterviewQuestion={mockInterviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                    setActiveQuestionIndex={setActiveQuestionIndex}
                />
            </div>
            <div>
                {/* Video / Audio Recording */}
                <RecordAnswerSection
                    mockInterviewQuestion={mockInterviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                    interviewData={interviewData}
                    // Pass the handler to collect answers
                    onAnswer={handleAnswer}
                />
                <div className='flex justify-end gap-6' style={{ marginTop: '10px' }} >
                    {activeQuestionIndex > 0 &&
                        <button
                            onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
                            className="rounded-sm border hover:scale-105 hover:shadow-md cursor-pointer"
                            style={{ color: 'white', backgroundColor: 'blue', margin: '10px', padding: '5px 5px', width: '152px', height: '33px' }}
                        >
                            Previous Question
                        </button>}
                    {activeQuestionIndex != mockInterviewQuestion?.length - 1 &&
                        <button
                            onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                            className="rounded-sm border hover:scale-105 hover:shadow-md cursor-pointer"
                            style={{ color: 'white', backgroundColor: 'blue', margin: '10px', padding: '5px 5px', width: '152px', height: '33px' }}
                        >
                            Next Question
                        </button>}
                    {activeQuestionIndex == mockInterviewQuestion?.length - 1 &&
                        <button
                            onClick={handleEndInterview}
                            className="rounded-sm border hover:scale-105 hover:shadow-md cursor-pointer"
                            style={{ color: 'white', backgroundColor: 'blue', margin: '10px', padding: '5px 5px', width: '152px', height: '33px' }}
                        >
                            End Interview
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}

export default StartInterview

