using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ProductService.Entities
{
    // Relación M-N (tabla puente)
    public class ProductoCategoria
    {
        [Key]
        [JsonPropertyName("id")]
        public int Id { get; set; }
        [JsonPropertyName("productoId")]
        public int ProductoId { get; set; }
        [JsonPropertyName("categoriaId")]
        public int CategoriaId { get; set; }
    }
}
