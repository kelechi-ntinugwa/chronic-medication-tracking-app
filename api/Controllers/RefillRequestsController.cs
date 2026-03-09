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
public class RefillRequestsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RefillRequestsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetRefillRequests()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        if (User.IsInRole("Patient"))
        {
            var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (patient == null) return NotFound();

            var requests = await _context.RefillRequests
                .Include(r => r.Prescription)
                .Where(r => r.PatientId == patient.Id)
                .OrderByDescending(r => r.RequestedDate)
                .Select(r => new {
                    r.Id,
                    r.Status,
                    r.RequestedDate,
                    r.Prescription.MedicationName,
                    r.Prescription.Dosage
                })
                .ToListAsync();

            return Ok(requests);
        }
        else if (User.IsInRole("Provider"))
        {
            var provider = await _context.ProviderProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (provider == null) return NotFound();

            var requests = await _context.RefillRequests
                .Include(r => r.Prescription)
                .Include(r => r.Patient)
                .ThenInclude(p => p.User)
                .Where(r => r.Prescription.ProviderId == provider.Id)
                .OrderByDescending(r => r.RequestedDate)
                .Select(r => new {
                    r.Id,
                    r.Status,
                    r.RequestedDate,
                    r.Prescription.MedicationName,
                    PatientName = r.Patient.User.FirstName + " " + r.Patient.User.LastName
                })
                .ToListAsync();

            return Ok(requests);
        }

        return Forbid();
    }

    [HttpPost]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> RequestRefill([FromBody] CreateRefillRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (patient == null) return NotFound();

        var prescription = await _context.Prescriptions.FirstOrDefaultAsync(p => p.Id == request.PrescriptionId && p.PatientId == patient.Id);
        if (prescription == null) return BadRequest("Invalid prescription.");

        var refillRequest = new RefillRequest
        {
            PatientId = patient.Id,
            PrescriptionId = prescription.Id,
            Status = "Requested",
            RequestedDate = DateTime.UtcNow
        };

        _context.RefillRequests.Add(refillRequest);
        await _context.SaveChangesAsync();

        return Ok(refillRequest);
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Provider")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateRefillStatusRequest request)
    {
         var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
         if (userId == null) return Unauthorized();

         var provider = await _context.ProviderProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
         if (provider == null) return NotFound();

         var refill = await _context.RefillRequests
            .Include(r => r.Prescription)
            .FirstOrDefaultAsync(r => r.Id == id);

         if (refill == null) return NotFound();
         if (refill.Prescription.ProviderId != provider.Id) return Forbid(); // Only the prescribing doctor can approve

         refill.Status = request.Status;
         await _context.SaveChangesAsync();

         return Ok(refill);
    }
}

public class CreateRefillRequest
{
    public int PrescriptionId { get; set; }
}

public class UpdateRefillStatusRequest
{
    public required string Status { get; set; } // Approved, Denied
}
