namespace NewsGator.Models; 
public class CommunityNote {
    public required string Text { get; set; }
    public int Upvotes { get; set; }
    public int Downvotes { get; set; }
}
