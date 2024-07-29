using Microsoft.EntityFrameworkCore;
using NDAccountManager.Models;

namespace NDAccountManager.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<AccountShare> AccountShares { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                entity.HasKey(e => e.UserId);
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.AzureAdId).HasColumnName("azure_ad_id");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Role).HasColumnName("role");
            });

            modelBuilder.Entity<Account>(entity =>
            {
                entity.ToTable("accounts");
                entity.HasKey(e => e.AccountId);
                entity.Property(e => e.AccountId).HasColumnName("account_id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.Platform).HasColumnName("platform");
                entity.Property(e => e.Username).HasColumnName("username");
                entity.Property(e => e.Password).HasColumnName("password");
                entity.Property(e => e.Notes).HasColumnName("notes");
                entity.Property(e => e.CategoryId).HasColumnName("category_id");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            });

            modelBuilder.Entity<AccountShare>(entity =>
            {
                entity.ToTable("account_shares");
                entity.HasKey(e => e.ShareId);
                entity.Property(e => e.ShareId).HasColumnName("share_id");
                entity.Property(e => e.AccountId).HasColumnName("account_id");
                entity.Property(e => e.SharedBy).HasColumnName("shared_by");
                entity.Property(e => e.SharedWith).HasColumnName("shared_with");
                entity.Property(e => e.ShareType).HasColumnName("share_type");
                entity.Property(e => e.ExpirationDate).HasColumnName("expiration_date");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("categories");
                entity.HasKey(e => e.CategoryId);
                entity.Property(e => e.CategoryId).HasColumnName("category_id");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            });
        }
    }
}
