import { latestReleaseLabel, OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og-image";

export const dynamic = "force-static";
export const alt = "Compare drivers on F1 Driver Ratings";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
	return ogImage({ section: "Compare", title: "Compare drivers side by side", detail: "Head to head across game versions and every rating category.", caption: `Latest: ${latestReleaseLabel()}` });
}
