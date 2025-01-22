namespace NewsGator.Dtos;

public class UpdateSubscriptionDto
{
    public List<string>? Authors { get; set; }
    public List<string>? News { get; set; }
    public List<string>? Categories { get; set; }

    public override string ToString()
    {
        return $"Authors: [{string.Join(", ", Authors ?? [])}], " +
               $"News: [{string.Join(", ", News ?? [])}], " +
               $"Categories: [{string.Join(", ", Categories ?? [])}]";
    }
}

public class UpdateUserDto
{
    public required string Id { get; set; }
    public string? Avatar { get; set; }
    public string? Email { get; set; }
    public UpdateSubscriptionDto? Subscriptions { get; set; }
    public List<string>? Bookmarks { get; set; }

    public override string ToString()
    {
        return $"Id: {Id}, " +
               $"Avatar: {(string.IsNullOrEmpty(Avatar) ? "None" : Avatar)}, " +
               $"Email: {(string.IsNullOrEmpty(Email) ? "None" : Email)}, " +
               $"Subscriptions: {(Subscriptions == null ? "None" : Subscriptions.ToString())}, " +
               $"Bookmarks: [{string.Join(", ", Bookmarks ?? [])}]";
    }
}
