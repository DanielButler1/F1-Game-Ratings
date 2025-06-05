"use client";

export const revalidate = 86400;

import { useMemo, useState } from "react";
import { notFound } from "next/navigation";
import {
	getDriverHistory,
	getAllGames,
	getDriverRankings,
	getLatestGameAndVersion,
} from "@/lib/rankings";
import { Card, CardHeader } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	Radar,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { use } from "react";

type Params = Promise<{ name: string }>;

interface RadarDataPoint {
	stat: string;
	value: number;
}

const CustomTooltip = ({
	active,
	payload,
}: {
	active?: boolean;
	payload?: Array<{
		value: number;
		payload: RadarDataPoint;
	}>;
}) => {
	if (!active || !payload?.length) return null;

	return (
		<div className="rounded-lg border bg-background p-2 shadow-md">
			<p className="font-medium text-sm">
				{payload[0].payload.stat}:{" "}
				<span className="text-blue-600">{payload[0].value}</span>
			</p>
		</div>
	);
};

export default function DriverPage(props: { params: Params }) {
	const params = use(props.params);
	const driverName = decodeURIComponent(params.name);
	const driverHistory = getDriverHistory(driverName);

	if (!driverHistory) {
		notFound();
	}

	const games = getAllGames();
	const latestGame = getLatestGameAndVersion();

	const [selectedGame, setSelectedGame] = useState(latestGame.gameName);
	const [selectedVersion, setSelectedVersion] = useState(latestGame.version);

	const versions = useMemo(
		() =>
			selectedGame
				? games.find((g) => g.gameName === selectedGame)?.versions || []
				: [],
		[selectedGame, games]
	);

	const stats = useMemo(() => {
		if (!selectedGame || !selectedVersion) {
			return driverHistory.history[driverHistory.history.length - 1]
				.stats;
		}
		const driverInVersion = getDriverRankings(
			selectedGame,
			selectedVersion
		).find((d) => d.name === driverName);
		return (
			driverInVersion ||
			driverHistory.history[driverHistory.history.length - 1].stats
		);
	}, [selectedGame, selectedVersion, driverHistory, driverName]);

	const radarData = [
		{
			stat: "Overall",
			value: stats.overall,
		},
		{
			stat: "Experience",
			value: stats.experience,
		},
		{
			stat: "Racecraft",
			value: stats.racecraft,
		},
		{
			stat: "Awareness",
			value: stats.awareness,
		},
		{
			stat: "Pace",
			value: stats.pace,
		},
	];

	return (
		<div className="container mx-auto max-w-7xl py-8 px-4 md:px-0">
			<div className="flex flex-col space-y-8">
				<div className="flex flex-col space-y-4">
					<h1 className="text-4xl font-bold">{driverName}</h1>
					<p className="text-muted-foreground">
						View {driverName}&apos;s ratings across different game
						versions.
					</p>
				</div>

				<Card className="p-6">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<h3 className="font-medium">Select Game</h3>
							<Select
								value={selectedGame}
								onValueChange={setSelectedGame}
							>
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
										<SelectItem
											key={version}
											value={version}
										>
											{version === "B"
												? "Base"
												: `Update ${version}`}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</Card>

				<div className="grid gap-6 md:grid-cols-1">
					<Card className="p-6">
						<div className="space-y-4">
							<CardHeader className="items-center p-0">
								<h3 className="text-xl font-semibold">
									Driver Stats
								</h3>
							</CardHeader>
							<div className="h-[300px]">
								<ResponsiveContainer width="100%" height="100%">
									<RadarChart data={radarData}>
										<PolarGrid />
										<PolarAngleAxis
											dataKey="stat"
											tick={{ fontSize: 12 }}
										/>
										<Tooltip content={<CustomTooltip />} />
										<Radar
											name="Current Stats"
											dataKey="value"
											fill="transparent"
											stroke="#2563eb"
											strokeWidth={2}
										/>
									</RadarChart>
								</ResponsiveContainer>
							</div>
							<div className="pt-4">
								<div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
									<div className="col-span-2 flex justify-between items-center border-b pb-2 mb-2">
										<div>
											<span className="font-medium">
												Overall:
											</span>{" "}
											<span className="text-blue-600">
												{stats.overall}
											</span>
										</div>
									</div>

									<div className="flex justify-between">
										<span>Experience</span>
										<span className="text-blue-600">
											{stats.experience}
										</span>
									</div>

									<div className="flex justify-between">
										<span>Racecraft</span>
										<span className="text-blue-600">
											{stats.racecraft}
										</span>
									</div>

									<div className="flex justify-between">
										<span>Awareness</span>
										<span className="text-blue-600">
											{stats.awareness}
										</span>
									</div>

									<div className="flex justify-between">
										<span>Pace</span>
										<span className="text-blue-600">
											{stats.pace}
										</span>
									</div>
								</div>
							</div>
						</div>
					</Card>

					<Card className="p-6">
						<div className="space-y-4">
							<h3 className="text-xl font-semibold">
								Rating History
							</h3>
							<div className="space-y-4">
								{driverHistory.history.map((entry) => (
									<div
										key={`${entry.gameName}-${entry.version}`}
										className="rounded-lg border p-4"
									>
										<div className="mb-2 flex items-center justify-between">
											<h4 className="font-semibold">
												{entry.gameName} (
												{entry.version === "B"
													? "Base"
													: `Update ${entry.version}`}
												)
											</h4>
											<span className="font-medium text-primary">
												Overall: {entry.stats.overall}
											</span>
										</div>
										<div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 md:grid-cols-4">
											<div className="flex gap-2">
												<span>Experience</span>
												<span className="font-medium">
													{entry.stats.experience}
												</span>
											</div>
											<div className="flex gap-2">
												<span>Racecraft</span>
												<span className="font-medium">
													{entry.stats.racecraft}
												</span>
											</div>
											<div className="flex gap-2">
												<span>Awareness</span>
												<span className="font-medium">
													{entry.stats.awareness}
												</span>
											</div>
											<div className="flex gap-2">
												<span>Pace</span>
												<span className="font-medium">
													{entry.stats.pace}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
