using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MatForum.ForumQuestion.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddIsEditedField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsEdited",
                table: "Questions",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsEdited",
                table: "Questions");
        }
    }
}
