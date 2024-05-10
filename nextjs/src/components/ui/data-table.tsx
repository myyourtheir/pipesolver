import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	ColumnDef,
	OnChangeFn,
	SortingState,
} from "@tanstack/react-table"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"

import { Button } from './button'
import { Input } from "@/components/ui/input"

import { FC, useDeferredValue, useState } from 'react'
import { Toggle } from './toggle'
import { ScrollArea, ScrollBar } from './scroll-area'

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	functions?: Record<string, (a: any) => void>[],
	pagination?: boolean,
	showPageNumber?: boolean,
	filter?: boolean,
	visibility?: boolean,
	border?: boolean,
	withoutHeader?: boolean,
	pageSize?: number
}

export function DataTable<TData, TValue>({ functions, columns, data, pagination, showPageNumber = false, filter = false, visibility, border, withoutHeader, pageSize = 10 }: DataTableProps<TData, TValue>) {

	const [sorting, setSorting] = useState<SortingState>([])
	const [globalFilter, setGlobalFilter] = useState('')
	const [columnVisibility, setColumnVisibility] = useState({})
	const deferredFilter = useDeferredValue(globalFilter)

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onGlobalFilterChange: setGlobalFilter,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		enableMultiRowSelection: false,
		initialState: {
			pagination: {
				pageSize,
			}
		},
		state: {
			sorting,
			globalFilter: deferredFilter,
			columnVisibility,
		},
		meta: {
			functions,
		}
	})
	return (
		<div>
			{
				visibility &&
				<div className="flex justify-center p-1 m-2">
					<div className="px-1">
						<Toggle variant={'outline'}
							{...{
								pressed: table.getIsAllColumnsVisible(),
								onPressedChange: table.getToggleAllColumnsVisibilityHandler(),
							}}
						>
							Все
						</Toggle>
					</div>
					{table.getAllLeafColumns().map(column => {
						return (
							<>
								{
									typeof column?.columnDef?.header !== 'function' &&
									<div key={column.id} className="px-1">
										<Toggle
											{...{
												pressed: column.getIsVisible(),
												onPressedChange:
													(e) => {
														column.toggleVisibility == null || column.toggleVisibility(e)
													}
											}}
										>
											{column?.columnDef?.header}
										</Toggle>
									</div>
								}
							</>
						)
					})}
				</div>
			}
			{filter &&
				<div className="flex items-center justify-center pt-1 pb-2">
					<Input
						placeholder="Поиск..."
						value={globalFilter ?? ''}
						onChange={(e) =>
							setGlobalFilter(e.target.value)
						}
						className="max-w-sm"
					/>
				</div>
			}
			<ScrollArea className="rounded-md border ">
				<div className="rounded-md ">
					<Table>
						{!withoutHeader &&
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header, i, arr) => {
											return (
												<TableHead className={`${border && 'border-x'} ${border && i === 0 && 'border-l-0'} ${border && i === arr.length - 1 && 'border-r-0'} text-center p-0`} key={`${header.column?.parent?.id}${header.id}`} colSpan={header.colSpan}>
													{header.isPlaceholder
														? null
														: flexRender(
															header.column.columnDef.header,
															header.getContext()
														)}
												</TableHead>
											)
										})}
									</TableRow>
								))}
							</TableHeader>
						}
						<TableBody className={`${border && 'last:border-b-0'}`}>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row,) => (
									<TableRow
										className={`${border && 'border-y-2'} [&>*:first-child]:border-l-0 [&>*:last-child]:border-r-0`}
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
									>
										{row.getVisibleCells().map((cell) => {
											return <TableCell className={` p-1 ${border && 'border-x'} w-fit`} key={`${cell.column?.parent?.id}${cell.id}`}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										})}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className="h-12 min-w-fit">
										<div className='flex items-center justify-center'>
											Нет данных
										</div>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
			{pagination &&
				<div className="flex items-center justify-center space-x-2 py-2 gap-x-5">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Пред.
					</Button>
					{
						showPageNumber && (
							<div className='flex flex-col items-center gap-2'>
								<span className="flex items-center gap-1">
									<div>Страница</div>
									<strong>
										{table.getState().pagination.pageIndex + 1} из{' '}
										{table.getPageCount().toLocaleString()}
									</strong>
								</span>
								<span className="flex items-center gap-1">
									Перейти к странице:
									<Input
										type="number"
										defaultValue={table.getState().pagination.pageIndex + 1}
										onChange={e => {
											const page = e.target.value ? Number(e.target.value) - 1 : 0
											table.setPageIndex(page)
										}}
										className="h-8 w-16"
									/>
								</span>
							</div>
						)
					}
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						След.
					</Button>
				</div>
			}
		</div>
	)
}

