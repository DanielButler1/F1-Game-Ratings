import Link from "next/link";
import { Coffee, Github } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Footer() {
	return (
		<footer className="border-t bg-background mb-8">
			<div className="container mx-auto max-w-7xl px-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8 md:py-12">
					<div className="md:col-span-2">
						<Link href="/" className="flex items-center gap-2 mb-4">
							<div className="bg-[#e10600] dark:bg-[#cc0500] text-white font-bold text-xl px-2 py-1 rounded">
								F1
							</div>
							<span className="font-bold text-lg">
								Driver Ratings
							</span>
						</Link>
						<p className="text-sm text-muted-foreground max-w-md">
							Track and visualise Formula One game driver ratings
							from F1 2020 through F1 25. Compare drivers, teams,
							and see how ratings have evolved over time.
						</p>
					</div>

					<div>
						<h3 className="font-semibold mb-4">Navigation</h3>
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
						</ul>
					</div>

					<div>
						<h3 className="font-semibold mb-4">Resources</h3>
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

				<div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
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
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Link
										href="https://coff.ee/phaseo"
										target="_blank"
										rel="noopener noreferrer"
										className="ml-2 hover:text-yellow-600"
										aria-label="Buy me a coffee"
									>
										<Coffee size={20} />
									</Link>
								</TooltipTrigger>
								<TooltipContent>Buy Me A Coffee</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Link
										href="https://github.com"
										target="_blank"
										rel="noopener noreferrer"
										className="ml-2 hover:text-foreground"
										aria-label="GitHub"
									>
										<Github size={20} />
									</Link>
								</TooltipTrigger>
								<TooltipContent>
									View the Source Code
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
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
