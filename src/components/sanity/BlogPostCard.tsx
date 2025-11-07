import Link from 'next/link';
import Image from 'next/image';
import { BsEye } from 'react-icons/bs';
import { BiTime } from 'react-icons/bi';
import { format } from 'date-fns';
import { urlFor } from '@/sanity/lib/image';
import type { Post, PortableTextBlockType } from '@/sanity/sanity';
import { calculateReadTime } from './calculateReadTime';
import ViewCounter from './ViewCounter';
import { getFirstAssetFromBody } from '@/lib/asset-extraction';
import { FallbackImageManager } from '@/lib/fallback-image-manager';

interface BlogPostCardProps {
  post: Post;
  priority?: boolean;
}

const extractTextFromBody = (body: PortableTextBlockType[] | undefined): string => {
  if (!body) return '';

  let text = '';
  body.forEach(block => {
    if (block._type === 'block') {
      block.children.forEach((child) => {
        if (child._type === 'span' && child.text) {
          text += child.text + ' ';
        }
      });
    }
  });

  return text.trim().slice(0, 200) + (text.length > 200 ? '...' : '');
};

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, priority = false }) => {
  const readTime = calculateReadTime(post.body);

  // Smart header image selection: mainImage → first asset → fallback
  const getCardImage = () => {
    if (post.mainImage) {
      return {
        url: urlFor(post.mainImage).url(),
        alt: post.mainImage.alt || post.title
      };
    }

    const firstAsset = getFirstAssetFromBody(post.body);
    if (firstAsset) {
      return {
        url: urlFor(firstAsset.image).url(),
        alt: firstAsset.alt || post.title
      };
    }

    const fallback = FallbackImageManager.getRandomFallback();
    return {
      url: fallback.path,
      alt: fallback.alt
    };
  };

  const cardImage = getCardImage();

  return (
    <Link href={`/blogs/${post.slug.current}`} className="group">
      <article className="overflow-hidden rounded-3xl border-4 border-white backdrop-blur-sm shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white">
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={cardImage.url}
            alt={cardImage.alt}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {post.categories && post.categories.length > 0 && (
            <div className="absolute z-10 top-3 right-3 flex flex-wrap gap-2">
              {post.categories.map(category => (
                <span
                  key={category._id}
                  className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium bg-forest-900 border-2 bg-opacity-80 border-white text-sage-100 backdrop-blur-sm rounded-full group-hover:bg-lime-500 group-hover:text-forest-900 transition-colors duration-300"
                >
                  {category.title}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 sm:p-5 py-6 sm:py-7">
          <h2 className="text-lg line-clamp-1 sm:text-xl font-bold text-forest-900 group-hover:text-lime-500 transition-colors duration-300 mb-2">
            {post.title}
          </h2>
          <p className="text-forest-700 text-xs sm:text-sm line-clamp-4 mb-4">
            {extractTextFromBody(post.body)}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 border-t-2 border-gray-100 pt-4">
            <div className="flex items-center space-x-3">
              {post.author?.image && (
                <Image
                  src={urlFor(post.author.image).url()}
                  alt={post.author.name || 'Author'}
                  width={24}
                  height={24}
                  className="rounded-full ring-2 ring-lime-500 bg-lime-500 sm:w-7 sm:h-7"
                />
              )}
              <div>
                <p className="text-[11px] sm:text-xs font-medium text-forest-900">{post.author?.name}</p>
                <p className="text-[10px] sm:text-xs text-forest-600">
                  {format(new Date(post._createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-forest-600 text-[11px] sm:text-sm">
              <span className="flex items-center gap-1">
                <BiTime className="w-3 h-3" />
                {readTime} min
              </span>
              <span className="flex items-center gap-1">
                <BsEye className="w-3 h-3" />
                <ViewCounter postId={post._id} />
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogPostCard;