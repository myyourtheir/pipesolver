"use client"
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { literal, z } from "zod"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { ElementContext } from './Element'
import { useContext } from 'react'


const formSchema = z.object({
	type: z.literal('gate_valve'),
	mode: z.union([z.literal('open'), z.literal('close')]),
	start_time: z.number({ invalid_type_error: 'Вы ввели не число' }).nonnegative({ 'message': "Не может быть меньше 0" }),
	duration: z.number({ invalid_type_error: 'Вы ввели не число' }).nonnegative({ 'message': "Не может быть меньше 0" }),
	percentage: z.number({ invalid_type_error: 'Вы ввели не число' }).max(100, { 'message': 'Не более 100%' }).nonnegative({ 'message': "Не может быть меньше 0" }),
})


const GateValveElementContent = () => {
	const { setOpen } = useContext(ElementContext)
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			type: 'gate_valve',
			mode: 'open',
			start_time: 0,
			duration: 100,
			percentage: 100
		},
	})

	const addElement = useUnsteadyInputStore(state => state.addElement)
	const onSubmit = (values: z.infer<typeof formSchema>) => {
		addElement(values)
		setOpen(false)
	}
	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
					<FormField
						control={form.control}
						name="mode"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Режим</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Выберите значение" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="open">Открывается</SelectItem>
										<SelectItem value="close">Закрывается</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="start_time"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Время начала {form.getValues().mode == 'open' ? 'открытия' : 'закрытия'}</FormLabel>
								<FormControl>
									<div className='flex items-center gap-2'>
										<Input placeholder="Введите значение" {...field} />
										<span>{'сек'}</span>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="duration"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Время {form.getValues().mode == 'open' ? 'открытия' : 'закрытия'}</FormLabel>
								<FormControl>
									<div className='flex items-center gap-2'>
										<Input placeholder="Введите значение" {...field} />
										<span>{'сек'}</span>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="percentage"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Процент {form.getValues().mode == 'open' ? 'открытия' : 'закрытия'}</FormLabel>
								<FormControl>
									<div className='flex items-center gap-2'>
										<Input placeholder="Введите значение" {...field} />
										<span>{'%'}</span>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='w-full flex justify-end'>
						<Button type="submit">Добавить</Button>
					</div>
				</form>
			</Form>
		</>
	)
}

export default GateValveElementContent