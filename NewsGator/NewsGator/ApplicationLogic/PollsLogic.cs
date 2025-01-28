using DnsClient.Internal;
using MongoDB.Bson;
using MongoDB.Driver;
using NewsGator.Dtos;
using NewsGator.Models;
using NewsGator.Persistence;

namespace NewsGator.ApplicationLogic;

public class PollsLogic
{
    public async Task<Poll> CreatePoll(string question, List<string> options)
    {
        var collection = MongoSessionManager.GetCollection<Poll>("polls");

        var poll = new Poll
        {
            Question = question,
            Options = options.Select(option => new PollOption
            {
                Option = option,
                Votes = 0,
                Voters = new List<ObjectId>()
            }).ToList(),
            DatePosted = DateTime.Now
        };

        await collection.InsertOneAsync(poll);
        return poll;
    }

    public async Task<List<Poll>> GetPollsSortedByDate()
    {
        var collection = MongoSessionManager.GetCollection<Poll>("polls");
        var polls = await collection.Find(_ => true)
            .SortByDescending(poll => poll.DatePosted)
            .ToListAsync(); 
        return polls;
    }

    public async Task<Poll> GetLatestPoll()
    {
        var collection = MongoSessionManager.GetCollection<Poll>("polls");
        var poll = await collection.Find(_ => true)
            .SortByDescending(poll => poll.DatePosted)
            .FirstOrDefaultAsync();
        return poll;
    }

    public async Task<bool> Vote(string pollId, string userId, string option)
    {
        var collection = MongoSessionManager.GetCollection<Poll>("polls");

        var userObjectId = new ObjectId(userId);
        var pollObjectId = new ObjectId(pollId);

        // Dohvati anketu po ID-u
        var poll = await collection.Find(p => p.Id == pollObjectId).FirstOrDefaultAsync();

        if (poll == null)
        {
            Console.WriteLine($"Poll with ID {pollId} not found.");
            return false;
        }

        // Pronadji staru opciju ako postoji
        var oldOption = poll.Options.FirstOrDefault(o => o.Voters.Contains(userObjectId));

        // Lista azuriranja (kancer)
        var updates = new List<UpdateDefinition<Poll>>();

        // Ako postoji stara opcija, smanji glasove i ukloni korisnika iz liste glasaca
        if (oldOption != null)
        {
            updates.Add(Builders<Poll>.Update.Combine(
                Builders<Poll>.Update.Inc("Options.$[oldOption].Votes", -1),
                Builders<Poll>.Update.Pull("Options.$[oldOption].Voters", userObjectId)
            ));

            Console.WriteLine($"User {userId} changed vote from {oldOption.Option} to {option} in poll {pollId}.");
        }

        // Povecaj glasove za novu opciju 
        updates.Add(Builders<Poll>.Update.Combine(
            Builders<Poll>.Update.Inc("Options.$[newOption].Votes", 1),
            Builders<Poll>.Update.AddToSet("Options.$[newOption].Voters", userObjectId)
        ));

        // ArrayFilters....
        var arrayFilters = new List<ArrayFilterDefinition>();
        if (oldOption != null)
        {
            arrayFilters.Add(new BsonDocumentArrayFilterDefinition<BsonDocument>(
                new BsonDocument("oldOption.Option", new BsonString(oldOption.Option))
            ));
        }
        arrayFilters.Add(new BsonDocumentArrayFilterDefinition<BsonDocument>(
            new BsonDocument("newOption.Option", new BsonString(option))
        ));

        
        var updateResult = await collection.UpdateOneAsync(
            Builders<Poll>.Filter.Eq(p => p.Id, pollObjectId),
            Builders<Poll>.Update.Combine(updates),
            new UpdateOptions { ArrayFilters = arrayFilters }
        );

        if (updateResult.ModifiedCount > 0)
        {
            Console.WriteLine($"User {userId} voted for {option} in poll {pollId}.");
            return true;
        }
        else
        {
            Console.WriteLine($"Failed to update vote for user {userId} in poll {pollId}.");
            return false;
        }


    }

    public async Task<bool> DeletePoll(string pollId)
    {
        var collection = MongoSessionManager.GetCollection<Poll>("polls");
        var pollObjectId = new ObjectId(pollId);

        var deleteResult = await collection.DeleteOneAsync(p => p.Id == pollObjectId);

        if (deleteResult.DeletedCount > 0)
        {
            Console.WriteLine($"Poll with ID {pollId} deleted.");
            return true;
        }
        else
        {
            Console.WriteLine($"Failed to delete poll with ID {pollId}.");
            return false;
        }
    }
    
}