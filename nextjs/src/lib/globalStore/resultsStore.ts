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
	setIter: (number) => {
		return set(() => ({
			iter: number
		}))
	},
	pushNewData(timeChartData) {
		return set(state => ({
			chartData: [...state.chartData, timeChartData]
		}))
	},
	resetResult() {
		return set(() => ({
			chartData: []
		}))
	}

}))