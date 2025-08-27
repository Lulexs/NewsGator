namespace NewsGator.Dtos;

public class FilterOptionsDto
{
    public List<string>? Categories { get; set; }
    public List<string>? Tags { get; set; }
    public List<string>? Newspapers { get; set; }
}