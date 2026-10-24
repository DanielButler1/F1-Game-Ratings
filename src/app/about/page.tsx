import { Card } from "@/components/ui/card";

export default function AboutPage() {
	return (
		<Page>
			<PageHeader title="About">
				Learn about how F1 game driver ratings work and what each stat means.
			</PageHeader>

			<div className="grid gap-6">
				<Card className="p-6">
					<div className="space-y-4">
						<h2 className="text-2xl font-semibold">
							Understanding Driver Ratings
						</h2>
						<p className="text-muted-foreground">
							Driver ratings in F1 games are composed of five
							key attributes that represent different aspects
							of a driver&apos;s capabilities. These ratings
							are updated throughout the game&apos;s lifecycle
							to reflect real-world performance and
							developments.
						</p>
					</div>
				</Card>

				<div className="grid gap-6 md:grid-cols-2">
					<Card className="p-6">
						<div className="space-y-4">
							<h3 className="text-xl font-semibold">
								Overall Rating
							</h3>
							<p className="text-muted-foreground">
								The Overall Rating is a weighted average of
								all other attributes, representing a
								driver&apos;s general skill level and
								competitiveness. This is the primary number
								used for quick comparisons between drivers.
							</p>
						</div>
					</Card>

					<Card className="p-6">
						<div className="space-y-4">
							<h3 className="text-xl font-semibold">
								Experience
							</h3>
							<p className="text-muted-foreground">
								Experience reflects a driver&apos;s time in
								Formula 1 and their accumulated knowledge.
								More experienced drivers tend to make fewer
								mistakes and handle pressure better in race
								situations.
							</p>
						</div>
					</Card>

					<Card className="p-6">
						<div className="space-y-4">
							<h3 className="text-xl font-semibold">
								Racecraft
							</h3>
							<p className="text-muted-foreground">
								Racecraft measures a driver&apos;s ability
								to race wheel-to-wheel, overtake, and defend
								their position. High racecraft ratings
								indicate strong racing abilities and
								tactical awareness during battles.
							</p>
						</div>
					</Card>

					<Card className="p-6">
						<div className="space-y-4">
							<h3 className="text-xl font-semibold">
								Awareness
							</h3>
							<p className="text-muted-foreground">
								Awareness represents a driver&apos;s spatial
								awareness and ability to avoid incidents.
								Drivers with high awareness ratings are less
								likely to be involved in accidents or make
								contact with other cars.
							</p>
						</div>
					</Card>

					<Card className="p-6">
						<div className="space-y-4">
							<h3 className="text-xl font-semibold">Pace</h3>
							<p className="text-muted-foreground">
								Pace reflects a driver&apos;s raw speed and
								ability to deliver fast lap times
								consistently. This rating considers
								qualifying performance and race pace across
								different conditions.
							</p>
						</div>
					</Card>
				</div>

				<Card className="p-6">
					<div className="space-y-4">
						<h2 className="text-2xl font-semibold">
							Rating Updates
						</h2>
						<p className="text-muted-foreground">
							Driver ratings are updated throughout each F1
							game&apos;s lifecycle:
						</p>
						<ul className="list-disc list-inside space-y-2 text-muted-foreground">
							<li>
								Base Game (B) - Initial ratings when the
								game launches
							</li>
							<li>
								Updates (1,2,3...) - Periodic updates
								reflecting real-world performance
							</li>
							<li>
								Ratings can increase or decrease based on
								recent race results, qualifying performance,
								and overall championship standing
							</li>
						</ul>
					</div>
				</Card>

				<Card className="p-6">
					<div className="space-y-4">
						<h2 className="text-2xl font-semibold">
							About This Project
						</h2>
						<p className="text-muted-foreground">
							This website tracks and visualises driver rating
							changes across different F1 game versions,
							helping players and fans understand how official
							driver ratings have evolved over time. The data
							is sourced directly from the official F1 games
							and updated whenever new patches are released.
						</p>
					</div>
				</Card>
			</div>
		</Page>
	);
}
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { Page, PageHeader } from "@/components/page";

export const metadata: Metadata = createPageMetadata(
	"About",
	"Learn what this F1 driver ratings tracker is, where the data comes from, and how it is maintained."
);
