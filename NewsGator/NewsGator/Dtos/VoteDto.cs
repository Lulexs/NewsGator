namespace NewsGator.Dtos;

public class VoteDto
{
    public required string PollId { get; set; }
    public required string UserId { get; set; }
    public required string Option { get; set; }
}