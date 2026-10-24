import Link from "next/link";
import {
	ArrowRight,
	ChevronRight,
	GitCompareArrows,
	History,
	Users,
} from "lucide-react";
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
import { createPageMetadata, siteDescription } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createPageMetadata("Home", siteDescription);

const highlights = [
	{
		icon: Users,
		title: "Every driver",
		body: "Every driver rated since F1 2020, stat by stat.",
	},
	{
		icon: History,
		title: "Every patch",
		body: "Base game and each ratings update, tracked over time.",
	},
	{
		icon: GitCompareArrows,
		title: "Head to head",
		body: "Compare drivers and teammates across any release.",
	},
];

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
			{/* Hero, following phaseo.app's landing layout */}
			<section className="border-b">
				<div className="mx-auto max-w-5xl space-y-8 px-4 pt-16 pb-14 text-center sm:px-6 sm:pt-20">
					<div className="space-y-6">
						<h1 className="mx-auto max-w-4xl text-5xl leading-[0.96] font-semibold tracking-[-0.065em] text-balance md:text-7xl md:leading-[0.94]">
							F1 Driver Ratings Tracker
						</h1>
						<p className="text-muted-foreground mx-auto max-w-[44rem] text-lg leading-8 text-balance">
							Track and compare Formula One game driver ratings from
							F1 2020 through the F1 26 Season Pack. Explore how your
							favourite drivers have evolved over time.
						</p>
					</div>
					<div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
						<Link
							href="/drivers"
							className={cn(
								buttonVariants({ variant: "outline" }),
								"h-11 w-full rounded-xl text-sm font-semibold"
							)}
						>
							Explore Drivers
						</Link>
						<Link
							href={latestHref}
							className={cn(
								buttonVariants(),
								"h-11 w-full rounded-xl text-sm font-semibold"
							)}
						>
							Latest Ratings
							<ArrowRight className="size-4" />
						</Link>
						<Link
							href="/compare"
							className={cn(
								buttonVariants({ variant: "outline" }),
								"h-11 w-full rounded-xl text-sm font-semibold"
							)}
						>
							Compare Ratings
						</Link>
					</div>
					<Link
						href="/updates"
						className="text-muted-foreground hover:text-foreground decoration-border inline-flex items-center text-sm font-medium underline underline-offset-4 transition-colors"
					>
						See every ratings update
						<ArrowRight aria-hidden="true" className="ml-2 size-4" />
					</Link>
					<div className="mx-auto mt-10 grid max-w-3xl gap-3 border-y py-4 text-left sm:grid-cols-3">
						{highlights.map(({ icon: Icon, title, body }) => (
							<div key={title} className="flex gap-3 sm:block">
								<Icon className="text-primary mt-0.5 size-4 shrink-0 sm:mb-2" />
								<div>
									<p className="text-sm font-semibold">{title}</p>
									<p className="text-muted-foreground mt-1 text-sm leading-5">
										{body}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<Page>
				<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
					<StatCard
						label="Top rated driver"
						value={<DriverLink name={latestDrivers[0].name} />}
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
