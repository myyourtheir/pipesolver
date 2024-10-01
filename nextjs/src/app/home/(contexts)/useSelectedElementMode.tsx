import { createContext, Dispatch, ReactNode, useContext, useEffect, useReducer } from 'react'
import { ElementParamsUnion } from '../../../../types/stateTypes'
const ESCAPE_KEYS = ["27", "Escape"]

type Actions = { type: 'setModeElement', value: ElementParamsUnion['type'] | null }

export type ModeState = {
	mode: 'linierElement' | 'noneLinierElement' | 'default',
	modeElement: ElementParamsUnion['type'] | null,
}



function reducer(state: ModeState, action: Actions): ModeState {
	switch (action.type) {
		case 'setModeElement':
			if (action.value === state.modeElement) {
				return { mode: 'default', modeElement: null }
			} else {
				if (action.value === 'pipe') {
					return { mode: 'linierElement', modeElement: action.value }
				}
				if (action.value === null) {
					return { mode: 'default', modeElement: action.value }
				}
				else {
					return { mode: 'noneLinierElement', modeElement: action.value }
				}
			}
	}
}

const initialState: ModeState = {
	mode: "default",
	modeElement: null
}



type TSelectedElementModeContext = {
	elementModeState: ModeState,
	elementModeDispatch: Dispatch<Actions>
}

const Context = createContext<TSelectedElementModeContext | null>(null)

function SelectedElementModeContext({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(reducer, initialState)
	return (
		<Context.Provider value={{ elementModeDispatch: dispatch, elementModeState: state }}>
			{children}
		</Context.Provider>
	)
}


function useSelectedElementModeContext() {
	const context = useContext(Context) as TSelectedElementModeContext
	return ({ ...context })
}

export { useSelectedElementModeContext, SelectedElementModeContext }