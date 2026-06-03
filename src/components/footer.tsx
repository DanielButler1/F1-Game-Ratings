import Link from "next/link";
import { Coffee, Github } from "lucide-react";

export default function Footer() {
	return (
		<footer className="border-t bg-background mb-8">
			<div className="container mx-auto max-w-7xl px-4">
				<div className="grid grid-cols-1 gap-8 py-8 md:grid-cols-4 md:py-12">
					<div className="md:col-span-2">
						<Link href="/" className="mb-4 flex items-center gap-2">
							<div className="rounded bg-[#e10600] px-2 py-1 text-xl font-bold text-white dark:bg-[#cc0500]">
								F1
							</div>
							<span className="text-lg font-bold">
								Driver Ratings
							</span>
						</Link>
						<p className="max-w-md text-sm text-muted-foreground">
							Track and visualise Formula One game driver ratings
							from F1 2020 through F1 25. Compare drivers, teams,
							and see how ratings have evolved over time.
						</p>
					</div>

					<div>
						<h3 className="mb-4 font-semibold">Navigation</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/drivers"
									className="text-muted-foreground hover:text-foreground"
								>
									Drivers
								</Link>
							</li>
							<li>
								<Link
									href="/teams"
									className="text-muted-foreground hover:text-foreground"
								>
									Teams
								</Link>
							</li>
							<li>
								<Link
									href="/games"
									className="text-muted-foreground hover:text-foreground"
								>
									Games
								</Link>
							</li>
							<li>
								<Link
									href="/compare"
									className="text-muted-foreground hover:text-foreground"
								>
									Compare
								</Link>
							</li>
							<li>
								<Link
									href="/timeline"
									className="text-muted-foreground hover:text-foreground"
								>
									Timeline
								</Link>
							</li>
							<li>
								<Link
									href="/updates"
									className="text-muted-foreground hover:text-foreground"
								>
									Updates
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="mb-4 font-semibold">Resources</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/about"
									className="text-muted-foreground hover:text-foreground"
								>
									About
								</Link>
							</li>
							<li>
								<Link
									href="/rating-system"
									className="text-muted-foreground hover:text-foreground"
								>
									Rating System
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="text-muted-foreground hover:text-foreground"
								>
									FAQ
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
					<div className="flex items-center gap-2">
						<p className="text-sm text-muted-foreground">
							&copy; {new Date().getFullYear()} F1 Driver Ratings
							By{" "}
							<Link
								href="https://portfolio.phaseo.app"
								className="text-muted-foreground hover:text-foreground"
							>
								Phaseo
							</Link>
							. Data sourced from official F1® game releases.
						</p>
						<Link
							href="https://coff.ee/phaseo"
							target="_blank"
							rel="noopener noreferrer"
							className="ml-2 hover:text-yellow-600"
							aria-label="Buy me a coffee"
							title="Buy Me A Coffee"
						>
							<Coffee size={20} />
						</Link>
						<Link
							href="https://github.com/DanielButler1/F1-Game-Ratings"
							target="_blank"
							rel="noopener noreferrer"
							className="ml-2 hover:text-foreground"
							aria-label="GitHub"
							title="View the Source Code"
						>
							<Github size={20} />
						</Link>
					</div>
					<p className="text-sm text-muted-foreground">
						Not affiliated with Formula 1, EA Sports, or
						Codemasters.
					</p>
				</div>
			</div>
		</footer>
	);
}
