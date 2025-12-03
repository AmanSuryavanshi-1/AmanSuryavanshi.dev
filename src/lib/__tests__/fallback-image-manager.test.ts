import { FallbackImageManager } from '../fallback-image-manager';

describe('FallbackImageManager', () => {
  describe('getRandomFallback', () => {
    it('should return a valid fallback image', () => {
      const fallback = FallbackImageManager.getRandomFallback();

      expect(fallback).toBeDefined();
      expect(fallback).toHaveProperty('filename');
      expect(fallback).toHaveProperty('alt');
      expect(fallback).toHaveProperty('path');
    });

    it('should return one of the predefined fallback images', () => {
      const fallback = FallbackImageManager.getRandomFallback();
      const allFallbacks = FallbackImageManager.getAllFallbacks();

      expect(allFallbacks).toContainEqual(fallback);
    });

    it('should return different images on multiple calls (probabilistic)', () => {
      const results = new Set();

      // Call 20 times to increase probability of getting different images
      for (let i = 0; i < 20; i++) {
        const fallback = FallbackImageManager.getRandomFallback();
        results.add(fallback.filename);
      }

      // With 3 fallback images and 20 calls, we should get at least 2 different ones
      expect(results.size).toBeGreaterThanOrEqual(2);
    });

    it('should handle errors gracefully and return first fallback', () => {
      // Spy on console.error to suppress error output
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Mock Math.random to throw an error
      const originalRandom = Math.random;
      Math.random = () => {
        throw new Error('Random error');
      };

      const fallback = FallbackImageManager.getRandomFallback();

      expect(fallback).toBeDefined();
      expect(fallback.filename).toBe('fallback-code.svg');

      // Restore Math.random
      Math.random = originalRandom;
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getAllFallbacks', () => {
    it('should return an array of 3 fallback images', () => {
      const fallbacks = FallbackImageManager.getAllFallbacks();

      expect(fallbacks).toHaveLength(5);
    });

    it('should return a new array instance (not the original)', () => {
      const fallbacks1 = FallbackImageManager.getAllFallbacks();
      const fallbacks2 = FallbackImageManager.getAllFallbacks();

      expect(fallbacks1).not.toBe(fallbacks2);
      expect(fallbacks1).toEqual(fallbacks2);
    });

    it('should have all required properties for each fallback', () => {
      const fallbacks = FallbackImageManager.getAllFallbacks();

      const expectedFallbacks = [
        'fallback-code.svg',
        'fallback-dashboard.svg',
        'fallback-mobile.svg',
        'fallback-server.svg',
        'fallback-workflow.svg'
      ];

      fallbacks.forEach((fallback, index) => {
        expect(fallback.filename).toBe(expectedFallbacks[index]);
        expect(fallback.alt).toContain('fallback image');
        expect(fallback.path).toBe(`/fallbacks/${expectedFallbacks[index]}`);
      });
    });
  });

  describe('hasFallback', () => {
    it('should return true for existing fallback filenames', () => {
      expect(FallbackImageManager.hasFallback('fallback-code.svg')).toBe(true);
      expect(FallbackImageManager.hasFallback('fallback-dashboard.svg')).toBe(true);
      expect(FallbackImageManager.hasFallback('fallback-mobile.svg')).toBe(true);
    });

    it('should return false for non-existing fallback filenames', () => {
      expect(FallbackImageManager.hasFallback('Blog_header_fallback_asset4.jpeg')).toBe(false);
      expect(FallbackImageManager.hasFallback('nonexistent.jpg')).toBe(false);
      expect(FallbackImageManager.hasFallback('')).toBe(false);
    });
  });

  describe('getFallbackByFilename', () => {
    it('should return the correct fallback for existing filenames', () => {
      const fallback = FallbackImageManager.getFallbackByFilename('fallback-code.svg');

      expect(fallback).not.toBeNull();
      expect(fallback?.filename).toBe('fallback-code.svg');
      expect(fallback?.path).toBe('/fallbacks/fallback-code.svg');
    });

    it('should return null for non-existing filenames', () => {
      const fallback = FallbackImageManager.getFallbackByFilename('nonexistent.jpg');

      expect(fallback).toBeNull();
    });
  });

  describe('getUltimateFallback', () => {
    it('should return a valid data URL', () => {
      const ultimateFallback = FallbackImageManager.getUltimateFallback();

      expect(ultimateFallback).toMatch(/^data:image\/svg\+xml;base64,/);
    });

    it('should return a consistent value', () => {
      const fallback1 = FallbackImageManager.getUltimateFallback();
      const fallback2 = FallbackImageManager.getUltimateFallback();

      expect(fallback1).toBe(fallback2);
    });

    it('should contain valid base64 encoded SVG', () => {
      const ultimateFallback = FallbackImageManager.getUltimateFallback();
      const base64Part = ultimateFallback.replace('data:image/svg+xml;base64,', '');

      // Decode base64 and check if it contains SVG elements
      const decoded = Buffer.from(base64Part, 'base64').toString('utf-8');

      expect(decoded).toContain('<svg');
      expect(decoded).toContain('</svg>');
      expect(decoded).toContain('Blog Post');
    });
  });
});
