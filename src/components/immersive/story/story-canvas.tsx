"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";

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
  separated: [[-1.18, 0.52, 0], [1.18, 0.52, -0.08], [0, -1.05, 0.08]],
  assembled: [[-0.82, 0.3, 0], [0.82, 0.3, -0.05], [0, -0.72, 0.08]],
  expanded: [[-1.02, 0.44, 0], [1.02, 0.44, -0.08], [0, -0.9, 0.08]],
};

function Pieces({ pointer, reducedMotion }: { pointer: PointerRef; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const strategy = useRef<THREE.Mesh>(null);
  const creativity = useRef<THREE.Mesh>(null);
  const technology = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => ({ strategy: makeStrategy(), creativity: makeCreativity(), technology: makeTechnology() }), []);
  const [mode, setMode] = useState<AssemblyMode>("assembled");

  useEffect(() => {
    if (reducedMotion) return;
    const modes: AssemblyMode[] = ["separated", "assembled", "expanded"];
    let index = 1;
    const timer = window.setInterval(() => { index = (index + 1) % modes.length; setMode(modes[index]); }, 5200);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  useFrame((_, delta) => {
    if (!group.current || reducedMotion) return;
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
  return <group ref={group} position={[1.65, 0.05, 0]} scale={0.78}>
    <mesh ref={strategy} castShadow receiveShadow geometry={geometry.strategy} position={positions[0]} rotation={[0.08, -0.12, -0.18]}><meshStandardMaterial color="#24464b" metalness={0.58} roughness={0.4} /></mesh>
    <mesh ref={creativity} castShadow receiveShadow geometry={geometry.creativity} position={positions[1]} rotation={[-0.1, 0.14, 0.2]}><meshPhysicalMaterial color="#50777a" metalness={0.18} roughness={0.34} transmission={0.16} transparent opacity={0.8} /></mesh>
    <mesh ref={technology} castShadow receiveShadow geometry={geometry.technology} position={positions[2]} rotation={[0.12, 0.04, 0.08]}><meshStandardMaterial color="#315b61" metalness={0.5} roughness={0.3} /></mesh>
  </group>;
}

export default function StoryCanvas({ pointer }: { pointer: PointerRef }) {
  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return <Canvas aria-hidden="true" shadows={{ type: THREE.PCFSoftShadowMap }} dpr={[1, 1.5]} frameloop={reducedMotion ? "demand" : "always"} camera={{ position: [0, 0, 7], fov: 36 }} gl={{ alpha: true, antialias: true }}>
    <ambientLight intensity={0.62} />
    <directionalLight castShadow position={[3, 4, 5]} intensity={1.05} shadow-mapSize={[1024, 1024]} />
    <pointLight position={[-2, -1, 2]} intensity={0.28} color="#52767a" />
    <Pieces pointer={pointer} reducedMotion={reducedMotion} />
  </Canvas>;
}
