# Fallback Header Images

This folder should contain 4 fallback header images for blog posts:

## Required Files:
- `Blog_header_fallback_asset1.jpg`
- `Blog_header_fallback_asset2.jpg` 
- `Blog_header_fallback_asset3.jpg`
- `Blog_header_fallback_asset4.jpg`

## Specifications:
- **Dimensions**: 1200x600 pixels (2:1 aspect ratio)
- **Format**: JPG or WebP for optimal performance
- **Size**: Keep under 200KB for fast loading
- **Content**: Generic, professional images suitable for any blog post
- **Style**: Should match the overall design aesthetic of the website

## Usage:
These images are automatically selected at random when:
1. A blog post has no `mainImage` defined
2. No images are found in the post body content
3. The system needs a fallback header image

The FallbackImageManager utility handles the random selection and error handling for these images.