import { create } from 'zustand'

type maxZIndex = {
	maxZ: number
	setMaxZ: (newZ: number) => void
}


export const useMaxZIndexStore = create<maxZIndex>()((set) => ({
	maxZ: 0,
	setMaxZ(newZ) {
		return set((state) => ({
			maxZ: newZ
		}))
	},
}))