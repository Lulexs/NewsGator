using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NewsGator.Models;

public class PollOption
{
    public required string Option { get; set; }
    public int Votes { get; set; }
    public List<ObjectId> Voters { get; set; } = [];
}
public class Poll
{
    [BsonId]
    public ObjectId Id { get; set; }
    public required string Question { get; set; }
    public required List<PollOption> Options { get; set; }
    public DateTime DatePosted { get; set; }
}
