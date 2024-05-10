
import { ColumnDef } from '@tanstack/react-table'
import { FC, useMemo } from 'react'
import QHCell from './QHCell'
import { DataTable } from '@/components/ui/data-table'

export type QH = {
	Q: number,
	H: number
}

interface PumpQHTableProps {
	data: QH[]
}
const PumpQHTable: FC<PumpQHTableProps> = ({ data }) => {

	const columns = useMemo<ColumnDef<QH, any>[]>(() => [
		{
			accessorKey: 'Q',
			header: 'Расход, м3/с',
			cell: ({ getValue, table, column }) => <QHCell getValue={getValue} column={column} table={table} />,
		},
		{
			accessorKey: 'H',
			header: 'Напор, м',
			cell: ({ getValue, table, column }) => <QHCell getValue={getValue} column={column} table={table} />,
		},
	],
		[])

	return (
		<DataTable data={data} columns={columns} />
	)
}

export default PumpQHTable