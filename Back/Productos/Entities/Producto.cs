using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ProductService.Entities
{
    public class Product
    {
        [Key]
        [JsonPropertyName("id")]
        public int Id { get; set; }
        [JsonPropertyName("nombre")]
        [Required, MaxLength(100)]
        public string Nombre { get; set; } = default!;
        [JsonPropertyName("descripcion")]
        [MaxLength(500)]
        public string? Descripcion { get; set; }
        [JsonPropertyName("precio")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Precio { get; set; }

        /// <summary>Cantidad disponible en inventario.</summary>
        [JsonPropertyName("stock")]
        public int Stock { get; set; }
    }
}
