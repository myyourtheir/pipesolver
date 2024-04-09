import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from '@/components/ui/sonner'
const fontSans = FontSans({
	subsets: ["cyrillic"],
	variable: "--font-sans",
})

export const metadata: Metadata = {
	title: "pipeSolver",
	description: "unsteady fluid flows calculation",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="ru">
			<body className={cn(
				"min-h-screen bg-[rgba(52,_62,_64,_0.1)] font-sans antialiased select-none",
				fontSans.variable
			)}>
				<>
					{children}
					<Toaster />
				</>
			</body>
		</html>
	)
}
