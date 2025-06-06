"use client";

import { useMemo, useState } from "react";
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

export default function DriverStatsClientWrapper({
	driverName,
	driverHistory,
	games,
	latestGame,
}: DriverStatsClientWrapperProps) {
	const [selectedGame, setSelectedGame] = useState(latestGame.gameName);
	const [selectedVersion, setSelectedVersion] = useState(latestGame.version);

	// Only show UI if driverHistory has at least one entry
	const hasHistory = driverHistory.history.length > 0;

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
				latestGame={latestGame}
				onChange={(game, version) => {
					setSelectedGame(game);
					setSelectedVersion(version);
				}}
			/>
			{stats && (
				<DriverStatsChart driverName={driverName} stats={stats} />
			)}
		</div>
	);
}
