using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Models;

public class PatientProfile
{
    [Key]
    public int Id { get; set; }

    public required string UserId { get; set; }

    [ForeignKey("UserId")]
    public ApplicationUser User { get; set; } = null!;

    public DateTime? DateOfBirth { get; set; }
    public string? BloodType { get; set; }

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
    public ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();
}

public class ProviderProfile
{
    [Key]
    public int Id { get; set; }

    public required string UserId { get; set; }

    [ForeignKey("UserId")]
    public ApplicationUser User { get; set; } = null!;

    public string? Specialization { get; set; }
    public string? LicenseNumber { get; set; }

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
    public ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();
}

public class Appointment
{
    [Key]
    public int Id { get; set; }

    public int PatientId { get; set; }
    [ForeignKey("PatientId")]
    public PatientProfile Patient { get; set; } = null!;

    public int ProviderId { get; set; }
    [ForeignKey("ProviderId")]
    public ProviderProfile Provider { get; set; } = null!;

    public DateTime ScheduledTime { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Confirmed, Completed, Cancelled
    public string? VideoCallLink { get; set; } // Twilio or Daily.co link
}

public class Prescription
{
    [Key]
    public int Id { get; set; }

    public int PatientId { get; set; }
    [ForeignKey("PatientId")]
    public PatientProfile Patient { get; set; } = null!;

    public int ProviderId { get; set; }
    [ForeignKey("ProviderId")]
    public ProviderProfile Provider { get; set; } = null!;

    public required string MedicationName { get; set; }
    public string? Dosage { get; set; }
    public string? Instructions { get; set; }
    public string? PdfBlobUrl { get; set; }
}

public class MedicalRecord
{
    [Key]
    public int Id { get; set; }

    public int PatientId { get; set; }
    [ForeignKey("PatientId")]
    public PatientProfile Patient { get; set; } = null!;

    public int ProviderId { get; set; }
    [ForeignKey("ProviderId")]
    public ProviderProfile Provider { get; set; } = null!;

    public DateTime Date { get; set; }
    public required string Diagnosis { get; set; }

    // This field can be encrypted at the app-level before saving
    public string? EncryptedNotes { get; set; }
}
