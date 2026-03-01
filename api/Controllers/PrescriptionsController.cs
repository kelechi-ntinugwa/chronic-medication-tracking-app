using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PrescriptionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PrescriptionsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetPrescriptions()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        if (User.IsInRole("Provider"))
        {
            var provider = await _context.ProviderProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (provider == null) return NotFound();

            var prescriptions = await _context.Prescriptions
                .Include(p => p.Patient)
                .ThenInclude(p => p.User)
                .Where(p => p.ProviderId == provider.Id)
                .Select(p => new
                {
                    p.Id,
                    p.MedicationName,
                    p.Dosage,
                    p.Instructions,
                    PatientName = p.Patient.User.FirstName + " " + p.Patient.User.LastName
                })
                .ToListAsync();

            return Ok(prescriptions);
        }
        else
        {
            var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (patient == null) return NotFound();

            var prescriptions = await _context.Prescriptions
                .Include(p => p.Provider)
                .ThenInclude(p => p.User)
                .Where(p => p.PatientId == patient.Id)
                .Select(p => new
                {
                    p.Id,
                    p.MedicationName,
                    p.Dosage,
                    p.Instructions,
                    ProviderName = "Dr. " + p.Provider.User.LastName
                })
                .ToListAsync();

            return Ok(prescriptions);
        }
    }

    [HttpPost]
    [Authorize(Roles = "Provider")]
    public async Task<IActionResult> WritePrescription([FromBody] WritePrescriptionRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var provider = await _context.ProviderProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (provider == null) return BadRequest("Provider profile missing.");

        // Find patient by ID or Email
        var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.Id == request.PatientProfileId);
        if (patient == null) return BadRequest("Patient not found.");

        var prescription = new Prescription
        {
            PatientId = patient.Id,
            ProviderId = provider.Id,
            MedicationName = request.MedicationName,
            Dosage = request.Dosage,
            Instructions = request.Instructions
        };

        _context.Prescriptions.Add(prescription);
        await _context.SaveChangesAsync();

        return Ok(prescription);
    }
}

public class WritePrescriptionRequest
{
    public int PatientProfileId { get; set; }
    public required string MedicationName { get; set; }
    public string? Dosage { get; set; }
    public string? Instructions { get; set; }
}
