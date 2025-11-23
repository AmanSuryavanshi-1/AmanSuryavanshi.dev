'use client';

import React from 'react';

interface AutoPlayVideoProps {
  videoUrl: string;
  alt?: string;
  caption?: string;
}

export default function AutoPlayVideo({ videoUrl, alt, caption }: AutoPlayVideoProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {
              // Autoplay might be blocked by browser policy
              console.log('Autoplay prevented by browser policy');
            });
          } else {
            videoRef.current?.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    const currentVideoRef = videoRef.current;

    if (currentVideoRef) {
      observer.observe(currentVideoRef);
    }

    return () => {
      if (currentVideoRef) {
        observer.unobserve(currentVideoRef);
      }
    };
  }, []);

  return (
    <figure className="my-8">
      <div className="flex justify-center">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          className="w-[60%] h-auto rounded-3xl border-4 border-white shadow-xl shadow-sage-300"
          title={alt}
          playsInline
          preload="metadata"
          muted
          loop
        >
          <track kind="captions" />
          Your browser does not support the video tag.
        </video>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-forest-700">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
