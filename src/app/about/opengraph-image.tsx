import { latestReleaseLabel, OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og-image";

export const dynamic = "force-static";
export const alt = "About F1 Driver Ratings";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
	return ogImage({ section: "About", title: "About the tracker", detail: "What this tracker is, where the data comes from, and how it is maintained.", caption: `Latest: ${latestReleaseLabel()}` });
}
