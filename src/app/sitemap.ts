import { MetadataRoute } from "next";
import { getAllGames, getAllDrivers } from "@/lib/rankings";

// Define the type for a sitemap item explicitly
// (MetadataRoute.SitemapItem is the correct type for Next.js 13+)

export const revalidate = 604800; // regenerate once per week (in seconds)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.WEBSITE_URL || "https://f1ratings.phaseo.app";

    // Static routes
    const staticRoutes = [
        "/",
        "/about",
        "/compare",
        "/drivers",
        "/faq",
        "/games",
        "/rating-system",
        "/teams",
        "/timeline",
    ];

    // Create static route items
    const staticItems = staticRoutes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changefreq: route === "/" ? "daily" : "weekly",
        priority: route === "/" ? 1.0 : 0.8,
    }));

    // Dynamic driver pages
    const driverNames = getAllDrivers();
    const driverItems = driverNames.map((name) => ({
        url: `${baseUrl}/drivers/${encodeURIComponent(name)}`,
        lastModified: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.7,
    }));

    // Dynamic game/patch pages
    const games = getAllGames();
    const gamePatchItems = games.flatMap((game) =>
        game.versions.map((patch) => ({
            url: `${baseUrl}/games/${encodeURIComponent(game.gameName)}/${encodeURIComponent(
                patch
            )}`,
            lastModified: new Date().toISOString(),
            changefreq: "weekly",
            priority: 0.7,
        }))
    );

    return [...staticItems, ...driverItems, ...gamePatchItems];
}
