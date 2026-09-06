"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (prefersReducedMotion.matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      smoothWheel: true,
      duration: 1.15,
    });

    let frame = 0;
    let lastScrollY = window.scrollY;
    const targetScales = new WeakMap<HTMLImageElement, number>();
    const renderedScales = new WeakMap<HTMLImageElement, number>();

    const images = () => document.querySelectorAll<HTMLImageElement>("img:not([data-no-scroll-zoom])");

    const prepareImage = (image: HTMLImageElement) => {
      if (targetScales.has(image)) return;

      targetScales.set(image, 1);
      renderedScales.set(image, 1);
      image.style.transform = "scale(1)";
      image.style.transformOrigin = "center center";
      image.style.willChange = "transform";
    };

    images().forEach(prepareImage);

    const animateImageZoom = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      const currentImages = images();

      currentImages.forEach(prepareImage);

      if (Math.abs(scrollDelta) > 0.01) {
        const viewportHeight = window.innerHeight;

        currentImages.forEach((image) => {
          const frameElement = image.parentElement ?? image;
          const rect = frameElement.getBoundingClientRect();

          if (rect.bottom > 0 && rect.top < viewportHeight) {
            const currentTarget = targetScales.get(image) ?? 1;
            const nextTarget = Math.min(1.035, Math.max(1, currentTarget + scrollDelta * 0.00014));

            targetScales.set(image, nextTarget);
          }
        });
      }

      currentImages.forEach((image) => {
        const targetScale = targetScales.get(image) ?? 1;
        const renderedScale = renderedScales.get(image) ?? 1;
        const easedScale = renderedScale + (targetScale - renderedScale) * 0.065;

        renderedScales.set(image, easedScale);
        image.style.transform = `scale(${easedScale.toFixed(4)})`;
      });

      lastScrollY = currentScrollY;
      frame = requestAnimationFrame(animateImageZoom);
    };

    frame = requestAnimationFrame(animateImageZoom);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
