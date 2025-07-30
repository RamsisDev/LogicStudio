using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TransactionService.Entities;
using TransactionService.Infra;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TransactionService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Transacciones(TransactionDbContext db) : ControllerBase
    {
        private const int MaxPageSize = 100;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaccion>>> GetAll(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            pageNumber = Math.Max(pageNumber, 1);
            pageSize = Math.Clamp(pageSize, 1, MaxPageSize);

            var totalItems = await db.Transacciones.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var items = await db.Transacciones
                                .AsNoTracking()
                                .OrderByDescending(t => t.Fecha)
                                .Skip((pageNumber - 1) * pageSize)
                                .Take(pageSize)
                                .ToListAsync();

            Response.Headers["X-Total-Count"] = totalItems.ToString();
            Response.Headers["X-Total-Pages"] = totalPages.ToString();
            Response.Headers["X-Page-Number"] = pageNumber.ToString();
            Response.Headers["X-Page-Size"] = pageSize.ToString();

            return Ok(items);
        }

        
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Transaccion>> GetById(int id)
        {
            var tx = await db.Transacciones
                             .AsNoTracking()
                             .FirstOrDefaultAsync(t => t.Id == id);

            return tx is null ? NotFound() : Ok(tx);
        }

        [HttpPost]
        public async Task<ActionResult<Transaccion>> Create(Transaccion dto)
        {
            db.Transacciones.Add(dto);
            await db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById),
                                   new { id = dto.Id },
                                   dto);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Transaccion dto)
        {
            if (id != dto.Id) return BadRequest("ID de ruta y modelo no coinciden.");

            var exists = await db.Transacciones.AnyAsync(t => t.Id == id);
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

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var tx = await db.Transacciones.FindAsync(id);
            if (tx is null) return NotFound();

            db.Transacciones.Remove(tx);
            await db.SaveChangesAsync();

            return NoContent();
        }
    }
}
