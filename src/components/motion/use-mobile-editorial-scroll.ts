"use client";

import { useReducedMotion, useScroll } from "framer-motion";
import { useRef, useSyncExternalStore } from "react";

const mobileViewportSubscribers = new Set<() => void>();
let mobileViewportQuery: MediaQueryList | null = null;

function getMobileViewportQuery() {
  mobileViewportQuery ??= window.matchMedia("(max-width: 767px)");
  return mobileViewportQuery;
}

function notifyMobileViewportSubscribers() {
  mobileViewportSubscribers.forEach((subscriber) => subscriber());
}

function subscribeToMobileViewport(subscriber: () => void) {
  if (typeof window === "undefined") return () => undefined;
  mobileViewportSubscribers.add(subscriber);
  if (mobileViewportSubscribers.size === 1) getMobileViewportQuery().addEventListener("change", notifyMobileViewportSubscribers);
  return () => {
    mobileViewportSubscribers.delete(subscriber);
    if (mobileViewportSubscribers.size === 0) getMobileViewportQuery().removeEventListener("change", notifyMobileViewportSubscribers);
  };
}

function getIsMobileViewport() {
  return typeof window !== "undefined" && getMobileViewportQuery().matches;
}

function getServerMobileViewport() {
  return false;
}

export function useIsMobileEditorialViewport() {
  return useSyncExternalStore(subscribeToMobileViewport, getIsMobileViewport, getServerMobileViewport);
}

export function useMobileEditorialScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const isMobileViewport = useIsMobileEditorialViewport();
  const prefersReducedMotion = useReducedMotion() === true;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "end 0.15"],
  });

  return [ref, scrollYProgress, prefersReducedMotion || !isMobileViewport] as const;
}
