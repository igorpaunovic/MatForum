using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MatForum.IdentityServer.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "IdentityRole",
                keyColumn: "Id",
                keyValue: "1189fc73-88e4-48b9-bafb-ea948dcbedec");

            migrationBuilder.DeleteData(
                table: "IdentityRole",
                keyColumn: "Id",
                keyValue: "2e031934-6ed4-4104-ad0b-78b16568095f");

            migrationBuilder.InsertData(
                table: "IdentityRole",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "2aadac25-b86a-443f-abc6-f99439824e6a", null, "Admin", "ADMIN" },
                    { "c282c26b-37f8-4f5b-b06f-df6616f0e532", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "IdentityRole",
                keyColumn: "Id",
                keyValue: "2aadac25-b86a-443f-abc6-f99439824e6a");

            migrationBuilder.DeleteData(
                table: "IdentityRole",
                keyColumn: "Id",
                keyValue: "c282c26b-37f8-4f5b-b06f-df6616f0e532");

            migrationBuilder.InsertData(
                table: "IdentityRole",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1189fc73-88e4-48b9-bafb-ea948dcbedec", null, "Admin", "ADMIN" },
                    { "2e031934-6ed4-4104-ad0b-78b16568095f", null, "User", "USER" }
                });
        }
    }
}
