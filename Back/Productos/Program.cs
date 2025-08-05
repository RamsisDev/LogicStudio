using Microsoft.EntityFrameworkCore;
using ProductService.Infra;


var builder = WebApplication.CreateBuilder(args);

var connectionString =
    "Host=dpg-d291a61r0fns73eujr2g-a.oregon-postgres.render.com;" +
    "Port=5432;" +
    "Database=testdb_82sy;" +
    "Username=testdb_82sy_user;" +
    "Password=6GJ5Zqxca0a39QT1UXuD6jwBJuEEoB0p;" +
    "Ssl Mode=Require;" +
    "Trust Server Certificate=true"

// —— DbContext —— 
builder.Services.AddDbContext<ProductDbContext>(options =>
    options.UseNpgsql(connectionString));

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("LocalAngular",
        p => p.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



var app = builder.Build();
app.UseCors("LocalAngular");
// Configure the HTTP request pipeline.

    app.UseSwagger();
    app.UseSwaggerUI();


app.UseAuthorization();

app.MapControllers();

app.Run();
