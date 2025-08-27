namespace NewsGator.Dtos;

public class FilteredNewsResultDto
{
    public required List<NewsForEditor> Results { get; set; }
    public long FilteredNewsCount { get; set; }
}
