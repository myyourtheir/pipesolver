import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useReducer } from 'react'


type State = {
	resultSelectedElementIds: Array<string>
}



type Actions = | { type: 'reset' }
	| { type: 'add', value: string }
	| { type: 'remove', value: string }

const initialState: State = {
	resultSelectedElementIds: []
}

type ContextType = {
	state: State,
	dispatch: React.Dispatch<Actions>
} & ExtraState

type ExtraState = {
	setCharts: Dispatch<SetStateAction<string[]>>,
	chartId: string,
}

const SelectedElementsChartContext = createContext<ContextType | null>(null)

const reducer = (state: State, action: Actions): State => {
	switch (action.type) {
		case 'reset':
			return initialState
		case 'add':
			return { ...state, resultSelectedElementIds: [...state.resultSelectedElementIds, action.value] }
		case 'remove':
			return {
				...state, resultSelectedElementIds: state.resultSelectedElementIds.filter(id => id !== action.value)
			}
		default:
			return state
	}
}

export function SelectedElementsChartContextProvider({ children, chartId, setCharts }: { children: ReactNode } & ExtraState) {
	const [state, dispatch] = useReducer(reducer, initialState)
	return (
		<SelectedElementsChartContext.Provider value={{ state, dispatch, chartId, setCharts }}>
			{children}
		</SelectedElementsChartContext.Provider>
	)
}

export function useSelectedElementsChartContext() {
	const context = useContext(SelectedElementsChartContext) as ContextType
	return ({ ...context })
}
