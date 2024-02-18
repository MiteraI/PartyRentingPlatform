using PartyRentingPlatform.Domain.Entities;
using PartyRentingPlatform.Domain.Entities.Interfaces;
using PartyRentingPlatform.Crosscutting.Enums;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace PartyRentingPlatform.Infrastructure.Data
{
    public class ApplicationDatabaseContext : IdentityDbContext<
        User, Role, string,
        IdentityUserClaim<string>,
        UserRole,
        IdentityUserLogin<string>,
        IdentityRoleClaim<string>,
        IdentityUserToken<string>
    >
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ApplicationDatabaseContext(DbContextOptions<ApplicationDatabaseContext> options, IHttpContextAccessor httpContextAccessor) : base(options)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public DbSet<Room> Rooms { get; set; }
        public DbSet<RoomImage> RoomImages { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Promotion> Promotions { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<BookingDetails> BookingDetails { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Wallet> Wallets { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Rename AspNet default tables
            builder.Entity<User>().ToTable("Users");
            builder.Entity<Role>().ToTable("Roles");
            builder.Entity<UserRole>().ToTable("UserRoles");
            builder.Entity<IdentityUserClaim<string>>().ToTable("UserClaims");
            builder.Entity<IdentityUserLogin<string>>().ToTable("UserLogins");
            builder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaims");
            builder.Entity<IdentityUserToken<string>>().ToTable("UserTokens");

            builder.Entity<UserRole>(userRole =>
            {
                userRole.HasKey(ur => new { ur.UserId, ur.RoleId });

                userRole.HasOne(ur => ur.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();

                userRole.HasOne(ur => ur.User)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired();
            });

            builder.Entity<User>()
                .HasMany(e => e.UserRoles)
                .WithOne(ur => ur.User) //Need to not generate shadow key
                .HasForeignKey(e => e.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Room>()
                .HasMany(x => x.Promotions)
                .WithMany(x => x.Rooms)
                .UsingEntity<Dictionary<string, object>>(
                    "RoomsPromotions",
                    x => x.HasOne<Promotion>().WithMany(),
                    x => x.HasOne<Room>().WithMany());

            builder.Entity<Room>()
                .HasMany(x => x.Services)
                .WithMany(x => x.Rooms)
                .UsingEntity<Dictionary<string, object>>(
                    "RoomsServices",
                    x => x.HasOne<Service>().WithMany(),
                    x => x.HasOne<Room>().WithMany());

            builder.Entity<Notification>()
                .Property(e => e.Enum)
                .HasConversion<string>();
        }

        /// <summary>
        /// SaveChangesAsync with entities audit
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            var entries = ChangeTracker
              .Entries()
              .Where(e => e.Entity is IAuditedEntityBase && (
                  e.State == EntityState.Added
                  || e.State == EntityState.Modified));

            string modifiedOrCreatedBy = _httpContextAccessor?.HttpContext?.User?.Identity?.Name ?? "System";

            foreach (var entityEntry in entries)
            {
                if (entityEntry.State == EntityState.Added)
                {
                    ((IAuditedEntityBase)entityEntry.Entity).CreatedDate = DateTime.Now;
                    ((IAuditedEntityBase)entityEntry.Entity).CreatedBy = modifiedOrCreatedBy;
                }
                else
                {
                    Entry((IAuditedEntityBase)entityEntry.Entity).Property(p => p.CreatedDate).IsModified = false;
                    Entry((IAuditedEntityBase)entityEntry.Entity).Property(p => p.CreatedBy).IsModified = false;
                }
              ((IAuditedEntityBase)entityEntry.Entity).LastModifiedDate = DateTime.Now;
                ((IAuditedEntityBase)entityEntry.Entity).LastModifiedBy = modifiedOrCreatedBy;
            }
            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}
