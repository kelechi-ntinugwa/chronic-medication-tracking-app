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
public class DependentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DependentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> GetDependents()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (patient == null) return NotFound();

        var dependents = await _context.DependentProfiles
            .Where(d => d.CaregiverId == patient.Id)
            .ToListAsync();

        return Ok(dependents);
    }

    [HttpPost]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> AddDependent([FromBody] AddDependentRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (patient == null) return NotFound();

        var dependent = new DependentProfile
        {
            CaregiverId = patient.Id,
            Name = request.Name,
            DateOfBirth = request.DateOfBirth,
            Relationship = request.Relationship
        };

        _context.DependentProfiles.Add(dependent);
        await _context.SaveChangesAsync();

        return Ok(dependent);
    }
}

public class AddDependentRequest
{
    public required string Name { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Relationship { get; set; }
}
