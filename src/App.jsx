import {Canvas} from "@react-three/fiber"
import {Experience} from "./components/Experience"
import {UI} from "./components/UI"
import {Leva} from "leva"
import {useState} from "react"

function App() {
  const [section, setSection] = useState(0)
  // console.log(section)

  return (
    <>
      <Leva hidden />
      <Canvas camera={{position: [0, 0, 3], fov: 30}}>
        <color attach="background" args={["#171720"]} />
        <Experience section={section} />
      </Canvas>
      <UI section={section} onSectionChange={setSection} />
    </>
  )
}

export default App
