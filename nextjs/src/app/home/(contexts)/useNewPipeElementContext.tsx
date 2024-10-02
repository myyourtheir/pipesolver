import { createContext, Dispatch, ReactNode, useContext, useEffect, useReducer } from 'react'
import { ElementParamsUnion, Sides } from '../../../../types/stateTypes'
import { GraphNode } from '@/utils/graph/GraphNode'
const ESCAPE_KEYS = ["27", "Escape"]

type Actions =
	| {
		type: 'setParentElement', value: {
			parentElement: GraphNode | null,
			parentElementSide: Sides[number] | null
		}
	}
	| { type: 'resetParentElement' }

export type PipeElementState = {
	isActive: boolean,

	parentElement: GraphNode | null,
	parentElementSide: Sides[number] | null
}



function reducer(state: PipeElementState, action: Actions): PipeElementState {
	switch (action.type) {
		case 'setParentElement':
			const { parentElement, parentElementSide } = action.value
			return {
				isActive: true,
				parentElement,
				parentElementSide
			}
		case 'resetParentElement':
			return {
				isActive: false,
				parentElement: null,
				parentElementSide: null
			}
	}
}

const initialState: PipeElementState = {
	isActive: false,
	parentElement: null,
	parentElementSide: null
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