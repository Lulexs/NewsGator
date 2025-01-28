using DnsClient.Internal;
using MongoDB.Bson;
using MongoDB.Driver;
using NewsGator.Dtos;
using NewsGator.Models;
using NewsGator.Persistence;

namespace NewsGator.ApplicationLogic;

public class PollsLogic
{
    public async Task CreatePoll(string question, List<string> options)
    {
        var collection = MongoSessionManager.GetCollection<Poll>("polls");

        var poll = new Poll
        {
            Question = question,
            Options = options.Select(option => new PollOption
            {
                Option = option,
                Votes = 0
            }).ToList(),
            DatePosted = DateTime.Now
        };

        await collection.InsertOneAsync(poll);
    }


    
}