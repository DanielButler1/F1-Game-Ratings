import rankingsData from '@/data/rankings.json';

export type Driver = {
    name: string;
    overall: number;
    experience: number;
    racecraft: number;
    awareness: number;
    pace: number;
}

export type GameVersion = {
    gameName: string;
    versions: string[];
}

export type DriverHistory = {
    name: string;
    history: {
        gameName: string;
        version: string;
        stats: Driver;
    }[];
}

// Helper function to split the game key into name and version
function splitGameKey(key: string): { gameName: string; version: string } {
    const match = key.match(/^(.*?)\s*\((.*?)\)$/);
    if (!match) {
        throw new Error(`Invalid game key format: ${key}`);
    }
    return {
        gameName: match[1].trim(),
        version: match[2].trim()
    };
}

// Get driver rankings for a specific game and version
export function getDriverRankings(gameName: string, version: string): Driver[] {
    if (!gameName || !version) {
        throw new Error('Game name and version are required');
    }

    const key = `${gameName} (${version})`;
    const drivers = rankingsData[key as keyof typeof rankingsData] as Driver[] | undefined;

    if (!drivers) {
        throw new Error(`No data found for game: ${gameName} version: ${version}`);
    }

    return drivers;
}

// Get all unique game names (without versions)
export function getGameNames(): string[] {
    try {
        const gameSet = new Set<string>();
        Object.keys(rankingsData).forEach(key => {
            const { gameName } = splitGameKey(key);
            gameSet.add(gameName);
        });
        return Array.from(gameSet).sort();
    } catch {
        throw new Error('Failed to get game names');
    }
}

// Get all versions for a specific game
export function getGameVersions(gameName: string): string[] {
    if (!gameName) {
        throw new Error('Game name is required');
    }

    const versions = Object.keys(rankingsData)
        .filter(key => {
            const { gameName: name } = splitGameKey(key);
            return name === gameName;
        })
        .map(key => splitGameKey(key).version)
        .sort((a, b) => {
            // Sort versions with "B" (Base) first, then numerically
            if (a === "B") return -1;
            if (b === "B") return 1;
            return parseInt(a) - parseInt(b);
        });

    if (versions.length === 0) {
        throw new Error(`No versions found for game: ${gameName}`);
    }

    return versions;

}

// Get all available games with their versions
export function getAllGames(): GameVersion[] {
    try {
        const games = getGameNames();
        return games.map(gameName => ({
            gameName,
            versions: getGameVersions(gameName)
        }));
    } catch {
        throw new Error('Failed to get games data');
    }
}

// Get the latest game and its latest version
export function getLatestGameAndVersion(): { gameName: string; version: string } {
    const games = getAllGames();
    const latestGame = games[games.length - 1];
    const latestVersion = latestGame.versions[latestGame.versions.length - 1];

    return {
        gameName: latestGame.gameName,
        version: latestVersion
    };
}

// Get all unique driver names across all versions
export function getAllDrivers(): string[] {
    const driverSet = new Set<string>();
    Object.values(rankingsData).forEach((drivers: Driver[]) => {
        drivers.forEach(driver => driverSet.add(driver.name));
    });
    return Array.from(driverSet).sort();
}

// Get a driver's rating history across all games
export function getDriverHistory(driverName: string): DriverHistory {
    const history: DriverHistory = {
        name: driverName,
        history: []
    };

    Object.keys(rankingsData).forEach(key => {
        const { gameName, version } = splitGameKey(key);
        const drivers = rankingsData[key as keyof typeof rankingsData] as Driver[];
        const driverStats = drivers.find(d => d.name === driverName);

        if (driverStats) {
            history.history.push({
                gameName,
                version,
                stats: driverStats
            });
        }
    });

    return history;
}

// Calculate the average rating for each stat
export function calculateAverageRatings(drivers: Driver[]): Driver {
    return {
        name: 'Average',
        overall: Math.round(drivers.reduce((sum, d) => sum + d.overall, 0) / drivers.length),
        experience: Math.round(drivers.reduce((sum, d) => sum + d.experience, 0) / drivers.length),
        racecraft: Math.round(drivers.reduce((sum, d) => sum + d.racecraft, 0) / drivers.length),
        awareness: Math.round(drivers.reduce((sum, d) => sum + d.awareness, 0) / drivers.length),
        pace: Math.round(drivers.reduce((sum, d) => sum + d.pace, 0) / drivers.length)
    };
}

// Get rating changes between two versions for a driver
export function getDriverRatingChanges(
    driverName: string,
    fromGame: string,
    fromVersion: string,
    toGame: string,
    toVersion: string
): { from: Driver; to: Driver; changes: Partial<Driver> } | null {
    const fromDrivers = getDriverRankings(fromGame, fromVersion);
    const toDrivers = getDriverRankings(toGame, toVersion);

    const fromStats = fromDrivers.find(d => d.name === driverName);
    const toStats = toDrivers.find(d => d.name === driverName);

    if (!fromStats || !toStats) return null;

    return {
        from: fromStats,
        to: toStats,
        changes: {
            overall: toStats.overall - fromStats.overall,
            experience: toStats.experience - fromStats.experience,
            racecraft: toStats.racecraft - fromStats.racecraft,
            awareness: toStats.awareness - fromStats.awareness,
            pace: toStats.pace - fromStats.pace
        }
    };
}