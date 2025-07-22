# MatForum

## 🚀 How to Run

```
# Navigate to project root
cd MatfForum/docker

# Build and run just the user service
docker-compose up --build

# Or run in background
docker-compose up --build -d

# View logs
docker-compose logs -f user-service

# Stop
docker-compose down
```

## 🧪 How to test

`curl http://localhost:5001/weatherforecast`