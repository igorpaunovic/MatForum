using MatForum.IdentityServer.Application.Interfaces;
using MatForum.IdentityServer.Application.Services;
using MatForum.IdentityServer.Infrastructure.Data;
using MatForum.IdentityServer.Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore; // ADD THIS
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddAuthentication(); // DI za potrebe autentifikacije  

builder.Services.ConfigureJWT(builder.Configuration);
builder.Services.ConfigurePersistance(builder.Configuration); // napokon! 
builder.Services.ConfigureIdentity(); // moramo da dodamo jos 1 poziv pre njega
builder.Services.ConfigureMiscellaneousServices();

// Configure AutoMapper to scan Application assembly for profiles
builder.Services.AddAutoMapper(Assembly.Load("MatForum.IdentityServer.Application"));

// Register Application services with fully qualified names to avoid namespace collision
builder.Services.AddScoped<MatForum.IdentityServer.Application.Interfaces.IAuthenticationService, MatForum.IdentityServer.Application.Services.AuthenticationService>();

// Register HttpClient for UserManagement service
builder.Services.AddHttpClient<MatForum.IdentityServer.Infrastructure.Clients.UserManagementHttpClient>(client =>
{
    client.BaseAddress = new Uri("http://user-service/");
});



var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    try
    {
        // Replace with your actual DbContext class name!
        var dbContext = scope.ServiceProvider.GetRequiredService<IdentityServerDbContext>();
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


app.UseCors("CorsPolicy");
app.UseRouting();
app.UseAuthentication(); // vazna stvar! 
app.UseAuthorization();

app.MapControllers();

app.Run();
