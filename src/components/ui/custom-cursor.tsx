"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./custom-cursor.module.css";

type CursorVariant = "base" | "link" | "cta" | "view" | "drag" | "native";
type Point = { x: number; y: number };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function getCursorTarget(target: EventTarget | null): HTMLElement | null {
  return target instanceof HTMLElement
    ? target.closest<HTMLElement>("a, button, input, textarea, select, [contenteditable='true'], [data-cursor]")
    : null;
}

function getVariant(element: HTMLElement | null): CursorVariant {
  if (!element) return "base";
  if (element.matches("input, textarea, select, [contenteditable='true']")) return "native";

  const declared = element.dataset.cursor;
  if (declared === "native") return "native";
  if (declared === "drag") return "drag";
  if (declared === "view" || declared === "project") return "view";
  if (declared === "cta") return "cta";

  if (element.matches("button, [role='button']")) return "cta";
  if (element instanceof HTMLAnchorElement) {
    if (element.closest("[data-cursor='drag']")) return "drag";
    if (element.closest("article") && element.pathname.includes("/casos-de-exito")) return "view";
    if (element.pathname.endsWith("/contacto") || /cta/i.test(typeof element.className === "string" ? element.className : "")) return "cta";
  }

  return "link";
}

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<Point>({ x: -100, y: -100 });
  const positionRef = useRef<Point>({ x: -100, y: -100 });
  const velocityRef = useRef<Point>({ x: 0, y: 0 });
  const lastPointerRef = useRef<Point | null>(null);
  const magnetCenterRef = useRef<Point | null>(null);
  const frameRef = useRef<number | null>(null);
  const reducedRef = useRef(false);
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("base");

  useEffect(() => {
    const pointerQuery = window.matchMedia("(pointer: fine) and (hover: hover)");
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncCapability = () => {
      reducedRef.current = reducedQuery.matches;
      setEnabled(pointerQuery.matches);
    };

    syncCapability();
    pointerQuery.addEventListener("change", syncCapability);
    reducedQuery.addEventListener("change", syncCapability);
    return () => {
      pointerQuery.removeEventListener("change", syncCapability);
      reducedQuery.removeEventListener("change", syncCapability);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    const cursor = cursorRef.current;
    if (!cursor) return undefined;

    const updateContext = (next: CursorVariant, element: HTMLElement | null) => {
      setVariant(next);
      cursor.dataset.variant = next;
      if (next === "cta" && element) {
        const rect = element.getBoundingClientRect();
        magnetCenterRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      } else {
        magnetCenterRef.current = null;
      }
    };

    const setPosition = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const next = { x: event.clientX, y: event.clientY };
      const previous = lastPointerRef.current ?? next;
      velocityRef.current.x = clamp((next.x - previous.x) * .7, -24, 24);
      velocityRef.current.y = clamp((next.y - previous.y) * .7, -24, 24);
      lastPointerRef.current = next;
      targetRef.current = next;
      cursor.style.setProperty("--cursor-visible", "1");
    };

    const setContext = (event: PointerEvent) => {
      const element = getCursorTarget(event.target);
      updateContext(getVariant(element), element);
    };

    const resetContext = (event: PointerEvent) => {
      const related = event.relatedTarget instanceof Node && event.relatedTarget instanceof HTMLElement ? getCursorTarget(event.relatedTarget) : null;
      if (related) {
        updateContext(getVariant(related), related);
        return;
      }
      updateContext("base", null);
    };

    const setPressed = (event: PointerEvent) => {
      if (event.pointerType !== "touch") cursor.dataset.pressed = "true";
    };
    const clearPressed = () => delete cursor.dataset.pressed;

    const animate = () => {
      const target = targetRef.current;
      const position = positionRef.current;
      const reduced = reducedRef.current;
      const easing = reduced ? 1 : .18;
      const magnet = !reduced && cursor.dataset.variant === "cta" ? magnetCenterRef.current : null;
      const destination = magnet
        ? { x: target.x + clamp((magnet.x - target.x) * .12, -6, 6), y: target.y + clamp((magnet.y - target.y) * .12, -6, 6) }
        : target;

      position.x += (destination.x - position.x) * easing;
      position.y += (destination.y - position.y) * easing;
      cursor.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`;

      const velocity = velocityRef.current;
      const speed = reduced ? 0 : clamp(Math.hypot(velocity.x, velocity.y) / 18, 0, 1);
      cursor.style.setProperty("--cursor-speed", speed.toFixed(3));
      cursor.style.setProperty("--cursor-angle", `${Math.atan2(velocity.y, velocity.x) || 0}rad`);
      cursor.style.setProperty("--cursor-stretch-x", (1 + speed * .18).toFixed(3));
      cursor.style.setProperty("--cursor-stretch-y", (1 - speed * .1).toFixed(3));
      velocity.x *= reduced ? 0 : .78;
      velocity.y *= reduced ? 0 : .78;
      frameRef.current = window.requestAnimationFrame(animate);
    };

    document.body.dataset.customCursor = "true";
    document.addEventListener("pointermove", setPosition, { passive: true });
    document.addEventListener("pointerover", setContext, { passive: true });
    document.addEventListener("pointerout", resetContext, { passive: true });
    document.addEventListener("pointerdown", setPressed, { passive: true });
    document.addEventListener("pointerup", clearPressed, { passive: true });
    document.addEventListener("pointercancel", clearPressed, { passive: true });
    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      document.body.removeAttribute("data-custom-cursor");
      document.removeEventListener("pointermove", setPosition);
      document.removeEventListener("pointerover", setContext);
      document.removeEventListener("pointerout", resetContext);
      document.removeEventListener("pointerdown", setPressed);
      document.removeEventListener("pointerup", clearPressed);
      document.removeEventListener("pointercancel", clearPressed);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  const label = variant === "link" ? "↗" : variant === "cta" ? "IR" : variant === "view" ? "VER" : variant === "drag" ? "DRAG" : "";

  return <div ref={cursorRef} className={styles.cursor} data-variant={variant} aria-hidden="true">
    <svg className={styles.mark} viewBox="0 0 32 32" focusable="false">
      <path className={styles.pieceOne} d="M5 14A9 9 0 0 1 14 5v9H5Z" />
      <path className={styles.pieceTwo} d="M18 5a9 9 0 0 1 9 9h-9V5Z" />
      <path className={styles.pieceThree} d="M5 18h9v9a9 9 0 0 1-9-9Z" />
      <path className={styles.emptyQuarter} d="M18 18h9a9 9 0 0 1-9 9v-9Z" />
    </svg>
    <span className={styles.label}>{label}</span>
  </div>;
}
