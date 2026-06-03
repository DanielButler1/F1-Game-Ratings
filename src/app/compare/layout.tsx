import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(
	"Compare",
	"Compare drivers side by side across multiple F1 game versions and rating categories."
);

export default function CompareLayout({
	children,
}: {
	children: ReactNode;
}) {
	return children;
}
