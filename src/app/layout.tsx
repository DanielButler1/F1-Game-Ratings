import type React from "react";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/header";
import Footer from "@/components/footer";
import "./globals.css";
import { cn } from "@/lib/utils";
import { GoogleAnalytics } from "@next/third-parties/google";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "F1 Driver Ratings Tracker",
	description:
		"Track and visualise Formula One game driver ratings from F1 2020 through F1 25",
	openGraph: {
		title: "F1 Driver Ratings Tracker",
		description:
			"Track and visualise Formula One game driver ratings from F1 2020 through F1 25",
		images: [
			{
				url: "/og.png",
				width: 1200,
				height: 630,
				alt: "F1 Driver Ratings Tracker Open Graph Image",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "F1 Driver Ratings Tracker",
		description:
			"Track and visualise Formula One game driver ratings from F1 2020 through F1 25",
		images: [
			{
				url: "/og.png",
				alt: "F1 Driver Ratings Tracker Twitter Card Image",
			},
		],
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${montserrat.className} ${cn(
					"bg-background antialiased min-h-screen flex flex-col"
				)}`}
			>
				<GoogleAnalytics gaId="G-1RFFEH7Z2B" />
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Header />
					<div className="flex-1">{children}</div>
					<Footer />
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
