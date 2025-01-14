namespace NewsGator.Dtos; 
public class CropImageDto {
    public required string ImageName { get; set; }
    public double Top { get; set; }
    public double Left { get; set; }
    public double Bottom { get; set; }
    public double Right { get; set; }
}
