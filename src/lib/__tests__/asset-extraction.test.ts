/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  extractAssetsFromBody,
  getFirstAssetFromBody,
  countImagesInBody,
  hasImagesInBody,
} from '../asset-extraction';
import type { PortableTextBlockType } from '@/sanity/sanity';

describe('Asset Extraction Utility', () => {
  describe('extractAssetsFromBody', () => {
    it('should return empty array for null or undefined body', () => {
      expect(extractAssetsFromBody(null as any)).toEqual([]);
      expect(extractAssetsFromBody(undefined as any)).toEqual([]);
    });

    it('should return empty array for non-array body', () => {
      expect(extractAssetsFromBody({} as any)).toEqual([]);
      expect(extractAssetsFromBody('string' as any)).toEqual([]);
    });

    it('should extract direct image blocks', () => {
      const body: PortableTextBlockType[] = [
        {
          _type: 'image',
          _key: 'img1',
          asset: {
            _ref: 'image-123',
            _type: 'reference',
          },
          alt: 'Test image',
          caption: 'Test caption',
        } as any,
      ];

      const assets = extractAssetsFromBody(body);

      expect(assets).toHaveLength(1);
      expect(assets[0].alt).toBe('Test image');
      expect(assets[0].caption).toBe('Test caption');
      expect(assets[0].index).toBe(0);
    });

    it('should extract multiple image blocks', () => {
      const body: PortableTextBlockType[] = [
        {
          _type: 'image',
          _key: 'img1',
          asset: {
            _ref: 'image-123',
            _type: 'reference',
          },
          alt: 'First image',
        } as any,
        {
          _type: 'block',
          _key: 'block1',
          children: [{ _type: 'span', text: 'Some text' }],
        } as any,
        {
          _type: 'image',
          _key: 'img2',
          asset: {
            _ref: 'image-456',
            _type: 'reference',
          },
          alt: 'Second image',
        } as any,
      ];

      const assets = extractAssetsFromBody(body);

      expect(assets).toHaveLength(2);
      expect(assets[0].alt).toBe('First image');
      expect(assets[1].alt).toBe('Second image');
    });

    it('should provide default alt text when missing', () => {
      const body: PortableTextBlockType[] = [
        {
          _type: 'image',
          _key: 'img1',
          asset: {
            _ref: 'image-123',
            _type: 'reference',
          },
        } as any,
      ];

      const assets = extractAssetsFromBody(body);

      expect(assets).toHaveLength(1);
      expect(assets[0].alt).toBe('Blog image 1');
    });

    it('should skip invalid image blocks', () => {
      const body: PortableTextBlockType[] = [
        {
          _type: 'image',
          _key: 'img1',
          // Missing asset property
        } as any,
        {
          _type: 'image',
          _key: 'img2',
          asset: {
            // Missing _ref
            _type: 'reference',
          },
        } as any,
        {
          _type: 'image',
          _key: 'img3',
          asset: {
            _ref: 'image-123',
            _type: 'reference',
          },
          alt: 'Valid image',
        } as any,
      ];

      const assets = extractAssetsFromBody(body);

      expect(assets).toHaveLength(1);
      expect(assets[0].alt).toBe('Valid image');
    });

    it('should handle malformed blocks gracefully', () => {
      const body: PortableTextBlockType[] = [
        null as any,
        undefined as any,
        'string' as any,
        123 as any,
        {
          _type: 'image',
          _key: 'img1',
          asset: {
            _ref: 'image-123',
            _type: 'reference',
          },
          alt: 'Valid image',
        } as any,
      ];

      const assets = extractAssetsFromBody(body);

      expect(assets).toHaveLength(1);
      expect(assets[0].alt).toBe('Valid image');
    });

    it('should handle errors and return empty array', () => {
      const body: PortableTextBlockType[] = [
        {
          _type: 'image',
          _key: 'img1',
          get asset() {
            throw new Error('Test error');
          },
        } as any,
      ];

      const assets = extractAssetsFromBody(body);

      expect(assets).toEqual([]);
    });
  });

  describe('getFirstAssetFromBody', () => {
    it('should return the first image from body', () => {
      const body: PortableTextBlockType[] = [
        {
          _type: 'block',
          _key: 'block1',
          children: [{ _type: 'span', text: 'Text' }],
        } as any,
        {
          _type: 'image',
          _key: 'img1',
          asset: {
            _ref: 'image-123',
            _type: 'reference',
          },
          alt: 'First image',
        } as any,
        {
          _type: 'image',
          _key: 'img2',
          asset: {
            _ref: 'image-456',
            _type: 'reference',
          },
          alt: 'Second image',
        } as any,
      ];

      const firstAsset = getFirstAssetFromBody(body);

      expect(firstAsset).not.toBeNull();
      expect(firstAsset?.alt).toBe('First image');
    });

    it('should return null when no images exist', () => {
      const body: PortableTextBlockType[] = [
        {
          _type: 'block',
          _key: 'block1',
          children: [{ _type: 'span', text: 'Text' }],
        } as any,
      ];

      const firstAsset = getFirstAssetFromBody(body);

      expect(firstAsset).toBeNull();
    });

    it('should return null for empty body', () => {
      const firstAsset = getFirstAssetFromBody([]);

      expect(firstAsset).toBeNull();
    });
  });

  describe('countImagesInBody', () => {
    it('should return 0 for empty body', () => {
      expect(countImagesInBody([])).toBe(0);
    });

    it('should count all images correctly', () => {
      const body: PortableTextBlockType[] = [
        {
          _type: 'image',
          _key: 'img1',
          asset: {
            _ref: 'image-123',
            _type: 'reference',
          },
        } as any,
        {
          _type: 'block',
          _key: 'block1',
          children: [{ _type: 'span', text: 'Text' }],
        } as any,
        {
          _type: 'image',
          _key: 'img2',
          asset: {
            _ref: 'image-456',
            _type: 'reference',
          },
        } as any,
        {
          _type: 'image',
          _key: 'img3',
          asset: {
            _ref: 'image-789',
            _type: 'reference',
          },
        } as any,
      ];

      expect(countImagesInBody(body)).toBe(3);
    });

    it('should return 0 for body with no images', () => {
      const body: PortableTextBlockType[] = [
        {
          _type: 'block',
          _key: 'block1',
          children: [{ _type: 'span', text: 'Text' }],
        } as any,
      ];

      expect(countImagesInBody(body)).toBe(0);
    });
  });

  describe('hasImagesInBody', () => {
    it('should return true when images exist', () => {
      const body: PortableTextBlockType[] = [
        {
          _type: 'image',
          _key: 'img1',
          asset: {
            _ref: 'image-123',
            _type: 'reference',
          },
        } as any,
      ];

      expect(hasImagesInBody(body)).toBe(true);
    });

    it('should return false when no images exist', () => {
      const body: PortableTextBlockType[] = [
        {
          _type: 'block',
          _key: 'block1',
          children: [{ _type: 'span', text: 'Text' }],
        } as any,
      ];

      expect(hasImagesInBody(body)).toBe(false);
    });

    it('should return false for empty body', () => {
      expect(hasImagesInBody([])).toBe(false);
    });
  });
});
