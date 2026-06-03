"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { PatchUpdateEntry } from "@/lib/rankings";
import { cn } from "@/lib/utils";

type StatKey = "overall" | "experience" | "racecraft" | "awareness" | "pace";
type SortDirection = "asc" | "desc" | null;

const statKeys: StatKey[] = [
	"overall",
	"experience",
	"racecraft",
	"awareness",
	"pace",
];

function formatStatLabel(stat: StatKey) {
	return stat[0].toUpperCase().concat(stat.slice(1));
}

function formatDelta(delta: number | null) {
	if (delta === null) {
		return (
			<span className="text-muted-foreground inline-flex min-w-[5ch] justify-center font-mono tabular-nums">
				-
			</span>
		);
	}

	if (delta === 0) {
		return (
			<span className="text-muted-foreground inline-flex min-w-[5ch] justify-center font-mono tabular-nums">
				{"\u00b10"}
			</span>
		);
	}

	return (
		<span
			className={cn(
				"inline-flex min-w-[5ch] justify-center font-mono tabular-nums",
				delta > 0 ? "text-green-500" : "text-red-500"
			)}
		>
			({delta > 0 ? "+" : ""}
			{delta})
		</span>
	);
}

function getSortIcon(direction: SortDirection) {
	if (direction === "asc") {
		return <ChevronUp className="h-3.5 w-3.5" />;
	}

	if (direction === "desc") {
		return <ChevronDown className="h-3.5 w-3.5" />;
	}

	return null;
}

export default function PatchUpdateCard({
	patch,
	sortKey,
	sortDirection,
	onSortClick,
}: {
	patch: PatchUpdateEntry;
	sortKey: StatKey | null;
	sortDirection: SortDirection;
	onSortClick: (stat: StatKey) => void;
}) {
	const sortedDrivers = sortKey
		? [...patch.drivers].sort((a, b) => {
				const aValue = a.current[sortKey];
				const bValue = b.current[sortKey];
				const primary =
					sortDirection === "asc" ? aValue - bValue : bValue - aValue;

				if (primary !== 0) {
					return primary;
				}

				return a.name.localeCompare(b.name);
		  })
		: patch.drivers;

	return (
		<Card className="overflow-hidden">
			<div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-start sm:justify-between">
				<div className="space-y-1">
					<p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
						{patch.gameName}
					</p>
					<h2 className="text-2xl font-semibold">{patch.versionLabel}</h2>
					<p className="text-sm text-muted-foreground">
						{patch.drivers.length} driver
						{patch.drivers.length === 1 ? "" : "s"}, compared against the
						previous patch.
					</p>
				</div>

				<Button asChild variant="outline" className="sm:self-center">
					<Link href={patch.href}>
						View Patch
						<ChevronRight className="ml-2 h-4 w-4" />
					</Link>
				</Button>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="pl-6 text-left">Driver</TableHead>
						{statKeys.map((stat) => (
							<TableHead key={stat} className="px-4 text-center">
								<button
									type="button"
									onClick={() => onSortClick(stat)}
									className="flex w-full items-center justify-center gap-1.5 font-medium hover:text-foreground"
									aria-label={`Sort by ${formatStatLabel(stat)}`}
								>
									<span>{formatStatLabel(stat)}</span>
									<span
										className={cn(
											"text-muted-foreground transition-opacity",
											sortKey === stat && sortDirection
												? "opacity-100"
												: "opacity-0"
										)}
									>
										{getSortIcon(sortDirection)}
									</span>
								</button>
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{sortedDrivers.map(({ name, current, changes }) => (
						<TableRow key={name}>
							<TableCell className="pl-6 font-medium">{name}</TableCell>
							{statKeys.map((stat) => {
								const value = current[stat];
								const delta = changes?.[stat] ?? null;

								return (
									<TableCell
										key={`${name}-${stat}`}
										className={cn(
											"px-4 text-center font-mono tabular-nums",
											sortKey === stat && "bg-muted/60"
										)}
									>
										<div className="flex items-center justify-center gap-2">
											<span className="inline-flex min-w-[3ch] justify-center font-mono tabular-nums">
												{value}
											</span>
											{formatDelta(delta)}
										</div>
									</TableCell>
								);
							})}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Card>
	);
}
