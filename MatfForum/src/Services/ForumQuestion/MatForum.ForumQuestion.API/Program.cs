using MatForum.ForumQuestion.Application.Interfaces;
using MatForum.ForumQuestion.Application.Services;
using MatForum.ForumQuestion.Infrastructure.Repositories;
using MatForum.ForumQuestion.Infrastructure.Clients;
using MatForum.ForumQuestion.Infrastructure.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// No authentication needed - services trust internal requests from API Gateway
// Network security ensures only API Gateway can reach services

builder.Services.AddScoped<IForumQuestionService, ForumQuestionService>();

// Register the HttpClient for the UserServiceHttpClient
builder.Services.AddHttpClient<IUserService, UserServiceHttpClient>(client =>
{
    client.BaseAddress = new Uri("http://user-service");
});

// Register the HttpClient for the AnswerServiceHttpClient
builder.Services.AddHttpClient<IAnswerServiceClient, AnswerServiceHttpClient>(client =>
{
    client.BaseAddress = new Uri("http://answer-service");
});

// Add Entity Framework
builder.Services.AddDbContext<QuestionDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register the EF repository for IQuestionRepository
builder.Services.AddScoped<IQuestionRepository, EfQuestionRepository>(); 

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    try
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<QuestionDbContext>();
        dbContext.Database.Migrate();

        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("ForumQuestion database migrations applied successfully.");
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the ForumQuestion database.");
        throw;
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// No authentication middleware needed - API Gateway handles it

app.MapControllers();

app.Run();
