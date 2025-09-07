# MatForum Voting Service

A microservice for managing votes on forum questions in the MatForum application. This service handles upvoting, downvoting, and vote management for forum questions.

## Overview

The Voting Service provides a RESTful API for managing votes on forum questions. Users can upvote, downvote, change their votes, or remove their votes entirely. The service maintains vote statistics and provides endpoints for retrieving vote information.

## Architecture

This service follows Clean Architecture principles with the following layers:

- **API Layer** (`MatForum.Voting.API`): Controllers and API endpoints
- **Application Layer** (`MatForum.Voting.Application`): Business logic and services
- **Domain Layer** (`MatForum.Voting.Domain`): Entities and domain models
- **Infrastructure Layer** (`MatForum.Voting.Infrastructure`): Data access and repositories

## Features

- ✅ Vote on questions (upvote/downvote)
- ✅ Change existing votes
- ✅ Remove votes (set to neutral)
- ✅ Get user's vote for a specific question
- ✅ Get vote summary for questions
- ✅ Get all votes for a question
- ✅ In-memory data storage (for development)
- ✅ Swagger API documentation

## API Endpoints

### Vote Management

#### Vote on a Question
```http
POST /api/votes/vote
Content-Type: application/json

{
  "questionId": "12345678-1234-1234-1234-123456789012",
  "userId": "87654321-4321-4321-4321-210987654321",
  "voteType": 1
}
```

**Vote Types:**
- `1` = Upvote
- `-1` = Downvote

#### Change Existing Vote
```http
PUT /api/votes/change
Content-Type: application/json

{
  "questionId": "12345678-1234-1234-1234-123456789012",
  "userId": "87654321-4321-4321-4321-210987654321",
  "newVoteType": -1
}
```

#### Remove Vote
```http
DELETE /api/votes/remove
Content-Type: application/json

{
  "questionId": "12345678-1234-1234-1234-123456789012",
  "userId": "87654321-4321-4321-4321-210987654321"
}
```

### Vote Retrieval

#### Get User's Vote
```http
GET /api/votes/user/{questionId}/{userId}
```

**Response:**
```json
{
  "id": "vote-id",
  "questionId": "12345678-1234-1234-1234-123456789012",
  "userId": "87654321-4321-4321-4321-210987654321",
  "voteType": 1,
  "createdDate": "2025-09-06T13:26:04.3426175+00:00",
  "lastModifiedDate": "2025-09-06T13:26:04.3426175+00:00"
}
```

#### Get Vote Summary
```http
GET /api/votes/summary/{questionId}?userId={userId}
```

**Response:**
```json
{
  "questionId": "12345678-1234-1234-1234-123456789012",
  "totalUpvotes": 15,
  "totalDownvotes": 3,
  "netScore": 12,
  "userVote": 1,
  "totalVotes": 18
}
```

#### Get All Votes for Question
```http
GET /api/votes/question/{questionId}
```

**Response:**
```json
[
  {
    "id": "vote1",
    "questionId": "12345678-1234-1234-1234-123456789012",
    "userId": "user1",
    "voteType": 1,
    "createdDate": "2025-09-06T13:26:04.3426175+00:00"
  }
]
```

## Getting Started

### Prerequisites

- .NET 8.0 SDK
- Docker (optional)

### Running Locally

1. **Navigate to the API project:**
   ```bash
   cd src/Services/Voting/MatForum.Voting.API
   ```

2. **Restore dependencies:**
   ```bash
   dotnet restore
   ```

3. **Run the service:**
   ```bash
   dotnet run
   ```

4. **Access the API:**
   - API: `http://localhost:5000`
   - Swagger UI: `http://localhost:5000/swagger`

### Running with Docker

1. **From the project root:**
   ```bash
   docker-compose up voting-service
   ```

2. **Access the API:**
   - API: `http://localhost:5003`
   - Swagger UI: `http://localhost:5003/swagger`

## Configuration

### Environment Variables

- `ASPNETCORE_ENVIRONMENT`: Set to `Development` or `Production`
- `ASPNETCORE_URLS`: Override default URLs (default: `http://+:80`)

### App Settings

The service uses standard ASP.NET Core configuration. Key settings can be found in:
- `appsettings.json` - Base configuration
- `appsettings.Development.json` - Development-specific settings

## Data Models

### Vote Entity
```csharp
public class Vote
{
    public Guid Id { get; set; }
    public Guid QuestionId { get; set; }
    public Guid UserId { get; set; }
    public int VoteType { get; set; } // 1 = upvote, -1 = downvote
    public DateTime CreatedDate { get; set; }
    public DateTime LastModifiedDate { get; set; }
}
```

### DTOs

- **VoteDto**: Vote data transfer object
- **QuestionVoteSummaryDto**: Vote statistics for a question
- **VoteQuestionCommand**: Command for voting
- **ChangeVoteCommand**: Command for changing votes
- **RemoveVoteCommand**: Command for removing votes

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK` - Successful operation
- `201 Created` - Vote created successfully
- `204 No Content` - Vote removed successfully
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Vote or question not found
- `500 Internal Server Error` - Server error

## Testing

### Using cURL

**Vote on a question:**
```bash
curl -X POST http://localhost:5003/api/votes/vote \
  -H "Content-Type: application/json" \
  -d '{
    "questionId": "12345678-1234-1234-1234-123456789012",
    "userId": "87654321-4321-4321-4321-210987654321",
    "voteType": 1
  }'
```

**Get vote summary:**
```bash
curl -X GET "http://localhost:5003/api/votes/summary/12345678-1234-1234-1234-123456789012"
```

### Using Swagger UI

1. Navigate to `http://localhost:5003/swagger`
2. Use the interactive API documentation to test endpoints
3. Click "Try it out" on any endpoint to test it

## Development

### Project Structure

```
src/Services/Voting/
├── MatForum.Voting.API/           # Web API project
│   ├── Controllers/
│   │   └── VotesController.cs     # API endpoints
│   ├── Program.cs                 # Application startup
│   └── appsettings.json          # Configuration
├── MatForum.Voting.Application/   # Business logic
│   ├── DTOs/                      # Data transfer objects
│   ├── Interfaces/                # Service interfaces
│   └── Services/                  # Business services
├── MatForum.Voting.Domain/        # Domain entities
│   └── Entities/
│       └── Vote.cs               # Vote entity
└── MatForum.Voting.Infrastructure/ # Data access
    └── Repositories/
        └── InMemoryVoteRepository.cs # In-memory storage
```

### Adding New Features

1. **Domain Layer**: Add new entities or modify existing ones
2. **Application Layer**: Add new services and DTOs
3. **Infrastructure Layer**: Implement new repositories
4. **API Layer**: Add new controllers and endpoints

## Dependencies

- **Microsoft.AspNetCore.OpenApi** (8.0.8) - OpenAPI support
- **Swashbuckle.AspNetCore** (6.5.0) - Swagger documentation
- **MatForum.Shared.Domain** - Shared domain models

## Contributing

1. Follow Clean Architecture principles
2. Add unit tests for new features
3. Update API documentation
4. Follow C# coding conventions
5. Update this README for significant changes

## License

This project is part of the MatForum application suite.

## Support

For issues and questions related to the Voting Service, please contact the development team or create an issue in the project repository.
