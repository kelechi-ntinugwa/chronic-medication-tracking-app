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
public class EmergencyProfileController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public EmergencyProfileController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (patient == null) return NotFound();

        var profile = await _context.EmergencyProfiles.FirstOrDefaultAsync(e => e.PatientId == patient.Id);
        
        // If not found, return empty 200 rather than 404, or return a new empty object
        if (profile == null) return Ok(new { });

        return Ok(profile);
    }

    [HttpPost]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> UpsertProfile([FromBody] UpsertEmergencyProfileRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (patient == null) return NotFound();

        var profile = await _context.EmergencyProfiles.FirstOrDefaultAsync(e => e.PatientId == patient.Id);

        if (profile == null)
        {
            profile = new EmergencyProfile
            {
                PatientId = patient.Id,
                BloodType = request.BloodType,
                Allergies = request.Allergies,
                EmergencyContacts = request.EmergencyContacts,
                PrimaryPhysician = request.PrimaryPhysician
            };
            _context.EmergencyProfiles.Add(profile);
        }
        else
        {
            profile.BloodType = request.BloodType;
            profile.Allergies = request.Allergies;
            profile.EmergencyContacts = request.EmergencyContacts;
            profile.PrimaryPhysician = request.PrimaryPhysician;
        }

        await _context.SaveChangesAsync();

        return Ok(profile);
    }
}

public class UpsertEmergencyProfileRequest
{
    public string? BloodType { get; set; }
    public string? Allergies { get; set; }
    public string? EmergencyContacts { get; set; }
    public string? PrimaryPhysician { get; set; }
}
