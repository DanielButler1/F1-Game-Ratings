import { Suspense } from "react";
import DriversPageClient from "@/components/drivers/drivers-page-client";

export default function DriversPage() {
	return (
		<Suspense fallback={null}>
			<DriversPageClient />
		</Suspense>
	);
}
