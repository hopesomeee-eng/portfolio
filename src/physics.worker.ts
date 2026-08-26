// Physics Web Worker
// This thread is dedicated to running the Jolt Physics Engine at 60Hz.
import initJolt from 'jolt-physics'

let jolt: any = null
let joltInterface: any = null
let physicsSystem: any = null
let bodyInterface: any = null

let vehicleBody: any = null
const DEBRIS_COUNT = 500
const debrisBodies: any[] = []

// Standardized offset: 7 floats per object (posX, posY, posZ, rotX, rotY, rotZ, rotW)
let transformData: Float32Array

// Dynamic Config State
let currentConfig = {
  vehicleMass: 1500,
  suspensionStiffness: 20
}

const inputState = { forward: false, backward: false, left: false, right: false }

self.onmessage = async (e) => {
  if (e.data.type === 'config') {
    currentConfig = { ...currentConfig, ...e.data.config }
    return
  }

  if (e.data.type === 'init') {
    transformData = new Float32Array(e.data.sharedBuffer)
    jolt = await initJolt()
    
    // 1. Initialize Jolt Systems and Collision Layers
    const objectFilter = new jolt.ObjectLayerPairFilterTable(2)
    objectFilter.EnableCollision(0, 0)
    objectFilter.EnableCollision(1, 0) // Moving collides with Static
    objectFilter.EnableCollision(1, 1) // Moving collides with Moving

    const BP_LAYER_NON_MOVING = new jolt.BroadPhaseLayer(0)
    const BP_LAYER_MOVING = new jolt.BroadPhaseLayer(1)
    
    const bpInterface = new jolt.BroadPhaseLayerInterfaceTable(2, 2)
    bpInterface.MapObjectToBroadPhaseLayer(0, BP_LAYER_NON_MOVING)
    bpInterface.MapObjectToBroadPhaseLayer(1, BP_LAYER_MOVING)

    const objVsBpFilter = new jolt.ObjectVsBroadPhaseLayerFilterTable(bpInterface, 2, objectFilter, 2)

    const settings = new jolt.JoltSettings()
    settings.mObjectLayerPairFilter = objectFilter
    settings.mBroadPhaseLayerInterface = bpInterface
    settings.mObjectVsBroadPhaseLayerFilter = objVsBpFilter
    
    joltInterface = new jolt.JoltInterface(settings)
    physicsSystem = joltInterface.GetPhysicsSystem()
    bodyInterface = physicsSystem.GetBodyInterface()

    // 2. Create the Static Floor and Modular Tiles
    const TILE_SIZE = 10
    const mapConfig = e.data.mapConfig as string[][]
    
    if (mapConfig && mapConfig.length > 0) {
      const gridRows = mapConfig.length
      const gridCols = mapConfig[0].length
      const offsetX = (gridCols * TILE_SIZE) / 2 - (TILE_SIZE / 2)
      const offsetZ = (gridRows * TILE_SIZE) / 2 - (TILE_SIZE / 2)

      for (let z = 0; z < gridRows; z++) {
        for (let x = 0; x < gridCols; x++) {
          const tileType = mapConfig[z][x]
          const posX = x * TILE_SIZE - offsetX
          const posZ = z * TILE_SIZE - offsetZ
          
          let shape = null
          let posY = 0
          let rotation = new jolt.Quat(0, 0, 0, 1)


          if (tileType === 'grass' || tileType === 'road') {
            shape = new jolt.BoxShape(new jolt.Vec3(TILE_SIZE / 2, 1, TILE_SIZE / 2), 0.05, null)
            posY = -1
          } else if (tileType === 'water') {
            // Water has no physics (Buggy falls through) or we can make it a shallow floor
            shape = new jolt.BoxShape(new jolt.Vec3(TILE_SIZE / 2, 1, TILE_SIZE / 2), 0.05, null)
            posY = -2 // Sink down
          } else if (tileType === 'bridge') {
            shape = new jolt.BoxShape(new jolt.Vec3(TILE_SIZE / 2, 0.25, TILE_SIZE / 2), 0.05, null)
            posY = 4
          } else if (tileType === 'ramp') {
            const rampLength = Math.sqrt(TILE_SIZE*TILE_SIZE + 3*3)
            shape = new jolt.BoxShape(new jolt.Vec3(TILE_SIZE / 2, 0.25, rampLength / 2), 0.05, null)
            posY = 1.5
            // Math.PI / 8 around X axis
            const angle = Math.PI / 8
            rotation = new jolt.Quat(Math.sin(angle/2), 0, 0, Math.cos(angle/2))
          }

          if (shape) {
            const settings = new jolt.BodyCreationSettings(
              shape,
              new jolt.RVec3(posX, posY, posZ),
              rotation,
              jolt.EMotionType_Static,
              0 // BP_LAYER_NON_MOVING
            )
            settings.mFriction = tileType === 'road' ? 0.8 : 0.4
            settings.mRestitution = 0.1
            const body = bodyInterface.CreateBody(settings)
            bodyInterface.AddBody(body.GetID(), jolt.EActivation_DontActivate)
          }
        }
      }
    } else {
      // Fallback
      const floorShape = new jolt.BoxShape(new jolt.Vec3(100, 1, 100), 0.05, null)
      const floorSettings = new jolt.BodyCreationSettings(
        floorShape,
        new jolt.RVec3(0, -1, 0),
        new jolt.Quat(0, 0, 0, 1),
        jolt.EMotionType_Static,
        0
      )
      floorSettings.mFriction = 0.5
      const floor = bodyInterface.CreateBody(floorSettings)
      bodyInterface.AddBody(floor.GetID(), jolt.EActivation_DontActivate)
    }

    // 3. Create the Dynamic Vehicle (Arcade Box)
    const vehicleShape = new jolt.BoxShape(new jolt.Vec3(1, 0.5, 2), 0.05, null)
    const vehicleSettings = new jolt.BodyCreationSettings(
      vehicleShape,
      new jolt.RVec3(0, 5, 0), // Drop from sky
      new jolt.Quat(0, 0, 0, 1),
      jolt.EMotionType_Dynamic,
      1 // Layer 1 (Moving)
    )
    // Override mass based on config
    vehicleSettings.mOverrideMassProperties = jolt.EOverrideMassProperties_CalculateInertia
    vehicleSettings.mMassPropertiesOverride.mMass = currentConfig.vehicleMass
    vehicleSettings.mFriction = 0.2
    vehicleSettings.mLinearDamping = 0.5
    vehicleSettings.mAngularDamping = 0.8
    
    vehicleBody = bodyInterface.CreateBody(vehicleSettings)
    bodyInterface.AddBody(vehicleBody.GetID(), jolt.EActivation_Activate)

    // 4. Create 500 Dynamic Debris Objects
    const debrisShape = new jolt.BoxShape(new jolt.Vec3(0.5, 0.5, 0.5), 0.05, null)
    for (let i = 0; i < DEBRIS_COUNT; i++) {
      const x = (Math.random() - 0.5) * 50
      const z = (Math.random() - 0.5) * 50
      // Don't spawn exactly where the car drops
      if (Math.abs(x) < 5 && Math.abs(z) < 5) continue
      
      const settings = new jolt.BodyCreationSettings(
        debrisShape,
        new jolt.RVec3(x, 2 + Math.random() * 5, z),
        new jolt.Quat(0, 0, 0, 1),
        jolt.EMotionType_Dynamic,
        1
      )
      settings.mMassPropertiesOverride.mMass = 10
      settings.mFriction = 0.8
      settings.mRestitution = 0.6 // Bouncy!
      
      const body = bodyInterface.CreateBody(settings)
      bodyInterface.AddBody(body.GetID(), jolt.EActivation_Activate)
      debrisBodies.push(body)
    }

    self.postMessage({ type: 'ready' })
    setInterval(physicsLoop, 1000 / 60)
  }

  if (e.data.type === 'buildTrackCollider') {
    const vertices = e.data.vertices
    const indices = e.data.indices
    const scale = e.data.scale || 1

    console.log('[Physics] Building AAA Track Collider from raw geometry...', vertices.length)
    const triangles = new jolt.TriangleList()
    triangles.reserve(indices ? indices.length / 3 : vertices.length / 9)

    if (indices) {
      for (let i = 0; i < indices.length; i += 3) {
        const v1 = new jolt.Float3(vertices[indices[i]*3]*scale, vertices[indices[i]*3+1]*scale, vertices[indices[i]*3+2]*scale)
        const v2 = new jolt.Float3(vertices[indices[i+1]*3]*scale, vertices[indices[i+1]*3+1]*scale, vertices[indices[i+1]*3+2]*scale)
        const v3 = new jolt.Float3(vertices[indices[i+2]*3]*scale, vertices[indices[i+2]*3+1]*scale, vertices[indices[i+2]*3+2]*scale)
        triangles.push_back(new jolt.Triangle(v1, v2, v3, 0))
      }
    } else {
      for (let i = 0; i < vertices.length; i += 9) {
        const v1 = new jolt.Float3(vertices[i]*scale, vertices[i+1]*scale, vertices[i+2]*scale)
        const v2 = new jolt.Float3(vertices[i+3]*scale, vertices[i+4]*scale, vertices[i+5]*scale)
        const v3 = new jolt.Float3(vertices[i+6]*scale, vertices[i+7]*scale, vertices[i+8]*scale)
        triangles.push_back(new jolt.Triangle(v1, v2, v3, 0))
      }
    }

    const shapeSettings = new jolt.MeshShapeSettings(triangles)
    const shapeResult = shapeSettings.Create()
    const shape = shapeResult.Get()

    const creationSettings = new jolt.BodyCreationSettings(
      shape,
      new jolt.RVec3(0, -1, 0), // Match visual offset
      new jolt.Quat(0, 0, 0, 1),
      jolt.EMotionType_Static,
      0
    )
    
    creationSettings.mFriction = 0.8
    const trackBody = bodyInterface.CreateBody(creationSettings)
    bodyInterface.AddBody(trackBody.GetID(), jolt.EActivation_DontActivate)
    
    // Cleanup WASM memory
    jolt.destroy(triangles)
    console.log('[Physics] AAA Track Collider successfully mounted.')
  }

  if (e.data.type === 'input') {
    Object.assign(inputState, e.data.state)
  }
}

// Keep the car upright artificially since it's an arcade controller
function stabilizeVehicle(bodyId: any) {
  // Simple hack to force Up vector to stay mostly vertical
  bodyInterface.SetAngularVelocity(bodyId, new jolt.Vec3(0, bodyInterface.GetAngularVelocity(bodyId).GetY(), 0))
}

const timeStep = 1 / 60
function physicsLoop() {
  if (!physicsSystem) return

  // Apply Arcade Physics Forces
  if (vehicleBody) {
    const bodyId = vehicleBody.GetID()
    bodyInterface.ActivateBody(bodyId)
    
    // Calculate global forward vector based on current rotation
    const rotation = bodyInterface.GetRotation(bodyId)
    // Convert Jolt Quat to a simple forward vector (0, 0, 1) rotated
    // Jolt JS doesn't have a direct Quat * Vec3, so we do it manually
    const qx = rotation.GetX(), qy = rotation.GetY(), qz = rotation.GetZ(), qw = rotation.GetW()
    // Forward vector Z = 1 rotated by Quat
    const fx = 2 * (qx * qz + qw * qy)
    const fy = 2 * (qy * qz - qw * qx)
    const fz = 1 - 2 * (qx * qx + qy * qy)
    
    const forceMulti = currentConfig.vehicleMass * 10
    
    // Steering
    if (inputState.left) bodyInterface.AddTorque(bodyId, new jolt.Vec3(0, forceMulti, 0))
    if (inputState.right) bodyInterface.AddTorque(bodyId, new jolt.Vec3(0, -forceMulti, 0))
    
    // Acceleration
    if (inputState.forward) bodyInterface.AddForce(bodyId, new jolt.Vec3(fx * forceMulti, fy * forceMulti, fz * forceMulti))
    if (inputState.backward) bodyInterface.AddForce(bodyId, new jolt.Vec3(-fx * forceMulti, -fy * forceMulti, -fz * forceMulti))
    
    stabilizeVehicle(bodyId)
  }

  // Step Jolt
  joltInterface.Step(timeStep, 1)

  // Write Vehicle to SAB (Index 0)
  if (vehicleBody) {
    const pos = bodyInterface.GetPosition(vehicleBody.GetID())
    const quat = bodyInterface.GetRotation(vehicleBody.GetID())
    transformData[0] = pos.GetX()
    transformData[1] = pos.GetY()
    transformData[2] = pos.GetZ()
    transformData[3] = quat.GetX()
    transformData[4] = quat.GetY()
    transformData[5] = quat.GetZ()
    transformData[6] = quat.GetW()
  }

  // Write Debris to SAB (Index 1 to DEBRIS_COUNT)
  for (let i = 0; i < debrisBodies.length; i++) {
    const bodyId = debrisBodies[i].GetID()
    const pos = bodyInterface.GetPosition(bodyId)
    const quat = bodyInterface.GetRotation(bodyId)
    
    const offset = (i + 1) * 7
    transformData[offset + 0] = pos.GetX()
    transformData[offset + 1] = pos.GetY()
    transformData[offset + 2] = pos.GetZ()
    transformData[offset + 3] = quat.GetX()
    transformData[offset + 4] = quat.GetY()
    transformData[offset + 5] = quat.GetZ()
    transformData[offset + 6] = quat.GetW()
  }

  // (Removed requestAnimationFrame from here)
}


