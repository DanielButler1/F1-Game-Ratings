import { latestReleaseLabel, OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og-image";

export const dynamic = "force-static";
export const alt = "How the F1 game rating system works";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
	return ogImage({ section: "Rating system", title: "How the ratings work", detail: "What overall, experience, racecraft, awareness and pace mean.", caption: `Latest: ${latestReleaseLabel()}` });
}
