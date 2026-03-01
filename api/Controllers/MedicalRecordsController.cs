using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MedicalRecordsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IDataProtector _protector;

    public MedicalRecordsController(ApplicationDbContext context, IDataProtectionProvider provider)
    {
        _context = context;
        // Setting up a specific protector for medical notes
        _protector = provider.CreateProtector("MedicalNotesProtector");
    }

    [HttpGet]
    public async Task<IActionResult> GetMedicalRecords()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var isProvider = User.IsInRole("Provider");

        if (isProvider)
        {
            var provider = await _context.ProviderProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (provider == null) return NotFound("Provider profile missing.");

            var records = await _context.MedicalRecords
                .Include(r => r.Patient)
                .ThenInclude(p => p.User)
                .Where(r => r.ProviderId == provider.Id)
                .OrderByDescending(r => r.Date)
                .ToListAsync();

            var decryptedRecords = records.Select(r => new
            {
                r.Id,
                r.Date,
                r.Diagnosis,
                // App-level Decryption when returning to the authorized provider
                DecryptedNotes = r.EncryptedNotes != null ? _protector.Unprotect(r.EncryptedNotes) : null,
                PatientName = r.Patient.User.FirstName + " " + r.Patient.User.LastName
            });

            return Ok(decryptedRecords);
        }
        else
        {
            var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (patient == null) return NotFound("Patient profile missing.");

            var records = await _context.MedicalRecords
                .Include(r => r.Provider)
                .ThenInclude(p => p.User)
                .Where(r => r.PatientId == patient.Id)
                .OrderByDescending(r => r.Date)
                .ToListAsync();

            var decryptedRecords = records.Select(r => new
            {
                r.Id,
                r.Date,
                r.Diagnosis,
                // App-level Decryption when returning to the authorized patient
                DecryptedNotes = r.EncryptedNotes != null ? _protector.Unprotect(r.EncryptedNotes) : null,
                ProviderName = "Dr. " + r.Provider.User.LastName
            });

            return Ok(decryptedRecords);
        }
    }

    [HttpPost]
    [Authorize(Roles = "Provider")]
    public async Task<IActionResult> AddMedicalRecord([FromBody] AddMedicalRecordRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var provider = await _context.ProviderProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (provider == null) return BadRequest("Provider profile missing.");

        // Find patient by ID
        var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.Id == request.PatientProfileId);
        if (patient == null) return BadRequest("Patient not found.");

        var record = new MedicalRecord
        {
            PatientId = patient.Id,
            ProviderId = provider.Id,
            Date = DateTime.UtcNow,
            Diagnosis = request.Diagnosis,
            // App-level Encryption using ASP.NET Data Protection API before saving to database
            EncryptedNotes = request.Notes != null ? _protector.Protect(request.Notes) : null
        };

        _context.MedicalRecords.Add(record);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMedicalRecords), new { id = record.Id }, 
            new { record.Id, record.Diagnosis, Message = "Record securely saved." });
    }
}

public class AddMedicalRecordRequest
{
    public int PatientProfileId { get; set; }
    public required string Diagnosis { get; set; }
    public string? Notes { get; set; }
}
