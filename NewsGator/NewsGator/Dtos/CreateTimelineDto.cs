namespace NewsGator.Dtos;

public class CreateTimelineDto
{
    public required string Name { get; set; }
    public List<string>? NewsIds { get; set; }
}