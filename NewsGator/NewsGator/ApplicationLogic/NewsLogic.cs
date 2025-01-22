using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Logging.Abstractions;
using MongoDB.Bson;
using MongoDB.Driver;
using NewsGator.Dtos;
using NewsGator.Models;
using NewsGator.Persistence;

namespace NewsGator.ApplicationLogic;
public class NewsLogic
{
    public async Task CreateNews(NewsDto dto)
    {
        var collection = MongoSessionManager.GetCollection<News>("news");

        await collection.InsertOneAsync(new News()
        {
            Title = dto.Title,
            CreatedAt = DateTime.Now,
            Location = dto.Location,
            Thumbnail = dto.Thumbnail,
            CommunityNote = dto.CommunityNotes,
            NewspaperNews = dto.NewspaperNews
        });
    }

    public async Task<List<NewsForEditor>> GetNewsForEditor(int count)
    {
        var collection = MongoSessionManager.GetCollection<News>("news");

        var projection = Builders<News>.Projection.Expression(news => new NewsForEditor
        {
            Id = news.Id.ToString(),
            Title = news.Title,
            CreatedAt = news.CreatedAt,
            Thumbnail = news.Thumbnail
        });
        var sort = Builders<News>.Sort.Descending(p => p.CreatedAt);

        var res = await collection.Find(news => true)
                                   .Project(projection)
                                   .Sort(sort)
                                   .Skip(count)
                                   .Limit(8)
                                   .ToListAsync();

        return res ?? [];
    }


    public async Task<List<NewsForEditor>> GetMostRecentNews(int count)
    {
        var collection = MongoSessionManager.GetCollection<News>("news");

        var projection = Builders<News>.Projection.Expression(news => new NewsForEditor
        {
            Id = news.Id.ToString(),
            Title = news.Title,
            Thumbnail = news.Thumbnail,
            CreatedAt = news.CreatedAt
        });

        var sort = Builders<News>.Sort.Descending(p => p.CreatedAt);

        var res = await collection.Find(news => true)
                                  .Project(projection)
                                  .Sort(sort)
                                  .Skip(count)
                                  .Limit(8)
                                  .ToListAsync();

        return res;
    }

    public async Task<List<NewsForEditor>> GetMostPopularNews()
    {
        var collectionClicks = MongoSessionManager.GetCollection<Click>("clicks");

        var sort = Builders<Click>.Sort.Descending(p => p.Clicks);
        var projection = Builders<Click>.Projection.Expression(x => x.NewsId);
        var mostPopular = await collectionClicks.Find(click => true)
                                          .Project(projection)
                                          .Sort(sort)
                                          .Limit(8)
                                          .ToListAsync();

        var collectionNews = MongoSessionManager.GetCollection<News>("news");
        var projectionNews = Builders<News>.Projection.Expression(x => new NewsForEditor()
        {
            Id = x.Id.ToString(),
            Thumbnail = x.Thumbnail,
            CreatedAt = x.CreatedAt,
            Title = x.Title
        });
        var mostPopularNews = await collectionNews.Find(news => mostPopular.Contains(news.Id))
                                            .Project(projectionNews)
                                            .ToListAsync();

        return mostPopularNews;
    }

    public async Task<NewsWithStringId?> GetSingleNewsForReader(ObjectId userId, ObjectId newsId)
    {
        var collectionClicks = MongoSessionManager.GetCollection<Click>("clicks");

        var filter = Builders<Click>.Filter.Eq(x => x.NewsId, newsId);
        var update = Builders<Click>.Update.Inc(x => x.Clicks, 1);
        await collectionClicks.FindOneAndUpdateAsync(filter, update);

        var collectionNews = MongoSessionManager.GetCollection<News>("news");
        var projection = Builders<News>.Projection.Expression(x => new NewsWithStringId()
        {
            Id = x.Id.ToString(),
            Location = x.Location,
            Thumbnail = x.Thumbnail,
            Title = x.Title,
            CreatedAt = x.CreatedAt,
            NewspaperNews = x.NewspaperNews,
            CommunityNote = x.CommunityNote == null ? null : new CommunityNoteForUser()
            {
                Upvotes = x.CommunityNote.Upvotes,
                Downvotes = x.CommunityNote.Downvotes,
                Text = x.CommunityNote.Text,
                Action = x.CommunityNote.Reactions != null ? x.CommunityNote.Reactions.Where(x => x.UserId == userId).Select(x => x.Action).FirstOrDefault() : 0
            }
        });
        var singleNews = await collectionNews.Find(x => x.Id == newsId).Project(projection).FirstOrDefaultAsync();

        return singleNews;
    }

    public async Task<News?> GetSingleNews(ObjectId id)
    {
        var collection = MongoSessionManager.GetCollection<News>("news");

        var res = await collection.Find(x => x.Id == id).FirstOrDefaultAsync();

        return res;
    }

    public async Task<long> GetNewsCount()
    {
        var collection = MongoSessionManager.GetCollection<News>("news");

        var res = await collection.CountDocumentsAsync(news => true);
        return res;
    }

    public async Task UpdateSingleNews(ObjectId id, NewsDto dto)
    {
        var collection = MongoSessionManager.GetCollection<News>("news");

        var filter = Builders<News>.Filter.Eq(x => x.Id, id);
        var update = Builders<News>.Update
            .Set(x => x.Title, dto.Title)
            .Set(x => x.Location, dto.Location)
            .Set(x => x.Thumbnail, dto.Thumbnail)
            .Set(x => x.CommunityNote, dto.CommunityNotes)
            .Set(x => x.NewspaperNews, dto.NewspaperNews);

        await collection.FindOneAndUpdateAsync(filter, update);
    }

    public async Task<List<NewsForEditor>> GetFilteredNewsForEditor(string title)
    {
        var collection = MongoSessionManager.GetCollection<News>("news");

        var filter = Builders<News>.Filter.Regex("Title", new BsonRegularExpression(title, "i"));
        var projection = Builders<News>.Projection.Expression(news => new NewsForEditor
        {
            Id = news.Id.ToString(),
            Title = news.Title,
            CreatedAt = news.CreatedAt,
            Thumbnail = news.Thumbnail
        });

        var results = await collection.Find(filter).Project(projection).ToListAsync();

        return results;
    }
}
