using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class AddComprehensiveFeatures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "InteractionsWarning",
                table: "Prescriptions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RefillsRemaining",
                table: "Prescriptions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "AdherenceLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    PrescriptionId = table.Column<int>(type: "integer", nullable: false),
                    ScheduledTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TakenTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdherenceLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AdherenceLogs_PatientProfiles_PatientId",
                        column: x => x.PatientId,
                        principalTable: "PatientProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AdherenceLogs_Prescriptions_PrescriptionId",
                        column: x => x.PrescriptionId,
                        principalTable: "Prescriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DependentProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CaregiverId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Relationship = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DependentProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DependentProfiles_PatientProfiles_CaregiverId",
                        column: x => x.CaregiverId,
                        principalTable: "PatientProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EmergencyProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    BloodType = table.Column<string>(type: "text", nullable: true),
                    Allergies = table.Column<string>(type: "text", nullable: true),
                    EmergencyContacts = table.Column<string>(type: "text", nullable: true),
                    PrimaryPhysician = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmergencyProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmergencyProfiles_PatientProfiles_PatientId",
                        column: x => x.PatientId,
                        principalTable: "PatientProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InsuranceCards",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    ProviderName = table.Column<string>(type: "text", nullable: false),
                    PolicyNumber = table.Column<string>(type: "text", nullable: true),
                    GroupNumber = table.Column<string>(type: "text", nullable: true),
                    ImageUrl = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InsuranceCards", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InsuranceCards_PatientProfiles_PatientId",
                        column: x => x.PatientId,
                        principalTable: "PatientProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RefillRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    PrescriptionId = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    RequestedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefillRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RefillRequests_PatientProfiles_PatientId",
                        column: x => x.PatientId,
                        principalTable: "PatientProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RefillRequests_Prescriptions_PrescriptionId",
                        column: x => x.PrescriptionId,
                        principalTable: "Prescriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SymptomLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Symptom = table.Column<string>(type: "text", nullable: false),
                    Severity = table.Column<int>(type: "integer", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SymptomLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SymptomLogs_PatientProfiles_PatientId",
                        column: x => x.PatientId,
                        principalTable: "PatientProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VitalsLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    BloodPressure = table.Column<string>(type: "text", nullable: true),
                    HeartRate = table.Column<int>(type: "integer", nullable: true),
                    BloodSugar = table.Column<decimal>(type: "numeric", nullable: true),
                    Weight = table.Column<decimal>(type: "numeric", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VitalsLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VitalsLogs_PatientProfiles_PatientId",
                        column: x => x.PatientId,
                        principalTable: "PatientProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdherenceLogs_PatientId",
                table: "AdherenceLogs",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_AdherenceLogs_PrescriptionId",
                table: "AdherenceLogs",
                column: "PrescriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_DependentProfiles_CaregiverId",
                table: "DependentProfiles",
                column: "CaregiverId");

            migrationBuilder.CreateIndex(
                name: "IX_EmergencyProfiles_PatientId",
                table: "EmergencyProfiles",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_InsuranceCards_PatientId",
                table: "InsuranceCards",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_RefillRequests_PatientId",
                table: "RefillRequests",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_RefillRequests_PrescriptionId",
                table: "RefillRequests",
                column: "PrescriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_SymptomLogs_PatientId",
                table: "SymptomLogs",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_VitalsLogs_PatientId",
                table: "VitalsLogs",
                column: "PatientId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdherenceLogs");

            migrationBuilder.DropTable(
                name: "DependentProfiles");

            migrationBuilder.DropTable(
                name: "EmergencyProfiles");

            migrationBuilder.DropTable(
                name: "InsuranceCards");

            migrationBuilder.DropTable(
                name: "RefillRequests");

            migrationBuilder.DropTable(
                name: "SymptomLogs");

            migrationBuilder.DropTable(
                name: "VitalsLogs");

            migrationBuilder.DropColumn(
                name: "InteractionsWarning",
                table: "Prescriptions");

            migrationBuilder.DropColumn(
                name: "RefillsRemaining",
                table: "Prescriptions");
        }
    }
}
