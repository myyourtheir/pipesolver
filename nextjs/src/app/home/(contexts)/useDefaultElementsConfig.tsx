import { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react'
import { ElementParamsUnion } from '../../../../types/stateTypes'



type Actions = {
	type: 'setDefaultElementConfig', value: ElementParamsUnion
}


type State = Record<ElementParamsUnion['type'], ElementParamsUnion>

function reducer(state: State, action: Actions): State {
	switch (action.type) {
		case 'setDefaultElementConfig':
			return { ...state, ...action.value }
	}
}
const initialState: State = {
	provider: {
		type: 'provider',
		mode: 'pressure',
		value: 0
	},
	consumer: {
		type: 'consumer',
		mode: 'pressure',
		value: 0
	},
	pipe: {
		type: 'pipe',
		length: 100,
		diameter: 1000,
	},
	pump: {
		type: 'pump',
		coef_a: 310,
		coef_b: 0.0000008,
		mode: 'open',
		start_time: 0,
		duration: 20,
	},
	gate_valve: {
		type: 'gate_valve',
		mode: 'open',
		start_time: 0,
		duration: 100,
		percentage: 100
	},
	safe_valve: {
		type: 'safe_valve',
		coef_q: 0.5,
		max_pressure: 9
	}
}



type TDefaultElementsConfigContext = {
	elementModeState: State,
	elementModeDispatch: Dispatch<Actions>
}

const Context = createContext<TDefaultElementsConfigContext | null>(null)

function DefaultElementsConfigContext({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(reducer, initialState)
	return (
		<Context.Provider value={{ elementModeDispatch: dispatch, elementModeState: state }}>
			{children}
		</Context.Provider>
	)
}


function useDefaultElementsConfig() {
	const context = useContext(Context) as TDefaultElementsConfigContext
	return ({ context })
}

export { useDefaultElementsConfig, DefaultElementsConfigContext }