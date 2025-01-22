namespace NewsGator.Dtos;

public class UpvoteDownvoteDto
{
    public required string UserId { get; set; }
    public required string NewsId { get; set; }
    public int Action { get; set; }
}