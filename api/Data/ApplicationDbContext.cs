using Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<PatientProfile> PatientProfiles { get; set; }
    public DbSet<ProviderProfile> ProviderProfiles { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<Prescription> Prescriptions { get; set; }
    public DbSet<MedicalRecord> MedicalRecords { get; set; }
    public DbSet<AdherenceLog> AdherenceLogs { get; set; }
    public DbSet<RefillRequest> RefillRequests { get; set; }
    public DbSet<SymptomLog> SymptomLogs { get; set; }
    public DbSet<VitalsLog> VitalsLogs { get; set; }
    public DbSet<DependentProfile> DependentProfiles { get; set; }
    public DbSet<EmergencyProfile> EmergencyProfiles { get; set; }
    public DbSet<InsuranceCard> InsuranceCards { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
    }
}
