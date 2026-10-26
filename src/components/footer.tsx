import Link from "next/link";
import { Coffee, Github } from "lucide-react";
import { Logo } from "@/components/header";

const footerLinks = [
	{
		title: "Explore",
		links: [
			{ href: "/drivers", label: "Drivers" },
			{ href: "/teams", label: "Teams" },
			{ href: "/games", label: "Games" },
			{ href: "/compare", label: "Compare" },
			{ href: "/timeline", label: "Timeline" },
			{ href: "/updates", label: "Updates" },
		],
	},
	{
		title: "Resources",
		links: [
			{ href: "/about", label: "About" },
			{ href: "/rating-system", label: "Rating System" },
			{ href: "/faq", label: "FAQ" },
		],
	},
];

export default function Footer() {
	return (
		<footer className="mt-16 border-t">
			<div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
				<div className="grid grid-cols-2 gap-8 md:grid-cols-4">
					<div className="col-span-2 space-y-3">
						<Link href="/" className="inline-flex" aria-label="F1 Driver Ratings home">
							<Logo />
						</Link>
						<p className="text-muted-foreground max-w-md text-sm">
							Track and visualise Formula One game driver ratings
							from F1 2020 through the F1 26 Season Pack. Compare
							drivers, teams, and see how ratings have evolved
							over time.
						</p>
					</div>

					{footerLinks.map((group) => (
						<div key={group.title} className="space-y-3">
							<h3 className="text-sm font-medium">{group.title}</h3>
							<ul className="space-y-2 text-sm">
								{group.links.map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											className="text-muted-foreground hover:text-foreground transition-colors"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="text-muted-foreground mt-10 flex flex-col gap-4 border-t pt-6 text-xs md:flex-row md:items-center md:justify-between">
					<div className="flex flex-wrap items-center gap-x-3 gap-y-2">
						<p>
							&copy; {new Date().getFullYear()} F1 Driver Ratings
							by{" "}
							<Link
								href="https://portfolio.phaseo.app"
								className="underline underline-offset-4 hover:text-foreground"
							>
								Phaseo
							</Link>
							. Data sourced from official F1® game releases.
						</p>
						<Link
							href="https://coff.ee/phaseo"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-foreground transition-colors"
							aria-label="Buy me a coffee"
							title="Buy Me A Coffee"
						>
							<Coffee className="size-4" />
						</Link>
						<Link
							href="https://github.com/DanielButler1/F1-Game-Ratings"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-foreground transition-colors"
							aria-label="GitHub"
							title="View the Source Code"
						>
							<Github className="size-4" />
						</Link>
					</div>
					<p>Not affiliated with Formula 1, EA Sports, or Codemasters.</p>
				</div>
			</div>
		</footer>
	);
}
