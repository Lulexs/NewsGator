namespace NewsGator.Dtos;

public class NewsFilterDto
{
    public string? Title { get; set; }
    public DateTime? Date { get; set; }
    public string? Location { get; set; }
    public List<string>? Categories { get; set; }
    public List<string>? Tags { get; set; }
    public List<string>? Coverages { get; set; }
    public string? Author { get; set; }
}