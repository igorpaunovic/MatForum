using MatForum.ForumQuestion.Application.Interfaces;
using MatForum.ForumQuestion.Infrastructure.Repositories;
using MatForum.ForumQuestion.Infrastructure.Data;
using MatForum.ForumQuestion.GRPC.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddGrpc();

// Register repository
builder.Services.AddScoped<IQuestionRepository, EfQuestionRepository>();

// Add Entity Framework
builder.Services.AddDbContext<QuestionDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
app.MapGrpcService<QuestionValidationGrpcService>();

app.MapGet("/",
    () =>
        "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

app.Run();

