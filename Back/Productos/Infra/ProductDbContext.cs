using Microsoft.EntityFrameworkCore;
using ProductService.Entities;

namespace ProductService.Infra
{

    public class ProductDbContext : DbContext
    {
        public ProductDbContext(DbContextOptions<ProductDbContext> options)
            : base(options) { }

        // ---------- DbSets ----------
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Categoria> Categories => Set<Categoria>();
        public DbSet<ProductoCategoria> ProductosCategorias => Set<ProductoCategoria>();

        protected override void OnModelCreating(ModelBuilder b)
        {
            // ----- Categoria -----
            b.Entity<Categoria>(cfg =>
            {
                cfg.ToTable("CATEGORIAS");
                cfg.HasKey(c => c.Id);

                cfg.Property(c => c.Nombre)
                   .HasMaxLength(50)
                   .IsRequired();

                cfg.Property(c => c.Descripcion)
                   .HasMaxLength(250);
            });

            // ----- Product -----
            b.Entity<Product>(cfg =>
            {
                cfg.ToTable("PRODUCTOS");
                cfg.HasKey(p => p.Id);

                cfg.Property(p => p.Nombre)
                   .HasMaxLength(100)
                   .IsRequired();

                cfg.Property(p => p.Descripcion)
                   .HasMaxLength(500);

                cfg.Property(p => p.Precio)
                   .HasColumnType("decimal(18,2)")
                   .IsRequired();

                cfg.Property(p => p.Stock)
                   .IsRequired();
            });

            // ----- ProductoCategoria (tabla puente M-N) -----
            b.Entity<ProductoCategoria>(cfg =>
            {
                cfg.ToTable("PRODUCTOCATEGORIA");

                cfg.HasKey(pc => pc.Id);  
                cfg.HasIndex(pc => new { pc.ProductoId, pc.CategoriaId })
                   .IsUnique();         

                cfg.Property(pc => pc.ProductoId)
                   .IsRequired();

                cfg.Property(pc => pc.CategoriaId)
                   .IsRequired();

                cfg.HasOne<Product>()
                   .WithMany()
                   .HasForeignKey(pc => pc.ProductoId)
                   .OnDelete(DeleteBehavior.Cascade);

                cfg.HasOne<Categoria>()
                   .WithMany()
                   .HasForeignKey(pc => pc.CategoriaId)
                   .OnDelete(DeleteBehavior.Cascade);
            });

            base.OnModelCreating(b);
        }
    }
}
