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
import { FC, useContext } from 'react'
import { ElementContext } from '../Element'
import { ElementContentType } from './ContentType'

const formSchema = z.object({
	type: z.literal('safe_valve'),
	coef_q: z.preprocess(
		(val) => Number(String(val)),
		z.number({
			invalid_type_error: "Вы ввели не число",
		}).nonnegative("Число должно быть больше или равно нулю")),
	max_pressure: z.preprocess(
		(val) => Number(String(val)),
		z.number({
			invalid_type_error: "Вы ввели не число",
		}).nonnegative("Число должно быть больше или равно нулю"))
})


const SafeValveElementContent: FC<ElementContentType> = ({ defaultValues, onSubmit, submitButtonTitle }) => {
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
						name="coef_q"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Коэффициент расхода</FormLabel>
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
						name="max_pressure"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Давление срабатывания</FormLabel>
								<FormControl>
									<div className='flex items-center gap-2'>
										<Input placeholder="Введите значение" {...field} />
										<span>{'атм'}</span>
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

export default SafeValveElementContent