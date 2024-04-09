"use client"
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { useContext } from 'react'
import { ElementContext } from './Element'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const formSchema = z.object({
	type: z.literal('consumer'),
	mode: z.union([z.literal('speed'), z.literal('pressure')]),
	value: z.preprocess(
		(val) => Number(String(val)),
		z.number({
			invalid_type_error: "Вы ввели не число",
		}).nonnegative("Число должно быть больше или равно нулю"))
})


const ConsumerElementContent = () => {
	const { setOpen } = useContext(ElementContext)
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			type: 'consumer',
			mode: 'pressure',
			value: 0
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
								<FormLabel>Условие</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Выберите значение" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="pressure">Давление</SelectItem>
										<SelectItem value="speed">Скорость</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="value"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div className='flex items-center gap-2'>
										<Input placeholder="Введите значение" {...field} />
										<span>{form.getValues().mode === 'pressure' ? 'кПа' : 'м/с'}</span>
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

export default ConsumerElementContent