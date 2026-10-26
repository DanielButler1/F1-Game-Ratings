import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUp, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@/components/ui/table";
import { Page, RankPill, Section, TableCard } from "@/components/page";
import RatingCriteria from "@/components/landing/rating-criteria";
import Showcase from "@/components/landing/showcase";
import {
	getAllDrivers,
	getAllGames,
	getDriverHistory,
	getDriverRankings,
	getDriverRouteSegment,
	getGameRouteSegment,
	getLatestGameAndVersion,
	getPatchUpdateEntries,
	getVersionLabel,
} from "@/lib/rankings";
import { createPageMetadata, siteDescription } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createPageMetadata("Home", siteDescription);

function MoreLink({ href, children }: { href: string; children: string }) {
	return (
		<Link
			href={href}
			className={cn(
				buttonVariants({ variant: "ghost", size: "sm" }),
				"text-muted-foreground"
			)}
		>
			{children}
			<ChevronRight className="size-4" />
		</Link>
	);
}

function DriverLink({ name }: { name: string }) {
	return (
		<Link
			href={`/drivers/${getDriverRouteSegment(name)}`}
			className="font-medium underline-offset-4 hover:underline"
		>
			{name}
		</Link>
	);
}

export default function HomePage() {
	const games = getAllGames();
	const { gameName, version } = getLatestGameAndVersion();
	const latestDrivers = getDriverRankings(gameName, version).sort(
		(a, b) => b.overall - a.overall
	);
	const latestHref = `/games/${getGameRouteSegment(gameName)}/${version}`;
	const latestLabel = `${gameName} · ${getVersionLabel(gameName, version)}`;
	const patchCount = games.reduce((sum, g) => sum + g.versions.length, 0);

	const latestPatch = getPatchUpdateEntries().at(-1);
	const movers = (latestPatch?.drivers ?? [])
		.filter((d) => d.changes && d.changes.overall !== 0)
		.sort(
			(a, b) =>
				Math.abs(b.changes!.overall) - Math.abs(a.changes!.overall) ||
				b.changes!.overall - a.changes!.overall
		)
		.slice(0, 10);

	return (
		<>
			{/* Hero: centred headline and actions, then a row of showcase cards for the main tools */}
			<section className="border-b">
				<div className="mx-auto max-w-7xl space-y-14 px-4 pt-16 pb-20 sm:px-6 sm:pt-24 lg:px-10">
					<div className="mx-auto max-w-5xl space-y-8 text-center">
						<div className="space-y-6">
							<h1 className="mx-auto max-w-4xl text-5xl leading-[0.96] font-semibold tracking-[-0.065em] text-balance md:text-7xl md:leading-[0.94]">
								Every F1 game driver rating, tracked.
							</h1>
							<p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-8 text-balance">
								{`${getAllDrivers().length} drivers across ${games.length} games and ${patchCount} ratings updates, from F1 2020 to the F1 26 Season Pack.`}{" "}
								See who&apos;s rated highest and how every
								driver has changed.
							</p>
						</div>
						<div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
							<Link
								href="/drivers"
								className={cn(
									buttonVariants({ size: "lg", variant: "outline" }),
									"h-11 w-full rounded-xl text-sm font-semibold"
								)}
							>
								Explore Drivers
							</Link>
							<Link
								href={latestHref}
								className={cn(
									buttonVariants({ size: "lg" }),
									"h-11 w-full rounded-xl bg-[#e10600] text-sm font-semibold text-white hover:bg-[#c00500] dark:bg-[#cc0500] dark:hover:bg-[#b30400]"
								)}
							>
								Latest Ratings
								<ArrowRight className="size-4" />
							</Link>
							<Link
								href="/compare"
								className={cn(
									buttonVariants({ size: "lg", variant: "outline" }),
									"h-11 w-full rounded-xl text-sm font-semibold"
								)}
							>
								Compare Ratings
							</Link>
						</div>
						<Link
							href={latestHref}
							className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
						>
							<span className="underline decoration-1 underline-offset-4">
								{latestLabel} ratings are in
							</span>
							<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
						</Link>
					</div>

					<RatingCriteria />

					<Showcase
						drivers={latestDrivers}
						latestHref={latestHref}
						leaderHistory={getDriverHistory(latestDrivers[0].name)}
						driverHref={`/drivers/${getDriverRouteSegment(latestDrivers[0].name)}`}
					/>
				</div>
			</section>

			<Page className="py-12 sm:py-16">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
					<Section
						title="Latest ratings"
						description={latestLabel}
						action={<MoreLink href={latestHref}>All drivers</MoreLink>}
					>
						<TableCard>
							<Table>
								<TableBody>
									{latestDrivers.slice(0, 10).map((driver, i) => (
										<TableRow key={driver.name}>
											<TableCell className="w-10">
												<RankPill rank={i + 1} />
											</TableCell>
											<TableCell>
												<DriverLink name={driver.name} />
											</TableCell>
											<TableCell className="text-muted-foreground hidden text-right text-xs tabular-nums sm:table-cell">
												PAC {driver.pace} · RAC{" "}
												{driver.racecraft}
											</TableCell>
											<TableCell className="w-12 text-right font-semibold tabular-nums">
												{driver.overall}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableCard>
					</Section>

					<Section
						title="Biggest movers"
						description={
							latestPatch
								? `Overall change in ${latestPatch.gameName} · ${latestPatch.versionLabel}`
								: undefined
						}
						action={<MoreLink href="/updates">All updates</MoreLink>}
					>
						<TableCard>
							<Table>
								<TableBody>
									{movers.map((driver) => {
										const delta = driver.changes!.overall;
										return (
											<TableRow key={driver.name}>
												<TableCell>
													<DriverLink name={driver.name} />
												</TableCell>
												<TableCell className="text-muted-foreground text-right text-xs tabular-nums">
													<span className="inline-flex items-center gap-1">
														{driver.previous?.overall}
														<ArrowRight className="size-3" />
														{driver.current.overall}
													</span>
												</TableCell>
												<TableCell
													className={cn(
														"w-14 text-right font-semibold tabular-nums",
														delta > 0
															? "text-emerald-600 dark:text-emerald-400"
															: "text-red-600 dark:text-red-400"
													)}
												>
													<span className="inline-flex items-center gap-0.5">
														{delta > 0 ? (
															<ArrowUp className="size-3.5" />
														) : (
															<ArrowDown className="size-3.5" />
														)}
														{Math.abs(delta)}
													</span>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</TableCard>
					</Section>
				</div>

				<Section title="Every game and update">
					<div className="grid gap-4 md:grid-cols-2">
						{[...games].reverse().map((game) => (
							<div
								key={game.gameName}
								className="bg-card space-y-3 rounded-xl border p-5 shadow-sm"
							>
								<h3 className="font-semibold">{game.gameName}</h3>
								<div className="flex flex-wrap gap-2">
									{game.versions.map((v) => (
										<Link
											key={`${game.gameName}-${v}`}
											href={`/games/${getGameRouteSegment(game.gameName)}/${v}`}
											className="hover:bg-muted inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors"
										>
											{getVersionLabel(game.gameName, v)}
										</Link>
									))}
								</div>
							</div>
						))}
					</div>
				</Section>
			</Page>
		</>
	);
}
