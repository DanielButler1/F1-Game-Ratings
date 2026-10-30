import { Suspense } from "react";
import TimelinePageClient from "@/components/timeline/timeline-page-client";
import type { Metadata } from "next";
import { createPageMetadata, siteDescription } from "@/lib/seo";

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<{ driver?: string }>;
}): Promise<Metadata> {
	const { driver } = await searchParams;

	return createPageMetadata(
		driver ? `${driver} Timeline` : "Timeline",
		siteDescription
	);
}

export default function TimelinePage() {
	return (
		<Suspense fallback={null}>
			<TimelinePageClient />
		</Suspense>
	);
}
