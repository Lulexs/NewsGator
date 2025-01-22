namespace NewsGator.Dtos;

public class CreatePollDto
{
    public required string Question { get; set; }
    public required List<string> Options { get; set; }
}