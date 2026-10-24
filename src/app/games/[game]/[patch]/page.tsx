import {
	getDriverRankings,
	getGameVersions,
	getAllGames,
	getGameRouteSegment,
	resolveGameNameFromRoute,
	getVersionLabel,
	getDriverRouteSegment,
	type Driver,
} from "@/lib/rankings";
import type { Metadata } from "next";
import { siteName } from "@/lib/seo";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export const revalidate = 86400;

export async function generateMetadata({
	params,
}: {
	params: PageParams;
}): Promise<Metadata> {
	try {
		const resolvedParams = await params;
		const gameName = resolveGameNameFromRoute(resolvedParams.game);
		const versionLabel = getVersionLabel(gameName, resolvedParams.patch);

		return {
			title: `${gameName} - ${versionLabel} | ${siteName}`,
			description: `View driver ratings for ${gameName} ${versionLabel}.`,
		};
	} catch {
		return {
			title: `Game Ratings | ${siteName}`,
			description: "View Formula One game driver ratings.",
		};
	}
}

export async function generateStaticParams() {
	const allGames = getAllGames();
	return allGames.flatMap((game) =>
		game.versions.map((version) => ({
			game: getGameRouteSegment(game.gameName),
			patch: version,
		}))
	);
}

const statColors = {
	overall: "var(--f1)",
	experience: "#10b981",
	racecraft: "#3b82f6",
	awareness: "#f59e0b",
	pace: "#8b5cf6",
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

const topNavButtonClassName =
	"size-8 shrink-0 self-start";

function TopNavButton({
	href,
	label,
	icon,
	disabled = false,
}: {
	href?: string;
	label: string;
	icon: ReactNode;
	disabled?: boolean;
}) {
	const content = (
		<>
			{icon}
			<span className="sr-only">{label}</span>
		</>
	);

	if (disabled || !href) {
		return (
			<span
				aria-disabled="true"
				className={cn(
					buttonVariants({
						variant: "outline",
						size: "icon",
					}),
					topNavButtonClassName,
					"pointer-events-none opacity-40"
				)}
			>
				{content}
			</span>
		);
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Link
					href={href}
					className={cn(
						buttonVariants({
							variant: "outline",
							size: "icon",
						}),
						topNavButtonClassName
					)}
				>
					{content}
				</Link>
			</TooltipTrigger>
			<TooltipContent>{label}</TooltipContent>
		</Tooltip>
	);
}

export default async function GamePage({ params }: { params: PageParams }) {
	const resolvedParams = await params;
	let gameName: string;
	try {
		gameName = resolveGameNameFromRoute(resolvedParams.game);
	} catch {
		notFound();
	}
	// redirect() throws, so it must stay outside the try/catch below
	const canonicalGameRoute = getGameRouteSegment(gameName);
	if (resolvedParams.game !== canonicalGameRoute) {
		redirect(`/games/${canonicalGameRoute}/${resolvedParams.patch}`);
	}

	let drivers: Driver[];
	try {
		drivers = getDriverRankings(gameName, resolvedParams.patch);
	} catch {
		notFound();
	}
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
		<div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
			<div className="flex flex-col gap-10 sm:gap-12">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div className="min-w-0 space-y-1.5">
						<h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
							{gameName}
						</h1>
						<p className="text-muted-foreground text-sm">
							{getVersionLabel(gameName, resolvedParams.patch)}
						</p>
					</div>
					<div className="flex w-full justify-end gap-2 sm:w-auto">
						<TopNavButton
							href={
								previousVersion || previousGame
									? `/games/${getGameRouteSegment(
											previousGame?.gameName ||
												gameName
										)}/${previousVersion}`
									: undefined
							}
							label={
								previousGame
									? `${previousGame.gameName} ${getVersionLabel(
											previousGame.gameName,
											previousVersion!
										)}`
									: previousVersion
										? getVersionLabel(
												gameName,
												previousVersion
											)
										: "No previous version"
							}
							icon={
								<ChevronLeft className="h-4 w-4 shrink-0 translate-y-px" />
							}
							disabled={!previousVersion && !previousGame}
						/>
						<TopNavButton
							href={
								nextVersion || nextGame
									? `/games/${getGameRouteSegment(
											nextGame?.gameName ||
												gameName
										)}/${nextVersion}`
									: undefined
							}
							label={
								nextGame
									? `${nextGame.gameName} ${getVersionLabel(
											nextGame.gameName,
											nextVersion!
										)}`
									: nextVersion
										? getVersionLabel(
												gameName,
												nextVersion
											)
										: "No next version"
							}
							icon={
								<ChevronRight className="h-4 w-4 shrink-0 translate-y-px" />
							}
							disabled={!nextVersion && !nextGame}
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{drivers
						.sort((a, b) => b.overall - a.overall)
						.map((driver) => {
							const overallRanking = calculateRanking(
								driver.overall,
								maxStats.overall
							);
							return (
								<Card key={driver.name} className="gap-0 p-5">
									<div className="mb-4 flex items-center justify-between gap-3">
										<h3 className="truncate font-semibold">
											<Link
												href={`/drivers/${getDriverRouteSegment(driver.name)}`}
												className="underline-offset-4 hover:underline"
											>
												{driver.name}
											</Link>
										</h3>
										<div className="flex items-center gap-2">
											<span
												className={cn(
													"rounded-md px-2 py-0.5 text-sm font-semibold tabular-nums",
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
				<div className="grid w-full gap-2 sm:grid-cols-2">
					{(previousVersion || previousGame) && (
						<Link
							href={`/games/${getGameRouteSegment(
								previousGame?.gameName || gameName
							)}/${previousVersion}`}
							className={cn(
								buttonVariants({
									variant: "outline",
									size: "sm",
								}),
								"w-full justify-start gap-2"
							)}
						>
							<ChevronLeft className="h-4 w-4 shrink-0" />
							<span className="truncate text-left">
								{previousGame
									? `${previousGame.gameName} ${getVersionLabel(
											previousGame.gameName,
											previousVersion!
										)}`
									: getVersionLabel(
											gameName,
											previousVersion!
										)}
							</span>
						</Link>
					)}
					{(nextVersion || nextGame) && (
						<Link
							href={`/games/${getGameRouteSegment(
								nextGame?.gameName || gameName
							)}/${nextVersion}`}
							className={cn(
								buttonVariants({
									variant: "outline",
									size: "sm",
								}),
								"w-full justify-between"
							)}
						>
							<span className="truncate text-left">
								{nextGame
									? `${nextGame.gameName} ${getVersionLabel(
											nextGame.gameName,
											nextVersion!
										)}`
									: getVersionLabel(
											gameName,
											nextVersion!
										)}
							</span>
							<ChevronRight className="h-4 w-4 shrink-0" />
						</Link>
					)}
				</div>
			</div>
		</div>
	);
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
	const ranking = calculateRanking(value, maxValue);

	return (
		<div className="space-y-1.5">
			<div className="flex items-center justify-between text-sm">
				<span className="text-muted-foreground">{label}</span>
				<div className="flex items-center gap-2">
					<span
						className={cn(
							"rounded-md px-1.5 py-0.5 text-xs font-medium",
							getBadgeClasses(ranking)
						)}
					>
						{ranking}
						{value === maxValue && " 🏆"}
					</span>
					<span className="font-medium tabular-nums">{value}/99</span>
				</div>
			</div>
			<Progress
				value={percentage}
				className="bg-muted h-1.5 [&>div]:bg-current [&>div]:transition-all"
				style={{ color }}
			/>
		</div>
	);
}
