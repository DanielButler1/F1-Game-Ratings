import { OG_CONTENT_TYPE, OG_SIZE, ogImage, releaseLabel } from "@/lib/og-image";
import {
	getAllDrivers,
	getDriverHistory,
	getDriverRouteSegment,
	resolveDriverNameFromRoute,
} from "@/lib/rankings";

export const dynamic = "force-static";
export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "A driver's F1 game ratings on F1 Driver Ratings";

export function generateStaticParams() {
	return getAllDrivers().map((name) => ({ name: getDriverRouteSegment(name) }));
}

export default async function Image({ params }: { params: Promise<{ name: string }> }) {
	const name = resolveDriverNameFromRoute((await params).name);
	const { history } = getDriverHistory(name);
	const latest = history.at(-1)!;
	const games = new Set(history.map((entry) => entry.gameName)).size;
	return ogImage({
		section: "Driver",
		title: name,
		detail: `Ratings across ${games} F1 ${games === 1 ? "game" : "games"} and every update.`,
		stats: latest.stats,
		caption: releaseLabel(latest.gameName, latest.version),
	});
}
