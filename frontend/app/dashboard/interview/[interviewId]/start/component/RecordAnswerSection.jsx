"use client";
import React, { useEffect, useState } from 'react';
import Webcam from "react-webcam";
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

function RecordAnswerSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
  onAnswer // <-- Add this prop
}) {
  const [userAnswer, setUserAnswer] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(() => {
    // Clear answer when question changes
    setUserAnswer('');
    setResults([]);
  }, [activeQuestionIndex, setResults]);

  useEffect(() => {
    // Collect speech-to-text results
    results.forEach((result) => {
      setUserAnswer(prevAns => prevAns + result?.transcript);
    });
  }, [results]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
      if (userAnswer?.length < 10) {
        setLoading(false);
        toast('⚠️ Error recording answer. Please try again.');
        return;
      }
    } else {
      setUserAnswer('');
      setResults([]);
      startSpeechToText();
      toast('🎙️ Listening...');
    }
  };

  // NEW: Call parent's onAnswer prop
  const handleUserAnswer = () => {
    if (!userAnswer || loading) return;
    setLoading(true);
    if (typeof onAnswer === "function") {
      onAnswer(userAnswer); // <-- Pass the answer up
    }
    setUserAnswer('');
    setResults([]);
    setLoading(false);
    toast('✅ Answer recorded!');
  };

  return (
    <div className='flex flex-col my-20 justify-center items-center'>
      <div className='justify-center items-center rounded-lg border p-5' style={{ width: '500px', height: '300px', backgroundColor: 'black' }}>
        <Webcam
          mirrored={true}
          style={{
            margin: '20px 50px',
            height: '260px',
            width: '400px',
            zIndex: '10px',
            position: 'relative'
          }}
        />
      </div>
      <div className="mt-6 flex gap-4">
        <button
          disabled={loading}
          onClick={StartStopRecording}
          className="border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer"
          style={{ color: 'blue', marginTop: '20px', padding: '5px 5px', width: '140px', height: '33px' }}
        >
          {isRecording ? (
            <span className="flex items-center" style={{ color: 'red' }}>
              <StopCircle /> Stop Recording
            </span>
          ) : (
            "🎙️ Record Answer"
          )}
        </button>
        <button
          disabled={loading || !userAnswer}
          onClick={handleUserAnswer}
          className="border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer"
          style={{ color: 'green', marginTop: '20px', marginLeft: '8px', padding: '5px 5px', width: '140px', height: '33px' }}
        >
          Submit Answer
        </button>
      </div>
      <div className="w-full flex flex-col items-center mt-4">
        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type or record your answer here"
          rows={3}
          className="w-4/5 border rounded p-2 mt-2"
          disabled={loading}
        />
        {/* {(interimResult || userAnswer) && (
          <div
            style={{
              marginTop: '5px',
              backgroundColor: 'white',
              color: 'black',
              padding: '0.5rem',
              borderRadius: '0.25rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              width: '80%',
              maxWidth: '600px',
              textAlign: 'center'
            }}
          >
            <strong>Your Answer :</strong>
            <p className="mt-2" style={{ marginTop: '5px' }}>
              {interimResult || userAnswer}
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
}

export default RecordAnswerSection;

