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
public class InsuranceController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public InsuranceController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> GetInsuranceCards()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (patient == null) return NotFound();

        var cards = await _context.InsuranceCards
            .Where(c => c.PatientId == patient.Id)
            .ToListAsync();

        return Ok(cards);
    }

    [HttpPost]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> AddInsuranceCard([FromBody] AddInsuranceCardRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (patient == null) return NotFound();

        var card = new InsuranceCard
        {
            PatientId = patient.Id,
            ProviderName = request.ProviderName,
            PolicyNumber = request.PolicyNumber,
            GroupNumber = request.GroupNumber,
            ImageUrl = request.ImageUrl
        };

        _context.InsuranceCards.Add(card);
        await _context.SaveChangesAsync();

        return Ok(card);
    }
}

public class AddInsuranceCardRequest
{
    public required string ProviderName { get; set; }
    public string? PolicyNumber { get; set; }
    public string? GroupNumber { get; set; }
    public string? ImageUrl { get; set; }
}
