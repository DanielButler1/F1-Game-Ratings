"use client";

import { useState } from "react";
import { getAllDrivers, getDriverHistory } from "@/lib/rankings";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type SortKey = "overall" | "experience" | "racecraft" | "awareness" | "pace";

export default function DriversPage() {
	const [search, setSearch] = useState("");
	const [sortBy, setSortBy] = useState<SortKey>("overall");

	const drivers = getAllDrivers();
	const latestStats = drivers.map((driver) => {
		const history = getDriverHistory(driver);
		return history.history[history.history.length - 1];
	});

	const filteredAndSortedStats = latestStats
		.filter((stat) =>
			stat.stats.name.toLowerCase().includes(search.toLowerCase())
		)
		.sort((a, b) => b.stats[sortBy] - a.stats[sortBy]);

	return (
		<div className="container mx-auto max-w-7xl py-8 px-4 md:px-0">
			<div className="flex flex-col space-y-8">
				<div className="flex flex-col space-y-4">
					<h1 className="text-4xl font-bold">F1 Drivers</h1>
					<p className="text-muted-foreground">
						View and compare all Formula 1 drivers&apos; ratings
						across different game versions.
					</p>
				</div>

				<Card className="p-6">
					<div className="grid gap-4 md:grid-cols-[200px_1fr]">
						<div className="flex flex-col space-y-4">
							<div className="space-y-2">
								<h3 className="font-medium">Search</h3>
								<Input
									placeholder="Search drivers..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<h3 className="font-medium">Sort by</h3>
								<Select
									value={sortBy}
									onValueChange={(value) =>
										setSortBy(value as SortKey)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Sort by" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="overall">
											Overall Rating
										</SelectItem>
										<SelectItem value="experience">
											Experience
										</SelectItem>
										<SelectItem value="racecraft">
											Racecraft
										</SelectItem>
										<SelectItem value="awareness">
											Awareness
										</SelectItem>
										<SelectItem value="pace">
											Pace
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{filteredAndSortedStats.map(
								({ stats, gameName, version }) => (
									<Card
										key={stats.name}
										className="p-6 transition-colors hover:bg-muted/50"
									>
										<a
											href={`/drivers/${encodeURIComponent(
												stats.name
											)}`}
										>
											<div className="flex flex-col space-y-4">
												<div className="space-y-2">
													<h3 className="text-xl font-semibold">
														{stats.name}
													</h3>
													<p className="text-sm text-muted-foreground">
														Latest from {gameName} (
														{version})
													</p>
												</div>
												<div className="space-y-2">
													<div className="flex justify-between">
														<span>Overall</span>
														<span className="font-semibold">
															{stats.overall}
														</span>
													</div>
													<div className="flex justify-between">
														<span>Experience</span>
														<span>
															{stats.experience}
														</span>
													</div>
													<div className="flex justify-between">
														<span>Racecraft</span>
														<span>
															{stats.racecraft}
														</span>
													</div>
													<div className="flex justify-between">
														<span>Awareness</span>
														<span>
															{stats.awareness}
														</span>
													</div>
													<div className="flex justify-between">
														<span>Pace</span>
														<span>
															{stats.pace}
														</span>
													</div>
												</div>
											</div>
										</a>
									</Card>
								)
							)}
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}
