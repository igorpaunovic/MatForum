using MatForum.Voting.Application.Interfaces;
using MatForum.Voting.Application.Services;
using MatForum.Voting.Infrastructure.Repositories;
using MatForum.Voting.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

// Enable legacy timestamp behavior to use timestamp without time zone
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// No JWT validation needed - API Gateway handles authentication
// Services trust internal requests from the gateway

// Add Entity Framework
builder.Services.AddDbContext<VotingDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register services
builder.Services.AddScoped<IVoteRepository, EfVoteRepository>();
builder.Services.AddScoped<IVoteService, VoteService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    try
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<VotingDbContext>();
        dbContext.Database.Migrate();

        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("Voting database migrations applied successfully.");
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the Voting database.");
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

