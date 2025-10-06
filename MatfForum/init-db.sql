-- MatForum Database Initialization Script
-- This script creates the necessary tables for Question and Voting services

-- Create Users table
CREATE TABLE IF NOT EXISTS "Users" (
    "Id" UUID PRIMARY KEY,
    "FirstName" VARCHAR(100) NOT NULL,
    "LastName" VARCHAR(100) NOT NULL,
    "Email" VARCHAR(255) NOT NULL,
    "Username" VARCHAR(100) NOT NULL,
    "DateOfBirth" DATE NOT NULL,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create Questions table
CREATE TABLE IF NOT EXISTS "Questions" (
    "Id" UUID PRIMARY KEY,
    "Title" VARCHAR(500) NOT NULL,
    "Content" TEXT NOT NULL,
    "CreatedByUserId" UUID NOT NULL,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "Views" INTEGER NOT NULL DEFAULT 0,
    "IsClosed" BOOLEAN NOT NULL DEFAULT FALSE,
    "Tags" TEXT[]
);

-- Create Votes table
CREATE TABLE IF NOT EXISTS "Votes" (
    "Id" UUID PRIMARY KEY,
    "QuestionId" UUID NOT NULL,
    "UserId" UUID NOT NULL,
    "VoteType" INTEGER NOT NULL, -- -1 for downvote, 0 for neutral, 1 for upvote
--     "CreatedDate" TIMESTAMP WITH TIME ZONE NOT NULL,
--     "LastModifiedDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE("QuestionId", "UserId") -- Ensure one vote per user per question
);

-- Create Answers table
CREATE TABLE IF NOT EXISTS "Answers" (
    "Id" UUID PRIMARY KEY,
    "Content" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "QuestionId" UUID NOT NULL,
    "AuthorId" UUID NOT NULL,
    FOREIGN KEY ("QuestionId") REFERENCES "Questions"("Id") ON DELETE CASCADE,
    FOREIGN KEY ("AuthorId") REFERENCES "Users"("Id") ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS IX_Questions_CreatedByUserId ON "Questions"("CreatedByUserId");
CREATE INDEX IF NOT EXISTS IX_Questions_CreatedDate ON "Questions"("CreatedAt");
CREATE INDEX IF NOT EXISTS IX_Questions_IsClosed ON "Questions"("IsClosed");
CREATE INDEX IF NOT EXISTS IX_Questions_Views ON "Questions"("Views");

CREATE INDEX IF NOT EXISTS IX_Votes_QuestionId ON "Votes"("QuestionId");
CREATE INDEX IF NOT EXISTS IX_Votes_UserId ON "Votes"("UserId");
CREATE INDEX IF NOT EXISTS IX_Votes_VoteType ON "Votes"("VoteType");

-- -- Create a function to update the UpdatedAt timestamp
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.UpdatedAt = NOW();
--     RETURN NEW;
-- END;
-- $$ language 'plpgsql';
-- 
-- -- Create triggers to automatically update UpdatedAt
-- CREATE TRIGGER update_questions_updated_at 
--     BEFORE UPDATE ON "Questions" 
--     FOR EACH ROW 
--     EXECUTE FUNCTION update_updated_at_column();
-- 
-- CREATE TRIGGER update_votes_updated_at 
--     BEFORE UPDATE ON "Votes" 
--     FOR EACH ROW 
--     EXECUTE FUNCTION update_updated_at_column();
-- 
-- CREATE TRIGGER update_answers_updated_at 
--     BEFORE UPDATE ON "Answers" 
--     FOR EACH ROW 
--     EXECUTE FUNCTION update_updated_at_column();
-- 
-- CREATE TRIGGER update_users_updated_at 
--     BEFORE UPDATE ON "Users" 
--     FOR EACH ROW 
--     EXECUTE FUNCTION update_updated_at_column();

-- Insert sample users
INSERT INTO "Users" ("Id", "FirstName", "LastName", "Email", "Username", "DateOfBirth", "CreatedAt", "UpdatedAt") VALUES
    ('550e8400-e29b-41d4-a716-446655440010', 'Alice', 'Smith', 'alice.smith@example.com', 'alice', '1990-01-01', NOW(), NOW()),
    ('550e8400-e29b-41d4-a716-446655440011', 'Bob', 'Johnson', 'bob.johnson@example.com', 'bob', '1985-05-15', NOW(), NOW()),
    ('550e8400-e29b-41d4-a716-446655440012', 'Carol', 'Williams', 'carol.williams@example.com', 'carol', '1992-09-30', NOW(), NOW())
ON CONFLICT ("Id") DO NOTHING;

-- Insert some sample data for testing
INSERT INTO "Questions" ("Id", "Title", "Content", "CreatedByUserId", "CreatedAt", "UpdatedAt", "Views", "IsClosed", "Tags") VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'How to implement clean architecture?', 'I am new to clean architecture and would like to understand the best practices for implementing it in a .NET application.', '550e8400-e29b-41d4-a716-446655440010', NOW(), NOW(), 15, FALSE, ARRAY['architecture', 'clean-code', 'dotnet']),
    ('550e8400-e29b-41d4-a716-446655440002', 'Best practices for microservices communication', 'What are the recommended patterns for communication between microservices in a distributed system?', '550e8400-e29b-41d4-a716-446655440011', NOW(), NOW(), 8, FALSE, ARRAY['microservices', 'communication', 'distributed-systems']),
    ('550e8400-e29b-41d4-a716-446655440003', 'Entity Framework vs Dapper performance', 'I need to choose between Entity Framework and Dapper for my new project. What are the performance implications?', '550e8400-e29b-41d4-a716-446655440012', NOW(), NOW(), 23, FALSE, ARRAY['entity-framework', 'dapper', 'performance', 'orm'])
ON CONFLICT ("Id") DO NOTHING;

-- Insert some sample votes
INSERT INTO "Votes" ("Id", "QuestionId", "UserId", "VoteType", "CreatedAt", "UpdatedAt") VALUES
    ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440020', 1, NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440021', 1, NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440022', -1, NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440020', 1, NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440021', 1, NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440022', 1, NOW(), NOW())
ON CONFLICT ("QuestionId", "UserId") DO NOTHING;

-- Insert some sample answers
INSERT INTO "Answers" ("Id", "Content", "CreatedAt", "QuestionId", "AuthorId") VALUES
    ('750e8400-e29b-41d4-a716-446655440001', 'Consider using the repository pattern to implement clean architecture.', NOW(), '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010'),
    ('750e8400-e29b-41d4-a716-446655440002', 'Microservices can communicate synchronously using HTTP REST or gRPC, and asynchronously using message brokers like RabbitMQ or Kafka.', NOW(), '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440011'),
    ('750e8400-e29b-41d4-a716-446655440003', 'Dapper generally has better performance due to its lightweight nature and direct mapping to SQL.', NOW(), '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440012')
ON CONFLICT ("Id") DO NOTHING;
