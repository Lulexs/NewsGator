using NewsGator.Dtos;
using System.Drawing;
using System.IO;
using System.Runtime.Versioning;

namespace NewsGator.Services; 
public static class ImageService {

    [SupportedOSPlatform("Windows")]
    public static void CropImage(CropImageDto dto) {
        string filePath = $@"..\..\Images\{dto.ImageName}.png";

        if (!File.Exists(filePath)) {
            throw new FileNotFoundException("Image not found at the specified path", filePath);
        }

        using Image originalImage = Image.FromFile(filePath);

        if (dto.Left < 0 || dto.Top < 0 || dto.Right < 0 || dto.Bottom < 0 ||
            dto.Left + dto.Right >= originalImage.Width ||
            dto.Top + dto.Bottom >= originalImage.Height) {
            throw new ArgumentException("Invalid crop coordinates");
        }


        Rectangle cropRectangle = new((int)dto.Left, (int)dto.Top,
                                      (int)(dto.Right - dto.Left),
                                      (int)(dto.Bottom - dto.Top));
        using Bitmap croppedBitmap = new Bitmap(cropRectangle.Width, cropRectangle.Height);
        using Graphics g = Graphics.FromImage(croppedBitmap);
        g.DrawImage(originalImage, new Rectangle(0, 0, croppedBitmap.Width, croppedBitmap.Height), cropRectangle, GraphicsUnit.Pixel);
        originalImage.Dispose();
        croppedBitmap.Save(filePath);
    }
}
