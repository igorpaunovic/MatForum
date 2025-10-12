using Microsoft.EntityFrameworkCore;
using MatForum.UserManagement.Application.Interfaces;
using MatForum.UserManagement.Application.Services;
using MatForum.UserManagement.Infrastructure.Data;
using MatForum.UserManagement.Infrastructure.Repositories;
using MatForum.UserManagement.Domain.Entities;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register EF Core DbContext
builder.Services.AddDbContext<UserManagementDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// No JWT validation needed - API Gateway handles authentication
// Services trust internal requests from the gateway

// Register services
builder.Services.AddScoped<IUserProfileRepository, UserProfileRepository>();
builder.Services.AddScoped<IUserProfileService, UserProfileService>();

builder.Services.AddControllers();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    try
    {
        // Replace with your actual DbContext class name!
        var dbContext = scope.ServiceProvider.GetRequiredService<UserManagementDbContext>();
        dbContext.Database.Migrate();

        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("IdentityServer database migrations applied successfully.");
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the IdentityServer database.");
        throw;
    }
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

// No authentication middleware needed - API Gateway handles it

app.MapControllers();
app.Run();
