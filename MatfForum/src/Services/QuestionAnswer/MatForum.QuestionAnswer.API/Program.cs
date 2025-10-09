using MatForum.QuestionAnswer.Application.Interfaces;
using MatForum.QuestionAnswer.Application.Services;
using MatForum.QuestionAnswer.Infrastructure.Repositories;
using MatForum.QuestionAnswer.Infrastructure.Data;
using MatForum.QuestionAnswer.Infrastructure.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

var builder = WebApplication.CreateBuilder(args);

// const string CorsPolicy = "ViteDev";

// CORS
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy(CorsPolicy, policy =>
//        policy.WithOrigins("http://localhost:5173")
//              .AllowAnyHeader()
//              .AllowAnyMethod()
//    );
//});

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register application services and repositories
builder.Services.AddScoped<IAnswerRepository, AnswerRepository>();
builder.Services.AddScoped<IAnswerService, AnswerService>();

// Register the HttpClient for the UserService
builder.Services.AddHttpClient<IUserService, MatForum.QuestionAnswer.Infrastructure.Clients.UserServiceHttpClient>(client =>
{
    client.BaseAddress = new Uri("http://user-service/");
});

// Register the HttpClient for the QuestionValidator
builder.Services.AddHttpClient<IQuestionValidator, QuestionValidator>(client =>
{
    client.BaseAddress = new Uri("http://question-service/");
});

// Add Entity Framework
builder.Services.AddDbContext<QuestionAnswerDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<QuestionAnswerDbContext>();
    context.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
// app.UseCors(CorsPolicy); // Uncomment if CORS is needed
app.UseAuthorization();
app.MapControllers();
app.Run();
