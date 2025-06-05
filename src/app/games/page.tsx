import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
	getAllGames,
	getDriverRankings,
	calculateAverageRatings,
} from "@/lib/rankings";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function Page() {
	try {
		const games = getAllGames();

		return (
			<div className="flex justify-center w-full">
				<div className="container mx-auto max-w-7xl py-8 px-4 md:px-0">
					<div className="flex flex-col space-y-8">
						<div className="flex flex-col space-y-4">
							<h1 className="text-4xl font-bold">F1 Games</h1>
							<p className="text-muted-foreground">
								Explore driver ratings across different F1 game
								versions and their updates.
							</p>
						</div>

						<div className="grid gap-8">
							{games.reverse().map((game) => {
								const latestVersion =
									game.versions[game.versions.length - 1];
								const latestDrivers = getDriverRankings(
									game.gameName,
									latestVersion
								);
								const averageRatings =
									calculateAverageRatings(latestDrivers);
								const topDriver = latestDrivers.sort(
									(a, b) => b.overall - a.overall
								)[0];

								return (
									<Card key={game.gameName} className="p-6">
										<div className="flex flex-col space-y-6">
											<div className="flex items-start justify-between">
												<div className="space-y-1">
													<h2 className="text-2xl font-semibold">
														{game.gameName}
													</h2>
													<p className="text-sm text-muted-foreground">
														{game.versions.length}{" "}
														version
														{game.versions.length >
														1
															? "s"
															: ""}
													</p>
												</div>
												<Button asChild>
													<Link
														href={`/games/${encodeURIComponent(
															game.gameName
														)}/${latestVersion}`}
													>
														Latest Ratings
														<ChevronRight className="ml-2 h-4 w-4" />
													</Link>
												</Button>
											</div>

											<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
												<div className="space-y-2">
													<h3 className="font-medium">
														Latest Version
													</h3>
													<p className="text-2xl font-bold">
														{latestVersion === "B"
															? "Base Game"
															: `Update ${latestVersion}`}
													</p>
												</div>

												<div className="space-y-2">
													<h3 className="font-medium">
														Top Rated Driver
													</h3>
													<p className="text-2xl font-bold">
														{topDriver.name}
													</p>
													<p className="text-sm text-muted-foreground">
														Overall:{" "}
														{topDriver.overall}
													</p>
												</div>

												<div className="space-y-2">
													<h3 className="font-medium">
														Average Ratings
													</h3>
													<p className="text-2xl font-bold">
														{averageRatings.overall}
													</p>
													<p className="text-sm text-muted-foreground">
														Overall average rating
													</p>
												</div>

												<div className="space-y-2">
													<h3 className="font-medium">
														All Versions
													</h3>
													<div className="flex flex-wrap gap-2">
														{game.versions.map(
															(version) => (
																<Link
																	key={`${game.gameName}-${version}`}
																	href={`/games/${encodeURIComponent(
																		game.gameName
																	)}/${version}`}
																	className="inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-muted"
																>
																	{version ===
																	"B"
																		? "Base"
																		: version}
																</Link>
															)
														)}
													</div>
												</div>
											</div>
										</div>
									</Card>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		);
	} catch {
		return (
			<div className="container py-8">
				<div className="flex flex-col space-y-8">
					<div className="flex flex-col space-y-4">
						<h1 className="text-4xl font-bold">Error</h1>
						<p className="text-muted-foreground">
							Failed to load game data. Please try again later.
						</p>
					</div>
				</div>
			</div>
		);
	}
}
