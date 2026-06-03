import { Suspense } from "react";
import ComparePageClient from "@/components/compare/compare-page-client";

export default function ComparePage() {
	return (
		<Suspense fallback={null}>
			<ComparePageClient />
		</Suspense>
	);
}
