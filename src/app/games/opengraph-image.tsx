import { latestReleaseLabel, OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og-image";

export const dynamic = "force-static";
export const alt = "Every F1 game release on F1 Driver Ratings";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
	return ogImage({ section: "Games", title: "Every F1 game release", detail: "Driver ratings for every version, from F1 2020 to the F1 26 Season Pack.", caption: `Latest: ${latestReleaseLabel()}` });
}
