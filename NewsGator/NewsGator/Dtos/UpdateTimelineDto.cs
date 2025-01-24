namespace NewsGator.Dtos;

public class UpdateTimelineDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public List<string>? NewsIds { get; set; }
}