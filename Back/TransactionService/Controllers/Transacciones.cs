using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TransactionService.Entities;
using TransactionService.External;
using TransactionService.Infra;

namespace TransactionService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransaccionesController : ControllerBase
    {
        private const int MaxPageSize = 100;

        private readonly TransactionDbContext _db;
        private readonly IProducto _producto;

        public TransaccionesController(TransactionDbContext db, IProducto producto)
        {
            _db = db;
            _producto = producto;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaccion>>> GetAll(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            pageNumber = Math.Max(pageNumber, 1);
            pageSize = Math.Clamp(pageSize, 1, MaxPageSize);

            var totalItems = await _db.Transacciones.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var items = await _db.Transacciones
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
            var tx = await _db.Transacciones
                              .AsNoTracking()
                              .FirstOrDefaultAsync(t => t.Id == id);

            return tx is null ? NotFound() : Ok(tx);
        }

        [HttpPost]
        public async Task<ActionResult<Transaccion>> Create(Transaccion dto)
        {
            var stockActual = _producto.ObtenerStockSync(dto.ProductoId);
            if (stockActual is null)
                return NotFound($"Producto {dto.ProductoId} no existe en el servicio de Productos.");

            if (dto.Cantidad <= 0)
                return BadRequest("La cantidad debe ser mayor que cero.");

            int nuevoStock;
            switch (dto.TipoTransaccion?.ToUpperInvariant())
            {
                case "VENTA":
                    if (dto.Cantidad > stockActual.Value)
                        return BadRequest("Error: la cantidad a transaccionar es mayor a la que existe.");
                    nuevoStock = stockActual.Value - dto.Cantidad;
                    break;

                case "COMPRA":
                    nuevoStock = stockActual.Value + dto.Cantidad;
                    break;

                default:
                    return BadRequest($"Tipo de transacción inválido: {dto.TipoTransaccion}");
            }

            var actualizado = _producto.ActualizarStockSync(dto.ProductoId, nuevoStock);
            if (!actualizado)
                return StatusCode(502, "Error al actualizar stock en el servicio de Productos.");

            _db.Transacciones.Add(dto);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Transaccion dto)
        {
            if (id != dto.Id)
                return BadRequest("ID de ruta y modelo no coinciden.");

            var exists = await _db.Transacciones.AnyAsync(t => t.Id == id);
            if (!exists) return NotFound();

            _db.Entry(dto).State = EntityState.Modified;

            try
            {
                await _db.SaveChangesAsync();
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
            var tx = await _db.Transacciones.FindAsync(id);
            if (tx is null) return NotFound();

            _db.Transacciones.Remove(tx);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
