using MatForum.IdentityServer.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddAuthentication(); // DI za potrebe autentifikacije  
builder.Services.ConfigurePersistance(builder.Configuration); // napokon! 
builder.Services.ConfigureIdentity(); // moramo da dodamo jos 1 poziv pre njega

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication(); // vazna stvar! 
app.UseAuthorization();

app.MapControllers();

app.Run();
