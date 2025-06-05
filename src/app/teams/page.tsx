"use client";

import { useState } from "react";
import { getAllGames, getDriverRankings, type Driver } from "@/lib/rankings";
import { Card } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ComparisonBar } from "@/components/ui/comparison-bar";

type TeamDrivers = {
	[key: string]: {
		[key: string]: string[];
	};
};

type TeamStats = {
	team: string;
	drivers: (Driver | undefined)[];
	averageStats: {
		overall: number;
		experience: number;
		racecraft: number;
		awareness: number;
		pace: number;
	};
};

// Team definitions for each season
const teamDrivers: TeamDrivers = {
	"F1 2020": {
		Mercedes: ["Lewis Hamilton", "Valtteri Bottas"],
		"Red Bull": ["Max Verstappen", "Alexander Albon"],
		Ferrari: ["Charles Leclerc", "Sebastian Vettel"],
		McLaren: ["Carlos Sainz", "Lando Norris"],
		Renault: ["Daniel Ricciardo", "Esteban Ocon"],
		"Racing Point": ["Sergio Perez", "Lance Stroll"],
		AlphaTauri: ["Pierre Gasly", "Daniil Kvyat"],
		"Alfa Romeo": ["Kimi Raikkonen", "Antonio Giovinazzi"],
		Haas: ["Romain Grosjean", "Kevin Magnussen"],
		Williams: ["George Russell", "Nicholas Latifi"],
	},
	"F1 2021": {
		Mercedes: ["Lewis Hamilton", "Valtteri Bottas"],
		"Red Bull": ["Max Verstappen", "Sergio Perez"],
		Ferrari: ["Charles Leclerc", "Carlos Sainz"],
		McLaren: ["Daniel Ricciardo", "Lando Norris"],
		Alpine: ["Fernando Alonso", "Esteban Ocon"],
		AlphaTauri: ["Pierre Gasly", "Yuki Tsunoda"],
		"Aston Martin": ["Sebastian Vettel", "Lance Stroll"],
		"Alfa Romeo": ["Kimi Raikkonen", "Antonio Giovinazzi"],
		Haas: ["Mick Schumacher", "Nikita Mazepin"],
		Williams: ["George Russell", "Nicholas Latifi"],
	},
	"F1 22": {
		Mercedes: ["Lewis Hamilton", "George Russell"],
		"Red Bull": ["Max Verstappen", "Sergio Perez"],
		Ferrari: ["Charles Leclerc", "Carlos Sainz"],
		McLaren: ["Daniel Ricciardo", "Lando Norris"],
		Alpine: ["Fernando Alonso", "Esteban Ocon"],
		AlphaTauri: ["Pierre Gasly", "Yuki Tsunoda"],
		"Aston Martin": ["Sebastian Vettel", "Lance Stroll"],
		"Alfa Romeo": ["Valtteri Bottas", "Zhou Guanyu"],
		Haas: ["Kevin Magnussen", "Mick Schumacher"],
		Williams: ["Alexander Albon", "Nicholas Latifi"],
	},
	"F1 23": {
		Mercedes: ["Lewis Hamilton", "George Russell"],
		"Red Bull": ["Max Verstappen", "Sergio Perez"],
		Ferrari: ["Charles Leclerc", "Carlos Sainz"],
		McLaren: ["Lando Norris", "Oscar Piastri"],
		Alpine: ["Pierre Gasly", "Esteban Ocon"],
		AlphaTauri: ["Yuki Tsunoda", "Nyck De Vries"],
		"Aston Martin": ["Fernando Alonso", "Lance Stroll"],
		"Alfa Romeo": ["Valtteri Bottas", "Zhou Guanyu"],
		Haas: ["Kevin Magnussen", "Nico Hulkenberg"],
		Williams: ["Alexander Albon", "Logan Sargeant"],
	},
	"F1 24": {
		Mercedes: ["Lewis Hamilton", "George Russell"],
		"Red Bull": ["Max Verstappen", "Sergio Perez"],
		Ferrari: ["Charles Leclerc", "Carlos Sainz"],
		McLaren: ["Lando Norris", "Oscar Piastri"],
		"Aston Martin": ["Fernando Alonso", "Lance Stroll"],
		Alpine: ["Pierre Gasly", "Esteban Ocon"],
		Williams: ["Alexander Albon", "Logan Sargeant"],
		AlphaTauri: ["Daniel Ricciardo", "Yuki Tsunoda"],
		"Alfa Romeo": ["Valtteri Bottas", "Zhou Guanyu"],
		Haas: ["Kevin Magnussen", "Nico Hulkenberg"],
	},
	"F1 25": {
		Mercedes: ["Kimi Antonelli", "George Russell"],
		"Red Bull": ["Max Verstappen", "Yuki Tsunoda"],
		Ferrari: ["Charles Leclerc", "Lewis Hamilton"],
		McLaren: ["Lando Norris", "Oscar Piastri"],
		"Aston Martin": ["Fernando Alonso", "Lance Stroll"],
		Alpine: ["Pierre Gasly", "Jack Doohan"],
		Williams: ["Alexander Albon", "Carlos Sainz"],
		"Racing Bulls": ["Liam Lawson", "Isack Hadjar"],
		"Kick Sauber": ["Nico Hulkenberg", "Gabriel Bortoleto"],
		Haas: ["Oliver Bearman", "Esteban Ocon"],
	},
};

export default function TeamsPage() {
	const games = getAllGames();
	const latestGame = games[games.length - 1]?.gameName || "";

	const [selectedGame, setSelectedGame] = useState(latestGame);
	const [selectedVersion, setSelectedVersion] = useState("B");

	const handleGameChange = (game: string) => {
		setSelectedGame(game);
		setSelectedVersion("B"); // Always set to base version when game changes
	};

	const versions = selectedGame
		? games.find((g) => g.gameName === selectedGame)?.versions || []
		: [];

	// Calculate team stats when both game and version are selected
	const teamStats: TeamStats[] =
		selectedGame && selectedVersion
			? Object.entries(
					teamDrivers[selectedGame as keyof typeof teamDrivers]
			  )
					.map(([team, drivers]) => {
						const allDrivers = getDriverRankings(
							selectedGame,
							selectedVersion
						);
						const teamDriverStats = drivers
							.map((driver) =>
								allDrivers.find((d) => d.name === driver)
							)
							.filter(Boolean);

						const averageStats = {
							overall: Math.round(
								teamDriverStats.reduce(
									(sum, d) => sum + (d?.overall || 0),
									0
								) / teamDriverStats.length
							),
							experience: Math.round(
								teamDriverStats.reduce(
									(sum, d) => sum + (d?.experience || 0),
									0
								) / teamDriverStats.length
							),
							racecraft: Math.round(
								teamDriverStats.reduce(
									(sum, d) => sum + (d?.racecraft || 0),
									0
								) / teamDriverStats.length
							),
							awareness: Math.round(
								teamDriverStats.reduce(
									(sum, d) => sum + (d?.awareness || 0),
									0
								) / teamDriverStats.length
							),
							pace: Math.round(
								teamDriverStats.reduce(
									(sum, d) => sum + (d?.pace || 0),
									0
								) / teamDriverStats.length
							),
						};

						return {
							team,
							drivers: teamDriverStats,
							averageStats,
						};
					})
					.sort(
						(a, b) =>
							b.averageStats.overall - a.averageStats.overall
					)
			: [];

	return (
		<div className="container mx-auto max-w-7xl py-8 px-4 md:px-0">
			<div className="flex flex-col space-y-8">
				<div className="flex flex-col space-y-4">
					<h1 className="text-4xl font-bold">F1 Teams</h1>
					<p className="text-muted-foreground">
						Compare team performance based on their drivers&apos;
						ratings.
					</p>
				</div>

				<Card className="p-6">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<h3 className="font-medium">Select Game</h3>
							<Select
								onValueChange={handleGameChange}
								value={selectedGame}
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
								onValueChange={setSelectedVersion}
								disabled={!selectedGame}
								value={selectedVersion}
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
												? "Base Game"
												: `Update ${version}`}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</Card>

				{teamStats.length > 0 && (
					<div className="grid gap-6">
						{teamStats.map(({ team, drivers, averageStats }) => (
							<Card key={team} className="p-6">
								<div className="space-y-6">
									<div className="flex items-center justify-between">
										<h3 className="text-2xl font-semibold">
											{team}
										</h3>
									</div>

									<div className="">
										<div className="grid gap-6 grid-cols-1">
											<div className="flex flex-col gap-4">
												{/* First Driver and Comparison Bars */}
												<div className="flex flex-col gap-3">
													<div className="flex justify-between">
														<h4 className="font-medium text-blue-500">
															{drivers[0]?.name}
														</h4>
														<h4 className="font-medium text-red-500">
															{drivers[1]?.name}
														</h4>
													</div>
													{drivers[0] &&
														drivers[1] && (
															<>
																<div className="flex items-center gap-2">
																	<span className="w-20 text-sm text-muted-foreground">
																		OVR
																	</span>
																	<ComparisonBar
																		leftValue={
																			drivers[0]
																				.overall
																		}
																		rightValue={
																			drivers[1]
																				.overall
																		}
																		className="h-2"
																	/>
																</div>
																<div className="flex items-center gap-2">
																	<span className="w-20 text-sm text-muted-foreground">
																		EXP
																	</span>
																	<ComparisonBar
																		leftValue={
																			drivers[0]
																				.experience
																		}
																		rightValue={
																			drivers[1]
																				.experience
																		}
																		className="h-2"
																	/>
																</div>
																<div className="flex items-center gap-2">
																	<span className="w-20 text-sm text-muted-foreground">
																		RAC
																	</span>
																	<ComparisonBar
																		leftValue={
																			drivers[0]
																				.racecraft
																		}
																		rightValue={
																			drivers[1]
																				.racecraft
																		}
																		className="h-2"
																	/>
																</div>
																<div className="flex items-center gap-2">
																	<span className="w-20 text-sm text-muted-foreground">
																		AWA
																	</span>
																	<ComparisonBar
																		leftValue={
																			drivers[0]
																				.awareness
																		}
																		rightValue={
																			drivers[1]
																				.awareness
																		}
																		className="h-2"
																	/>
																</div>
																<div className="flex items-center gap-2">
																	<span className="w-20 text-sm text-muted-foreground">
																		PAC
																	</span>
																	<ComparisonBar
																		leftValue={
																			drivers[0]
																				.pace
																		}
																		rightValue={
																			drivers[1]
																				.pace
																		}
																		className="h-2"
																	/>
																</div>
															</>
														)}
												</div>
											</div>
										</div>
									</div>

									<div className="pt-4 border-t">
										<div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
											<div className="text-center">
												<span className="text-sm text-muted-foreground">
													Overall
												</span>
												<p className="text-lg font-medium">
													{averageStats.overall}
												</p>
											</div>
											<div className="text-center">
												<span className="text-sm text-muted-foreground">
													Experience
												</span>
												<p className="text-lg font-medium">
													{averageStats.experience}
												</p>
											</div>
											<div className="text-center">
												<span className="text-sm text-muted-foreground">
													Racecraft
												</span>
												<p className="text-lg font-medium">
													{averageStats.racecraft}
												</p>
											</div>
											<div className="text-center">
												<span className="text-sm text-muted-foreground">
													Awareness
												</span>
												<p className="text-lg font-medium">
													{averageStats.awareness}
												</p>
											</div>
											<div className="text-center">
												<span className="text-sm text-muted-foreground">
													Pace
												</span>
												<p className="text-lg font-medium">
													{averageStats.pace}
												</p>
											</div>
										</div>
									</div>
								</div>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
