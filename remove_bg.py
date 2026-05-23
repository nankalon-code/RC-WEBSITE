import sys
from PIL import Image, ImageFilter

def remove_background(input_path, output_path, tolerance=32, feather_radius=2):
    # Load image
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    
    # Sample background color from top-left pixel
    bg_color = img.getpixel((0, 0))[:3]
    print(f"Sampled background color: {bg_color}")
    
    # Create mask based on tolerance
    data = img.getallpixels() if hasattr(img, 'getallpixels') else list(img.getdata())
    new_data = []
    
    for item in data:
        r, g, b, a = item
        # Calculate color distance
        dist = ((r - bg_color[0]) ** 2 + (g - bg_color[1]) ** 2 + (b - bg_color[2]) ** 2) ** 0.5
        
        if dist < tolerance:
            # Completely background
            new_data.append((0, 0, 0, 0))
        elif dist < tolerance + 15:
            # Semi-transparent border for feathering
            ratio = (dist - tolerance) / 15
            alpha = int(255 * ratio)
            new_data.append((r, g, b, alpha))
        else:
            # Foreground
            new_data.append((r, g, b, 255))
            
    img.putdata(new_data)
    
    # Bounding box crop
    # Find bounding box of non-transparent pixels
    alpha_channel = img.split()[3]
    bbox = alpha_channel.getbbox()
    if bbox:
        # Add 10px padding
        padded_bbox = (
            max(0, bbox[0] - 10),
            max(0, bbox[1] - 10),
            min(width, bbox[2] + 10),
            min(height, bbox[3] + 10)
        )
        img = img.crop(padded_bbox)
        print(f"Cropped image to bbox: {padded_bbox}")
    
    # Save the processed transparent image
    img.save(output_path, "PNG")
    print(f"Successfully processed image and saved to {output_path}")

if __name__ == "__main__":
    remove_background(
        input_path=r"c:\Users\APOORVA JHA\OneDrive\Desktop\Games ig\GAME PN\robotics-club\public\new_robot_raw.png",
        output_path=r"c:\Users\APOORVA JHA\OneDrive\Desktop\Games ig\GAME PN\robotics-club\public\new_robot.png",
        tolerance=40
    )
