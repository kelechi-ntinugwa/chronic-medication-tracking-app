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
    public string? InteractionsWarning { get; set; }
    public int RefillsRemaining { get; set; } = 0;
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

public class AdherenceLog
{
    [Key]
    public int Id { get; set; }

    public int PatientId { get; set; }
    [ForeignKey("PatientId")]
    public PatientProfile Patient { get; set; } = null!;

    public int PrescriptionId { get; set; }
    [ForeignKey("PrescriptionId")]
    public Prescription Prescription { get; set; } = null!;

    public DateTime ScheduledTime { get; set; }
    public DateTime? TakenTime { get; set; }
    public string Status { get; set; } = "Pending"; // Taken, Missed, Skipped, Pending
    public string? Notes { get; set; }
}

public class RefillRequest
{
    [Key]
    public int Id { get; set; }

    public int PatientId { get; set; }
    [ForeignKey("PatientId")]
    public PatientProfile Patient { get; set; } = null!;

    public int PrescriptionId { get; set; }
    [ForeignKey("PrescriptionId")]
    public Prescription Prescription { get; set; } = null!;

    public string Status { get; set; } = "Requested"; // Requested, Approved, Denied, Fulfilled
    public DateTime RequestedDate { get; set; }
}

public class SymptomLog
{
    [Key]
    public int Id { get; set; }

    public int PatientId { get; set; }
    [ForeignKey("PatientId")]
    public PatientProfile Patient { get; set; } = null!;

    public DateTime Date { get; set; }
    public required string Symptom { get; set; }
    public int Severity { get; set; } // e.g., 1-10
    public string? Notes { get; set; }
}

public class VitalsLog
{
    [Key]
    public int Id { get; set; }

    public int PatientId { get; set; }
    [ForeignKey("PatientId")]
    public PatientProfile Patient { get; set; } = null!;

    public DateTime Date { get; set; }
    public string? BloodPressure { get; set; } // e.g., 120/80
    public int? HeartRate { get; set; }
    public decimal? BloodSugar { get; set; }
    public decimal? Weight { get; set; }
}

public class DependentProfile
{
    [Key]
    public int Id { get; set; }

    public int CaregiverId { get; set; }
    [ForeignKey("CaregiverId")]
    public PatientProfile Caregiver { get; set; } = null!;

    public required string Name { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Relationship { get; set; }
}

public class EmergencyProfile
{
    [Key]
    public int Id { get; set; }

    public int PatientId { get; set; }
    [ForeignKey("PatientId")]
    public PatientProfile Patient { get; set; } = null!;

    public string? BloodType { get; set; }
    public string? Allergies { get; set; }
    public string? EmergencyContacts { get; set; } // Can be JSON string or simple text
    public string? PrimaryPhysician { get; set; }
}

public class InsuranceCard
{
    [Key]
    public int Id { get; set; }

    public int PatientId { get; set; }
    [ForeignKey("PatientId")]
    public PatientProfile Patient { get; set; } = null!;

    public required string ProviderName { get; set; }
    public string? PolicyNumber { get; set; }
    public string? GroupNumber { get; set; }
    public string? ImageUrl { get; set; }
}
