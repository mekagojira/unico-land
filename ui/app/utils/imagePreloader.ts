// Image preloader utility with caching
const imageCache = new Map<string, HTMLImageElement>();
const loadingPromises = new Map<string, Promise<void>>();

export interface ImageInfo {
  url: string;
  id: number;
}

export function preloadImage(url: string): Promise<void> {
  // Return cached promise if already loading
  if (loadingPromises.has(url)) {
    return loadingPromises.get(url)!;
  }

  // Return immediately if already cached
  if (imageCache.has(url)) {
    return Promise.resolve();
  }

  // Create new loading promise
  const promise = new Promise<void>((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      imageCache.set(url, img);
      loadingPromises.delete(url);
      resolve();
    };

    img.onerror = () => {
      loadingPromises.delete(url);
      reject(new Error(`Failed to load image: ${url}`));
    };

    img.src = url;
  });

  loadingPromises.set(url, promise);
  return promise;
}

export function preloadImages(images: ImageInfo[]): Promise<void[]> {
  return Promise.all(images.map((img) => preloadImage(img.url)));
}

export function isImageCached(url: string): boolean {
  return imageCache.has(url);
}

export function getCachedImage(url: string): HTMLImageElement | undefined {
  return imageCache.get(url);
}

// Preload all hero images on module load
export const heroImages: ImageInfo[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=90",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=90",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=90",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&q=90",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=90",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=90",
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1920&q=90",
  },
];

// Start preloading immediately
if (typeof window !== "undefined") {
  preloadImages(heroImages).catch(() => {
    // Silently fail - images will load normally
  });
}
