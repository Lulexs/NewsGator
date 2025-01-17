namespace NewsGator.Models;
public class NewspaperNews
{
    public required string Newspaper { get; set; }
    public string? Thumbnail { get; set; }
    public string? Author { get; set; }
    public required string Url { get; set; }
    public DateTime? Date { get; set; }
    public required string Content { get; set; }
    public List<string>? Tags { get; set; }
    public required string Category { get; set; }
}
