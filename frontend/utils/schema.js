import { pgTable, serial, varchar, text, integer, doublePrecision, timestamp } from 'drizzle-orm/pg-core';

export const MockInterview = pgTable('mock_interview', {
  id: serial('id').primaryKey(),
  jsonMockResp: text('jsonMockResp').notNull(),
  jobPosition: varchar('jobPosition', { length: 255 }).notNull(),
  jobDesc: text('jobDesc').notNull(),
  jobExperience: varchar('jobExperience', { length: 255 }).notNull(),
  createdBy: varchar('createdBy', { length: 255 }).notNull(),
  createdAt: varchar('createdAt', { length: 255 }).notNull(),
  mockId: varchar('mockId', { length: 255 }).notNull(),
});

export const UserAnswer = pgTable('userAnswer', {
  id: serial('id').primaryKey(),
  mockIdRef: varchar('mockId').notNull(),
  userEmail: varchar('userEmail'),
  question: varchar('question').notNull(),
  correctAns: text('correctAns'),
  userAns: text('userAns'),
  feedback: text('feedback'),
  rating: varchar('rating'),

  // Scores out of 10
  communicationScore: integer('communicationScore'),
  fluencyScore: integer('fluencyScore'),
  confidenceScore: integer('confidenceScore'),
  responseTimeScore: integer('responseTimeScore'),
  technicalDepthScore: integer('technicalDepthScore'),

  // Suggestions per score
  communicationSuggestion: text('communicationSuggestion'),
  fluencySuggestion: text('fluencySuggestion'),
  confidenceSuggestion: text('confidenceSuggestion'),
  responseTimeSuggestion: text('responseTimeSuggestion'),
  technicalDepthSuggestion: text('technicalDepthSuggestion'),

  createdAt: varchar('createdAt'),
});


export const FeedbackDetail = pgTable("feedback_detail", {
  id: serial("id").primaryKey(),
  mockIdRef: varchar("mockIdRef", { length: 64 }),
  userEmail: varchar("userEmail", { length: 255 }),
  question: text("question"),
  user_answer: text("user_answer"),
  correct_answer: text("correct_answer"),
  feedback: text("feedback"),
  rating: doublePrecision("rating"),
  communication_score: integer("communication_score"),
  fluency_score: integer("fluency_score"),
  confidence_score: integer("confidence_score"),
  response_time_score: integer("response_time_score"),
  technical_depth_score: integer("technical_depth_score"),
  communication_suggestion: text("communication_suggestion"),
  fluency_suggestion: text("fluency_suggestion"),
  confidence_suggestion: text("confidence_suggestion"),
  response_time_suggestion: text("response_time_suggestion"),
  technical_depth_suggestion: text("technical_depth_suggestion"),
  response_time: doublePrecision("response_time"),
  created_at: timestamp("created_at").defaultNow(),
});
