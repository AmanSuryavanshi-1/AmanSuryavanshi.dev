# Blog Header Fallback Images

This folder contains fallback images used when blog posts don't have a main image or any assets.

## Images Location

Fallback images are located in: `public/Blog/`

## Current Images

1. `Blog_header_fallback_asset1.jpeg`
2. `Blog_header_fallback_asset2.jpeg`
3. `Blog_header_fallback_asset3.jpeg`

## Image Specifications

- **Aspect Ratio**: 1:1 (Square images)
- **Format**: JPEG
- **Usage**: Blog headers and blog cards
- **Content**: Generic, professional images suitable for any blog post

## Usage

These images are randomly selected when:
- A blog post has no `mainImage` defined
- The post body contains no image assets
- An error occurs loading the primary image

The fallback system ensures blog cards and headers always display an image, maintaining visual consistency across the blog.

## How It Works

The system follows this priority:
1. **mainImage** - Use the post's main image if available
2. **First Asset** - Use the first image from post body content
3. **Random Fallback** - Randomly select one of the 3 fallback images
4. **Ultimate Fallback** - Use inline SVG if all else fails

## Adding More Fallback Images

To add more fallback images:
1. Add images to `public/Blog/` folder
2. Name them: `Blog_header_fallback_asset{N}.jpeg`
3. Update `src/lib/fallback-image-manager.ts` to include the new images
4. Ensure images are 1:1 aspect ratio for consistent display
