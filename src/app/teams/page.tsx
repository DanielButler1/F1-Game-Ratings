import { Suspense } from "react";
import TeamsPageClient from "@/components/teams/teams-page-client";

export default function TeamsPage() {
	return (
		<Suspense fallback={null}>
			<TeamsPageClient />
		</Suspense>
	);
}
