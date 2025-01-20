using NewsGator.Models;

namespace NewsGator.Dtos;
public class NewsDto
{
    public required string Title { get; set; }
    public string? Location { get; set; }
    public string? Thumbnail { get; set; }
    public List<NewspaperNews>? NewspaperNews { get; set; }
    public CommunityNote? CommunityNotes { get; set; }
}
