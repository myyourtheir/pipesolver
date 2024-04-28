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
import { FC, useContext } from 'react'
import { ElementContext } from '../Element'
import { ElementContentType } from './ContentType'


const formSchema = z.object({
	type: z.literal('pump'),
	coef_a: z.preprocess(
		(val) => Number(String(val)),
		z.number({
			invalid_type_error: "Вы ввели не число",
		}).nonnegative("Число должно быть больше или равно нулю")),
	coef_b: z.preprocess(
		(val) => Number(String(val)),
		z.number({
			invalid_type_error: "Вы ввели не число",
		}).nonnegative("Число должно быть больше или равно нулю")),
	mode: z.union([z.literal('open'), z.literal('close')]),
	start_time: z.preprocess(
		(val) => Number(String(val)),
		z.number({
			invalid_type_error: "Вы ввели не число",
		}).nonnegative("Число должно быть больше или равно нулю")),
	duration: z.preprocess(
		(val) => Number(String(val)),
		z.number({
			invalid_type_error: "Вы ввели не число",
		}).nonnegative("Число должно быть больше или равно нулю")),
})


const PumpElementContent: FC<ElementContentType> = ({ defaultValues, onSubmit, submitButtonTitle }) => {

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues
	})
	const { setOpen } = useContext(ElementContext)
	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((value) => {
						onSubmit(value)
						setOpen(false)
					})}
					className="space-y-2">
					<FormField
						control={form.control}
						name="coef_a"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Коэфициент аппроксимации а:</FormLabel>
								<FormControl>
									<div className='flex items-center gap-2'>
										<Input placeholder="Введите значение" {...field} />
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="coef_b"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Коэфициент аппроксимации b:</FormLabel>
								<FormControl>
									<div className='flex items-center gap-2'>
										<Input placeholder="Введите значение" {...field} />
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
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
								<FormLabel>Время выбега:</FormLabel>
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
					<div className='w-full flex justify-end'>
						<Button type="submit">{submitButtonTitle}</Button>
					</div>
				</form>
			</Form>
		</>
	)
}

export default PumpElementContent