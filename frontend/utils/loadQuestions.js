// utils/loadQuestions.js
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

// Load all questions into memory (for small/medium datasets)
export function loadQuestionsFromCSV() {
  const file = fs.readFileSync(path.join(process.cwd(), 'data/interview_questions.csv'), 'utf8');
  const { data } = Papa.parse(file, { header: true });
  return data; // Array of question objects
}

// Get random N questions for a domain (role) and type (optional)
export function getRandomQuestions({ domain, type = null, n = 5 }) {
  const allQuestions = loadQuestionsFromCSV();
  let filtered = allQuestions.filter(q => q.Domain.trim().toLowerCase() === domain.trim().toLowerCase());
  if (type) {
    filtered = filtered.filter(q => q.Question_Type.trim().toLowerCase() === type.trim().toLowerCase());
  }
  // Shuffle
  filtered = filtered.sort(() => Math.random() - 0.5);
  return filtered.slice(0, n);
}
