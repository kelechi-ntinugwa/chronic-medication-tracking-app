using System.ComponentModel.DataAnnotations;

namespace Api.Models;

public class RegisterRequest
{
    [Required]
    public string? Email { get; set; }
    
    [Required]
    public string? Password { get; set; }
    
    [Required]
    public string? FirstName { get; set; }
    
    [Required]
    public string? LastName { get; set; }

    [Required]
    public string? Role { get; set; } // e.g., "Patient" or "Provider"
}

public class LoginRequest
{
    [Required]
    public string? Email { get; set; }
    
    [Required]
    public string? Password { get; set; }
}

public class AuthResponse
{
    public string? Token { get; set; }
    public string? Email { get; set; }
}
