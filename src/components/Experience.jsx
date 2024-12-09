import {
  CameraControls,
  Environment,
  Gltf,
  OrbitControls,
} from "@react-three/drei"
import {button, useControls} from "leva"
import {useEffect, useRef, useState} from "react"
import {degToRad} from "three/src/math/MathUtils.js"

import {sections} from "./UI"

const cameraPosition = {
  intro: [
    -0.6792761827333382, 0.8307386657760498, 0.7694252478688229,
    -0.010041993586087835, 0.0007570946264517413, -0.009458281135978828,
  ],
  titanium: [
    0.37700495750578633, -1.18749868985274, -0.43216930561594147,
    -0.011794541580269657, 0.0037282458250366066, -0.01597620457668464,
  ],
  camera: [
    0.14085575294426939, -1.2635214725394108, 0.34015998901533967,
    -0.010041993586087835, 0.0007570946264517413, -0.009458281135978828,
  ],
  "action-button": [
    -0.6737848281062637, -1.0203323413133216, -0.5195809855530872,
    -0.010041993586087835, 0.0007570946264517413, -0.009458281135978828,
  ],
}
// console.log(cameraPosition["intro"][2]) // = 3

//[ for Mobile Screen]
const cameraPositionsSmallScreen = {
  intro: [
    -0.36999307147918126, 0.6793651745985799, 0.3471338198909196,
    -0.010041993586087788, 0.000757094626451682, -0.009458281135978908,
  ],
  titanium: [
    -0.2602660115264277, -1.2125976096262292, 0.6571905660415737,
    -0.010041993586087835, 0.0007570946264517413, -0.009458281135978828,
  ],
  camera: [
    -0.15903481620821217, 1.1734189570906604, -0.3813666021418381,
    -0.010041993586087835, 0.0007570946264517413, -0.009458281135978828,
  ],
  "action-button": [
    0.6643599065679751, 0.6564798609268471, -0.2085362597004297,
    -0.010041993586087835, 0.0007570946264517413, -0.009458281135978828,
  ],
}
// breakpoint của cameraPositionsSmallScreen
const SMALL_SCREEN_THRESHOLD = 900

export const Experience = ({section}) => {
  const controls = useRef()
  const box = useRef()
  const sphere = useRef()

  useControls("Settings", {
    // (smoothTime: giá trị càng nhỏ thì speed càng nhanh)
    smoothTime: {
      value: 0.35,
      min: 0.1,
      max: 2,
      step: 0.1,
      onChange: (value) => {
        controls.current.smoothTime = value
      },
    },
  })

  useControls("Dolly", {
    // (`dolly` : zoomIN/Out)
    in: button(() => controls.current.dolly(1, true)),
    out: button(() => controls.current.dolly(-1, true)),
  })

  useControls("truck", {
    // (`truck` : MOVING (horizotal,veryical,true))
    up: button(() => controls.current.truck(0, 0.5, true)),
    left: button(() => controls.current.truck(0.5, 0, true)),
    down: button(() => controls.current.truck(0, -0.5, true)),
    right: button(() => controls.current.truck(-0.5, 0, true)),

    diagonal: button(() => controls.current.truck(0.5, 0.2, true)),
  })

  useControls("rotate", {
    // (`rotate` : ROTATION (horizotal,veryical,true))
    up: button(() => controls.current.rotate(0, 0.5, true)),
    left: button(() => controls.current.rotate(0.5, 0, true)),
    down: button(() => controls.current.rotate(0, -0.5, true)),
    right: button(() => controls.current.rotate(-0.5, 0, true)),
  })

  useControls("fit", {
    fitToBox: button(() => controls.current.fitToBox(box.current, true)),
    fitToSphere: button(() =>
      controls.current.fitToSphere(sphere.current, false)
    ),
  })

  useControls("helpPosition", {
    getLookAt: button(() => {
      const position = controls.current.getPosition()
      const target = controls.current.getTarget()
      console.log([...position, ...target])
    }),
  })

  const [introFinished, setIntroFinished] = useState(false)

  const intro = async () => {
    // (0, 0, 5, 0, 0, 0) = (x thay doi, y thay doi, z thay doi , x ban dau, y ban dau, z ban dau)
    controls.current.setLookAt(0, 0, 5, 0, 0, 0, false) // false == no transition
    await controls.current.dolly(3, true) // true === HAS transition
    await controls.current.rotate(degToRad(45), degToRad(25), true)
    setIntroFinished(true)
    playTransition()
  }

  // (gọi intro đầu tiên)
  useEffect(() => {
    intro()
  }, [])

  const playTransition = async () => {
    if (window.innerWidth < SMALL_SCREEN_THRESHOLD) {
      controls.current.setLookAt(
        ...cameraPositionsSmallScreen[sections[section]],
        true
      )
    } else {
      controls.current.setLookAt(...cameraPosition[sections[section]], true) // false == no transition
    }
  }

  useEffect(() => {
    if (!introFinished) {
      return
    }
    playTransition()
  }, [section])

  return (
    <>
      <CameraControls ref={controls} />
      <mesh ref={box} visible={false}>
        <boxGeometry args={[0.5, 1, 0.2]} />
        <meshBasicMaterial color="lightblue" wireframe />
      </mesh>
      <mesh ref={sphere} visible={false}>
        <sphereGeometry args={[0.3, 64]} />
        <meshBasicMaterial color="purple" wireframe />
      </mesh>
      <Gltf
        position={[0, 0, 0]}
        src="models/apple_iphone_15_pro_max_black.glb"
        // "Apple iPhone 15 Pro Max Black" (https://skfb.ly/oLpPT) by polyman is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
      />
      <group rotation-y={Math.PI}>
        <Environment preset="apartment" blur />
      </group>
    </>
  )
}
