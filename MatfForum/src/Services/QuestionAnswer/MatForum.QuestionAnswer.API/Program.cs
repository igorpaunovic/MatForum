using MatForum.QuestionAnswer.Application.Interfaces;
using MatForum.QuestionAnswer.Application.Services;
using MatForum.QuestionAnswer.Infrastructure.Repositories;
using MatForum.QuestionAnswer.Infrastructure.Data;
using MatForum.QuestionAnswer.Infrastructure.Services;
using MatForum.ForumQuestion.GRPC;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

// Enable HTTP/2 without TLS (h2c) for gRPC client in Docker
AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);

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

// No JWT validation needed - API Gateway handles authentication
// Services trust internal requests from the gateway

// Register application services and repositories
builder.Services.AddScoped<IAnswerRepository, AnswerRepository>();
builder.Services.AddScoped<IAnswerService, AnswerService>();

// Register the HttpClient for the UserService
builder.Services.AddHttpClient<IUserService, MatForum.QuestionAnswer.Infrastructure.Clients.UserServiceHttpClient>(client =>
{
    client.BaseAddress = new Uri("http://user-service/");
});

// Register gRPC client for QuestionValidator (pointing to dedicated gRPC service with HTTPS)
var isDevelopment = builder.Environment.IsDevelopment();
builder.Services.AddGrpcClient<QuestionValidationService.QuestionValidationServiceClient>(options =>
{
    options.Address = new Uri("https://question-grpc-service");
})
.ConfigurePrimaryHttpMessageHandler(() =>
{
    var handler = new HttpClientHandler();
    // Accept self-signed certificates in development
    if (isDevelopment)
    {
        handler.ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
    }
    return handler;
});

// Register QuestionValidator
builder.Services.AddScoped<IQuestionValidator, QuestionValidator>();

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

// app.UseHttpsRedirection();
// app.UseCors(CorsPolicy); // Uncomment if CORS is needed

// No authentication middleware needed - API Gateway handles it
app.MapControllers();
app.Run();
