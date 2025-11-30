'use client';
import React from 'react';
import Image from 'next/image';
import AmanSuryavanshi from '../../../public/Profile/me main.png';

const ProfileImage = () => {
  return (
    <figure className="relative group w-full h-[270px] max-w-sm mx-auto">
      <div 
        className="absolute inset-0 rounded-2xl bg-lime-500 transform rotate-6 group-hover:rotate-[10deg] transition-transform duration-300"
        aria-hidden="true"
      />
      <div className="relative h-full overflow-hidden rounded-2xl">
        <Image
          src={AmanSuryavanshi}
          alt="Aman Suryavanshi - Web Developer and UI/UX Designer"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority
          className="object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
          quality={90}
        />
      </div>
      <figcaption className="sr-only">
        Profile photo of Aman Suryavanshi, Web Developer and UI/UX Designer
      </figcaption>
    </figure>
  );
};

export default ProfileImage;