import type { Metadata } from "next";

export const siteName = "F1 Driver Ratings Tracker";
export const siteDescription =
	"Track and visualise Formula One game driver ratings from F1 2020 through the F1 26 Season Pack.";

export function getSiteUrl(): string {
	return process.env.WEBSITE_URL || "http://localhost:3000";
}

export function getMetadataBase(): URL {
	return new URL(getSiteUrl());
}

/**
 * A page's title and description, also used for its link preview (Open Graph and X's card).
 * Next doesn't copy a page's title into og:title, and a page's openGraph replaces the layout's
 * whole, so every page builds all three here. The preview image is the folder's opengraph-image.tsx.
 */
export function createPageMetadata(
	title: string,
	description: string
): Metadata {
	const fullTitle = `${title} | ${siteName}`;
	return {
		title: fullTitle,
		description,
		openGraph: {
			siteName,
			locale: "en_GB",
			type: "website",
			url: "./",
			title: fullTitle,
			description,
		},
		twitter: { card: "summary_large_image", title: fullTitle, description },
	};
}
