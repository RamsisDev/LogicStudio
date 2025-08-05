using Microsoft.EntityFrameworkCore;
using ProductService.Entities;

namespace ProductService.Infra
{

    public class ProductDbContext : DbContext
    {
        public ProductDbContext(DbContextOptions<ProductDbContext> options): base(options) { }

        // ---------- DbSets ----------
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Categoria> Categories => Set<Categoria>();
        public DbSet<ProductoCategoria> ProductosCategorias => Set<ProductoCategoria>();

        protected override void OnModelCreating(ModelBuilder b)
        {
            b.Entity<Categoria>(cfg =>
            {
                cfg.ToTable("CATEGORIAS");
                cfg.HasKey(c => c.Id);

                cfg.Property(c => c.Id).HasColumnName("ID");
                cfg.Property(c => c.Nombre).HasColumnName("NOMBRE").HasMaxLength(50).IsRequired();
                cfg.Property(c => c.Descripcion).HasColumnName("DESCRIPCION").HasMaxLength(250);
            });


            b.Entity<Product>(cfg =>
            {
                cfg.ToTable("PRODUCTOS");
                cfg.HasKey(p => p.Id);

                cfg.Property(p => p.Id).HasColumnName("ID");
                cfg.Property(p => p.Nombre).HasColumnName("NOMBRE").HasMaxLength(100).IsRequired();
                cfg.Property(p => p.Descripcion).HasColumnName("DESCRIPCION").HasMaxLength(500);
                cfg.Property(p => p.Precio).HasColumnName("PRECIO").HasColumnType("numeric(18,2)").IsRequired();
                cfg.Property(p => p.Stock).HasColumnName("STOCK").IsRequired();
            });


            b.Entity<ProductoCategoria>(cfg =>
            {
                cfg.ToTable("PRODUCTOCATEGORIA");
                cfg.HasKey(pc => pc.Id);

                cfg.Property(pc => pc.Id).HasColumnName("ID");
                cfg.Property(pc => pc.ProductoId).HasColumnName("PRODUCTO_ID").IsRequired();
                cfg.Property(pc => pc.CategoriaId).HasColumnName("CATEGORIA_ID").IsRequired();

                cfg.HasIndex(pc => new { pc.ProductoId, pc.CategoriaId }).IsUnique();

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
