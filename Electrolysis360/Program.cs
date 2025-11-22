using Electrolysis360.Hub;
using Electrolysis360.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

// Для .NET 9 используем AddOpenApi вместо AddSwaggerGen
builder.Services.AddOpenApi();
builder.Services.AddSignalR();
// Register our custom services
builder.Services.AddScoped<IElectrolysisService, ElectrolysisService>();
builder.Services.AddSingleton<IExperimentLogger, ExperimentLogger>();

// CORS configuration for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",    // React development server
                "http://127.0.0.1:3000",    // Alternative localhost
                "https://localhost:3000",   // HTTPS development
                "http://localhost:3001",    // Alternative port
                "http://localhost:5000",    // If serving React from different port
                "http://localhost:8080"     // Another common dev port
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); // If you need cookies/auth
    });
    
    // Additional policy for production
    options.AddPolicy("AllowProduction", policy =>
    {
        policy.WithOrigins(
                "https://yourapp.com",      // Your production domain
                "https://www.yourapp.com"   // WWW subdomain
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Add logging
builder.Services.AddLogging(loggingBuilder =>
{
    loggingBuilder.AddConsole();
    loggingBuilder.AddDebug();
});

// Configure JSON options for better frontend compatibility
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = null; // Use PascalCase for C#
    options.SerializerOptions.WriteIndented = true; // Pretty print for debugging
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // В .NET 9 используем MapOpenApi и UseSwaggerUI
    app.MapOpenApi();
    
    // Swagger UI endpoint
    if (app.Environment.IsDevelopment())
    {
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/openapi/v1.json", "Electrolysis 360 API v1");
        });
    }
    
    // Development specific CORS
    app.UseCors("AllowReactApp");
}
else
{
    // Production CORS
    app.UseCors("AllowProduction");
    
    // Global error handling in production
    app.UseExceptionHandler("/error");
    
    // HSTS for production
    app.UseHsts();
}

// Enable HTTPS redirection in production
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseRouting();

// Authentication & Authorization (if needed in future)
// app.UseAuthentication();
// app.UseAuthorization();
app.MapHub<SignalRHub>("/electrolysisHub");
app.MapControllers();

// Global error handling endpoint
app.Map("/error", () => Results.Problem("An error occurred."));

// Health check endpoint
app.MapGet("/health", () => new { status = "Healthy", timestamp = DateTime.UtcNow });

// API information endpoint
app.MapGet("/api", () => 
{
    return Results.Json(new 
    {
        message = "Electrolysis 360 API Server",
        version = "1.0.0",
        status = "Running",
        timestamp = DateTime.UtcNow,
        environment = app.Environment.EnvironmentName,
        endpoints = new 
        {
            openapi = "/openapi/v1.json",
            swagger_ui = "/swagger",
            health = "/health",
            simulation = "/api/simulation"
        }
    });
});

// Root endpoint
app.MapGet("/", () => 
{
    return Results.Json(new 
    {
        message = "Welcome to Electrolysis 360 API",
        documentation = app.Environment.IsDevelopment() ? "Available at /swagger" : "Not available in production",
        version = "1.0.0"
    });
});

// Log startup information
var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("Electrolysis 360 API started successfully");
logger.LogInformation("Environment: {Environment}", app.Environment.EnvironmentName);

if (app.Environment.IsDevelopment())
{
    logger.LogInformation("OpenAPI available at: http://localhost:5000/openapi/v1.json");
    logger.LogInformation("Swagger UI available at: http://localhost:5000/swagger");
}

try
{
    app.Run();
    logger.LogInformation("Electrolysis 360 API stopped gracefully");
}
catch (Exception ex)
{
    logger.LogCritical(ex, "Electrolysis 360 API terminated unexpectedly");
    throw;
}