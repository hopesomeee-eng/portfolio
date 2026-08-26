import { GLTFLoader, DRACOLoader } from 'three-stdlib'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'

export function useWorkerGLTF(url: string) {
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    // 1. Safe Image Loading for Web Workers
    if (typeof self !== 'undefined' && typeof self.createImageBitmap !== 'undefined') {
      const imageBitmapLoader = new THREE.ImageBitmapLoader()
      imageBitmapLoader.setOptions({ imageOrientation: 'flipY' })
      // We don't need setPath('/') because we pass absolute URLs
    }
    
    // 2. Add DRACO compression support for AAA assets
    const dracoLoader = new DRACOLoader()
    // Using local decoders to bypass Web Worker Cross-Origin restrictions
    dracoLoader.setDecoderPath('/draco/')
    loader.setDRACOLoader(dracoLoader)
  })

  return gltf
}
