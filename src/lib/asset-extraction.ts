/**
 * Asset Extraction Utility - Extracts images from Sanity post body content
 * Handles various block types and nested structures safely
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import type { PortableTextBlockType, SanityImage } from '@/sanity/sanity';

export interface BodyAsset {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  caption?: string;
  _key: string;
}

export interface ExtractedAsset {
  image: SanityImage | { url: string };
  alt: string;
  caption?: string;
  index: number;
  isExternal?: boolean;
}

/**
 * Extract all images from post body content
 * @param body - The portable text body content
 * @returns {ExtractedAsset[]} Array of extracted image assets
 */
export function extractAssetsFromBody(body: PortableTextBlockType[]): ExtractedAsset[] {
  if (!body || !Array.isArray(body)) {
    console.warn('Invalid body content provided to extractAssetsFromBody');
    return [];
  }

  const extractedAssets: ExtractedAsset[] = [];
  let imageIndex = 0;

  try {
    for (const block of body) {
      if (!block || typeof block !== 'object') {
        continue;
      }

      // Handle direct image blocks (Sanity assets)
      // @ts-expect-error - Sanity block types can include image blocks not in the base type
      if (block._type === 'image' && isValidImageBlock(block)) {
        const imageBlock = block as unknown as BodyAsset;
        extractedAssets.push({
          image: {
            _type: 'image',
            asset: imageBlock.asset,
            alt: imageBlock.alt
          },
          alt: imageBlock.alt || `Blog image ${imageIndex + 1}`,
          caption: imageBlock.caption,
          index: imageIndex++,
          isExternal: false
        });
        continue;
      }

      // Handle externalImage blocks (from n8n automation)
      // @ts-expect-error - externalImage is a custom block type
      if (block._type === 'externalImage' && isValidExternalImage(block)) {
        extractedAssets.push({
          image: { url: block.url },
          alt: block.alt || `External image ${imageIndex + 1}`,
          caption: block.caption,
          index: imageIndex++,
          isExternal: true
        });
        continue;
      }

      // CATCH-ALL: Check if ANY block has a direct URL property (handles unknown block types)
      // @ts-expect-error - checking for any URL-like properties
      const directUrl = block.url || block.src || block.imageUrl;
      if (directUrl && typeof directUrl === 'string' && (directUrl.startsWith('http://') || directUrl.startsWith('https://'))) {
        extractedAssets.push({
          image: { url: directUrl },
          // @ts-expect-error - accessing dynamic properties
          alt: block.alt || `Image ${imageIndex + 1}`,
          // @ts-expect-error - accessing dynamic properties
          caption: block.caption,
          index: imageIndex++,
          isExternal: true
        });
        continue;
      }

      // Handle nested images in other block types
      if (block._type === 'block' && block.children) {
        // Some blocks might have nested image references
        extractNestedImages(block, extractedAssets, imageIndex);
      }

      // Handle custom block types that might contain images
      // @ts-expect-error - Sanity allows custom block types beyond the base types
      if (block._type && block._type !== 'block' && block._type !== 'image') {
        extractCustomBlockImages(block, extractedAssets, imageIndex);
      }
    }
  } catch (error) {
    console.error('Error extracting assets from body:', error);
    return [];
  }

  return extractedAssets;
}

/**
 * Get the first image from post body content
 * @param body - The portable text body content
 * @returns {ExtractedAsset | null} The first image found or null
 */
export function getFirstAssetFromBody(body: PortableTextBlockType[]): ExtractedAsset | null {
  const assets = extractAssetsFromBody(body);
  return assets.length > 0 ? assets[0] : null;
}

/**
 * Check if a block is a valid image block
 * Handles both referenced assets (_ref) and dereferenced assets (_id or url)
 * @param block - The block to check
 * @returns {boolean} True if it's a valid image block
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidImageBlock(block: any): boolean {
  if (!block || typeof block !== 'object' || block._type !== 'image') {
    return false;
  }

  // Check for asset object
  if (!block.asset || typeof block.asset !== 'object') {
    return false;
  }

  // Valid if asset has _ref (reference) OR _id (dereferenced) OR url (external)
  const hasRef = block.asset._ref && typeof block.asset._ref === 'string';
  const hasId = block.asset._id && typeof block.asset._id === 'string';
  const hasUrl = block.asset.url && typeof block.asset.url === 'string';

  return hasRef || hasId || hasUrl;
}

/**
 * Check if a block is a valid external image block (from n8n)
 * @param block - The block to check
 * @returns {boolean} True if it's a valid external image block
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidExternalImage(block: any): boolean {
  return (
    block &&
    typeof block === 'object' &&
    block._type === 'externalImage' &&
    block.url &&
    typeof block.url === 'string' &&
    (block.url.startsWith('http://') || block.url.startsWith('https://'))
  );
}

/**
 * Extract nested images from block children
 * @param block - The block to search
 * @param extractedAssets - Array to add found assets to
 * @param imageIndex - Current image index
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractNestedImages(
  block: any,
  extractedAssets: ExtractedAsset[],
  imageIndex: number
): void {
  try {
    if (block.children && Array.isArray(block.children)) {
      for (const child of block.children) {
        if (child && typeof child === 'object' && child._type === 'image') {
          if (isValidImageBlock(child)) {
            extractedAssets.push({
              image: {
                _type: 'image',
                asset: child.asset,
                alt: child.alt
              },
              alt: child.alt || `Nested blog image ${imageIndex + 1}`,
              caption: child.caption,
              index: imageIndex++
            });
          }
        }
      }
    }
  } catch (error) {
    console.warn('Error extracting nested images:', error);
  }
}

/**
 * Extract images from custom block types
 * @param block - The custom block to search
 * @param extractedAssets - Array to add found assets to
 * @param imageIndex - Current image index
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractCustomBlockImages(
  block: any,
  extractedAssets: ExtractedAsset[],
  imageIndex: number
): void {
  try {
    // Handle gallery blocks
    if (block._type === 'gallery' && block.images && Array.isArray(block.images)) {
      for (const image of block.images) {
        if (isValidImageBlock(image)) {
          extractedAssets.push({
            image: {
              _type: 'image',
              asset: image.asset,
              alt: image.alt
            },
            alt: image.alt || `Gallery image ${imageIndex + 1}`,
            caption: image.caption,
            index: imageIndex++
          });
        }
      }
    }

    // Handle other custom blocks that might have image properties
    const possibleImageProps = ['image', 'backgroundImage', 'featuredImage'];
    for (const prop of possibleImageProps) {
      if (block[prop] && isValidImageBlock(block[prop])) {
        extractedAssets.push({
          image: {
            _type: 'image',
            asset: block[prop].asset,
            alt: block[prop].alt
          },
          alt: block[prop].alt || `Custom block image ${imageIndex + 1}`,
          caption: block[prop].caption,
          index: imageIndex++
        });
      }
    }
  } catch (error) {
    console.warn('Error extracting custom block images:', error);
  }
}

/**
 * Count total images in post body
 * @param body - The portable text body content
 * @returns {number} Total number of images found
 */
export function countImagesInBody(body: PortableTextBlockType[]): number {
  return extractAssetsFromBody(body).length;
}

/**
 * Check if post body contains any images
 * @param body - The portable text body content
 * @returns {boolean} True if any images are found
 */
export function hasImagesInBody(body: PortableTextBlockType[]): boolean {
  return countImagesInBody(body) > 0;
}