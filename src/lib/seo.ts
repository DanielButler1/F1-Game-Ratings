import type { Metadata } from "next";

export const siteName = "F1 Driver Ratings Tracker";
export const siteDescription =
	"Track and visualise Formula One game driver ratings from F1 2020 through F1 25.";

export function getSiteUrl(): string {
	return process.env.WEBSITE_URL || "http://localhost:3000";
}

export function getMetadataBase(): URL {
	return new URL(getSiteUrl());
}

export function createPageMetadata(
	title: string,
	description: string
): Metadata {
	return {
		title: `${title} | ${siteName}`,
		description,
	};
}
