import { SVGProps } from 'react'

const SafeValveFav = ({ ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg width="40" height="58" viewBox="0 0 40 58" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M12.9 25L24.8 57.2001H1L12.9 25Z" stroke="black" strokeWidth="1.4" strokeLinejoin="round" />
			<path d="M7 24.9L39.2 13V36.8L7 24.9Z" stroke="black" strokeWidth="1.4" strokeLinejoin="round" />
			<path d="M12 21V1" stroke="black" strokeWidth="1.4" strokeLinecap="round" />
			<path d="M8 13.9999L16.1381 10" stroke="black" strokeLinecap="round" />
			<path d="M8 10.0001L16.1381 6.00024" stroke="black" strokeLinecap="round" />
			<path d="M8 6.0001L16.1381 2.00024" stroke="black" strokeLinecap="round" />
			<path d="M19.9 25C19.9 29.1422 16.5422 32.5 12.4 32.5C8.2579 32.5 4.90002 29.1422 4.90002 25C4.90002 20.8578 8.2579 17.5 12.4 17.5C16.5422 17.5 19.9 20.8578 19.9 25Z" fill="#EAEBEB" stroke="black" />
		</svg>

	)
}

export default SafeValveFav