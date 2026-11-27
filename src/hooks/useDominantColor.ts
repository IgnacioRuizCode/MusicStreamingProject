import { useEffect, useState } from 'react';
import { FastAverageColor } from 'fast-average-color';

const DEFAULT_COLOR = 'rgba(79, 70, 229, 0.58)';

function toCorsSafeUrl(url: string): string {
  if (url.includes('mzstatic.com')) {
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=100&h=100`;
  }
  return url;
}

export function useDominantColor(imageUrl?: string, fallback = DEFAULT_COLOR): string {
  const [resolved, setResolved] = useState<{ url: string; color: string } | null>(null);

  useEffect(() => {
    if (!imageUrl) return;

    let isCancelled = false;
    const fac = new FastAverageColor();
    const targetUrl = toCorsSafeUrl(imageUrl);

    fac
      .getColorAsync(targetUrl, {
        algorithm: 'dominant',
        crossOrigin: 'anonymous',
      })
      .then((result) => {
        if (isCancelled) return;
        const [r, g, b] = result.value;
        setResolved({ url: imageUrl, color: `rgba(${r}, ${g}, ${b}, 0.68)` });
      })
      .catch(() => {
        if (!isCancelled) {
          setResolved({ url: imageUrl, color: fallback });
        }
      });

    return () => {
      isCancelled = true;
      fac.destroy();
    };
  }, [imageUrl, fallback]);

  if (!imageUrl || resolved?.url !== imageUrl) {
    return fallback;
  }

  return resolved.color;
}