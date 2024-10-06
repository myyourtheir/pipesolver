import { create } from 'zustand'
import { BlockDisplayStoreActions } from '../../../types/actionTypes'
import { BlockDisplayStoreState } from '../../../types/stateTypes'

export const useBlockDisplayStore = create<BlockDisplayStoreActions & BlockDisplayStoreState>((set) => ({
	conditionsBarDisplay: true,
	elementsBarDisplay: true,
	elementsTreeDisplay: true,
	resultChartDisplay: false,
	toggleElementsBar() {
		return set((state) => ({
			elementsBarDisplay: !state.elementsBarDisplay
		}))
	},
	toggleElementsTree() {
		return set((state) => ({
			elementsTreeDisplay: !state.elementsTreeDisplay
		}))
	},
	toggleResultChart() {
		return set((state) => ({
			resultChartDisplay: !state.resultChartDisplay
		}))
	},
	toggleConditionsBar() {
		return set((state) => ({
			conditionsBarDisplay: !state.conditionsBarDisplay
		}))
	}
}))