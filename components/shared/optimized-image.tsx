'use client';

// Next.js 15 Optimized Image Component
import Image from 'next/image';
import { cn } from '@/lib/utils/utils';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onError?: () => void;
  fallbackSrc?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  onError,
  fallbackSrc,
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [imageError, setImageError] = useState(false);

  // Default sizes for responsive images
  const defaultSizes = sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';

  const handleImageError = () => {
    if (fallbackSrc && !imageError) {
      setImageSrc(fallbackSrc);
      setImageError(true);
    }
    onError?.();
  };

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      priority={priority}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      sizes={fill ? defaultSizes : undefined}
      className={cn('object-cover', className)}
      onError={handleImageError}
      {...props}
    />
  );
}

// Example usage components for common patterns
export function HeroImage({
  src,
  alt,
  className,
  fallbackSrc = '/mountain_bg.png',
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      priority
      quality={90}
      className={cn('object-cover', className)}
      sizes="100vw"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      fallbackSrc={fallbackSrc}
      onError={() => console.warn(`Failed to load hero image: ${src}`)}
    />
  );
}

export function ProfileImage({
  src,
  alt,
  size = 40,
  className,
  fallbackSrc = '/white_logo.png',
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  fallbackSrc?: string;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn('rounded-full', className)}
      quality={80}
      fallbackSrc={fallbackSrc}
    />
  );
}

export function VehicleImage({
  src,
  alt,
  className,
  fallbackSrc = '/trucksz_splash.png',
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={400}
      height={300}
      className={cn('rounded-lg', className)}
      quality={85}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
      fallbackSrc={fallbackSrc}
    />
  );
}
