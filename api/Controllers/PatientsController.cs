using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[Authorize(Roles = "Provider")]
[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PatientsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchPatients([FromQuery] string? query)
    {
        var patientsQuery = _context.PatientProfiles
            .Include(p => p.User)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query))
        {
            var lowerQuery = query.ToLower();
            patientsQuery = patientsQuery.Where(p => 
                p.User.FirstName!.ToLower().Contains(lowerQuery) || 
                p.User.LastName!.ToLower().Contains(lowerQuery) ||
                p.User.Email!.ToLower().Contains(lowerQuery));
        }

        var patients = await patientsQuery
            .Select(p => new
            {
                p.Id, // This is the PatientProfileId
                p.User.FirstName,
                p.User.LastName,
                p.User.Email
            })
            .Take(20) // Limit results
            .ToListAsync();

        return Ok(patients);
    }
}
