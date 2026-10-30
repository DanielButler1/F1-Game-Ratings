import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og-image";
import {
	getAllGames,
	getDriverRankings,
	getGameRouteSegment,
	getVersionLabel,
	resolveGameNameFromRoute,
} from "@/lib/rankings";

export const dynamic = "force-static";
export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Driver ratings for an F1 game release on F1 Driver Ratings";

export function generateStaticParams() {
	return getAllGames().flatMap((game) =>
		game.versions.map((version) => ({ game: getGameRouteSegment(game.gameName), patch: version }))
	);
}

export default async function Image({ params }: { params: Promise<{ game: string; patch: string }> }) {
	const { game, patch } = await params;
	const gameName = resolveGameNameFromRoute(game);
	const drivers = getDriverRankings(gameName, patch).sort((a, b) => b.overall - a.overall);
	return ogImage({
		section: getVersionLabel(gameName, patch),
		title: gameName,
		detail: `Ratings for all ${drivers.length} drivers: overall, experience, racecraft, awareness and pace.`,
		podium: drivers.slice(0, 3),
		caption: "Top 3 overall",
	});
}
