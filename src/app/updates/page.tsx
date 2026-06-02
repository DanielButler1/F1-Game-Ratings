import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getPatchUpdateEntries } from "@/lib/rankings";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

function formatDelta(delta: number | null) {
	if (delta === null) {
		return (
			<span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
				Base
			</span>
		);
	}

	return (
		<span
			className={
				delta > 0
					? "text-green-500"
					: delta < 0
					? "text-red-500"
					: "text-muted-foreground"
			}
		>
			({delta > 0 ? "+" : ""}
			{delta})
		</span>
	);
}

export default function UpdatesPage() {
	const updates = getPatchUpdateEntries().reverse();

	return (
		<div className="container mx-auto max-w-7xl py-8 px-4 md:px-0">
			<div className="flex flex-col space-y-8">
				<div className="flex flex-col space-y-4">
					<h1 className="text-4xl font-bold">Updates</h1>
					<p className="text-muted-foreground text-lg max-w-3xl">
						A changelog of every ratings update, ordered from
						newest to oldest. Each patch shows how the overall
						ratings moved compared with the previous release.
					</p>
				</div>

				<div className="space-y-6">
					{updates.map((patch) => (
						<Card key={`${patch.gameName}-${patch.version}`} className="overflow-hidden">
							<div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-start sm:justify-between">
								<div className="space-y-1">
									<p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
										{patch.gameName}
									</p>
									<h2 className="text-2xl font-semibold">
										{patch.versionLabel}
									</h2>
									<p className="text-sm text-muted-foreground">
										{patch.drivers.length} driver
										{patch.drivers.length === 1
											? ""
											: "s"}
										, compared against the previous
										patch.
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
										<TableHead className="pl-6">
											Driver
										</TableHead>
										<TableHead className="pr-6">
											Overall
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{patch.drivers.map(({ name, current, changes }) => (
										<TableRow key={name}>
											<TableCell className="pl-6 font-medium">
												<Link
													href={`/drivers/${encodeURIComponent(
														name
													)}`}
													className="hover:text-primary"
												>
													{name}
												</Link>
											</TableCell>
											<TableCell className="pr-6">
												<div className="flex items-center gap-2 font-mono tabular-nums">
													<span>{current.overall}</span>
													{formatDelta(
														changes?.overall ?? null
													)}
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
