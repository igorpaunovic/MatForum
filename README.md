# MatForum

## 🚀 How to Run

```
# Navigate to project root
cd MatfForum/docker_compose

# Build and run
docker-compose up --build -d

# View logs
docker logs -f user-service
```

## 🧪 How to test

`curl http://localhost:5001/weatherforecast`

## 🦴 Structure

MatForum/
├── src/
│   ├── ApiGateway/
│   │   └── MatForum.ApiGateway/
│   ├── Services/
│   │   ├── User/
│   │   │   ├── MatForum.User.API/
│   │   │   ├── MatForum.User.Domain/
│   │   │   ├── MatForum.User.Infrastructure/
│   │   │   └── MatForum.User.Application/
│   │   ├── Question/
│   │   │   ├── MatForum.Question.API/
│   │   │   ├── MatForum.Question.Domain/
│   │   │   ├── MatForum.Question.Infrastructure/
│   │   │   └── MatForum.Question.Application/
│   │   ├── Answer/
│   │   │   ├── MatForum.Answer.API/
│   │   │   ├── MatForum.Answer.Domain/
│   │   │   ├── MatForum.Answer.Infrastructure/
│   │   │   └── MatForum.Answer.Application/
│   │   ├── Voting/
│   │   │   ├── MatForum.Voting.API/
│   │   │   ├── MatForum.Voting.Domain/
│   │   │   ├── MatForum.Voting.Infrastructure/
│   │   │   └── MatForum.Voting.Application/
│   │   └── Notification/
│   │       ├── MatForum.Notification.API/
│   │       ├── MatForum.Notification.Domain/
│   │       ├── MatForum.Notification.Infrastructure/
│   │       └── MatForum.Notification.Application/
│   └── Shared/
│       ├── MatForum.Shared.Contracts/
│       ├── MatForum.Shared.Infrastructure/
│       └── MatForum.Shared.Domain/
├── tests/
├── docker/
├── docs/
└── MatForum.sln
