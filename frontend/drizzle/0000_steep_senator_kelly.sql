CREATE TABLE "feedback_detail" (
	"id" serial PRIMARY KEY NOT NULL,
	"mockIdRef" varchar(64),
	"userEmail" varchar(255),
	"question" text,
	"user_answer" text,
	"correct_answer" text,
	"feedback" text,
	"rating" double precision,
	"communication_score" integer,
	"fluency_score" integer,
	"confidence_score" integer,
	"response_time_score" integer,
	"technical_depth_score" integer,
	"communication_suggestion" text,
	"fluency_suggestion" text,
	"confidence_suggestion" text,
	"response_time_suggestion" text,
	"technical_depth_suggestion" text,
	"response_time" double precision,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mock_interview" (
	"id" serial PRIMARY KEY NOT NULL,
	"jsonMockResp" text NOT NULL,
	"jobPosition" varchar(255) NOT NULL,
	"jobDesc" text NOT NULL,
	"jobExperience" varchar(255) NOT NULL,
	"createdBy" varchar(255) NOT NULL,
	"createdAt" varchar(255) NOT NULL,
	"mockId" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userAnswer" (
	"id" serial PRIMARY KEY NOT NULL,
	"mockId" varchar NOT NULL,
	"userEmail" varchar,
	"question" varchar NOT NULL,
	"correctAns" text,
	"userAns" text,
	"feedback" text,
	"rating" varchar,
	"communicationScore" integer,
	"fluencyScore" integer,
	"confidenceScore" integer,
	"responseTimeScore" integer,
	"technicalDepthScore" integer,
	"communicationSuggestion" text,
	"fluencySuggestion" text,
	"confidenceSuggestion" text,
	"responseTimeSuggestion" text,
	"technicalDepthSuggestion" text,
	"createdAt" varchar
);
