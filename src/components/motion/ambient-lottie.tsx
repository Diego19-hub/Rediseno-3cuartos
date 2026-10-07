"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import type { AnimationItem } from "lottie-web";
import styles from "./ambient-lottie.module.css";

function subscribeToReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribeToMobile(callback: () => void) {
  const query = window.matchMedia("(max-width: 767px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getMobileSnapshot() {
  return window.matchMedia("(max-width: 767px)").matches;
}

type AmbientLottieProps = {
  animationData?: object;
  src?: string;
  mobileSrc?: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  playbackSpeed?: number;
  mobilePlaybackSpeed?: number;
  "aria-hidden"?: boolean;
  decorative?: boolean;
  respectReducedMotion?: boolean;
  ariaLabel?: string;
};

export function AmbientLottie({
  animationData,
  src,
  mobileSrc,
  className,
  loop = true,
  autoplay = true,
  playbackSpeed = 1,
  mobilePlaybackSpeed,
  "aria-hidden": ariaHidden,
  decorative = true,
  respectReducedMotion = true,
  ariaLabel,
}: AmbientLottieProps) {
  const host = useRef<HTMLDivElement>(null);
  const animation = useRef<AnimationItem | null>(null);
  const isMobile = useSyncExternalStore(subscribeToMobile, getMobileSnapshot, () => false);
  const prefersReducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotionSnapshot, () => true);
  const shouldAnimate = !respectReducedMotion || !prefersReducedMotion;

  useEffect(() => {
    const container = host.current;
    const selectedSrc = isMobile ? mobileSrc ?? src : src;
    if (!container || (!animationData && !selectedSrc)) return;

    let disposed = false;
    let loading = false;
    let observer: IntersectionObserver | undefined;
    let currentAnimation: AnimationItem | null = null;

    const load = async () => {
      loading = true;
      try {
        const { default: lottie } = await import("lottie-web");
        if (disposed) return;

        currentAnimation = lottie.loadAnimation({
          container,
          renderer: "svg",
          loop,
          autoplay: false,
          ...(animationData ? { animationData } : { path: selectedSrc }),
        });
        currentAnimation.setSpeed(isMobile && mobilePlaybackSpeed !== undefined ? mobilePlaybackSpeed : playbackSpeed);
        animation.current = currentAnimation;
        if (shouldAnimate && autoplay) currentAnimation.play();
        else currentAnimation.goToAndStop(0, true);
      } catch {
        currentAnimation = null;
      } finally {
        loading = false;
      }
    };

    const start = () => {
      if (currentAnimation) {
        if (shouldAnimate && autoplay) currentAnimation.play();
        else currentAnimation.goToAndStop(0, true);
      } else if (!loading) {
        void load();
      }
    };

    if (typeof IntersectionObserver === "undefined") {
      start();
    } else {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) start();
        else currentAnimation?.pause();
      }, { rootMargin: "120px" });
      observer.observe(container);
    }

    return () => {
      disposed = true;
      observer?.disconnect();
      currentAnimation?.destroy();
      animation.current = null;
    };
  }, [animationData, autoplay, isMobile, loop, mobilePlaybackSpeed, mobileSrc, playbackSpeed, shouldAnimate, src]);

  return (
    <div
      ref={host}
      className={`${styles.root}${className ? ` ${className}` : ""}`}
      aria-hidden={ariaHidden ?? decorative}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : ariaLabel}
    />
  );
}
