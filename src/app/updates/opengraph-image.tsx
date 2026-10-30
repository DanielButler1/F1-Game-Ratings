import { latestReleaseLabel, OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og-image";

export const dynamic = "force-static";
export const alt = "Every ratings update on F1 Driver Ratings";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
	return ogImage({ section: "Updates", title: "Every ratings update", detail: "The changelog of every ratings update, newest first.", caption: `Latest: ${latestReleaseLabel()}` });
}
