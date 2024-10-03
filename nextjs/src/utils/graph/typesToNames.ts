import { ElementsType } from '../../../types/stateTypes'

export const typesToNames: Record<ElementsType, { name: string }> = {
	pipe: {
		name: 'Труба',
	},
	pump: {
		name: 'Насос',
	},
	consumer: {
		name: 'Потребитель',
	},
	provider: {
		name: 'Поставщик',
	},
	gate_valve: {
		name: 'Задвижка',
	},
	safe_valve: {
		name: 'Клапан',
	},
	tee: {
		name: 'Тройник',
	}
}