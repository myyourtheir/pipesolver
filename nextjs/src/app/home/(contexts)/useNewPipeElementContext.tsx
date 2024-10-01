import { createContext, Dispatch, ReactNode, useContext, useEffect, useReducer } from 'react'
import { ElementParamsUnion } from '../../../../types/stateTypes'
import { GraphNode } from '@/utils/graph/GraphNode'
const ESCAPE_KEYS = ["27", "Escape"]

type Actions =
	| { type: 'setParentElement', value: GraphNode | null }
	| { type: 'setChildElement', value: GraphNode | null }
	| { type: 'setIsActive', value: boolean }

export type PipeElementState = {
	isActive: boolean,
	parentElement: GraphNode | null,
	childElement: GraphNode | null
}



function reducer(state: PipeElementState, action: Actions): PipeElementState {
	switch (action.type) {
		case 'setParentElement':
			return {
				...state,
				parentElement: action.value
			}
		case 'setChildElement':
			return {
				...state,
				childElement: action.value
			}
		case 'setIsActive':
			return {
				...state,
				isActive: action.value
			}
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