

import { PlotConfig } from '../../types/plotConfigTypes'
import { ElemProps } from '@/app/home/(components)/SchemeCanvas/3dCanvas/mappedElements/types'

interface ValuesProps extends ElemProps {
	key: any
}

export const defaultElementsConfig = {
	pipe: {
		diameter: 0.2,
		radialSegments: 20
	},
	pump: {
		width: 1,
		height: 1,
		depth: 1
	},
	provider: {
		height: 1,
		radialSegments: 20,
		radiusTop: 0.4,
		radiusBottom: 0.2
	},
	consumer: {
		height: 1,
		radialSegments: 20,
		radiusTop: 0.2,
		radiusBottom: 0.4
	},
	gateValve: {
		height: 1,
		radialSegments: 20,
		radiusTop: 0.2,
		radiusBottom: 0.4
	},
	safeValve: {
		boxHeight: 0.4,
		boxWidth: 0.3,
		boxDepth: 0.3,
		segments: 20,
		radius: 0.5,
	},
	general: {
		selectedColor: 'orange'
	}
}