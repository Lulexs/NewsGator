namespace NewsGator.Dtos;

public class LeaveReviewDto
{
    public required string Commenter { get; set; }
    public required string Avatar { get; set; }
    public required string Comment { get; set; }
    public int Value { get; set; }
}