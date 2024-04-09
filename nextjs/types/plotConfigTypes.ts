export type PlotConfig = {
	pipe: PipeConfig,
	pump: PumpConfig,
	provider: ProvConsConfig,
	consumer: ProvConsConfig,
	gateValve: GateValveConfig,
	safeValve: SafeValveConfig,
	general: GeneralSettings
}

export interface PipeConfig {
	diameter: number,
	radialSegments: number
}
export interface PumpConfig {
	width: number,
	height: number,
	depth: number
}
export interface ProvConsConfig {
	radiusTop: number,
	radiusBottom: number,
	height: number,
	radialSegments: number
}
export interface GateValveConfig {
	radiusTop: number,
	radiusBottom: number,
	height: number,
	radialSegments: number
}
export interface SafeValveConfig {
	radius: number,
	segments: number,
	boxWidth: number,
	boxHeight: number,
	boxDepth: number
}
export interface GeneralSettings {
	selectedColor: string
}


