import { latestReleaseLabel, OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og-image";
import { getDriverRankings, getLatestGameAndVersion } from "@/lib/rankings";

export const dynamic = "force-static";
export const alt = "F1 Driver Ratings: every F1 game driver rating, tracked";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
	const { gameName, version } = getLatestGameAndVersion();
	const podium = getDriverRankings(gameName, version)
		.sort((a, b) => b.overall - a.overall)
		.slice(0, 3);
	return ogImage({
		title: "Every F1 game driver rating, tracked",
		detail: "From F1 2020 to the F1 26 Season Pack, across every update.",
		podium,
		caption: `Top 3 in ${latestReleaseLabel()}`,
	});
}
