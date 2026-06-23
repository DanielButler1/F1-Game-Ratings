import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import {
	getAllGames,
	getDriverRankings,
	calculateAverageRatings,
	getGameRouteSegment,
	getVersionLabel,
} from "@/lib/rankings";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata(
	"Games",
	"Browse every F1 game release and jump into the latest driver ratings for each version."
);

export default async function Page() {
	try {
		const games = getAllGames();

		return (
			<div className="flex justify-center w-full">
				<div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
									<Card key={game.gameName} className="p-5 md:p-6">
										<div className="flex flex-col gap-5">
											<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
												<div className="space-y-1">
													<h2 className="text-2xl font-semibold tracking-tight">
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
														href={`/games/${getGameRouteSegment(game.gameName)}/${latestVersion}`}
													>
														Latest Ratings
														<ChevronRight className="ml-2 h-4 w-4" />
													</Link>
												</Button>
											</div>

											<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
												<div className="space-y-1.5">
													<h3 className="text-sm font-medium text-muted-foreground">
														Latest Version
													</h3>
													<p className="text-2xl font-bold tracking-tight">
														{getVersionLabel(
															game.gameName,
															latestVersion
														)}
													</p>
												</div>

												<div className="space-y-1.5">
													<h3 className="text-sm font-medium text-muted-foreground">
														Top Rated Driver
													</h3>
													<p className="text-2xl font-bold tracking-tight">
														{topDriver.name}
													</p>
													<p className="text-sm text-muted-foreground">
														Overall:{" "}
														{topDriver.overall}
													</p>
												</div>

												<div className="space-y-1.5">
													<h3 className="text-sm font-medium text-muted-foreground">
														Average Ratings
													</h3>
													<p className="text-2xl font-bold tracking-tight">
														{averageRatings.overall}
													</p>
													<p className="text-sm text-muted-foreground">
														Overall average rating
													</p>
												</div>

												<div className="space-y-1.5">
													<h3 className="text-sm font-medium text-muted-foreground">
														All Versions
													</h3>
													<div className="flex flex-wrap gap-1.5 pt-0.5">
														{game.versions.map(
															(version) => (
															<Link
																key={`${game.gameName}-${version}`}
																href={`/games/${getGameRouteSegment(game.gameName)}/${version}`}
																className="inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-muted"
															>
																	{getVersionLabel(
																		game.gameName,
																		version,
																		"Base"
																	)}
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
