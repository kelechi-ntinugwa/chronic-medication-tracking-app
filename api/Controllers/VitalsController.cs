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
public class VitalsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public VitalsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetVitals([FromQuery] int? patientId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        if (User.IsInRole("Patient"))
        {
            var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (patient == null) return NotFound();

            var vitals = await _context.VitalsLogs
                .Where(v => v.PatientId == patient.Id)
                .OrderByDescending(v => v.Date)
                .ToListAsync();

            return Ok(vitals);
        }
        else if (User.IsInRole("Provider"))
        {
            if (!patientId.HasValue) return BadRequest("Patient ID is required for providers.");

            var vitals = await _context.VitalsLogs
                .Where(v => v.PatientId == patientId.Value)
                .OrderByDescending(v => v.Date)
                .ToListAsync();

            return Ok(vitals);
        }

        return Forbid();
    }

    [HttpPost]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> LogVitals([FromBody] LogVitalsRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (patient == null) return NotFound();

        var log = new VitalsLog
        {
            PatientId = patient.Id,
            Date = DateTime.UtcNow,
            BloodPressure = request.BloodPressure,
            HeartRate = request.HeartRate,
            BloodSugar = request.BloodSugar,
            Weight = request.Weight
        };

        _context.VitalsLogs.Add(log);
        await _context.SaveChangesAsync();

        return Ok(log);
    }
}

public class LogVitalsRequest
{
    public string? BloodPressure { get; set; }
    public int? HeartRate { get; set; }
    public decimal? BloodSugar { get; set; }
    public decimal? Weight { get; set; }
}
