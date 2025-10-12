
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Yarp.ReverseProxy.Transforms;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add JWT Authentication to API Gateway
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "Webstore Identity",
            ValidAudience = "Webstore",
            IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("MyVerySecretSecretSecretMessage1")),
            NameClaimType = ClaimTypes.NameIdentifier,
            RoleClaimType = ClaimTypes.Role
        };
    });

// Add authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("authenticated", policy =>
        policy.RequireAuthenticatedUser());
    options.FallbackPolicy = null;
});

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
     .AddTransforms(builderContext =>
     {
         // Add custom transform to extract JWT claims and add them as headers
         builderContext.AddRequestTransform(async transformContext =>
         {
             // Extract user ID from JWT claims
             var userId = transformContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                       ?? transformContext.HttpContext.User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;

             var userName = transformContext.HttpContext.User.FindFirst(ClaimTypes.Name)?.Value
                         ?? transformContext.HttpContext.User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")?.Value;

             var userEmail = transformContext.HttpContext.User.FindFirst(ClaimTypes.Email)?.Value
                          ?? transformContext.HttpContext.User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;

             // Add headers to downstream request
             if (!string.IsNullOrEmpty(userId))
             {
                 transformContext.ProxyRequest.Headers.Add("X-User-Id", userId);
             }

             if (!string.IsNullOrEmpty(userName))
             {
                 transformContext.ProxyRequest.Headers.Add("X-User-Name", userName);
             }

             if (!string.IsNullOrEmpty(userEmail))
             {
                 transformContext.ProxyRequest.Headers.Add("X-User-Email", userEmail);
             }

             await Task.CompletedTask;
         });
     });


// CORS at the gateway (allow Vite dev)
builder.Services.AddCors(o =>
{
    o.AddDefaultPolicy(p => p
        .WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseCors();

// Add authentication and authorization middleware
app.UseAuthentication();
app.UseAuthorization();

app.MapReverseProxy();

app.Run();
