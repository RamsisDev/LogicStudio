using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;
using TransactionService.Entities;

namespace TransactionService.Infra
{
    public class TransactionDbContext : DbContext
    {
        public TransactionDbContext(DbContextOptions<TransactionDbContext> options)
            : base(options) { }

        // ---------- DbSets ----------
        public DbSet<Transaccion> Transacciones => Set<Transaccion>();

        protected override void OnModelCreating(ModelBuilder b)
        {
            // ----- Transaccion -----
            b.Entity<Transaccion>(cfg =>
            {
                cfg.ToTable("TRANSACCIONES");
                cfg.HasKey(t => t.Id);

                cfg.Property(t => t.Id).HasColumnName("ID");
                cfg.Property(t => t.Fecha).HasColumnName("FECHA").IsRequired();
                cfg.Property(t => t.TipoTransaccion).HasColumnName("TIPO_TRANSACCION").HasMaxLength(50).IsRequired();
                cfg.Property(t => t.Detalle).HasColumnName("DETALLE").HasMaxLength(1000);

                cfg.Property(t => t.ProductoId).HasColumnName("PRODUCTO_ID").IsRequired();
                cfg.Property(t => t.Cantidad).HasColumnName("CANTIDAD").IsRequired();
                cfg.Property(t => t.PrecioUnitario).HasColumnName("PRECIO_UNITARIO").HasColumnType("numeric(18,2)").IsRequired();
                cfg.Property(t => t.PrecioTotal).HasColumnName("PRECIO_TOTAL").HasColumnType("numeric(18,2)").IsRequired();
            });

            base.OnModelCreating(b);
        }
    }
}
