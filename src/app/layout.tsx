import type React from "react";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/header";
import Footer from "@/components/footer";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { getMetadataBase, siteDescription, siteName } from "@/lib/seo";

const montserrat = Montserrat({
	subsets: ["latin"],
	variable: "--font-montserrat",
});

export const metadata: Metadata = {
	metadataBase: getMetadataBase(),
	title: siteName,
	description: siteDescription,
	// The preview image is app/opengraph-image.tsx (and each folder's own).
	openGraph: {
		siteName,
		locale: "en_GB",
		type: "website",
		title: siteName,
		description: siteDescription,
	},
	twitter: {
		card: "summary_large_image",
		title: siteName,
		description: siteDescription,
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={montserrat.variable}
			suppressHydrationWarning
		>
			<body className="flex min-h-dvh flex-col antialiased">
				<GoogleAnalytics gaId="G-1RFFEH7Z2B" />
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<NuqsAdapter>
						<Header />
						<div className="flex-1">{children}</div>
						<Footer />
						<Toaster />
					</NuqsAdapter>
				</ThemeProvider>
			</body>
		</html>
	);
}
