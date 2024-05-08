"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FC, useContext } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ElementContentType } from './ContentType'
import { ElementContext } from '../Element'

const formSchema = z.object({
	type: z.literal('provider'),
	mode: z.union([z.literal('speed'), z.literal('pressure')]),
	value: z.preprocess(
		(val) => Number(String(val)),
		z.number({
			invalid_type_error: "Вы ввели не число",
		}).nonnegative("Число должно быть больше или равно нулю"))
})


const ProviderElementContent: FC<ElementContentType> = ({ defaultValues, onSubmit, submitButtonTitle }) => {

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
										<span>{form.getValues().mode === 'pressure' ? 'Па' : 'м/с'}</span>
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

export default ProviderElementContent