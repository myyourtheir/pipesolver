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
import { CondParams } from '../../../../../types/stateTypes'
import { toast } from 'sonner'


const formSchema = z.object({

	time_to_iter: z.preprocess(
		(val) => Number(String(val)),
		z.number({
			invalid_type_error: "Вы ввели не число",
		}).nonnegative("Число должно быть больше или равно нулю").max(1000, '> 1000')),
	density: z.preprocess(
		(val) => Number(String(val)),
		z.number({
			invalid_type_error: "Вы ввели не число",
		}).nonnegative("Число должно быть больше или равно нулю")),
	viscosity: z.preprocess(
		(val) => Number(String(val)),
		z.number({
			invalid_type_error: "Вы ввели не число",
		}).nonnegative("Число должно быть больше или равно нулю"))
})

interface FCParams {
	defaultValues: CondParams,
	onSubmit: (values: CondParams) => void,
}
const ConditionsContent: FC<FCParams> = ({ defaultValues, onSubmit }) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues
	})
	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((value) => {
						try {
							onSubmit(value)
							toast("Данные успешно обновлены")
						}
						catch {
							toast.warning("Ошибка при удалении")
						}

					})}
					className="lg:flex lg:gap-2 lg:items-center text-nowrap">
					<FormField
						control={form.control}
						name="time_to_iter"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Время расчета</FormLabel>
								<FormControl>
									<div className='flex items-center gap-1'>
										<Input className='w-24' placeholder="Введите значение" {...field} />
										<span>{'c'}</span>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="density"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Плотность</FormLabel>
								<FormControl>
									<div className='flex items-center gap-1'>
										<Input className='w-24' placeholder="Введите значение" {...field} />
										<span className='w-8'>кг/м<sup>3</sup></span>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="viscosity"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Вязкость</FormLabel>
								<FormControl>
									<div className='flex items-center gap-1'>
										<Input className='w-24' placeholder="Введите значение" {...field} />
										<span>{'сСт'}</span>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='w-full flex justify-end lg:self-end mt-2 lg:mt-0 lg:ml-2'>
						<Button type="submit">Изменить</Button>
					</div>
				</form>
			</Form>
		</>
	)
}

export default ConditionsContent