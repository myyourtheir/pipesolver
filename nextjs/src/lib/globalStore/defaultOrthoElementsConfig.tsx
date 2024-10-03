import { PlotConfig } from '../../../types/plotConfigTypes'


export const defaultOrthoElementsConfig: PlotConfig = {
	pipe: {
		length: 1,
		diameter: 0.1,
		radialSegments: 20,
		maxNeighbors: 2,
	},
	pump: {
		length: 1,
		width: 1,
		height: 1,
		depth: 1,
		maxNeighbors: 2,
	},
	provider: {
		length: 1,
		height: 1,
		radialSegments: 20,
		radiusTop: 0.4,
		radiusBottom: 0.2,
		maxNeighbors: 1,
	},
	consumer: {
		length: 1,
		height: 1,
		radialSegments: 20,
		radiusTop: 0.2,
		radiusBottom: 0.4,
		maxNeighbors: 1,
	},
	gate_valve: {
		length: 1,
		height: 1,
		radialSegments: 20,
		radiusTop: 0.2,
		radiusBottom: 0.4,
		maxNeighbors: 2
	},
	safe_valve: {
		length: 1,
		boxHeight: 0.4,
		boxWidth: 0.3,
		boxDepth: 0.3,
		segments: 20,
		radius: 0.5,
		maxNeighbors: 2
	},
	general: {
		selectedColor: 'orange',
		baseColor: 'white'
	},
	tee: {
		length: 1,
		width: 1,
		height: 0.5,
		maxNeighbors: 3,
		depth: 1
	}
}