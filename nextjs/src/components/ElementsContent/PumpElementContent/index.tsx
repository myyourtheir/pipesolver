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
import { ElementContext } from '../../Element'
import { ElementContentType } from '../ContentType'
import PumpCoefsPopover from './PumpCoefsPopover'


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
					<div className='grid grid-cols-2 grid-rows-2 '>
						<div className='flex flex-col gap-1 justify-center items-center '>
							<FormLabel className='text-xs'>
								Тип характеристики:
							</FormLabel>
							<span className='self-center justify-self-center'>ΔH = a - b ∙ Q<sup>2</sup></span>
						</div>
						<FormField
							control={form.control}
							name="coef_a"
							render={({ field }) => (
								<FormItem className='pl-4'>
									<FormLabel>Параметр а</FormLabel>
									<FormControl>
										<div className='flex items-center gap-2'>
											<Input placeholder="Введите значение" {...field} className='w-16' />
											<span>м</span>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='flex justify-center items-start'>
							<PumpCoefsPopover form={form} />
						</div>
						<FormField
							control={form.control}
							name="coef_b"
							render={({ field }) => (
								<FormItem className=' mt-1 pl-4'>
									<FormLabel>Параметр b</FormLabel>
									<FormControl>

										<div className='flex items-center gap-2 '>
											<Input placeholder="Введите значение" {...field} className='w-16' />
											<span>ч<sup>2</sup>&frasl;м<sup>5</sup></span>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

					</div>
					<FormField
						control={form.control}
						name="mode"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Состояние</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Выберите значение" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="open">Запуск насоса</SelectItem>
										<SelectItem value="close">Остановка насоса</SelectItem>
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
								<FormLabel>Момент начала {form.getValues().mode == 'open' ? 'запуска' : 'остановки'}</FormLabel>
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
								<FormLabel>Длительность {form.getValues().mode == 'open' ? 'запуска' : 'остановки'}</FormLabel>
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