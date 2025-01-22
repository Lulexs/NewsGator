using MongoDB.Bson;

namespace NewsGator.Models;

public class Reaction
{
    public ObjectId UserId { get; set; }
    public int Action { get; set; }
}

public class CommunityNote
{
    public required string Text { get; set; }
    public List<Reaction> Reactions { get; set; } = [];
    public int Upvotes { get; set; }
    public int Downvotes { get; set; }
}

public class CommunityNoteForUser
{
    public required string Text { get; set; }
    public int Action { get; set; }
    public int Upvotes { get; set; }
    public int Downvotes { get; set; }
}