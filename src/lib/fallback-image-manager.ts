/**
 * FallbackImageManager - Manages fallback header images for blog posts
 * Provides random selection from predefined fallback images
 */

export interface FallbackImage {
  filename: string;
  alt: string;
  path: string;
}

/**
 * Category types for intelligent fallback selection
 */
export type FallbackCategory = 'code' | 'dashboard' | 'mobile' | 'server' | 'workflow' | 'default';

/**
 * Context for inferring the appropriate fallback category
 */
export interface FallbackContext {
  title?: string;
  techStack?: string[];
  type?: string;
  projectId?: string;
}

export class FallbackImageManager {
  private static readonly fallbackImages: FallbackImage[] = [
    {
      filename: 'fallback-code.svg',
      alt: 'Code development fallback image',
      path: '/fallbacks/fallback-code.svg'
    },
    {
      filename: 'fallback-dashboard.svg',
      alt: 'Dashboard analytics fallback image',
      path: '/fallbacks/fallback-dashboard.svg'
    },
    {
      filename: 'fallback-mobile.svg',
      alt: 'Mobile development fallback image',
      path: '/fallbacks/fallback-mobile.svg'
    },
    {
      filename: 'fallback-server.svg',
      alt: 'Server infrastructure fallback image',
      path: '/fallbacks/fallback-server.svg'
    },
    {
      filename: 'fallback-workflow.svg',
      alt: 'Workflow automation fallback image',
      path: '/fallbacks/fallback-workflow.svg'
    }
  ];

  /**
   * Category to filename mapping for intelligent selection
   */
  private static readonly categoryMap: Record<FallbackCategory, string> = {
    code: 'fallback-code.svg',
    dashboard: 'fallback-dashboard.svg',
    mobile: 'fallback-mobile.svg',
    server: 'fallback-server.svg',
    workflow: 'fallback-workflow.svg',
    default: 'fallback-code.svg'
  };

  /**
   * Keywords for category inference
   */
  private static readonly categoryKeywords: Record<FallbackCategory, string[]> = {
    code: ['code', 'developer', 'programming', 'typescript', 'javascript', 'python', 'react', 'next', 'vue', 'angular'],
    dashboard: ['dashboard', 'analytics', 'charts', 'metrics', 'saas', 'admin', 'panel', 'cms'],
    mobile: ['mobile', 'app', 'ios', 'android', 'pwa', 'responsive', 'phone', 'tablet'],
    server: ['server', 'backend', 'api', 'database', 'infrastructure', 'cloud', 'docker', 'kubernetes', 'node'],
    workflow: ['workflow', 'automation', 'n8n', 'zapier', 'integration', 'pipeline', 'process', 'ai', 'agent'],
    default: []
  };

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
   * Get a fallback image by category
   * @param category - The category to get a fallback for
   * @returns {FallbackImage} The category-appropriate fallback image
   */
  static getFallbackByCategory(category: FallbackCategory): FallbackImage {
    const filename = this.categoryMap[category] || this.categoryMap.default;
    return this.getFallbackByFilename(filename) || this.fallbackImages[0];
  }

  /**
   * Infer the appropriate fallback category from context
   * @param context - Context information (title, tech stack, type, etc.)
   * @returns {FallbackCategory} The inferred category
   */
  static inferCategory(context: FallbackContext): FallbackCategory {
    const searchText = [
      context.title || '',
      context.type || '',
      context.projectId || '',
      ...(context.techStack || [])
    ].join(' ').toLowerCase();

    // Check each category for keyword matches (excluding 'default')
    const categories: FallbackCategory[] = ['workflow', 'mobile', 'server', 'dashboard', 'code'];

    for (const category of categories) {
      const keywords = this.categoryKeywords[category];
      if (keywords.some(keyword => searchText.includes(keyword))) {
        return category;
      }
    }

    return 'default';
  }

  /**
   * Get the best fallback for a given context (combines inference and selection)
   * @param context - Context information for inference
   * @returns {FallbackImage} The best matching fallback image
   */
  static getContextualFallback(context: FallbackContext): FallbackImage {
    const category = this.inferCategory(context);
    return this.getFallbackByCategory(category);
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
