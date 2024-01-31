using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PartyRentingPlatform.Domain.Entities;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using PartyRentingPlatform.Crosscutting.Constants;

namespace PartyRentingPlatform.Configuration;

public static class IdentityConfiguration
{
    public static IApplicationBuilder UseApplicationIdentity(this IApplicationBuilder builder)
    {
        using (var scope = builder.ApplicationServices.CreateScope())
        {
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<Role>>();

            SeedRoles(roleManager).Wait();
            SeedUsers(userManager).Wait();
            SeedUserRoles(userManager).Wait();
        }

        return builder;
    }


    private static IEnumerable<Role> Roles()
    {
        return new List<Role>
        {
            new Role {Id = "role_admin", Name = RolesConstants.ADMIN},
            new Role {Id = "role_user",Name = RolesConstants.USER},
            new Role {Id = "role_host", Name = RolesConstants.HOST}
        };
    }

    private static IEnumerable<User> Users()
    {
        return new List<User>
        {
            new User
            {
                Id = "user-2",
                UserName = "admin",
                PasswordHash = "$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC",
                FirstName = "admin",
                LastName = "Administrator",
                Email = "admin@localhost",
                Activated = true,
                LangKey = "en"
            },
        };
    }

    private static IDictionary<string, string[]> UserRoles()
    {
        return new Dictionary<string, string[]>
        {
            { "user-2", new[] {RolesConstants.ADMIN, RolesConstants.HOST, RolesConstants.USER}},
        };
    }

    private static async Task SeedRoles(RoleManager<Role> roleManager)
    {
        foreach (var role in Roles())
        {
            var dbRole = await roleManager.FindByNameAsync(role.Name);
            if (dbRole == null)
            {
                try
                {
                    await roleManager.CreateAsync(role);
                }
                catch (Exception e)
                {
                    Log.ForContext(typeof(IdentityConfiguration)).Warning(e,
                        "Tests are running in parallel, take care of database race conditions");

                    await roleManager.CreateAsync(role);
                }
            }
            else
            {
                await roleManager.UpdateAsync(dbRole);
            }
        }
    }

    private static async Task SeedUsers(UserManager<User> userManager)
    {
        foreach (var user in Users())
        {
            var dbUser = await userManager.FindByIdAsync(user.Id);
            if (dbUser == null)
            {
                try
                {
                    await userManager.CreateAsync(user);
                }
                catch (Exception e)
                {
                    Log.ForContext(typeof(IdentityConfiguration)).Warning(e,
                        "Tests are running in parallel, take care of database race conditions");

                    await userManager.CreateAsync(user);
                }
            }
            else
            {
                await userManager.UpdateAsync(dbUser);
            }
        }
    }

    private static async Task SeedUserRoles(UserManager<User> userManager)
    {
        foreach (var (id, roles) in UserRoles())
        {
            try
            {
                var user = await userManager.FindByIdAsync(id);
                await userManager.AddToRolesAsync(user, roles);
            }
            catch (Exception e)
            {
                Log.ForContext(typeof(IdentityConfiguration)).Warning(e,
                    "Tests are running in parallel, take care of database race conditions");

                var user = await userManager.FindByIdAsync(id);
                await userManager.AddToRolesAsync(user, roles);
            }
        }
    }
}
