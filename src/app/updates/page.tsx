import { Suspense } from "react";
import UpdatesPageClient from "@/components/updates/updates-page-client";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(
	"Updates",
	"Read the changelog of every ratings update, ordered from newest to oldest."
);

export default function UpdatesPage() {
	return (
		<Suspense fallback={null}>
			<UpdatesPageClient />
		</Suspense>
	);
}
