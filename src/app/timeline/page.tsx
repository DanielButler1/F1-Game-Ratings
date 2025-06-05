"use client";

import { useState } from "react";
import { getAllGames, getDriverRankings, getAllDrivers } from "@/lib/rankings";
import { Card } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import { TooltipProps } from "recharts";

type StatKey = "overall" | "experience" | "racecraft" | "awareness" | "pace";
type StatTabKey = StatKey | "all";

const stats: Record<StatTabKey, string> = {
	all: "All Stats",
	overall: "Overall",
	experience: "Experience",
	racecraft: "Racecraft",
	awareness: "Awareness",
	pace: "Pace",
};

const chartConfig: Record<StatKey, { label: string; color: string }> = {
	overall: { label: "Overall", color: "#FF3366" },
	experience: { label: "Experience", color: "#33FF99" },
	racecraft: { label: "Racecraft", color: "#3366FF" },
	awareness: { label: "Awareness", color: "#FFCC33" },
	pace: { label: "Pace", color: "#9933FF" },
};

interface ChartDataPoint {
	name: string;
	overall: number;
	experience: number;
	racecraft: number;
	awareness: number;
	pace: number;
	isInterpolated: boolean;
	changes?:
		| {
				overall: number;
				experience: number;
				racecraft: number;
				awareness: number;
				pace: number;
		  }
		| null
		| undefined;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
	payload?: Array<{
		value: number;
		dataKey: StatKey;
		color: string;
		payload: ChartDataPoint;
	}>;
}

export default function TimelinePage() {
	const [selectedDriver, setSelectedDriver] = useState<string>("");
	const [selectedStat, setSelectedStat] = useState<string>("overall");
	const games = getAllGames();
	const drivers = getAllDrivers();

	// Get all ratings for the selected driver and track changes
	const driverRatings = selectedDriver
		? (games
				.map((game) => {
					let lastKnownRatings: (typeof game.versions)[0] extends string
						? ReturnType<typeof getDriverRankings>[0] | null
						: null = null;

					return game.versions.map(
						(version, versionIndex, versions) => {
							const ratings = getDriverRankings(
								game.gameName,
								version
							);
							const driverRating = ratings.find(
								(d) => d.name === selectedDriver
							);
							const isInterpolated =
								!driverRating && !!lastKnownRatings;

							// If there's no rating for this driver, use the last known ratings
							const currentRating =
								driverRating || lastKnownRatings;

							// If we still don't have ratings and this is the first version of the first game,
							// skip this entry as we have no previous data to use
							if (
								!currentRating &&
								game === games[0] &&
								versionIndex === 0
							) {
								return null;
							}

							// If we don't have current ratings but this isn't the first version/game,
							// try to get ratings from the previous game's last version
							if (!currentRating && !lastKnownRatings) {
								const prevGameIndex =
									games.findIndex(
										(g) => g.gameName === game.gameName
									) - 1;
								if (prevGameIndex >= 0) {
									const prevGame = games[prevGameIndex];
									const prevGameLastVersion =
										prevGame.versions[
											prevGame.versions.length - 1
										];
									const prevGameRatings = getDriverRankings(
										prevGame.gameName,
										prevGameLastVersion
									);
									const prevDriverRating =
										prevGameRatings.find(
											(d) => d.name === selectedDriver
										);
									if (prevDriverRating) {
										lastKnownRatings = prevDriverRating;
									}
								}
							}

							// Get previous version's ratings for change calculation
							let previousRating = null;
							if (versionIndex > 0) {
								const prevVersionRatings = getDriverRankings(
									game.gameName,
									versions[versionIndex - 1]
								);
								const prevDriverRating =
									prevVersionRatings.find(
										(d) => d.name === selectedDriver
									);
								previousRating =
									prevDriverRating || lastKnownRatings;
							} else if (game.gameName !== games[0].gameName) {
								const prevGameIndex =
									games.findIndex(
										(g) => g.gameName === game.gameName
									) - 1;
								if (prevGameIndex >= 0) {
									const prevGame = games[prevGameIndex];
									const prevGameLastVersion =
										prevGame.versions[
											prevGame.versions.length - 1
										];
									const prevGameRatings = getDriverRankings(
										prevGame.gameName,
										prevGameLastVersion
									);
									const prevDriverRating =
										prevGameRatings.find(
											(d) => d.name === selectedDriver
										);
									previousRating = prevDriverRating;
								}
							}

							// Update last known ratings
							if (driverRating) {
								lastKnownRatings = driverRating;
							} // If we still don't have any ratings to show, skip this entry
							if (!currentRating) return null;

							return {
								name: `${game.gameName} ${
									version === "B"
										? "Base"
										: `Update ${version}`
								}`,
								overall: currentRating.overall,
								experience: currentRating.experience,
								racecraft: currentRating.racecraft,
								awareness: currentRating.awareness,
								pace: currentRating.pace,
								isInterpolated,
								changes: previousRating
									? {
											overall:
												currentRating.overall -
												previousRating.overall,
											experience:
												currentRating.experience -
												previousRating.experience,
											racecraft:
												currentRating.racecraft -
												previousRating.racecraft,
											awareness:
												currentRating.awareness -
												previousRating.awareness,
											pace:
												currentRating.pace -
												previousRating.pace,
									  }
									: null,
							};
						}
					);
				})
				.flat()
				.filter((item) => item !== null) as ChartDataPoint[])
		: []; // Create data with gaps for interpolated points
	const chartData = driverRatings.map((point) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result = { ...point } as any;

		// For interpolated points, set stat values to null to create gaps
		if (point.isInterpolated) {
			(
				[
					"overall",
					"experience",
					"racecraft",
					"awareness",
					"pace",
				] as StatKey[]
			).forEach((stat) => {
				result[stat] = null;
			});
		}

		return result;
	});
	const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
		if (!active || !payload || !payload.length) return null;

		const isEstimated = payload[0]?.payload.isInterpolated;

		return (
			<div className="bg-card border-border rounded-lg border p-2 shadow-lg">
				<div className="flex items-center justify-between gap-2">
					<p className="font-medium">{label}</p>
					{isEstimated && (
						<span className="text-muted-foreground text-xs italic">
							(Estimated)
						</span>
					)}
				</div>
				<div className="mt-1 space-y-1">
					{" "}
					{payload.map((entry) => {
						const baseDataKey = entry.dataKey as StatKey;
						const change = entry.payload.changes?.[baseDataKey];

						return (
							<div
								key={entry.dataKey}
								className="flex items-center gap-2"
							>
								<div
									className="h-2 w-2 rounded-sm"
									style={{ backgroundColor: entry.color }}
								/>
								<span className="text-muted-foreground">
									{chartConfig[baseDataKey].label}:
								</span>
								<span className="font-mono tabular-nums">
									{entry.value === null ? "-" : entry.value}
									{entry.value !== null &&
										change !== undefined && (
											<span
												className={
													change > 0
														? "text-green-500"
														: change < 0
														? "text-red-500"
														: "text-muted-foreground"
												}
											>
												{" "}
												({change > 0 ? "+" : ""}
												{change})
											</span>
										)}
								</span>
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	return (
		<div className="container mx-auto max-w-7xl py-8 px-4 md:px-0">
			<div className="flex flex-col space-y-8">
				<div className="flex flex-col space-y-4">
					<h1 className="text-4xl font-bold">Rating Timeline</h1>
					<p className="text-muted-foreground text-lg">
						Track how driver ratings have changed across game
						versions and updates.
					</p>
				</div>

				<Card className="p-6">
					<div className="space-y-6">
						<div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
							<div className="w-full sm:w-72">
								<h3 className="mb-2 font-medium">
									Select Driver
								</h3>
								<Select onValueChange={setSelectedDriver}>
									<SelectTrigger>
										<SelectValue placeholder="Choose a driver" />
									</SelectTrigger>
									<SelectContent>
										{drivers.map((driver) => (
											<SelectItem
												key={driver}
												value={driver}
											>
												{driver}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="flex-1">
								<div className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2">
									{(
										Object.entries(stats) as [
											StatTabKey,
											string
										][]
									).map(([key, label]) => (
										<Button
											key={key}
											variant={
												selectedStat === key
													? "default"
													: "outline"
											}
											className="text-xs sm:text-sm"
											onClick={() => setSelectedStat(key)}
										>
											<span className="flex items-center gap-1.5">
												{key !== "all" && (
													<div
														className="h-2 w-2 rounded-sm"
														style={{
															backgroundColor:
																chartConfig[
																	key as StatKey
																].color,
														}}
													/>
												)}
												{label}
											</span>
										</Button>
									))}
								</div>
							</div>
						</div>
					</div>
				</Card>

				{selectedDriver && (
					<Card className="p-6">
						<div className="space-y-6">
							{" "}
							<div className="flex items-center justify-between">
								<h3 className="text-xl font-semibold">
									{selectedDriver} -{" "}
									{selectedStat === "all"
										? "All Stats"
										: stats[selectedStat as StatTabKey]}
								</h3>
							</div>
							<div className="w-full h-[500px] md:aspect-[2/1]">
								{" "}
								<ResponsiveContainer width="100%" height="100%">
									<LineChart
										data={chartData}
										margin={{
											top: 20,
											right: 20,
											bottom: 20,
											left: 20,
										}}
									>
										<CartesianGrid
											horizontal
											vertical={false}
											strokeDasharray="3 3"
										/>
										<XAxis
											dataKey="name"
											angle={-45}
											textAnchor="end"
											height={80}
											interval={0}
											tick={{ fontSize: 12 }}
										/>
										<YAxis
											domain={[0, 99]}
											ticks={[0, 20, 40, 60, 80, 99]}
										/>

										<Tooltip content={<CustomTooltip />} />

										{/* Solid lines with gaps for interpolated data */}
										{(selectedStat === "all" ||
											selectedStat === "overall") && (
											<Line
												type="monotone"
												dataKey="overall"
												stroke={
													chartConfig.overall.color
												}
												strokeWidth={2}
												dot={false}
												connectNulls={false}
											/>
										)}
										{(selectedStat === "all" ||
											selectedStat === "experience") && (
											<Line
												type="monotone"
												dataKey="experience"
												stroke={
													chartConfig.experience.color
												}
												strokeWidth={2}
												dot={false}
												connectNulls={false}
											/>
										)}
										{(selectedStat === "all" ||
											selectedStat === "racecraft") && (
											<Line
												type="monotone"
												dataKey="racecraft"
												stroke={
													chartConfig.racecraft.color
												}
												strokeWidth={2}
												dot={false}
												connectNulls={false}
											/>
										)}
										{(selectedStat === "all" ||
											selectedStat === "awareness") && (
											<Line
												type="monotone"
												dataKey="awareness"
												stroke={
													chartConfig.awareness.color
												}
												strokeWidth={2}
												dot={false}
												connectNulls={false}
											/>
										)}
										{(selectedStat === "all" ||
											selectedStat === "pace") && (
											<Line
												type="monotone"
												dataKey="pace"
												stroke={chartConfig.pace.color}
												strokeWidth={2}
												dot={false}
												connectNulls={false}
											/>
										)}
									</LineChart>
								</ResponsiveContainer>
							</div>
						</div>
					</Card>
				)}
			</div>
		</div>
	);
}
