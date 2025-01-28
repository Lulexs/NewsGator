using DnsClient.Internal;
using MongoDB.Bson;
using MongoDB.Driver;
using NewsGator.Dtos;
using NewsGator.Models;
using NewsGator.Persistence;

namespace NewsGator.ApplicationLogic;

public class TimelinesLogic
{
    
    public async Task<ObjectId> CreateTimeline(CreateTimelineDto dto)
    {
        var timelinesCollection = MongoSessionManager.GetCollection<Timeline>("timelines");
        var newsCollection = MongoSessionManager.GetCollection<News>("news");

        
        var newsList = new List<ThumbnailedNews>();
        if (dto.NewsIds != null)
        {
            foreach (var newsId in dto.NewsIds)
            {
                var objectId = ObjectId.Parse(newsId);
                var news = await newsCollection.Find(n => n.Id == objectId).FirstOrDefaultAsync();
                if (news != null)
                {
                    //Console.WriteLine($"News with ID {newsId} found.");
                    newsList.Add(new ThumbnailedNews
                    {
                        NewsId = news.Id,
                        Title = news.Title,
                        Thumbnail = news.Thumbnail
                    });
                }
                else
                {
                    
                    Console.WriteLine($"News with ID {newsId} not found.");
                }
            }
        }

        var timeline = new Timeline
        {
            Id = ObjectId.GenerateNewId(),
            Name = dto.Name,
            News = newsList
        };

        await timelinesCollection.InsertOneAsync(timeline);
        return timeline.Id;
    
    }

    public async Task<bool> UpdateTimeline(UpdateTimelineDto dto)
    {
        var timelinesCollection = MongoSessionManager.GetCollection<Timeline>("timelines");
        var newsCollection = MongoSessionManager.GetCollection<News>("news");

        var timelineId = ObjectId.Parse(dto.Id);

        var existingTimeline = await timelinesCollection.Find(t => t.Id == timelineId).FirstOrDefaultAsync();
        if (existingTimeline == null)
        {
            Console.WriteLine($"Timeline with ID {dto.Id} not found.");
            return false;
        }

        var newsList = new List<ThumbnailedNews>();
        if (dto.NewsIds != null)
        {
            foreach (var newsId in dto.NewsIds)
            {
                var objectId = ObjectId.Parse(newsId);
                var news = await newsCollection.Find(n => n.Id == objectId).FirstOrDefaultAsync();
                if (news != null)
                {
                    //Console.WriteLine($"News with ID {newsId} found.");
                    newsList.Add(new ThumbnailedNews
                    {
                        NewsId = news.Id,
                        Title = news.Title,
                        Thumbnail = news.Thumbnail
                    });
                }
                else
                {
                    Console.WriteLine($"News with ID {newsId} not found.");
                }
            }
        }
        var update = Builders<Timeline>.Update
        .Set(t => t.Name, dto.Name)
        .Set(t => t.News, newsList);

        var updateResult = await timelinesCollection.UpdateOneAsync(
            Builders<Timeline>.Filter.Eq(t => t.Id, timelineId),
            update
        );

        return updateResult.ModifiedCount > 0;

    }

    public async Task<bool> DeleteTimeline(string timelineId)
    {
        var timelinesCollection = MongoSessionManager.GetCollection<Timeline>("timelines");
        var objectTimelineId = ObjectId.Parse(timelineId.ToString());
        var deleteResult = await timelinesCollection.DeleteOneAsync(t => t.Id == objectTimelineId);
        return deleteResult.DeletedCount > 0;
    }

    public async Task<Timeline?> GetTimeline(ObjectId id)
    {
        var collection = MongoSessionManager.GetCollection<Timeline>("timelines");
        var res = await collection.Find(x => x.Id == id).FirstOrDefaultAsync();
        return res;
    }

    public async Task<int> GetTimelinesCount()
    {
        var collection = MongoSessionManager.GetCollection<Timeline>("timelines");
        var res = await collection.CountDocumentsAsync(timeline => true);
        return (int)res;
    }

    public async Task<List<Timeline>> GetTimelines(int cursor)
    {
        var collection = MongoSessionManager.GetCollection<Timeline>("timelines");
        //Trebalo bi tu po datumu kreiranja jer se prave id-ovi kolko sam skapirao po datumu kreiranja
        var sort = Builders<Timeline>.Sort.Descending(t => t.Id);
        var timelines = await collection.Find(Builders<Timeline>.Filter.Empty)
                                        .Sort(sort)
                                        .Skip(cursor)
                                        .Limit(8)
                                        .ToListAsync();
        return timelines;

    }





}