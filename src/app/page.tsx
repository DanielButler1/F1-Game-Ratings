import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@/components/ui/table";
import {
	Page,
	RankPill,
	Section,
	StatCard,
	TableCard,
} from "@/components/page";
import RatingCriteriaSection from "@/components/landing/rating-criteria";
import {
	getAllDrivers,
	getAllGames,
	getDriverRankings,
	getDriverRouteSegment,
	getGameRouteSegment,
	getLatestGameAndVersion,
	getPatchUpdateEntries,
	getVersionLabel,
} from "@/lib/rankings";
import type { Driver } from "@/lib/rankings";
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

const cardStats = [
	["experience", "EXP"],
	["racecraft", "RAC"],
	["awareness", "AWA"],
	["pace", "PAC"],
] as const;

/** The current top three, styled like an in-game driver rating card. */
function HeroRatingCard({
	drivers,
	label,
}: {
	drivers: Driver[];
	label: string;
}) {
	const [leader, ...chasers] = drivers;
	return (
		<div className="bg-card relative mx-auto w-full max-w-md rounded-2xl border p-6 shadow-xl shadow-black/5 lg:ml-auto dark:shadow-black/40">
			<div className="flex items-center justify-between text-xs">
				<span className="text-muted-foreground font-medium tracking-wider uppercase">
					Top rated
				</span>
				<span className="text-muted-foreground">{label}</span>
			</div>

			<Link
				href={`/drivers/${getDriverRouteSegment(leader.name)}`}
				className="group mt-5 flex items-center gap-4"
			>
				<span className="flex size-16 shrink-0 flex-col items-center justify-center rounded-lg bg-[#e10600] text-white dark:bg-[#cc0500]">
					<span className="text-2xl leading-none font-bold tabular-nums">
						{leader.overall}
					</span>
					<span className="mt-1 text-[10px] font-semibold tracking-wider opacity-80">
						OVR
					</span>
				</span>
				<span className="min-w-0">
					<span className="block truncate text-xl font-bold tracking-tight group-hover:underline group-hover:underline-offset-4">
						{leader.name}
					</span>
					<span className="text-muted-foreground text-sm">
						#1 overall
					</span>
				</span>
			</Link>

			<div className="mt-6 space-y-3">
				{cardStats.map(([key, short]) => (
					<div key={key} className="flex items-center gap-3 text-sm">
						<span className="text-muted-foreground w-9 text-xs font-medium">
							{short}
						</span>
						<div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
							<div
								className="h-full rounded-full bg-[#e10600] dark:bg-[#cc0500]"
								style={{ width: `${(leader[key] / 99) * 100}%` }}
							/>
						</div>
						<span className="w-6 text-right font-semibold tabular-nums">
							{leader[key]}
						</span>
					</div>
				))}
			</div>

			<div className="mt-6 divide-y border-t">
				{chasers.map((driver, i) => (
					<Link
						key={driver.name}
						href={`/drivers/${getDriverRouteSegment(driver.name)}`}
						className="hover:bg-muted/60 -mx-2 flex items-center gap-3 rounded-md px-2 py-2.5 text-sm transition-colors"
					>
						<RankPill rank={i + 2} />
						<span className="flex-1 truncate font-medium">
							{driver.name}
						</span>
						<span className="font-semibold tabular-nums">
							{driver.overall}
						</span>
					</Link>
				))}
			</div>
		</div>
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
			{/* Hero: intro on the left, the current top-rated driver as a game-style rating card on the right */}
			<section className="border-b">
				<div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:px-10">
					<div className="space-y-7">
						<Link
							href={latestHref}
							className="bg-background/80 hover:bg-muted inline-flex items-center gap-2 rounded-full border py-1 pr-3 pl-2 text-xs font-medium transition-colors"
						>
							<span className="size-2 rounded-full bg-[#e10600]" />
							{latestLabel} ratings are in
							<ChevronRight className="text-muted-foreground size-3.5" />
						</Link>
						<div className="space-y-4">
							<h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
								F1 Driver Ratings Tracker
							</h1>
							<p className="text-muted-foreground max-w-xl text-lg leading-8">
								Track and compare Formula One game driver ratings from
								F1 2020 through the F1 26 Season Pack. Explore how your
								favourite drivers have evolved over time.
							</p>
						</div>
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
							<Link
								href="/drivers"
								className={cn(
									buttonVariants({ size: "lg" }),
									"bg-[#e10600] text-white hover:bg-[#c00500] dark:bg-[#cc0500] dark:hover:bg-[#b30400]"
								)}
							>
								Explore Drivers
								<ArrowRight className="size-4" />
							</Link>
							<Link
								href="/compare"
								className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
							>
								Compare Ratings
							</Link>
							<Link
								href="/updates"
								className="text-muted-foreground hover:text-foreground px-2 text-sm font-medium underline-offset-4 transition-colors hover:underline"
							>
								Every ratings update
							</Link>
						</div>
					</div>

					<HeroRatingCard
						drivers={latestDrivers.slice(0, 3)}
						label={latestLabel}
					/>
				</div>
			</section>

			<Page>
				<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
					<StatCard
						label="Biggest riser this update"
						value={
							movers[0] && movers[0].changes!.overall > 0 ? (
								<>
									<DriverLink name={movers[0].name} />{" "}
									<span className="text-base text-emerald-600 dark:text-emerald-400">
										↑ {movers[0].changes!.overall}
									</span>
								</>
							) : (
								"–"
							)
						}
						className="max-sm:col-span-2"
					/>
					<StatCard label="Games tracked" value={games.length} />
					<StatCard label="Ratings updates" value={patchCount} />
					<StatCard
						label="Drivers rated"
						value={getAllDrivers().length}
						className="max-sm:hidden"
					/>
				</div>

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
													{driver.previous?.overall} →{" "}
													{driver.current.overall}
												</TableCell>
												<TableCell
													className={cn(
														"w-14 text-right font-semibold tabular-nums",
														delta > 0
															? "text-emerald-600 dark:text-emerald-400"
															: "text-red-600 dark:text-red-400"
													)}
												>
													{delta > 0 ? `↑ ${delta}` : `↓ ${-delta}`}
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</TableCard>
					</Section>
				</div>

				<RatingCriteriaSection />

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
