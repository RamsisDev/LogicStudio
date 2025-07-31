using Microsoft.EntityFrameworkCore;
using ProductService.Infra;

var builder = WebApplication.CreateBuilder(args);
var cfg = builder.Configuration;

// Nombre de tu base de datos en SQL Server:
var dbName = "INVENTORYDB";

// Construye el connection string para SQL Server con autenticación de Windows
var connectionString = $"Server=localhost;Database={dbName};Trusted_Connection=True;TrustServerCertificate=True;";

// Agrega el DbContext
builder.Services.AddDbContext<ProductDbContext>(options =>
    options.UseSqlServer(connectionString));

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
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
