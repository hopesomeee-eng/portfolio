// 3-point studio lighting for the car — cinematic, dramatic, ORYZO-style
export function Lights() {
  return (
    <>
      {/* Ambient — very dark, almost nothing */}
      <ambientLight intensity={0.04} />

      {/* Key light — warm amber from top-right, the main dramatic light */}
      <spotLight
        position={[8, 10, 5]}
        angle={0.35}
        penumbra={0.8}
        intensity={120}
        color="#ffd580"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.001}
      />

      {/* Fill light — cool blue from left, subtle */}
      <spotLight
        position={[-6, 5, 4]}
        angle={0.5}
        penumbra={1}
        intensity={30}
        color="#4488ff"
      />

      {/* Rim light — hard white from behind, separates car from background */}
      <spotLight
        position={[0, 4, -8]}
        angle={0.4}
        penumbra={0.4}
        intensity={60}
        color="#ffffff"
      />

      {/* Ground bounce — very subtle warm fill from below */}
      <pointLight
        position={[0, -1, 0]}
        intensity={8}
        color="#ff8833"
        distance={8}
      />
    </>
  )
}
