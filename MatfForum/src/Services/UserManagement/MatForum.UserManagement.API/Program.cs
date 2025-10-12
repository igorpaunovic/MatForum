using Microsoft.EntityFrameworkCore;
using MatForum.UserManagement.Application.Interfaces;
using MatForum.UserManagement.Application.Services;
using MatForum.UserManagement.Infrastructure.Data;
using MatForum.UserManagement.Infrastructure.Repositories;
using MatForum.UserManagement.Infrastructure.Clients;
using MatForum.UserManagement.Domain.Entities;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register EF Core DbContext
builder.Services.AddDbContext<UserManagementDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register HttpClients for other microservices
builder.Services.AddHttpClient<IQuestionServiceClient, QuestionServiceHttpClient>(client =>
{
    client.BaseAddress = new Uri("http://question-service");
});

builder.Services.AddHttpClient<IAnswerServiceClient, AnswerServiceHttpClient>(client =>
{
    client.BaseAddress = new Uri("http://answer-service");
});

// Register services
builder.Services.AddScoped<IUserProfileRepository, UserProfileRepository>();
builder.Services.AddScoped<IUserProfileService, UserProfileService>();

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();
