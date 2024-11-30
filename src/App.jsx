import { useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bounds, OrbitControls, CameraControls, GizmoHelper, GizmoViewport, useCursor, useGLTF, useAnimations, SoftShadows } from '@react-three/drei'
import { EffectComposer, SSAO, SMAA, Selection, Outline } from '@react-three/postprocessing'
import Model from './components/lock-21-mockup/lock-21-mockup-2.jsx'
import { zones } from './zones'
import './App.css'

export function App() {
  const [hovered, hover] = useState(null)

  useCursor(hovered)

  function onPointerOver(event) {
    event.stopPropagation()
    const mesh = event.object
    console.log('[onPointerOver]', mesh.name)
    // console.log(mesh.name)
    // // console.log(zones)

    if (zones.includes(mesh.name)) {
      // console.log('yep')
      hover(mesh.name)
    }
  }

  function onPointerOut(event) {
    const mesh = event.object
    console.log('[onPointerOut]', mesh.name)

    if (mesh.name === hovered) {
      hover(null)
    }
  }

  useEffect(() => {
    if (!hovered) {
      return
    }
    console.log('[hovered]', hovered)
  }, [hovered])

  return (
    <>
      <Canvas shadows gl={{ antialias: true }} camera={{ position: [-0.5, 1.5, 1], fov: 20 }}>
        <color attach='background' args={['#2c5828']} />
        {/* <fog attach="fog" args={["#f0f0f0", 0, 20]} /> */}
        {/* <fog attach='fog' args={['#2c5828', 0, 12]} /> */}
        <ambientLight intensity={0.75} />
        <directionalLight intensity={1.5} position={[5, 10, 5]} castShadow shadow-mapSize={2048} shadow-bias={-0.0001} />
        <Selection>
          <EffectComposer multisampling={0} autoClear={false} enableNormalPass={true}>
            <SSAO radius={0.05} intensity={150} luminanceInfluence={0.5} color='black' />
            <Outline visibleEdgeColor='#ffdd33' hiddenEdgeColor='#190a05' blur width={1000} edgeStrength={70} />
            <SMAA />
          </EffectComposer>
          <Bounds fit clip margin={1.2} damping={0}>
            <Model position={[0, 0, 0]} rotation={[0, 0, 0]} scale={0.01} onPointerOver={onPointerOver} onPointerOut={onPointerOut} hovered={hovered} />
          </Bounds>
        </Selection>
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI} />
        {/* <CameraControls /> */}
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
        <strong>hover: {hovered}</strong>
      </div>
    </>
  )
}
