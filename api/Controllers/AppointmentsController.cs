using Api.Data;
using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IVideoCallService _videoCallService;

    public AppointmentsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IVideoCallService videoCallService)
    {
        _context = context;
        _userManager = userManager;
        _videoCallService = videoCallService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAppointments()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var isProvider = User.IsInRole("Provider");

        // We fetch the appropriate profile ID based on the user ID
        // Note: For a robust app, you would ensure profiles are created upon registration.
        // For now, we will link directly if the profile exists.

        if (isProvider)
        {
            var provider = await _context.ProviderProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (provider == null) return NotFound("Provider profile not found.");

            var appointments = await _context.Appointments
                .Include(a => a.Patient)
                .ThenInclude(p => p.User)
                .Where(a => a.ProviderId == provider.Id)
                .OrderBy(a => a.ScheduledTime)
                .Select(a => new
                {
                    a.Id,
                    a.ScheduledTime,
                    a.Status,
                    a.VideoCallLink,
                    PatientName = a.Patient.User.FirstName + " " + a.Patient.User.LastName
                })
                .ToListAsync();

            return Ok(appointments);
        }
        else
        {
            var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (patient == null) return NotFound("Patient profile not found.");

            var appointments = await _context.Appointments
                .Include(a => a.Provider)
                .ThenInclude(p => p.User)
                .Where(a => a.PatientId == patient.Id)
                .OrderBy(a => a.ScheduledTime)
                .Select(a => new
                {
                    a.Id,
                    a.ScheduledTime,
                    a.Status,
                    a.VideoCallLink,
                    ProviderName = "Dr. " + a.Provider.User.LastName
                })
                .ToListAsync();

            return Ok(appointments);
        }
    }

    [HttpPost]
    [Authorize(Roles = "Patient,Provider")]
    public async Task<IActionResult> BookAppointment([FromBody] BookAppointmentRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == (User.IsInRole("Patient") ? userId : request.PatientUserId));
        var provider = await _context.ProviderProfiles.FirstOrDefaultAsync(p => p.UserId == (User.IsInRole("Provider") ? userId : request.ProviderUserId));

        if (patient == null || provider == null)
            return BadRequest("Invalid patient or provider.");

        var appointment = new Appointment
        {
            PatientId = patient.Id,
            ProviderId = provider.Id,
            ScheduledTime = request.ScheduledTime,
            Status = "Confirmed"
        };
        
        // Let's assume all booked appointments require a telehealth link for now.
        // The mock VideoCallService generates a unique Daily.co URL synchronously 
        // using the patient & provider IDs to emulate a real API integration.
        appointment.VideoCallLink = await _videoCallService.CreateVideoRoomAsync($"{patient.Id}-{provider.Id}");

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAppointments), new { id = appointment.Id }, appointment);
    }
}

public class BookAppointmentRequest
{
    public string? PatientUserId { get; set; } // Provided by doctor booking it
    public string? ProviderUserId { get; set; } // Provided by patient booking it
    public DateTime ScheduledTime { get; set; }
}
