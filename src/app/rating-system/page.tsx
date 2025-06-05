import { Card } from "@/components/ui/card";

export default function RatingSystemPage() {
	return (
		<div className="container mx-auto max-w-7xl px-4 py-12">
			<h1 className="text-4xl font-bold mb-8">
				F1 Game Driver Rating System
			</h1>

			<p className="text-lg mb-8">
				The F1 game series uses a comprehensive rating system to
				evaluate drivers across multiple attributes. Each attribute is
				scored on a scale of 0-99, contributing to a driver&apos;s
				overall rating.
			</p>

			<div className="grid gap-6 md:grid-cols-2">
				<Card className="p-6">
					<h2 className="text-2xl font-semibold mb-4">
						Overall Rating
					</h2>
					<p className="text-muted-foreground">
						The overall rating is a weighted average of all other
						attributes, representing a driver&apos;s complete
						ability. This is the primary metric used for quick
						comparisons between drivers.
					</p>
				</Card>

				<Card className="p-6">
					<h2 className="text-2xl font-semibold mb-4">Experience</h2>
					<p className="text-muted-foreground">
						Reflects a driver&apos;s time in F1 and their
						accumulated knowledge. Higher experience ratings
						indicate better race management and strategic
						decision-making capabilities.
					</p>
				</Card>

				<Card className="p-6">
					<h2 className="text-2xl font-semibold mb-4">Racecraft</h2>
					<p className="text-muted-foreground">
						Measures a driver&apos;s ability to race wheel-to-wheel,
						overtake, and defend positions. This rating impacts how
						well AI drivers perform in close racing situations.
					</p>
				</Card>

				<Card className="p-6">
					<h2 className="text-2xl font-semibold mb-4">Awareness</h2>
					<p className="text-muted-foreground">
						Represents spatial awareness and ability to avoid
						incidents. Drivers with high awareness ratings are less
						likely to be involved in collisions and make better
						decisions in traffic.
					</p>
				</Card>

				<Card className="p-6">
					<h2 className="text-2xl font-semibold mb-4">Pace</h2>
					<p className="text-muted-foreground">
						Indicates raw speed and qualifying performance. This
						rating affects a driver&apos;s ability to extract
						maximum performance from the car in both qualifying and
						race conditions.
					</p>
				</Card>
			</div>

			<div className="mt-12">
				<h2 className="text-2xl font-bold mb-6">Rating Updates</h2>
				<p className="text-lg text-muted-foreground mb-4">
					Driver ratings are updated throughout the F1 season to
					reflect real-world performance. Major updates typically
					coincide with game patches and can include:
				</p>
				<ul className="list-disc list-inside space-y-2 text-muted-foreground">
					<li>
						Performance adjustments based on recent race results
					</li>
					<li>
						Modifications reflecting significant career milestones
					</li>
					<li>
						Changes due to exceptional performances or poor form
					</li>
					<li>Updates for rookie drivers as they gain experience</li>
				</ul>
			</div>

			<div className="mt-12">
				<h2 className="text-2xl font-bold mb-6">Open Source Data</h2>
				<p className="text-lg text-muted-foreground">
					All driver ratings data used on this site is open source and
					can be found in our GitHub repository. This allows for
					community verification and contribution to ensure accuracy
					and transparency in our rating tracking system.
				</p>
			</div>
		</div>
	);
}
