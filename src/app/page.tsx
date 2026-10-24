import type React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Page, PageHeader, Section } from "@/components/page";
import RatingCriteriaSection from "@/components/landing/rating-criteria";
import {
	getAllDrivers,
	getAllGames,
	getDriverRankings,
	getDriverRouteSegment,
	getLatestGameAndVersion,
	getGameRouteSegment,
	getVersionLabel,
} from "@/lib/rankings";
import { createPageMetadata, siteDescription } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createPageMetadata("Home", siteDescription);

const statRows = [
	["experience", "Experience"],
	["racecraft", "Racecraft"],
	["awareness", "Awareness"],
	["pace", "Pace"],
] as const;

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<Card className="gap-1 p-4">
			<p className="text-muted-foreground text-sm">{label}</p>
			<p className="truncate text-xl font-semibold tabular-nums sm:text-2xl">
				{value}
			</p>
		</Card>
	);
}

export default function HomePage() {
	const games = getAllGames();
	const { gameName, version } = getLatestGameAndVersion();
	const latestDrivers = getDriverRankings(gameName, version).sort(
		(a, b) => b.overall - a.overall
	);
	const latestHref = `/games/${getGameRouteSegment(gameName)}/${version}`;
	const latestLabel = `${gameName} ${getVersionLabel(gameName, version)}`;
	const patchCount = games.reduce((sum, g) => sum + g.versions.length, 0);

	return (
		<Page>
			<PageHeader
				title="F1 game driver ratings"
				actions={
					<>
						<Link
							href={latestHref}
							className={cn(buttonVariants({ size: "lg" }))}
						>
							Latest ratings
							<ChevronRight className="size-4" />
						</Link>
						<Link
							href="/compare"
							className={cn(
								buttonVariants({ size: "lg", variant: "outline" })
							)}
						>
							Compare drivers
						</Link>
					</>
				}
			>
				Every driver rating from EA &amp; Codemasters&apos; official F1
				games, from F1 2020 through the F1 26 Season Pack. See how
				drivers have evolved patch by patch, and compare them head to
				head.
			</PageHeader>

			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				<StatCard
					label="Top rated driver"
					value={
						<Link
							href={`/drivers/${getDriverRouteSegment(latestDrivers[0].name)}`}
							className="underline-offset-4 hover:underline"
						>
							{latestDrivers[0].name}
						</Link>
					}
				/>
				<StatCard label="Games tracked" value={games.length} />
				<StatCard label="Ratings updates" value={patchCount} />
				<StatCard label="Drivers" value={getAllDrivers().length} />
			</div>

			<Section
				title="Latest driver ratings"
				description={latestLabel}
				action={
					<Link
						href={latestHref}
						className={cn(
							buttonVariants({ variant: "ghost", size: "sm" }),
							"text-muted-foreground"
						)}
					>
						View all
						<ChevronRight className="size-4" />
					</Link>
				}
			>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{latestDrivers.slice(0, 6).map((driver, index) => (
						<Link
							key={driver.name}
							href={`/drivers/${getDriverRouteSegment(driver.name)}`}
							className="group rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							<Card className="h-full gap-4 p-5 transition-shadow group-hover:ring-1 group-hover:ring-foreground/20">
								<div className="flex items-center justify-between gap-3">
									<div className="flex min-w-0 items-center gap-3">
										<span className="text-muted-foreground w-5 text-sm tabular-nums">
											{index + 1}
										</span>
										<h3 className="truncate font-semibold">
											{driver.name}
										</h3>
									</div>
									<span className="bg-primary text-primary-foreground rounded-md px-2 py-0.5 text-sm font-semibold tabular-nums">
										{driver.overall}
									</span>
								</div>
								<dl className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
									{statRows.map(([key, label]) => (
										<div
											key={key}
											className="flex justify-between"
										>
											<dt className="text-muted-foreground">
												{label}
											</dt>
											<dd className="font-medium tabular-nums">
												{driver[key]}
											</dd>
										</div>
									))}
								</dl>
							</Card>
						</Link>
					))}
				</div>
			</Section>

			<RatingCriteriaSection />

			<Section title="Every game and update">
				<div className="grid gap-4 md:grid-cols-2">
					{[...games].reverse().map((game) => (
						<Card key={game.gameName} className="gap-3 p-5">
							<h3 className="font-semibold">{game.gameName}</h3>
							<div className="flex flex-wrap gap-2">
								{game.versions.map((version) => (
									<Link
										key={`${game.gameName}-${version}`}
										href={`/games/${getGameRouteSegment(game.gameName)}/${version}`}
										className="hover:bg-muted inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors"
									>
										{getVersionLabel(game.gameName, version)}
									</Link>
								))}
							</div>
						</Card>
					))}
				</div>
			</Section>
		</Page>
	);
}
