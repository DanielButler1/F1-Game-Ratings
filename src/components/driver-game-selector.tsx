"use client";

import { useMemo, useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface DriverGameSelectorProps {
	games: Array<{ gameName: string; versions: string[] }>;
	latestGame: { gameName: string; version: string };
	onChange?: (game: string, version: string) => void;
}

export default function DriverGameSelector({
	games,
	latestGame,
	onChange,
}: DriverGameSelectorProps) {
	const [selectedGame, setSelectedGame] = useState(latestGame.gameName);
	const [selectedVersion, setSelectedVersion] = useState(latestGame.version);

	const versions = useMemo(
		() =>
			selectedGame
				? games.find((g) => g.gameName === selectedGame)?.versions || []
				: [],
		[selectedGame, games]
	);

	// Notify parent on change
	useMemo(() => {
		onChange?.(selectedGame, selectedVersion);
	}, [selectedGame, selectedVersion, onChange]);

	return (
		<div className="grid gap-4 md:grid-cols-2">
			<div className="space-y-2">
				<h3 className="font-medium">Select Game</h3>
				<Select value={selectedGame} onValueChange={setSelectedGame}>
					<SelectTrigger>
						<SelectValue placeholder="Choose a game" />
					</SelectTrigger>
					<SelectContent>
						{games.map((game) => (
							<SelectItem
								key={game.gameName}
								value={game.gameName}
							>
								{game.gameName}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="space-y-2">
				<h3 className="font-medium">Select Version</h3>
				<Select
					value={selectedVersion}
					onValueChange={setSelectedVersion}
				>
					<SelectTrigger>
						<SelectValue placeholder="Choose a version" />
					</SelectTrigger>
					<SelectContent>
						{versions.map((version) => (
							<SelectItem key={version} value={version}>
								{version === "B" ? "Base" : `Update ${version}`}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
