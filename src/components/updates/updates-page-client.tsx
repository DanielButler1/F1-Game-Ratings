"use client";

import { getPatchUpdateEntries } from "@/lib/rankings";
import PatchUpdateCard from "@/components/updates/patch-update-card";
import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";

type SortKey = "overall" | "experience" | "racecraft" | "awareness" | "pace";
type SortDirection = "asc" | "desc" | null;

const sortKeys = [
	"overall",
	"experience",
	"racecraft",
	"awareness",
	"pace",
] as const satisfies readonly SortKey[];

const sortSearchParams = {
	patch: parseAsString,
	sort: parseAsStringLiteral(sortKeys),
	dir: parseAsStringLiteral(["asc", "desc"] as const),
};

const updates = [...getPatchUpdateEntries()].reverse();

type SortState = {
	key: SortKey | null;
	direction: SortDirection;
};

function getNextSortState(current: SortState, nextKey: SortKey): SortState {
	if (current.key !== nextKey || !current.direction) {
		return { key: nextKey, direction: "desc" };
	}

	if (current.direction === "desc") {
		return { key: nextKey, direction: "asc" };
	}

	return { key: null, direction: null };
}

export default function UpdatesPageClient() {
	const [query, setQuery] = useQueryStates(sortSearchParams);

	const activeSortState: SortState = {
		key: query.sort ? (query.sort as SortKey) : null,
		direction: query.dir,
	};

	const handleSortClick = (patchHref: string, stat: SortKey) => {
		const currentState =
			query.patch === patchHref
				? activeSortState
				: { key: null, direction: null };
		const next = getNextSortState(currentState, stat);

		if (!next.key || !next.direction) {
			void setQuery(null);
			return;
		}

		void setQuery({
			patch: patchHref,
			sort: next.key,
			dir: next.direction,
		});
	};

	return (
		<div className="container mx-auto max-w-7xl py-8 px-4 md:px-0">
			<div className="flex flex-col space-y-8">
				<div className="flex flex-col space-y-4">
					<h1 className="text-4xl font-bold">Updates</h1>
					<p className="text-muted-foreground text-lg max-w-3xl">
						A changelog of every ratings update, ordered from
						newest to oldest. Each patch shows how every rating
						moved compared with the previous release.
					</p>
				</div>

				<div className="space-y-6">
					{updates.map((patch) => (
						<PatchUpdateCard
							key={`${patch.gameName}-${patch.version}`}
							patch={patch}
							sortKey={query.patch === patch.href ? activeSortState.key : null}
							sortDirection={
								query.patch === patch.href ? activeSortState.direction : null
							}
							onSortClick={(stat) => handleSortClick(patch.href, stat)}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
