import { latestReleaseLabel, OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og-image";

export const dynamic = "force-static";
export const alt = "Frequently asked questions on F1 Driver Ratings";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
	return ogImage({ section: "FAQ", title: "Frequently asked questions", detail: "Answers about the ratings data, scoring and how the site works.", caption: `Latest: ${latestReleaseLabel()}` });
}
