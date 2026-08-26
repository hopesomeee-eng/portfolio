import { MeshReflectorMaterial } from '@react-three/drei'

export function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={1024}
        mixBlur={0.8}
        mixStrength={80}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#08080a"
        metalness={0.6}
        mirror={0}
      />
    </mesh>
  )
}
