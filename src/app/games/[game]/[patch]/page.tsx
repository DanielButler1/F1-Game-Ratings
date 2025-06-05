import {
	getDriverRankings,
	getGameVersions,
	getAllGames,
} from "@/lib/rankings";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const statColors = {
	overall: "#FF3366",
	experience: "#33FF99",
	racecraft: "#3366FF",
	awareness: "#FFCC33",
	pace: "#9933FF",
};

type PageParams = Promise<{ game: string; patch: string }>;

function calculateRanking(value: number, maxValue: number): string {
	if (value === maxValue) return "Best in Class";
	if (value >= maxValue - 5) return "Elite";
	if (value >= maxValue - 10) return "Strong";
	if (value >= maxValue - 20) return "Average";
	return "Developing";
}

function getBadgeClasses(ranking: string): string {
	const classes = {
		"Best in Class": "bg-yellow-500/10 text-yellow-500",
		Elite: "bg-violet-500/10 text-violet-500",
		Strong: "bg-blue-500/10 text-blue-500",
		Average: "bg-green-500/10 text-green-500",
		Developing: "bg-gray-500/10 text-gray-500",
	};
	return classes[ranking as keyof typeof classes];
}

export default async function GamePage({ params }: { params: PageParams }) {
	try {
		const resolvedParams = await params;
		const gameName = decodeURIComponent(resolvedParams.game);
		const drivers = getDriverRankings(gameName, resolvedParams.patch);
		const allGames = getAllGames();
		const currentGameIndex = allGames.findIndex(
			(g) => g.gameName === gameName
		);
		const versions = getGameVersions(gameName);
		const currentVersionIndex = versions.indexOf(resolvedParams.patch);

		// Previous version or last version of previous game
		let previousVersion = null;
		let previousGame = null;
		if (currentVersionIndex > 0) {
			previousVersion = versions[currentVersionIndex - 1];
		} else if (currentGameIndex > 0) {
			previousGame = allGames[currentGameIndex - 1];
			previousVersion =
				previousGame.versions[previousGame.versions.length - 1];
		}

		// Next version or first version of next game
		let nextVersion = null;
		let nextGame = null;
		if (currentVersionIndex < versions.length - 1) {
			nextVersion = versions[currentVersionIndex + 1];
		} else if (currentGameIndex < allGames.length - 1) {
			nextGame = allGames[currentGameIndex + 1];
			nextVersion = "B"; // Base version of next game
		}

		const maxStats = {
			overall: Math.max(...drivers.map((d) => d.overall)),
			experience: Math.max(...drivers.map((d) => d.experience)),
			racecraft: Math.max(...drivers.map((d) => d.racecraft)),
			awareness: Math.max(...drivers.map((d) => d.awareness)),
			pace: Math.max(...drivers.map((d) => d.pace)),
		};

		return (
			<div className="container mx-auto max-w-7xl px-4 py-8">
				<div className="flex flex-col space-y-8">
					<div className="flex flex-col space-y-4">
						<div className="flex items-center justify-between">
							<h1 className="text-4xl font-bold">{gameName}</h1>
							<div className="flex items-center gap-2">
								{(previousVersion || previousGame) && (
									<Link
										href={`/games/${encodeURIComponent(
											previousGame?.gameName || gameName
										)}/${previousVersion}`}
									>
										<Button variant="outline" size="sm">
											<ChevronLeft className="mr-1 h-4 w-4" />
											{previousGame
												? `${previousGame.gameName} Update ${previousVersion}`
												: previousVersion === "B"
												? "Base Game"
												: `Update ${previousVersion}`}
										</Button>
									</Link>
								)}
								{(nextVersion || nextGame) && (
									<Link
										href={`/games/${encodeURIComponent(
											nextGame?.gameName || gameName
										)}/${nextVersion}`}
									>
										<Button variant="outline" size="sm">
											{nextGame
												? `${nextGame.gameName} Base Game`
												: nextVersion === "B"
												? "Base Game"
												: `Update ${nextVersion}`}
											<ChevronRight className="ml-1 h-4 w-4" />
										</Button>
									</Link>
								)}
							</div>
						</div>
						<p className="text-muted-foreground text-lg">
							{resolvedParams.patch === "B"
								? "Base Game"
								: `Update ${resolvedParams.patch}`}
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{drivers
							.sort((a, b) => b.overall - a.overall)
							.map((driver) => {
								const overallRanking = calculateRanking(
									driver.overall,
									maxStats.overall
								);
								return (
									<Card key={driver.name} className="p-6">
										<div className="flex justify-between items-center mb-4">
											<h3 className="text-xl font-semibold">
												{driver.name}
											</h3>
											<div className="flex items-center gap-2">
												<span
													className={cn(
														"px-2 py-0.5 rounded-full text-md font-medium",
														getBadgeClasses(
															overallRanking
														)
													)}
												>
													{driver.overall}
												</span>
											</div>
										</div>
										<div className="space-y-3">
											<StatBar
												label="Experience"
												value={driver.experience}
												maxValue={maxStats.experience}
												color={statColors.experience}
											/>
											<StatBar
												label="Racecraft"
												value={driver.racecraft}
												maxValue={maxStats.racecraft}
												color={statColors.racecraft}
											/>
											<StatBar
												label="Awareness"
												value={driver.awareness}
												maxValue={maxStats.awareness}
												color={statColors.awareness}
											/>
											<StatBar
												label="Pace"
												value={driver.pace}
												maxValue={maxStats.pace}
												color={statColors.pace}
											/>
										</div>
									</Card>
								);
							})}
					</div>
				</div>
			</div>
		);
	} catch (error) {
		console.error("Failed to load game data:", error);
		return (
			<div className="container mx-auto max-w-7xl px-4 py-8">
				<div className="flex flex-col space-y-8">
					<div className="flex flex-col space-y-4">
						<h1 className="text-4xl font-bold">Error</h1>
						<p className="text-muted-foreground text-lg">
							Failed to load game data. Please make sure the game
							and version exist.
						</p>
					</div>
				</div>
			</div>
		);
	}
}

function StatBar({
	label,
	value,
	maxValue,
	color,
}: {
	label: string;
	value: number;
	maxValue: number;
	color: string;
}) {
	const percentage = (value / 99) * 100;
	const ranking =
		value === maxValue
			? "Best in Class"
			: value >= maxValue - 5
			? "Elite"
			: value >= maxValue - 10
			? "Strong"
			: value >= maxValue - 20
			? "Average"
			: "Developing";

	// Badge colors based on ranking
	const badgeClasses = {
		"Best in Class": "bg-yellow-500/10 text-yellow-500",
		Elite: "bg-violet-500/10 text-violet-500",
		Strong: "bg-blue-500/10 text-blue-500",
		Average: "bg-green-500/10 text-green-500",
		Developing: "bg-gray-500/10 text-gray-500",
	}[ranking];

	return (
		<div className="space-y-1.5">
			<div className="flex items-center justify-between text-sm">
				<span>{label}</span>
				<div className="flex items-center gap-2">
					<span
						className={cn(
							"px-2 py-0.5 rounded-full text-xs font-medium",
							badgeClasses
						)}
					>
						{ranking}
						{value === maxValue && " 🏆"}
					</span>
					<span className="font-medium">{value}/99</span>
				</div>
			</div>
			<Progress
				value={percentage}
				className="h-2 [&>div]:bg-current [&>div]:transition-all"
				style={{ color }}
			/>
		</div>
	);
}
