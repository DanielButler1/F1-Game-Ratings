"use client";

import { useQueryStates, parseAsArrayOf, parseAsString } from "nuqs";
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

const compareSearchParams = {
	drivers: parseAsArrayOf(parseAsString).withDefault([]),
};

export default function ComparePageClient() {
	const [query, setQuery] = useQueryStates(compareSearchParams, {
		history: "replace",
	});
	const selectedDrivers = query.drivers;
	const allDrivers = getAllDrivers();

	const handleDriverSelect = (value: string) => {
		if (!selectedDrivers.includes(value) && selectedDrivers.length < 8) {
			setQuery({ drivers: [...selectedDrivers, value] });
		}
	};

	const handleRemoveDriver = (driverName: string) => {
		setQuery({ drivers: selectedDrivers.filter((d) => d !== driverName) });
	};

	const getRankForStat = (stat: StatKey, value: number, values: number[]) => {
		const sortedValues = [...values].sort((a, b) => b - a);
		return sortedValues.indexOf(value) + 1;
	};

	const latestDriverStats = selectedDrivers.map((driverName) => {
		const history = getDriverHistory(driverName);
		return history.history[history.history.length - 1].stats;
	});

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
				const yearA = parseInt(
					a.gameName.match(/F1\s*(?:20)?(\d{2})/i)?.[1] || "0"
				);
				const yearB = parseInt(
					b.gameName.match(/F1\s*(?:20)?(\d{2})/i)?.[1] || "0"
				);

				if (yearA !== yearB) {
					const fullYearA = yearA < 100 ? 2000 + yearA : yearA;
					const fullYearB = yearB < 100 ? 2000 + yearB : yearB;
					return fullYearB - fullYearA;
				}

				const versionA = a.version === "B" ? "0" : a.version;
				const versionB = b.version === "B" ? "0" : b.version;
				return parseInt(versionB) - parseInt(versionA);
			});
	};

	const versions = getAllVersions();

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
		<div className="container mx-auto max-w-7xl px-4 py-8 md:px-0">
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
								value=""
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
										.filter((d) => !selectedDrivers.includes(d))
										.map((driver) => (
											<SelectItem key={driver} value={driver}>
												{driver}
											</SelectItem>
										))}
								</SelectContent>
							</Select>
						</div>

						{selectedDrivers.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{selectedDrivers.map((driver) => (
									<Badge
										key={driver}
										variant="secondary"
										className="cursor-pointer"
										onClick={() => handleRemoveDriver(driver)}
									>
										{driver} ×
									</Badge>
								))}
							</div>
						)}
					</div>
				</Card>

				{selectedDrivers.length > 0 && (
					<div className="space-y-8">
						<Card className="overflow-hidden">
							<div className="border-b p-6">
								<h3 className="text-xl font-semibold">
									Current Ratings
								</h3>
							</div>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="pl-6 text-left">
											Driver
										</TableHead>
										{stats.map((stat) => (
											<TableHead
												key={stat}
												className="px-4 text-center"
											>
												{stat.charAt(0).toUpperCase() +
													stat.slice(1)}
											</TableHead>
										))}
									</TableRow>
								</TableHeader>
								<TableBody>
									{selectedDrivers.map((driverName, index) => {
										const latestStats = latestDriverStats[index];

										if (!latestStats) return null;

										return (
											<TableRow key={driverName}>
												<TableCell className="pl-6 font-medium">
													{driverName}
												</TableCell>
												{stats.map((stat) => {
													const values = latestDriverStats
														.map((s) => s[stat])
														.filter(
															(value): value is number =>
																typeof value === "number"
														);
													const rank = getRankForStat(
														stat,
														latestStats[stat],
														values
													);

													return (
														<TableCell
															key={`${driverName}-${stat}`}
															className="px-4 text-center font-medium"
														>
															<div className="flex items-center justify-center gap-2">
																<span>{latestStats[stat]}</span>
																<span
																	className={cn(
																		"rounded-full px-2 py-0.5 text-xs",
																		rankColors[
																			rank as keyof typeof rankColors
																		]
																	)}
																>
																	#{rank}
																</span>
															</div>
														</TableCell>
													);
												})}
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</Card>

						<Card className="overflow-hidden">
							<div className="border-b p-6">
								<h3 className="text-xl font-semibold">
									Versions Comparison
								</h3>
							</div>
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="pl-6 text-left">
												Version
											</TableHead>
											{selectedDrivers.map((driver) => (
												<TableHead
													key={driver}
													className="px-4 text-center"
												>
													{driver}
												</TableHead>
											))}
										</TableRow>
									</TableHeader>
									<TableBody>
										{versions.map(({ gameName, version }) => (
											<TableRow key={`${gameName}-${version}`}>
												<TableCell className="pl-6 font-medium">
													{gameName} ({version})
												</TableCell>
												{selectedDrivers.map((driverName) => {
													const statsData =
														getDriverStatsForVersion(
															driverName,
															gameName,
															version
														);

													return (
														<TableCell
															key={`${gameName}-${version}-${driverName}`}
															className="px-4 text-center"
														>
															{statsData ? statsData.overall : "-"}
														</TableCell>
													);
												})}
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</Card>
					</div>
				)}
			</div>
		</div>
	);
}
