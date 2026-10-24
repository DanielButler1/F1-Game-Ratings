"use client";

import Link from "next/link";
import { useQueryStates, parseAsString, parseAsStringLiteral } from "nuqs";
import {
	getAllDrivers,
	getDriverHistory,
	getDriverRouteSegment,
	getVersionLabel,
} from "@/lib/rankings";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Page, PageHeader, RankPill, TableCard } from "@/components/page";

type SortKey = "overall" | "experience" | "racecraft" | "awareness" | "pace";

const sortKeys = [
	"overall",
	"experience",
	"racecraft",
	"awareness",
	"pace",
] as const satisfies readonly SortKey[];

const statLabels: Record<SortKey, string> = {
	overall: "Overall",
	experience: "Experience",
	racecraft: "Racecraft",
	awareness: "Awareness",
	pace: "Pace",
};

const driversSearchParams = {
	search: parseAsString.withDefault(""),
	sort: parseAsStringLiteral(sortKeys).withDefault("overall"),
};

export default function DriversPageClient() {
	const [query, setQuery] = useQueryStates(driversSearchParams, {
		history: "replace",
	});
	const drivers = getAllDrivers();
	const latestStats = drivers.map((driver) => {
		const history = getDriverHistory(driver);
		return history.history[history.history.length - 1];
	});

	const filteredAndSortedStats = latestStats
		.filter((stat) =>
			stat.stats.name.toLowerCase().includes(query.search.toLowerCase())
		)
		.sort((a, b) => b.stats[query.sort] - a.stats[query.sort]);

	return (
		<Page>
			<PageHeader title="Drivers" eyebrow={`${drivers.length} drivers rated`}>
				View and compare all Formula 1 drivers&apos; ratings across different game versions.
			</PageHeader>

			<div className="flex flex-wrap items-center gap-x-4 gap-y-3">
				<div className="relative w-full sm:w-96">
					<Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
					<Input
						placeholder="Search drivers"
						value={query.search}
						onChange={(e) => setQuery({ search: e.target.value })}
						className="pl-9"
					/>
				</div>
				<p className="text-muted-foreground ml-auto text-sm">
					{filteredAndSortedStats.length} shown
				</p>
			</div>

			<TableCard>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-10">#</TableHead>
							<TableHead>Driver</TableHead>
							<TableHead className="hidden md:table-cell">Latest rating</TableHead>
							{sortKeys.map((key) => (
								<TableHead key={key} className="text-right">
									<button
										type="button"
										onClick={() => setQuery({ sort: key })}
										aria-label={`Sort by ${statLabels[key]}`}
										className={cn(
											"hover:text-foreground inline-flex items-center gap-1 transition-colors",
											query.sort === key && "text-foreground"
										)}
									>
										<span className="sm:hidden">{statLabels[key].slice(0, 3)}</span>
										<span className="hidden sm:inline">{statLabels[key]}</span>
										{query.sort === key && <ChevronDown className="size-3.5" />}
									</button>
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredAndSortedStats.map(({ stats, gameName, version }, i) => (
							<TableRow key={stats.name}>
								<TableCell>
									<RankPill rank={i + 1} />
								</TableCell>
								<TableCell>
									<Link
										href={`/drivers/${getDriverRouteSegment(stats.name)}`}
										className="font-medium underline-offset-4 hover:underline"
									>
										{stats.name}
									</Link>
								</TableCell>
								<TableCell className="text-muted-foreground hidden md:table-cell">
									{gameName} · {getVersionLabel(gameName, version, "Base")}
								</TableCell>
								{sortKeys.map((key) => (
									<TableCell
										key={key}
										className={cn(
											"text-right tabular-nums",
											query.sort === key ? "font-semibold" : "text-muted-foreground"
										)}
									>
										{stats[key]}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableCard>
		</Page>
	);
}
