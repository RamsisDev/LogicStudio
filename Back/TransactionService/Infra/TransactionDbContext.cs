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
                cfg.ToTable("Transacciones");
                cfg.HasKey(t => t.Id);

                cfg.Property(t => t.Fecha)
                   .IsRequired();

                cfg.Property(t => t.TipoTransaccion)
                   .HasMaxLength(500)
                   .IsRequired();

                cfg.Property(t => t.ProductoId)
                   .IsRequired();

                cfg.Property(t => t.Cantidad)
                   .IsRequired();

                cfg.Property(t => t.PrecioUnitario)
                   .HasColumnType("decimal(18,2)")
                   .IsRequired();

                cfg.Property(t => t.PrecioTotal)
                   .HasColumnType("decimal(18,2)")
                   .IsRequired();

                cfg.Property(t => t.Detalle)
                   .HasMaxLength(1000);    // opcional, ajusta si necesitas más
            });

            base.OnModelCreating(b);
        }
    }
}
