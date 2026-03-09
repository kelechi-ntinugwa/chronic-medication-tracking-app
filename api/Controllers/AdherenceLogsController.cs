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
public class AdherenceLogsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdherenceLogsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> GetLogs()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (patient == null) return NotFound("Patient profile not found.");

        var logs = await _context.AdherenceLogs
            .Include(l => l.Prescription)
            .Where(l => l.PatientId == patient.Id)
            .OrderByDescending(l => l.ScheduledTime)
            .Select(l => new {
                l.Id,
                l.PrescriptionId,
                l.Prescription.MedicationName,
                l.ScheduledTime,
                l.TakenTime,
                l.Status,
                l.Notes
            })
            .ToListAsync();

        return Ok(logs);
    }

    [HttpPost]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> LogAdherence([FromBody] CreateAdherenceLogRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (patient == null) return NotFound("Patient profile not found.");

        var prescription = await _context.Prescriptions.FirstOrDefaultAsync(p => p.Id == request.PrescriptionId && p.PatientId == patient.Id);
        if (prescription == null) return BadRequest("Invalid prescription.");

        var log = new AdherenceLog
        {
            PatientId = patient.Id,
            PrescriptionId = prescription.Id,
            ScheduledTime = request.ScheduledTime,
            TakenTime = request.Status == "Taken" ? DateTime.UtcNow : null,
            Status = request.Status,
            Notes = request.Notes
        };

        _context.AdherenceLogs.Add(log);
        await _context.SaveChangesAsync();

        return Ok(log);
    }
}

public class CreateAdherenceLogRequest
{
    public int PrescriptionId { get; set; }
    public DateTime ScheduledTime { get; set; }
    public required string Status { get; set; } // Taken, Missed, Skipped
    public string? Notes { get; set; }
}
