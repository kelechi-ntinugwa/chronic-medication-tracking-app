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
public class SymptomsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SymptomsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetSymptoms([FromQuery] int? patientId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        if (User.IsInRole("Patient"))
        {
            var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (patient == null) return NotFound();

            var symptoms = await _context.SymptomLogs
                .Where(s => s.PatientId == patient.Id)
                .OrderByDescending(s => s.Date)
                .ToListAsync();

            return Ok(symptoms);
        }
        else if (User.IsInRole("Provider"))
        {
            // Provider viewing a specific patient's symptoms
            if (!patientId.HasValue) return BadRequest("Patient ID is required for providers.");

            var symptoms = await _context.SymptomLogs
                .Where(s => s.PatientId == patientId.Value)
                .OrderByDescending(s => s.Date)
                .ToListAsync();

            return Ok(symptoms);
        }

        return Forbid();
    }

    [HttpPost]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> LogSymptom([FromBody] LogSymptomRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (patient == null) return NotFound();

        var log = new SymptomLog
        {
            PatientId = patient.Id,
            Date = DateTime.UtcNow,
            Symptom = request.Symptom,
            Severity = request.Severity,
            Notes = request.Notes
        };

        _context.SymptomLogs.Add(log);
        await _context.SaveChangesAsync();

        return Ok(log);
    }
}

public class LogSymptomRequest
{
    public required string Symptom { get; set; }
    public int Severity { get; set; }
    public string? Notes { get; set; }
}
