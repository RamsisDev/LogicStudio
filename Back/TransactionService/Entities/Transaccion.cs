using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransactionService.Entities
{
    public class Transaccion
    {
        [Key]
        public int Id { get; set; }
        public int ProductoId { get; set; }
        [Required]
        public DateTime Fecha { get; set; } = default!;

        [MaxLength(500)]
        [Required]
        public string TipoTransaccion { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        [Required]
        public decimal PrecioTotal { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        [Required]
        public decimal PrecioUnitario { get; set; }
        public string? Detalle { get; set; }
        [Required]
        public int Cantidad { get; set; }   

    }
    
}
