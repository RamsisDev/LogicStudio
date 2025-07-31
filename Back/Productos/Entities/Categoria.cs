using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ProductService.Entities
{
    public class Categoria
    {
        [Key]
        [JsonPropertyName("id")]
        public int Id { get; set; }
        [JsonPropertyName("nombre")]
        [Required, MaxLength(50)]
        public string Nombre { get; set; } = default!;
        [JsonPropertyName("descripcion")]
        [MaxLength(250)]
        public string? Descripcion { get; set; }

    }
}
