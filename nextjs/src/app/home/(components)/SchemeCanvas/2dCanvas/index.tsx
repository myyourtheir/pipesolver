import { Suspense, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { Plane, OrthographicCamera, OrbitControls } from "@react-three/drei"

// Размеры сцены и квадрата
const sceneSizes = { width: 800, height: 500 }
const rectSizes = { width: 200, height: 200 }

const OrtoCanvas = () => {
	const [color, colorChange] = useState("blue") // Состояние отвечает за цвет квадрата

	// Handler служит для того, чтобы
	const colorChangeHandler = () => {
		// Просто поочерёдно меняем цвет с серого на синий и с синего на белый
		colorChange((prevColor) => (prevColor === "white" ? "blue" : "white"))
	}

	return (
		<Canvas className="container" >
			<Suspense fallback={null}>
				<gridHelper args={[100, 100]} />
				<OrbitControls
					enableZoom={true}
					enablePan={true}
					enableRotate={false}
					enableDamping={false}
				/>
				<OrthographicCamera makeDefault position={[0, 0, 1]} />
				<Plane
					// Обработка событий тут из коробки
					onClick={colorChangeHandler}
					// Аргументы те же и в том же порядке, как и в нативной three.js
					args={[rectSizes.width, rectSizes.height, 1]}
				>
					{/* Материал задаётся по аналогии с нативной three.js, 
              но нужно использовать attach для указания типа прикрепления узла*/}
					<meshBasicMaterial attach="material" color={color} />
				</Plane>
			</Suspense>
		</Canvas>

	)
}

export default OrtoCanvas
