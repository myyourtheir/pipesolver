import { create } from 'zustand'
import { ResultsData, UiConfig } from '../../../types/stateTypes'
import { ResultsActions } from '../../../types/actionTypes'


const defaultUiConfig: UiConfig = {
	uiConfig: {
		selected: false
	}
}
export const useResultsStore = create<ResultsData & ResultsActions>()((set) => ({
	chartData: [],
	iter: 0,
	setIter: (numberOrFn) => {
		return set((state) => {
			if (typeof numberOrFn === 'function') {
				return {
					iter: numberOrFn(state.iter)
				}
			}
			return {
				iter: numberOrFn
			}
		})
	},
	pushNewData(timeChartData) {
		return set(state => ({
			chartData: [...state.chartData, timeChartData]
		}))
	},
	resetResult() {
		return set(() => ({
			chartData: [],
			iter: 0
		}))
	}

}))