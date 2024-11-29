import { useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bounds, OrbitControls, useGLTF, useAnimations, useScroll, ScrollControls, SoftShadows } from "@react-three/drei"
import { EffectComposer, SSAO, SMAA, Selection, Outline } from "@react-three/postprocessing"
import Model from './components/lock-21-mockup/lock-21-mockup'
import {zones} from './zones'
import './App.css'

// function Model(props) {
//   const scroll = useScroll()
//   const { nodes, materials, animations } = useGLTF("/lock-21-mockup.glb")
//   const { ref, actions } = useAnimations(animations)
//   // useEffect(() => void (actions.jump.reset().play().paused = true), [])
//   // useFrame(() => (actions.jump.time = actions.jump.getClip().duration * scroll.offset))
//   return (
//     <group {...props} ref={ref}>
//       <primitive object={nodes.mixamorigHips} />
//       <skinnedMesh castShadow receiveShadow geometry={nodes.Ch03.geometry} material={materials.Ch03_Body} skeleton={nodes.Ch03.skeleton} />
//     </group>
//   )
// }

export function App() {
  const [overed, over] = useState(null)

  function onPointerOver(event){
    const mesh = event.object
    console.log('[onPointerOver]', mesh)
    // over(mesh)
    // console.log(mesh.name)
    // // console.log(zones)

    // if (zones.includes(mesh.name)){
    //   console.log('yep')
    // }
  }

  function onPointerOut(event){
    const mesh = event.object

    if (mesh === overed) {
      over(null)
    }

    console.log('[onPointerOut]', mesh)
  }

  useEffect(() => {
    console.log('[overed]', overed)
  }, [overed])

  return (
    <>
      <Canvas shadows gl={{antialias: true}} camera={{ position: [.5, -.25, 1.5], fov: 50 }}>
        <color attach='background' args={['#2c5828']} />
        {/* <fog attach="fog" args={["#f0f0f0", 0, 20]} /> */}
        <fog attach="fog" args={["#2c5828", 0, 5]} />
        <ambientLight intensity={0.75} />
        <directionalLight intensity={1.5} position={[-5, -5, 10]} castShadow shadow-mapSize={2048} shadow-bias={-0.0001} />
        <Selection>
          <EffectComposer multisampling={0} autoClear={false}>
            <SSAO radius={0.05} intensity={150} luminanceInfluence={0.5} color="black" />
            <Outline visibleEdgeColor="#ffdd33" hiddenEdgeColor="#190a05" blur width={1000} edgeStrength={70} />
            <SMAA />
          </EffectComposer>
          <Bounds fit clip margin={1.2} damping={0}>
            <Model position={[0, 0, 0]} rotation={[0, 0, 0]} scale={0.01} onPointerOver={onPointerOver} onPointerOut={onPointerOut} />
          </Bounds>
        </Selection>
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI} />  
      </Canvas>
      <div style={{
        position: 'absolute',
        bottom: 0,
        padding: '.5rem'
        }}><strong>hover: {overed}</strong></div>
    </>
  )
}
