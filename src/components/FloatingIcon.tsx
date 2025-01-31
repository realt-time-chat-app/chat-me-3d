import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';
import * as THREE from 'three';
import gsap from 'gsap';

const AnimatedOrb = ({ position, onComplete }: { position: [number, number, number]; onComplete: () => void }) => {
  const mesh = useRef<THREE.Mesh>(null!);

  useEffect(() => {
    gsap.fromTo(
      mesh.current.scale,
      { x: 0, y: 0, z: 0 },
      { x: 1.5, y: 1.5, z: 1.5, duration: 0.5, ease: "power4.inOut" }
    );
  }, []);

  const { opacity } = useSpring({
    from: { opacity: 1 },
    to: { opacity: 0 },
    config: { duration: 5000 },
    onRest: onComplete,
  });

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.02;
      mesh.current.position.y += Math.sin(Date.now() * 0.002) * 0.01;
    }
  });

  return (
    <animated.mesh ref={mesh} position={position}>
      <Sphere args={[0.5, 32, 32]}>
        <animated.meshStandardMaterial color="green" transparent opacity={opacity} />
      </Sphere>
    </animated.mesh>
  );
};

interface FloatingIconRef {
  addOrbs: () => void;
}

const FloatingIcon = forwardRef<FloatingIconRef, {}>((props, ref) => {
  const [orbs, setOrbs] = useState<any[]>([]);

  const addOrbs = () => {
    const newOrbs = Array.from({ length: 5 }, () => ({
      key: Date.now() + Math.random(),
      position: [THREE.MathUtils.randFloat(-2, 2), THREE.MathUtils.randFloat(-1, 1), THREE.MathUtils.randFloat(-2, 2)],
    }));
    setOrbs((prev) => [...prev, ...newOrbs]);
  };

  const removeOrb = (key: number) => {
    setOrbs((prev) => prev.filter((orb) => orb.key !== key));
  };

  useImperativeHandle(ref, () => ({
    addOrbs,
  }));

  return (
    <Canvas camera={{ position: [0, 2, 5] }} style={{ background: 'black' }}>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      {orbs.map((orb) => (
        <AnimatedOrb key={orb.key} position={orb.position} onComplete={() => removeOrb(orb.key)} />
      ))}
    </Canvas>
  );
});

FloatingIcon.displayName = 'FloatingIcon';

export default FloatingIcon;



