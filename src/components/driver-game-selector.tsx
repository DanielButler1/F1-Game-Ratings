"use client";

import { useMemo } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getVersionLabel } from "@/lib/rankings";

interface DriverGameSelectorProps {
	games: Array<{ gameName: string; versions: string[] }>;
	selectedGame: string;
	selectedVersion: string;
	onGameChange: (game: string) => void;
	onVersionChange: (version: string) => void;
}

export default function DriverGameSelector({
	games,
	selectedGame,
	selectedVersion,
	onGameChange,
	onVersionChange,
}: DriverGameSelectorProps) {
	const versions = useMemo(
		() =>
			selectedGame
				? games.find((g) => g.gameName === selectedGame)?.versions || []
				: [],
		[selectedGame, games]
	);

	return (
		<div className="grid gap-4 md:grid-cols-2">
			<div className="space-y-2">
				<h3 className="font-medium">Select Game</h3>
				<Select value={selectedGame} onValueChange={onGameChange}>
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
				<Select value={selectedVersion} onValueChange={onVersionChange}>
					<SelectTrigger>
						<SelectValue placeholder="Choose a version" />
					</SelectTrigger>
					<SelectContent>
						{versions.map((version) => (
							<SelectItem key={version} value={version}>
								{getVersionLabel(selectedGame, version, "Base")}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
