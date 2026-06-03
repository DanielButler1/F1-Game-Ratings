import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(
	"Drivers",
	"Browse driver ratings and compare how every Formula One driver has evolved across the game series."
);

export default function DriversLayout({
	children,
}: {
	children: ReactNode;
}) {
	return children;
}
