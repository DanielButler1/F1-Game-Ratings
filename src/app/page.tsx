import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import RatingCriteriaSection from "@/components/landing/rating-criteria";
import {
	getAllGames,
	getDriverRankings,
	getLatestGameAndVersion,
} from "@/lib/rankings";

export default function HomePage() {
	const games = getAllGames();
	const { gameName, version } = getLatestGameAndVersion();
	const latestDrivers = getDriverRankings(gameName, version);

	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-1">
				{/* Hero Section */}
				<section className="relative bg-[#e10600] dark:bg-[#cc0500] text-white">
					<div className="container mx-auto max-w-7xl px-4 py-20 sm:py-32 flex flex-col items-center text-center">
						<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
							F1 Driver Ratings Tracker
						</h1>
						<p className="text-lg sm:text-xl max-w-3xl mb-8">
							Track and compare Formula One game driver ratings
							from F1 2020 through F1 25. Explore how your
							favorite drivers have evolved over time.
						</p>
						<div className="flex flex-col sm:flex-row gap-4">
							<Button asChild size="lg" className="">
								<Link href="/drivers">Explore Drivers</Link>
							</Button>
							<Button asChild size="lg" className="">
								<Link href="/compare">Compare Ratings</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* Latest Ratings Section */}
				<section className="py-16">
					<div className="container mx-auto max-w-7xl px-4">
						<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-2">
							<div>
								<h2 className="text-3xl font-bold">Latest Driver Ratings</h2>
								<span className="text-gray-600 dark:text-gray-400 block mt-1">
									{gameName} -{" "}
									{version === "B" ? "Base Game" : `Update ${version}`}
								</span>
								{/* Show button below on mobile */}
								<div className="block md:hidden mt-2">
									<Button asChild variant="ghost" className="gap-1">
										<Link
											href={`/games/${encodeURIComponent(gameName)}/${version}`}
										>
											View All <ChevronRight className="h-4 w-4" />
										</Link>
									</Button>
								</div>
							</div>
							{/* Show button on the right on desktop */}
							<div className="hidden md:flex items-center gap-2">
								<Button asChild variant="ghost" className="gap-1">
									<Link
										href={`/games/${encodeURIComponent(gameName)}/${version}`}
									>
										View All <ChevronRight className="h-4 w-4" />
									</Link>
								</Button>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{latestDrivers
								.sort((a, b) => b.overall - a.overall)
								.slice(0, 6)
								.map((driver) => (
									<Card key={driver.name} className="p-6">
										<div className="flex flex-col space-y-4">
											<h3 className="text-xl font-semibold">
												{driver.name}
											</h3>
											<div className="space-y-2">
												<div className="flex justify-between">
													<span>Overall</span>
													<span className="font-medium">
														{driver.overall}
													</span>
												</div>
												<div className="flex justify-between">
													<span>Experience</span>
													<span className="font-medium">
														{driver.experience}
													</span>
												</div>
												<div className="flex justify-between">
													<span>Racecraft</span>
													<span className="font-medium">
														{driver.racecraft}
													</span>
												</div>
												<div className="flex justify-between">
													<span>Awareness</span>
													<span className="font-medium">
														{driver.awareness}
													</span>
												</div>
												<div className="flex justify-between">
													<span>Pace</span>
													<span className="font-medium">
														{driver.pace}
													</span>
												</div>
											</div>
										</div>
									</Card>
								))}
						</div>
					</div>
				</section>

				{/* Rating Criteria Section */}
				<RatingCriteriaSection />

				{/* Timeline Preview Section */}
				<section className="py-16">
					<div className="container mx-auto max-w-7xl px-4">
						<h2 className="text-3xl font-bold mb-10">
							Rating Evolution Timeline
						</h2>
						<div className="grid gap-6">
							{games.map((game) => (
								<Card key={game.gameName} className="p-6">
									<div className="flex flex-col space-y-4">
										<h3 className="text-xl font-semibold">
											{game.gameName}
										</h3>
										<div className="flex flex-wrap gap-2">
											{game.versions.map((version) => (
												<Link
													key={`${game.gameName}-${version}`}
													href={`/games/${encodeURIComponent(
														game.gameName
													)}/${version}`}
													className="inline-flex items-center justify-center rounded-full border px-3 py-1 text-sm font-medium transition-colors hover:bg-muted"
												>
													{version === "B"
														? "Base Game"
														: `Update ${version}`}
												</Link>
											))}
										</div>
									</div>
								</Card>
							))}
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
