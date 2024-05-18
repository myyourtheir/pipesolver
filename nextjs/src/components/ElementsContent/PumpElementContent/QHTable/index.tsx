
import { ColumnDef } from '@tanstack/react-table'
import { Dispatch, FC, SetStateAction, memo, useMemo } from 'react'
import QHCell from './QHCell'
import { DataTable } from '@/components/ui/data-table'

export type QH = {
	Q: number,
	H: number
}

interface PumpQHTableProps {
	data: QH[],
	setData: Dispatch<SetStateAction<{
		Q: number
		H: number
	}[]>>
}
const PumpQHTable: FC<PumpQHTableProps> = ({ data, setData }) => {

	const columns = useMemo<ColumnDef<QH, any>[]>(() => [
		{
			accessorKey: 'Q',
			header: () => <span className='font-normal'>Расход, м<sup>3</sup>&frasl;ч</span>,
			cell: ({ getValue, table, column, row }) => <QHCell getValue={getValue} column={column} table={table} row={row} />,
		},
		{
			accessorKey: 'H',
			header: () => <span className='font-normal'>Напор, м</span>,
			cell: ({ getValue, table, column, row }) => <QHCell getValue={getValue} column={column} table={table} row={row} />,
		},
	],
		[])
	const functions = {
		updateState: ({ index, paramTitle, value }: { index: number, paramTitle: keyof QH, value: number }) => {
			// const newArr = JSON.parse(JSON.stringify(data))
			const newArr = data.map((obj, i) => {
				if (i === index) {
					obj[paramTitle] = value
				}
				return obj
			})
			newArr[index][paramTitle] = value
			setData(newArr)
		}
	}
	return (

		<DataTable data={data} columns={columns} functions={functions} />

	)
}

export default memo(PumpQHTable)