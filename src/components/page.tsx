import type React from "react";
import { cn } from "@/lib/utils";

// Page layout primitives, matching Pitwall's so the F1 sites read as one family.

export function Page({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<main
			className={cn(
				"mx-auto w-full max-w-7xl space-y-10 px-4 py-6 sm:space-y-12 sm:px-6 sm:py-8 lg:px-10",
				className
			)}
		>
			{children}
		</main>
	);
}

export function PageHeader({
	eyebrow,
	title,
	children,
	actions,
}: {
	eyebrow?: React.ReactNode;
	title: React.ReactNode;
	children?: React.ReactNode;
	actions?: React.ReactNode;
}) {
	return (
		<header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
			<div className="min-w-0 space-y-1.5">
				{eyebrow && (
					<div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
						{eyebrow}
					</div>
				)}
				<h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
					{title}
				</h1>
				{children && (
					<div className="text-muted-foreground max-w-3xl text-sm">
						{children}
					</div>
				)}
			</div>
			{actions && (
				<div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
			)}
		</header>
	);
}

export function Section({
	title,
	description,
	children,
	className,
	action,
}: {
	title: React.ReactNode;
	description?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
	action?: React.ReactNode;
}) {
	return (
		<section className={cn("min-w-0 space-y-4", className)}>
			<div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
				<div className="min-w-0 space-y-0.5">
					<h2 className="text-lg leading-7 font-semibold sm:text-xl sm:leading-8">
						{title}
					</h2>
					{description && (
						<p className="text-muted-foreground max-w-3xl text-sm">
							{description}
						</p>
					)}
				</div>
				{action && <div className="ml-auto">{action}</div>}
			</div>
			{children}
		</section>
	);
}

/** A table inside a card surface, as Pitwall's standings and results. */
export function TableCard({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"bg-card text-card-foreground overflow-hidden rounded-xl border shadow-sm [&_th]:text-muted-foreground [&_th]:text-xs [&_th]:font-normal [&_td:first-child]:pl-4 [&_td:last-child]:pr-4 [&_th:first-child]:pl-4 [&_th:last-child]:pr-4",
				className
			)}
		>
			{children}
		</div>
	);
}

const podium: Record<number, string> = {
	1: "bg-gold/25 text-foreground",
	2: "bg-silver/30 text-foreground",
	3: "bg-bronze/25 text-foreground",
};

/** Position number; the top three get podium colours. */
export function RankPill({ rank }: { rank: number }) {
	return (
		<span
			className={cn(
				"inline-flex size-6 items-center justify-center rounded-md text-xs font-medium tabular-nums",
				podium[rank] ?? "text-muted-foreground"
			)}
		>
			{rank}
		</span>
	);
}

export function StatCard({
	label,
	value,
	className,
}: {
	label: string;
	value: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"bg-card text-card-foreground flex flex-col gap-1 rounded-xl border p-4 shadow-sm",
				className
			)}
		>
			<p className="text-muted-foreground text-sm">{label}</p>
			<p className="truncate text-xl font-semibold tabular-nums sm:text-2xl">
				{value}
			</p>
		</div>
	);
}
