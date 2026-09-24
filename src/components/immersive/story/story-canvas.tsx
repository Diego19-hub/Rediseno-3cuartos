"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { BRAND_BLUE, BRAND_CHARCOAL } from "@/lib/brand-colors";

type PointerRef = { current: { x: number; y: number } };
type AssemblyMode = "separated" | "assembled" | "expanded";

function extrude(shape: THREE.Shape, depth: number) {
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.045, bevelSize: 0.035, bevelSegments: 2, curveSegments: 12 });
  geometry.center();
  return geometry;
}

function makeStrategy() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.9, -0.52); shape.lineTo(-0.62, -0.72); shape.lineTo(0.66, -0.62); shape.lineTo(0.9, -0.12); shape.lineTo(0.54, 0.64); shape.lineTo(-0.18, 0.78); shape.lineTo(-0.82, 0.38); shape.closePath();
  return extrude(shape, 0.22);
}

function makeCreativity() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.7, -0.2); shape.quadraticCurveTo(-0.58, -0.82, 0.1, -0.7); shape.quadraticCurveTo(0.82, -0.56, 0.72, 0.08); shape.quadraticCurveTo(0.62, 0.72, -0.04, 0.66); shape.quadraticCurveTo(-0.72, 0.58, -0.7, -0.2); shape.closePath();
  return extrude(shape, 0.16);
}

function makeTechnology() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.76, -0.7); shape.lineTo(0.12, -0.7); shape.lineTo(0.12, -0.36); shape.lineTo(0.76, -0.36); shape.lineTo(0.76, 0.24); shape.lineTo(0.34, 0.24); shape.lineTo(0.34, 0.7); shape.lineTo(-0.76, 0.7); shape.lineTo(-0.76, 0.18); shape.lineTo(-0.28, 0.18); shape.lineTo(-0.28, -0.18); shape.lineTo(-0.76, -0.18); shape.closePath();
  return extrude(shape, 0.25);
}

const modePositions: Record<AssemblyMode, [[number, number, number], [number, number, number], [number, number, number]]> = {
  separated: [[-2.05, 1.02, 0], [1.9, 1.02, -0.08], [0, -1.62, 0.08]],
  assembled: [[-1.52, 0.56, 0], [1.4, 0.56, -0.05], [0, -1.14, 0.08]],
  expanded: [[-1.84, 0.8, 0], [1.7, 0.8, -0.08], [0, -1.42, 0.08]],
};

function Pieces({ pointer, reducedMotion }: { pointer: PointerRef; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const strategy = useRef<THREE.Mesh>(null);
  const creativity = useRef<THREE.Mesh>(null);
  const technology = useRef<THREE.Mesh>(null);
  const sweepLight = useRef<THREE.PointLight>(null);
  const sweepArea = useRef<THREE.RectAreaLight>(null);
  const geometry = useMemo(() => ({ strategy: makeStrategy(), creativity: makeCreativity(), technology: makeTechnology() }), []);
  const [mode, setMode] = useState<AssemblyMode>("assembled");

  useEffect(() => {
    if (reducedMotion) return;
    const modes: AssemblyMode[] = ["separated", "assembled", "expanded"];
    let index = 1;
    const timer = window.setInterval(() => { index = (index + 1) % modes.length; setMode(modes[index]); }, 5200);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (!reducedMotion && sweepLight.current) {
      const cycle = (state.clock.elapsedTime * 0.22) % 3;
      const index = Math.floor(cycle);
      const progress = cycle - index;
      const eased = progress * progress * (3 - 2 * progress);
      const from = modePositions.assembled[index];
      const to = modePositions.assembled[(index + 1) % 3];
      sweepLight.current.position.set(THREE.MathUtils.lerp(from[0], to[0], eased), THREE.MathUtils.lerp(from[1], to[1], eased), 1.65);
      sweepLight.current.intensity = 2.25 + Math.sin(progress * Math.PI) * 0.85;
      if (sweepArea.current) {
        sweepArea.current.position.copy(sweepLight.current.position);
        sweepArea.current.intensity = 2.15 + Math.sin(progress * Math.PI) * 1.1;
      }
    }
    if (reducedMotion) return;
    group.current.rotation.y += delta * 0.018;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, pointer.current.y * 0.08, 3, delta);
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, -pointer.current.x * 0.05, 3, delta);
    const targets = modePositions[mode];
    [strategy, creativity, technology].forEach((piece, index) => {
      if (!piece.current) return;
      const [x, y, z] = targets[index];
      piece.current.position.x = THREE.MathUtils.damp(piece.current.position.x, x, 2.2, delta);
      piece.current.position.y = THREE.MathUtils.damp(piece.current.position.y, y, 2.2, delta);
      piece.current.position.z = THREE.MathUtils.damp(piece.current.position.z, z, 2.2, delta);
    });
  });

  const positions = modePositions.assembled;
  return <group ref={group} position={[2.6, -0.04, 0]} scale={0.92}>
    <pointLight ref={sweepLight} position={[positions[0][0], positions[0][1], 1.65]} color={BRAND_BLUE} distance={5.6} decay={0.9} intensity={1.9} />
    <rectAreaLight ref={sweepArea} position={[positions[0][0], positions[0][1], 1.55]} width={2.1} height={2.1} color={BRAND_BLUE} intensity={2.15} />
    <mesh ref={strategy} castShadow receiveShadow geometry={geometry.strategy} position={positions[0]} rotation={[0.08, -0.12, -0.18]}><meshPhysicalMaterial color={BRAND_CHARCOAL} emissive={BRAND_BLUE} emissiveIntensity={0.18} metalness={0.72} roughness={0.5} clearcoat={0.28} /></mesh>
    <mesh ref={creativity} castShadow receiveShadow geometry={geometry.creativity} position={positions[1]} rotation={[-0.1, 0.14, 0.2]}><meshPhysicalMaterial color={BRAND_CHARCOAL} emissive={BRAND_BLUE} emissiveIntensity={0.2} metalness={0.12} roughness={0.34} transmission={0.26} transparent opacity={0.76} clearcoat={0.46} /></mesh>
    <mesh ref={technology} castShadow receiveShadow geometry={geometry.technology} position={positions[2]} rotation={[0.12, 0.04, 0.08]}><meshPhysicalMaterial color={BRAND_CHARCOAL} emissive={BRAND_BLUE} emissiveIntensity={0.2} metalness={0.66} roughness={0.4} clearcoat={0.44} /></mesh>
  </group>;
}

export default function StoryCanvas({ pointer }: { pointer: PointerRef }) {
  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return <Canvas aria-hidden="true" shadows={{ type: THREE.PCFSoftShadowMap }} dpr={[1, 1.5]} frameloop={reducedMotion ? "demand" : "always"} camera={{ position: [0, 0, 8.7], fov: 36 }} gl={{ alpha: true, antialias: true }} onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}>
    <ambientLight intensity={0.68} />
    <directionalLight castShadow position={[3.5, 4.5, 5]} intensity={1.8} color={BRAND_BLUE} shadow-mapSize={[1024, 1024]} />
    <directionalLight position={[-4, 1, 3]} intensity={0.7} color={BRAND_BLUE} />
    <pointLight position={[1, -2, 3]} intensity={0.52} color={BRAND_BLUE} />
    <Pieces pointer={pointer} reducedMotion={reducedMotion} />
  </Canvas>;
}
