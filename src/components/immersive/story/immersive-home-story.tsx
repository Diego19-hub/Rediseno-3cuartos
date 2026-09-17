"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Service } from "@/types/wordpress";
import { ImmersiveHome } from "../immersive-home";
import styles from "./immersive-home-story.module.css";

const StoryCanvas = dynamic(() => import("./story-canvas"), { ssr: false, loading: () => null });

type StoryPointer = { x: number; y: number };

export function ImmersiveHomeStory(props: { services: Service[]; ctaLabel: string; ctaUrl: string; showProjects?: boolean }) {
  const [isClient, setIsClient] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const pointer = useRef<StoryPointer>({ x: 0, y: 0 });

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const mount = window.setTimeout(() => { setIsClient(true); setIsDesktop(media.matches); }, 0);
    const update = () => setIsDesktop(media.matches);
    media.addEventListener("change", update);
    return () => { window.clearTimeout(mount); media.removeEventListener("change", update); };
  }, []);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
    pointer.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
  };

  return (
    <div className={styles.storyPage} onPointerMove={onPointerMove}>
      <ImmersiveHome {...props} />
      {isClient && isDesktop && <div className={styles.storyCanvas} aria-hidden="true"><StoryCanvas pointer={pointer} /></div>}
    </div>
  );
}
