import { latestReleaseLabel, OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og-image";

export const dynamic = "force-static";
export const alt = "Rating timelines on F1 Driver Ratings";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
	return ogImage({ section: "Timeline", title: "Ratings over time", detail: "How each driver's ratings have moved from game to game.", caption: `Latest: ${latestReleaseLabel()}` });
}
