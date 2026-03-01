namespace Api.Services;

public interface IVideoCallService
{
    Task<string> CreateVideoRoomAsync(string appointmentId);
}

public class DailyCoStubService : IVideoCallService
{
    public Task<string> CreateVideoRoomAsync(string appointmentId)
    {
        // In a real application, you would make an HTTP POST to https://api.daily.co/v1/rooms
        // using your Daily.co API key to securely generate a dynamic, temporary room link.
        // For demonstration, we will generate a mock link based on the appointment ID.
        
        var mockRoomUrl = $"https://chronic-med-tracking.daily.co/room-{appointmentId}-{Guid.NewGuid().ToString().Substring(0, 8)}";
        return Task.FromResult(mockRoomUrl);
    }
}
