"use client";

import { useMemo } from "react";
import { parseAsString, useQueryStates } from "nuqs";
import DriverGameSelector from "@/components/driver-game-selector";
import DriverStatsChart from "@/components/driver-stats-chart";
import { getDriverRankings } from "@/lib/rankings";

interface DriverStatsClientWrapperProps {
	driverName: string;
	driverHistory: {
		history: Array<{
			gameName: string;
			version: string;
			stats: {
				overall: number;
				experience: number;
				racecraft: number;
				awareness: number;
				pace: number;
			};
		}>;
	};
	games: Array<{ gameName: string; versions: string[] }>;
	latestGame: { gameName: string; version: string };
}

const driverSearchParams = {
	game: parseAsString,
	version: parseAsString,
};

export default function DriverStatsClientWrapper({
	driverName,
	driverHistory,
	games,
	latestGame,
}: DriverStatsClientWrapperProps) {
	const [query, setQuery] = useQueryStates(driverSearchParams, {
		history: "replace",
	});

	// Only show UI if driverHistory has at least one entry
	const hasHistory = driverHistory.history.length > 0;
	const selectedGame =
		query.game && games.some((game) => game.gameName === query.game)
			? query.game
			: latestGame.gameName;

	const selectedGameVersions =
		games.find((game) => game.gameName === selectedGame)?.versions || [];
	const selectedVersion =
		query.version && selectedGameVersions.includes(query.version)
			? query.version
			: selectedGameVersions[selectedGameVersions.length - 1] ||
			  latestGame.version;

	const stats = useMemo(() => {
		if (!hasHistory || !selectedGame || !selectedVersion) {
			return undefined;
		}
		try {
			const driverInVersion = getDriverRankings(
				selectedGame,
				selectedVersion
			).find((d) => d.name === driverName);
			return (
				driverInVersion ||
				driverHistory.history[driverHistory.history.length - 1].stats
			);
		} catch {
			return driverHistory.history[driverHistory.history.length - 1]
				.stats;
		}
	}, [hasHistory, selectedGame, selectedVersion, driverHistory, driverName]);

	if (!hasHistory) {
		return (
			<div className="py-8 text-center text-muted-foreground">
				No rating data available for this driver.
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<DriverGameSelector
				games={games}
				selectedGame={selectedGame}
				selectedVersion={selectedVersion}
				onGameChange={(game) => {
					const nextVersions =
						games.find((entry) => entry.gameName === game)
							?.versions || [];

					setQuery({
						game,
						version: nextVersions[nextVersions.length - 1] || "B",
					});
				}}
				onVersionChange={(version) => {
					setQuery({ version });
				}}
			/>
			{stats && (
				<DriverStatsChart driverName={driverName} stats={stats} />
			)}
		</div>
	);
}
