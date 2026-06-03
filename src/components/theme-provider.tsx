"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeProviderProps = {
	children: React.ReactNode;
	attribute?: "class" | `data-${string}`;
	defaultTheme?: Theme;
	enableSystem?: boolean;
	disableTransitionOnChange?: boolean;
	storageKey?: string;
};

type ThemeContextValue = {
	theme: Theme;
	resolvedTheme: ResolvedTheme;
	systemTheme: ResolvedTheme;
	setTheme: (theme: Theme | ((theme: Theme) => Theme)) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
	if (typeof window === "undefined") {
		return "light";
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function readStoredTheme(storageKey: string, defaultTheme: Theme): Theme {
	if (typeof window === "undefined") {
		return defaultTheme;
	}

	try {
		const stored = window.localStorage.getItem(storageKey);
		if (stored === "light" || stored === "dark" || stored === "system") {
			return stored;
		}
	} catch {
		// Ignore storage errors and fall back to the default theme.
	}

	return defaultTheme;
}

function applyThemeToDocument(
	theme: ResolvedTheme,
	attribute: ThemeProviderProps["attribute"],
	disableTransitionOnChange: boolean | undefined
) {
	const root = document.documentElement;

	if (disableTransitionOnChange) {
		const style = document.createElement("style");
		style.appendChild(
			document.createTextNode(
				"*{transition:none !important;animation:none !important;}"
			)
		);
		document.head.appendChild(style);

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				style.remove();
			});
		});
	}

	if (attribute === "class") {
		root.classList.toggle("dark", theme === "dark");
		return;
	}

	const attributeName = attribute ?? "data-theme";
	root.setAttribute(attributeName, theme);
}

export function ThemeProvider({
	children,
	attribute = "class",
	defaultTheme = "system",
	enableSystem = true,
	disableTransitionOnChange = false,
	storageKey = "theme",
}: ThemeProviderProps) {
	const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
	const [systemTheme, setSystemTheme] = React.useState<ResolvedTheme>("light");
	const mountedRef = React.useRef(false);

	const resolvedTheme: ResolvedTheme =
		theme === "system" && enableSystem
			? systemTheme
			: theme === "dark"
				? "dark"
				: "light";

	const setTheme = React.useCallback(
		(nextTheme: Theme | ((theme: Theme) => Theme)) => {
			setThemeState((currentTheme) => {
				const resolvedNext =
					typeof nextTheme === "function"
						? nextTheme(currentTheme)
						: nextTheme;

				try {
					window.localStorage.setItem(storageKey, resolvedNext);
				} catch {
					// Ignore storage errors.
				}

				return resolvedNext;
			});
		},
		[storageKey]
	);

	React.useLayoutEffect(() => {
		const initialTheme = readStoredTheme(storageKey, defaultTheme);
		const initialSystemTheme = getSystemTheme();
		mountedRef.current = true;

		setThemeState(initialTheme);
		setSystemTheme(initialSystemTheme);
		applyThemeToDocument(
			initialTheme === "system" && enableSystem
				? initialSystemTheme
				: initialTheme === "dark"
					? "dark"
					: "light",
			attribute,
			disableTransitionOnChange
		);
	}, [attribute, defaultTheme, disableTransitionOnChange, enableSystem, storageKey]);

	React.useEffect(() => {
		if (!mountedRef.current) {
			return;
		}

		applyThemeToDocument(resolvedTheme, attribute, disableTransitionOnChange);
	}, [attribute, disableTransitionOnChange, resolvedTheme]);

	React.useEffect(() => {
		if (!enableSystem || theme !== "system") {
			return;
		}

		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = () => setSystemTheme(getSystemTheme());

		if (media.addEventListener) {
			media.addEventListener("change", handleChange);
		} else {
			media.addListener(handleChange);
		}

		handleChange();

		return () => {
			if (media.removeEventListener) {
				media.removeEventListener("change", handleChange);
			} else {
				media.removeListener(handleChange);
			}
		};
	}, [enableSystem, theme]);

	const contextValue = React.useMemo(
		() => ({ theme, resolvedTheme, systemTheme, setTheme }),
		[resolvedTheme, setTheme, systemTheme, theme]
	);

	return (
		<ThemeContext.Provider value={contextValue}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = React.useContext(ThemeContext);

	if (!context) {
		throw new Error("useTheme must be used within ThemeProvider");
	}

	return context;
}
