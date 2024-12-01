import { useEffect, useState } from 'react'
import { Canvas} from '@react-three/fiber'
import { Bounds, OrbitControls, GizmoHelper, GizmoViewport, useCursor } from '@react-three/drei'
import { EffectComposer, SSAO, SMAA, Selection, Outline } from '@react-three/postprocessing'
import Model from './components/lock-21-mockup/lock-21-mockup-2'
import { zones } from './zones'
import './App.css'

export function App() {
  const [hovered, setHovered] = useState(null)
  const [controlsPosition, setControlsPosition] = useState([0, 0, 0])

  useCursor(hovered)

  function onPointerOver(event) {
    event.stopPropagation()
    const mesh = event.object
    console.log('[onPointerOver] %s (%s)', mesh.name, hovered)
    // console.log(mesh.name)
    // // console.log(zones)

    if (zones.some(zone => mesh.name?.startsWith(zone))) {
      // console.log('yep')
      setHovered(mesh.name)
    }
  }

  function onPointerOut(event) {
    const mesh = event.object
    console.log('[onPointerOut] %s (%s)', mesh.name, hovered)

    if (mesh.name === hovered) {
      setHovered(null)
    }
  }

  useEffect(() => {
    if (!hovered) {
      return
    }
    console.log('[hovered]', hovered)
  }, [hovered])

  const cameraPosition = [0.25, 3, 0.25]
  const modelPosition = [0.25, 2.25, -0.25]

  return (
    <>
      <Canvas shadows gl={{ antialias: true }} camera={{ position: cameraPosition, fov: 70 }}>
        <color attach='background' args={['#2c5828']} />
        {/* <fog attach="fog" args={["#f0f0f0", 0, 20]} /> */}
        {/* <fog attach='fog' args={['#2c5828', 0, 12]} /> */}
        <ambientLight intensity={1.25} />
        <directionalLight intensity={0.5} position={[5, 10, 5]} castShadow shadow-mapSize={2048} shadow-bias={-0.0001} />
        <Selection>
          <EffectComposer multisampling={0} autoClear={false} enableNormalPass={true}>
            <SSAO radius={0.05} intensity={150} luminanceInfluence={0.5} color='black' />
            <Outline visibleEdgeColor='#ffdd33' hiddenEdgeColor='#190a05' blur width={1000} edgeStrength={70} />
            <SMAA />
          </EffectComposer>
          <Bounds fit clip margin={1.2} damping={0}>
            <Model position={modelPosition} rotation={[0, Math.PI * -0.25, 0]} scale={1} onPointerOver={onPointerOver} onPointerOut={onPointerOut} hovered={hovered} />
          </Bounds>
        </Selection>
        <OrbitControls
          makeDefault
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          onChange={
            event => { 
              const position = event.target.object.position
            console.log('controls:', position)
            setControlsPosition([position.x, position.y, position.z])
            // setControls(event)
              // console.log( controls.object.position ); 
          }}
        />
        <GizmoHelper
          alignment='bottom-right' // widget alignment within scene
          margin={[80, 80]} // widget margins (X, Y)
        >
          <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor='black' />
          {/* alternative: <GizmoViewcube /> */}
        </GizmoHelper>
      </Canvas>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          padding: '.5rem',
        }}
      >
        <strong>hover: {hovered}</strong><br />
        <strong>controls: [{controlsPosition.map(Math.round).join(', ')}]</strong>
      </div>
    </>
  )
}
