-- =====================================================
-- MatForum Database Seed Data Script
-- =====================================================

-- 1. INSERT USERS (UserProfiles table)
-- =====================================================
INSERT INTO "UserProfiles" ("Id", "FirstName", "LastName", "Email", "Username", "DateOfBirth", "CreatedAt", "UpdatedAt", "IsDeleted", "DeletedAt") VALUES
    ('550e8400-e29b-41d4-a716-446655440010', 'Alice', 'Smith', 'alice.smith@example.com', 'alice', '1990-01-01', NOW(), NOW(), FALSE, NULL),
    ('550e8400-e29b-41d4-a716-446655440011', 'Bob', 'Johnson', 'bob.johnson@example.com', 'bob', '1985-05-15', NOW(), NOW(), FALSE, NULL),
    ('550e8400-e29b-41d4-a716-446655440012', 'Carol', 'Williams', 'carol.williams@example.com', 'carol', '1992-09-30', NOW(), NOW(), FALSE, NULL),
    ('550e8400-e29b-41d4-a716-446655440013', 'David', 'Brown', 'david.brown@example.com', 'david', '1988-03-22', NOW(), NOW(), FALSE, NULL),
    ('550e8400-e29b-41d4-a716-446655440014', 'Emma', 'Davis', 'emma.davis@example.com', 'emma', '1995-07-14', NOW(), NOW(), FALSE, NULL)
ON CONFLICT ("Id") DO NOTHING;

-- 2. INSERT QUESTIONS (Questions table)
-- =====================================================
INSERT INTO "Questions" ("Id", "Title", "Content", "CreatedByUserId", "CreatedAt", "UpdatedAt", "Views", "IsClosed", "Tags", "IsDeleted", "DeletedAt") VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'How to implement clean architecture?', 'I am new to clean architecture and would like to understand the best practices for implementing it in a .NET application. Can someone explain the main layers and their responsibilities?', '550e8400-e29b-41d4-a716-446655440010', NOW(), NOW(), 15, FALSE, ARRAY['architecture', 'clean-code', 'dotnet'], FALSE, NULL),
    ('550e8400-e29b-41d4-a716-446655440002', 'Best practices for microservices communication', 'What are the recommended patterns for communication between microservices in a distributed system? Should I use HTTP, gRPC, or message queues?', '550e8400-e29b-41d4-a716-446655440011', NOW(), NOW(), 8, FALSE, ARRAY['microservices', 'communication', 'distributed-systems'], FALSE, NULL),
    ('550e8400-e29b-41d4-a716-446655440003', 'Entity Framework vs Dapper performance', 'I need to choose between Entity Framework and Dapper for my new project. What are the performance implications? Which one is better for high-traffic applications?', '550e8400-e29b-41d4-a716-446655440012', NOW(), NOW(), 23, FALSE, ARRAY['entity-framework', 'dapper', 'performance', 'orm'], FALSE, NULL),
    ('550e8400-e29b-41d4-a716-446655440004', 'Docker networking best practices', 'How should I configure networking between Docker containers in a production environment? What about security considerations?', '550e8400-e29b-41d4-a716-446655440013', NOW(), NOW(), 12, FALSE, ARRAY['docker', 'networking', 'devops'], FALSE, NULL),
    ('550e8400-e29b-41d4-a716-446655440005', 'PostgreSQL indexing strategies', 'What are the best indexing strategies for PostgreSQL when dealing with large datasets? When should I use B-tree vs Hash indexes?', '550e8400-e29b-41d4-a716-446655440014', NOW(), NOW(), 19, FALSE, ARRAY['postgresql', 'database', 'indexing', 'performance'], FALSE, NULL)
ON CONFLICT ("Id") DO NOTHING;

-- 3. INSERT ANSWERS (Answers table)
-- =====================================================
INSERT INTO "Answers" ("Id", "Content", "QuestionId", "AuthorId", "ParentAnswerId", "CreatedAt", "UpdatedAt", "IsDeleted", "DeletedAt") VALUES
    -- Answers to Question 1 (Clean Architecture)
    ('750e8400-e29b-41d4-a716-446655440001', 'Consider using the repository pattern to implement clean architecture. The main layers are: Domain (entities), Application (use cases), Infrastructure (data access), and Presentation (API/UI). Keep dependencies pointing inward.', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', NULL, NOW(), NOW(), FALSE, NULL),
    ('750e8400-e29b-41d4-a716-446655440002', 'Great explanation! I would also add that you should use interfaces in the Application layer and implement them in Infrastructure. This keeps your business logic independent of external frameworks.', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440012', '750e8400-e29b-41d4-a716-446655440001', NOW(), NOW(), FALSE, NULL),
    
    -- Answers to Question 2 (Microservices)
    ('750e8400-e29b-41d4-a716-446655440003', 'Microservices can communicate synchronously using HTTP REST or gRPC, and asynchronously using message brokers like RabbitMQ or Kafka. For real-time requests, use gRPC. For eventual consistency and decoupling, use message queues.', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', NULL, NOW(), NOW(), FALSE, NULL),
    ('750e8400-e29b-41d4-a716-446655440004', 'I prefer using API Gateway pattern with service mesh for microservices communication. Tools like Istio or Linkerd can help with traffic management and observability.', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440014', NULL, NOW(), NOW(), FALSE, NULL),
    
    -- Answers to Question 3 (EF vs Dapper)
    ('750e8400-e29b-41d4-a716-446655440005', 'Dapper generally has better performance due to its lightweight nature and direct mapping to SQL. However, Entity Framework provides better developer productivity with its rich features like change tracking and migrations. For high-traffic apps with complex queries, consider Dapper.', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440013', NULL, NOW(), NOW(), FALSE, NULL),
    ('750e8400-e29b-41d4-a716-446655440006', 'You can also use both! Use EF for CRUD operations and Dapper for complex reporting queries. This gives you the best of both worlds.', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440011', '750e8400-e29b-41d4-a716-446655440005', NOW(), NOW(), FALSE, NULL),
    
    -- Answers to Question 4 (Docker Networking)
    ('750e8400-e29b-41d4-a716-446655440007', 'Use Docker bridge networks for containers that need to communicate on the same host. For multi-host deployments, use overlay networks. Always use internal networks for databases and expose only necessary ports.', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440012', NULL, NOW(), NOW(), FALSE, NULL),
    
    -- Answers to Question 5 (PostgreSQL Indexing)
    ('750e8400-e29b-41d4-a716-446655440008', 'B-tree indexes are the default and work well for most cases, especially range queries. Use Hash indexes only for equality comparisons on large tables. Consider partial indexes for queries with WHERE clauses, and use EXPLAIN ANALYZE to verify index usage.', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440010', NULL, NOW(), NOW(), FALSE, NULL),
    ('750e8400-e29b-41d4-a716-446655440009', 'Don''t forget about GIN and GiST indexes for full-text search and geometric data types! Also, be careful with over-indexing as it can slow down INSERT/UPDATE operations.', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440014', '750e8400-e29b-41d4-a716-446655440008', NOW(), NOW(), FALSE, NULL)
ON CONFLICT ("Id") DO NOTHING;

-- 4. INSERT VOTES (Votes table)
-- =====================================================
-- Votes on Questions
INSERT INTO "Votes" ("Id", "QuestionId", "AnswerId", "UserId", "VoteType", "CreatedAt", "UpdatedAt", "IsDeleted", "DeletedAt") VALUES
    -- Votes for Question 1
    ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', NULL, '550e8400-e29b-41d4-a716-446655440011', 1, NOW(), NOW(), FALSE, NULL),
    ('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', NULL, '550e8400-e29b-41d4-a716-446655440012', 1, NOW(), NOW(), FALSE, NULL),
    ('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', NULL, '550e8400-e29b-41d4-a716-446655440013', 1, NOW(), NOW(), FALSE, NULL),
    
    -- Votes for Question 2
    ('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', NULL, '550e8400-e29b-41d4-a716-446655440010', 1, NOW(), NOW(), FALSE, NULL),
    ('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', NULL, '550e8400-e29b-41d4-a716-446655440014', 1, NOW(), NOW(), FALSE, NULL),
    
    -- Votes for Question 3
    ('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', NULL, '550e8400-e29b-41d4-a716-446655440010', 1, NOW(), NOW(), FALSE, NULL),
    ('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', NULL, '550e8400-e29b-41d4-a716-446655440011', 1, NOW(), NOW(), FALSE, NULL),
    ('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', NULL, '550e8400-e29b-41d4-a716-446655440014', -1, NOW(), NOW(), FALSE, NULL),
    
    -- Votes for Question 4
    ('650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440004', NULL, '550e8400-e29b-41d4-a716-446655440010', 1, NOW(), NOW(), FALSE, NULL),
    ('650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440004', NULL, '550e8400-e29b-41d4-a716-446655440011', 1, NOW(), NOW(), FALSE, NULL),
    
    -- Votes for Question 5
    ('650e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440005', NULL, '550e8400-e29b-41d4-a716-446655440011', 1, NOW(), NOW(), FALSE, NULL),
    ('650e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440005', NULL, '550e8400-e29b-41d4-a716-446655440012', 1, NOW(), NOW(), FALSE, NULL),
    ('650e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440005', NULL, '550e8400-e29b-41d4-a716-446655440013', 1, NOW(), NOW(), FALSE, NULL)
ON CONFLICT DO NOTHING;

-- Votes on Answers
INSERT INTO "Votes" ("Id", "QuestionId", "AnswerId", "UserId", "VoteType", "CreatedAt", "UpdatedAt", "IsDeleted", "DeletedAt") VALUES
    -- Votes for Answer 1
    ('650e8400-e29b-41d4-a716-446655440020', NULL, '750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', 1, NOW(), NOW(), FALSE, NULL),
    ('650e8400-e29b-41d4-a716-446655440021', NULL, '750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440013', 1, NOW(), NOW(), FALSE, NULL),
    
    -- Votes for Answer 3
    ('650e8400-e29b-41d4-a716-446655440022', NULL, '750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440011', 1, NOW(), NOW(), FALSE, NULL),
    ('650e8400-e29b-41d4-a716-446655440023', NULL, '750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440012', 1, NOW(), NOW(), FALSE, NULL),
    
    -- Votes for Answer 5
    ('650e8400-e29b-41d4-a716-446655440024', NULL, '750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440010', 1, NOW(), NOW(), FALSE, NULL),
    ('650e8400-e29b-41d4-a716-446655440025', NULL, '750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440014', 1, NOW(), NOW(), FALSE, NULL),
    
    -- Votes for Answer 8
    ('650e8400-e29b-41d4-a716-446655440026', NULL, '750e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440011', 1, NOW(), NOW(), FALSE, NULL),
    ('650e8400-e29b-41d4-a716-446655440027', NULL, '750e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440012', 1, NOW(), NOW(), FALSE, NULL)
ON CONFLICT DO NOTHING;

-- =====================================================
-- Verification Queries (Optional - run to verify data)
-- =====================================================
-- SELECT COUNT(*) as user_count FROM "UserProfiles";
-- SELECT COUNT(*) as question_count FROM "Questions";
-- SELECT COUNT(*) as answer_count FROM "Answers";
-- SELECT COUNT(*) as vote_count FROM "Votes";