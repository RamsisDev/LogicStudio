using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductService.Entities;
using ProductService.Infra;

namespace ProductService.Controllers
{
    [ApiController]
    [Route("[controller]")]          // → /Producto
    public class ProductoController(ProductDbContext db) : ControllerBase
    {
        private const int MaxPageSize = 100;

        // --------------------------------------------------------------------
        // GET /Producto?pageNumber=1&pageSize=10
        // --------------------------------------------------------------------
        [HttpGet("Productos")]
        public async Task<ActionResult<IEnumerable<Product>>> GetAll(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            pageNumber = Math.Max(pageNumber, 1);
            pageSize = Math.Clamp(pageSize, 1, MaxPageSize);

            var totalItems = await db.Products.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var items = await db.Products
                                .AsNoTracking()
                                .Skip((pageNumber - 1) * pageSize)
                                .Take(pageSize)
                                .ToListAsync();

            Response.Headers["X-Total-Count"] = totalItems.ToString();
            Response.Headers["X-Total-Pages"] = totalPages.ToString();
            Response.Headers["X-Page-Number"] = pageNumber.ToString();
            Response.Headers["X-Page-Size"] = pageSize.ToString();

            return Ok(items);
        }

        // --------------------------------------------------------------------
        // GET /Producto/{id}
        // --------------------------------------------------------------------
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Product>> GetById(int id)
        {
            var product = await db.Products
                                  .AsNoTracking()
                                  .FirstOrDefaultAsync(p => p.Id == id);

            return product is null ? NotFound() : Ok(product);
        }
        [HttpGet("/Categorias")]
        public async Task<ActionResult<Categoria[]>> GetCategorias()
        {
            var Categorias = db.Categories.ToList();

            return Categorias is null ? NotFound() : Ok(Categorias);
        }

        // --------------------------------------------------------------------
        // POST /Producto
        // --------------------------------------------------------------------
        [HttpPost]
        public async Task<ActionResult<Product>> Create(Product dto)
        {
            db.Products.Add(dto);
            await db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById),
                                   new { id = dto.Id },
                                   dto);
        }

        // --------------------------------------------------------------------
        // PUT /Producto/{id}
        // --------------------------------------------------------------------
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Product dto)
        {
            if (id != dto.Id) return BadRequest("ID de ruta y modelo no coinciden.");

            var exists = await db.Products.AnyAsync(p => p.Id == id);
            if (!exists) return NotFound();

            db.Entry(dto).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict("Conflicto de concurrencia.");
            }

            return Ok();
        }

        [HttpPut("/ModificarStock/{idProducto}/{NuevoStock}")]
        public async Task<IActionResult> ActualizarStock(int idProducto, int NuevoStock)
        {
            
            var product = await db.Products
                                  .AsNoTracking()
                                  .FirstOrDefaultAsync(p => p.Id == idProducto);
            if (product is null)
                return NotFound();     

            if (NuevoStock > product.Stock && product.Stock != 0)
                return BadRequest("La cantidad supera la cantidad actual"); 

            product.Stock = NuevoStock;
            db.Entry(product).State = EntityState.Modified;
            await db.SaveChangesAsync();
            return Ok();
        }

        // --------------------------------------------------------------------
        // DELETE /Producto/{id}
        // --------------------------------------------------------------------
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await db.Products.FindAsync(id);
            if (product is null) return NotFound();

            db.Products.Remove(product);
            await db.SaveChangesAsync();

            return Ok();
        }
    }
}
