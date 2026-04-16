"use client";
import React, { useEffect, useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from 'lucide-react';
import { useParams } from "next/navigation";

function FeedbackPage() {
  const params = useParams();
  const interviewId = params.interviewId;
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!interviewId) return;
    async function fetchFeedback() {
      setLoading(true);
      try {
        const res = await fetch(`/api/feedback?mockIdRef=${interviewId}`);
        const data = await res.json();
        setFeedbackData(data);
      } catch (err) {
        setFeedbackData([]);
      }
      setLoading(false);
    }
    fetchFeedback();
  }, [interviewId]);

  // Calculate average rating if needed
  const avgRating =
    feedbackData.length > 0
      ? (
          feedbackData.reduce((sum, item) => sum + (item.rating || 0), 0) /
          feedbackData.length
        ).toFixed(1)
      : 0;

  return (
    <div className='border rounded-lg' style={{ borderColor: 'blueviolet', padding: '20px', margin: '40px' }}>
      <h1 style={{ color: avgRating >= 6 ? 'green' : 'red', marginLeft: '100px', marginBottom: '2px', marginTop: '0px' }}>
        {avgRating >= 6
          ? "Congratulations! 👏🎉"
          : avgRating <= 5
            ? "Keep Practicing! 💪"
            : "Good Effort!"}
      </h1>
      <h3 style={{ marginLeft: '100px', marginTop: '2px' }}>Here is your Interview Feedback</h3>
      <h4 style={{ color: 'blue', marginLeft: '100px', marginTop: '4px' }}>
        Your Overall Interview rating: <strong>{avgRating}/10</strong>
      </h4>
      <p style={{ marginLeft: '100px', fontSize: '15px', marginTop: '4px' }}>
        Find below interview questions with correct answers, your answers, and feedback for improvement.
      </p>
      {loading ? (
        <div style={{ marginLeft: '100px' }}>Loading...</div>
      ) : feedbackData.length > 0 ? (
        feedbackData.map((item, index) => (
          <Collapsible key={index}>
           <CollapsibleTrigger
              className="flex items-center justify-between bg-secondary rounded-lg text-left w-3/4"
              style={{ fontSize: '16px', padding: '10px', marginTop: '10px', marginLeft: '100px' }}
            >
              <span>{item.question}</span>
              <ChevronsUpDown />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className='flex flex-col gap-1 w-2/3' style={{ marginLeft: '100px', fontSize: '15px', marginTop: '5px' }}>
                <p className='p-5 border rounded-lg' style={{ borderColor: 'red', padding: '10px' }}>
                  <strong style={{ color: 'red' }}>Rating: </strong>{item.rating}
                </p>
                <p className='p-5 border rounded-lg' style={{ borderColor: 'blueviolet', fontSize: '15px', padding: '10px', marginTop: '0px' }}>
                  <strong style={{ color: 'purple', fontWeight: 'bold' }}>Your Answer: </strong>{item.user_answer}
                </p>
                <p className='p-5 border rounded-lg' style={{ borderColor: 'green', fontSize: '15px', padding: '10px', marginTop: '0px' }}>
                  <strong style={{ color: 'green', fontWeight: 'bold' }}>Correct Answer: </strong>{item.correct_answer}
                </p>
                <p className='p-5 border rounded-lg' style={{ borderColor: 'blue', fontSize: '15px', padding: '10px', marginTop: '0px' }}>
                  <strong style={{ color: 'blue', fontWeight: 'bold' }}>Feedback: </strong>{item.feedback}
                </p>
                {/* Show scores and suggestions if present */}
                {(item.communication_score || item.fluency_score || item.confidence_score || item.response_time_score || item.technical_depth_score) && (
                  <div className='p-5 border rounded-lg' style={{ borderColor: 'blue', fontSize: '15px', padding: '10px', marginTop: '0px' }}>
                    <strong style={{ color: 'green', fontWeight: 'bold' }}>Scores:</strong>
                    <ul>
                      {item.communication_score !== undefined && <li>Communication: {item.communication_score} / 10</li>}
                      {item.fluency_score !== undefined && <li>Fluency: {item.fluency_score} / 10</li>}
                      {item.confidence_score !== undefined && <li>Confidence: {item.confidence_score} / 10</li>}
                      {item.response_time_score !== undefined && <li>Response Time: {item.response_time_score} / 10</li>}
                      {item.technical_depth_score !== undefined && <li>Technical Depth: {item.technical_depth_score} / 10</li>}
                    </ul>
                  </div>
                )}
                {(item.communication_suggestion || item.fluency_suggestion || item.confidence_suggestion || item.response_time_suggestion || item.technical_depth_suggestion) && (
                  <div className='p-5 border rounded-lg' style={{ borderColor: 'blue', fontSize: '15px', padding: '10px', marginTop: '15px' }}>
                    <strong style={{ color: 'blue', fontWeight: 'bold' }}>Suggestions:</strong>
                    <ul>
                      {item.communication_suggestion && <li>Communication: {item.communication_suggestion}</li>}
                      {item.fluency_suggestion && <li>Fluency: {item.fluency_suggestion}</li>}
                      {item.confidence_suggestion && <li>Confidence: {item.confidence_suggestion}</li>}
                      {item.response_time_suggestion && <li>Response Time: {item.response_time_suggestion}</li>}
                      {item.technical_depth_suggestion && <li>Technical Depth: {item.technical_depth_suggestion}</li>}
                    </ul>
                  </div>
                )}
                <div className='p-5 border rounded-lg' style={{ borderColor: 'blue', fontSize: '15px', padding: '10px', marginTop: '15px' }}>
                  <strong style={{ color: 'blue', fontWeight: 'bold' }}>Response Time:</strong> {item.response_time ? `${item.response_time.toFixed(1)} seconds` : 'N/A'}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))
      ) : (
        <div className='p-5 border rounded-lg' style={{ borderColor: 'blue', fontSize: '15px', padding: '10px', marginTop: '15px' }}>
          <strong style={{ color: 'red', fontWeight: 'bold' }}>No feedback found.</strong>
        </div>
      )}
    </div>
  );
}

export default FeedbackPage;
