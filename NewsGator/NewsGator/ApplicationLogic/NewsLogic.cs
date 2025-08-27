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

    public async Task<FilterOptionsDto> GetFilterOptions()
    {
        var collection = MongoSessionManager.GetCollection<News>("news");

        var filter = Builders<News>.Filter.Empty;

        var categoriesTask = collection.Distinct<string>("NewspaperNews.Category", filter).ToListAsync();
        var tagsTask = collection.Distinct<string>("NewspaperNews.Tags", filter).ToListAsync();
        var papersTask = collection.Distinct<string>("NewspaperNews.Newspaper", filter).ToListAsync();

        await Task.WhenAll(categoriesTask, tagsTask, papersTask);

        return new FilterOptionsDto
        {
            Categories = categoriesTask.Result.Where(s => !string.IsNullOrWhiteSpace(s)).OrderBy(s => s).ToList(),
            Tags = tagsTask.Result.Where(tag => !string.IsNullOrWhiteSpace(tag)).OrderBy(tag => tag).ToList(),
            Newspapers = papersTask.Result.Where(s => !string.IsNullOrWhiteSpace(s)).OrderBy(s => s).ToList()
        };
    }

    public async Task<FilteredNewsResultDto> GetFilteredNews(NewsFilterDto filterDto, int count)
    {
        var collection = MongoSessionManager.GetCollection<News>("news");

        var titleFilter = Builders<News>.Filter.Empty;
        var locationFilter = Builders<News>.Filter.Empty;
        var categoriesFilter = Builders<News>.Filter.Empty;
        var tagsFilter = Builders<News>.Filter.Empty;
        var coveragesFilter = Builders<News>.Filter.Empty;
        var authorFilter = Builders<News>.Filter.Empty;

        if (!string.IsNullOrEmpty(filterDto.Title))
        {
            titleFilter = Builders<News>.Filter.Regex("Title", new BsonRegularExpression(filterDto.Title, "i"));
        }

        if (!string.IsNullOrEmpty(filterDto.Location))
        {
            locationFilter = Builders<News>.Filter.Regex("Location", new BsonRegularExpression(filterDto.Location, "i"));
        }

        if (filterDto.Categories != null && filterDto.Categories.Count > 0)
        {
            categoriesFilter = Builders<News>.Filter.In("NewspaperNews.Category", filterDto.Categories);
        }

        if (filterDto.Tags != null && filterDto.Tags.Count > 0)
        {
            tagsFilter = Builders<News>.Filter.In("NewspaperNews.Tags", filterDto.Tags);
        }

        if (filterDto.Coverages != null && filterDto.Coverages.Count > 0)
        {
            coveragesFilter = Builders<News>.Filter.In("NewspaperNews.Newspaper", filterDto.Coverages);
        }

        if (!string.IsNullOrEmpty(filterDto.Author))
        {
            authorFilter = Builders<News>.Filter.Regex("NewspaperNews.Author", new BsonRegularExpression(filterDto.Author, "i"));
        }

        var filter = Builders<News>.Filter.And(titleFilter, locationFilter, categoriesFilter, tagsFilter, coveragesFilter, authorFilter);

        var projection = Builders<News>.Projection.Expression(news => new NewsForEditor
        {
            Id = news.Id.ToString(),
            Title = news.Title,
            CreatedAt = news.CreatedAt,
            Thumbnail = news.Thumbnail
        });

        var sort = Builders<News>.Sort.Descending(p => p.CreatedAt);

        var filteredNewsCount = await collection.CountDocumentsAsync(filter);

        var results = await collection.Find(filter)
                                        .Project(projection)
                                        .Skip(count)
                                        .Limit(8)
                                        .Sort(sort)
                                        .ToListAsync();

        return new FilteredNewsResultDto { Results = results, FilteredNewsCount = filteredNewsCount };

    }

    public async Task<List<ReviewDto>> GetNewsReviews(ObjectId newsId)
    {
        var collection = MongoSessionManager.GetCollection<Review>("reviews");

        var projection = Builders<Review>.Projection.Expression(review => new ReviewDto
        {
            Comment = review.Comment!,
            Commenter = review.Commenter!,
            Avatar = review.Avatar!,
            Value = review.Value
        });

        var sort = Builders<Review>.Sort.Descending(p => p.Value);

        var res = await collection.Find(review => review.NewsId == newsId)
                                   .Project(projection)
                                   .Sort(sort)
                                   .ToListAsync();

        return res ?? new List<ReviewDto>();
    }

    public async Task LeaveReview(ObjectId newsId, ReviewDto dto)
    {
        var collection = MongoSessionManager.GetCollection<Review>("reviews");

        var review = new Review
        {
            NewsId = newsId,
            Commenter = dto.Commenter,
            Comment = dto.Comment,
            Avatar = dto.Avatar,
            Value = dto.Value
        };

        await collection.InsertOneAsync(review);

    }

    public async Task UpvoteDownvote(ObjectId newsId, ObjectId userId, int action)
    {
        if (action != 1 && action != -1 && action != 0)
            throw new ArgumentException("Action must be either 1 (upvote), -1 (downvote) or 0 (remove vote).");

        var collection = MongoSessionManager.GetCollection<News>("news");

        var existingAction = await collection.Find(n => n.Id == newsId)
            .Project(n => n.CommunityNote!.Reactions.Where(r => r.UserId == userId).Select(r => r.Action).FirstOrDefault())
            .FirstOrDefaultAsync();

        if (existingAction != 0)
        {
            var updateExisting = Builders<News>.Update.Combine(
                Builders<News>.Update.PullFilter(n => n.CommunityNote!.Reactions, r => r.UserId == userId),
                Builders<News>.Update.Inc(n => existingAction == 1 ? n.CommunityNote!.Upvotes : n.CommunityNote!.Downvotes, -1)
            );
            await collection.UpdateOneAsync(n => n.Id == newsId, updateExisting);
        }

        if (action != 0)
        {
            var update = Builders<News>.Update.Combine(
                Builders<News>.Update.Push(n => n.CommunityNote!.Reactions, new Reaction { UserId = userId, Action = action }),
                Builders<News>.Update.Inc(n => action == 1 ? n.CommunityNote!.Upvotes : n.CommunityNote!.Downvotes, 1)
            );

            await collection.UpdateOneAsync(n => n.Id == newsId, update);
        }

    }

}
