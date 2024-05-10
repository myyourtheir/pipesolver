import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dispatch, FC, SetStateAction } from 'react'
import { Form, useForm } from 'react-hook-form'
import { z } from 'zod'
interface QHItemProps {
	Q: number,
	H: number,
	index: number,
	data: {
		Q: number
		H: number
	}[]
}
const formSchema = z.object({
	Q: z.preprocess(
		(val) => Number(String(val)),
		z.number({
			invalid_type_error: "Вы ввели не число",
		}).nonnegative("Число должно быть больше или равно нулю")),
	H: z.preprocess(
		(val) => Number(String(val)),
		z.number({
			invalid_type_error: "Вы ввели не число",
		}).nonnegative("Число должно быть больше или равно нулю")),
})


const QHItem: FC<QHItemProps> = ({ H, Q, index, data }) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			H, Q
		}
	})
	const onSubmit = (value: {
		Q: number
		H: number
	}) => {
		data[index] = value
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit((value) => {
					onSubmit(value)
				})}
				className="flex gap-2">
				<FormField
					control={form.control}
					name="Q"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className='flex items-center gap-1'>
									<Input
										placeholder="Введите значение"
										{...field}
										className='w-24 h-7'
									/>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="H"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className='flex items-center gap-2'>
									<Input
										placeholder="Введите значение"
										{...field}
										className='w-24 h-7'
									/>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}

export default QHItem