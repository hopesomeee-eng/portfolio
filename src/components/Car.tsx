import { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CarProps {
  sharedBuffer: SharedArrayBuffer | null
  isDriveMode: boolean
}

export function Car({ sharedBuffer, isDriveMode }: CarProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/car.glb')
  const transformData = useRef<Float32Array | null>(null)
  const carScene = useRef<THREE.Group | null>(null)

  useEffect(() => {
    const clone = scene.clone()
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    carScene.current = clone
  }, [scene])

  useEffect(() => {
    if (sharedBuffer) {
      transformData.current = new Float32Array(sharedBuffer)
    }
  }, [sharedBuffer])

  const _quat = new THREE.Quaternion()

  useFrame(() => {
    if (!isDriveMode || !transformData.current || !groupRef.current) return
    const d = transformData.current
    groupRef.current.position.set(d[0], d[1], d[2])
    _quat.set(d[3], d[4], d[5], d[6])
    groupRef.current.quaternion.copy(_quat)
  })

  if (!carScene.current) return null

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive object={carScene.current} scale={1} />
    </group>
  )
}

useGLTF.preload('/models/car.glb')
