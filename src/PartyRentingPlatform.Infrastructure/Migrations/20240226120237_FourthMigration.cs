using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PartyRentingPlatform.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FourthMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "service",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_service_UserId",
                table: "service",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_service_Users_UserId",
                table: "service",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_service_Users_UserId",
                table: "service");

            migrationBuilder.DropIndex(
                name: "IX_service_UserId",
                table: "service");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "service");
        }
    }
}
