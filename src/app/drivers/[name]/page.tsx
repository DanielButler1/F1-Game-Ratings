import { Suspense } from "react";
import DriverStatsClientWrapper from "@/components/driver-stats-client-wrapper";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
	getDriverHistory,
	getAllGames,
	getLatestGameAndVersion,
	getAllDrivers,
	getVersionLabel,
	getDriverRouteSegment,
	resolveDriverNameFromRoute,
} from "@/lib/rankings";
import { siteName } from "@/lib/seo";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export const revalidate = 86400;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ name: string }>;
}): Promise<Metadata> {
	const { name } = await params;
	let driverName = name;

	try {
		driverName = resolveDriverNameFromRoute(name);
	} catch {
		driverName = decodeURIComponent(name);
	}

	return {
		title: `${driverName} | ${siteName}`,
		description: `View ${driverName}'s ratings history across the Formula One game series.`,
	};
}

export async function generateStaticParams() {
	const drivers = getAllDrivers();

	return drivers.map((name) => ({
		name: getDriverRouteSegment(name),
	}));
}

export default async function DriverPage({
	params,
}: {
	params: Promise<{ name: string }>;
}) {
	const { name } = await params;
	let resolvedDriverName = name;

	try {
		resolvedDriverName = resolveDriverNameFromRoute(name);
	} catch {
		notFound();
	}
	const driverHistory = getDriverHistory(resolvedDriverName);

	if (!driverHistory) {
		notFound();
	}

	const games = getAllGames();
	const latestGame = getLatestGameAndVersion();

	// Server component: pass all data to client components
	return (
		<div className="container mx-auto max-w-7xl py-8 px-4 md:px-0">
			<div className="flex flex-col space-y-8">
				<div className="flex flex-col space-y-4">
					<h1 className="text-4xl font-bold">{resolvedDriverName}</h1>
					<p className="text-muted-foreground">
						View {resolvedDriverName}&apos;s ratings across different game
						versions.
					</p>
				</div>

				<Suspense fallback={null}>
					<DriverStatsClientWrapper
						driverName={resolvedDriverName}
						driverHistory={driverHistory}
						games={games}
						latestGame={latestGame}
					/>
				</Suspense>

				<div className="grid gap-6 md:grid-cols-1">
					<Card className="p-6">
						<div className="space-y-4">
							<h3 className="text-xl font-semibold">
								Rating History
							</h3>
							<div className="space-y-4">
								{(() => {
									const hist = driverHistory.history;
									const display = [...hist].reverse();

									return display.map((entry, idx) => {
										const origIdx = hist.length - 1 - idx;
										const prev =
											origIdx > 0
												? hist[origIdx - 1]
												: undefined;

										const overallDelta = prev
											? entry.stats.overall -
											  prev.stats.overall
											: 0;
										const experienceDelta = prev
											? entry.stats.experience -
											  prev.stats.experience
											: 0;
										const racecraftDelta = prev
											? entry.stats.racecraft -
											  prev.stats.racecraft
											: 0;
										const awarenessDelta = prev
											? entry.stats.awareness -
											  prev.stats.awareness
											: 0;
										const paceDelta = prev
											? entry.stats.pace - prev.stats.pace
											: 0;

										const DeltaIcon = ({
											delta,
										}: {
											delta: number;
										}) => {
											if (delta > 0) {
												return (
													<ChevronUpIcon
														className="size-4 text-emerald-500 inline-block ml-2"
														aria-hidden
													/>
												);
											}
											if (delta < 0) {
												return (
													<ChevronDownIcon
														className="size-4 text-red-500 inline-block ml-2"
														aria-hidden
													/>
												);
											}

											// No change: render an em dash in muted color
											return (
												<span
													className="ml-2 text-muted-foreground"
													aria-hidden
												>
													—
												</span>
											);
										};

										return (
											<div
												key={`${entry.gameName}-${entry.version}`}
												className="rounded-lg border p-4"
											>
												<div className="mb-2 flex items-center justify-between">
											<h4 className="font-semibold">
												{entry.gameName} (
												{getVersionLabel(
													entry.gameName,
													entry.version,
													"Base"
												)}
												)
											</h4>
													<span className="font-medium text-primary">
														Overall:{" "}
														{entry.stats.overall}
														<DeltaIcon
															delta={overallDelta}
														/>
													</span>
												</div>
												<div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 md:grid-cols-4">
													<div className="flex gap-2">
														<span>Experience</span>
														<span className="font-medium">
															{
																entry.stats
																	.experience
															}
															<DeltaIcon
																delta={
																	experienceDelta
																}
															/>
														</span>
													</div>
													<div className="flex gap-2">
														<span>Racecraft</span>
														<span className="font-medium">
															{
																entry.stats
																	.racecraft
															}
															<DeltaIcon
																delta={
																	racecraftDelta
																}
															/>
														</span>
													</div>
													<div className="flex gap-2">
														<span>Awareness</span>
														<span className="font-medium">
															{
																entry.stats
																	.awareness
															}
															<DeltaIcon
																delta={
																	awarenessDelta
																}
															/>
														</span>
													</div>
													<div className="flex gap-2">
														<span>Pace</span>
														<span className="font-medium">
															{entry.stats.pace}
															<DeltaIcon
																delta={
																	paceDelta
																}
															/>
														</span>
													</div>
												</div>
											</div>
										);
									});
								})()}
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
