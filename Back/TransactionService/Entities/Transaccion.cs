using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace TransactionService.Entities
{
    public class Transaccion
    {
        [Key]
        [JsonPropertyName("id")]
        public int Id { get; set; }
        [JsonPropertyName("productoId")]
        public int ProductoId { get; set; }
        [Required]
        [JsonPropertyName("fecha")]
        public DateTime Fecha { get; set; } = default!;
        [JsonPropertyName("tipoTransaccion")]
        [MaxLength(500)]
        [Required]
        public string TipoTransaccion { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        [Required]
        [JsonPropertyName("precioTotal")]
        public decimal PrecioTotal { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        [Required]
        [JsonPropertyName("precioUnitario")]
        public decimal PrecioUnitario { get; set; }
        [JsonPropertyName("detalle")]
        public string? Detalle { get; set; }
        [Required]
        [JsonPropertyName("Cantidad")]
        public int Cantidad { get; set; }   

    }
    
}
