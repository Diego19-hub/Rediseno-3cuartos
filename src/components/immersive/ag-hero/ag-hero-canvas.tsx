"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { BRAND_BLUE, BRAND_CHARCOAL } from "@/lib/brand-colors";

const CYCLE_SECONDS = 8;
const ASSEMBLED_SURFACE = new THREE.Color(BRAND_BLUE);
const ASSEMBLED_EMISSIVE = new THREE.Color("#2c4f93");
const ASSEMBLED_EDGE = new THREE.Color("#94b3f3");
// Exact vertices from the three unique closed paths in public/images/brand/logo.svg.
// The SVG's second path repeats the first one only to add a gradient overlay.
const OFFICIAL_LOGO_PATHS = [
  [[10.0004, -1.00888], [14.4827, 6.67518], [3.72505, 9.7488]],
  [[3.72505, 9.7488], [20.758, 17.4329], [14.4827, 6.67518]],
  [[20.758, 17.4329], [-0.757812, 17.4329], [3.72505, 9.7488]],
] as const;
const SEPARATED_TRANSFORMS = [
  { position: new THREE.Vector3(-2.8, 2.25, 1.35), rotation: new THREE.Euler(-0.16, 0.22, -0.2) },
  { position: new THREE.Vector3(2.9, 1.35, -0.45), rotation: new THREE.Euler(0.13, -0.27, 0.18) },
  { position: new THREE.Vector3(1.55, -2.9, 0.85), rotation: new THREE.Euler(-0.1, 0.24, 0.1) },
] as const;
const PIECE_MATERIALS = [
  { color: new THREE.Color("#4a70cc"), emissive: new THREE.Color("#1c346e"), metalness: 0.66, roughness: 0.29, edge: new THREE.Color("#9eb9f4") },
  { color: new THREE.Color("#31569f"), emissive: new THREE.Color("#162c5f"), metalness: 0.74, roughness: 0.33, edge: new THREE.Color("#7395de") },
  { color: new THREE.Color("#203d72"), emissive: new THREE.Color("#10244c"), metalness: 0.8, roughness: 0.38, edge: new THREE.Color(BRAND_BLUE) },
] as const;

function smoothStep(value: number) {
  const clamped = THREE.MathUtils.clamp(value, 0, 1);
  return clamped * clamped * (3 - 2 * clamped);
}

function LogoPieces({ reducedMotion }: { reducedMotion: boolean }) {
  const meshes = useRef<Array<THREE.Mesh | null>>([]);
  const edges = useRef<Array<THREE.LineSegments | null>>([]);

  const geometries = useMemo(() => {
    const created = OFFICIAL_LOGO_PATHS.map((points) => {
      const shape = new THREE.Shape();
      points.forEach(([x, y], index) => {
        if (index === 0) shape.moveTo(x, -y);
        else shape.lineTo(x, -y);
      });
      shape.closePath();
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 2.15,
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: 0.24,
        bevelThickness: 0.28,
        curveSegments: 18,
      });
      geometry.computeVertexNormals();
      return geometry;
    });

    const bounds = new THREE.Box3();
    created.forEach((geometry) => {
      geometry.computeBoundingBox();
      if (geometry.boundingBox) bounds.union(geometry.boundingBox);
    });
    const center = bounds.getCenter(new THREE.Vector3());
    created.forEach((geometry) => {
      geometry.translate(-center.x, -center.y, -center.z);
    });
    return created;
  }, []);
  const edgeGeometries = useMemo(() => geometries.map((geometry) => new THREE.EdgesGeometry(geometry, 18)), [geometries]);

  useEffect(() => () => {
    geometries.forEach((geometry) => geometry.dispose());
    edgeGeometries.forEach((geometry) => geometry.dispose());
  }, [edgeGeometries, geometries]);

  useFrame(({ clock }) => {
    if (reducedMotion) return;
    const time = clock.elapsedTime % CYCLE_SECONDS;
    const appearing = time < 1 ? smoothStep(time) : 1;
    const assembly = time < 1 ? 0 : time < 2 ? smoothStep(time - 1) : time < 7 ? 1 : 1 - smoothStep(time - 7);

    meshes.current.forEach((mesh, index) => {
      if (!mesh) return;
      const separated = SEPARATED_TRANSFORMS[index] ?? SEPARATED_TRANSFORMS[0];
      mesh.position.copy(separated.position).multiplyScalar(1 - assembly);
      mesh.rotation.set(
        separated.rotation.x * (1 - assembly),
        separated.rotation.y * (1 - assembly),
        separated.rotation.z * (1 - assembly),
      );
      mesh.scale.setScalar(appearing);
      const material = mesh.material as THREE.MeshPhysicalMaterial;
      const surface = PIECE_MATERIALS[index] ?? PIECE_MATERIALS[0];
      material.color.lerpColors(surface.color, ASSEMBLED_SURFACE, assembly);
      material.emissive.lerpColors(surface.emissive, ASSEMBLED_EMISSIVE, assembly);
      material.emissiveIntensity = 0.12 + assembly * 0.1;
      material.metalness = THREE.MathUtils.lerp(surface.metalness, 0.72, assembly);
      material.roughness = THREE.MathUtils.lerp(surface.roughness, 0.3, assembly);
      const edgeMaterial = edges.current[index]?.material as THREE.LineBasicMaterial | undefined;
      edgeMaterial?.color.lerpColors(surface.edge, ASSEMBLED_EDGE, assembly);
    });
  });

  return (
    <group position={[1.7, 0.12, 0]} scale={0.14} rotation={[0.08, -0.12, -0.03]}>
      {geometries.map((geometry, index) => {
        const surface = PIECE_MATERIALS[index] ?? PIECE_MATERIALS[0];
        return (
        <mesh
          key={geometry.uuid}
          ref={(mesh) => { meshes.current[index] = mesh; }}
          geometry={geometry}
          castShadow
          receiveShadow
          position={reducedMotion ? [0, 0, 0] : SEPARATED_TRANSFORMS[index]?.position}
          rotation={reducedMotion ? [0, 0, 0] : SEPARATED_TRANSFORMS[index]?.rotation}
        >
          <meshPhysicalMaterial
            side={THREE.DoubleSide}
            color={reducedMotion ? ASSEMBLED_SURFACE : surface.color}
            emissive={reducedMotion ? ASSEMBLED_EMISSIVE : surface.emissive}
            emissiveIntensity={reducedMotion ? 0.22 : 0.12}
            metalness={surface.metalness}
            roughness={surface.roughness}
            clearcoat={0.84}
            clearcoatRoughness={0.14}
          />
          <lineSegments ref={(line) => { edges.current[index] = line; }} geometry={edgeGeometries[index]} renderOrder={1}>
            <lineBasicMaterial color={reducedMotion ? ASSEMBLED_EDGE : surface.edge} transparent opacity={reducedMotion ? 0.58 : 0.7} />
          </lineSegments>
        </mesh>
        );
      })}
    </group>
  );
}

export default function AgHeroCanvas({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 8.8], fov: 34 }}
      dpr={[1, 1.5]}
      frameloop={reducedMotion ? "demand" : "always"}
      gl={{ alpha: true, antialias: true }}
      shadows={{ type: THREE.PCFShadowMap }}
      onCreated={({ gl }) => gl.setClearColor(BRAND_CHARCOAL, 0)}
    >
      <ambientLight intensity={0.56} color="#b8c9ec" />
      <directionalLight castShadow position={[-4, 5, 6]} intensity={2.8} color="#dce7ff" shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[5, 1, 4]} intensity={2.35} color={BRAND_BLUE} />
      <pointLight position={[0, -2.5, 4]} intensity={2.55} distance={10} decay={1.2} color="#7f9cf0" />
      <pointLight position={[3.2, 3.2, 2.6]} intensity={1.2} distance={7} decay={1.4} color="#a8baf0" />
      <LogoPieces reducedMotion={reducedMotion} />
    </Canvas>
  );
}
