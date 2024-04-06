import { SVGProps } from 'react'

const GateValveFav = ({ ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg width="56" height="26" viewBox="0 0 56 26" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M33.6 13.3001L1.40002 25.2001V1.40015L33.6 13.3001Z" stroke="black" strokeWidth="1.4" strokeLinejoin="round" />
			<path d="M22.4 13.3001L54.6 1.40015V25.2001L22.4 13.3001Z" stroke="black" strokeWidth="1.4" strokeLinejoin="round" />
			<path d="M35.3 13.4001C35.3 18.0946 31.4945 21.9001 26.8 21.9001C22.1056 21.9001 18.3 18.0946 18.3 13.4001C18.3 8.70573 22.1056 4.90015 26.8 4.90015C31.4945 4.90015 35.3 8.70573 35.3 13.4001Z" fill="#EAEBEB" stroke="black" />
		</svg>

	)
}

export default GateValveFav