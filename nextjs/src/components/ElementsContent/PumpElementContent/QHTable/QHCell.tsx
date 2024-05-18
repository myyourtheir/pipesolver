import { Column, Getter, Row, RowData, Table } from '@tanstack/react-table'
import { QH } from '.'
import { ChangeEvent, FC, useState, FocusEvent } from 'react'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import useInput from '@/utils/hooks/useInput'

interface QHCellProps {
	getValue: Getter<any>,
	table: Table<QH>,
	column: Column<QH, any>,
	row: Row<QH>
}

const validator = z.preprocess(
	(val) => Number(String(val)),
	z.number({
		invalid_type_error: "Вы ввели не число",
	}).nonnegative("Число должно быть больше или равно нулю"))

const QHCell: FC<QHCellProps> = ({ getValue, table, column, row }) => {
	const initialValue = getValue()
	const { value, handleChange } = useInput(initialValue)
	const [isValid, setIsValid] = useState(true)
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		try {
			validator.parse(e.target.value)
			setIsValid(true)
		} catch {
			setIsValid(false)
		}
		handleChange(e)
	}

	const onBlur = (e: FocusEvent<HTMLInputElement>) => {
		if (isValid) {
			//TODO логика для обновления глобального стора с графиком
			table.options.meta?.functions?.updateState({
				index: row.index,
				paramTitle: column.id,
				value: parseFloat(value) | 0
			})
		} else {
			return
		}
	}

	return (
		<div className='w-full flex justify-center '>
			<Input
				className={`w-24 h-6 text-center ${!isValid ? ' outline-none ring-2 ring-red-500 ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2' : 'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'}  font-light `}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
			/>
		</div>
	)
}

export default QHCell