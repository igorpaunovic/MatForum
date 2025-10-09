#!/bin/bash
# Quick start script za lokalni development (bez Docker-a)
# Mnogo brže od docker-compose!

echo "🚀 Pokrećem MatForum servise za development..."

# Proveri da li je Postgres pokrenut (mora biti u Docker-u)
if ! docker ps | grep -q matforum-postgres; then
    echo "⚠️  Postgres nije pokrenut. Pokrećem samo Postgres..."
    docker-compose up -d postgres
    sleep 5
fi

# Pokreni servise u pozadini
echo "📦 Pokrećem Voting Service na portu 5003..."
cd src/Services/Voting/MatForum.Voting.API
dotnet run > /tmp/voting.log 2>&1 &
VOTING_PID=$!

echo "📦 Pokrećem Question Service na portu 5002..."
cd ../../../ForumQuestion/MatForum.ForumQuestion.API
dotnet run > /tmp/question.log 2>&1 &
QUESTION_PID=$!

echo "📦 Pokrećem User Service na portu 5001..."
cd ../../../UserManagement/MatForum.UserManagement.API
dotnet run > /tmp/user.log 2>&1 &
USER_PID=$!

echo "📦 Pokrećem API Gateway na portu 5000..."
cd ../../../../ApiGateway/MatForum.ApiGateway
dotnet run > /tmp/gateway.log 2>&1 &
GATEWAY_PID=$!

echo ""
echo "✅ Servisi pokrenuti!"
echo "   - Postgres:  localhost:5432 (Docker)"
echo "   - Gateway:   http://localhost:5000"
echo "   - Users:     http://localhost:5001"
echo "   - Questions: http://localhost:5002"
echo "   - Voting:    http://localhost:5003"
echo ""
echo "📋 Process IDs:"
echo "   Voting:    $VOTING_PID"
echo "   Question:  $QUESTION_PID"
echo "   User:      $USER_PID"
echo "   Gateway:   $GATEWAY_PID"
echo ""
echo "📝 Logovi:"
echo "   tail -f /tmp/voting.log"
echo "   tail -f /tmp/question.log"
echo "   tail -f /tmp/user.log"
echo "   tail -f /tmp/gateway.log"
echo ""
echo "🛑 Za zaustavljanje:"
echo "   kill $VOTING_PID $QUESTION_PID $USER_PID $GATEWAY_PID"
echo "   ili: pkill -f 'dotnet.*MatForum'"
