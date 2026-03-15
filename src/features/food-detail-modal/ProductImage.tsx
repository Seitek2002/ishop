'use client';

import { useState } from 'react';

export const ProductImage = ({ src, alt }: { src: string; alt: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className='relative w-full aspect-4/3 md:aspect-video bg-gray-100 shrink-0'>
      {!isLoaded && (
        <div className='absolute inset-0 bg-gray-200 animate-pulse' />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};
