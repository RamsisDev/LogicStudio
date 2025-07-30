using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ProductService.Entities
{
    // Relación M-N (tabla puente)
    public class ProductoCategoria
    {
        [Key]
        public int Id { get; set; }        
        public int ProductoId { get; set; }
        public int CategoriaId { get; set; }
    }
}
