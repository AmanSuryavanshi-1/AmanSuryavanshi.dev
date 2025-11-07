/**
 * FallbackImageManager - Manages fallback header images for blog posts
 * Provides random selection from predefined fallback images
 */

export interface FallbackImage {
  filename: string;
  alt: string;
  path: string;
}

export class FallbackImageManager {
  private static readonly fallbackImages: FallbackImage[] = [
    {
      filename: 'Blog_header_fallback_asset1.jpeg',
      alt: 'Default blog header image 1',
      path: '/Blog/Blog_header_fallback_asset1.jpeg'
    },
    {
      filename: 'Blog_header_fallback_asset2.jpeg', 
      alt: 'Default blog header image 2',
      path: '/Blog/Blog_header_fallback_asset2.jpeg'
    },
    {
      filename: 'Blog_header_fallback_asset3.jpeg',
      alt: 'Default blog header image 3', 
      path: '/Blog/Blog_header_fallback_asset3.jpeg'
    }
  ];

  /**
   * Get a random fallback image from the available set
   * @returns {FallbackImage} A randomly selected fallback image
   */
  static getRandomFallback(): FallbackImage {
    try {
      const randomIndex = Math.floor(Math.random() * this.fallbackImages.length);
      return this.fallbackImages[randomIndex];
    } catch (error) {
      console.error('Error selecting random fallback image:', error);
      // Return first fallback as ultimate fallback
      return this.fallbackImages[0];
    }
  }

  /**
   * Get all available fallback images
   * @returns {FallbackImage[]} Array of all fallback images
   */
  static getAllFallbacks(): FallbackImage[] {
    return [...this.fallbackImages];
  }

  /**
   * Check if a fallback image exists by filename
   * @param filename - The filename to check
   * @returns {boolean} True if the fallback exists
   */
  static hasFallback(filename: string): boolean {
    return this.fallbackImages.some(img => img.filename === filename);
  }

  /**
   * Get fallback image by filename
   * @param filename - The filename to find
   * @returns {FallbackImage | null} The fallback image or null if not found
   */
  static getFallbackByFilename(filename: string): FallbackImage | null {
    return this.fallbackImages.find(img => img.filename === filename) || null;
  }

  /**
   * Get ultimate fallback when all else fails (inline SVG)
   * @returns {string} Data URL for inline SVG fallback
   */
  static getUltimateFallback(): string {
    const svg = `
      <svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle">
          Blog Post
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }
}