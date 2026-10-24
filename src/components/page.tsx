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
