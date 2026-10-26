import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { RankPill } from "@/components/page";
import type { Driver, DriverHistory } from "@/lib/rankings";

const stats = [
	["experience", "EXP"],
	["racecraft", "RAC"],
	["awareness", "AWA"],
	["pace", "PAC"],
] as const;

function ShowcaseCard({
	href,
	title,
	body,
	cta,
	children,
}: {
	href: string;
	title: string;
	body: string;
	cta: string;
	children: ReactNode;
}) {
	return (
		<Link
			href={href}
			className="group bg-card focus-visible:ring-ring/30 min-w-0 overflow-hidden rounded-[1.75rem] border transition-colors hover:border-zinc-300 focus-visible:ring-2 focus-visible:outline-none dark:hover:border-zinc-700"
		>
			<div className="flex h-48 items-center justify-center border-b px-6 py-4">
				<div className="w-full max-w-[15rem]">{children}</div>
			</div>
			<div className="space-y-4 px-6 py-5 text-left">
				<div className="space-y-2">
					<h3 className="text-[1.05rem] font-semibold tracking-[-0.03em]">
						{title}
					</h3>
					<p className="text-muted-foreground text-sm leading-6">{body}</p>
				</div>
				<span className="text-muted-foreground group-hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors">
					{cta}
					<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
				</span>
			</div>
		</Link>
	);
}

function PodiumVisual({ drivers }: { drivers: Driver[] }) {
	return (
		<div className="space-y-1.5">
			{drivers.map((driver, i) => (
				<div
					key={driver.name}
					className="bg-background flex items-center gap-2.5 rounded-xl border px-2.5 py-2 text-xs"
				>
					<RankPill rank={i + 1} />
					<span className="flex-1 truncate font-medium">{driver.name}</span>
					<span className="font-semibold tabular-nums">{driver.overall}</span>
				</div>
			))}
		</div>
	);
}

function ProfileVisual({ driver }: { driver: Driver }) {
	return (
		<div className="space-y-3">
			<div className="flex items-baseline justify-between text-xs">
				<span className="font-semibold">{driver.name}</span>
				<span className="text-muted-foreground tabular-nums">
					OVR <span className="text-foreground font-semibold">{driver.overall}</span>
				</span>
			</div>
			{stats.map(([key, short]) => (
				<div key={key} className="flex items-center gap-2 text-[11px]">
					<span className="text-muted-foreground w-7">{short}</span>
					<div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
						<div
							className="bg-foreground/80 h-full rounded-full"
							style={{ width: `${(driver[key] / 99) * 100}%` }}
						/>
					</div>
					<span className="w-5 text-right font-medium tabular-nums">
						{driver[key]}
					</span>
				</div>
			))}
		</div>
	);
}

function HeadToHeadVisual({ a, b }: { a: Driver; b: Driver }) {
	const surname = (name: string) => name.split(" ").at(-1);
	return (
		<div className="space-y-2.5 text-[11px]">
			<div className="flex justify-between font-semibold">
				<span>{surname(a.name)}</span>
				<span className="text-muted-foreground">{surname(b.name)}</span>
			</div>
			{stats.map(([key, short]) => (
				<div key={key} className="grid grid-cols-[1fr_2rem_1fr] items-center gap-2">
					<div className="bg-muted flex h-1.5 justify-end overflow-hidden rounded-full">
						<div
							className="h-full rounded-full bg-[#e10600] dark:bg-[#cc0500]"
							style={{ width: `${(a[key] / 99) * 100}%` }}
						/>
					</div>
					<span className="text-muted-foreground text-center">{short}</span>
					<div className="bg-muted h-1.5 overflow-hidden rounded-full">
						<div
							className="bg-foreground/40 h-full rounded-full"
							style={{ width: `${(b[key] / 99) * 100}%` }}
						/>
					</div>
				</div>
			))}
		</div>
	);
}

function HistoryVisual({ history }: { history: DriverHistory }) {
	const values = history.history.map((h) => h.stats.overall);
	const min = Math.min(...values) - 2;
	const max = Math.max(...values) + 2;
	const points = values
		.map((v, i) => {
			const x = values.length > 1 ? (i / (values.length - 1)) * 236 + 2 : 120;
			const y = 78 - ((v - min) / (max - min)) * 72;
			return `${x.toFixed(1)},${y.toFixed(1)}`;
		})
		.join(" ");
	const [lastX, lastY] = points.split(" ").at(-1)!.split(",");
	return (
		<div className="space-y-2">
			<div className="flex items-baseline justify-between text-xs">
				<span className="font-semibold">{history.name}</span>
				<span className="text-muted-foreground tabular-nums">
					{values[0]} → {values.at(-1)}
				</span>
			</div>
			<svg viewBox="0 0 240 82" className="h-24 w-full overflow-visible" aria-hidden="true">
				<polyline
					points={points}
					fill="none"
					className="stroke-foreground/70"
					strokeWidth="2"
					strokeLinejoin="round"
					strokeLinecap="round"
				/>
				<circle cx={lastX} cy={lastY} r="3.5" className="fill-[#e10600]" />
			</svg>
			<p className="text-muted-foreground text-[11px]">
				{history.history.length} ratings updates
			</p>
		</div>
	);
}

export default function Showcase({
	drivers,
	latestHref,
	leaderHistory,
	driverHref,
}: {
	drivers: Driver[];
	latestHref: string;
	leaderHistory: DriverHistory;
	driverHref: string;
}) {
	const [leader, second] = drivers;
	return (
		<div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
			<ShowcaseCard
				href={latestHref}
				title="Ratings for every update"
				body="Each game's launch ratings and every update after, ranked side by side."
				cta="Latest ratings"
			>
				<PodiumVisual drivers={drivers.slice(0, 3)} />
			</ShowcaseCard>
			<ShowcaseCard
				href={driverHref}
				title="Driver profiles"
				body="Experience, racecraft, awareness and pace for every driver in the series."
				cta="Explore drivers"
			>
				<ProfileVisual driver={leader} />
			</ShowcaseCard>
			<ShowcaseCard
				href={`/compare?drivers=${encodeURIComponent(leader.name)},${encodeURIComponent(second.name)}`}
				title="Head-to-head"
				body="Put up to eight drivers next to each other and see where they differ."
				cta="Compare drivers"
			>
				<HeadToHeadVisual a={leader} b={second} />
			</ShowcaseCard>
			<ShowcaseCard
				href={`/timeline?driver=${encodeURIComponent(leaderHistory.name)}`}
				title="Rating history"
				body="Follow how a driver's rating has moved from F1 2020 to today."
				cta="Open the timeline"
			>
				<HistoryVisual history={leaderHistory} />
			</ShowcaseCard>
		</div>
	);
}
