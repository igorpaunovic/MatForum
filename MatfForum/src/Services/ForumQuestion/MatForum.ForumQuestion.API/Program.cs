using MatForum.ForumQuestion.Application.Interfaces;
using MatForum.ForumQuestion.Application.Services;
using MatForum.ForumQuestion.Infrastructure.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

const string CorsPolicy = "ViteDev";

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy =>
        policy.WithOrigins("http://localhost:5173") 
              .AllowAnyHeader()
              .AllowAnyMethod()
    );
});


// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register the in-memory repository for IQuestionRepository
builder.Services.AddSingleton<IQuestionRepository, InMemoryQuestionRepository>(); 
builder.Services.AddScoped<QuestionService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS before auth
app.UseCors(CorsPolicy);

app.UseAuthorization();

app.MapControllers();

app.Run();