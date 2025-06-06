import DriverStatsClientWrapper from "@/components/driver-stats-client-wrapper";
import { notFound } from "next/navigation";
import {
	getDriverHistory,
	getAllGames,
	getLatestGameAndVersion,
	getAllDrivers,
} from "@/lib/rankings";
import { Card } from "@/components/ui/card";

export const revalidate = 86400;

export async function generateStaticParams() {
	const drivers = getAllDrivers();

	return drivers.map((name) => ({
		name: encodeURIComponent(name),
	}));
}

export default async function DriverPage({
	params,
}: {
	params: { name: string } | Promise<{ name: string }>;
}) {
	const { name } = await Promise.resolve(params);
	const driverName = decodeURIComponent(name);
	const driverHistory = getDriverHistory(driverName);

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
					<h1 className="text-4xl font-bold">{driverName}</h1>
					<p className="text-muted-foreground">
						View {driverName}&apos;s ratings across different game
						versions.
					</p>
				</div>

				<DriverStatsClientWrapper
					driverName={driverName}
					driverHistory={driverHistory}
					games={games}
					latestGame={latestGame}
				/>

				<div className="grid gap-6 md:grid-cols-1">
					<Card className="p-6">
						<div className="space-y-4">
							<h3 className="text-xl font-semibold">
								Rating History
							</h3>
							<div className="space-y-4">
								{driverHistory.history.map((entry) => (
									<div
										key={`${entry.gameName}-${entry.version}`}
										className="rounded-lg border p-4"
									>
										<div className="mb-2 flex items-center justify-between">
											<h4 className="font-semibold">
												{entry.gameName} (
												{entry.version === "B"
													? "Base"
													: `Update ${entry.version}`}
												)
											</h4>
											<span className="font-medium text-primary">
												Overall: {entry.stats.overall}
											</span>
										</div>
										<div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 md:grid-cols-4">
											<div className="flex gap-2">
												<span>Experience</span>
												<span className="font-medium">
													{entry.stats.experience}
												</span>
											</div>
											<div className="flex gap-2">
												<span>Racecraft</span>
												<span className="font-medium">
													{entry.stats.racecraft}
												</span>
											</div>
											<div className="flex gap-2">
												<span>Awareness</span>
												<span className="font-medium">
													{entry.stats.awareness}
												</span>
											</div>
											<div className="flex gap-2">
												<span>Pace</span>
												<span className="font-medium">
													{entry.stats.pace}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
