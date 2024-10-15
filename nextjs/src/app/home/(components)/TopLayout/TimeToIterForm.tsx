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
import { FC } from 'react'
import { CondParams } from '../../../../../types/stateTypes'
import { toast } from 'sonner'


const formSchema = z.object({

	time_to_iter: z.preprocess(
		(val) => Number(String(val)),
		z.number({
			invalid_type_error: "Вы ввели не число",
		}).nonnegative("Число должно быть больше или равно нулю").max(1000, '> 1000')),
})

interface FCParams {
	defaultValues: Partial<CondParams>
	onSubmit: (values: Partial<CondParams>) => void,
}
const TimeToIterForm: FC<FCParams> = ({ defaultValues, onSubmit }) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues,
		mode: 'onBlur'
	})
	return (
		<>
			<Form {...form}>
				<form
					onBlur={form.handleSubmit((value) => {
						try {
							onSubmit(value)
							toast("Данные успешно обновлены")
						}
						catch {
							toast.warning("Ошибка при удалении")
						}
					})}
					className="flex text-nowrap">
					<FormField
						control={form.control}
						name="time_to_iter"
						render={({ field }) => (
							<FormItem className=' space-y-0 flex gap-1 items-center'>
								<FormLabel>Время расчета: </FormLabel>
								<FormControl>
									<div className='flex items-center gap-1'>
										<Input className='w-14' placeholder="Введите значение" {...field} />
										<span>{'c'}</span>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</form>
			</Form>
		</>
	)
}

export default TimeToIterForm