using MatForum.ForumQuestion.Application.Interfaces;
using MatForum.ForumQuestion.Application.Services;
using MatForum.ForumQuestion.Infrastructure.Repositories;
using MatForum.UserManagement.Application.Interfaces;
using MatForum.UserManagement.Application.Services;
using MatForum.UserManagement.Infrastructure.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register the in-memory repository for IQuestionRepository
builder.Services.AddSingleton<IQuestionRepository, QuestionRepository>(); 
builder.Services.AddScoped<IForumQuestionService, ForumQuestionService>();
// Register the service for Users

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();


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