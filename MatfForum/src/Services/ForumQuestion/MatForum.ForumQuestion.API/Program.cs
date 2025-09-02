using MatForum.ForumQuestion.Application.Interfaces;
using MatForum.ForumQuestion.Application.Services;
using MatForum.ForumQuestion.Infrastructure.Repositories;
using MatForum.UserManagement.Application.Interfaces;
using MatForum.UserManagement.Infrastructure;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using MatForum.UserManagement.Application.DTOs;
using MatForum.UserManagement.Domain.Entities;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register the in-memory repository for IQuestionRepository
builder.Services.AddSingleton<IQuestionRepository, QuestionRepository>();
builder.Services.AddScoped<IForumQuestionService, ForumQuestionService>();

// Register the HttpClient for the UserServiceHttpClient
builder.Services.AddHttpClient<IUserService, UserServiceHttpClient>(client =>
{
    // Use the service name from docker-compose.yml for inter-container communication.
    // The port is the internal container port (80)
    client.BaseAddress = new Uri("http://user-service");
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();