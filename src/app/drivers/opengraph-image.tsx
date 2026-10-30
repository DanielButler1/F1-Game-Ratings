import { latestReleaseLabel, OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og-image";

export const dynamic = "force-static";
export const alt = "Every driver's ratings on F1 Driver Ratings";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
	return ogImage({ section: "Drivers", title: "Every driver's ratings", detail: "How every Formula One driver has been rated across the game series.", caption: `Latest: ${latestReleaseLabel()}` });
}
