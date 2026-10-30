import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import { ImageResponse } from "next/og";

import { getLatestGameAndVersion, getVersionLabel, type Driver } from "@/lib/rankings";

/**
 * The picture shown when a page is shared (WhatsApp, Discord, iMessage, X) or in some search
 * results: the logo, what the page is, and the drivers or ratings it covers. Each page folder has
 * an opengraph-image.tsx that calls this, and the build writes them out as PNGs. Build time only.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Resolved like an import, so it works however node_modules is laid out.
const resolve = createRequire(path.join(process.cwd(), "package.json")).resolve;
const font = (weight: 500 | 600 | 700) => ({
	name: "Montserrat",
	weight,
	style: "normal" as const,
	data: fs.readFileSync(resolve(`@fontsource/montserrat/files/montserrat-latin-${weight}-normal.woff`)),
});
const fonts = [font(500), font(600), font(700)];

const F1_RED = "#e10600";

// The site's stat colours (games/[game]/[patch]) and podium colours (globals.css) as hex, which the renderer needs.
const STATS = [
	{ key: "overall", label: "OVR", colour: F1_RED },
	{ key: "experience", label: "EXP", colour: "#10b981" },
	{ key: "racecraft", label: "RAC", colour: "#3b82f6" },
	{ key: "awareness", label: "AWA", colour: "#f59e0b" },
	{ key: "pace", label: "PAC", colour: "#8b5cf6" },
] as const;
const PODIUM = ["#d4a531", "#a1a6b0", "#b4733f"];

/** A release, e.g. "F1 25 · Update 3", for captions. "(DLC)" is dropped so it fits on one line. */
export function releaseLabel(gameName: string, version: string): string {
	return `${gameName.replace(/\s*\(DLC\)$/, "")} · ${getVersionLabel(gameName, version)}`;
}

export function latestReleaseLabel(): string {
	const { gameName, version } = getLatestGameAndVersion();
	return releaseLabel(gameName, version);
}

export function ogImage({
	section,
	title,
	detail,
	stats,
	podium,
	caption,
}: {
	/** What kind of page this is, e.g. "Driver". */
	section?: string;
	title: string;
	detail?: string;
	/** One driver's ratings to show along the bottom. */
	stats?: Driver;
	/** The top three drivers to show along the bottom instead. */
	podium?: Driver[];
	/** A note at the end of the bottom row, e.g. which release the ratings are from. */
	caption?: string;
}) {
	const titleSize = title.length > 46 ? 58 : title.length > 28 ? 68 : 80;
	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					padding: "60px 72px",
					background: "#ffffff",
					color: "#09090b",
					fontFamily: "Montserrat",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: 18 }}>
					<span
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							width: 72,
							height: 52,
							borderRadius: 8,
							background: F1_RED,
							color: "#ffffff",
							fontSize: 30,
							fontWeight: 700,
						}}
					>
						F1
					</span>
					<div style={{ display: "flex", flexDirection: "column" }}>
						<span style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.04em" }}>Driver Ratings</span>
						<span style={{ fontSize: 19, fontWeight: 500, color: "#71717a", marginTop: 2 }}>A Phaseo project</span>
					</div>
					<span style={{ marginLeft: "auto", fontSize: 24, fontWeight: 600, color: "#52525b" }}>f1ratings.phaseo.app</span>
				</div>

				<div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
					{section && <span style={{ fontSize: 28, fontWeight: 600, color: F1_RED, letterSpacing: "-0.02em" }}>{section}</span>}
					<span style={{ fontSize: titleSize, fontWeight: 700, letterSpacing: "-0.055em", lineHeight: 1.04, marginTop: 14, maxWidth: 1000 }}>{title}</span>
					{detail && <span style={{ fontSize: 28, fontWeight: 500, color: "#52525b", lineHeight: 1.35, marginTop: 22, maxWidth: 960 }}>{detail}</span>}
				</div>

				<div style={{ display: "flex", alignItems: "center", marginTop: 44, paddingTop: 28, borderTop: "2px solid #e4e4e7" }}>
					<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
						{podium
							? podium.map((driver, i) => (
									<div key={driver.name} style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 18 }}>
										<span
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												width: 48,
												height: 48,
												borderRadius: 12,
												background: PODIUM[i],
												color: "#ffffff",
												fontSize: 24,
												fontWeight: 700,
											}}
										>
											{driver.overall}
										</span>
										<span style={{ fontSize: 24, fontWeight: 600 }}>{driver.name.split(" ").at(-1)}</span>
									</div>
								))
							: STATS.map(({ key, label, colour }) => (
									<div key={key} style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 14 }}>
										<span
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												minWidth: 72,
												height: 48,
												padding: "0 10px",
												borderRadius: 12,
												background: colour,
												color: "#ffffff",
												fontSize: 20,
												fontWeight: 700,
												letterSpacing: "0.02em",
											}}
										>
											{label}
										</span>
										{stats && <span style={{ fontSize: 26, fontWeight: 600 }}>{stats[key]}</span>}
									</div>
								))}
					</div>
					{caption && <span style={{ marginLeft: "auto", fontSize: 22, fontWeight: 500, color: "#71717a" }}>{caption}</span>}
				</div>
			</div>
		),
		{ ...OG_SIZE, fonts },
	);
}
