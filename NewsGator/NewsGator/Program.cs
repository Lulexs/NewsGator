using NewsGator.ApplicationLogic;
using NewsGator.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.AddEventSourceLogger();

builder.Services.AddControllers();

builder.Services.AddSingleton<IPlaywright>(await Playwright.CreateAsync());
builder.Services.AddSingleton<IBrowser>(serviceProvider =>
{
    var playwright = serviceProvider.GetRequiredService<IPlaywright>();

    return playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
    {
        Headless = true
    }).GetAwaiter().GetResult();
});
builder.Services.AddScoped<IPage>(serviceProvider =>
{
    var browser = serviceProvider.GetRequiredService<IBrowser>();

    return browser.NewPageAsync().GetAwaiter().GetResult();
});
builder.Services.AddScoped<AcquirePageService>();
builder.Services.AddScoped<NewsLogic>();

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("CORS", policy =>
    {
        policy.AllowCredentials()
              .AllowAnyHeader()
              .AllowAnyMethod()
              .WithOrigins("http://localhost:5173", "http://127.0.0.1:5173");
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseCors("CORS");

app.MapControllers();

app.Run();
