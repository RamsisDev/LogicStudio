using System.ComponentModel.DataAnnotations;

namespace ProductService.Entities
{
    public class Categoria
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(50)]
        public string Nombre { get; set; } = default!;

        [MaxLength(250)]
        public string? Descripcion { get; set; }

    }
}
