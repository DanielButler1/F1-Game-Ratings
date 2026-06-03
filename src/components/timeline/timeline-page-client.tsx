"use client";

import { useEffect } from "react";
import { useQueryStates, parseAsString, parseAsStringLiteral } from "nuqs";
import {
	getAllGames,
	getDriverRankings,
	getAllDrivers,
	getVersionLabel,
} from "@/lib/rankings";
import { siteName } from "@/lib/seo";
import { Card } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
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
import { cn } from "@/lib/utils";

type StatKey = "overall" | "experience" | "racecraft" | "awareness" | "pace";
type StatTabKey = StatKey | "all";

const statKeys: StatKey[] = [
	"overall",
	"experience",
	"racecraft",
	"awareness",
	"pace",
];

const statTabKeys = ["all", ...statKeys] as const satisfies readonly StatTabKey[];

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

const timelineSearchParams = {
	driver: parseAsString.withDefault(""),
	stat: parseAsStringLiteral(statTabKeys).withDefault("overall"),
};

interface ChartDataPoint {
	name: string;
	overall: number | null;
	experience: number | null;
	racecraft: number | null;
	awareness: number | null;
	pace: number | null;
	hasRating: boolean;
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

interface CustomTooltipProps {
	active?: boolean;
	payload?: Array<{
		value: number | null;
		dataKey: StatKey;
		color: string;
		payload: ChartDataPoint;
	}>;
	label?: string;
}

export default function TimelinePageClient() {
	const [query, setQuery] = useQueryStates(timelineSearchParams, {
		history: "push",
	});

	const selectedDriver = query.driver;
	const selectedStat = query.stat;
	const selectedStatKey = selectedStat === "all" ? null : selectedStat;
	const games = getAllGames();
	const drivers = getAllDrivers();

	useEffect(() => {
		document.title = selectedDriver
			? `${selectedDriver} Timeline | ${siteName}`
			: `Timeline | ${siteName}`;
	}, [selectedDriver]);

	const driverRatings = selectedDriver
		? (() => {
				let lastActualPoint: ChartDataPoint | null = null;

				return games
					.flatMap((game) => game.versions.map((version) => ({ game, version })))
					.reduce<ChartDataPoint[]>((points, { game, version }) => {
						const ratings = getDriverRankings(game.gameName, version);
						const driverRating =
							ratings.find((d) => d.name === selectedDriver) ?? null;
						const pointName = `${game.gameName} ${getVersionLabel(
							game.gameName,
							version
						)}`;

						if (!driverRating) {
							points.push({
								name: pointName,
								overall: null,
								experience: null,
								racecraft: null,
								awareness: null,
								pace: null,
								hasRating: false,
								changes: null,
							});
							return points;
						}

						points.push({
							name: pointName,
							overall: driverRating.overall,
							experience: driverRating.experience,
							racecraft: driverRating.racecraft,
							awareness: driverRating.awareness,
							pace: driverRating.pace,
							hasRating: true,
							changes: lastActualPoint
								? {
										overall:
											driverRating.overall -
											(lastActualPoint.overall ?? driverRating.overall),
										experience:
											driverRating.experience -
											(lastActualPoint.experience ??
												driverRating.experience),
										racecraft:
											driverRating.racecraft -
											(lastActualPoint.racecraft ??
												driverRating.racecraft),
										awareness:
											driverRating.awareness -
											(lastActualPoint.awareness ??
												driverRating.awareness),
										pace:
											driverRating.pace - (lastActualPoint.pace ?? driverRating.pace),
								  }
								: null,
						});

						lastActualPoint = points[points.length - 1];

						return points;
					}, []);
		  })()
		: [];

	const chartData = driverRatings;
	const tableRows = [...driverRatings].reverse();

	const formatDelta = (delta: number | undefined | null) => {
		if (delta === undefined || delta === null) {
			return (
				<span className="text-muted-foreground inline-flex min-w-[5ch] justify-center font-mono tabular-nums">
					-
				</span>
			);
		}

		if (delta === 0) {
			return (
				<span className="text-muted-foreground inline-flex min-w-[5ch] justify-center font-mono tabular-nums">
					{"\u00b10"}
				</span>
			);
		}

		return (
			<span
				className={
					"inline-flex min-w-[5ch] justify-center font-mono tabular-nums " +
					(delta > 0
						? "text-green-500"
						: delta < 0
							? "text-red-500"
							: "text-muted-foreground")
				}
			>
				({delta > 0 ? "+" : ""}
				{delta})
			</span>
		);
	};

	const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
		if (!active || !payload || !payload.length) return null;

		const hasRating = payload[0]?.payload.hasRating;

		if (!hasRating) return null;

		return (
			<div className="bg-card border-border rounded-lg border p-2 shadow-lg">
				<div className="flex items-center justify-between gap-2">
					<p className="font-medium">{label}</p>
				</div>
				<div className="mt-1 space-y-1">
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
								<Select
									value={selectedDriver}
									onValueChange={(value) =>
										setQuery({ driver: value })
									}
								>
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
								<div className="grid w-full grid-cols-3 gap-2 lg:grid-cols-6">
									{(
										Object.entries(stats) as [StatTabKey, string][]
									).map(([key, label]) => (
										<Button
											key={key}
											variant={
												selectedStat === key
													? "default"
													: "outline"
											}
											className="text-xs sm:text-sm"
											onClick={() => setQuery({ stat: key })}
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
					<div className="space-y-6">
						<Card className="p-6">
							<div className="space-y-6">
								<div className="flex items-center justify-between">
									<h3 className="text-xl font-semibold">
										{selectedDriver} -{" "}
										{selectedStat === "all"
											? "All Stats"
											: stats[selectedStat as StatTabKey]}
									</h3>
								</div>
								<div className="h-[500px] w-full md:aspect-[2/1]">
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

											{(selectedStat === "all" ||
												selectedStat === "overall") && (
												<Line
													type="monotone"
													dataKey="overall"
													stroke={chartConfig.overall.color}
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
													stroke={chartConfig.experience.color}
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
													stroke={chartConfig.racecraft.color}
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
													stroke={chartConfig.awareness.color}
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

						<Card className="overflow-hidden">
							<div className="border-b p-6">
								<h3 className="text-xl font-semibold">
									Timeline Table
								</h3>
								<p className="text-muted-foreground mt-1 text-sm">
									The same driver history shown in the graph,
									with inline deltas for each stat.
								</p>
							</div>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="pl-6 text-left">
											Patch
										</TableHead>
										{statKeys.map((stat) => (
											<TableHead
												key={stat}
												className={cn(
													selectedStat !== "all" &&
														selectedStatKey === stat &&
														"bg-muted/60",
													"px-4 text-center"
												)}
											>
												<div className="flex items-center justify-center gap-2">
													{chartConfig[stat].label}
													<span
														className="h-2 w-2 rounded-sm"
														style={{
															backgroundColor:
																chartConfig[stat].color,
														}}
													/>
												</div>
											</TableHead>
										))}
									</TableRow>
								</TableHeader>
								<TableBody>
									{tableRows.map((point) => (
										<TableRow key={point.name}>
											<TableCell className="pl-6 font-medium">
												{point.name}
											</TableCell>
											{statKeys.map((stat) => {
												const change = point.changes?.[stat];
												const value = point[stat];

												return (
													<TableCell
														key={`${point.name}-${stat}`}
														className={cn(
															selectedStat !== "all" &&
																selectedStatKey === stat &&
																"bg-muted/60",
															"px-4 text-center font-mono tabular-nums"
														)}
													>
														<div className="flex items-center justify-center gap-2">
															<span className="inline-flex min-w-[3ch] justify-center font-mono tabular-nums">
																{value ?? "-"}
															</span>
															{formatDelta(change)}
														</div>
													</TableCell>
												);
											})}
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Card>
					</div>
				)}
			</div>
		</div>
	);
}
