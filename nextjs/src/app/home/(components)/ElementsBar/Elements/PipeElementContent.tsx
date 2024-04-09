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

const formSchema = z.object({
	type: z.literal('pipe'),
	length: z.preprocess(
		(val) => Number(String(val)),
		z.number({
			invalid_type_error: "Вы ввели не число",
		}).nonnegative("Число должно быть больше или равно нулю")),
	diameter: z.preprocess(
		(val) => Number(String(val)),
		z.number({
			invalid_type_error: "Вы ввели не число",
		}).nonnegative("Число должно быть больше или равно нулю"))
})


const PipeElementContent = () => {
	const { setOpen } = useContext(ElementContext)
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			type: 'pipe',
			length: 100,
			diameter: 1000,
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
						name="length"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Длина</FormLabel>
								<FormControl>
									<div className='flex items-center gap-2'>
										<Input placeholder="Введите значение" {...field} />
										<span>{'мм'}</span>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="diameter"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Диаметр</FormLabel>
								<FormControl>
									<div className='flex items-center gap-2'>
										<Input placeholder="Введите значение" {...field} />
										<span>{'мм'}</span>
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

export default PipeElementContent