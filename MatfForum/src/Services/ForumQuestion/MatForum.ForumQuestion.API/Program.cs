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

// No authentication needed - services trust internal requests from API Gateway
// Network security ensures only API Gateway can reach services

builder.Services.AddScoped<IForumQuestionService, ForumQuestionService>();

// Register the HttpClient for the UserServiceHttpClient
builder.Services.AddHttpClient<IUserService, UserServiceHttpClient>(client =>
{
    client.BaseAddress = new Uri("http://user-service");
});
// Add Entity Framework
builder.Services.AddDbContext<QuestionDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register the EF repository for IQuestionRepository
builder.Services.AddScoped<IQuestionRepository, EfQuestionRepository>(); 

var app = builder.Build();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<QuestionDbContext>();
    context.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();   

// CORS before auth
// app.UseCors(CorsPolicy);

// No authentication middleware needed - API Gateway handles it

app.MapControllers();

app.Run();