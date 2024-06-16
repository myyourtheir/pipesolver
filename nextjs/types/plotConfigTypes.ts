type SharedPlotConfig = {
	length: number,
	maxNeighbors: number
}
export type PlotConfig = {
	pipe: PipeConfig & SharedPlotConfig,
	pump: PumpConfig & SharedPlotConfig,
	provider: ProvConsConfig & SharedPlotConfig,
	consumer: ProvConsConfig & SharedPlotConfig,
	gate_valve: GateValveConfig & SharedPlotConfig,
	safe_valve: SafeValveConfig & SharedPlotConfig,
	general: GeneralSettings,

}

export type PipeConfig = {
	diameter: number,
	radialSegments: number
}
export type PumpConfig = {
	width: number,
	height: number,
	depth: number
}
export type ProvConsConfig = {
	radiusTop: number,
	radiusBottom: number,
	height: number,
	radialSegments: number
}
export type GateValveConfig = {
	radiusTop: number,
	radiusBottom: number,
	height: number,
	radialSegments: number
}
export type SafeValveConfig = {
	radius: number,
	segments: number,
	boxWidth: number,
	boxHeight: number,
	boxDepth: number
}
export type GeneralSettings = {
	selectedColor: string,
	baseColor: string
}


