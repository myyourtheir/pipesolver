


import { ElemProps } from '@/app/home/(components)/SchemeCanvas/3dCanvas/mappedElements/types'
import { PlotConfig } from '../../../types/plotConfigTypes'


export const defaultOrthoElementsConfig: PlotConfig = {
	pipe: {
		length: 1,
		diameter: 0.2,
		radialSegments: 20
	},
	pump: {
		length: 1,
		width: 1,
		height: 1,
		depth: 1
	},
	provider: {
		length: 1,
		height: 1,
		radialSegments: 20,
		radiusTop: 0.4,
		radiusBottom: 0.2
	},
	consumer: {
		length: 1,
		height: 1,
		radialSegments: 20,
		radiusTop: 0.2,
		radiusBottom: 0.4
	},
	gate_valve: {
		length: 1,
		height: 1,
		radialSegments: 20,
		radiusTop: 0.2,
		radiusBottom: 0.4
	},
	safe_valve: {
		length: 1,
		boxHeight: 0.4,
		boxWidth: 0.3,
		boxDepth: 0.3,
		segments: 20,
		radius: 0.5,
	},
	general: {
		selectedColor: 'orange',
		baseColor: 'white'
	}
}