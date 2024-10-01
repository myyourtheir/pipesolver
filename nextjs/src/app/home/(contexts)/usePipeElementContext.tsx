import { createContext, Dispatch, ReactNode, useContext, useEffect, useReducer } from 'react'
import { ElementParamsUnion } from '../../../../types/stateTypes'
const ESCAPE_KEYS = ["27", "Escape"]

type Actions = { type: 'setModeElement', value: ElementParamsUnion['type'] | null }

export type PipeElementState = {
	isActive: boolean,
	parentElement: ElementParamsUnion | null,
	childElement: ElementParamsUnion | null
}



function reducer(state: PipeElementState, action: Actions): PipeElementState {
	switch (action.type) {
		case 'setModeElement':
			return state
	}
}

const initialState: PipeElementState = {
	isActive: false,
	parentElement: null,
	childElement: null
}



type TusePipeElementContext = {
	state: PipeElementState,
	dispatch: Dispatch<Actions>
}

const Context = createContext<TusePipeElementContext | null>(null)

function PipeElementContextProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(reducer, initialState)
	return (
		<Context.Provider value={{ dispatch, state }}>
			{children}
		</Context.Provider>
	)
}


function usePipeElementContext() {
	const context = useContext(Context) as TusePipeElementContext
	return ({ ...context })
}

export { PipeElementContextProvider, usePipeElementContext }