import { useState, useEffect, ChangeEvent, ChangeEventHandler } from 'react'


function useInput<T>(initialValue: T): { value: T, handleChange: (e: ChangeEvent<HTMLInputElement>) => void } {
	const [value, setValue] = useState(initialValue)

	useEffect(() => {
		setValue(initialValue)
	}, [initialValue])

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value as T)

	return {
		value, handleChange
	}
}

export default useInput

