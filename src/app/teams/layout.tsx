import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(
	"Teams",
	"View the current and historical Formula One team ratings across every game release and update."
);

export default function TeamsLayout({
	children,
}: {
	children: ReactNode;
}) {
	return children;
}
