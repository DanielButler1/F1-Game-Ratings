import { Suspense } from "react";
import TimelinePageClient from "@/components/timeline/timeline-page-client";
import type { Metadata } from "next";
import { siteDescription, siteName } from "@/lib/seo";

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<{ driver?: string }>;
}): Promise<Metadata> {
	const { driver } = await searchParams;

	if (driver) {
		return {
			title: `${driver} Timeline | ${siteName}`,
			description: siteDescription,
		};
	}

	return {
		title: `Timeline | ${siteName}`,
		description: siteDescription,
	};
}

export default function TimelinePage() {
	return (
		<Suspense fallback={null}>
			<TimelinePageClient />
		</Suspense>
	);
}
