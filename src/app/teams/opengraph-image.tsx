import { latestReleaseLabel, OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og-image";

export const dynamic = "force-static";
export const alt = "Team ratings on F1 Driver Ratings";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
	return ogImage({ section: "Teams", title: "Team ratings", detail: "Current and historical team ratings across every game release and update.", caption: `Latest: ${latestReleaseLabel()}` });
}
