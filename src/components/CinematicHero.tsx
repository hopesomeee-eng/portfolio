/**
 * CinematicHero.tsx — The Agentic Void Shader
 *
 * Implements a high-end, mathematical pseudo-fluid "smoke" simulation 
 * using Fractal Brownian Motion (fBm) and Simplex Noise domain warping.
 * It reacts to the mouse cursor position, creating elegant, silky ripples 
 * in the dark void without the overhead of a true FBO Navier-Stokes solver.
 * Perfect 60fps performance across all devices.
 */
import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { HeroConfig } from '../config/HeroConfig'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Fragment shader implementing fBm domain warping for the "Silky Void" effect
const fragmentShader = `
  uniform vec2 uMouse;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uBgColor;
  uniform vec3 uFluidColor;
  
  varying vec2 vUv;

  // Ashima's WebGL-noise function (Simplex 2D)
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Fractal Brownian Motion
  float fbm(vec2 x) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < 5; ++i) {
      v += a * snoise(x);
      x = rot * x * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // Normalize coordinates
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    st.x *= uResolution.x / uResolution.y; // Correct aspect ratio
    
    vec2 mouse = uMouse;
    mouse.x *= uResolution.x / uResolution.y;

    // Fluid domain warping
    vec2 q = vec2(0.);
    q.x = fbm( st + 0.00*uTime);
    q.y = fbm( st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*uTime );
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*uTime);

    float f = fbm(st+r);

    // Mouse interaction: push the fluid away
    float dist = distance(st, mouse);
    float force = smoothstep(0.4, 0.0, dist) * 0.5;
    f += force * snoise(st * 10.0 - uTime);

    // Map noise value to color gradient
    vec3 color = mix(uBgColor, uFluidColor, clamp((f*f)*4.0,0.0,1.0));

    // Subtle vignette
    float vignette = 1.0 - smoothstep(0.5, 1.5, length(vUv - 0.5));
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
  }
`

interface CinematicHeroProps {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
}

export function CinematicHero({ mouseRef }: CinematicHeroProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const { viewport, size } = useThree()

  // Parse hex to normalized RGB for shader
  const parseHex = (hex: string) => {
    const c = new THREE.Color(hex)
    return new THREE.Vector3(c.r, c.g, c.b)
  }

  const uniforms = useMemo(() => ({
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uBgColor: { value: parseHex(HeroConfig.shader.backgroundColor) },
    uFluidColor: { value: parseHex(HeroConfig.shader.fluidColor) }
  }), [size])

  useFrame((state) => {
    if (!matRef.current) return

    // Time scaling for smooth fluid motion
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime * HeroConfig.shader.speed

    // Update resolution on resize
    matRef.current.uniforms.uResolution.value.set(state.size.width, state.size.height)

    // Smoothly interpolate mouse to normalized coordinates (0 to 1)
    const targetX = mouseRef.current.x / window.innerWidth
    const targetY = 1.0 - (mouseRef.current.y / window.innerHeight) // WebGL Y is up

    matRef.current.uniforms.uMouse.value.x = THREE.MathUtils.lerp(
      matRef.current.uniforms.uMouse.value.x,
      targetX,
      0.05
    )
    matRef.current.uniforms.uMouse.value.y = THREE.MathUtils.lerp(
      matRef.current.uniforms.uMouse.value.y,
      targetY,
      0.05
    )
  })

  return (
    <mesh ref={meshRef}>
      {/* Plane fills the exact viewport size */}
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  )
}
