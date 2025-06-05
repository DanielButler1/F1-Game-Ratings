"use client";

import { useState } from "react";
import {
	getAllDrivers,
	getDriverHistory,
	getAllGames,
	type Driver,
} from "@/lib/rankings";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatKey = keyof Pick<
	Driver,
	"overall" | "experience" | "racecraft" | "awareness" | "pace"
>;

const rankColors = {
	1: "bg-yellow-400 text-black font-bold ",
	2: "bg-zinc-300 text-black font-semibold ",
	3: "bg-amber-700 text-white font-semibold ",
	4: "bg-muted text-muted-foreground",
	5: "bg-muted text-muted-foreground",
	6: "bg-muted text-muted-foreground",
	7: "bg-muted text-muted-foreground",
	8: "bg-muted text-muted-foreground",
};

const stats: StatKey[] = [
	"overall",
	"experience",
	"racecraft",
	"awareness",
	"pace",
];

export default function ComparePage() {
	const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
	const allDrivers = getAllDrivers();

	const handleDriverSelect = (value: string) => {
		if (!selectedDrivers.includes(value) && selectedDrivers.length < 8) {
			setSelectedDrivers([...selectedDrivers, value]);
		}
	};

	const handleRemoveDriver = (driverName: string) => {
		setSelectedDrivers(selectedDrivers.filter((d) => d !== driverName));
	};

	const getRankForStat = (stat: StatKey, value: number, values: number[]) => {
		const sortedValues = [...values].sort((a, b) => b - a);
		return sortedValues.indexOf(value) + 1;
	};

	// Get the latest stats for the comparison table
	const latestDriverStats = selectedDrivers.map((driverName) => {
		const history = getDriverHistory(driverName);
		return history.history[history.history.length - 1].stats;
	});

	// Get all versions and sort them by newest first
	const getAllVersions = () => {
		const games = getAllGames();
		return games
			.flatMap((game) =>
				game.versions.map((version) => ({
					gameName: game.gameName,
					version,
				}))
			)
			.sort((a, b) => {
				// Extract year from game name (handles both 2-digit and 4-digit years)
				const yearA = parseInt(
					a.gameName.match(/F1\s*(?:20)?(\d{2})/i)?.[1] || "0"
				);
				const yearB = parseInt(
					b.gameName.match(/F1\s*(?:20)?(\d{2})/i)?.[1] || "0"
				);

				if (yearA !== yearB) {
					// Convert 2-digit year to 4-digit year if needed (assumes 20xx)
					const fullYearA = yearA < 100 ? 2000 + yearA : yearA;
					const fullYearB = yearB < 100 ? 2000 + yearB : yearB;
					return fullYearB - fullYearA;
				}

				// For same year/game, sort versions (B/0 comes before numbers)
				const versionA = a.version === "B" ? "0" : a.version;
				const versionB = b.version === "B" ? "0" : b.version;
				return parseInt(versionB) - parseInt(versionA);
			});
	};

	const versions = getAllVersions();

	// Get driver stats for a specific version
	const getDriverStatsForVersion = (
		driverName: string,
		gameName: string,
		version: string
	) => {
		const history = getDriverHistory(driverName);
		return history.history.find(
			(entry) => entry.gameName === gameName && entry.version === version
		)?.stats;
	};

	return (
		<div className="container mx-auto max-w-7xl py-8 px-4 md:px-0">
			<div className="flex flex-col space-y-8">
				<div className="flex flex-col space-y-4">
					<h1 className="text-4xl font-bold">Compare Drivers</h1>
					<p className="text-muted-foreground">
						Compare driver ratings side by side across different
						game versions.
					</p>
				</div>

				<Card className="p-6">
					<div className="grid gap-6">
						<div className="space-y-2">
							<h3 className="font-medium">Select Drivers</h3>
							<Select
								value={""}
								onValueChange={handleDriverSelect}
								disabled={selectedDrivers.length >= 8}
							>
								<SelectTrigger>
									<SelectValue
										placeholder={
											selectedDrivers.length === 0
												? "Choose a driver"
												: `${selectedDrivers.length} drivers selected`
										}
									/>
								</SelectTrigger>
								<SelectContent>
									{allDrivers
										.filter(
											(d) => !selectedDrivers.includes(d)
										)
										.map((driver) => (
											<SelectItem
												key={driver}
												value={driver}
											>
												{driver}
											</SelectItem>
										))}
								</SelectContent>
							</Select>
							<div className="flex flex-wrap gap-2 mt-2">
								{selectedDrivers.map((driver) => (
									<Badge
										key={driver}
										variant="secondary"
										className="flex items-center gap-2 py-1 px-3"
									>
										{driver}
										<button
											onClick={() =>
												handleRemoveDriver(driver)
											}
											className="hover:text-destructive text-lg leading-none pl-1"
										>
											×
										</button>
									</Badge>
								))}
							</div>
						</div>
					</div>
				</Card>

				{selectedDrivers.length > 0 && (
					<>
						<Card className="p-6">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Stat</TableHead>
										{selectedDrivers.map((name) => (
											<TableHead
												key={name}
												className="text-center w-[1%]"
											>
												{name}
											</TableHead>
										))}
									</TableRow>
								</TableHeader>
								<TableBody>
									{stats.map((stat) => (
										<TableRow key={stat}>
											<TableCell className="font-medium capitalize">
												{stat}
											</TableCell>
											{latestDriverStats.map((driver) => {
												const value = driver[stat];
												const rank = getRankForStat(
													stat,
													value,
													latestDriverStats.map(
														(d) => d[stat]
													)
												);
												return (
													<TableCell
														key={`${driver.name}-${stat}`}
														className={cn(
															"font-medium text-center w-[1%]",
															rankColors[
																rank as keyof typeof rankColors
															]
														)}
													>
														{value}
													</TableCell>
												);
											})}
										</TableRow>
									))}
								</TableBody>
							</Table>

							{versions.length > 0 && (
								<div className="mt-6">
									<h3 className="text-lg font-medium">
										{selectedDrivers.length > 1
											? "Latest Driver Stats"
											: "Driver Stats"}
									</h3>
									<Table className="mt-4">
										<TableHeader>
											<TableRow>
												<TableHead>Version</TableHead>
												{selectedDrivers.map((name) => (
													<TableHead
														key={name}
														className="text-center w-[1%]"
													>
														{name}
													</TableHead>
												))}
											</TableRow>
										</TableHeader>
										<TableBody>
											{versions.map(
												({ gameName, version }) => (
													<TableRow
														key={`${gameName}-${version}`}
													>
														<TableCell className="font-medium">
															{gameName} (
															{version})
														</TableCell>
														{selectedDrivers.map(
															(driverName) => {
																const driverStats =
																	getDriverStatsForVersion(
																		driverName,
																		gameName,
																		version
																	);
																const value =
																	driverStats?.overall;
																const allValues =
																	selectedDrivers
																		.map(
																			(
																				d
																			) =>
																				getDriverStatsForVersion(
																					d,
																					gameName,
																					version
																				)
																					?.overall
																		)
																		.filter(
																			(
																				v
																			): v is number =>
																				v !==
																				undefined
																		);

																const rank =
																	value !==
																	undefined
																		? getRankForStat(
																				"overall",
																				value,
																				allValues
																		  )
																		: undefined;

																return (
																	<TableCell
																		key={`${driverName}-${gameName}-${version}`}
																		className={cn(
																			"font-medium text-center w-[1%]",
																			value !==
																				undefined &&
																				rank
																				? rankColors[
																						rank as keyof typeof rankColors
																				  ]
																				: "text-muted-foreground"
																		)}
																	>
																		{value ??
																			"-"}
																	</TableCell>
																);
															}
														)}
													</TableRow>
												)
											)}
										</TableBody>
									</Table>
								</div>
							)}
						</Card>

						{stats.map((stat) => (
							<Card key={stat} className="p-6">
								<div className="mb-4">
									<h3 className="text-xl font-semibold capitalize">
										{stat}
									</h3>
								</div>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Version</TableHead>
											{selectedDrivers.map((name) => (
												<TableHead
													key={name}
													className="text-center w-[1%]"
												>
													{name}
												</TableHead>
											))}
										</TableRow>
									</TableHeader>
									<TableBody>
										{versions.map(
											({ gameName, version }) => (
												<TableRow
													key={`${gameName}-${version}`}
												>
													<TableCell className="font-medium">
														{gameName} ({version})
													</TableCell>
													{selectedDrivers.map(
														(driverName) => {
															const driverStats =
																getDriverStatsForVersion(
																	driverName,
																	gameName,
																	version
																);
															const value =
																driverStats?.[
																	stat
																];
															const allValues =
																selectedDrivers
																	.map(
																		(d) =>
																			getDriverStatsForVersion(
																				d,
																				gameName,
																				version
																			)?.[
																				stat
																			]
																	)
																	.filter(
																		(
																			v
																		): v is number =>
																			v !==
																			undefined
																	);

															const rank =
																value !==
																undefined
																	? getRankForStat(
																			stat,
																			value,
																			allValues
																	  )
																	: undefined;

															return (
																<TableCell
																	key={`${driverName}-${gameName}-${version}`}
																	className={cn(
																		"font-medium text-center w-[1%]",
																		value !==
																			undefined &&
																			rank
																			? rankColors[
																					rank as keyof typeof rankColors
																			  ]
																			: "text-muted-foreground"
																	)}
																>
																	{value ??
																		"-"}
																</TableCell>
															);
														}
													)}
												</TableRow>
											)
										)}
									</TableBody>
								</Table>
							</Card>
						))}
					</>
				)}
			</div>
		</div>
	);
}
