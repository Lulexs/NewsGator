
namespace NewsGator.Dtos;

public class NewsForEditor
{
    public required string Id { get; set; }
    public required string Title { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? Thumbnail { get; set; }
}
